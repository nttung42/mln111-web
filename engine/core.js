/* ═══════════════════════════════════════════════════════════════════
   LÕI — renderer, vòng lặp, và việc chuyển phòng.

   Mỗi phòng trong /rooms tự đăng ký qua TX.dangKyPhong() và chỉ cần
   điền vào bốn hàm: build, update, onEnter, dispose.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

(function (TX) {
  'use strict';

  TX.phongs = {};
  TX.thuTuPhong = [];

  TX.dangKyPhong = function (def) {
    TX.phongs[def.id] = def;
    TX.thuTuPhong.push(def.id);
  };

  var scene, camera, renderer, player;
  var phongHienTai = null;   // định nghĩa phòng
  var nhomHienTai = null;    // THREE.Group của phòng
  var ctx = null;            // ngữ cảnh truyền cho phòng
  var prev = 0, clock = 0;
  var daXong = {};           // id phòng -> true

  /* ═══════════════ khởi tạo ═══════════════ */

  TX.khoiTao = function () {
    TX.hud.init();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(TX.MAU.nen);
    scene.fog = new THREE.FogExp2(TX.MAU.nen, 0.032);   // sương ngọc trai, mỏng — để thấy xa

    camera = new THREE.PerspectiveCamera(66, innerWidth / innerHeight, 0.1, 120);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('stage').appendChild(renderer.domElement);

    player = new TX.Player(renderer.domElement);
    player.onModeChange = capNhatGoiY;
    TX.player = player;      // để gỡ lỗi từ console

    addEventListener('resize', function () {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    /* Tab mở sổ tay */
    addEventListener('keydown', function (e) {
      if (e.code !== 'Tab') return;
      e.preventDefault();
      if (TX.hud.theDangMo()) return;
      var mo = !TX.hud.soTayDangMo();
      TX.hud.moSoTay(mo);
      player.enabled = !mo && !!phongHienTai;
      if (mo) player.release();
    });

    /* Nút góc phải: về sảnh từ bất kỳ phòng nào, hỏi xác nhận như Esc. */
    var nutVeSanh = document.getElementById('veSanh');
    nutVeSanh.innerHTML = '← ' + TX.VI.game.veSanh + '<kbd>ESC</kbd>';
    nutVeSanh.addEventListener('click', function () { hoiRoiPhong(); nutVeSanh.blur(); });

    /* Nút tròn góc phải trên cùng: tắt/bật âm thanh. Phím M làm tương tự,
       vì lúc khoá con trỏ không bấm được nút. */
    var nutTieng = document.getElementById('tatTieng');
    function veNutTieng() {
      var t = TX.audio.dangTat();
      nutTieng.classList.toggle('tat', t);
      nutTieng.setAttribute('aria-label', t ? 'Bật âm thanh' : 'Tắt âm thanh');
      nutTieng.title = (t ? 'Bật âm thanh' : 'Tắt âm thanh') + ' (M)';
    }
    function doiTieng() { TX.audio.tatTieng(!TX.audio.dangTat()); veNutTieng(); }
    nutTieng.addEventListener('click', function () { doiTieng(); nutTieng.blur(); });
    addEventListener('keydown', function (e) {
      if (e.code !== 'KeyM' || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      var dich = e.target;
      if (dich && (dich.tagName === 'INPUT' || dich.tagName === 'TEXTAREA' || dich.isContentEditable)) return;
      doiTieng();
    });
    veNutTieng();

    /* Esc trong phòng: hỏi có muốn về sảnh không.
       Khi đang khoá con trỏ, trình duyệt dùng Esc để nhả khoá và thường
       không gửi keydown — nên bắt cả sự kiện mất khoá. Mất khoá do chính
       game nhả (mở thẻ, sổ tay, về sảnh) thì lúc đó thẻ/sổ tay đã mở
       hoặc đã ở sảnh, hoiRoiPhong tự bỏ qua. */
    addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || e.repeat) return;
      if (TX.hud.theDangMo() && dangHoiRoi && performance.now() - lucHoi > 300) {
        TX.hud.dongThe();               // Esc lần nữa = ở lại
        return;
      }
      hoiRoiPhong();
    });
    document.addEventListener('pointerlockchange', function () {
      if (!document.pointerLockElement) { lucNhaKhoa = performance.now(); hoiRoiPhong(); }
    });

    TX.hud.veSoTay(TX.soTay.danhSach());
    TX.moSanh();
    prev = performance.now();
    requestAnimationFrame(vongLap);
  };

  /* ═══════════════ gợi ý thao tác theo chế độ điều khiển ═══════════════ */

  function capNhatGoiY() {
    if (!phongHienTai) return;
    var d = TX.VI.game.dieuKhien;
    var mo = phongHienTai.goiY || {};
    TX.hud.goiY(player.lockBroken
      ? (mo.duPhong || d.duPhong)
      : (mo.khoa || d.khoa));
  }

  /* ═══════════════ sảnh ═══════════════ */

  var dangHoiRoi = false, lucHoi = 0, lucNhaKhoa = 0;

  function hoiRoiPhong() {
    if (!phongHienTai || phongHienTai === TX.sanh) return;
    if (TX.hud.theDangMo() || TX.hud.soTayDangMo()) return;
    if (ctx && ctx.khoaCamera) return;  // đang chiếu cảnh phim thì thôi
    var L = TX.VI.game.roiPhong;
    dangHoiRoi = true;
    lucHoi = performance.now();
    TX.hud.hoi(
      '<div class="eyebrow">' + (ctx.text.ten || phongHienTai.tieuDe || '') + '</div>' +
      '<h1>' + L.tieuDe + '</h1>' +
      '<p>' + L.than + '</p>',
      TX.VI.game.veSanh, L.o,
      function () { dangHoiRoi = false; TX.moSanh(); },
      function () {
        dangHoiRoi = false;
        /* Chrome từ chối khoá lại ngay sau khi người chơi vừa nhấn Esc
           (và lỗi đó sẽ chuyển game sang chế độ kéo chuột vĩnh viễn) —
           nên chỉ tự khoá lại khi đã qua chừng một giây; không thì
           người chơi bấm vào cảnh để khoá như bình thường. */
        if (!phongHienTai.chuotTuDo && performance.now() - lucNhaKhoa > 1200) player.grab();
      }
    );
  }


  var daGioiThieu = false;

  TX.moSanh = function () {
    napKhongGian(TX.sanh, 'sanh');

    TX.hud.nhanPhong(TX.VI.game.phu, TX.VI.sanh.tieuDe);
    TX.hud.hienPanel(false);

    /* Lời giới thiệu chỉ hiện đúng một lần, lần đầu vào game. */
    if (!daGioiThieu) {
      daGioiThieu = true;
      var S = TX.VI.sanh;
      TX.hud.the(
        '<div class="eyebrow">' + TX.VI.game.phu + '</div>' +
        '<h1>' + S.tieuDe + '</h1>' +
        '<p>' + S.dan + '</p>' +
        '<p>' + S.dan2 + '</p>' +
        bangPhim() +
        '<p class="note">' + S.ghiChu + '</p>',
        S.batDau,
        batDau
      );
    } else {
      batDau();
    }
  };

  /* ═══════════════ chuyển phòng ═══════════════ */

  function xoaPhong() {
    if (phongHienTai && phongHienTai.dispose) {
      try { phongHienTai.dispose(ctx); } catch (e) { console.warn(e); }
    }
    if (nhomHienTai) {
      scene.remove(nhomHienTai);
      TX.don(nhomHienTai);
    }
    phongHienTai = null;
    nhomHienTai = null;
    ctx = null;
  }

  /* Nạp một không gian bất kỳ — sảnh hay phòng đều đi qua đây. */
  function napKhongGian(def, id) {
    xoaPhong();

    nhomHienTai = new THREE.Group();
    scene.add(nhomHienTai);

    /* sương và nền về mặc định — phòng nào đổi không khí thì tự đặt lại */
    scene.fog.color.setHex(TX.MAU.nen);
    scene.fog.density = 0.032;
    scene.background.setHex(TX.MAU.nen);

    /* trả người chơi về mặc định phòng phẳng; không gian tự đặt lại nếu cần */
    player.bounds = TX.KICH_THUOC.w / 2 - 0.5;
    player.blockers = [];
    player.groundAt = null;
    player.constrain = null;
    player.onClick = null;
    player.chuotTuDo = !!def.chuotTuDo;
    player.spawn(0, 5.6);
    document.getElementById('veSanh').classList.toggle('on', def !== TX.sanh);
    TX.audio.nhacNen(def === TX.sanh ? 'sanh' : 'phong');

    TX.hud.ngamTat(!!def.chuotTuDo);
    TX.hud.anChuGiai();
    TX.hud.phim(false);
    if (def.chuotTuDo && document.pointerLockElement) document.exitPointerLock();

    ctx = {
      THREE: THREE,
      scene: nhomHienTai,
      camera: camera,
      player: player,
      dom: renderer.domElement,
      hud: TX.hud,
      audio: TX.audio,
      soTay: TX.soTay,
      text: TX.VI[id] || {},
      /* sương và màu nền của cảnh, cho phòng muốn có không khí riêng */
      moiTruong: { suong: scene.fog, nen: scene.background },
      /* danh sách phòng, để sảnh dựng cửa */
      danhSachPhong: TX.thuTuPhong.map(function (rid) {
        var p = TX.phongs[rid];
        return { id: rid, tieuDe: p.tieuDe, nhanNgan: p.nhanNgan, moTa: p.moTa, mauCua: p.mauCua, xong: !!daXong[rid] };
      }),
      /* phòng gọi khi đã dạy xong khái niệm của nó */
      hoanThanh: function () { daXong[id] = true; },
      vaoPhong: function (rid) { TX.vaoPhong(rid); },
      veSanh: function () { TX.moSanh(); }
    };

    phongHienTai = def;
    def.build(ctx);
    player.batDatDat();
    return ctx;
  }

  TX.vaoPhong = function (id) {
    var def = TX.phongs[id];
    if (!def) { console.error('Không có phòng:', id); return; }

    TX.phongVua = id;        // để sảnh biết đặt người chơi cạnh cửa nào khi quay ra
    napKhongGian(def, id);

    TX.hud.nhanPhong(ctx.text.tang || '', ctx.text.ten || def.tieuDe);
    capNhatGoiY();

    /* Thẻ mở đầu: đọc xong mới bắt đầu chơi */
    var m = ctx.text.moDau;
    if (m) {
      TX.hud.the(
        '<div class="eyebrow">' + (ctx.text.chuong || '') + '</div>' +
        '<h1>' + m.tieuDe + '</h1>' +
        '<p>' + m.than + '</p>' +
        bangPhim(),
        TX.VI.game.vaoPhong,
        batDau
      );
    } else {
      batDau();
    }
  };

  function batDau() {
    player.enabled = true;
    if (!phongHienTai.chuotTuDo) player.grab();
    capNhatGoiY();
    if (phongHienTai && phongHienTai.onEnter) phongHienTai.onEnter(ctx);
  }

  function bangPhim() {
    var tacDong = player.lockBroken
      ? '<span><kbd>F</kbd>tác động</span><span><kbd>R</kbd>tác động ngược</span>' +
        '<span><kbd>Kéo chuột</kbd>nhìn quanh</span>'
      : '<span><kbd>Chuột trái</kbd>tác động</span><span><kbd>Chuột phải</kbd>tác động ngược</span>' +
        '<span><kbd>Chuột</kbd>nhìn quanh</span>';
    return '<div class="keys"><span><kbd>W A S D</kbd>di chuyển</span>' + tacDong +
           '<span><kbd>Tab</kbd>sổ tay</span>' +
           (phongHienTai && phongHienTai !== TX.sanh ? '<span><kbd>Esc</kbd>rời phòng</span>' : '') +
           '</div>';
  }

  /* ═══════════════ vòng lặp ═══════════════ */

  function vongLap() {
    requestAnimationFrame(vongLap);

    var now = performance.now();
    var dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    clock += dt;
    TX.uTime.value = clock;

    /* đang đọc thẻ hoặc mở sổ tay thì người chơi đứng yên */
    player.enabled = !TX.hud.theDangMo() && !TX.hud.soTayDangMo() && !!phongHienTai;

    player.update(dt);

    if (phongHienTai && phongHienTai.update) {
      ctx.dt = dt;
      ctx.clock = clock;
      phongHienTai.update(dt, ctx);
    }

    TX.hud.capNhatFx(dt);

    /* Phòng có thể mượn quyền điều khiển camera cho một đoạn tự bay,
       bằng cách đặt ctx.khoaCamera = true. */
    if (!(ctx && ctx.khoaCamera)) player.applyTo(camera, TX.hud.rung());

    renderer.render(scene, camera);
  }

})(window.TX);
