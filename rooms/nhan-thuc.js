/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — LÝ LUẬN NHẬN THỨC
   (Giáo trình, Chương 2, mục 2.3 — theo "Bản thiết kế Phòng 3")

   Khác mọi phòng khác: không phải hộp 15 × 15 mà là một hành lang dài
   đi một chiều, chia bốn trạm bằng ba vách có cửa vòm. Cửa sau chỉ mở
   khi trạm trước đã xong. Không khí đổi theo từng trạm, từ tối ra sáng:

     I   LỊCH SỬ        tím u ám, sương dày. Ba đạo cụ, cả ba là BẪY:
                        đèn duy tâm, rương "vật tự nó", gương siêu hình.
     II  XƯỞNG THỰC TIỄN cam công nghiệp. Kéo cần gạt → xưởng chạy, sương
                        tan, bốn vai trò của thực tiễn sáng lần lượt — và
                        chiếc rương ở trạm I bật mở.
     III CON ĐƯỜNG      xanh cyber. Tầng dưới: mắt, tai, tay cảm nhận quả
                        táo (cảm tính). Bệ nhảy lên tầng trên: bộ não ghép
                        khái niệm → phán đoán → suy luận (lý tính). Nhảy
                        lên tư duy khi chưa có dữ liệu thì khối rỗng — BẪY
                        giáo điều.
     IV  CHÂN LÝ        trắng bạch kim. Kiểm nghiệm ba mệnh đề bằng luồng
                        sáng thực tiễn; cái sai vỡ, cái đúng nhập vào viên
                        kim cương. Nhặt kim cương, cổng ra mở.

   Mỗi trạm còn một tấm bia: đứng cạnh, ấn E để đọc nội dung lý thuyết.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var A = TX.anim;

  /* --- hành lang --- */
  var X_TUONG = 6, Z_DAU = 22, CAO = 6;
  var VACH = [11, 0, -11];          // ba vách ngăn giữa bốn trạm
  var CUA_X = 1.8, CUA_CAO = 3.6;   // nửa bề rộng và chiều cao lỗ cửa vòm
  var DAY = 0.35;                   // nửa bề dày vách, tính cả khoảng chừa
  var TAM_Z = [16.5, 5.5, -5.5, -16.5];

  /* --- tốc độ --- */
  var TOC_DEN = 0.5, TOC_RUONG = 0.32, TRAN_RUONG = 0.92, TOC_GUONG = 0.45;
  var TU_NGUOI = 0.04;
  var TOC_GIAC = 0.45, TOC_LY = 0.2, TOC_RONG = 0.6;
  var TOC_KIEM = 0.4, TOC_NHAT = 0.9;

  /* --- trạm III: bệ hai tầng, bệ nhảy, bộ não --- */
  var BE = { x: 4.5, zTruoc: -7.0, zSau: -11, cao: 1.6 };
  var BAT = { x: 0, z: -6.1 };
  var NAO = { x: 0, z: -9.3 };
  var TAO = { x: 0, z: -4.0 };

  /* --- không khí từng trạm, theo bảng màu trong tài liệu thiết kế --- */
  var KHI = [
    { nen: 0x1a0033, suong: 0.08 },   // tím u ám, sương dày
    { nen: 0x2a1406, suong: 0.05 },   // cam công nghiệp — tan dần khi xưởng chạy
    { nen: 0x03082a, suong: 0.04 },   // xanh cyber
    { nen: 0xfff8dc, suong: 0.022 }   // bạch kim
  ];

  var S, o, el, ctxRef;

  /* ═══════════ tiện ích dựng hình ═══════════ */

  function texQuang() {
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var g = c.getContext('2d');
    var q = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    q.addColorStop(0, 'rgba(255,255,255,1)');
    q.addColorStop(0.25, 'rgba(255,255,255,.55)');
    q.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = q;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  /* quầng sáng giả cho hiệu ứng bloom — cộng sáng trên nền tối,
     hoà trộn thường trên nền trắng (cộng sáng trên trắng sẽ biến mất) */
  function quang(mau, co, doMo, thuong) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: o.tQuang, color: mau, transparent: true, opacity: doMo, depthWrite: false,
      blending: thuong ? THREE.NormalBlending : THREE.AdditiveBlending
    }));
    s.scale.setScalar(co);
    return s;
  }

  function boTron(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }

  /* Biển chữ vẽ bằng canvas. dong: [{t, co, mau, dam, serif, nghieng, gian}].
     Trả về mesh có hàm userData.viet(dongMoi) để vẽ lại chữ. */
  function bang(dong, rong, cao, opts) {
    opts = opts || {};
    var W = 1024, H = Math.max(64, Math.round(W * cao / rong));
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    /* canvas chạy bằng CPU: biển chữ có thể được vẽ lại nhiều lần, đẩy lên
       texture không phải chờ GPU trả dữ liệu về */
    var g = c.getContext('2d', { willReadFrequently: true });
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;

    function viet(ds) {
      g.clearRect(0, 0, W, H);
      if (opts.nen) {
        g.fillStyle = opts.nen;
        boTron(g, 6, 6, W - 12, H - 12, 28);
        g.fill();
        if (opts.vien) { g.strokeStyle = opts.vien; g.lineWidth = 5; g.stroke(); }
      }
      g.textAlign = 'center';
      g.textBaseline = 'middle';

      /* Co chữ cho vừa khung. Dòng nào tràn ngang thì thu nhỏ riêng dòng đó
         (tính cả khoảng cách chữ — maxWidth của canvas bỏ qua phần này nên
         chữ ở mép từng bị xén); cả khối tràn dọc thì thu nhỏ cả khối. */
      var rongMax = W - 80;
      var dong = ds.map(function (d) {
        var gian = d.gian || 0;
        g.font = kieuChu(d, d.co);
        try { g.letterSpacing = '0px'; } catch (e) {}
        var rong = g.measureText(d.t).width + gian * d.t.length;
        var k = rong > rongMax ? rongMax / rong : 1;
        return { d: d, co: d.co * k, gian: gian * k };
      });
      var tong = 0;
      dong.forEach(function (l) { tong += l.co * 1.32; });
      var kc = Math.min(1, (H - 20) / tong);
      var y = H / 2 - tong * kc / 2;
      dong.forEach(function (l) {
        var co = l.co * kc;
        y += co * 0.66;
        g.font = kieuChu(l.d, co);
        try { g.letterSpacing = (l.gian * kc) + 'px'; } catch (e) {}
        g.fillStyle = l.d.mau || '#ffffff';
        g.fillText(l.d.t, W / 2, y);
        y += co * 0.66;
      });
      try { g.letterSpacing = '0px'; } catch (e) {}
      tex.needsUpdate = true;
    }
    viet(dong);

    var m = new THREE.Mesh(
      new THREE.PlaneGeometry(rong, cao),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide })
    );
    m.userData.viet = viet;
    return m;
  }

  function kieuChu(d, co) {
    return (d.nghieng ? 'italic ' : '') + (d.dam || 600) + ' ' + Math.round(co) + 'px ' +
           (d.serif ? TX.FONT_FANTASY : '"Be Vietnam Pro", "Segoe UI", sans-serif');
  }

  /* Khối chữ tự xuống dòng: chiều cao canvas tính theo nội dung, nên không
     bao giờ bị cắt. dong: [{t, co, mau, dam, serif, nghieng, gian, sau}]
     (sau: khoảng trống thêm bên dưới, px). Trả về { mesh, cao (m) }. */
  function khoiChu(dong, rong, opts) {
    opts = opts || {};
    var W = 1024, LE = 40, rongMax = W - LE * 2;
    var do_ = document.createElement('canvas').getContext('2d');
    var hang = [];
    dong.forEach(function (d) {
      do_.font = kieuChu(d, d.co);
      var gian = d.gian || 0, cur = '';
      d.t.split(' ').forEach(function (tu) {
        var thu = cur ? cur + ' ' + tu : tu;
        if (cur && do_.measureText(thu).width + gian * thu.length > rongMax) { hang.push({ d: d, t: cur, sau: 0 }); cur = tu; }
        else cur = thu;
      });
      if (cur) hang.push({ d: d, t: cur, sau: 0 });
      hang[hang.length - 1].sau = d.sau || 0;
    });
    var H = LE;
    hang.forEach(function (h) { H += h.d.co * 1.34 + h.sau; });
    H = Math.ceil(H + LE * 0.6);
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d');
    g.textBaseline = 'middle';
    var y = LE * 0.8;
    hang.forEach(function (h) {
      var d = h.d;
      y += d.co * 0.67;
      g.font = kieuChu(d, d.co);
      try { g.letterSpacing = (d.gian || 0) + 'px'; } catch (e) {}
      g.fillStyle = d.mau || '#ffffff';
      g.textAlign = opts.giua ? 'center' : 'left';
      g.fillText(h.t, opts.giua ? W / 2 : LE, y);
      y += d.co * 0.67 + h.sau;
    });
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    var cao = rong * H / W;
    var m = new THREE.Mesh(new THREE.PlaneGeometry(rong, cao),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, fog: false }));
    return { mesh: m, cao: cao };
  }

  /* biển tên cho một đạo cụ: dòng lớn + dòng nghiêng */
  function bienVat(g, T, x, y, z, mau, mau2) {
    var b = bang([
      { t: T.ten, co: 66, mau: mau, dam: 700, gian: 6 },
      { t: T.mo, co: 44, mau: mau2, serif: true, nghieng: true, dam: 500 }
    ], 2.2, 0.62);
    b.position.set(x, y, z);
    g.add(b);
    return b;
  }

  function mat(mau, opts) {
    var m = new THREE.MeshStandardMaterial({ color: mau, roughness: 0.6, metalness: 0.1 });
    for (var k in (opts || {})) {
      if (m[k] && m[k].isColor) m[k].set(opts[k]);   // màu phải đặt vào Color có sẵn, không gán số
      else m[k] = opts[k];
    }
    return m;
  }

  function hop(w, h, d, m) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); }
  function tru(r1, r2, h, m, n) { return new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, n || 24), m); }

  /* quả táo — dùng ở tấm gương và ở trạm III */
  function quaTao(co, matVo) {
    var g = new THREE.Group();
    var than = new THREE.Mesh(new THREE.SphereGeometry(0.2 * co, 28, 20), matVo);
    than.scale.set(1, 0.9, 1);
    g.add(than);
    var cuong = tru(0.012 * co, 0.016 * co, 0.12 * co, mat(0x4a2c14));
    cuong.position.y = 0.2 * co;
    cuong.rotation.z = 0.25;
    g.add(cuong);
    var la = new THREE.Mesh(new THREE.SphereGeometry(0.06 * co, 10, 8), mat(0x3f9a3c));
    la.scale.set(1.4, 0.25, 0.7);
    la.position.set(0.06 * co, 0.24 * co, 0);
    la.rotation.z = -0.4;
    g.add(la);
    g.userData.than = than;
    return g;
  }

  /* ═══════════ dựng phòng ═══════════ */

  function build(ctx) {
    ctxRef = ctx;
    S = {
      moKhoa: 1,                // số trạm đã mở; vách i mở khi moKhoa > i + 1
      gan: null, giu: null, bia: -1, tieuDiem: null,
      nhac: '', nhacT: 0,
      den: 0, ruong: 0, ruongKetT: 0, guong: 0, thu: {}, xong1: false, ruongMo: 0,
      nang: 0, vaiTro: 0, xong2: false, canGoc: -0.5,
      phim: null, may: [0, 0, 0], sangXuong: 0,   // trạm II: cảnh phim, mức chạy từng cỗ máy, sương tan
      giac: { mat: 0, tai: 0, tay: 0 }, camTinh: 0, camTinhT: 0,
      ly: 0, lyBuoc: 0, rong: 0, daRong: false, soLanRong: 0, xong3: false, xong3T: 0,
      nhay: null, nhayKhoa: 0,
      kiem: [0, 0, 0], daKiem: [false, false, false], soKiem: 0, nhat: 0, daNhat: false, nhatT: 0,
      ketThuc: false,
      hen: [],
      daGT: {},                 // chú giải đã xem — để ghi vào sổ khám phá ở bia
      nhamId: null, nhamT: 0,   // vật đang nằm dưới tâm ngắm
      cuaT: [0, 0, 0, 0]
    };
    o = { vat: [], bia: [], tQuang: texQuang(),
          nhin: [], cg: {}, tia: new THREE.Raycaster(), diemNhin: new THREE.Vector2() };
    o.tia.far = TAM_NHIN;

    var P = ctx.player;
    P.bounds = 99;
    P.blockers = [];
    P.constrain = chan;
    P.groundAt = nenDat;
    P.spawn(0, 20.2, 0);

    o.mauTam = new THREE.Color();
    o.mauKhi = KHI.map(function (k) { return new THREE.Color(k.nen); });
    dungVo(ctx);
    dungAnhSang(ctx);
    o.congVao = dungCong(ctx.scene, 0, 2.1, Z_DAU - 0.25, Math.PI, 0x8a2be2, 0x00ffff, false);
    o.congRa  = dungCong(ctx.scene, 0, 2.1, -Z_DAU + 0.25, 0, 0xc98a1e, 0xe8b04a, true);
    dungTram1(ctx);
    dungTram2(ctx);
    dungTram3(ctx);
    dungTram4(ctx);
    dungBia(ctx);
    dungTranh(ctx);
    dungVungNhin(ctx);
    dungPanel(ctx);

    o.nghe = function (e) {
      if (e.repeat) return;
      if (e.code !== 'KeyE' && e.key !== 'e' && e.key !== 'E') return;
      if (!S || S.bia < 0 || S.ketThuc) return;
      if (TX.hud.theDangMo() || TX.hud.soTayDangMo()) return;
      moBia(ctxRef, S.bia);
    };
    addEventListener('keydown', o.nghe);
  }

  /* ---------- vỏ hành lang: sàn, trần, tường, ba vách có cửa vòm ---------- */

  function texSan(kieu) {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var g = c.getContext('2d');
    var i;
    if (kieu === 0) {                       /* đá xám tím, nứt nẻ */
      g.fillStyle = '#2d2536'; g.fillRect(0, 0, 256, 256);
      for (i = 0; i < 40; i++) {
        g.fillStyle = 'rgba(' + (60 + Math.random() * 30 | 0) + ',50,80,.35)';
        g.fillRect(Math.random() * 256, Math.random() * 256, 30 + Math.random() * 60, 20 + Math.random() * 40);
      }
      g.strokeStyle = 'rgba(10,5,18,.8)'; g.lineWidth = 3;
      for (i = 0; i <= 256; i += 128) {
        g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke();
        g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke();
      }
    } else if (kieu === 1) {                /* sàn thép tấm có gân */
      g.fillStyle = '#3a2a1e'; g.fillRect(0, 0, 256, 256);
      g.fillStyle = 'rgba(255,140,60,.12)';
      for (i = 0; i < 256; i += 32) for (var j = 0; j < 256; j += 32) {
        g.save(); g.translate(i + 16, j + 16); g.rotate((i + j) % 64 ? 0.8 : -0.8);
        g.fillRect(-10, -3, 20, 6); g.restore();
      }
      g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 4; g.strokeRect(0, 0, 256, 256);
    } else {                                /* nền tối, lưới mảnh — cyber */
      g.fillStyle = '#060c2a'; g.fillRect(0, 0, 256, 256);
      g.strokeStyle = 'rgba(0,140,255,.45)'; g.lineWidth = 2;
      g.strokeRect(1, 1, 254, 254);
      g.strokeStyle = 'rgba(153,0,255,.25)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(128, 0); g.lineTo(128, 256); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke();
    }
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(6, 5.5);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }

  function dungVo(ctx) {
    var g = ctx.scene;
    var dai = (2 * Z_DAU) / 4;

    o.matTuong = [
      mat(0x2b2233, { roughness: 0.95 }),
      mat(0x3b2a1f, { roughness: 0.55, metalness: 0.45 }),
      mat(0x0b1030, { roughness: 0.45, metalness: 0.2 }),
      mat(0xe9e2d4, { roughness: 0.55, emissive: 0x4a4038, emissiveIntensity: 0.18 })
    ];
    var matSan = [
      mat(0xffffff, { map: texSan(0), roughness: 0.9 }),
      mat(0xffffff, { map: texSan(1), roughness: 0.5, metalness: 0.5 }),
      mat(0xffffff, { map: texSan(2), roughness: 0.35, metalness: 0.3 }),
      mat(0xf2ede6, { map: TX.texSanNgoc(), roughness: 0.3, metalness: 0.05 })
    ];

    for (var k = 0; k < 4; k++) {
      var zt = Z_DAU - dai * (k + 0.5);

      var san = new THREE.Mesh(new THREE.PlaneGeometry(X_TUONG * 2, dai), matSan[k]);
      san.rotation.x = -Math.PI / 2;
      san.position.set(0, 0, zt);
      san.receiveShadow = true;
      g.add(san);

      var tran = new THREE.Mesh(new THREE.PlaneGeometry(X_TUONG * 2, dai), o.matTuong[k]);
      tran.rotation.x = Math.PI / 2;
      tran.position.set(0, CAO, zt);
      g.add(tran);

      [-1, 1].forEach(function (s) {
        var t = new THREE.Mesh(new THREE.PlaneGeometry(dai, CAO), o.matTuong[k]);
        t.position.set(s * X_TUONG, CAO / 2, zt);
        t.rotation.y = -s * Math.PI / 2;
        t.receiveShadow = true;
        g.add(t);
      });
    }

    /* hai đầu hành lang */
    var dau = new THREE.Mesh(new THREE.PlaneGeometry(X_TUONG * 2, CAO), o.matTuong[0]);
    dau.position.set(0, CAO / 2, Z_DAU);
    dau.rotation.y = Math.PI;
    g.add(dau);
    var cuoi = new THREE.Mesh(new THREE.PlaneGeometry(X_TUONG * 2, CAO), o.matTuong[3]);
    cuoi.position.set(0, CAO / 2, -Z_DAU);
    g.add(cuoi);

    /* ba vách có cửa vòm; mỗi mặt vách mang màu của trạm nó quay về */
    o.chan = [];
    var mauCua = [0xff8a2a, 0x2a8cff, 0xfff2c4];
    VACH.forEach(function (zp, i) {
      var mats = [o.matTuong[i], o.matTuong[i], o.matTuong[i], o.matTuong[i], o.matTuong[i], o.matTuong[i + 1]];
      var rongBen = X_TUONG - CUA_X;
      [-1, 1].forEach(function (s) {
        var b = new THREE.Mesh(new THREE.BoxGeometry(rongBen, CAO, 0.3), mats);
        b.position.set(s * (CUA_X + rongBen / 2), CAO / 2, zp);
        g.add(b);
        o.nhin.push(b);                        // chặn tia chú giải
      });
      var lanh = new THREE.Mesh(new THREE.BoxGeometry(CUA_X * 2, CAO - CUA_CAO, 0.3), mats);
      lanh.position.set(0, CUA_CAO + (CAO - CUA_CAO) / 2, zp);
      g.add(lanh);
      o.nhin.push(lanh);

      /* viền vòm phát sáng */
      var matVien = new THREE.MeshBasicMaterial({ color: mauCua[i] });
      [[-CUA_X, CUA_CAO / 2, 0.08, CUA_CAO], [CUA_X, CUA_CAO / 2, 0.08, CUA_CAO], [0, CUA_CAO, CUA_X * 2 + 0.08, 0.08]]
        .forEach(function (v) {
          var m = hop(v[2], v[3], 0.34, matVien);
          m.position.set(v[0], v[1], zp);
          g.add(m);
        });

      /* màn chắn năng lượng trong lòng cửa — tan đi khi cửa mở */
      var chanMat = new THREE.ShaderMaterial({
        uniforms: { uTime: TX.uTime, uMo: { value: 0 }, uMau: { value: new THREE.Color(mauCua[i]) } },
        vertexShader: [
          'varying vec2 vUv;',
          'void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }'
        ].join('\n'),
        fragmentShader: [
          'uniform float uTime; uniform float uMo; uniform vec3 uMau; varying vec2 vUv;',
          'void main() {',
          '  float n = fract(sin(dot(floor(vUv * vec2(36.0, 64.0)), vec2(12.9898, 78.233))) * 43758.5453);',
          '  if (n < uMo * 1.05) discard;',
          '  float song = 0.5 + 0.5 * sin(vUv.y * 46.0 - uTime * 3.2 + sin(vUv.x * 9.0 + uTime) * 1.5);',
          '  float vien = 1.0 - smoothstep(0.0, 0.12, min(vUv.x, 1.0 - vUv.x));',
          '  float a = (0.18 + 0.32 * song * song + 0.4 * vien) * (1.0 - uMo);',
          '  gl_FragColor = vec4(mix(uMau, vec3(1.0), song * 0.35), a);',
          '}'
        ].join('\n'),
        transparent: true, depthWrite: false, side: THREE.DoubleSide
      });
      var chan = new THREE.Mesh(new THREE.PlaneGeometry(CUA_X * 2, CUA_CAO), chanMat);
      chan.position.set(0, CUA_CAO / 2, zp);
      g.add(chan);
      o.chan.push(chan);

      /* tên trạm khắc trên lanh tô, mặt quay về trạm vừa đi */
      var T = ctx.text.tram[i];
      var mauChu = ['#e6d2ff', '#ffd27a', '#9fd8ff'][i];
      var bien = bang([
        { t: T[0], co: 54, mau: mauChu, dam: 700, gian: 14 },
        { t: T[1], co: 78, mau: '#ffffff', serif: true, dam: 600 }
      ], 3.6, 1.0);
      bien.position.set(0, CUA_CAO + 1.55, zp + 0.17);
      if (i === 1) bien.position.y = CUA_CAO + 1.85;    // chừa chỗ cho bốn vai trò
      g.add(bien);
    });

    /* tên trạm IV trên tường cuối, phía trên cổng ra */
    var T4 = ctx.text.tram[3];
    var b4 = bang([
      { t: T4[0], co: 54, mau: '#b8873a', dam: 700, gian: 14 },
      { t: T4[1], co: 78, mau: '#5e4a20', serif: true, dam: 600 }
    ], 3.6, 1.0);
    b4.position.set(0, 4.9, -Z_DAU + 0.05);
    g.add(b4);
  }

  /* ---------- ánh sáng: mỗi trạm một bộ đèn riêng ---------- */

  function dungAnhSang(ctx) {
    var g = ctx.scene;
    o.troi = new THREE.HemisphereLight(0xb9a8d6, 0x1a1020, 0.45);
    g.add(o.troi);
    g.add(new THREE.AmbientLight(0xffffff, 0.08));

    /* trạm I — đèn hắt mù xám nhạt */
    var r1 = new THREE.SpotLight(0xc8c0d8, 1.4, 16, Math.PI / 4.5, 0.6, 1.2);
    r1.position.set(0, CAO - 0.2, 16.0);
    r1.target.position.set(0, 0, 14.6);
    r1.castShadow = true;
    r1.shadow.mapSize.set(1024, 1024);
    g.add(r1, r1.target);

    /* trạm II — cam neon và vàng kim, mạnh dần theo năng lượng */
    o.den2a = new THREE.PointLight(0xff6600, 0.4, 13, 1.6);
    o.den2a.position.set(0, 4.6, 5.5);
    o.den2b = new THREE.PointLight(0xffd700, 0.3, 9, 1.6);
    o.den2b.position.set(-3.6, 3.0, 5.5);
    g.add(o.den2a, o.den2b);

    /* trạm III — xanh cyber và tím điện tử */
    o.den3a = new THREE.PointLight(0x0066ff, 1.8, 12, 1.5);
    o.den3a.position.set(-2.5, 4.4, -3.5);
    o.den3b = new THREE.PointLight(0x9900ff, 1.8, 9, 1.5);
    o.den3b.position.set(2.5, 4.6, -8.5);
    g.add(o.den3a, o.den3b);

    /* trạm IV — ánh trắng từ trên rọi xuống */
    var r4 = new THREE.SpotLight(0xffffff, 1.3, 18, Math.PI / 3, 0.5, 1.0);
    r4.position.set(0, CAO - 0.1, -16.5);
    r4.target.position.set(0, 0, -16.5);
    r4.castShadow = true;
    r4.shadow.mapSize.set(1024, 1024);
    g.add(r4, r4.target);
    var t4 = new THREE.HemisphereLight(0xfffaf0, 0xe6dcc6, 0.0);
    o.troi4 = t4;
    g.add(t4);
  }

  /* ---------- cổng dị giới: vòng phép xoay + 2.000 hạt xoáy vào tâm ---------- */

  var XOAY_VS = [
    'attribute vec3 aHat;',            // x: góc đầu, y: bán kính đầu, z: tốc độ
    'attribute vec3 aMau;',
    'uniform float uTime; uniform float uR; uniform float uPR; uniform float uMo;',
    'varying vec3 vMau; varying float vA;',
    'void main() {',
    '  float t = uTime * aHat.z;',
    '  float r = fract(aHat.y - t * 0.22);',
    '  float a = aHat.x + t * 1.4 + (1.0 - r) * 4.5;',
    '  vec3 p = vec3(cos(a) * r * uR, sin(a) * r * uR, (1.0 - r) * 0.5);',
    '  vA = smoothstep(0.0, 0.12, r) * smoothstep(1.0, 0.75, r) * uMo;',
    '  vMau = aMau;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_PointSize = (2.5 + 5.0 * (1.0 - r)) * uPR * (4.0 / max(0.3, -mv.z));',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');

  var XOAY_FS = [
    'varying vec3 vMau; varying float vA;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5) * 2.0;',
    '  if (d > 1.0) discard;',
    '  gl_FragColor = vec4(mix(vMau, vec3(1.0), smoothstep(0.4, 0.0, d) * 0.7), pow(1.0 - d, 1.6) * vA);',
    '}'
  ].join('\n');

  function dungCong(g, x, y, z, ry, mauA, mauB, thuong) {
    var nhom = new THREE.Group();
    nhom.position.set(x, y, z);
    nhom.rotation.y = ry;
    g.add(nhom);
    var tron = thuong ? THREE.NormalBlending : THREE.AdditiveBlending;

    var vong1 = new THREE.Mesh(new THREE.RingGeometry(1.35, 1.5, 72),
      new THREE.MeshBasicMaterial({ color: mauA, transparent: true, opacity: 0.9, blending: tron, side: THREE.DoubleSide, depthWrite: false }));
    var vong2 = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.12, 6),
      new THREE.MeshBasicMaterial({ color: mauB, transparent: true, opacity: 0.8, blending: tron, side: THREE.DoubleSide, depthWrite: false }));
    var vong3 = new THREE.Mesh(new THREE.RingGeometry(1.18, 1.22, 3),
      new THREE.MeshBasicMaterial({ color: mauB, transparent: true, opacity: 0.6, blending: tron, side: THREE.DoubleSide, depthWrite: false }));
    nhom.add(vong1, vong2, vong3);

    var loi = new THREE.Mesh(new THREE.CircleGeometry(1.36, 48),
      new THREE.MeshBasicMaterial({ color: mauA, transparent: true, opacity: 0.25, blending: tron, depthWrite: false }));
    loi.position.z = 0.02;
    nhom.add(loi);

    var n = 2000;
    var hat = new Float32Array(n * 3), mau = new Float32Array(n * 3), pos = new Float32Array(n * 3);
    var cA = new THREE.Color(mauA), cB = new THREE.Color(mauB);
    for (var i = 0; i < n; i++) {
      hat[i * 3] = Math.random() * Math.PI * 2;
      hat[i * 3 + 1] = Math.random();
      hat[i * 3 + 2] = 0.6 + Math.random() * 0.8;
      var c = Math.random() < 0.5 ? cA : cB;
      mau[i * 3] = c.r; mau[i * 3 + 1] = c.g; mau[i * 3 + 2] = c.b;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aHat', new THREE.BufferAttribute(hat, 3));
    geo.setAttribute('aMau', new THREE.BufferAttribute(mau, 3));
    var uMo = { value: 1 };
    var pts = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: { uTime: TX.uTime, uR: { value: 1.45 }, uPR: { value: Math.min(devicePixelRatio, 2) }, uMo: uMo },
      vertexShader: XOAY_VS, fragmentShader: XOAY_FS,
      transparent: true, depthWrite: false, blending: tron
    }));
    pts.frustumCulled = false;
    nhom.add(pts);

    var den = new THREE.PointLight(mauA, 3.5, 9, 1.6);
    den.position.z = 0.8;
    nhom.add(den);

    /* trên nền trắng, đèn mạnh sẽ làm cháy trắng cả mảng tường */
    var denMax = thuong ? 0.9 : 3.5;
    return { nhom: nhom, vong1: vong1, vong2: vong2, vong3: vong3, loi: loi, uMo: uMo, den: den, denMax: denMax };
  }

  /* ═══════════ TRẠM I — lịch sử nhận thức luận ═══════════ */

  function dungTram1(ctx) {
    var g = ctx.scene, T = ctx.text.t1, P = ctx.player;
    o.t1 = {};

    /* bốn cột chống nhà, mỗi cột một học thuyết trước Mác — cột nào cũng nứt */
    o.t1.cot = COT_TRAM1.map(function (d) { return dungCot(g, P, d, T.cot[d.k]); });

    /* sương tro lơ lửng */
    TX.domSang(g, {
      soLuong: 140, tam: [0, 2.6, 16.5], rong: [11, 5, 10.5],
      mau: [0x9d7bd8, 0x6a6a7a, 0xc77dff], co: [10, 30], doMo: 0.5, troi: 0.5
    });

    /* --- ngọn nến duy tâm --- */
    var dx = -3.3, dz = 15.4;
    bucHyLap(g, dx, dz, T.bucNen);
    dungNen(ctx, dx, dz);
    bienVat(g, T.den, dx, 3.35, dz, '#e9d8ff', '#b9a8d6');
    P.blockers.push({ x: dx, z: dz, r: 0.55 });
    o.vat.push({ id: 'den', tram: 0, x: dx, z: dz, tam: 1.7, goiY: T.den.goiY });

    /* --- rương "vật tự nó" trong lồng năng lượng --- */
    var rz = 14.0;
    chongSach(g, 0, rz, T.sach);

    var c = document.createElement('canvas');
    c.width = c.height = 16;
    var gg = c.getContext('2d');
    for (var y = 0; y < 16; y++) for (var x = 0; x < 16; x++) {
      var go = (y % 4 === 0) ? '#4a2a12' : ((x + (y >> 2)) % 5 === 0 ? '#6b3f1d' : '#7d4b22');
      if (x === 0 || x === 15 || y === 0 || y === 15) go = '#d4a63a';
      if ((x === 7 || x === 8) && y > 5 && y < 10) go = '#ffe27a';
      gg.fillStyle = go; gg.fillRect(x, y, 1, 1);
    }
    var texR = new THREE.CanvasTexture(c);
    texR.magFilter = THREE.NearestFilter;
    texR.minFilter = THREE.NearestFilter;
    texR.encoding = THREE.sRGBEncoding;
    var matR = mat(0xffffff, { map: texR, roughness: 0.7 });

    var ruong = new THREE.Group();
    ruong.position.set(0, 0.7, rz);
    g.add(ruong);
    var thanR = hop(0.9, 0.5, 0.6, matR);
    thanR.position.y = 0.25;
    thanR.castShadow = true;
    ruong.add(thanR);
    var lePhai = new THREE.Group();
    lePhai.position.set(0, 0.5, -0.3);
    ruong.add(lePhai);
    var nap = hop(0.92, 0.18, 0.62, matR);
    nap.position.set(0, 0.09, 0.3);
    lePhai.add(nap);
    o.t1.ruong = ruong;
    o.t1.nap = lePhai;

    o.t1.matLong = new THREE.MeshPhysicalMaterial({
      color: 0xb48cff, transmission: 0.9, roughness: 0.12, metalness: 0,
      transparent: true, opacity: 0.6, emissive: 0x3a1466, emissiveIntensity: 0.6
    });
    var long = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 1), o.t1.matLong);
    long.position.set(0, 1.12, rz);
    g.add(long);
    o.t1.matKhung = new THREE.LineBasicMaterial({ color: 0xc77dff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    var khung = new THREE.LineSegments(new THREE.EdgesGeometry(long.geometry), o.t1.matKhung);
    long.add(khung);
    o.t1.long = long;

    o.t1.cotSang = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 5, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    o.t1.cotSang.position.set(0, 3.5, rz);
    g.add(o.t1.cotSang);
    o.t1.anhRuong = new THREE.PointLight(0xffd27a, 0, 7, 1.6);
    o.t1.anhRuong.position.set(0, 1.8, rz);
    g.add(o.t1.anhRuong);

    o.t1.bienRuong = bienVat(g, T.ruong, 0, 2.75, rz, '#e9d8ff', '#b9a8d6');
    P.blockers.push({ x: 0, z: rz, r: 0.95 });
    o.vat.push({ id: 'ruong', tram: 0, x: 0, z: rz, tam: 2.0, goiY: T.ruong.goiY,
                 dieuKien: function () { return S.ruongMo === 0 && !S.xong2; } });

    /* --- tấm gương siêu hình: tủ gương, quả táo thật và bóng của nó --- */
    var gx = 3.3, gz = 14.6;
    var matKhung = TX.vatLieuVang();
    var matLung = mat(0x2a1a10, { roughness: 0.8 });          // gỗ óc chó sẫm
    var lung = hop(1.3, 2.1, 0.06, matLung);
    lung.position.set(gx, 1.15, gz - 1.25);
    g.add(lung);
    [[-0.65, 0], [0.65, 0]].forEach(function (s) {
      var ben = hop(0.06, 2.1, 1.25, matLung);
      ben.position.set(gx + s[0], 1.15, gz - 0.62);
      g.add(ben);
    });
    [[0, 2.2, 1.42, 0.1], [0, 0.1, 1.42, 0.1], [-0.7, 1.15, 0.1, 2.2], [0.7, 1.15, 0.1, 2.2]].forEach(function (v) {
      var m = hop(v[2], v[3], 0.1, matKhung);
      m.position.set(gx + v[0], v[1], gz);
      g.add(m);
    });
    o.t1.matKinh = new THREE.MeshStandardMaterial({
      color: 0xbfc8e0, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.22, depthWrite: false
    });
    var kinh = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.0), o.t1.matKinh);
    kinh.position.set(gx, 1.15, gz + 0.01);
    g.add(kinh);

    tuGuongGo(g, gx, gz, T.guongBien);
    /* bục gỗ dưới quả táo, và "bóng" của nó trong gương */
    bucGo(g, gx, gz + 0.7, mat(0x6b4a2e, { roughness: 0.7 }));
    bucGo(g, gx, gz - 0.7, mat(0x5a4a52, { roughness: 0.8 }));
    var taoThat = quaTao(1, mat(0xc0282c, { roughness: 0.35 }));
    taoThat.position.set(gx, 1.13, gz + 0.7);
    g.add(taoThat);
    o.t1.matBong = mat(0x9a7a8c, { roughness: 0.5, transparent: true, opacity: 0.85 });
    var taoBong = quaTao(1, o.t1.matBong);
    taoBong.position.set(gx, 1.13, gz - 0.7);
    taoBong.scale.z = -1;
    g.add(taoBong);
    o.t1.taoBong = taoBong;

    bienVat(g, T.guong, gx, 3.25, gz + 0.1, '#e9d8ff', '#b9a8d6');
    P.blockers.push({ x: gx, z: gz - 0.62, r: 0.8 }, { x: gx, z: gz + 0.7, r: 0.3 });
    o.vat.push({ id: 'guong', tram: 0, x: gx, z: gz + 0.7, tam: 1.6, goiY: T.guong.goiY });
  }

  /* ═══════════ KIẾN TRÚC TRẠM I ═══════════
     Mỗi thứ mang dấu của đúng học thuyết nó đại diện:
       cột     bốn trụ của nhận thức luận trước Mác, cột nào cũng nứt
       bục nến cột Hy Lạp thu nhỏ, khắc ΙΔΕΑ — ý niệm của Platon
       bục rương  chồng sách của Kant: “vật tự nó” đứng trên chính lý thuyết ấy
       tủ gương   khắc TABULA RASA — ý thức như tấm bảng trắng, chờ in      */

  var COT_TRAM1 = [
    { x: -5.3, z: 19.0, k: 0, vo: false },    // Platon — cạnh tranh hang động
    { x: -5.3, z: 12.0, k: 1, vo: true },     // Berkeley
    { x:  5.3, z: 19.0, k: 2, vo: true },     // Hume · Kant — cạnh tranh bức tường sương
    { x:  5.3, z: 12.0, k: 3, vo: false }     // Feuerbach
  ];

  /* khía rãnh dọc thân cột: lõm vào ở so rãnh đều quanh chu vi */
  function khiaRanh(geo, so, sau) {
    var p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z);
      if (r < 1e-4) continue;
      var a = Math.atan2(z, x);
      var k = 1 - sau * Math.pow(Math.max(0, Math.cos(a * so)), 3);
      p.setX(i, x * k);
      p.setZ(i, z * k);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /* thân cột đá: rãnh dọc, vết bẩn, và một vết nứt — bản vẽ + bản phát sáng */
  function texThanCot(nang) {
    var W = 256, H = 512;
    function tao() { var c = document.createElement('canvas'); c.width = W; c.height = H; return c; }
    var c = tao(), e = tao();
    var g = c.getContext('2d'), ge = e.getContext('2d');
    var l = g.createLinearGradient(0, 0, 0, H);
    l.addColorStop(0, '#7a7090'); l.addColorStop(1, '#4f4660');
    g.fillStyle = l;
    g.fillRect(0, 0, W, H);
    for (var i = 0; i < 16; i++) {
      var x = i * W / 16;
      g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x + 3, 0, W / 32, H);
      g.fillStyle = 'rgba(0,0,0,.22)';       g.fillRect(x, 0, 2, H);
    }
    for (i = 0; i < 40; i++) {
      g.fillStyle = 'rgba(20,10,30,' + (Math.random() * 0.12) + ')';
      g.beginPath(); g.arc(Math.random() * W, Math.random() * H, 6 + Math.random() * 30, 0, Math.PI * 2); g.fill();
    }
    ge.fillStyle = '#000';
    ge.fillRect(0, 0, W, H);

    /* vết nứt: đi xuống ngoằn ngoèo, rẽ nhánh; cột nứt nặng thì dài và nhiều nhánh */
    function nut(x, y, dai, day) {
      var pts = [[x, y]];
      for (var k = 0; k < dai; k++) {
        x += (Math.random() - 0.5) * 26; y += 10 + Math.random() * 16;
        pts.push([x, y]);
      }
      [[g, '#120a1c', day + 2], [ge, '#ffffff', day]].forEach(function (v) {
        v[0].strokeStyle = v[1]; v[0].lineWidth = v[2]; v[0].lineJoin = 'round';
        v[0].beginPath(); v[0].moveTo(pts[0][0], pts[0][1]);
        pts.forEach(function (p) { v[0].lineTo(p[0], p[1]); });
        v[0].stroke();
      });
      return pts;
    }
    var chinh = nut(60 + Math.random() * 136, H * 0.08, nang ? 26 : 16, 3);
    for (i = 0; i < (nang ? 4 : 2); i++) {
      var p0 = chinh[2 + (Math.random() * (chinh.length - 4) | 0)];
      nut(p0[0], p0[1], 3 + (Math.random() * 4 | 0), 1.5);
    }
    try { ge.filter = 'blur(2px)'; ge.drawImage(e, 0, 0); } catch (er) {}
    var tm = new THREE.CanvasTexture(c), te = new THREE.CanvasTexture(e);
    tm.encoding = THREE.sRGBEncoding;
    return [tm, te];
  }

  function dungCot(g, P, d, T) {
    var nhom = new THREE.Group();
    nhom.position.set(d.x, 0, d.z);
    g.add(nhom);
    var matDa = mat(0x6a6078, { roughness: 0.85 });
    var tx = texThanCot(d.vo);
    var matThan = mat(0xffffff, { map: tx[0], roughness: 0.85, emissive: 0xb06cff, emissiveIntensity: 0.8 });
    matThan.emissiveMap = tx[1];

    var de = hop(0.95, 0.3, 0.95, matDa); de.position.y = 0.15;
    var bac = hop(0.8, 0.1, 0.8, matDa);  bac.position.y = 0.35;
    var than = new THREE.Mesh(khiaRanh(new THREE.CylinderGeometry(0.29, 0.33, 5.1, 48, 1), 16, 0.06), matThan);
    than.position.y = 0.4 + 2.55;
    var loe = tru(0.46, 0.3, 0.3, matDa, 32); loe.position.y = 5.65;
    var dinh = hop(1.0, 0.2, 1.0, matDa);     dinh.position.y = 5.9;
    [de, bac, than, loe, dinh].forEach(function (m) { m.castShadow = true; m.receiveShadow = true; nhom.add(m); });

    /* bảng tên khắc ở chân cột, quay vào giữa hành lang */
    var s = d.x < 0 ? 1 : -1;
    var bien = bang([
      { t: T[0], co: 150, mau: '#efe2ff', dam: 700, gian: 14, serif: true },
      { t: T[1], co: 78, mau: '#c9b6e6', nghieng: true, serif: true, dam: 500 }
    ], 0.86, 0.28);
    bien.position.set(s * 0.48, 0.16, 0);
    bien.rotation.y = s * Math.PI / 2;
    nhom.add(bien);

    /* cột nứt nặng: đá vỡ rơi quanh chân */
    if (d.vo) {
      for (var i = 0; i < 6; i++) {
        var r = 0.06 + Math.random() * 0.12;
        var manh = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), matDa);
        var a = (Math.random() - 0.5) * 2.2;
        manh.position.set(s * (0.62 + Math.random() * 0.4) * Math.cos(a) , r * 0.6, Math.sin(a) * 0.8);
        manh.rotation.set(Math.random() * 3, Math.random() * 3, 0);
        nhom.add(manh);
      }
    }
    P.blockers.push({ x: d.x, z: d.z, r: 0.6 });
    return { mat: matThan, k: d.k };
  }

  /* bục nến: cột Hy Lạp thu nhỏ — mặt trên đúng 1,0 m để đĩa nến đặt lên */
  function bucHyLap(g, x, z, chu) {
    var matCam = mat(0x8a7ea0, { roughness: 0.55 });
    var b1 = hop(0.95, 0.12, 0.95, matCam); b1.position.set(x, 0.06, z);
    var b2 = hop(0.78, 0.1, 0.78, matCam);  b2.position.set(x, 0.17, z);
    var than = new THREE.Mesh(khiaRanh(new THREE.CylinderGeometry(0.27, 0.3, 0.66, 48, 1), 12, 0.07), matCam);
    than.position.set(x, 0.55, z);
    var loe = tru(0.36, 0.28, 0.07, matCam, 32); loe.position.set(x, 0.915, z);
    var mat2 = hop(0.8, 0.05, 0.8, matCam);     mat2.position.set(x, 0.975, z);
    var vanh = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.012, 8, 40), TX.vatLieuVang());
    vanh.rotation.x = Math.PI / 2; vanh.position.set(x, 0.23, z);
    [b1, b2, than, loe, mat2, vanh].forEach(function (m) { m.castShadow = true; m.receiveShadow = true; g.add(m); });
    var bien = bang([
      { t: chu[0], co: 210, mau: '#ffe2a0', dam: 700, gian: 30, serif: true },
      { t: chu[1], co: 90, mau: '#d9c8f0', nghieng: true, serif: true, dam: 500 }
    ], 0.5, 0.26);
    bien.position.set(x, 0.58, z + 0.315);
    g.add(bien);
  }

  /* bục rương: chồng sách của Kant, gáy quay ra ngoài; tổng cao đúng 0,7 m */
  function chongSach(g, x, z, ds) {
    var cao = [0.19, 0.17, 0.16, 0.18];
    var mauBia = ['#3a1a40', '#1f3a2a', '#4a2a14', '#5a1e1e'];
    var c = document.createElement('canvas');
    c.width = 64; c.height = 256;
    var gg = c.getContext('2d');
    gg.fillStyle = '#efe4c8'; gg.fillRect(0, 0, 64, 256);
    gg.fillStyle = 'rgba(120,90,50,.25)';
    for (var i = 0; i < 256; i += 3) gg.fillRect(0, i, 64, 1);
    var texTrang = new THREE.CanvasTexture(c);
    var matTrang = mat(0xffffff, { map: texTrang, roughness: 0.9 });
    var y = 0;
    ds.forEach(function (sach, k) {
      var w = 1.25 - k * 0.07, h = cao[k], d = 0.9 - k * 0.04;
      var matBia = mat(mauBia[k], { roughness: 0.65 });
      /* gáy sách: da, hai đường chỉ vàng, tên tác phẩm và năm */
      var cg = document.createElement('canvas');
      cg.width = 1024; cg.height = Math.round(1024 * h / w);
      var gc = cg.getContext('2d');
      gc.fillStyle = mauBia[k]; gc.fillRect(0, 0, cg.width, cg.height);
      gc.strokeStyle = 'rgba(212,175,106,.85)'; gc.lineWidth = 4;
      [16, cg.height - 16].forEach(function (yy) { gc.beginPath(); gc.moveTo(30, yy); gc.lineTo(cg.width - 30, yy); gc.stroke(); });
      gc.fillStyle = '#e8c878'; gc.textBaseline = 'middle';
      gc.font = '600 ' + Math.round(cg.height * 0.36) + 'px ' + TX.FONT_FANTASY;
      gc.textAlign = 'left'; gc.fillText(sach[0], 60, cg.height / 2, cg.width - 260);
      gc.textAlign = 'right'; gc.fillText(sach[1], cg.width - 60, cg.height / 2);
      var texGay = new THREE.CanvasTexture(cg);
      texGay.encoding = THREE.sRGBEncoding;
      var matGay = mat(0xffffff, { map: texGay, roughness: 0.6 });
      /* thứ tự mặt hộp: +x, -x, +y, -y, +z (gáy), -z */
      var cuon = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [matTrang, matTrang, matBia, matBia, matGay, matTrang]);
      cuon.position.set(x + (Math.random() - 0.5) * 0.06, y + h / 2, z + (Math.random() - 0.5) * 0.04);
      cuon.rotation.y = (k % 2 ? 1 : -1) * (0.04 + Math.random() * 0.06);
      cuon.castShadow = true;
      cuon.receiveShadow = true;
      g.add(cuon);
      y += h;
    });
  }

  /* tủ gương: khung gỗ, chân tiện, mái chạm khắc TABULA RASA */
  function tuGuongGo(g, x, z, chu) {
    var matGo = mat(0x4a2e1a, { roughness: 0.6 });
    [[-0.72, 0], [0.72, 0]].forEach(function (s) {
      var tru1 = tru(0.06, 0.07, 2.35, matGo, 12);
      tru1.position.set(x + s[0], 1.175, z + 0.02);
      g.add(tru1);
      var chan = hop(0.16, 0.08, 0.5, matGo);
      chan.position.set(x + s[0], 0.04, z - 0.1);
      g.add(chan);
    });
    var mai = hop(1.6, 0.3, 0.14, matGo);
    mai.position.set(x, 2.42, z + 0.02);
    var gioi = hop(1.7, 0.05, 0.18, matGo);                    // gờ mái
    gioi.position.set(x, 2.6, z + 0.02);
    g.add(gioi);
    g.add(mai);
    var bien = bang([
      { t: chu[0], co: 150, mau: '#ffe2a0', dam: 700, gian: 20, serif: true },
      { t: chu[1], co: 80, mau: '#e0c9a8', nghieng: true, serif: true, dam: 500 }
    ], 1.3, 0.24);
    bien.position.set(x, 2.42, z + 0.1);
    g.add(bien);
  }

  /* bục gỗ nhỏ dưới quả táo: mặt trên ở 0,95 m */
  function bucGo(g, x, z, m) {
    var than = hop(0.28, 0.88, 0.28, m); than.position.set(x, 0.44, z);
    var mat2 = hop(0.38, 0.05, 0.38, m); mat2.position.set(x, 0.905, z);
    var de = hop(0.38, 0.06, 0.38, m);   de.position.set(x, 0.03, z);
    [than, mat2, de].forEach(function (k) { k.castShadow = true; g.add(k); });
  }

  /* ═══════════ NGỌN NẾN DUY TÂM ═══════════

     Lúc nghỉ: khói nến bốc lên thành dải mảnh.
     Khi giữ:  khói kết lại thành nét vẽ phát sáng của những "ý niệm" —
               con ngựa, cái cây, ngôi nhà, cánh chim, hình tròn hoàn hảo —
               lần lượt biến hình, và in bóng lên vách đá bên cạnh như
               hang động của Platon. Không hình nào giống thứ gì có thật
               trong phòng.
     Buông tay: tất cả tan lại thành khói. Tri thức kiểu duy tâm chỉ tồn
               tại chừng nào còn người nghĩ ra nó.                       */

  var SO_HAT_NEN = 1200;
  var CO_Y_NIEM = 1.35;          // bề rộng hình ý niệm, mét
  var GIU_HINH = 2.0, DOI_HINH = 0.9;

  /* Năm ý niệm, vẽ trong khung 160 × 160 */
  var Y_NIEM = [
    function (g) {                                            /* con ngựa */
      g.ellipse(78, 88, 36, 17, -0.05, 0, Math.PI * 2);
      g.moveTo(104, 78); g.quadraticCurveTo(112, 58, 118, 42);
      g.moveTo(94, 74);  g.quadraticCurveTo(104, 54, 112, 38);
      g.moveTo(112, 38); g.lineTo(138, 50); g.lineTo(134, 58); g.lineTo(118, 50);
      g.moveTo(113, 39); g.lineTo(112, 28);
      [[58, 102, 54, 137], [68, 104, 70, 138], [94, 103, 92, 138], [103, 100, 109, 137]].forEach(function (c) {
        g.moveTo(c[0], c[1]); g.lineTo(c[2], c[3]);
      });
      g.moveTo(43, 82); g.quadraticCurveTo(26, 92, 30, 120);
    },
    function (g) {                                            /* cái cây */
      g.moveTo(80, 140); g.lineTo(80, 88);
      g.moveTo(80, 110); g.lineTo(62, 92);
      g.moveTo(80, 102); g.lineTo(98, 86);
      g.moveTo(108, 62); g.arc(80, 62, 28, 0, Math.PI * 2);
      g.moveTo(74, 76);  g.arc(56, 76, 18, 0, Math.PI * 2);
      g.moveTo(122, 76); g.arc(104, 76, 18, 0, Math.PI * 2);
      g.moveTo(48, 140); g.lineTo(112, 140);
    },
    function (g) {                                            /* ngôi nhà */
      g.rect(46, 84, 68, 54);
      g.moveTo(36, 86); g.lineTo(80, 44); g.lineTo(124, 86);
      g.rect(72, 108, 16, 30);
      g.rect(52, 96, 13, 12); g.rect(95, 96, 13, 12);
      g.moveTo(100, 62); g.lineTo(100, 46); g.lineTo(110, 46); g.lineTo(110, 72);
    },
    function (g) {                                            /* cánh chim */
      g.moveTo(24, 92);  g.quadraticCurveTo(50, 56, 78, 90);
      g.quadraticCurveTo(106, 56, 134, 92);
      g.moveTo(74, 90);  g.quadraticCurveTo(78, 98, 82, 90);
      g.moveTo(88, 50);  g.quadraticCurveTo(98, 38, 108, 50);
      g.quadraticCurveTo(118, 38, 128, 50);
    },
    function (g) {                                            /* hình tròn hoàn hảo */
      g.moveTo(126, 86); g.arc(80, 86, 46, 0, Math.PI * 2);
      g.moveTo(80, 40);  g.lineTo(120, 109); g.lineTo(40, 109); g.closePath();
      g.moveTo(84, 86);  g.arc(80, 86, 4, 0, Math.PI * 2);
    }
  ];

  /* Lấy mẫu điểm nằm trên nét vẽ của một ý niệm — toạ độ cục bộ, mét */
  function layMauYNiem(ve, n) {
    var c = document.createElement('canvas');
    c.width = c.height = 160;
    var g = c.getContext('2d');
    g.strokeStyle = '#fff';
    g.lineWidth = 3.5;
    g.lineCap = g.lineJoin = 'round';
    g.beginPath(); ve(g); g.stroke();
    var d = g.getImageData(0, 0, 160, 160).data, diem = [];
    for (var y = 0; y < 160; y++) for (var x = 0; x < 160; x++) {
      if (d[(y * 160 + x) * 4 + 3] > 120) diem.push(x, y);
    }
    var out = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var k = (Math.random() * diem.length / 2 | 0) * 2;
      out[i * 3]     = (diem[k] / 160 - 0.5) * CO_Y_NIEM;
      out[i * 3 + 1] = (0.5 - diem[k + 1] / 160) * CO_Y_NIEM;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    return out;
  }

  /* Bóng mờ của một ý niệm để in lên vách: nét đậm, nhoè như bóng lửa */
  function bongYNiem(ve) {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var g = c.getContext('2d');
    g.fillStyle = '#000';
    g.fillRect(0, 0, 256, 256);
    try { g.filter = 'blur(5px)'; } catch (e) {}
    g.scale(1.6, 1.6);
    g.strokeStyle = '#fff';
    g.lineWidth = 8;
    g.lineCap = g.lineJoin = 'round';
    g.beginPath(); ve(g); g.stroke();
    return new THREE.CanvasTexture(c);
  }

  /* ngọn lửa hình giọt nước: cầu kéo dài lên trên, vuốt nhọn ở đỉnh */
  function hinhLua(r) {
    var geo = new THREE.SphereGeometry(r, 20, 14);
    var p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var y = p.getY(i);
      if (y > 0) {
        var t = y / r;
        var thu = 1 - t * t * 0.92;
        p.setXYZ(i, p.getX(i) * thu, y * 3.4, p.getZ(i) * thu);
      } else {
        p.setY(i, y * 0.9);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }

  var NEN_VS = [
    'attribute float aCo;',
    'attribute vec3 aMau;',
    'attribute float aSang;',
    'uniform float uPR;',
    'varying vec3 vMau;',
    'varying float vSang;',
    'void main() {',
    '  vMau = aMau; vSang = aSang;',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  gl_PointSize = aCo * uPR * (4.0 / max(0.3, -mv.z));',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');

  var NEN_FS = [
    'varying vec3 vMau;',
    'varying float vSang;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5) * 2.0;',
    '  if (d > 1.0) discard;',
    '  vec3 c = mix(vMau, vec3(1.0, 0.96, 0.86), smoothstep(0.35, 0.0, d) * 0.6);',
    '  gl_FragColor = vec4(c, pow(1.0 - d, 1.8) * vSang);',
    '}'
  ].join('\n');

  function dungNen(ctx, dx, dz) {
    var g = ctx.scene;
    var N = { dx: dx, dz: dz, hien: 0, sau: 1, t: 0 };
    o.ngonNen = N;
    var yDia = 1.0;

    /* đĩa đồng và vũng sáp đọng */
    var matDong = TX.vatLieuVang();
    var dia = tru(0.2, 0.16, 0.03, matDong, 32);
    dia.position.set(dx, yDia + 0.015, dz);
    g.add(dia);
    var vanh = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 8, 40), matDong);
    vanh.rotation.x = Math.PI / 2;
    vanh.position.set(dx, yDia + 0.032, dz);
    g.add(vanh);

    var matSap = mat(0xf1e4c6, { roughness: 0.5, emissive: 0xff9040, emissiveIntensity: 0.14 });
    var vung = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 10), matSap);
    vung.scale.set(1, 0.12, 0.85);
    vung.position.set(dx + 0.02, yDia + 0.032, dz + 0.01);
    g.add(vung);

    /* thân nến: hơi méo, đỉnh lõm như đã cháy một lúc */
    var yNen = yDia + 0.03, caoNen = 0.32;
    var hs = [[0, 0], [0.074, 0], [0.077, 0.08], [0.075, 0.17], [0.079, 0.26],
              [0.076, 0.31], [0.07, caoNen], [0.045, caoNen - 0.008], [0.015, caoNen - 0.014], [0, caoNen - 0.015]]
      .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var than = new THREE.Mesh(new THREE.LatheGeometry(hs, 28), matSap);
    than.position.set(dx, yNen, dz);
    than.castShadow = true;
    g.add(than);

    /* sáp chảy tràn xuống thân */
    [[0.4, 0.07], [1.6, 0.13], [2.5, 0.05], [3.7, 0.1], [5.1, 0.16]].forEach(function (c) {
      var giot = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 8), matSap);
      giot.scale.set(1, c[1] / 0.026, 0.8);
      giot.position.set(dx + Math.cos(c[0]) * 0.076, yNen + caoNen - c[1] / 2, dz + Math.sin(c[0]) * 0.076);
      g.add(giot);
    });

    /* vũng sáp chảy trên đỉnh, sáng lên vì lửa */
    N.matVungSap = new THREE.MeshBasicMaterial({ color: 0xffd890, transparent: true, opacity: 0.75 });
    var dinh = new THREE.Mesh(new THREE.CircleGeometry(0.05, 20), N.matVungSap);
    dinh.rotation.x = -Math.PI / 2;
    dinh.position.set(dx, yNen + caoNen - 0.012, dz);
    g.add(dinh);

    /* bấc */
    var bac = tru(0.004, 0.005, 0.04, mat(0x1a1210, { roughness: 1 }), 6);
    bac.position.set(dx, yNen + caoNen + 0.005, dz);
    bac.rotation.z = 0.15;
    g.add(bac);

    /* ngọn lửa: vỏ cam, lõi trắng ngà, chân xanh */
    var yLua = yNen + caoNen + 0.03;
    N.yLua = yLua;
    N.lua = new THREE.Group();
    N.lua.position.set(dx, yLua, dz);
    g.add(N.lua);
    var geoLua = hinhLua(0.032);
    N.matVo = new THREE.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    N.vo = new THREE.Mesh(geoLua, N.matVo);
    N.lua.add(N.vo);
    var loi = new THREE.Mesh(geoLua, new THREE.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    loi.scale.setScalar(0.55);
    loi.position.y = -0.006;
    N.lua.add(loi);
    var chan = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), new THREE.MeshBasicMaterial({ color: 0x4a7cff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
    chan.scale.set(1, 0.6, 1);
    chan.position.y = -0.012;
    N.lua.add(chan);

    N.quangLon = quang(0xff9a40, 1.1, 0.55);
    N.quangLon.position.set(dx, yLua + 0.05, dz);
    N.quangNho = quang(0xffd27a, 0.28, 0.9);
    N.quangNho.position.set(dx, yLua + 0.04, dz);
    g.add(N.quangLon, N.quangNho);

    N.anh = new THREE.PointLight(0xffa040, 1.0, 7, 2);
    N.anh.position.set(dx, yLua + 0.15, dz);
    g.add(N.anh);

    /* hình ý niệm: mẫu điểm sẵn cho từng hình */
    N.mau = Y_NIEM.map(function (ve) { return layMauYNiem(ve, SO_HAT_NEN); });
    N.tam = new THREE.Vector3(dx, 2.35, dz);

    /* hạt: vừa là khói, vừa là nét vẽ ý niệm */
    var n = SO_HAT_NEN;
    N.hat = { pha: new Float32Array(n), toc: new Float32Array(n), goc: new Float32Array(n), tre: new Float32Array(n), tia: new Float32Array(n) };
    for (var i = 0; i < n; i++) {
      N.hat.pha[i] = Math.random();
      N.hat.toc[i] = 0.12 + Math.random() * 0.14;
      N.hat.goc[i] = Math.random() * Math.PI * 2;
      N.hat.tre[i] = Math.random() * 0.9;
      N.hat.tia[i] = Math.random();
    }
    var geo = new THREE.BufferGeometry();
    N.pos = new Float32Array(n * 3);
    N.mauHat = new Float32Array(n * 3);
    N.sang = new Float32Array(n);
    N.co = new Float32Array(n);
    geo.setAttribute('position', new THREE.BufferAttribute(N.pos, 3));
    geo.setAttribute('aMau', new THREE.BufferAttribute(N.mauHat, 3));
    geo.setAttribute('aSang', new THREE.BufferAttribute(N.sang, 1));
    geo.setAttribute('aCo', new THREE.BufferAttribute(N.co, 1));
    N.geo = geo;
    var pts = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: { uPR: { value: Math.min(devicePixelRatio, 2) } },
      vertexShader: NEN_VS, fragmentShader: NEN_FS,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    pts.frustumCulled = false;
    g.add(pts);

    /* tên ý niệm đang hiện, lơ lửng dưới hình */
    N.nhan = bang([{ t: '', co: 64 }], 1.5, 0.25);
    N.nhan.position.set(dx, N.tam.y - CO_Y_NIEM / 2 - 0.02, dz);
    N.nhan.material.opacity = 0;
    g.add(N.nhan);
    N.nhanDang = -1;

    /* vách đá bên trái: vùng sáng ánh nến, và bóng ý niệm in lên đó */
    var xVach = -X_TUONG + 0.04, zBong = 13.6, yBong = 3.4;
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var gg = c.getContext('2d');
    var q = gg.createRadialGradient(64, 64, 0, 64, 64, 64);
    q.addColorStop(0, 'rgba(255,170,90,.9)');
    q.addColorStop(0.5, 'rgba(255,120,60,.35)');
    q.addColorStop(1, 'rgba(255,120,60,0)');
    gg.fillStyle = q;
    gg.fillRect(0, 0, 128, 128);
    N.matVet = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false });
    var vet = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), N.matVet);
    vet.position.set(xVach, yBong, zBong);
    vet.rotation.y = Math.PI / 2;
    vet.renderOrder = 1;               // vẽ vùng sáng trước, bóng phủ lên sau — bóng mới tối
    g.add(vet);

    N.texBong = Y_NIEM.map(bongYNiem);
    N.bong = [0, 1].map(function (k) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), new THREE.MeshBasicMaterial({
        color: 0x0a0012, alphaMap: N.texBong[k], transparent: true, opacity: 0, depthWrite: false
      }));
      m.position.set(xVach + 0.01 + k * 0.005, yBong, zBong);
      m.rotation.y = Math.PI / 2;
      m.renderOrder = 2;
      g.add(m);
      return m;
    });
  }

  function capNhatNen(dt, ctx) {
    var N = o.ngonNen, t = ctx.clock, h = N.hat, n = SO_HAT_NEN;
    var den = S.den;

    /* ngọn lửa lập loè; khi đang "tưởng tượng" thì bùng cao hơn */
    var gio = A.gio(t * 3);
    N.lua.scale.set(1 + den * 0.25, 1 + 0.14 * gio + den * 0.7 + Math.sin(t * 19) * 0.04, 1 + den * 0.25);
    N.lua.rotation.z = A.gio(t * 2 + 1.3) * 0.09;
    N.lua.position.x = N.dx + A.gio(t * 2.4) * 0.004;
    var lapLoe = 0.9 + 0.12 * Math.sin(t * 23) * Math.sin(t * 7.3) + 0.06 * gio;
    N.anh.intensity = lapLoe + den * 1.1;
    N.quangLon.material.opacity = 0.45 * lapLoe + den * 0.25;
    N.quangLon.scale.setScalar(1.0 + den * 0.6);
    N.quangNho.material.opacity = 0.85;
    N.matVungSap.opacity = 0.6 + 0.15 * lapLoe;

    /* lần lượt các ý niệm: giữ một lúc, rồi biến sang hình kế */
    if (den > 0.5) N.t += dt;
    if (N.t > GIU_HINH + DOI_HINH) {
      N.t = 0;
      N.hien = N.sau;
      N.sau = (N.sau + 1) % Y_NIEM.length;
      N.bong[0].material.alphaMap = N.texBong[N.hien];
      N.bong[1].material.alphaMap = N.texBong[N.sau];
    }
    var m = A.muot((N.t - GIU_HINH) / DOI_HINH);
    var tan = Math.sin(m * Math.PI) * 0.18;               // nét vỡ ra một chút khi đang đổi hình
    var hA = N.mau[N.hien], hB = N.mau[N.sau];

    /* hình ý niệm luôn quay mặt về phía người nhìn */
    var cam = ctx.camera.position;
    var goc = Math.atan2(cam.x - N.tam.x, cam.z - N.tam.z);
    var cs = Math.cos(goc), sn = Math.sin(goc);

    var dinhX = N.dx, dinhY = N.yLua + 0.1, dinhZ = N.dz;
    for (var i = 0; i < n; i++) {
      /* khói: xoắn nhẹ khi bốc lên, loe dần */
      var u = (h.pha[i] + t * h.toc[i]) % 1;
      var r = 0.012 + u * u * 0.3;
      var a = h.goc[i] + t * 0.8 + u * 5;
      var kx = dinhX + Math.cos(a) * r + A.gio(t + h.goc[i]) * 0.06 * u;
      var ky = dinhY + u * 1.6;
      var kz = dinhZ + Math.sin(a) * r;

      /* ý niệm: mỗi hạt tới nét vẽ vào một lúc hơi khác nhau */
      var k = A.muot((den * 1.5 - h.tre[i]) / 0.5);
      var j = i * 3;
      var lx = hA[j] + (hB[j] - hA[j]) * m + Math.sin(t * 2 + i) * tan;
      var ly = hA[j + 1] + (hB[j + 1] - hA[j + 1]) * m + Math.cos(t * 2.3 + i) * tan + Math.sin(t * 1.5 + lx * 3) * 0.015;
      var lz = hA[j + 2];
      var yx = N.tam.x + lx * cs + lz * sn;
      var yy = N.tam.y + ly;
      var yz = N.tam.z - lx * sn + lz * cs;

      N.pos[j]     = kx + (yx - kx) * k;
      N.pos[j + 1] = ky + (yy - ky) * k;
      N.pos[j + 2] = kz + (yz - kz) * k;

      /* khói xám tím mờ → nét vàng tím sáng */
      var tia = h.tia[i];
      var mr = 0.55 + (1.0 - 0.55) * k - tia * 0.25 * k;
      var mg = 0.50 + (0.78 - 0.50) * k - tia * 0.45 * k;
      var mb = 0.62 + (0.45 - 0.62) * k + tia * 0.55 * k;
      N.mauHat[j] = mr; N.mauHat[j + 1] = mg; N.mauHat[j + 2] = mb;
      var khoi = Math.min(1, u / 0.06) * (1 - u) * (1 - u) * 0.09;
      N.sang[i] = khoi + ((0.75 + 0.25 * Math.sin(t * 3 + i)) * 0.85 - khoi) * k;
      N.co[i] = 13 + (6 + tia * 5 - 13) * k;
    }
    N.geo.attributes.position.needsUpdate = true;
    N.geo.attributes.aMau.needsUpdate = true;
    N.geo.attributes.aSang.needsUpdate = true;
    N.geo.attributes.aCo.needsUpdate = true;

    /* tên ý niệm */
    var ten = m > 0.5 ? N.sau : N.hien;
    if (ten !== N.nhanDang) {
      N.nhanDang = ten;
      N.nhan.userData.viet([{ t: ctx.text.t1.yNiemNhan + ' · ' + ctx.text.t1.yNiem[ten], co: 60, mau: '#ffe2a0', dam: 600, gian: 8 }]);
    }
    N.nhan.material.opacity = A.doan(den, 0.6, 0.9) * (1 - tan * 3);
    N.nhan.lookAt(cam);

    /* bóng trên vách: run theo ánh lửa, hoà dần sang hình kế */
    var dam = A.doan(den, 0.3, 0.8) * 0.75 * (0.85 + 0.15 * lapLoe);
    N.bong[0].material.opacity = dam * (1 - m);
    N.bong[1].material.opacity = dam * m;
    N.bong.forEach(function (b, k) { b.position.z = 13.6 + A.gio(t * 2 + k) * 0.04; });
    N.matVet.opacity = 0.12 + 0.06 * lapLoe + den * 0.25;
  }

  /* ═══════════ TRẠM II — xưởng thực tiễn ═══════════ */

  function banhRang(r, n, day) {
    var s = new THREE.Shape(), rr = r * 0.82, buoc = Math.PI * 2 / n;
    for (var i = 0; i < n; i++) {
      var a = i * buoc;
      [[rr, a], [r, a + buoc * 0.15], [r, a + buoc * 0.45], [rr, a + buoc * 0.6]].forEach(function (p, k) {
        var x = Math.cos(p[1]) * p[0], y = Math.sin(p[1]) * p[0];
        if (i === 0 && k === 0) s.moveTo(x, y); else s.lineTo(x, y);
      });
    }
    s.closePath();
    var lo = new THREE.Path();
    lo.absarc(0, 0, r * 0.22, 0, Math.PI * 2, true);
    s.holes.push(lo);
    var geo = new THREE.ExtrudeGeometry(s, {
      depth: day, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1, curveSegments: 16
    });
    geo.center();
    return geo;
  }

  /* biển nhỏ phẳng, vẽ chữ một dòng */
  function nhanPhang(chu, rong, cao, mauChu, mauNen) {
    return bang([{ t: chu, co: 120, mau: mauChu, dam: 700, gian: 4 }], rong, cao,
                { nen: mauNen, vien: 'rgba(255,190,90,.8)' });
  }

  function hinhNguoi(m, cao) {
    var ng = new THREE.Group();
    var than = tru(0.11, 0.15, 0.55 * cao, m, 10); than.position.y = 0.5 * cao;
    var dau = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), m); dau.position.y = 0.9 * cao;
    ng.add(than, dau);
    var tay = [-1, 1].map(function (s) {
      var vai = new THREE.Group();
      vai.position.set(s * 0.13, 0.72 * cao, 0);
      var canh = tru(0.03, 0.035, 0.38, m, 8);
      canh.position.y = -0.19;
      vai.add(canh);
      vai.userData.s = s;
      ng.add(vai);
      return vai;
    });
    ng.userData.tay = tay;
    return ng;
  }

  function dungTram2(ctx) {
    var g = ctx.scene, T = ctx.text.t2, P = ctx.player;
    o.t2 = {};
    var v = o.t2;
    var matThep = mat(0x5a4a3c, { roughness: 0.4, metalness: 0.7 });
    var matSam = mat(0x2e2620, { roughness: 0.55, metalness: 0.6 });

    /* ---------- cần gạt công nghiệp ---------- */
    var cx = 0, cz = 6.4;
    var c = document.createElement('canvas');
    c.width = 128; c.height = 32;
    var gg = c.getContext('2d');
    for (var i = -2; i < 10; i++) {
      gg.fillStyle = i % 2 ? '#1a1208' : '#ff8a1a';
      gg.beginPath(); gg.moveTo(i * 16, 32); gg.lineTo(i * 16 + 16, 32); gg.lineTo(i * 16 + 32, 0); gg.lineTo(i * 16 + 16, 0); gg.fill();
    }
    var texSoc = new THREE.CanvasTexture(c);
    texSoc.encoding = THREE.sRGBEncoding;
    var de = hop(1.1, 0.55, 0.8, mat(0xffffff, { map: texSoc, roughness: 0.6, metalness: 0.3 }));
    de.position.set(cx, 0.28, cz);
    de.castShadow = true;
    g.add(de);
    v.truc = new THREE.Group();
    v.truc.position.set(cx, 0.6, cz);
    g.add(v.truc);
    var tay = tru(0.06, 0.08, 1.5, matThep, 12);
    tay.position.y = 0.75;
    v.truc.add(tay);
    v.matNum = mat(0xff6600, { emissive: 0xff6600, emissiveIntensity: 0.6, roughness: 0.3 });
    var num = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), v.matNum);
    num.position.y = 1.55;
    v.truc.add(num);
    bienVat(g, T.can, cx, 2.3, cz - 0.2, '#ffd27a', '#ffb070');
    P.blockers.push({ x: cx, z: cz, r: 0.6 });
    o.vat.push({ id: 'can', tram: 1, x: cx, z: cz, tam: 1.8, goiY: T.can.goiY,
                 dieuKien: function () { return !S.phim && !S.xong2; } });

    /* ---------- 1 · sản xuất vật chất: khung máy, bánh răng, lò, băng chuyền ---------- */
    v.matRang = mat(0xb06a2a, { roughness: 0.35, metalness: 0.75, emissive: 0xff6600, emissiveIntensity: 0.05 });
    v.rang1 = new THREE.Mesh(banhRang(1.6, 18, 0.3), v.matRang); v.rang1.position.set(-5.4, 2.4, 6.4);
    v.rang2 = new THREE.Mesh(banhRang(0.9, 10, 0.3), v.matRang); v.rang2.position.set(-5.4, 3.0, 3.75);
    v.rang3 = new THREE.Mesh(banhRang(0.7, 8, 0.3), v.matRang);  v.rang3.position.set(-5.4, 0.95, 8.35);
    [v.rang1, v.rang2, v.rang3].forEach(function (r) { r.rotation.y = Math.PI / 2; r.castShadow = true; g.add(r); });
    [[2.75], [9.3]].forEach(function (p) {                       // khung máy
      var cot = hop(0.22, 4.6, 0.22, matSam); cot.position.set(-5.6, 2.3, p[0]); g.add(cot);
    });
    var xa = hop(0.24, 0.24, 6.8, matSam); xa.position.set(-5.6, 4.6, 6.0); g.add(xa);

    /* lò nung: miệng lò đỏ rực khi xưởng chạy */
    var lo = hop(1.0, 1.4, 1.1, matSam); lo.position.set(-5.2, 0.7, 1.9); lo.castShadow = true; g.add(lo);
    v.matMieng = new THREE.MeshBasicMaterial({ color: 0x3a1004 });
    var mieng = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), v.matMieng);
    mieng.position.set(-4.69, 0.6, 1.9); mieng.rotation.y = Math.PI / 2; g.add(mieng);
    v.quangLo = quang(0xff7a20, 1.4, 0); v.quangLo.position.set(-4.5, 0.65, 1.9); g.add(v.quangLo);

    /* băng chuyền chở thành phẩm dọc tường */
    var cb = document.createElement('canvas');
    cb.width = 64; cb.height = 256;
    var gb = cb.getContext('2d');
    gb.fillStyle = '#1e1a16'; gb.fillRect(0, 0, 64, 256);
    gb.fillStyle = '#3a332c';
    for (i = 0; i < 256; i += 16) gb.fillRect(0, i, 64, 6);
    v.texBang = new THREE.CanvasTexture(cb);
    v.texBang.wrapT = THREE.RepeatWrapping;
    v.texBang.repeat.set(1, 6);
    var bangChuyen = hop(0.7, 0.08, 6.2, mat(0xffffff, { map: v.texBang, roughness: 0.8 }));
    bangChuyen.position.set(-4.1, 0.74, 6.1);
    g.add(bangChuyen);
    [3.2, 6.1, 9.0].forEach(function (z) {
      [-0.3, 0.3].forEach(function (dx) {
        var chan = hop(0.06, 0.7, 0.06, matSam); chan.position.set(-4.1 + dx, 0.35, z); g.add(chan);
      });
    });
    v.hang = T.sanPham.map(function (ten, k) {
      var cn = document.createElement('canvas');
      cn.width = 256; cn.height = 256;
      var gc = cn.getContext('2d');
      gc.fillStyle = ['#c08a3a', '#7a8a9a', '#b05a6a', '#a07a5a', '#5a7a9a'][k];
      gc.fillRect(0, 0, 256, 256);
      gc.strokeStyle = 'rgba(0,0,0,.35)'; gc.lineWidth = 10; gc.strokeRect(8, 8, 240, 240);
      gc.fillStyle = '#fff'; gc.textAlign = 'center'; gc.textBaseline = 'middle';
      gc.font = '700 ' + (ten.length > 7 ? 34 : 44) + 'px "Be Vietnam Pro", sans-serif';
      gc.fillText(ten, 128, 128, 236);
      var tex = new THREE.CanvasTexture(cn);
      tex.encoding = THREE.sRGBEncoding;
      var h = hop(0.42, 0.34, 0.42, mat(0xffffff, { map: tex, roughness: 0.7 }));
      h.position.set(-4.1, 0.95, 3.4 + k * 1.2);
      h.castShadow = true;
      g.add(h);
      return h;
    });
    var b0 = bienVat(g, { ten: T.may[0][0], mo: T.may[0][1] }, -4.4, 5.05, 6.2, '#ffd27a', '#ffb070');
    b0.rotation.y = Math.PI / 2;
    P.blockers.push({ x: -5.2, z: 6.4, r: 0.9 }, { x: -5.2, z: 3.75, r: 0.6 }, { x: -5.2, z: 8.35, r: 0.5 },
                    { x: -5.1, z: 1.9, r: 0.75 });
    [3.4, 4.8, 6.2, 7.6, 9.0].forEach(function (z) { P.blockers.push({ x: -4.1, z: z, r: 0.5 }); });

    /* ---------- 2 · thực nghiệm khoa học ---------- */
    var tx = 3.7, tz = 7.8;
    var ban = hop(1.8, 0.08, 0.9, matThep); ban.position.set(tx, 0.9, tz); ban.castShadow = true; g.add(ban);
    [[-0.8, -0.38], [0.8, -0.38], [-0.8, 0.38], [0.8, 0.38]].forEach(function (p) {
      var chan = hop(0.06, 0.9, 0.06, matThep); chan.position.set(tx + p[0], 0.45, tz + p[1]); g.add(chan);
    });
    /* kính hiển vi */
    var matHV = mat(0x2a2a30, { roughness: 0.3, metalness: 0.8 });
    var deHV = hop(0.3, 0.05, 0.3, matHV); deHV.position.set(tx - 0.2, 0.97, tz - 0.25);
    var canHV = hop(0.06, 0.42, 0.06, matHV); canHV.position.set(tx - 0.08, 1.18, tz - 0.25);
    var ongHV = tru(0.045, 0.055, 0.36, matHV, 12); ongHV.position.set(tx - 0.18, 1.33, tz - 0.25); ongHV.rotation.z = 0.4;
    g.add(deHV, canHV, ongHV);
    v.denHV = quang(0xffd700, 0.35, 0); v.denHV.position.set(tx - 0.2, 1.02, tz - 0.25); g.add(v.denHV);

    /* bình cầu trên kiềng, đèn cồn bên dưới */
    var bx = tx + 0.1, bz = tz + 0.15;
    var kieng = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.01, 6, 24), matHV);
    kieng.rotation.x = Math.PI / 2; kieng.position.set(bx, 1.16, bz); g.add(kieng);
    for (i = 0; i < 3; i++) {
      var a = i / 3 * Math.PI * 2;
      var chanK = tru(0.008, 0.008, 0.22, matHV, 6); chanK.position.set(bx + Math.cos(a) * 0.14, 1.05, bz + Math.sin(a) * 0.14); g.add(chanK);
    }
    var lat = [[0.02, 0], [0.2, 0.02], [0.22, 0.1], [0.14, 0.26], [0.05, 0.32], [0.05, 0.48], [0.065, 0.5]]
      .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var binh = new THREE.Mesh(new THREE.LatheGeometry(lat, 24), new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false
    }));
    binh.position.set(bx, 1.17, bz); g.add(binh);
    v.matDich = mat(0x6a8a3a, { emissive: 0x9aff40, emissiveIntensity: 0.05, roughness: 0.2 });
    var dich = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 12, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55), v.matDich);
    dich.position.set(bx, 1.3, bz); g.add(dich);
    var denCon = tru(0.06, 0.07, 0.1, mat(0x8aa0b0, { roughness: 0.2, metalness: 0.3 }), 16); denCon.position.set(bx, 0.99, bz); g.add(denCon);
    v.lua = quang(0x4a8aff, 0.22, 0); v.lua.position.set(bx, 1.08, bz); g.add(v.lua);
    v.bot = TX.heHat(g, 70, 0xd8ff9a, 0.045, 0);
    v.vtBinh = { x: bx, z: bz };

    /* giá ống nghiệm */
    var gia = hop(0.42, 0.05, 0.1, matHV); gia.position.set(tx + 0.6, 1.08, tz - 0.25); g.add(gia);
    v.matOngNghiem = [0xff5a6a, 0x5ac8ff, 0xffd24a, 0x9a6aff].map(function (m, k) {
      var mm = mat(m, { emissive: m, emissiveIntensity: 0.05, roughness: 0.3 });
      var ong = tru(0.022, 0.022, 0.2, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false }), 10);
      ong.position.set(tx + 0.45 + k * 0.1, 1.08, tz - 0.25); g.add(ong);
      var long = tru(0.018, 0.018, 0.09, mm, 10); long.position.set(tx + 0.45 + k * 0.1, 1.02, tz - 0.25); g.add(long);
      return mm;
    });

    /* mô hình nguyên tử — tri thức mới mà thí nghiệm đem lại */
    v.nguyenTu = new THREE.Group();
    v.nguyenTu.position.set(tx - 0.2, 1.75, tz + 0.62);          // ngay dưới ô "kết luận": tri thức mới
    v.nguyenTu.scale.setScalar(0.001);
    g.add(v.nguyenTu);
    v.nguyenTu.add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd27a })));
    v.quyDao = [0, 1, 2].map(function (k) {
      var q = new THREE.Group();
      q.rotation.set(k * 1.05, k * 0.6, 0);
      q.add(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.006, 6, 64), new THREE.MeshBasicMaterial({ color: 0x7fe8ff })));
      var e = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      q.add(e);
      q.userData.e = e;
      v.nguyenTu.add(q);
      return q;
    });

    /* bảng quy trình phía sau bàn: giả thuyết → thí nghiệm → kết luận */
    var bangQT = hop(0.06, 0.62, 1.9, matSam); bangQT.position.set(tx + 1.0, 2.25, tz); g.add(bangQT);
    v.quyTrinh = T.quyTrinh.map(function (ten, k) {
      var b = nhanPhang((k + 1) + ' · ' + ten, 0.56, 0.2, '#fff3d6', 'rgba(60,30,10,.85)');
      b.position.set(tx + 0.96, 2.25, tz - 0.62 + k * 0.62);       // nhìn từ giữa phòng: đọc trái → phải
      b.rotation.y = -Math.PI / 2;
      b.material.opacity = 0.25;
      g.add(b);
      return b;
    });
    bienVat(g, { ten: T.may[1][0], mo: T.may[1][1] }, tx, 3.15, tz, '#ffd27a', '#ffb070');
    v.denLab = new THREE.PointLight(0xffe0b0, 0, 5, 1.6); v.denLab.position.set(tx - 0.4, 2.4, tz); g.add(v.denLab);
    P.blockers.push({ x: tx, z: tz, r: 1.05 });

    /* ---------- 3 · chính trị – xã hội: diễn đàn, người diễn thuyết, đám đông, băng rôn ---------- */
    var px = 3.7, pz = 3.2;
    var buc = tru(0.9, 1.0, 0.3, matThep, 32); buc.position.set(px, 0.15, pz); g.add(buc);
    var can = tru(0.03, 0.03, 2.6, matThep, 8); can.position.set(px + 0.5, 1.6, pz + 0.4); g.add(can);
    var coGeo = new THREE.PlaneGeometry(1.0, 0.6, 16, 4);
    v.matCo = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xff6600, emissiveIntensity: 0.1, side: THREE.DoubleSide, roughness: 0.6 });
    v.co = new THREE.Mesh(coGeo, v.matCo);
    v.co.position.set(px + 1.0, 2.55, pz + 0.4);
    v.coGoc = coGeo.attributes.position.array.slice();
    g.add(v.co);
    v.matNguoi = mat(0x6a4a30, { emissive: 0xff8a2a, emissiveIntensity: 0, roughness: 0.6 });
    v.nguoi = [];
    var dien = hinhNguoi(v.matNguoi, 1.1);                         // người diễn thuyết trên bục
    dien.position.set(px + 0.2, 0.3, pz);
    dien.rotation.y = -Math.PI / 2;
    g.add(dien);
    v.nguoi.push(dien);
    for (i = 0; i < 6; i++) {                                     // đám đông quay về phía bục
      var aa = Math.PI + (i - 2.5) * 0.32;
      var ng = hinhNguoi(v.matNguoi, 0.9 + (i % 2) * 0.1);
      ng.position.set(px + Math.cos(aa) * 1.55, 0, pz + Math.sin(aa) * 1.55);
      ng.rotation.y = Math.atan2(px - ng.position.x, pz - ng.position.z);
      g.add(ng);
      v.nguoi.push(ng);
      P.blockers.push({ x: ng.position.x, z: ng.position.z, r: 0.28 });
    }
    [[1.6], [4.8]].forEach(function (p) {                          // băng rôn trên hai cột
      var c2 = tru(0.03, 0.03, 2.3, matThep, 8); c2.position.set(5.4, 1.15, p[0]); g.add(c2);
    });
    v.bangRon = nhanPhang(T.bangRon, 2.9, 0.5, '#ffe9b0', 'rgba(120,20,10,.9)');
    v.bangRon.position.set(5.38, 2.0, 3.2);
    v.bangRon.rotation.y = -Math.PI / 2;
    v.bangRon.material.opacity = 0.35;
    g.add(v.bangRon);
    bienVat(g, { ten: T.may[2][0], mo: T.may[2][1] }, px - 0.3, 3.35, pz, '#ffd27a', '#ffb070');
    v.denXH = new THREE.PointLight(0xffc890, 0, 6, 1.6); v.denXH.position.set(px - 0.8, 2.6, pz); g.add(v.denXH);
    P.blockers.push({ x: px, z: pz, r: 1.1 });

    /* ---------- ống dẫn năng lượng: cần gạt → từng cỗ máy → cửa ---------- */
    v.dichOng = [[-4.6, 6.4], [tx - 0.9, tz], [px - 1.0, pz], [0, 0.5]];
    v.ong = v.dichOng.map(function (d) {
      var dxx = d[0] - cx, dzz = d[1] - cz, len = Math.hypot(dxx, dzz);
      var m = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.12 });
      var ong = tru(0.045, 0.045, len, m, 6);
      ong.rotation.z = Math.PI / 2;
      ong.rotation.y = -Math.atan2(dzz, dxx);
      ong.position.set(cx + dxx / 2, 0.05, cz + dzz / 2);
      g.add(ong);
      return m;
    });
    v.xung = quang(0xffc060, 0.55, 0);                            // xung năng lượng chạy trong ống
    g.add(v.xung);

    /* ---------- bốn vai trò, trên lanh tô cửa sang trạm III ---------- */
    v.vaiTro = T.vaiTro.map(function (ten, k) {
      var b = bang([{ t: ten, co: 120, mau: '#ffe9b0', dam: 700, gian: 6 }], 1.7, 0.42,
                   { nen: 'rgba(60,24,0,.55)', vien: 'rgba(255,170,60,.9)' });
      b.position.set(-2.7 + k * 1.8, CUA_CAO + 0.7, 0.18);
      b.material.opacity = 0.18;
      g.add(b);
      return b;
    });

    v.camGia = new THREE.PerspectiveCamera();
  }

  /* ═══════════ TRẠM III — con đường biện chứng của nhận thức ═══════════ */

  function bieuTuongGiac(kieu) {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var g = c.getContext('2d');
    g.strokeStyle = '#7fe8ff';
    g.fillStyle = '#7fe8ff';
    g.lineWidth = 12;
    g.lineCap = 'round';
    g.shadowColor = '#00e5ff';
    g.shadowBlur = 18;
    if (kieu === 'mat') {
      g.beginPath(); g.moveTo(30, 128); g.quadraticCurveTo(128, 30, 226, 128); g.quadraticCurveTo(128, 226, 30, 128); g.stroke();
      g.beginPath(); g.arc(128, 128, 38, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(128, 128, 14, 0, Math.PI * 2); g.fill();
    } else if (kieu === 'tai') {
      g.beginPath(); g.arc(128, 110, 70, Math.PI * 1.05, Math.PI * 0.35); g.stroke();
      g.beginPath(); g.moveTo(173, 166); g.quadraticCurveTo(140, 196, 140, 226); g.stroke();
      g.beginPath(); g.arc(128, 112, 30, Math.PI * 1.1, Math.PI * 0.2); g.stroke();
    } else {
      g.beginPath(); g.moveTo(80, 230); g.lineTo(80, 130); g.stroke();
      g.beginPath(); g.moveTo(176, 230); g.lineTo(176, 150); g.stroke();
      [[94, 40], [124, 26], [154, 36]].forEach(function (f) {
        g.beginPath(); g.moveTo(f[0], 140); g.lineTo(f[0], f[1]); g.stroke();
      });
      g.beginPath(); g.moveTo(80, 130); g.lineTo(80, 70); g.stroke();
      g.beginPath(); g.moveTo(176, 150); g.lineTo(220, 104); g.stroke();
      g.beginPath(); g.moveTo(80, 230); g.lineTo(176, 230); g.stroke();
    }
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  /* dải neon chạy như dòng dữ liệu (thay cho RectAreaLight) */
  function dayNeon(g, x, y, z, dai, ry, mau, toc) {
    var m = new THREE.Mesh(new THREE.PlaneGeometry(dai, 0.08), new THREE.ShaderMaterial({
      uniforms: { uTime: TX.uTime, uMau: { value: new THREE.Color(mau) }, uToc: { value: toc } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: [
        'uniform float uTime; uniform vec3 uMau; uniform float uToc; varying vec2 vUv;',
        'void main(){',
        '  float s = fract(vUv.x * 9.0 - uTime * uToc);',
        '  float v = 0.35 + 0.65 * smoothstep(0.0, 0.15, s) * smoothstep(0.55, 0.3, s);',
        '  gl_FragColor = vec4(uMau * (0.6 + v), 1.0);',
        '}'
      ].join('\n'),
      side: THREE.DoubleSide
    }));
    m.position.set(x, y, z);
    m.rotation.y = ry;
    g.add(m);
  }

  /* ═══════════ TRẠM III — điều mỗi giác quan thu được ═══════════
     Giữ chuột ở một giác quan: thẻ nổi phía trên cột hiện dần ba thuộc
     tính mà giác quan ấy thu được, kèm một hiệu ứng riêng trên quả táo:
       mắt  tia nhìn chiếu vào quả táo
       tai  sóng âm lan ra, và tiếng "rộp" khi cắn
       tay  gợn chạm trên vỏ
     Rồi thẻ tri giác / biểu tượng trên hình quả táo, và ba thẻ lý tính
     quanh bộ não.                                                     */

  function veBieuTuongNho(g, kieu, cx, cy, r) {
    g.save();
    g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = '#7fe8ff'; g.fillStyle = '#7fe8ff';
    var i;
    if (kieu === 'mau') {
      var q = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 2, cx, cy, r);
      q.addColorStop(0, '#ff8a7a'); q.addColorStop(0.6, '#c0182c'); q.addColorStop(1, '#6a0a16');
      g.fillStyle = q; g.beginPath(); g.arc(cx, cy, r * 0.85, 0, Math.PI * 2); g.fill();
    } else if (kieu === 'hinh') {
      g.beginPath(); g.ellipse(cx, cy, r * 0.85, r * 0.75, 0, 0, Math.PI * 2); g.stroke();
      g.setLineDash([6, 8]); g.beginPath(); g.moveTo(cx - r, cy); g.lineTo(cx + r, cy); g.stroke();
    } else if (kieu === 'co') {
      g.beginPath(); g.moveTo(cx - r, cy + r * 0.4); g.lineTo(cx + r, cy + r * 0.4); g.stroke();
      for (i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(cx + i * r * 0.45, cy + r * 0.4); g.lineTo(cx + i * r * 0.45, cy + r * (i % 2 ? 0.15 : 0)); g.stroke(); }
      g.beginPath(); g.arc(cx, cy - r * 0.2, r * 0.42, 0, Math.PI * 2); g.stroke();
    } else if (kieu === 'go') {
      g.beginPath(); g.arc(cx - r * 0.5, cy, r * 0.25, 0, Math.PI * 2); g.fill();
      for (i = 1; i <= 3; i++) { g.beginPath(); g.arc(cx - r * 0.5, cy, r * 0.3 + i * r * 0.28, -0.6, 0.6); g.stroke(); }
    } else if (kieu === 'song') {
      g.beginPath(); g.moveTo(cx - r, cy);
      for (i = 0; i <= 12; i++) g.lineTo(cx - r + i * r / 6, cy + (i % 2 ? -1 : 1) * r * (0.2 + 0.6 * Math.random()));
      g.stroke();
    } else if (kieu === 'vang') {
      g.beginPath(); g.moveTo(cx - r, cy);
      for (i = 0; i <= 40; i++) { var x = cx - r + i * r / 20; g.lineTo(x, cy + Math.sin(i * 1.2) * r * 0.8 * Math.exp(-i / 8)); }
      g.stroke();
    } else if (kieu === 'mat') {
      g.beginPath(); g.moveTo(cx - r, cy + r * 0.3); g.quadraticCurveTo(cx, cy - r * 0.5, cx + r, cy + r * 0.3); g.stroke();
      g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(cx - r * 0.2, cy - r * 0.05, r * 0.25, r * 0.08, -0.3, 0, Math.PI * 2); g.fill();
    } else if (kieu === 'nhiet') {
      g.strokeStyle = '#9fd8ff';
      g.beginPath(); g.moveTo(cx, cy - r * 0.9); g.lineTo(cx, cy + r * 0.4); g.stroke();
      g.beginPath(); g.arc(cx, cy + r * 0.6, r * 0.28, 0, Math.PI * 2); g.fillStyle = '#4a9aff'; g.fill();
      for (i = 0; i < 3; i++) { g.beginPath(); g.moveTo(cx + r * 0.2, cy - r * 0.6 + i * r * 0.3); g.lineTo(cx + r * 0.45, cy - r * 0.6 + i * r * 0.3); g.stroke(); }
    } else if (kieu === 'cung') {
      g.strokeRect(cx - r * 0.7, cy, r * 1.4, r * 0.7);
      g.beginPath(); g.moveTo(cx, cy - r); g.lineTo(cx, cy - r * 0.1); g.moveTo(cx - r * 0.3, cy - r * 0.4); g.lineTo(cx, cy - r * 0.1); g.lineTo(cx + r * 0.3, cy - r * 0.4); g.stroke();
    }
    g.restore();
  }

  /* thẻ một thuộc tính: biểu tượng bên trái, tên thuộc tính nhỏ, giá trị to */
  function theThuocTinh(kieu, ten, giaTri) {
    var W = 640, H = 150;
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d');
    g.fillStyle = 'rgba(4,16,48,.9)';
    boTron(g, 3, 3, W - 6, H - 6, 22); g.fill();
    g.strokeStyle = 'rgba(0,229,255,.75)'; g.lineWidth = 3; g.stroke();
    veBieuTuongNho(g, kieu, 78, H / 2, 46);
    g.textBaseline = 'middle';
    g.fillStyle = '#7fe8ff';
    g.font = '700 26px "Be Vietnam Pro", sans-serif';
    try { g.letterSpacing = '5px'; } catch (e) {}
    g.fillText(ten, 150, 44);
    try { g.letterSpacing = '0px'; } catch (e) {}
    g.fillStyle = '#ffffff';
    g.font = '600 46px "Be Vietnam Pro", sans-serif';
    g.fillText(giaTri, 150, 100, W - 170);
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    var m = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.225),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, fog: false }));
    m.renderOrder = 5;
    return m;
  }

  function dungThongTin3(ctx) {
    var g = ctx.scene, T = ctx.text.t3, v = o.t3;
    var tamTao = new THREE.Vector3(TAO.x, 1.35, TAO.z);

    ['mat', 'tai', 'tay'].forEach(function (id) {
      var G = v.giac[id];
      G.nhom = new THREE.Group();
      G.nhom.position.set(G.x, 2.42, G.z);
      g.add(G.nhom);
      G.the = T.chiTiet[id].map(function (d, k) {
        var m = theThuocTinh(d[0], d[1], d[2]);
        m.userData.y = (2 - k) * 0.25;                         // thuộc tính đầu tiên ở trên cùng
        m.position.y = m.userData.y;
        G.nhom.add(m);
        return m;
      });
      G.daHien = 0;
    });

    /* mắt: tia nhìn từ con mắt chiếu vào quả táo */
    var M = v.giac.mat, dau = new THREE.Vector3(M.x, 1.65, M.z);
    var huong = tamTao.clone().sub(dau), dai = huong.length();
    v.matTiaNhin = new THREE.MeshBasicMaterial({ color: 0x7fe8ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    v.tiaNhin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.16, dai, 16, 1, true), v.matTiaNhin);
    v.tiaNhin.position.copy(dau).addScaledVector(huong, 0.5);
    v.tiaNhin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), huong.clone().normalize());
    g.add(v.tiaNhin);

    /* tai: sóng âm lan ra từ quả táo về phía cột tai */
    v.songAm = [0, 1, 2].map(function () {
      var r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 6, 48), new THREE.MeshBasicMaterial({
        color: 0x7fe8ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      r.position.copy(tamTao);
      r.lookAt(v.giac.tai.x, 1.35, v.giac.tai.z);
      g.add(r);
      return r;
    });

    /* tay: gợn chạm trên vỏ táo, phía cột tay */
    var Y = v.giac.tay, huongTay = new THREE.Vector3(Y.x - TAO.x, 0, Y.z - TAO.z).normalize();
    v.gonCham = [0, 1].map(function () {
      var r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.01, 6, 40), new THREE.MeshBasicMaterial({
        color: 0xbfe8ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      r.position.copy(tamTao).addScaledVector(huongTay, 0.3);
      r.lookAt(Y.x, 1.35, Y.z);
      g.add(r);
      return r;
    });

    /* tri giác → biểu tượng: thẻ gộp phía trên hình quả táo */
    v.theGop = bang([{ t: T.theTriGiac[0], co: 54, mau: '#7fe8ff', dam: 700, gian: 10 },
                     { t: T.theTriGiac[1], co: 60, mau: '#ffffff', dam: 600 }], 2.3, 0.42,
                    { nen: 'rgba(4,16,48,.9)', vien: 'rgba(0,229,255,.8)' });
    v.theGop.position.set(TAO.x, 2.82, TAO.z);
    v.theGop.material.opacity = 0;
    v.theGop.renderOrder = 5;
    g.add(v.theGop);
    v.theGopKieu = 1;

    /* lý tính: ba thẻ quanh bộ não */
    var yNao = BE.cao + 1.9;
    /* lùi ra sau bộ não, sát nhau — đứng ở mép bệ vẫn thấy trọn cả ba */
    v.theLy = [[-1.2, yNao + 0.5, NAO.z - 0.6], [0, yNao + 1.1, NAO.z - 0.7], [1.2, yNao + 0.5, NAO.z - 0.6]].map(function (p) {
      var b = bang([{ t: '?', co: 54 }, { t: '', co: 50 }], 1.3, 0.38, { nen: 'rgba(30,6,60,.9)', vien: 'rgba(190,120,255,.85)' });
      b.position.set(p[0], p[1], p[2]);
      b.material.opacity = 0;
      b.renderOrder = 5;
      b.userData.kieu = '';
      g.add(b);
      return b;
    });
  }

  /* tiếng "rộp" khi cắn — vài tiếng tách ngắn dồn dập */
  function amRop(ctx) {
    var a = ctx.audio.ngu && ctx.audio.ngu();
    if (!a) return;
    var t = a.currentTime;
    for (var i = 0; i < 7; i++) {
      var n = Math.floor(a.sampleRate * 0.03);
      var b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
      for (var k = 0; k < n; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / n, 3);
      var s = a.createBufferSource(); s.buffer = b;
      var f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800 + Math.random() * 2400; f.Q.value = 1.5;
      var gg = a.createGain(); gg.gain.value = 0.12 + Math.random() * 0.1;
      s.connect(f); f.connect(gg); gg.connect(a.destination);
      s.start(t + i * 0.035 + Math.random() * 0.02);
    }
  }

  /* ═══════════ BỘ NÃO VÀ CÁC TRI THỨC QUANH NÓ ═══════════
     Bộ não: hai bán cầu có khe chia và nếp cuộn, tiểu não, thân não; bên
     trong là mạng nơron với xung điện chạy dọc dây thần kinh — đều đặn khi
     tư duy, hỗn loạn và đỏ lên khi tư duy rỗng.
     Ba cấu trúc tri thức, nối với não bằng dây thần kinh:
       khái niệm  ô tinh thể lục giác mang hình quả táo; các thuộc tính bay
                  vào và nhập lại — sự KHÁI QUÁT
       phán đoán  hai nút "táo chín" → "vỏ đỏ, thịt ngọt": LIÊN KẾT hai
                  khái niệm bằng một mũi tên
       suy luận   tam đoạn luận: hai tiền đề hội tụ về một KẾT LUẬN mới   */

  /* bán cầu não: cầu biến dạng thành bầu dục, ép phẳng mặt trong, khắc nếp cuộn */
  function banCauNao(phai) {
    var geo = new THREE.SphereGeometry(1, 96, 64);
    var p = geo.attributes.position, v = new THREE.Vector3();
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      var x = v.x, y = v.y, z = v.z;
      /* nếp cuộn: hai sóng đan nhau, lấy trị tuyệt đối để thành rãnh sâu */
      var nep = Math.sin(y * 11 + Math.sin(z * 7) * 2.2) * Math.sin(z * 13 + Math.sin(y * 5 + x * 3) * 2.0);
      var r = 1 + 0.05 * nep - 0.045 * Math.abs(nep);
      var trong = phai ? -x : x;                    // phía khe giữa hai bán cầu
      var ep = trong > 0.6 ? 1 - 0.3 * (trong - 0.6) / 0.4 : 1;
      x = x * r * 0.36 * ep;
      y = y * r * 0.42 * (y < -0.3 ? 0.8 : 1);
      z = z * r * 0.62;
      p.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /* chữ nhỏ trên nền trong suốt, cho các cấu trúc tri thức */
  function chuNho(chu, rong, cao, mau, nen) {
    var m = bang([{ t: chu, co: 110, mau: mau || '#ffffff', dam: 700, gian: 2 }], rong, cao,
                 nen ? { nen: nen, vien: 'rgba(190,120,255,.8)' } : null);
    m.material.opacity = 0;
    m.renderOrder = 6;
    return m;
  }

  function dayThanKinh(g, tu, den, mau) {
    var dc = new THREE.QuadraticBezierCurve3(tu, tu.clone().lerp(den, 0.5).add(new THREE.Vector3(0, 0.35, 0.15)), den);
    var pts = dc.getPoints(24);
    var m = new THREE.LineBasicMaterial({ color: mau, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    var l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m);
    g.add(l);
    return { duong: dc, mat: m };
  }

  function dungNaoChiTiet(ctx, yNao) {
    var g = ctx.scene, T = ctx.text.t3, v = o.t3;
    var tam = new THREE.Vector3(NAO.x, yNao, NAO.z);

    /* ---- bộ não ---- */
    v.nao = new THREE.Group();
    v.nao.position.copy(tam);
    g.add(v.nao);
    v.matNao = mat(0xc8a8ff, { emissive: 0x6a1ac0, emissiveIntensity: 0.18, roughness: 0.55, metalness: 0.05,
                               transparent: true, opacity: 0.82, depthWrite: false });
    [false, true].forEach(function (phai) {
      var m = new THREE.Mesh(banCauNao(phai), v.matNao);
      m.position.x = phai ? 0.3 : -0.3;              // khe giữa hai bán cầu hẹp như não thật
      v.nao.add(m);
    });
    var geoTieu = new THREE.SphereGeometry(1, 48, 32), pp = geoTieu.attributes.position, vv = new THREE.Vector3();
    for (var i = 0; i < pp.count; i++) {                       // tiểu não: gờ ngang dày đặc
      vv.fromBufferAttribute(pp, i);
      vv.multiplyScalar(1 + 0.05 * Math.sin(vv.y * 40));
      pp.setXYZ(i, vv.x * 0.36, vv.y * 0.19, vv.z * 0.24);
    }
    geoTieu.computeVertexNormals();
    var tieuNao = new THREE.Mesh(geoTieu, v.matNao);
    tieuNao.position.set(0, -0.27, -0.42);
    v.nao.add(tieuNao);
    var thanNao = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.5, 16), v.matNao);
    thanNao.position.set(0, -0.48, -0.22);
    thanNao.rotation.x = 0.35;
    v.nao.add(thanNao);
    v.naoQuang = quang(0x9900ff, 1.8, 0.2);
    /* ánh đèn riêng rọi bộ não để nếp cuộn hiện khối */
    var denNao = new THREE.PointLight(0xe8d8ff, 1.2, 4, 1.6);
    denNao.position.copy(tam).add(new THREE.Vector3(0.6, 1.0, 1.4));
    g.add(denNao);
    v.naoQuang.position.copy(tam);
    g.add(v.naoQuang);

    /* ---- mạng nơron bên trong ---- */
    var nut = [];
    while (nut.length < 70) {
      var x = (Math.random() * 2 - 1) * 0.7, y = (Math.random() * 2 - 1) * 0.38, z = (Math.random() * 2 - 1) * 0.55;
      var hx = Math.abs(x) - 0.3;
      if ((hx * hx) / 0.09 + (y * y) / 0.13 + (z * z) / 0.3 < 1) nut.push(new THREE.Vector3(x, y, z));
    }
    var canh = [];
    nut.forEach(function (a, ia) {
      nut.map(function (b, ib) { return [a.distanceTo(b), ib]; })
         .sort(function (m, n) { return m[0] - n[0]; })
         .slice(1, 4)
         .forEach(function (d) { if (ia < d[1]) canh.push([ia, d[1]]); });
    });
    var mang = new Float32Array(canh.length * 6);
    canh.forEach(function (c, k) {
      mang.set([nut[c[0]].x, nut[c[0]].y, nut[c[0]].z, nut[c[1]].x, nut[c[1]].y, nut[c[1]].z], k * 6);
    });
    var geoMang = new THREE.BufferGeometry();
    geoMang.setAttribute('position', new THREE.BufferAttribute(mang, 3));
    v.matMang = new THREE.LineBasicMaterial({ color: 0x7fe8ff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false });
    v.nao.add(new THREE.LineSegments(geoMang, v.matMang));
    var geoNut = new THREE.BufferGeometry().setFromPoints(nut);
    v.matNut = new THREE.PointsMaterial({ color: 0xd8f4ff, size: 0.035, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false });
    v.nao.add(new THREE.Points(geoNut, v.matNut));
    v.nutNao = nut;
    v.lienKe = nut.map(function () { return []; });
    canh.forEach(function (c) { v.lienKe[c[0]].push(c[1]); v.lienKe[c[1]].push(c[0]); });
    /* xung điện: đi từ nút này sang nút kề, nối tiếp không ngừng */
    v.xungNao = [];
    for (i = 0; i < 26; i++) {
      var sp = quang(0x9fe8ff, 0.07, 0);
      v.nao.add(sp);
      var a0 = Math.random() * nut.length | 0;
      v.xungNao.push({ sp: sp, tu: a0, den: v.lienKe[a0][0] != null ? v.lienKe[a0][0] : a0, u: Math.random() });
    }

    /* ---- ba cấu trúc tri thức ---- */
    var VI_TRI = [[-1.2, yNao - 0.05, NAO.z - 0.3], [0, yNao + 0.7, NAO.z - 0.75], [1.2, yNao - 0.05, NAO.z - 0.3]];
    v.triThuc = VI_TRI.map(function (p) {
      var nhom = new THREE.Group();
      nhom.position.set(p[0], p[1], p[2]);
      g.add(nhom);
      return { nhom: nhom, hien: 0, phan: [] };
    });

    /* khái niệm: ô lục giác mang hình quả táo, các thuộc tính bay vào */
    var KN = v.triThuc[0];
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var gg = c.getContext('2d');
    var q = gg.createRadialGradient(110, 100, 6, 128, 120, 70);
    q.addColorStop(0, '#ff9a8a'); q.addColorStop(1, '#a01020');
    gg.fillStyle = q; gg.beginPath(); gg.arc(128, 116, 62, 0, Math.PI * 2); gg.fill();
    gg.strokeStyle = '#6a4a1a'; gg.lineWidth = 8; gg.beginPath(); gg.moveTo(128, 56); gg.lineTo(136, 30); gg.stroke();
    gg.fillStyle = '#ffffff'; gg.font = '700 44px "Be Vietnam Pro", sans-serif'; gg.textAlign = 'center';
    gg.fillText(T.knNhan, 128, 232);
    var texKN = new THREE.CanvasTexture(c);
    texKN.encoding = THREE.sRGBEncoding;
    KN.mat = new THREE.MeshBasicMaterial({ map: texKN, transparent: true, opacity: 0, depthWrite: false });
    var luc = new THREE.Mesh(new THREE.CircleGeometry(0.26, 6), KN.mat);
    luc.rotation.z = Math.PI / 6;
    luc.renderOrder = 6;
    KN.nhom.add(luc);
    KN.vienMat = new THREE.LineBasicMaterial({ color: 0xe2b8ff, transparent: true, opacity: 0 });
    var vien = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      [0, 1, 2, 3, 4, 5].map(function (k) { var a = k / 6 * Math.PI * 2 + Math.PI / 6; return new THREE.Vector3(Math.cos(a) * 0.28, Math.sin(a) * 0.28, 0.01); })), KN.vienMat);
    KN.nhom.add(vien);
    KN.thuocTinh = T.khaiQuat.map(function (ten, k) {
      var m = chuNho(ten, 0.26, 0.08, '#ffe2a0');
      m.userData.pha = k / T.khaiQuat.length * Math.PI * 2;
      KN.nhom.add(m);
      return m;
    });

    /* phán đoán: nút "táo chín" → nút "vỏ đỏ, thịt ngọt" */
    var PD = v.triThuc[1];
    PD.nutMat = new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0 });
    [-0.34, 0.34].forEach(function (x, k) {
      var cau = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), PD.nutMat);
      cau.position.x = x;
      PD.nhom.add(cau);
      var nh = chuNho(T.pdNut[k], 0.5, 0.1, '#ffffff');
      nh.position.set(x, -0.13, 0);
      PD.nhom.add(nh);
      PD.phan.push(nh);
    });
    PD.lienMat = new THREE.MeshBasicMaterial({ color: 0xe2b8ff, transparent: true, opacity: 0 });
    var lien = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.52, 8), PD.lienMat);
    lien.rotation.z = Math.PI / 2;
    PD.nhom.add(lien);
    var mui = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 12), PD.lienMat);
    mui.rotation.z = -Math.PI / 2; mui.position.x = 0.25;
    PD.nhom.add(mui);
    PD.xung = quang(0xffffff, 0.08, 0);
    PD.nhom.add(PD.xung);

    /* suy luận: hai tiền đề hội tụ về kết luận */
    var SL = v.triThuc[2];
    [[0, 0.24], [0, 0.04], [0, -0.24]].forEach(function (p, k) {
      var nh = chuNho(T.slDong[k], 0.7, 0.13, k === 2 ? '#ffd27a' : '#ffffff', k === 2 ? 'rgba(60,30,0,.85)' : 'rgba(30,6,60,.85)');
      nh.position.set(p[0], p[1], 0);
      SL.nhom.add(nh);
      SL.phan.push(nh);
    });
    SL.lienMat = new THREE.LineBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0 });
    SL.nhom.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.3, 0.18, 0), new THREE.Vector3(-0.12, -0.17, 0),
      new THREE.Vector3(0.3, -0.02, 0), new THREE.Vector3(0.12, -0.17, 0)
    ]), SL.lienMat));

    /* dây thần kinh từ não tới từng cấu trúc, có xung chạy dọc */
    v.day = VI_TRI.map(function (p, k) {
      var tu = tam.clone().add(new THREE.Vector3([-0.55, 0, 0.55][k], [0.05, 0.4, 0.05][k], -0.1));
      var d = dayThanKinh(g, tu, new THREE.Vector3(p[0], p[1], p[2]), 0x9fe8ff);
      d.xung = quang(0xffffff, 0.09, 0);
      g.add(d.xung);
      d.u = Math.random();
      return d;
    });
  }

  function capNhatNao(dt, ctx, rong) {
    var t = ctx.clock, v = o.t3, cam = ctx.camera.position;
    var dangNghi = S.giu === 'nao';
    var hoatDong = Math.min(1, S.ly + (dangNghi ? 0.4 : 0) + rong);

    /* não thở nhẹ, đung đưa; rỗng thì chập chờn đỏ */
    v.nao.rotation.y = Math.sin(t * 0.35) * 0.18;
    v.nao.scale.setScalar(1 + Math.sin(t * 1.6) * 0.012 + (dangNghi ? 0.02 : 0));
    v.matNao.emissiveIntensity = 0.15 + S.ly * 0.35 + Math.sin(t * 2) * 0.05 + rong * 0.7;
    v.matNao.emissive.setHex(rong > 0.15 ? 0xd02050 : 0x7a1fd6);
    v.naoQuang.material.opacity = 0.15 + S.ly * 0.25;
    v.matMang.opacity = 0.18 + hoatDong * 0.45;
    v.matMang.color.setHex(rong > 0.15 ? 0xff6080 : 0x7fe8ff);
    v.matNut.opacity = 0.4 + hoatDong * 0.5;

    /* xung điện chạy trong mạng nơron */
    var tocXung = 0.6 + hoatDong * 3.5 + (rong > 0.15 ? 3 : 0);
    v.xungNao.forEach(function (x, k) {
      x.u += dt * tocXung * (0.7 + (k % 5) * 0.12);
      if (x.u >= 1) {
        x.u -= 1;
        x.tu = x.den;
        var ke = v.lienKe[x.tu];
        x.den = rong > 0.15 ? (Math.random() * v.nutNao.length | 0) : (ke.length ? ke[Math.random() * ke.length | 0] : x.tu);
      }
      x.sp.position.lerpVectors(v.nutNao[x.tu], v.nutNao[x.den], x.u);
      x.sp.material.opacity = (0.25 + hoatDong * 0.75) * (k < 8 + hoatDong * 18 ? 1 : 0);
      x.sp.material.color.setHex(rong > 0.15 ? 0xff6080 : 0x9fe8ff);
    });

    /* ba cấu trúc tri thức: hiện theo từng bước tư duy */
    v.triThuc.forEach(function (tt, k) {
      var day = S.lyBuoc > k;
      tt.hien = A.damp(tt.hien, day ? 1 : (rong > 0.15 ? 0.25 : 0), 3, dt);
      tt.nhom.rotation.y = Math.atan2(cam.x - tt.nhom.position.x, cam.z - tt.nhom.position.z);
      tt.nhom.position.y += Math.sin(t * 1.2 + k) * 0.0008;
    });
    var KN = v.triThuc[0], e0 = KN.hien;
    KN.mat.opacity = e0;
    KN.vienMat.opacity = e0 * (0.6 + 0.4 * Math.sin(t * 3));
    KN.vienMat.color.setHex(rong > 0.15 && S.lyBuoc < 1 ? 0xff6080 : 0xe2b8ff);
    KN.thuocTinh.forEach(function (m, j) {
      /* khái quát: các thuộc tính xoáy vào tâm ô lục giác rồi tan vào */
      var u = (t * 0.25 + j / KN.thuocTinh.length) % 1;
      var r = 0.62 * (1 - u), a = m.userData.pha + u * 4;
      m.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.75, 0.02);
      m.material.opacity = e0 * Math.min(1, (1 - u) * 1.6) * (S.lyBuoc >= 1 ? 1 : 0);
    });
    var PD = v.triThuc[1], e1 = PD.hien;
    PD.nutMat.opacity = e1;
    PD.lienMat.opacity = e1 * 0.9;
    PD.phan.forEach(function (m) { m.material.opacity = e1; });
    var uu = (t * 0.7) % 1;
    PD.xung.position.set(-0.34 + uu * 0.62, 0, 0.01);
    PD.xung.material.opacity = e1 * (1 - uu);
    var SL = v.triThuc[2], e2 = SL.hien;
    SL.phan.forEach(function (m, j) { m.material.opacity = e2 * A.doan(e2, j * 0.25, j * 0.25 + 0.4); });
    SL.lienMat.opacity = e2 * A.doan(e2, 0.4, 0.8);

    /* dây thần kinh: sáng khi cấu trúc tương ứng đã hình thành hoặc đang tư duy */
    v.day.forEach(function (d, k) {
      var sang = S.lyBuoc > k ? 0.55 : (dangNghi ? 0.25 : 0.06);
      d.mat.opacity = A.damp(d.mat.opacity, sang, 4, dt);
      d.mat.color.setHex(rong > 0.15 ? 0xff6080 : 0x9fe8ff);
      d.u = (d.u + dt * (0.5 + hoatDong)) % 1;
      d.xung.position.copy(d.duong.getPoint(d.u));
      d.xung.material.opacity = d.mat.opacity * 1.4;
    });
  }

  function dungTram3(ctx) {
    var g = ctx.scene, T = ctx.text.t3, P = ctx.player;
    o.t3 = {};

    [0.9, 4.6].forEach(function (y, k) {
      [-1, 1].forEach(function (s) {
        dayNeon(g, s * (X_TUONG - 0.02), y, -5.5, 10.6, s * Math.PI / 2, k ? 0x9900ff : 0x0066ff, k ? -0.35 : 0.5);
      });
    });
    TX.domSang(g, {
      soLuong: 90, tam: [0, 2.8, -5.5], rong: [11, 5, 10.5],
      mau: [0x00e5ff, 0x0066ff, 0x9900ff], co: [8, 20], doMo: 0.7, troi: 0.3
    });

    /* --- quả táo thật trên bệ --- */
    var matTru = mat(0x1a2050, { roughness: 0.3, metalness: 0.6 });
    var beT = tru(0.25, 0.32, 1.0, matTru, 20);
    beT.position.set(TAO.x, 0.5, TAO.z);
    g.add(beT);
    o.t3.matTao = mat(0xd02a2e, { roughness: 0.35, transparent: true, opacity: 1 });
    o.t3.tao = quaTao(1.6, o.t3.matTao);
    o.t3.tao.position.set(TAO.x, 1.35, TAO.z);
    g.add(o.t3.tao);
    o.t3.taoQuang = quang(0xff6060, 1.1, 0.25);
    o.t3.taoQuang.position.set(TAO.x, 1.35, TAO.z);
    g.add(o.t3.taoQuang);
    P.blockers.push({ x: TAO.x, z: TAO.z, r: 0.45 });

    var bCam = bang([
      { t: T.camTinh[0], co: 74, mau: '#9fe8ff', dam: 700, gian: 8 },
      { t: T.camTinh[1], co: 48, mau: '#7fb0ff', serif: true, nghieng: true, dam: 500 }
    ], 3.0, 0.75);
    bCam.position.set(0, 3.25, TAO.z);
    g.add(bCam);

    /* hình ảnh trọn vẹn (tri giác) rồi đọng lại (biểu tượng) */
    o.t3.matHolo = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    o.t3.holo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 2), o.t3.matHolo);
    o.t3.holo.scale.set(1, 0.9, 1);
    o.t3.holo.position.set(TAO.x, 2.25, TAO.z);
    g.add(o.t3.holo);

    /* --- ba giác quan --- */
    o.t3.giac = {};
    [['mat', -2.3, -3.4], ['tai', 0, -2.9], ['tay', 2.3, -3.4]].forEach(function (d) {
      var id = d[0], x = d[1], z = d[2];
      var cot = tru(0.08, 0.14, 1.3, matTru, 12);
      cot.position.set(x, 0.65, z);
      g.add(cot);
      var matIcon = new THREE.MeshBasicMaterial({ map: bieuTuongGiac(id), transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
      var icon = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), matIcon);
      icon.position.set(x, 1.65, z);
      g.add(icon);
      var vong = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.4, 40), new THREE.MeshBasicMaterial({
        color: 0x00e5ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false
      }));
      vong.position.copy(icon.position);
      g.add(vong);
      var nhan = bang([{ t: T.giac[id].ten, co: 120, mau: '#9fe8ff', dam: 700, gian: 10 }], 1.0, 0.3);
      nhan.position.set(x, 2.15, z);
      g.add(nhan);
      o.t3.giac[id] = { icon: icon, matIcon: matIcon, vong: vong, nhan: nhan, x: x, z: z };
      P.blockers.push({ x: x, z: z, r: 0.3 });
      o.vat.push({ id: id, tram: 2, x: x, z: z, tam: 1.4, goiY: T.goiYGiac,
                   dieuKien: function () { return !trenBe(P.pos.x, P.pos.z); } });
    });
    o.t3.dong = TX.heHat(g, 160, 0x00e5ff, 0.06, 0.9);
    dungThongTin3(ctx);

    /* --- bệ hai tầng --- */
    var dai = BE.zTruoc - BE.zSau;
    var matBe = mat(0x0a1440, { roughness: 0.3, metalness: 0.5, emissive: 0x0a1a6a, emissiveIntensity: 0.4 });
    var be = hop(BE.x * 2, BE.cao, dai, matBe);
    be.position.set(0, BE.cao / 2, (BE.zTruoc + BE.zSau) / 2);
    be.receiveShadow = true;
    g.add(be);
    var matMep = new THREE.MeshBasicMaterial({ color: 0x9900ff });
    var mep = hop(BE.x * 2 + 0.04, 0.05, 0.05, matMep);
    mep.position.set(0, BE.cao + 0.02, BE.zTruoc);
    g.add(mep);
    var bLy = bang([
      { t: T.lyTinh[0], co: 74, mau: '#e2b8ff', dam: 700, gian: 8 },
      { t: T.lyTinh[1], co: 48, mau: '#c79bff', serif: true, nghieng: true, dam: 500 }
    ], 3.6, 0.9);
    bLy.position.set(0, BE.cao / 2, BE.zTruoc + 0.01);
    g.add(bLy);

    /* bệ nhảy */
    o.t3.matBat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
    var bat = tru(0.7, 0.75, 0.08, mat(0x10205a, { metalness: 0.6, roughness: 0.3 }), 32);
    bat.position.set(BAT.x, 0.04, BAT.z);
    g.add(bat);
    o.t3.vongBat = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.68, 40), o.t3.matBat);
    o.t3.vongBat.rotation.x = -Math.PI / 2;
    o.t3.vongBat.position.set(BAT.x, 0.09, BAT.z);
    g.add(o.t3.vongBat);
    o.t3.cotBat = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 2.2, 32, 1, true), new THREE.MeshBasicMaterial({
      color: 0x00e5ff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    }));
    o.t3.cotBat.position.set(BAT.x, 1.1, BAT.z);
    g.add(o.t3.cotBat);

    /* --- bộ não 3D trên tầng lý tính --- */
    var yNao = BE.cao + 1.9;
    var beN = tru(0.35, 0.5, 1.0, matTru, 20);
    beN.position.set(NAO.x, BE.cao + 0.5, NAO.z);
    g.add(beN);
    dungNaoChiTiet(ctx, yNao);
    o.vat.push({ id: 'nao', tram: 2, x: NAO.x, z: NAO.z, tam: 2.6, goiY: T.goiYNao,
                 dieuKien: function () { return trenBe(P.pos.x, P.pos.z); } });

    /* tia "trở về thực tiễn": từ bộ não chạy ngược về xưởng ở trạm II */
    var dai2 = 6.4 - NAO.z;
    o.t3.matTia = new THREE.MeshBasicMaterial({ color: 0xffb040, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    o.t3.tia = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, dai2, 8, 1, true), o.t3.matTia);
    o.t3.tia.rotation.x = Math.PI / 2;
    o.t3.tia.position.set(0, 3.25, NAO.z + dai2 / 2);
    o.t3.tia.scale.y = 0.001;
    g.add(o.t3.tia);
  }

  /* ═══════════ TRẠM IV — thánh đường chân lý ═══════════ */

  /* ═══════════ MÔ HÌNH CHO BA MỆNH ĐỀ Ở TRẠM IV ═══════════
     0  mô hình địa tâm: Trái Đất ở giữa, các thiên thể quay trên vòng đồng.
        Kiểm nghiệm: quay loạn, vòng loé đỏ, vỡ tan — mô hình nhật tâm thế chỗ.
     1  đun nước ở hai độ cao: mực nước biển (1 atm) và đỉnh Everest.
        Kiểm nghiệm: bình dưới sôi ở 100 °C, bình trên núi sôi ở khoảng 70 °C.
     2  con lắc Newton: đung đưa đúng như dự đoán; rồi một vòng "thuyết
        tương đối" hiện ra bao quanh — mở rộng chứ không xoá bỏ.            */

  var MAU_THIEN_THE = [
    ['Mặt Trăng', 0xbfbfbf, 0.022], ['Sao Thuỷ', 0xa08a70, 0.02], ['Sao Kim', 0xf0d8a0, 0.026],
    ['Mặt Trời', 0xffc040, 0.055], ['Sao Hoả', 0xd0603a, 0.024], ['Sao Mộc', 0xd8b080, 0.04], ['Sao Thổ', 0xe0c890, 0.035]
  ];

  function quyDao(r, mau, op) {
    return new THREE.Mesh(new THREE.TorusGeometry(r, 0.004, 6, 72),
      new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: op }));
  }

  function dungMoHinh(g, k, x, z, T) {
    var M = { nhom: new THREE.Group() };
    M.nhom.position.set(x, 0.9, z);
    g.add(M.nhom);
    var matVang = TX.vatLieuVang();

    if (k === 0) {
      /* --- địa tâm --- */
      var truc = tru(0.012, 0.03, 0.55, matVang, 8); truc.position.y = 0.27; M.nhom.add(truc);
      M.diaTam = new THREE.Group(); M.diaTam.position.y = 0.55; M.nhom.add(M.diaTam);
      var traiDat = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 16), mat(0x3a7ad0, { emissive: 0x1a4a8a, emissiveIntensity: 0.4, roughness: 0.5 }));
      M.diaTam.add(traiDat);
      M.vong = []; M.thienThe = [];
      MAU_THIEN_THE.forEach(function (d, j) {
        var r = 0.15 + j * 0.065;
        var nghieng = new THREE.Group();
        nghieng.rotation.set(Math.PI / 2 + (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.25, 0);
        M.diaTam.add(nghieng);
        var vong = quyDao(r, 0xc9a24a, 0.75);
        nghieng.add(vong);
        var tt = new THREE.Mesh(new THREE.SphereGeometry(d[2], 16, 12),
          mat(d[1], { emissive: d[1], emissiveIntensity: j === 3 ? 0.9 : 0.2, roughness: 0.6 }));
        nghieng.add(tt);
        M.vong.push(vong);
        M.thienThe.push({ m: tt, r: r, a: Math.random() * 6.28, toc: 1.2 / (1 + j * 0.45) });
      });
      /* --- nhật tâm: thay thế sau khi địa tâm bị bác bỏ --- */
      M.nhatTam = new THREE.Group(); M.nhatTam.position.y = 0.55; M.nhatTam.visible = false; M.nhatTam.scale.setScalar(0.001);
      M.nhom.add(M.nhatTam);
      M.nhatTam.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffc040 })));
      var qMT = quang(0xffb030, 0.6, 0.6, true); M.nhatTam.add(qMT);
      M.hanhTinh = [[0.18, 0xa08a70, 0.018, 2.2], [0.27, 0xf0d8a0, 0.024, 1.5], [0.37, 0x3a7ad0, 0.032, 1.0], [0.47, 0xd0603a, 0.022, 0.7]]
        .map(function (d) {
          var v2 = quyDao(d[0], 0x6aa0c8, 0.6); v2.rotation.x = Math.PI / 2; M.nhatTam.add(v2);
          var m = new THREE.Mesh(new THREE.SphereGeometry(d[2], 16, 12), mat(d[1], { emissive: d[1], emissiveIntensity: 0.3 }));
          M.nhatTam.add(m);
          return { m: m, r: d[0], a: Math.random() * 6.28, toc: d[3] };
        });
    } else if (k === 1) {
      /* --- đun nước ở hai độ cao --- */
      var matKinh = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.3, depthWrite: false });
      var matNuoc = new THREE.MeshStandardMaterial({ color: 0x4a9aff, transparent: true, opacity: 0.7, roughness: 0.1 });
      var deBien = hop(0.34, 0.05, 0.34, mat(0xe6dccb, { roughness: 0.5 })); deBien.position.set(-0.28, 0.025, 0); M.nhom.add(deBien);
      var nui = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.4, 7), mat(0x7a7268, { roughness: 0.9, flatShading: true }));
      nui.position.set(0.28, 0.2, 0); M.nhom.add(nui);
      var tuyet = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.15, 7), mat(0xffffff, { roughness: 0.6, flatShading: true }));
      tuyet.position.set(0.28, 0.33, 0); M.nhom.add(tuyet);
      M.binh = [[-0.28, 0.05], [0.28, 0.4]].map(function (p, j) {
        var b = new THREE.Group(); b.position.set(p[0], p[1], 0); M.nhom.add(b);
        var coc = tru(0.075, 0.07, 0.17, matKinh, 24); coc.position.y = 0.085; b.add(coc);
        var nuoc = tru(0.068, 0.064, 0.12, matNuoc, 24); nuoc.position.y = 0.065; b.add(nuoc);
        var lua = quang(0x4a8aff, 0.16, 0); lua.position.y = -0.01; b.add(lua);
        /* nhiệt kế */
        var ong = tru(0.008, 0.008, 0.3, matKinh, 8); ong.position.set(0.11, 0.17, 0); b.add(ong);
        var cotDo = tru(0.006, 0.006, 0.28, mat(0xe0303a, { emissive: 0xe0303a, emissiveIntensity: 0.5 }), 8);
        cotDo.position.set(0.11, 0.03, 0); b.add(cotDo);
        var so = bang([{ t: '20 °C', co: 120, mau: '#3a2c14', dam: 700 }], 0.32, 0.1, { nen: 'rgba(255,250,236,.95)', vien: 'rgba(201,162,74,.9)' });
        so.position.set(0, 0.3, 0); b.add(so);
        var ap = bang([{ t: T.apSuat[j], co: 84, mau: '#5e4a20', nghieng: true, serif: true, dam: 600 }], 0.5, 0.08);
        ap.position.set(0, j ? -0.1 : 0.42, 0.18); b.add(ap);
        return { b: b, cotDo: cotDo, so: so, lua: lua, nhietDang: -1, bot: TX.heHat(g, 24, 0xd8f0ff, 0.025, 0) };
      });
      M.binh[1].ap = true;
    } else {
      /* --- con lắc Newton --- */
      var matKhung = mat(0x2a2a30, { roughness: 0.3, metalness: 0.8 });
      var de = hop(0.6, 0.03, 0.26, matKhung); de.position.y = 0.015; M.nhom.add(de);
      [-0.11, 0.11].forEach(function (zz) {
        var xa = hop(0.56, 0.012, 0.012, matKhung); xa.position.set(0, 0.62, zz); M.nhom.add(xa);
        [-0.28, 0.28].forEach(function (xx) {
          var chan = hop(0.012, 0.62, 0.012, matKhung); chan.position.set(xx, 0.31, zz); M.nhom.add(chan);
        });
      });
      /* thép sáng: không có ảnh môi trường để phản chiếu nên không để kim loại quá cao, kẻo đen sì */
      var matThep = mat(0xe8eef4, { roughness: 0.18, metalness: 0.55, emissive: 0x9aa4b0, emissiveIntensity: 0.25 });
      var matDay = new THREE.LineBasicMaterial({ color: 0x9a9aa0 });
      M.qua = [-2, -1, 0, 1, 2].map(function (j) {
        var truc2 = new THREE.Group(); truc2.position.set(j * 0.082, 0.62, 0); M.nhom.add(truc2);
        var cau = new THREE.Mesh(new THREE.SphereGeometry(0.04, 20, 14), matThep); cau.position.y = -0.36; cau.castShadow = true;
        truc2.add(cau);
        truc2.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, -0.11), new THREE.Vector3(0, -0.36, 0), new THREE.Vector3(0, 0, 0.11), new THREE.Vector3(0, -0.36, 0)
        ]), matDay));
        return truc2;
      });
      /* vòng thuyết tương đối — bao quanh, mở rộng */
      M.tuongDoi = new THREE.Group(); M.tuongDoi.position.y = 0.4; M.tuongDoi.scale.setScalar(0.001); M.nhom.add(M.tuongDoi);
      var vTD = quyDao(0.52, 0x40c8ff, 0.85); vTD.rotation.x = Math.PI / 2; M.tuongDoi.add(vTD);
      M.hatAnhSang = quang(0x9fe8ff, 0.12, 0.95, true); M.tuongDoi.add(M.hatAnhSang);
      var nhanTD = bang([{ t: T.tuongDoi, co: 84, mau: '#1a5a8a', nghieng: true, serif: true, dam: 600 }], 0.7, 0.1);
      nhanTD.position.set(0, 0.12, 0.52); M.tuongDoi.add(nhanTD);
    }
    return M;
  }

  function capNhatMoHinh(dt, t, g, k, ctx) {
    var M = g.mo, kiem = S.kiem[k], xong = S.daKiem[k];
    var dangKiem = S.giu === 'gt' + k;
    if (k === 0) {
      if (M.diaTam.visible) {
        var loan = kiem;                                         // càng kiểm nghiệm càng quay loạn
        M.thienThe.forEach(function (tt, j) {
          tt.a += dt * tt.toc * (1 + loan * 6);
          tt.m.position.set(Math.cos(tt.a) * tt.r, Math.sin(tt.a) * tt.r, 0);
        });
        M.diaTam.rotation.z = Math.sin(t * 13) * 0.18 * loan;
        M.diaTam.rotation.x = Math.sin(t * 9) * 0.12 * loan;
        M.vong.forEach(function (v, j) {
          var do_ = loan > 0.55 && Math.sin(t * 20 + j) > 0 ? 1 : 0;
          v.material.color.setHex(do_ ? 0xff4a3a : 0xc9a24a);
        });
      } else {
        var e = Math.min(1, (M.nhatTam.scale.x || 0) + dt * 0.8);
        M.nhatTam.scale.setScalar(A.vot(e, 1.2) || 0.001);
        M.hanhTinh.forEach(function (h) { h.a += dt * h.toc; h.m.position.set(Math.cos(h.a) * h.r, 0, Math.sin(h.a) * h.r); });
      }
    } else if (k === 1) {
      var tienDo = xong ? 1 : Math.min(1, kiem * 1.25);           // tới 80% kiểm nghiệm thì cả hai bình sôi
      M.binh.forEach(function (b, j) {
        var dich = j ? 70 : 100;
        var nhiet = Math.round(20 + (dich - 20) * tienDo);
        if (nhiet !== b.nhietDang) {
          b.nhietDang = nhiet;
          b.so.userData.viet([{ t: (j && tienDo >= 1 ? '≈ ' : '') + nhiet + ' °C', co: 120, mau: tienDo >= 1 ? '#b3261e' : '#3a2c14', dam: 700 }]);
        }
        b.cotDo.scale.y = Math.max(0.05, nhiet / 110);
        b.cotDo.position.y = 0.03 + 0.14 * b.cotDo.scale.y - 0.14 * 0.05;
        b.lua.material.opacity = (dangKiem || xong) ? 0.7 + 0.2 * Math.sin(t * 20 + j) : 0;
        var soi = tienDo >= 1, bot = b.bot, sinh = soi ? 1 : 0;
        var goc = b.b.getWorldPosition(o.tamV || (o.tamV = new THREE.Vector3()));
        for (var i = 0; i < bot.count; i++) {
          if (bot.life[i] > 0) {
            bot.life[i] -= dt * 1.6;
            bot.pos[i * 3 + 1] += dt * 0.25;
            if (bot.life[i] <= 0) bot.an(i);
          } else if (sinh > 0 && Math.random() < 0.5) {
            sinh--;
            bot.life[i] = 1;
            bot.pos[i * 3] = goc.x + (Math.random() - 0.5) * 0.1;
            bot.pos[i * 3 + 1] = goc.y + 0.04;
            bot.pos[i * 3 + 2] = goc.z + (Math.random() - 0.5) * 0.1;
          }
        }
        bot.capNhat();
        bot.pts.material.opacity = soi ? 0.9 : 0;
      });
    } else {
      /* con lắc: quả đầu và quả cuối thay nhau bật ra */
      var bienDo = (xong ? 0.5 : kiem * 0.55);
      var s = Math.sin(t * 5.2);
      M.qua[0].rotation.z = -Math.max(0, -s) * bienDo;
      M.qua[4].rotation.z = Math.max(0, s) * bienDo;
      if (xong) {
        var e2 = Math.min(1, (M.tuongDoi.scale.x || 0) + dt * 0.6);
        M.tuongDoi.scale.setScalar(A.chamDan(e2) || 0.001);
        var a = t * 6;
        M.hatAnhSang.position.set(Math.cos(a) * 0.52, 0, Math.sin(a) * 0.52);   // hạt chạy gần tốc độ ánh sáng
      }
    }
  }

  function dungTram4(ctx) {
    var g = ctx.scene, T = ctx.text.t4, P = ctx.player;
    o.t4 = {};
    var matCam = mat(0xf8f4ec, { roughness: 0.25, metalness: 0.05 });
    var matVang = TX.vatLieuVang();

    /* hàng cột cẩm thạch */
    [[-5.1, -12.6], [5.1, -12.6], [5.1, -17], [-5.1, -21], [5.1, -21]].forEach(function (c) {
      var cot = tru(0.32, 0.36, CAO - 0.4, matCam, 20);
      cot.position.set(c[0], (CAO - 0.4) / 2, c[1]);
      cot.castShadow = true;
      g.add(cot);
      [0.12, CAO - 0.32].forEach(function (y) {
        var dau = hop(0.9, 0.2, 0.9, matVang);
        dau.position.set(c[0], y, c[1]);
        g.add(dau);
      });
      P.blockers.push({ x: c[0], z: c[1], r: 0.5 });
    });
    TX.domSang(g, {
      soLuong: 80, tam: [0, 2.6, -16.5], rong: [11, 5, 10.5],
      mau: [0xe2b866, 0xf0d28a, 0xffffff], co: [10, 24], doMo: 0.6, troi: 0.35
    });

    /* --- viên kim cương chân lý --- */
    var kz = -17.4;
    var beK = tru(0.75, 0.9, 1.0, matCam, 32);
    beK.position.set(0, 0.5, kz);
    beK.castShadow = true;
    beK.receiveShadow = true;
    g.add(beK);
    var vienBe = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.03, 8, 48), matVang);
    vienBe.rotation.x = Math.PI / 2;
    vienBe.position.set(0, 1.0, kz);
    g.add(vienBe);

    o.t4.matKC = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xfff0c0, emissiveIntensity: 0.25, roughness: 0.05, metalness: 0.2,
      flatShading: true, transparent: true, opacity: 0.92
    });
    o.t4.kc = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), o.t4.matKC);
    o.t4.kc.scale.set(1, 1.35, 1);
    o.t4.kc.castShadow = true;
    o.t4.kc.position.set(0, 2.3, kz);
    g.add(o.t4.kc);
    o.t4.kcVien = new THREE.LineSegments(new THREE.EdgesGeometry(o.t4.kc.geometry),
      new THREE.LineBasicMaterial({ color: 0xc9a24a, transparent: true, opacity: 0.9 }));
    o.t4.kc.add(o.t4.kcVien);
    o.t4.kcQuang = quang(0xffd27a, 2.6, 0.45, true);
    o.t4.kcQuang.position.copy(o.t4.kc.position);
    g.add(o.t4.kcQuang);
    /* tia loé (lens flare giả): vài tia mảnh xoay quanh kim cương */
    o.t4.tia = [];
    for (var i = 0; i < 6; i++) {
      var s = quang(0xffe2a0, 1, 0.35, true);
      s.scale.set(0.12, 3.4, 1);
      s.material.rotation = i / 6 * Math.PI;
      s.position.copy(o.t4.kc.position);
      g.add(s);
      o.t4.tia.push(s);
    }
    o.t4.anhKC = new THREE.PointLight(0xfff8dc, 1.2, 8, 1.5);
    o.t4.anhKC.position.set(0, 2.3, kz);
    g.add(o.t4.anhKC);
    o.t4.kz = kz;
    o.t4.bienKC = bang([
      { t: T.kimCuong[0], co: 66, mau: '#8a6420', dam: 700, gian: 6 },
      { t: T.kimCuong[1], co: 44, mau: '#a07a3a', serif: true, nghieng: true, dam: 500 }
    ], 2.4, 0.62);
    o.t4.bienKC.position.set(0, 3.55, kz);
    g.add(o.t4.bienKC);
    P.blockers.push({ x: 0, z: kz, r: 0.95 });
    o.vat.push({ id: 'kc', tram: 3, x: 0, z: kz, tam: 2.1, goiY: T.goiYNhat,
                 dieuKien: function () { return S.soKiem === 3 && !S.daNhat; } });

    /* --- ba tinh thể mệnh đề --- */
    o.t4.gt = [];
    [-3.2, 0, 3.2].forEach(function (x, k) {
      var z = -14.2;
      var be = tru(0.5, 0.56, 0.9, matCam, 32);
      be.position.set(x, 0.45, z);
      be.castShadow = true;
      be.receiveShadow = true;
      g.add(be);
      var mo = dungMoHinh(g, k, x, z, T);
      var bienMH = bang([{ t: T.moHinh[k], co: 90, mau: '#5e4a20', dam: 700, gian: 3 }], 1.0, 0.16,
                        { nen: 'rgba(255,250,236,.95)', vien: 'rgba(201,162,74,.9)' });
      bienMH.position.set(x, 0.62, z + 0.57);
      g.add(bienMH);
      var matTT = new THREE.MeshStandardMaterial({
        color: 0xdfe8ff, emissive: 0x8aa0d0, emissiveIntensity: 0.25, roughness: 0.1, metalness: 0.2,
        flatShading: true, transparent: true, opacity: 0.85
      });
      var tt = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), matTT);
      tt.scale.set(1, 1.6, 1);
      tt.position.set(x, 1.35, z);
      tt.visible = false;                         // tinh thể chân lý chỉ hiện khi mệnh đề qua kiểm nghiệm
      g.add(tt);
      var matChum = new THREE.MeshBasicMaterial({ color: 0xffb030, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
      var chum = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, CAO - 1.4, 16, 1, true), matChum);
      chum.position.set(x, 1.35 + (CAO - 1.4) / 2, z);
      g.add(chum);
      var gt = T.gt[k];
      var bien = bang([
        { t: '“' + gt.menh + '”', co: 60, mau: '#3a2c14', serif: true, dam: 600 },
        { t: gt.ghi, co: 40, mau: '#8a7a5a', nghieng: true, serif: true, dam: 500 }
      ], 2.7, 0.75, { nen: 'rgba(255,252,244,.92)', vien: 'rgba(201,162,74,.9)' });
      bien.position.set(x, 2.45, z);
      g.add(bien);
      o.t4.gt.push({ tt: tt, matTT: matTT, chum: chum, matChum: matChum, bien: bien, bienMH: bienMH, mo: mo,
                     x: x, z: z, bay: -1, vo: false });
      P.blockers.push({ x: x, z: z, r: 0.62 });
      o.vat.push({ id: 'gt' + k, tram: 3, x: x, z: z, tam: 1.6, goiY: T.goiYGt,
                   dieuKien: function () { return !S.daKiem[k]; } });
    });
    o.t4.manh = TX.heHat(g, 160, 0x8a7a5a, 0.05, 0.9);
  }

  /* ═══════════ bia — ấn E để đọc ═══════════ */

  /* ═══════════ đài hướng dẫn ở lối vào mỗi trạm ═══════════
     Đặt ngay trước mặt người chơi khi bước vào trạm. Lại gần thì chữ hiện
     ra từng khối và bay lên: tên trạm → cách chơi → ý nghĩa → phím tắt.
     Chữ luôn quay về phía người nhìn, có nền kính tối để đọc được ở mọi
     trạm. Ấn E cạnh đài để đọc bản đầy đủ.                             */

  var DAI = [[0, 18.0], [0, 8.8], [0, -1.5], [0, -12.6]];
  var CHU_DAY = 1.12, CHU_LUI = 0.4, CHU_XA = 2.3, LUI_MAX = 1.0;   // bảng cách mắt ≥ CHU_XA, nhưng không lùi quá LUI_MAX kẻo chen vào đạo cụ   // chân bảng chữ; bảng lùi ra sau đài, đứng sát vẫn đọc trọn
  var MAU_DAI = ['#c99bff', '#ffb04a', '#5fd8ff', '#e8b84a'];
  var TAM_DAI = 4.5;              // lại gần trong vòng này thì chữ hiện

  function nenKinh(rong, cao, mauVien) {
    var W = 512, H = Math.max(64, Math.round(W * cao / rong));
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var g = c.getContext('2d');
    var l = g.createLinearGradient(0, 0, 0, H);
    l.addColorStop(0, 'rgba(26,14,44,1)'); l.addColorStop(1, 'rgba(12,6,24,1)');
    g.fillStyle = l;
    boTron(g, 3, 3, W - 6, H - 6, 22);
    g.fill();
    g.strokeStyle = mauVien; g.lineWidth = 3; g.stroke();
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return new THREE.Mesh(new THREE.PlaneGeometry(rong, cao),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, fog: false }));
  }

  function dungBia(ctx) {
    var g = ctx.scene, P = ctx.player, HD = ctx.text.huongDan;
    var RONG = 1.5;
    DAI.forEach(function (p, k) {
      var x = p[0], z = p[1], mau = MAU_DAI[k];
      var mauHex = new THREE.Color(mau).getHex();

      /* bục: đế, thân mảnh, mặt trên là một đĩa chiếu sáng */
      var matDai = mat(k === 3 ? 0xece4d4 : 0x2a2238, { roughness: 0.45, metalness: 0.35 });
      var de = tru(0.42, 0.48, 0.12, matDai, 32); de.position.set(x, 0.06, z);
      var than = tru(0.14, 0.2, 0.86, matDai, 24); than.position.set(x, 0.55, z);
      var mat2 = tru(0.36, 0.3, 0.07, matDai, 32); mat2.position.set(x, 1.0, z);
      [de, than, mat2].forEach(function (m) { m.castShadow = true; g.add(m); });
      var vong = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.015, 8, 48), new THREE.MeshBasicMaterial({ color: mauHex }));
      vong.rotation.x = Math.PI / 2; vong.position.set(x, 1.04, z);
      g.add(vong);
      var chum = quang(mauHex, 0.9, 0, k === 3);            // quầng sáng trên mặt đài
      chum.position.set(x, 1.08, z);
      g.add(chum);

      /* chữ: bốn khối, xếp từ trên xuống, sẽ bay lên lần lượt */
      var T = HD.tram[k];
      var khoi = [
        khoiChu([{ t: T.tieuDe, co: 74, mau: '#ffffff', serif: true, dam: 600 }], RONG, { giua: true }),
        khoiChu([{ t: HD.nhanCachChoi, co: 30, mau: mau, dam: 700, gian: 8, sau: 6 }].concat(
          T.cachChoi.map(function (d) { return { t: '•  ' + d, co: 40, mau: '#efe6ff', dam: 400, sau: 4 }; })), RONG),
        khoiChu([{ t: HD.nhanYNghia, co: 30, mau: mau, dam: 700, gian: 8, sau: 6 },
                 { t: T.yNghia, co: 44, mau: '#fff3d6', serif: true, nghieng: true, dam: 500 }], RONG),
        khoiChu([{ t: HD.chan, co: 30, mau: '#bfb2d6', dam: 500, gian: 2 }], RONG, { giua: true })
      ];
      var KHE = 0.04, tong = 0;
      khoi.forEach(function (b) { tong += b.cao; });
      tong += KHE * (khoi.length - 1);

      var chu = new THREE.Group();
      chu.position.set(x, CHU_DAY, z);
      g.add(chu);
      var nen = nenKinh(RONG + 0.16, tong + 0.16, mau);
      nen.position.set(0, tong / 2, -0.01);
      nen.renderOrder = 10;                 // nền vẽ trước, chữ vẽ sau — không để nền đè lên chữ
      chu.add(nen);
      var y = tong;
      khoi.forEach(function (b) {
        b.y = y - b.cao / 2;
        b.mesh.position.set(0, b.y, 0);
        b.mesh.renderOrder = 11;
        chu.add(b.mesh);
        y -= b.cao + KHE;
      });

      var muc = { x: x, z: z, daDoc: false, chu: chu, nen: nen, khoi: khoi, chum: chum, vong: vong, t: 0 };
      o.bia.push(muc);
      /* bảng đang hiện thì chặn tia chú giải — không để thẻ của vật phía sau bật lên */
      nen.userData.nhin = { id: null, dk: function () { return muc.t > 0.4; } };
      o.nhin.push(nen);
      P.blockers.push({ x: x, z: z, r: 0.5 });
    });
  }

  /* chữ hiện ra từng khối, bay lên từ mặt đài; đi xa thì chìm xuống lại */
  function capNhatDai(dt, ctx) {
    var P = ctx.player, cam = ctx.camera.position, t = ctx.clock;
    var vung = soTramDangDung(P.pos.z);
    o.bia.forEach(function (b, k) {
      /* đang dùng đạo cụ hay đang xem cảnh phim thì bảng lui đi, không che tầm nhìn */
      var gan = vung === k && P.distTo(b.x, b.z) < TAM_DAI && !S.ketThuc && !S.phim && !S.gan;
      b.t = gan ? Math.min(3.5, b.t + dt) : Math.max(0, b.t - dt * 2.2);
      b.chu.visible = b.t > 0;
      if (!b.chu.visible) { b.chum.material.opacity = 0.25; return; }
      var dx = b.x - cam.x, dz = b.z - cam.z, d = Math.hypot(dx, dz) || 1;
      var lui = Math.min(LUI_MAX, Math.max(CHU_LUI, CHU_XA - d));   // đứng sát đài thì bảng lùi xa hơn — luôn đọc trọn
      var ax = b.x + dx / d * lui, az = b.z + dz / d * lui;
      b.chu.position.set(ax, CHU_DAY + Math.sin(t * 1.2 + k) * 0.015, az);
      b.chu.rotation.y = Math.atan2(cam.x - ax, cam.z - az);
      var e0 = A.muot(b.t / 0.5);
      b.nen.material.opacity = e0;
      b.nen.scale.y = 0.3 + 0.7 * A.chamDan(b.t / 0.6);
      b.khoi.forEach(function (kh, i) {
        var e = A.muot((b.t - 0.25 - i * 0.35) / 0.7);
        kh.mesh.material.opacity = e;
        kh.mesh.position.y = kh.y - (1 - A.chamDan(e)) * 0.45;      // bay lên vào chỗ
      });
      b.chum.material.opacity = 0.25 + 0.45 * e0 + 0.05 * Math.sin(t * 3);
    });
  }

  /* Sổ khám phá của một trạm: những chú giải người chơi đã mở được.
     Mục chưa mở để khoá — gợi ý rằng trong trạm còn điều để thử. */
  function soKhamPha(ctx, k) {
    var CG = ctx.text.chuGiai, L = TX.VI.game.chuGiai;
    var ids = Object.keys(CG).filter(function (id) { return CG[id].tram === k; });
    var mo = ids.filter(function (id) { return S.daGT[id]; }).length;
    return '<h2>' + L.soKhamPha + ' · ' + mo + '/' + ids.length + '</h2>' +
      ids.map(function (id) {
        var C = CG[id];
        if (!S.daGT[id]) {
          return '<div class="cg-muc khoa"><h3>' + L.khoa + '</h3><p>' + L.khoaMo + '</p></div>';
        }
        return '<div class="cg-muc"><h3>' + C.tieuDe + '<span>' + C.khaiNiem + '</span></h3>' +
               '<p>' + C.nghia + '</p>' +
               '<p class="cg-vs"><b>' + L.viSao + ':</b> ' + C.viSao + '</p></div>';
      }).join('');
  }

  function moBia(ctx, k) {
    var B = ctx.text.bia[k];
    o.bia[k].daDoc = true;
    ctx.hud.the(
      '<div class="eyebrow">' + B.nhan + '</div>' +
      '<h1>' + B.tieuDe + '</h1>' +
      '<dl>' + B.dong.map(function (d) {
        return '<dt>' + d[0] + '</dt><dd>' + d[1] + '</dd>';
      }).join('') + '</dl>' +
      (B.trichDan ? '<blockquote class="quote">' + B.trichDan + '<cite>' + B.nguon + '</cite></blockquote>' : '') +
      (B.ketLuan ? '<p class="note">' + B.ketLuan + '</p>' : '') +
      soKhamPha(ctx, k),
      TX.VI.game.tiepTuc,
      function () { if (!ctx.player.chuotTuDo) ctx.player.grab(); }
    );
  }

  /* ═══════════ tranh treo tường ═══════════ */

  function dungTranh(ctx) {
    var g = ctx.scene;
    var TR = TX.tranhNhanThuc;
    var choDat = [
      { x: -X_TUONG + 0.06, y: 2.9, z: 16.5, ry: Math.PI / 2, sang: 0xd8d0e0 },
      { x: X_TUONG - 0.06,  y: 2.9, z: 16.5, ry: -Math.PI / 2, sang: 0xd8d0e0 },
      { x: X_TUONG - 0.06,  y: 3.7, z: 5.4,  ry: -Math.PI / 2, sang: 0xffffff },
      { x: -X_TUONG + 0.06, y: 3.3, z: -3.0, ry: Math.PI / 2, sang: 0xffffff },
      { x: -X_TUONG + 0.06, y: 3.0, z: -17.0, ry: Math.PI / 2, sang: 0xffffff },
      { x: X_TUONG - 0.06,  y: 3.3, z: -3.0, ry: -Math.PI / 2, sang: 0xffffff }
    ];
    var coAnh = /^https?:$/.test(location.protocol);
    var matVang = TX.vatLieuVang();

    TR.danhSach.forEach(function (tr, i) {
      var d = choDat[i];
      var c = document.createElement('canvas');
      c.width = TR.W; c.height = TR.H;
      tr.ve(c.getContext('2d'));
      var tex = new THREE.CanvasTexture(c);
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = 4;

      var nhom = new THREE.Group();
      nhom.position.set(d.x, d.y, d.z);
      nhom.rotation.y = d.ry;
      g.add(nhom);
      var matTranh = new THREE.MeshBasicMaterial({ map: tex, color: d.sang });
      var tranh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), matTranh);
      tranh.position.z = 0.04;
      tranh.userData.nhin = { id: 'tranh' + i };
      nhom.add(tranh);
      o.nhin.push(tranh);
      [[0, 0.95, 3.4, 0.1], [0, -0.95, 3.4, 0.1], [-1.65, 0, 0.1, 2.0], [1.65, 0, 0.1, 2.0]].forEach(function (v) {
        var k = hop(v[2], v[3], 0.08, matVang);
        k.position.set(v[0], v[1], 0.04);
        nhom.add(k);
      });

      /* ảnh thật, nếu đã có trong assets/nhan-thuc/ */
      if (coAnh) {
        new THREE.TextureLoader().load('assets/nhan-thuc/' + tr.file, function (anh) {
          if (!o || matTranh.map !== tex) { anh.dispose(); return; }
          anh.encoding = THREE.sRGBEncoding;
          anh.anisotropy = 4;
          tex.dispose();
          matTranh.map = anh;
          matTranh.needsUpdate = true;
        }, undefined, function () { /* chưa có ảnh: giữ bản vẽ tạm */ });
      }
    });
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function dungPanel(ctx) {
    ctx.hud.datPanel(
      '<div class="readout">' +
        '<div class="temp"><b id="ntV">0</b><span>%</span></div>' +
        '<div class="phase"><div class="lbl" id="ntL"></div><div class="val" id="ntS"></div></div>' +
      '</div>' +
      '<div class="scale">' +
        '<div class="band" id="ntB" style="display:none"></div>' +
        '<div class="fill" id="ntF"></div>' +
        '<div class="cursor" id="ntC"></div>' +
      '</div>' +
      '<div class="ticks" id="ntT"></div>'
    );
    el = {
      v: document.getElementById('ntV'),
      l: document.getElementById('ntL'),
      s: document.getElementById('ntS'),
      b: document.getElementById('ntB'),
      f: document.getElementById('ntF'),
      c: document.getElementById('ntC'),
      t: document.getElementById('ntT')
    };
  }

  /* ═══════════ va chạm và địa hình ═══════════ */

  function trenBe(x, z) {
    return Math.abs(x) < BE.x && z < BE.zTruoc && z > BE.zSau;
  }

  function nenDat(x, z) {
    return trenBe(x, z) ? BE.cao : 0;
  }

  function chan(pos, px, pz) {
    var lim = X_TUONG - 0.45;
    pos.x = A.kep(pos.x, -lim, lim);
    pos.z = A.kep(pos.z, -Z_DAU + 0.5, Z_DAU - 1.0);

    for (var i = 0; i < VACH.length; i++) {
      var zp = VACH[i];
      var mo = S && S.moKhoa > i + 1;
      var trongCua = CUA_X - 0.3;

      /* đang ở trong lòng cửa: chỉ được đi thẳng, không lách ngang vào tường */
      if (mo && Math.abs(pz - zp) < DAY && Math.abs(px) < trongCua) {
        pos.x = A.kep(pos.x, -trongCua, trongCua);
        continue;
      }
      if (mo && Math.abs(pos.x) < trongCua) continue;

      var truoc = pz - zp, sau = pos.z - zp;
      if (Math.abs(sau) < DAY || truoc * sau < 0) {
        pos.z = zp + (truoc >= 0 ? DAY : -DAY);
      }
    }

    /* tầng lý tính chỉ lên được bằng bệ nhảy; đi xuống thì tự do */
    if (!trenBe(px, pz) && trenBe(pos.x, pos.z)) {
      if (!trenBe(pos.x, pz)) pos.z = pz;
      else if (!trenBe(px, pos.z)) pos.x = px;
      else { pos.x = px; pos.z = pz; }
    }
  }

  /* ═══════════ khi bước vào ═══════════ */

  function onEnter(ctx) {
    ctx.hud.loeSang();
    ctx.audio.buocNhay();

    /* âm thanh trạm I, trạm II và tiếng mở cửa — xem rooms/nhan-thuc-am.js */
    var a = ctx.audio.ngu && ctx.audio.ngu();
    if (a && TX.amNhanThuc) {
      o.am = TX.amNhanThuc.tao(a, {
        nen: [-3.3, 1.4, 15.4], ruong: [0, 1.0, 14.0], guong: [3.3, 1.15, 14.6],
        tram: { x: [-X_TUONG, X_TUONG], z: [VACH[0], Z_DAU] },
        tram2: {
          z: [VACH[1], VACH[0]],
          can: [0, 1.0, 6.4], rang: [-5.4, 2.4, 6.4], lo: [-5.2, 0.7, 1.9], bang: [-4.1, 0.9, 6.1],
          binh: [3.8, 1.3, 7.95], nguyenTu: [3.5, 1.75, 8.42], damDong: [2.3, 1.2, 3.2], co: [4.7, 2.5, 3.6],
          vaiTro: [[-2.7, CUA_CAO + 0.7, 0.2], [-0.9, CUA_CAO + 0.7, 0.2], [0.9, CUA_CAO + 0.7, 0.2], [2.7, CUA_CAO + 0.7, 0.2]]
        },
        tram3: {
          z: [VACH[2], VACH[1]],
          mat: [-2.3, 1.65, -3.4], tay: [2.3, 1.65, -3.4], tao: [TAO.x, 1.35, TAO.z],
          nao: [NAO.x, BE.cao + 1.9, NAO.z], bat: [BAT.x, 0.3, BAT.z]
        },
        cuaDs: VACH.map(function (z) { return [0, 1.8, z]; }),
        cuaRa: [0, 2.1, -Z_DAU + 0.25]
      });
    }
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var P = ctx.player;

    chayHen(dt);
    if (S.nhay) capNhatNhay(dt, ctx);

    /* thứ trong tầm với, gần nhất */
    S.gan = null;
    var tot = 1e9;
    for (var i = 0; i < o.vat.length; i++) {
      var v = o.vat[i];
      if (v.tram >= S.moKhoa) continue;
      if (v.dieuKien && !v.dieuKien()) continue;
      var d = P.distTo(v.x, v.z);
      if (d < v.tam && d < tot) { tot = d; S.gan = v; }
    }
    S.bia = -1;
    for (i = 0; i < o.bia.length; i++) {
      if (soTramDangDung(P.pos.z) === i && P.distTo(o.bia[i].x, o.bia[i].z) < 2.8) S.bia = i;
    }

    var tacDong = (S.gan && !S.nhay && !S.ketThuc && !S.phim) ? P.action() : 0;
    S.giu = tacDong > 0 ? S.gan.id : null;

    logic1(dt, ctx);
    logic2(dt, ctx);
    logic3(dt, ctx);
    logic4(dt, ctx);

    hinh1(dt, ctx);
    hinh2(dt, ctx);
    hinh3(dt, ctx);
    hinh4(dt, ctx);
    hinhChung(dt, ctx);
    khongKhi(dt, ctx);
    nhinVao(dt, ctx);
    if (o.am) o.am.capNhat(dt, ctx.camera, S, o.ngonNen.hien, o.t2);
    hud(dt, ctx);
  }

  /* ═══════════ chú giải theo ánh nhìn ═══════════

     Mỗi đạo cụ, cửa và bức tranh có một vùng nhận diện vô hình. Mỗi khung
     hình bắn một tia từ tâm ngắm (hoặc từ con trỏ khi không khoá được
     chuột); vật nào nằm dưới tâm ngắm thì thẻ chú giải của nó hiện ngay.
     Tường vách cũng nằm trong danh sách để chặn tia, không nhìn xuyên
     sang trạm khác.                                                   */

  var TAM_NHIN = 12;         // chỉ chú giải vật trong vòng 12 m — chừng một trạm
  var NHIN_TRE = 0.1;        // phải nhìn yên 0,1 giây — lia ngang qua thì không bật

  function vungNhin(g, w, h, d, x, y, z, id, dieuKien) {
    var m = new THREE.Mesh(
      d ? new THREE.BoxGeometry(w, h, d) : new THREE.SphereGeometry(w, 12, 8),
      new THREE.MeshBasicMaterial()
    );
    m.position.set(x, y, z);
    m.visible = false;                         // tia vẫn trúng vật ẩn, chỉ là không vẽ
    m.userData.nhin = { id: id, dk: dieuKien };
    g.add(m);
    o.nhin.push(m);
    return m;
  }

  /* id có thể là chuỗi, hoặc hàm trả về chuỗi theo trạng thái hiện tại */
  function idNhin(m) {
    var n = m.userData.nhin;
    if (!n) return null;                       // tường chắn
    if (n.dk && !n.dk()) return undefined;     // vật đang không hiệu lực: bỏ qua, tia đi tiếp
    return typeof n.id === 'function' ? n.id() : n.id;
  }

  function duLieuCG(ctx, id) {
    if (o.cg[id]) return o.cg[id];
    var C, nhan;
    if (id.indexOf('tranh') === 0) {
      C = ctx.text.chuGiaiTranh[+id.slice(5)];
      nhan = 'TRANH · ' + C.khaiNiem;
    } else if (id.indexOf('cot') === 0) {
      C = ctx.text.chuGiaiCot[+id.slice(3)];
      nhan = 'CỘT · ' + C.khaiNiem;
    } else {
      C = ctx.text.chuGiai[id];
      nhan = ctx.text.tram[C.tram][0] + ' · ' + C.khaiNiem;
    }
    o.cg[id] = { nhan: nhan, tieuDe: C.tieuDe, lyThuyet: C.lapLuan || C.nghia };
    return o.cg[id];
  }

  function nhinVao(dt, ctx) {
    var P = ctx.player, id = null;
    if (!S.ketThuc && !S.phim && !ctx.hud.theDangMo() && !ctx.hud.soTayDangMo()) {
      if (P.lockBroken) {
        o.diemNhin.set(P.chuot.x / innerWidth * 2 - 1, -(P.chuot.y / innerHeight) * 2 + 1);
      } else {
        o.diemNhin.set(0, 0);
      }
      o.tia.setFromCamera(o.diemNhin, ctx.camera);
      var trung = o.tia.intersectObjects(o.nhin, false);
      for (var i = 0; i < trung.length; i++) {
        var k = idNhin(trung[i].object);
        if (k === undefined) continue;
        id = k;
        break;
      }
    }

    if (id !== S.nhamId) { S.nhamId = id; S.nhamT = 0; }
    else S.nhamT += dt;

    if (id && S.nhamT >= NHIN_TRE) {
      if (ctx.text.chuGiai[id]) S.daGT[id] = true;      // tranh, cột: không tính vào sổ khám phá
      ctx.hud.nhinChuGiai(duLieuCG(ctx, id));
    } else {
      ctx.hud.nhinChuGiai(null);
    }
  }

  /* vùng nhận diện cho mọi đạo cụ — toạ độ khớp với phần dựng hình */
  function dungVungNhin(ctx) {
    var g = ctx.scene;

    /* màn chắn ở cửa chỉ có hiệu lực khi cửa còn khoá; mở rồi thì tia đi
       xuyên qua, không được chặn mất các vật ở trạm bên kia */
    function cuaKhoa(i) { return function () { return S.moKhoa <= i + 1; }; }

    /* trạm I */
    vungNhin(g, 1.0, 1.6, 1.0, -3.3, 0.8, 15.4, 'den');
    vungNhin(g, 1.6, 1.8, 1.6, -3.3, 2.4, 15.4, 'den');               // vùng các ý niệm hiện ra, cả khói
    vungNhin(g, 1.9, 2.0, 1.9, 0, 1.0, 14.0, function () { return S.ruongMo > 0 ? 'ruongMo' : 'ruong'; });
    vungNhin(g, 1.7, 2.8, 2.3, 3.3, 1.4, 14.5, 'guong');
    vungNhin(g, CUA_X * 2, CUA_CAO, 0.3, 0, CUA_CAO / 2, VACH[0], 'xong1', cuaKhoa(0));
    COT_TRAM1.forEach(function (d) { vungNhin(g, 1.0, 6.0, 1.0, d.x, 3.0, d.z, 'cot' + d.k); });

    /* trạm II */
    vungNhin(g, 1.2, 2.4, 1.0, 0, 1.2, 6.4, 'xong2');
    vungNhin(g, 7.4, 0.6, 0.3, 0, CUA_CAO + 0.7, VACH[1] + 0.2, 'xong2');   // bốn vai trò trên cửa
    vungNhin(g, CUA_X * 2, CUA_CAO, 0.3, 0, CUA_CAO / 2, VACH[1], 'xong2', cuaKhoa(1));
    vungNhin(g, 0.9, 4.6, 6.8, -5.4, 2.3, 6.0, 'may');                       // khung máy, bánh răng sản xuất
    vungNhin(g, 0.9, 1.3, 6.4, -4.1, 0.65, 6.1, 'may');                      // băng chuyền
    vungNhin(g, 1.1, 1.5, 1.2, -5.2, 0.75, 1.9, 'may');                      // lò nung
    vungNhin(g, 2.4, 2.4, 2.0, 3.9, 1.2, 7.8, 'may');                        // bàn thí nghiệm, nguyên tử, bảng quy trình
    vungNhin(g, 3.7, 3.0, 3.4, 3.65, 1.5, 3.2, 'may');                       // diễn đàn, đám đông, băng rôn

    /* trạm III */
    [[-2.3, -3.4], [0, -2.9], [2.3, -3.4]].forEach(function (p) {
      vungNhin(g, 0.3, 1.3, 0.3, p[0], 0.65, p[1], 'camGiac');               // cột
      vungNhin(g, 0.8, 1.1, 0.3, p[0], 1.75, p[1], 'camGiac');               // biểu tượng + tên
    });
    vungNhin(g, 0.45, 0, 0, TAO.x, 2.25, TAO.z, 'bieuTuong', function () { return S.camTinh >= 1; });
    vungNhin(g, 2.3, 0.45, 0.3, TAO.x, 2.82, TAO.z, function () { return S.camTinh >= 2 ? 'bieuTuong' : 'triGiac'; },
             function () { return S.camTinh >= 1; });
    [[-2.3, -3.4], [0, -2.9], [2.3, -3.4]].forEach(function (p) {
      vungNhin(g, 1.0, 0.8, 0.3, p[0], 2.67, p[1], 'camGiac');                // thẻ thông tin giác quan
    });
    [[-1.2, BE.cao + 2.4, NAO.z - 0.6], [0, BE.cao + 3.0, NAO.z - 0.7], [1.2, BE.cao + 2.4, NAO.z - 0.6]].forEach(function (p) {
      vungNhin(g, 1.3, 0.4, 0.3, p[0], p[1], p[2], function () { return S.camTinh >= 2 ? 'ly' : 'rong'; });
    });
    vungNhin(g, 0.8, 1.8, 0.8, TAO.x, 0.9, TAO.z, 'triGiac');
    vungNhin(g, 1.6, 2.4, 1.6, BAT.x, 1.2, BAT.z, 'nhay');
    vungNhin(g, BE.x * 2, BE.cao, 0.2, 0, BE.cao / 2, BE.zTruoc, 'nhay');
    vungNhin(g, 1.4, 0, 0, NAO.x, BE.cao + 1.9, NAO.z, function () { return S.camTinh >= 2 ? 'ly' : 'rong'; });
    var dai2 = 6.4 - NAO.z;
    vungNhin(g, 0.5, 0.5, dai2, 0, 3.25, NAO.z + dai2 / 2, 'veThucTien', function () { return S.xong3; });
    vungNhin(g, CUA_X * 2, CUA_CAO, 0.3, 0, CUA_CAO / 2, VACH[2], 'veThucTien', cuaKhoa(2));

    /* biển tên phía trên mỗi đạo cụ — nhìn vào biển cũng là nhìn vào vật,
       không để tia trượt qua biển rồi trúng cánh cửa hay vật phía sau */
    vungNhin(g, 2.2, 0.62, 0.12, -3.3, 3.35, 15.4, 'den');
    vungNhin(g, 2.2, 0.62, 0.12, 0, 2.75, 14.0, function () { return S.ruongMo > 0 ? 'ruongMo' : 'ruong'; });
    vungNhin(g, 2.2, 0.62, 0.12, 3.3, 3.25, 14.7, 'guong');
    vungNhin(g, 2.2, 0.62, 0.12, 0, 2.3, 6.2, 'xong2');
    vungNhin(g, 0.12, 0.62, 2.2, -4.4, 5.05, 6.2, 'may');
    vungNhin(g, 2.2, 0.62, 0.12, 3.7, 3.15, 7.8, 'may');
    vungNhin(g, 2.2, 0.62, 0.12, 3.4, 3.35, 3.2, 'may');
    vungNhin(g, 3.0, 0.75, 0.12, 0, 3.25, TAO.z, 'camGiac');
    vungNhin(g, 2.4, 0.62, 0.12, 0, 3.55, -17.4, 'kc');

    /* trạm IV */
    [-3.2, 0, 3.2].forEach(function (x, k) {
      vungNhin(g, 1.3, 2.0, 1.3, x, 1.0, -14.2, 'gt' + k);                   // bàn + mô hình
      vungNhin(g, 2.7, 0.75, 0.1, x, 2.45, -14.2, 'gt' + k);                 // biển mệnh đề
    });
    vungNhin(g, 2.0, 4.2, 2.0, 0, 2.1, o.t4.kz, 'kc');
  }

  function nhacNho(html, giay) {
    S.nhac = html;
    S.nhacT = giay || 6;
  }

  /* hẹn giờ theo đồng hồ của game, không dùng setTimeout: phòng đóng là
     hàng đợi mất theo, và không bị trình duyệt hãm khi tab chạy nền */
  function hen(ms, fn) {
    S.hen.push({ t: ms / 1000, fn: fn });
  }

  function chayHen(dt) {
    for (var i = S.hen.length - 1; i >= 0; i--) {
      var h = S.hen[i];
      h.t -= dt;
      if (h.t <= 0) { S.hen.splice(i, 1); h.fn(); }
    }
  }

  function moTram(n) { S.moKhoa = Math.max(S.moKhoa, n); }

  /* ---------- trạm I ---------- */

  function logic1(dt, ctx) {
    var T = ctx.text.t1, id = S.giu;

    if (id === 'den') {
      S.den = Math.min(1, S.den + dt * TOC_DEN);
      if (S.den >= 1 && !S.thu.den) thu(ctx, 'den');
    } else {
      S.den = Math.max(0, S.den - dt * 0.7);        // buông tay là ảo ảnh tan
    }

    if (!S.xong2) {
      if (id === 'ruong') {
        S.ruong = Math.min(TRAN_RUONG, S.ruong + dt * TOC_RUONG);
        if (S.ruong >= TRAN_RUONG) {
          S.ruongKetT += dt;                         // kẹt lại ở trần, rồi mới "hiểu"
          if (S.ruongKetT > 0.9 && !S.thu.ruong) thu(ctx, 'ruong');
        }
      } else {
        S.ruong = Math.max(0, S.ruong - dt * 0.4);
        S.ruongKetT = 0;
      }
    }

    if (id === 'guong') {
      S.guong = Math.min(1, S.guong + dt * TOC_GUONG);
      if (S.guong >= 1 && !S.thu.guong) thu(ctx, 'guong');
    } else {
      S.guong = Math.max(0, S.guong - dt * 0.5);
    }
  }

  function thu(ctx, id) {
    var T = ctx.text.t1;
    S.thu[id] = true;
    ctx.audio.diemNut();
    nhacNho(T.ketQua[id], 7);
    if (S.thu.den && S.thu.ruong && S.thu.guong && !S.xong1) {
      S.xong1 = true;
      hen(2600, function () {
        ctx.hud.buocNhay(T.buocNhay[0], T.buocNhay[1]);
        ctx.audio.buocNhay();
        moTram(2);
        nhacNho(T.xong, 7);
      });
    }
  }

  function hinh1(dt, ctx) {
    var t = ctx.clock, v = o.t1;

    capNhatNen(dt, ctx);

    /* vết nứt trên các cột thở chậm; khi thực tiễn mở rương, cột Hume · Kant loé vàng */
    v.cot.forEach(function (c) {
      var bacBo = c.k === 2 && S.ruongMo > 0;
      if (bacBo) c.mat.emissive.lerp(o.mauVang || (o.mauVang = new THREE.Color(0xffc060)), Math.min(1, dt * 1.5));
      c.mat.emissiveIntensity = (bacBo ? 1.4 : 0.6) + 0.25 * Math.sin(t * 1.3 + c.k * 1.7);
    });

    /* lồng năng lượng: càng cố, càng chói, càng run */
    var mo = S.ruongMo;
    var run = S.ruong > 0.85 ? (Math.random() - 0.5) * 0.03 : 0;
    v.ruong.position.x = run;
    v.matLong.emissiveIntensity = 0.6 + S.ruong * 1.6 + (S.ruong > 0.85 ? Math.sin(t * 40) * 0.4 : 0);
    v.matKhung.opacity = (0.5 + S.ruong * 0.5) * (1 - mo);
    v.long.rotation.y += dt * (0.2 + S.ruong * 1.5);
    v.long.scale.setScalar(Math.max(0.001, 1 - mo));
    v.matLong.opacity = 0.6 * (1 - mo);

    if (S.xong2) {
      S.ruongMo = Math.min(1, S.ruongMo + dt * 0.5);
      v.nap.rotation.x = -1.9 * A.vot(S.ruongMo, 1.2);
      v.cotSang.material.opacity = 0.35 * A.muot(S.ruongMo) * (0.8 + 0.2 * Math.sin(t * 3));
      v.anhRuong.intensity = 2.0 * S.ruongMo;
      if (!v.daGhiMo && S.ruongMo > 0.5) {
        v.daGhiMo = true;
        v.bienRuong.userData.viet([
          { t: ctx.text.t1.ruong.ten, co: 66, mau: '#ffe2a0', dam: 700, gian: 6 },
          { t: ctx.text.t1.ruongMo, co: 44, mau: '#ffd27a', serif: true, nghieng: true, dam: 600 }
        ]);
      }
    }

    /* bóng trong gương: méo đi, nhưng không bao giờ làm gì quả táo thật */
    v.taoBong.scale.x = 1 + Math.sin(t * 7) * 0.22 * S.guong;
    v.taoBong.scale.y = 1 - Math.sin(t * 5) * 0.18 * S.guong;
    v.taoBong.rotation.z = Math.sin(t * 3.3) * 0.35 * S.guong;
    v.matKinh.opacity = 0.22 + S.guong * 0.12;
  }

  /* ---------- trạm II ---------- */

  /* Cảnh phim của xưởng: camera ghé lần lượt từng nơi; ở mỗi nơi, xung
     năng lượng chạy tới → cỗ máy khởi động → vai trò tương ứng sáng.
     tu: chỗ đặt camera · nhin: điểm nhìn · may: cỗ máy (-1 = không) */
  var PHIM_2 = [
    { tu: [-1.4, 2.3, 8.9],  nhin: [-5.0, 2.0, 6.0], may: 0, ong: 0 },
    { tu: [0.9, 1.95, 7.9],  nhin: [3.9, 1.35, 7.8], may: 1, ong: 1 },
    { tu: [0.6, 2.1, 5.6],   nhin: [3.9, 1.4, 3.2],  may: 2, ong: 2 },
    { tu: [0, 2.0, 5.4],     nhin: [0, 4.25, 0.2],   may: -1, ong: 3 }
  ];
  var BUOC_2 = 6.5;             // giây mỗi bước — đủ để xem cỗ máy chạy và đọc phụ đề
  var TOC_NAP = 0.34;            // nạp đầy trong khoảng 3 giây giữ cần

  function logic2(dt, ctx) {
    if (S.xong2) return;
    if (S.phim) { phim2(dt, ctx); return; }

    if (S.giu === 'can') S.nang = Math.min(1, S.nang + dt * TOC_NAP);
    else S.nang = Math.max(0, S.nang - dt * TU_NGUOI);

    if (S.nang >= 1) batDauPhim2(ctx);
  }

  function batDauPhim2(ctx) {
    var P = ctx.player;
    S.phim = { buoc: 0, t: 0, ve: -1, p: P.pos.clone(), mocVai: false, mocMay: false, mocCua: false };
    ctx.khoaCamera = true;                              // giữ nguyên khoá chuột — xin khoá lại không cần cú bấm sẽ bị chặn
    ctx.hud.phim(true);
    ctx.hud.anChuGiai();
    ctx.audio.diemNut();
  }

  function phim2(dt, ctx) {
    var F = S.phim, T = ctx.text.t2, P = ctx.player, cam = ctx.camera, v = o.t2;
    P.pos.copy(F.p);                                    // người chơi đứng yên trong lúc xem

    var tuX, nhinX;
    if (F.ve < 0) {
      /* ---- đang ở một bước ---- */
      var B = PHIM_2[F.buoc];
      F.t += dt;
      if (F.t < dt * 1.5) {
        var C = T.phim[F.buoc];
        ctx.hud.phimChu(C.k, C.t, C.p);
      }
      /* xung năng lượng chạy dọc ống tới cỗ máy */
      var u = A.doan(F.t, 0.7, 1.7);
      var d = v.dichOng[B.ong];
      v.xung.position.set(d[0] * u, 0.12, 6.4 + (d[1] - 6.4) * u);
      v.xung.material.opacity = u > 0 && u < 1 ? 0.95 : 0;
      if (u >= 1) v.ong[B.ong].opacity = A.damp(v.ong[B.ong].opacity, 0.85, 3, dt);
      /* cỗ máy khởi động */
      if (B.may >= 0 && F.t > 1.7) S.may[B.may] = Math.min(1, S.may[B.may] + dt / 1.4);
      /* vai trò sáng */
      if (F.t > 2.8 && S.vaiTro < F.buoc + 1) { S.vaiTro = F.buoc + 1; ctx.audio.diemNut(); }
      /* bước cuối: cửa sang trạm III mở */
      if (F.buoc === 3 && F.t > 3.4 && S.moKhoa < 3) moTram(3);       // tiếng mở cửa do module âm thanh lo
      S.sangXuong = Math.min(1, (F.buoc + A.doan(F.t, 1.7, 3.0)) / 4);

      tuX = B.tu; nhinX = B.nhin;
      if (F.t >= BUOC_2) {
        F.t = 0;
        F.buoc++;
        if (F.buoc >= PHIM_2.length) { F.ve = 0; F.buoc = PHIM_2.length - 1; ctx.hud.phimChu(null); }
      }
    } else {
      /* ---- quay về mắt người chơi, nhìn ra cửa vừa mở ---- */
      F.ve += dt;
      var mat2 = P.pos;
      tuX = [mat2.x, mat2.y, mat2.z];
      nhinX = [0, 1.9, 0];
      if (F.ve > 1.4) { ketThucPhim2(ctx); return; }
    }

    v.camGia.position.set(tuX[0], tuX[1], tuX[2]);
    v.camGia.lookAt(nhinX[0], nhinX[1], nhinX[2]);
    var k = 1 - Math.exp(-2.6 * dt);
    cam.position.lerp(v.camGia.position, k);
    cam.quaternion.slerp(v.camGia.quaternion, k);
  }

  function ketThucPhim2(ctx) {
    var T = ctx.text.t2, P = ctx.player;
    var dx = 0 - P.pos.x, dz = 0 - P.pos.z;
    P.yaw = Math.atan2(-dx, -dz);
    P.pitch = Math.atan2(1.9 - P.pos.y, Math.hypot(dx, dz));
    S.phim = null;
    S.xong2 = true;
    S.nang = 1;
    S.sangXuong = 1;
    ctx.khoaCamera = false;
    ctx.hud.phim(false);
    ctx.hud.buocNhay(T.buocNhay[0], T.buocNhay[1]);
    hen(2600, function () { nhacNho(T.ruongMo, 8); });
  }

  function hinh2(dt, ctx) {
    var t = ctx.clock, v = o.t2;
    var m0 = S.may[0], m1 = S.may[1], m2 = S.may[2];

    /* cần gạt: kéo về phía mình khi nạp; khoá hẳn khi đã đầy */
    /* kéo về phía mình khi nạp; nạp xong thì đẩy hẳn ra xa — không che tầm nhìn ra cửa */
    var dichCan = S.giu === 'can' && !S.phim && !S.xong2 ? 0.35 : ((S.phim || S.xong2) ? -1.25 : -0.6);
    S.canGoc = A.damp(S.canGoc, dichCan, 6, dt);
    v.truc.rotation.x = S.canGoc;
    v.matNum.emissiveIntensity = 0.5 + S.nang * 0.5 + Math.sin(t * 5) * 0.15;

    /* 1 · sản xuất */
    var quay = dt * m0 * 1.4;
    v.rang1.rotation.z += quay;
    v.rang2.rotation.z -= quay * 18 / 10;
    v.rang3.rotation.z -= quay * 18 / 8;
    v.matRang.emissiveIntensity = 0.05 + m0 * 0.28;
    v.matMieng.color.setRGB(0.23 + m0 * 0.77, 0.06 + m0 * 0.4, 0.02 + m0 * 0.05);
    v.quangLo.material.opacity = m0 * (0.7 + 0.2 * Math.sin(t * 9));
    v.texBang.offset.y -= dt * m0 * 0.25;
    v.hang.forEach(function (h) {
      h.position.z -= dt * m0 * 0.55;
      if (h.position.z < 3.2) h.position.z += 6.0;                    // hết băng thì quay lại đầu
    });

    /* 2 · thực nghiệm */
    v.matDich.emissiveIntensity = 0.05 + m1 * 1.1;
    v.lua.material.opacity = m1 * (0.8 + 0.2 * Math.sin(t * 20));
    v.denHV.material.opacity = m1 * (0.7 + Math.sin(t * 6) * 0.2);
    v.matOngNghiem.forEach(function (m, k) { m.emissiveIntensity = 0.05 + m1 * (0.6 + 0.3 * Math.sin(t * 3 + k)); });
    var bot = v.bot, sinh = m1 > 0.2 ? 2 : 0;
    for (var i = 0; i < bot.count; i++) {
      if (bot.life[i] > 0) {
        bot.life[i] -= dt * 0.8;
        bot.pos[i * 3 + 1] += dt * 0.32;
        bot.pos[i * 3] += Math.sin(t * 5 + i) * dt * 0.04;
        if (bot.life[i] <= 0) bot.an(i);
      } else if (sinh > 0) {
        sinh--;
        bot.life[i] = 1;
        bot.pos[i * 3] = v.vtBinh.x + (Math.random() - 0.5) * 0.08;
        bot.pos[i * 3 + 1] = 1.5;
        bot.pos[i * 3 + 2] = v.vtBinh.z + (Math.random() - 0.5) * 0.08;
      }
    }
    bot.capNhat();
    bot.pts.material.opacity = m1 * 0.9;
    v.nguyenTu.scale.setScalar(Math.max(0.001, A.chamDan(A.doan(m1, 0.3, 1))));
    v.nguyenTu.rotation.y += dt * 0.5;
    v.quyDao.forEach(function (q, k) {
      var a = t * (1.6 + k * 0.5) + k * 2;
      q.userData.e.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0);
    });
    v.quyTrinh.forEach(function (b, k) {
      var dich = A.doan(m1, k * 0.3, k * 0.3 + 0.25) > 0.5 ? 1 : 0.25;
      b.material.opacity = A.damp(b.material.opacity, dich, 4, dt);
    });

    /* 3 · chính trị – xã hội */
    v.matNguoi.emissiveIntensity = m2 * 0.8;
    v.matCo.emissiveIntensity = 0.1 + m2 * 0.8;
    var p = v.co.geometry.attributes.position;
    for (i = 0; i < p.count; i++) {
      var x = v.coGoc[i * 3] + 0.5;
      p.setZ(i, Math.sin(x * 5 - t * (2 + m2 * 4)) * 0.08 * x * (0.3 + m2));
    }
    p.needsUpdate = true;
    v.nguoi.forEach(function (ng, k) {
      var gio = A.chamDan(A.doan(m2, k * 0.08, k * 0.08 + 0.5));
      ng.userData.tay.forEach(function (vai) {
        vai.rotation.z = vai.userData.s * gio * (2.5 + 0.2 * Math.sin(t * 3 + k));
      });
    });
    v.bangRon.material.opacity = A.damp(v.bangRon.material.opacity, m2 > 0.5 ? 1 : 0.35, 3, dt);

    /* bốn vai trò */
    v.vaiTro.forEach(function (b, k) {
      b.material.opacity = A.damp(b.material.opacity, S.vaiTro > k ? 1 : 0.18, 4, dt);
    });

    var tong = (m0 + m1 + m2) / 3;
    o.den2a.intensity = 0.4 + tong * 1.8;
    o.den2b.intensity = 0.3 + m0 * 1.4;
    v.denLab.intensity = m1 * 1.4;
    v.denXH.intensity = m2 * 1.4;
  }

  /* ---------- trạm III ---------- */

  function logic3(dt, ctx) {
    var T = ctx.text.t3, id = S.giu, P = ctx.player;

    ['mat', 'tai', 'tay'].forEach(function (k) {
      if (id !== k) return;
      if (S.giac[k] < 1) {
        S.giac[k] = Math.min(1, S.giac[k] + dt * TOC_GIAC);
        if (S.giac[k] >= 1) {
          ctx.audio.diemNut();
          nhacNho(T.giac[k].nhan, 4);
        }
      } else if (S.camTinh >= 2 && S.nhacT <= 0) {
        nhacNho(T.duCamTinh, 4);
      }
    });

    if (S.camTinh === 0 && S.giac.mat >= 1 && S.giac.tai >= 1 && S.giac.tay >= 1) {
      S.camTinh = 1;
      S.camTinhT = 0;
      ctx.audio.diemNut();
      nhacNho(T.triGiac, 5);
    }
    if (S.camTinh === 1) {
      S.camTinhT += dt;
      if (S.camTinhT > 3.5) {
        S.camTinh = 2;
        ctx.audio.diemNut();
        nhacNho(T.bieuTuong, 7);
      }
    }

    if (id === 'nao' && !S.xong3) {
      if (S.camTinh < 2) {
        S.rong = Math.min(1, S.rong + dt * TOC_RONG);
        if (S.rong >= 1 && !S.daRong) {
          S.daRong = true;
          S.soLanRong++;
          ctx.audio.diemNut();
          nhacNho(T.rong, 6);
        }
      } else {
        S.ly = Math.min(1, S.ly + dt * TOC_LY);
        var b = Math.floor(S.ly * 3 + 1e-6);
        if (b > S.lyBuoc) {
          S.lyBuoc = b;
          ctx.audio.diemNut();
          nhacNho(T.lyNoi[b - 1], 5);
        }
        if (S.ly >= 1) {
          S.xong3 = true;
          ctx.hud.buocNhay(T.buocNhay[0], T.buocNhay[1]);
          ctx.audio.buocNhay();
          moTram(4);
          hen(2400, function () { nhacNho(T.xong, 7); });
        }
      }
    } else {
      S.rong = Math.max(0, S.rong - dt);
      if (S.rong === 0) S.daRong = false;
    }

    /* bệ nhảy: chỉ đẩy lên, và nghỉ một nhịp sau khi vừa từ trên bệ xuống */
    if (trenBe(P.pos.x, P.pos.z)) S.nhayKhoa = 1.0;
    else S.nhayKhoa = Math.max(0, S.nhayKhoa - dt);
    if (!S.nhay && S.moKhoa > 2 && S.nhayKhoa <= 0 && !S.ketThuc &&
        P.distTo(BAT.x, BAT.z) < 0.6 && !trenBe(P.pos.x, P.pos.z)) {
      S.nhay = { t: 0, x0: P.pos.x, z0: P.pos.z };
      ctx.khoaCamera = true;
      ctx.audio.diemNut();
    }
  }

  function capNhatNhay(dt, ctx) {
    var N = S.nhay, P = ctx.player;
    N.t = Math.min(1, N.t + dt / 0.85);
    var e = A.muot(N.t);
    P.pos.set(
      N.x0 + (BAT.x - N.x0) * e,
      P.CAO_MAT + BE.cao * e + Math.sin(Math.PI * N.t) * 1.2,
      N.z0 + (BE.zTruoc - 1.2 - N.z0) * e
    );
    ctx.camera.position.copy(P.pos);
    ctx.camera.rotation.set(P.pitch, P.yaw, 0, 'YXZ');
    if (N.t >= 1) {
      S.nhay = null;
      ctx.khoaCamera = false;
    }
  }

  function hinh3(dt, ctx) {
    var t = ctx.clock, v = o.t3;

    v.tao.rotation.y += dt * 0.4;
    var anTao = S.camTinh >= 2 ? 1 : 0;
    v.matTao.opacity = A.damp(v.matTao.opacity, 1 - anTao * 0.92, 1.5, dt);
    v.taoQuang.material.opacity = 0.25 * v.matTao.opacity;

    var holo = S.camTinh >= 1 ? 1 : 0;
    v.matHolo.opacity = A.damp(v.matHolo.opacity, holo * (0.55 + 0.15 * Math.sin(t * 4)), 3, dt);
    v.holo.rotation.y -= dt * 0.8;

    var dangGiac = null;
    ['mat', 'tai', 'tay'].forEach(function (k) {
      var g = v.giac[k], muc = S.giac[k];
      g.matIcon.opacity = 0.35 + muc * 0.65;
      g.vong.material.opacity = (S.giu === k ? 0.9 : 0.3) * (0.7 + 0.3 * Math.sin(t * 5));
      g.vong.scale.setScalar(1 + (S.giu === k ? 0.15 : 0));
      /* thẻ thông tin: thuộc tính thứ n hiện khi cảm nhận được n/3 */
      /* thẻ nổi giữa cột và quả táo, ngay trên quả táo — nằm giữa tầm nhìn khi đang cảm nhận;
         chỉ hiện thẻ của giác quan đang đứng cạnh, để ba bộ thẻ không chồng lên nhau */
      var cam = ctx.camera.position;
      var mx = (g.x + TAO.x) / 2, mz = (g.z + TAO.z) / 2;
      var hx = mx - cam.x, hz = mz - cam.z, hd = Math.hypot(hx, hz) || 1;
      var ax = mx + hx / hd * 0.5, az = mz + hz / hd * 0.5;
      g.nhom.position.set(ax, 1.78, az);
      g.nhom.rotation.y = Math.atan2(cam.x - ax, cam.z - az);
      var dangDung = S.gan && S.gan.id === k;
      g.nhan.material.opacity = A.damp(g.nhan.material.opacity, dangDung && g.daHien > 0 ? 0.25 : 1, 4, dt);
      var soHien = Math.floor(muc * 3 + 0.001);
      if (soHien > g.daHien) {
        if (k === 'tai' && g.daHien < 2 && soHien >= 2) amRop(ctx);   // thuộc tính "khi cắn": nghe tiếng rộp
        g.daHien = soHien;
      }
      g.the.forEach(function (m, j) {
        var dich = j < g.daHien && dangDung ? 1 : 0;
        m.material.opacity = A.damp(m.material.opacity, dich, 5, dt);
        m.position.x = (1 - m.material.opacity) * -0.25;
        m.position.y = m.userData.y;
      });
      if (S.giu === k) dangGiac = g;
    });

    /* hiệu ứng riêng của từng giác quan trên quả táo */
    var coTao = v.matTao.opacity > 0.2;
    v.matTiaNhin.opacity = A.damp(v.matTiaNhin.opacity, S.giu === 'mat' && coTao ? 0.22 + 0.08 * Math.sin(t * 9) : 0, 6, dt);
    v.songAm.forEach(function (r, j) {
      var u = (t * 0.7 + j / 3) % 1;
      r.scale.setScalar(0.3 + u * 1.1);
      r.material.opacity = A.damp(r.material.opacity, S.giu === 'tai' && coTao ? (1 - u) * 0.8 : 0, 8, dt);
    });
    v.gonCham.forEach(function (r, j) {
      var u = (t * 1.1 + j / 2) % 1;
      r.scale.setScalar(0.04 + u * 0.22);
      r.material.opacity = A.damp(r.material.opacity, S.giu === 'tay' && coTao ? (1 - u) : 0, 8, dt);
    });

    /* thẻ tri giác → biểu tượng */
    var kieuGop = S.camTinh >= 2 ? 2 : 1;
    if (kieuGop !== v.theGopKieu) {
      v.theGopKieu = kieuGop;
      var Tg = kieuGop === 2 ? ctx.text.t3.theBieuTuong : ctx.text.t3.theTriGiac;
      v.theGop.userData.viet([{ t: Tg[0], co: 54, mau: '#7fe8ff', dam: 700, gian: 10 }, { t: Tg[1], co: 60, mau: '#ffffff', dam: 600 }]);
    }
    v.theGop.material.opacity = A.damp(v.theGop.material.opacity, S.camTinh >= 1 ? 1 : 0, 3, dt);
    v.theGop.rotation.y = Math.atan2(ctx.camera.position.x - TAO.x, ctx.camera.position.z - TAO.z);

    /* dòng dữ liệu: từ quả táo về giác quan đang cảm nhận,
       hoặc từ hình ảnh biểu tượng lên bộ não đang tư duy */
    var nguon = null, dich = null;
    if (dangGiac && v.matTao.opacity > 0.2) { nguon = [TAO.x, 1.35, TAO.z]; dich = [dangGiac.x, 1.65, dangGiac.z]; }
    if (S.giu === 'nao' && S.camTinh >= 2 && !S.xong3) { nguon = [TAO.x, 2.25, TAO.z]; dich = [NAO.x, BE.cao + 1.9, NAO.z]; }
    var d = v.dong, sinh = nguon ? 3 : 0;
    for (var i = 0; i < d.count; i++) {
      if (d.life[i] > 0) {
        d.life[i] -= dt * 1.4;
        var k = 1 - d.life[i];
        var a = d.vel;
        d.pos[i * 3]     = a[i * 3]     + (d.dich[i * 3]     - a[i * 3])     * k;
        d.pos[i * 3 + 1] = a[i * 3 + 1] + (d.dich[i * 3 + 1] - a[i * 3 + 1]) * k + Math.sin(k * Math.PI) * 0.3;
        d.pos[i * 3 + 2] = a[i * 3 + 2] + (d.dich[i * 3 + 2] - a[i * 3 + 2]) * k;
        if (d.life[i] <= 0) d.an(i);
      } else if (sinh > 0) {
        sinh--;
        if (!d.dich) d.dich = new Float32Array(d.count * 3);
        d.life[i] = 1;
        d.vel[i * 3] = nguon[0] + (Math.random() - 0.5) * 0.3;
        d.vel[i * 3 + 1] = nguon[1] + (Math.random() - 0.5) * 0.3;
        d.vel[i * 3 + 2] = nguon[2] + (Math.random() - 0.5) * 0.3;
        d.dich[i * 3] = dich[0]; d.dich[i * 3 + 1] = dich[1]; d.dich[i * 3 + 2] = dich[2];
      }
    }
    d.capNhat();

    /* bệ nhảy sáng rõ khi đã có biểu tượng */
    var sang = S.camTinh >= 2 ? 1 : 0.35;
    v.matBat.opacity = sang * (0.5 + 0.3 * Math.sin(t * 4));
    v.vongBat.scale.setScalar(1 + 0.08 * Math.sin(t * 4));
    v.cotBat.material.opacity = 0.05 + sang * 0.1;

    /* bộ não: rỗng thì chập chờn, có dữ liệu thì sáng đều dần */
    var rong = S.rong > 0.05 ? Math.abs(Math.sin(t * 22)) * S.rong : 0;
    capNhatNao(dt, ctx, rong);

    /* ba thẻ lý tính quanh bộ não: rỗng thì hiện "?", có dữ liệu thì hiện câu ví dụ */
    var T3 = ctx.text.t3, camP = ctx.camera.position;
    v.theLy.forEach(function (b, j) {
      var kieu = S.lyBuoc > j ? 'day' : (rong > 0.05 ? 'rong' : '');
      if (kieu && kieu !== b.userData.kieu) {
        b.userData.kieu = kieu;
        var noi = kieu === 'day' ? T3.theLy[j] : [T3.theLy[j][0] + '  ?', T3.theRong[1]];
        b.userData.viet([{ t: noi[0], co: 50, mau: kieu === 'day' ? '#e2b8ff' : '#ff8aa0', dam: 700, gian: 8 },
                         { t: noi[1], co: 52, mau: '#ffffff', serif: true, nghieng: true, dam: 500 }]);
      }
      var dich = kieu === 'day' ? 1 : (kieu === 'rong' ? 0.4 + 0.5 * Math.abs(Math.sin(t * 12)) : 0);
      if (!kieu && b.userData.kieu === 'rong') b.userData.kieu = '';
      b.material.opacity = A.damp(b.material.opacity, dich, 5, dt);
      b.rotation.y = Math.atan2(camP.x - b.position.x, camP.z - b.position.z);
    });

    if (S.xong3) {
      S.xong3T += dt;
      var e = A.chamDan(S.xong3T / 1.6);
      v.tia.scale.y = Math.max(0.001, e);
      v.tia.position.z = NAO.z + (6.4 - NAO.z) * e / 2;
      v.matTia.opacity = 0.75 * (0.75 + 0.25 * Math.sin(t * 8));
    }
  }

  /* ---------- trạm IV ---------- */

  function logic4(dt, ctx) {
    var T = ctx.text.t4, P = ctx.player;

    for (var k = 0; k < 3; k++) {
      if (S.daKiem[k]) continue;
      if (S.giu === 'gt' + k) {
        S.kiem[k] = Math.min(1, S.kiem[k] + dt * TOC_KIEM);
        if (S.kiem[k] >= 1) ketQua(ctx, k);
      } else {
        S.kiem[k] = Math.max(0, S.kiem[k] - dt * 0.5);
      }
    }

    if (S.giu === 'kc' && !S.daNhat) {
      S.nhat = Math.min(1, S.nhat + dt * TOC_NHAT);
      if (S.nhat >= 1) {
        S.daNhat = true;
        ctx.hud.buocNhay(T.buocNhay[0], T.buocNhay[1]);
        ctx.audio.buocNhay();
        hen(2000, function () { nhacNho(T.cuaRa, 9999); });
      }
    } else if (!S.daNhat) {
      S.nhat = Math.max(0, S.nhat - dt);
    }

    if (S.daNhat && !S.ketThuc && P.pos.z < -Z_DAU + 1.2 && Math.abs(P.pos.x) < 1.6) ketThuc(ctx);
  }

  function ketQua(ctx, k) {
    var T = ctx.text.t4, gt = T.gt[k], v = o.t4.gt[k];
    S.daKiem[k] = true;
    S.soKiem++;
    ctx.audio.diemNut();
    nhacNho(gt.giai, 8);
    var sai = k === 0;
    v.bien.userData.viet([
      { t: '“' + gt.menh + '”', co: 54, mau: '#3a2c14', serif: true, dam: 600 },
      { t: gt.ket, co: 44, mau: sai ? '#b3261e' : '#2e7d4f', dam: 700, gian: 2 }
    ]);
    if (sai) {
      /* bị bác bỏ: mô hình địa tâm vỡ tan, mô hình nhật tâm thế chỗ */
      v.vo = true;
      v.tt.visible = false;
      v.mo.diaTam.visible = false;
      v.mo.nhatTam.visible = true;
      v.bienMH.userData.viet([{ t: T.nhatTam, co: 90, mau: '#2e5e3a', dam: 700, gian: 3 }]);
      var m = o.t4.manh;
      for (var i = 0; i < m.count; i++) {
        m.life[i] = 1;
        m.pos[i * 3] = v.x + (Math.random() - 0.5) * 0.9; m.pos[i * 3 + 1] = 1.2 + Math.random() * 0.5; m.pos[i * 3 + 2] = v.z + (Math.random() - 0.5) * 0.9;
        var a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI, s = 1 + Math.random() * 2;
        m.vel[i * 3] = Math.sin(b) * Math.cos(a) * s;
        m.vel[i * 3 + 1] = Math.cos(b) * s + 1;
        m.vel[i * 3 + 2] = Math.sin(b) * Math.sin(a) * s;
      }
    } else {
      /* qua được: tinh thể chân lý tách ra từ mô hình, bay vào viên kim cương */
      v.tt.visible = true;
      v.bay = 0;
    }
    if (S.soKiem === 3) hen(3800, function () { if (!S.daNhat) nhacNho(T.sanSang, 6); });
  }

  function hinh4(dt, ctx) {
    var t = ctx.clock, v = o.t4;

    v.gt.forEach(function (g, k) { capNhatMoHinh(dt, t, g, k, ctx); });
    v.gt.forEach(function (g, k) {
      g.tt.rotation.y += dt * 0.8;
      var dangKiem = S.giu === 'gt' + k;
      g.matChum.opacity = A.damp(g.matChum.opacity, dangKiem ? 0.35 + 0.1 * Math.sin(t * 9) : 0, 6, dt);
      g.matTT.emissiveIntensity = 0.25 + S.kiem[k] * 1.2;
      if (dangKiem) g.tt.position.x = g.x + (Math.random() - 0.5) * 0.02 * S.kiem[k];
      if (g.bay >= 0 && g.bay < 1) {
        g.bay = Math.min(1, g.bay + dt * 0.6);
        var e = A.muot(g.bay);
        g.tt.position.set(g.x + (0 - g.x) * e, 1.35 + (2.3 - 1.35) * e + Math.sin(e * Math.PI) * 1.2, g.z + (v.kz - g.z) * e);
        g.tt.scale.set(1 - e * 0.9, 1.6 * (1 - e * 0.9), 1 - e * 0.9);
        if (g.bay >= 1) {
          g.tt.visible = false;
          v.lon = (v.lon || 0) + 1;
          ctx.audio.diemNut();
        }
      }
    });

    var m = v.manh;
    for (var i = 0; i < m.count; i++) {
      if (m.life[i] <= 0) continue;
      m.life[i] -= dt * 0.6;
      m.vel[i * 3 + 1] -= dt * 4;
      m.pos[i * 3] += m.vel[i * 3] * dt;
      m.pos[i * 3 + 1] = Math.max(0.03, m.pos[i * 3 + 1] + m.vel[i * 3 + 1] * dt);
      m.pos[i * 3 + 2] += m.vel[i * 3 + 2] * dt;
      if (m.life[i] <= 0) m.an(i);
    }
    m.capNhat();

    /* viên kim cương lớn dần theo số mệnh đề đã qua kiểm nghiệm,
       và không bao giờ "xong" hẳn: vẫn xoay, vẫn sáng lên */
    var lon = v.lon || 0;
    var co = 0.6 + lon * 0.2 + (S.soKiem === 3 ? 0.1 : 0);
    v.coKC = A.damp(v.coKC || 0.6, co, 3, dt);
    if (!S.daNhat) {
      v.kc.rotation.y += dt * 0.6;
      var y = 2.3 + Math.sin(t * 1.4) * 0.08 - (S.soKiem === 3 ? 0.15 : 0);
      v.kc.position.y = y;
      v.kc.scale.set(v.coKC, v.coKC * 1.35, v.coKC);
      v.matKC.emissiveIntensity = 0.25 + lon * 0.35 + S.nhat * 1.2;
    } else {
      /* bay về phía người chơi rồi tan vào tay */
      S.nhatT += dt;
      var e = A.muot(S.nhatT / 1.2);
      v.kc.position.lerp(ctx.camera.position, e * 0.25);
      var c = Math.max(0.001, v.coKC * (1 - e));
      v.kc.scale.set(c, c * 1.35, c);
      if (e >= 1) v.kc.visible = false;
    }
    v.kcQuang.position.copy(v.kc.position);
    v.kcQuang.material.opacity = (0.35 + lon * 0.12) * (v.kc.visible ? 1 : 0);
    v.kcQuang.scale.setScalar(2.2 + lon * 0.5 + Math.sin(t * 2) * 0.15);
    v.tia.forEach(function (s, k) {
      s.position.copy(v.kc.position);
      s.material.rotation = k / v.tia.length * Math.PI + t * 0.15 * (k % 2 ? 1 : -1);
      s.material.opacity = (0.15 + lon * 0.1) * (0.7 + 0.3 * Math.sin(t * 3 + k)) * (v.kc.visible ? 1 : 0);
    });
    v.anhKC.intensity = 1.2 + lon * 0.6;
  }

  /* ---------- cửa, cổng, bia ---------- */

  function hinhChung(dt, ctx) {
    var t = ctx.clock;
    for (var i = 0; i < 3; i++) {
      S.cuaT[i] = A.damp(S.cuaT[i], S.moKhoa > i + 1 ? 1 : 0, 1.6, dt);
      o.chan[i].material.uniforms.uMo.value = S.cuaT[i];
      o.chan[i].visible = S.cuaT[i] < 0.99;
    }
    S.cuaT[3] = A.damp(S.cuaT[3], S.daNhat ? 1 : 0, 1.4, dt);

    [o.congVao, o.congRa].forEach(function (c, k) {
      var mo = k === 0 ? 1 : 0.15 + S.cuaT[3] * 0.85;
      c.vong1.rotation.z += 0.02 * mo;
      c.vong2.rotation.z -= dt * 0.9 * mo;
      c.vong3.rotation.z += dt * 0.5 * mo;
      c.uMo.value = mo;
      c.loi.material.opacity = (0.18 + 0.08 * Math.sin(t * 2)) * mo + (k === 1 ? S.cuaT[3] * 0.4 : 0);
      c.den.intensity = c.denMax * mo;
    });

    capNhatDai(dt, ctx);
  }

  /* ---------- không khí: màu sương và mật độ đổi theo vị trí ---------- */

  function khongKhi(dt, ctx) {
    var z = ctx.camera.position.z;
    var mt = ctx.moiTruong;
    var c = o.mauTam.copy(o.mauKhi[0]);
    var md = KHI[0].suong;
    var suong2 = KHI[1].suong + (0.018 - KHI[1].suong) * S.sangXuong;   // xưởng chạy, sương tan
    var dens = [KHI[0].suong, suong2, KHI[2].suong, KHI[3].suong];
    for (var i = 0; i < 3; i++) {
      var w = A.muot((VACH[i] + 1.5 - z) / 3);
      if (w <= 0) continue;
      c.lerp(o.mauKhi[i + 1], w);
      md += (dens[i + 1] - md) * w;
    }
    mt.suong.color.copy(c);
    mt.suong.density = md;
    mt.nen.copy(c);

    /* trạm IV sáng choang: thêm ánh trời trắng khi đã bước vào */
    var w4 = A.muot((VACH[2] + 1.5 - z) / 3);
    o.troi4.intensity = w4 * 0.35;
    o.troi.intensity = 0.45 * (1 - w4 * 0.5);
  }

  /* ---------- bảng chỉ số và gợi ý ---------- */

  function soTramDangDung(z) {
    return z > VACH[0] ? 0 : z > VACH[1] ? 1 : z > VACH[2] ? 2 : 3;
  }

  function hud(dt, ctx) {
    var T = ctx.text, G = T.chung, P = ctx.player, Pn = T.panel;
    if (S.phim) {                                    // cảnh phim: chỉ còn viền điện ảnh và phụ đề
      ctx.hud.hienPanel(false);
      ctx.hud.hienGoiY(false);
      ctx.hud.ngam(false);
      return;
    }
    var vung = soTramDangDung(P.pos.z);
    var gan = S.gan;

    /* --- bảng chỉ số --- */
    if (gan && !S.ketThuc) {
      var id = gan.id, val = 0, nhan = '', tt = '', ticks = [], band = null;
      if (id === 'den') {
        val = S.den; nhan = Pn.den;
        tt = S.den > 0.3 ? Pn.yNiem + ' · ' + T.t1.yNiem[o.ngonNen.hien]
           : (S.thu.den ? Pn.denXong : Pn.denDang);
      }
      else if (id === 'ruong') {
        val = S.ruong; nhan = Pn.ruong; band = [TRAN_RUONG * 100, 100, Pn.banChat];
        tt = S.ruong >= TRAN_RUONG ? Pn.ruongKet : Pn.ruongDang;
      }
      else if (id === 'guong') { val = S.guong; nhan = Pn.guong; tt = S.thu.guong ? Pn.guongXong : Pn.guongDang; }
      else if (id === 'can') {
        val = S.nang; nhan = Pn.can;
        tt = S.nang >= 1 ? T.t2.dayNap : (S.nang > 0.01 ? T.t2.dangNap : Pn.canChua);
      }
      else if (id === 'mat' || id === 'tai' || id === 'tay') {
        val = S.giac[id]; nhan = Pn.giac + ' · ' + T.t3.giac[id].ten;
        var soXong = (S.giac.mat >= 1) + (S.giac.tai >= 1) + (S.giac.tay >= 1);
        tt = S.camTinh >= 2 ? T.t3.buoc[2] : S.camTinh === 1 ? T.t3.buoc[1] : T.t3.buoc[0] + ' · ' + soXong + '/3';
      }
      else if (id === 'nao') {
        nhan = Pn.nao;
        if (S.camTinh < 2) { val = S.rong; tt = Pn.naoRong; }
        else { val = S.ly; tt = S.lyBuoc ? T.t3.ly[S.lyBuoc - 1] : Pn.naoCho; }
        ticks = T.t3.ly.map(function (v, k) { return [Math.round((k + 1) * 100 / 3), v]; });
      }
      else if (id.indexOf('gt') === 0) { var k = +id[2]; val = S.kiem[k]; nhan = Pn.gt; tt = Pn.gtDang; }
      else if (id === 'kc') { val = S.nhat; nhan = Pn.kc; tt = Pn.kcDang; }

      if (S.tieuDiem !== id) {
        S.tieuDiem = id;
        el.t.innerHTML = ticks.map(function (tk) {
          return '<i style="left:' + tk[0] + '%"><b>' + tk[1] + '</b></i>';
        }).join('');
        if (band) {
          el.b.style.display = '';
          el.b.style.left = band[0] + '%';
          el.b.style.width = (band[1] - band[0]) + '%';
          el.t.innerHTML += '<span class="bandlabel" style="left:' + (band[0] + band[1]) / 2 + '%">' + band[2] + '</span>';
        } else {
          el.b.style.display = 'none';
        }
      }
      el.v.textContent = Math.round(val * 100);
      el.l.textContent = nhan;
      el.s.textContent = tt;
      el.f.style.width = (val * 100) + '%';
      el.c.style.left = (val * 100) + '%';
    }
    ctx.hud.hienPanel(!!gan && !S.ketThuc);
    ctx.hud.ngam(!!gan || !!S.nhamId);

    /* --- dòng gợi ý --- */
    var giu = P.lockBroken ? G.giuDP : G.giu;
    var html;
    if (S.nhacT > 0) {
      S.nhacT -= dt;
      html = S.nhac;
    } else if (gan) {
      html = giu + ' ' + gan.goiY;
      if (S.bia >= 0) html += ' &nbsp;·&nbsp; ' + G.docBia;
    } else if (S.bia >= 0) {
      html = G.docBia;
    } else if (vung < 3 && S.moKhoa <= vung + 1 && P.pos.z - VACH[vung] < 2.2) {
      html = G.cuaKhoa;
    } else {
      var xong = [S.xong1, S.xong2, S.xong3, S.daNhat][vung];
      html = xong ? T.goiYXong[vung] : T.goiYVung[vung];
    }
    ctx.hud.goiY(html);
    ctx.hud.hienGoiY(!S.ketThuc);
  }

  /* ═══════════ kết thúc ═══════════ */

  function ketThuc(ctx) {
    S.ketThuc = true;
    var B = ctx.text.baiHoc;

    ctx.soTay.ghi({
      ten: ctx.text.soTay.ten,
      tom: ctx.text.soTay.tom,
      trichDan: B.trichDan,
      nguon: B.nguon
    });
    ctx.hoanThanh();
    ctx.hud.loeSang();
    ctx.audio.buocNhay();

    var nhacRong = S.soLanRong > 0
      ? '<p class="note">' + B.nhacRong.replace('%n', S.soLanRong) + '</p>'
      : '';

    ctx.hud.the(
      '<div class="eyebrow">' + B.nhan + '</div>' +
      '<h1>' + B.tieuDe + '</h1>' +
      '<p>' + B.dan + '</p>' +
      '<dl>' + B.dinhNghia.map(function (d) {
        return '<dt>' + d[0] + '</dt><dd>' + d[1] + '</dd>';
      }).join('') + '</dl>' +
      '<blockquote class="quote">' + B.trichDan + '<cite>' + B.nguon + '</cite></blockquote>' +
      '<h2>Ý nghĩa phương pháp luận</h2>' +
      B.phuongPhapLuan.map(function (d) {
        return '<p><strong>' + d[0] + ' —</strong> ' + d[1] + '</p>';
      }).join('') +
      '<h2>' + B.lienHe.tieuDe + '</h2>' +
      '<p>' + B.lienHe.than + '</p>' +
      nhacRong,
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  function dispose(ctx) {
    if (o && o.nghe) removeEventListener('keydown', o.nghe);
    if (o && o.nen) o.nen.stop();
    if (o && o.am) o.am.huy();
    if (ctx) ctx.khoaCamera = false;
    S = o = el = ctxRef = null;
  }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'nhan-thuc',
    tieuDe: 'Lý luận nhận thức',
    nhanNgan: 'Tầng II · Chương 2',
    moTa: 'Bốn trạm, từ bóng tối ra ánh sáng: con người nhận thức thế giới bằng cách nào?',
    /* hồng ngọc đỏ — ngọn lửa trong hang Platon; tách hẳn khỏi cửa tím của sảnh */
    mauCua: { vien: 0x3a0610, giua: 0xd6283c, loi: 0xffeedd, dom: [0xff5a4a, 0xffc070] },
    goiY: {
      khoa:    'Lại gần một đạo cụ, giữ <kbd>Chuột trái</kbd> · Cạnh bia, ấn <kbd>E</kbd>',
      duPhong: 'Lại gần một đạo cụ, giữ <kbd>F</kbd> · Cạnh bia, ấn <kbd>E</kbd>'
    },
    build: build,
    onEnter: onEnter,
    update: update,
    dispose: dispose
  });

})(window.TX);
