/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — BIỆN CHỨNG VÀ SIÊU HÌNH
   (Giáo trình, Chương 1, mục 1.1.3)

   Một cái cây trong lồng kính, một cần gạt hai chiều, và một câu hỏi:
   cái cây này là gì?

     SIÊU HÌNH   thời gian đứng yên, lồng kính dày lại, cây xám đi.
                 Mổ xẻ được từng bộ phận và thu về số liệu chính xác —
                 nhưng câu hỏi vẫn không có lời đáp. Đây là BẪY.

     BIỆN CHỨNG  lồng kính tan, thời gian chảy theo tay người chơi.
                 Cây hiện ra như một quá trình, nằm trong liên hệ với
                 đất, nắng và mưa. Câu hỏi được trả lời.

   Lưu ý học thuật: phòng KHÔNG nói siêu hình là vô dụng. Số liệu thu
   được là thật và có ích. Sai lầm chỉ nằm ở chỗ lấy nó làm cách nhìn
   duy nhất — thẻ bài học nói rõ điều này.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var TOC_DO_TG   = 0.26;   // tiến trình thời gian mỗi giây khi giữ
  var TOC_DO_TACH = 0.55;   // tiến trình mổ xẻ mỗi giây khi giữ
  var TAM_CAY     = 3.0;
  var TAM_CAN     = 1.8;
  var CAN_GOC     = Math.PI / 2;
  var CAN_BK      = 3.6;

  /* vị trí từng bộ phận khi bị tách rời khỏi chỉnh thể */
  var VI_TRI_TACH = [
    [ 1.35, 1.15,  0.55],   // lá
    [-1.35, 1.05, -0.45],   // cành
    [ 0.30, 2.25, -1.25],   // thân
    [-0.35, 0.55,  1.35]    // rễ
  ];

  var S, o, el;

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    S = {
      che: 'SIEU_HINH',   // chế độ đang dùng
      tg: 0,              // tiến trình thời gian, 0..1
      tach: 0,            // tiến trình mổ xẻ, 0..4
      gan: null,          // 'CAY' | 'CAN' | null
      daThuTach: false,
      daBeTac: false,
      nhacT: 0,
      xong: false,
      mo: 0,              // mức "biện chứng" hiển thị, 0..1
      tgSong: 0,          // đồng hồ của sự sống — đứng hẳn ở chế độ siêu hình
      tgTach: 0,          // đồng hồ cho các mảnh đã tách trôi lững lờ
      gatV: 0             // vận tốc tay gạt
    };
    o = { bp: [], lienHe: [] };

    TX.dungVoPhong(ctx.scene, { bien: ['BIỆN CHỨNG  ·  SIÊU HÌNH', 'tầng I'] });
    o.be = TX.dungBe(ctx.scene);
    ctx.player.blockers = [{ x: 0, z: 0, r: 1.75 }];

    dungCay(ctx);
    dungLongKinh(ctx);
    dungLienHe(ctx);
    dungCanGat(ctx);

    o.den = TX.dungAnhSang(ctx.scene, o.cay);
    dungPanel(ctx, ctx.text);
  }

  /* ---------- cái cây ----------
     Nguyên tắc dựng: MỌI BỘ PHẬN PHẢI DÍNH VÀO NHAU.
     Gốc toạ độ của mỗi bộ phận đặt đúng chỗ nó bám vào bộ phận dưới,
     nên khi phóng to nó mọc LÊN chứ không phình ra hai phía. Vị trí
     bám được tính lại mỗi khung hình theo chiều cao thân hiện tại. */

  var CAO_THAN = 1.15;

  function dungCay(ctx) {
    o.cay = new THREE.Group();
    o.cay.position.y = 0.95;
    ctx.scene.add(o.cay);

    var T = ctx.text;

    function boPhan(mesh, i, truc) {
      o.cay.add(mesh);
      var nhan = nhanBoPhan(T.boPhan[i][0], T.boPhan[i][1]);
      nhan.visible = false;
      o.cay.add(nhan);
      o.bp.push({
        mesh: mesh, nhan: nhan,
        dich: VI_TRI_TACH[i],
        truc: truc,                       // trục xoay riêng khi bị tách rời
        gan: new THREE.Vector3()          // chỗ bám, tính lại mỗi khung hình
      });
    }

    /* --- rễ: nón chúc xuống, gốc toạ độ ở mặt đất --- */
    var reNhom = new THREE.Group();
    var matRe = new THREE.MeshStandardMaterial({ color: 0x6b5236, roughness: 0.9 });
    for (var r = 0; r < 6; r++) {
      var a = (r / 6) * Math.PI * 2 + 0.3;
      var dai = 0.34 + (r % 3) * 0.10;
      var hh = new THREE.ConeGeometry(0.045, dai, 6);
      hh.translate(0, -dai / 2, 0);                 // đỉnh nón ở gốc, thân chúc xuống
      var re = new THREE.Mesh(hh, matRe);
      re.position.set(Math.cos(a) * 0.05, 0, Math.sin(a) * 0.05);
      re.rotation.set(Math.sin(a) * 0.75, 0, -Math.cos(a) * 0.75);
      reNhom.add(re);
    }
    o.matRe = matRe;

    /* --- thân: gốc toạ độ ở CHÂN, nên scale.y làm nó mọc lên --- */
    var matThan = new THREE.MeshStandardMaterial({ color: 0x5a4a32, roughness: 0.85 });
    var gThan = new THREE.CylinderGeometry(0.065, 0.115, CAO_THAN, 12);
    gThan.translate(0, CAO_THAN / 2, 0);
    var than = new THREE.Mesh(gThan, matThan);
    o.matThan = matThan;

    /* --- cành: mỗi cành cũng mọc từ chân của chính nó --- */
    var canhNhom = new THREE.Group();
    o.canh = [];
    for (var c = 0; c < 5; c++) {
      var b = (c / 5) * Math.PI * 2 + 0.4;
      var dc = 0.42 + (c % 2) * 0.16;
      var gc = new THREE.CylinderGeometry(0.022, 0.04, dc, 6);
      gc.translate(0, dc / 2, 0);
      var canh = new THREE.Mesh(gc, matThan);
      canh.position.set(0, -0.28 + c * 0.11, 0);
      canh.rotation.set(Math.sin(b) * 1.05, 0, -Math.cos(b) * 1.05);
      canh.userData.pha = c * 1.3;
      canhNhom.add(canh);
      o.canh.push(canh);
    }

    /* --- lá: một chùm nhiều khối, không phải một quả cầu đơn độc --- */
    var matLa = new THREE.MeshStandardMaterial({
      color: 0x4e8f5a, roughness: 0.7, flatShading: true
    });
    var laNhom = new THREE.Group();
    o.la = [];
    var chum = [
      [ 0.00, 0.06,  0.00, 0.34],
      [ 0.26, -0.05, 0.14, 0.22],
      [-0.24, 0.02, -0.12, 0.24],
      [ 0.08, 0.24, -0.22, 0.19],
      [-0.10, -0.14, 0.24, 0.17]
    ];
    for (var l = 0; l < chum.length; l++) {
      var d = chum[l];
      var la1 = new THREE.Mesh(new THREE.IcosahedronGeometry(d[3], 0), matLa);
      la1.position.set(d[0], d[1], d[2]);
      la1.rotation.set(l * 0.7, l * 1.1, l * 0.5);
      la1.userData.pha = l * 0.9;
      la1.userData.goc = la1.position.clone();
      laNhom.add(la1);
      o.la.push(la1);
    }
    o.matLa = matLa;

    /* thứ tự trong o.bp phải khớp với thứ tự nhãn trong vi.js:
       0 LÁ · 1 CÀNH · 2 THÂN · 3 RỄ */
    boPhan(laNhom,   0, new THREE.Vector3( 0.3, 1.0,  0.2).normalize());
    boPhan(canhNhom, 1, new THREE.Vector3(-0.2, 0.6, -0.8).normalize());
    boPhan(than,     2, new THREE.Vector3( 0.9, 0.2,  0.1).normalize());
    boPhan(reNhom,   3, new THREE.Vector3(-0.4, 0.3,  0.9).normalize());

    /* --- quả: treo dưới tán, hiện so le ở cuối chu kỳ --- */
    o.qua = [];
    var matQua = new THREE.MeshStandardMaterial({
      color: 0xffb469, emissive: 0xff8c3c, emissiveIntensity: 0.6, roughness: 0.4
    });
    for (var q = 0; q < 6; q++) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), matQua);
      m.userData.goc = (q / 6) * Math.PI * 2 + 0.5;
      m.userData.cao = -0.06 - (q % 3) * 0.09;
      m.userData.thu = q / 6;                        // để hiện so le
      m.visible = false;
      o.cay.add(m);
      o.qua.push(m);
    }
  }

  function nhanBoPhan(ten, so) {
    var c = document.createElement('canvas');
    c.width = 420; c.height = 130;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.textAlign = 'center';
    g.fillStyle = '#3d6fbf';
    g.font = '600 44px Inter, "Segoe UI", sans-serif';
    g.fillText(ten, c.width / 2, 52);
    g.fillStyle = '#7f8290';
    g.font = '400 28px Inter, "Segoe UI", sans-serif';
    g.fillText(so, c.width / 2, 96);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    var m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.92, 0.28),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0 })
    );
    return m;
  }

  /* ---------- lồng kính ---------- */

  function dungLongKinh(ctx) {
    o.matKinh = new THREE.MeshPhysicalMaterial({
      color: 0xbcd4f0, roughness: 0.06, metalness: 0,
      transparent: true, opacity: 0.3, side: THREE.DoubleSide
    });
    o.kinh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.0, 2.5, 40, 1, true),
      o.matKinh
    );
    o.kinh.position.y = 2.15;
    ctx.scene.add(o.kinh);

    var nap = new THREE.Mesh(new THREE.SphereGeometry(1.0, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), o.matKinh);
    nap.position.y = 3.4;
    ctx.scene.add(nap);
    o.nap = nap;
  }

  /* ---------- ba mối liên hệ: đất, nắng, mưa ---------- */

  function dungLienHe(ctx) {
    var T = ctx.text.lienHeNgoai;
    var dat = [
      { pos: [0, 0.12, 0],   mau: 0x8a6a3a, hinh: 'dia' },
      { pos: [0, 4.5, 0],    mau: 0xffd98a, hinh: 'cau' },
      { pos: [-2.9, 3.2, 1.6], mau: 0x7fb3e8, hinh: 'may' }
    ];

    for (var i = 0; i < 3; i++) {
      var d = dat[i];
      var hinh;
      if (d.hinh === 'dia') {
        hinh = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.03, 8, 48),
          new THREE.MeshBasicMaterial({ color: d.mau, transparent: true, opacity: 0 }));
        hinh.rotation.x = Math.PI / 2;
      } else if (d.hinh === 'cau') {
        hinh = new THREE.Mesh(new THREE.SphereGeometry(0.30, 20, 14),
          new THREE.MeshBasicMaterial({ color: d.mau, transparent: true, opacity: 0 }));
      } else {
        hinh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 0),
          new THREE.MeshBasicMaterial({ color: d.mau, transparent: true, opacity: 0, flatShading: true }));
      }
      hinh.position.set(d.pos[0], d.pos[1], d.pos[2]);
      ctx.scene.add(hinh);

      var den = new THREE.PointLight(d.mau, 0, 9, 2);
      den.position.copy(hinh.position);
      ctx.scene.add(den);

      /* sợi nối từ cây tới mối liên hệ */
      var day = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 1.9, 0), hinh.position.clone()
        ]),
        new THREE.LineBasicMaterial({ color: d.mau, transparent: true, opacity: 0 })
      );
      ctx.scene.add(day);

      var nhan = nhanBoPhan(T[i][0], T[i][1]);
      nhan.position.copy(hinh.position).add(new THREE.Vector3(0, 0.55, 0));
      ctx.scene.add(nhan);

      o.lienHe.push({ hinh: hinh, den: den, day: day, nhan: nhan, mau: d.mau });
    }
  }

  /* ---------- cần gạt hai chiều ---------- */

  function dungCanGat(ctx) {
    var x = Math.cos(CAN_GOC) * CAN_BK;
    var z = Math.sin(CAN_GOC) * CAN_BK;

    var be = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 1.0, 24),
      new THREE.MeshStandardMaterial({ color: TX.MAU.be, roughness: 0.6, metalness: 0.35 })
    );
    be.position.set(x, 0.5, z);
    be.castShadow = true;
    ctx.scene.add(be);

    /* tay gạt, nghiêng theo chế độ đang chọn */
    o.tayGat = new THREE.Group();
    o.tayGat.position.set(x, 1.0, z);
    ctx.scene.add(o.tayGat);

    var can = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.6, 10),
      new THREE.MeshStandardMaterial({ color: TX.MAU.kimLoai, roughness: 0.3, metalness: 0.8 })
    );
    can.position.y = 0.3;
    o.tayGat.add(can);

    o.matNum = new THREE.MeshBasicMaterial({ color: 0x3d6fbf });
    var num = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), o.matNum);
    num.position.y = 0.62;
    o.tayGat.add(num);

    /* biển hai đầu cần gạt */
    var T = ctx.text.canGat;
    var bienTrai = nhanBoPhan(T.trai.toUpperCase(), '←');
    bienTrai.material.opacity = 0.65;
    bienTrai.position.set(x - 0.75, 1.5, z);
    bienTrai.lookAt(0, 1.5, 0);
    ctx.scene.add(bienTrai);

    var bienPhai = nhanBoPhan(T.phai.toUpperCase(), '→');
    bienPhai.material.opacity = 0.65;
    bienPhai.position.set(x + 0.75, 1.5, z);
    bienPhai.lookAt(0, 1.5, 0);
    ctx.scene.add(bienPhai);

    o.can = { x: x, z: z };
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function dungPanel(ctx, T) {
    ctx.hud.datPanel(
      '<div class="readout">' +
        '<div class="temp"><b id="bcN">0</b><span id="bcU">%</span></div>' +
        '<div class="phase"><div class="lbl">' + T.nhan.phuongPhap + '</div>' +
          '<div class="val" id="bcM"></div></div>' +
      '</div>' +
      '<div class="scale"><div class="fill" id="bcFill"></div></div>' +
      '<div class="ticks">' +
        '<span class="bandlabel" id="bcLbl" style="left:50%"></span>' +
      '</div>' +
      '<div id="bcNode" class="nodebar">' +
        '<div class="cap"><span id="bcCap">' + T.nhan.boPhan + '</span><span id="bcVal">0</span></div>' +
      '</div>'
    );
    el = {
      n:    document.getElementById('bcN'),
      u:    document.getElementById('bcU'),
      m:    document.getElementById('bcM'),
      fill: document.getElementById('bcFill'),
      lbl:  document.getElementById('bcLbl'),
      node: document.getElementById('bcNode'),
      val:  document.getElementById('bcVal')
    };
  }

  /* ═══════════ logic ═══════════ */

  function logic(dt, ctx) {
    var T = ctx.text;

    var dCay = ctx.player.distTo(0, 0);
    var dCan = ctx.player.distTo(o.can.x, o.can.z);
    S.gan = (dCan < TAM_CAN) ? 'CAN' : (dCay < TAM_CAY ? 'CAY' : null);

    var td = S.gan ? ctx.player.action() : 0;

    /* --- đứng ở cần gạt: chọn phương pháp --- */
    if (S.gan === 'CAN') {
      if (td > 0) S.che = 'BIEN_CHUNG';
      if (td < 0) S.che = 'SIEU_HINH';
      return;
    }

    /* --- đứng ở cái cây --- */
    if (S.gan === 'CAY' && td > 0) {
      if (S.che === 'SIEU_HINH') {
        S.daThuTach = true;
        S.tach = Math.min(4, S.tach + dt * TOC_DO_TACH);
        if (S.tach >= 4 && !S.daBeTac) {
          S.daBeTac = true;
          S.nhacT = 7;
          ctx.audio.diemNut();
        }
      } else {
        S.tg = Math.min(1, S.tg + dt * TOC_DO_TG);
        if (S.tg >= 1 && !S.xong) nhinThay(ctx);
      }
    } else if (S.gan === 'CAY' && td < 0 && S.che === 'BIEN_CHUNG') {
      S.tg = Math.max(0, S.tg - dt * TOC_DO_TG);   // chạy ngược thời gian
    }
  }

  function nhinThay(ctx) {
    S.xong = true;
    ctx.hud.buocNhay(ctx.text.nhan.buocNhay, 'MỘT QUÁ TRÌNH, KHÔNG PHẢI MỘT VẬT');
    ctx.audio.buocNhay();
    setTimeout(function () { theBaiHoc(ctx); }, 1300);
  }

  /* ═══════════ hình ảnh ═══════════ */

  function hinhAnh(dt, ctx) {
    var A = TX.anim;
    var bc = S.che === 'BIEN_CHUNG' ? 1 : 0;
    S.mo = A.damp(S.mo, bc, 3.2, dt);

    /* Đồng hồ của sự sống. Ở chế độ siêu hình nó ĐỨNG HẲN — cái cây
       bất động tuyệt đối. Sự tương phản ấy chính là nội dung bài học,
       nên nó phải cảm nhận được chứ không chỉ đọc được. */
    S.tgSong += dt * S.mo;
    var gio = A.gio(S.tgSong) * S.mo;

    /* --- lồng kính tan ra --- */
    o.matKinh.opacity = 0.30 * (1 - S.mo) + 0.02;
    o.kinh.visible = o.nap.visible = o.matKinh.opacity > 0.03;
    var no = 1 + S.mo * 0.22;
    o.kinh.scale.set(no, 1, no);
    o.nap.scale.setScalar(no);

    /* --- cây xám đi ở chế độ siêu hình --- */
    var xam = 1 - S.mo;
    o.matLa.color.setRGB(0.31 + xam * 0.22, 0.56 - xam * 0.10, 0.35 + xam * 0.20);
    o.matThan.color.setRGB(0.35 + xam * 0.10, 0.29 + xam * 0.10, 0.20 + xam * 0.18);
    o.matRe.color.setRGB(0.42 + xam * 0.08, 0.32 + xam * 0.10, 0.21 + xam * 0.18);

    /* ═══ mọc: các bộ phận mọc SO LE, theo đúng thứ tự tự nhiên ═══ */
    var m = S.che === 'BIEN_CHUNG' ? S.tg : 1;
    var reM   = A.muot(A.doan(m, 0.00, 0.30));
    var thanM = A.muot(A.doan(m, 0.10, 0.55));
    var canhM = A.muot(A.doan(m, 0.35, 0.78));
    var laM   = A.muot(A.doan(m, 0.46, 0.95));

    /* đã tách rời thì bộ phận ấy giữ nguyên kích thước thật */
    if (S.tach > 3) reM = 1;
    if (S.tach > 2) thanM = 1;
    if (S.tach > 1) canhM = 1;
    if (S.tach > 0) laM = 1;

    var caoThan = CAO_THAN * Math.max(0.02, thanM);

    /* chỗ bám của từng bộ phận — tính theo chiều cao thân HIỆN TẠI,
       nên tán lá luôn ngồi trên ngọn, không bao giờ lơ lửng */
    o.bp[3].gan.set(0, 0.04, 0);                         // rễ bám mặt đất
    o.bp[2].gan.set(0, 0.04, 0);                         // thân mọc từ mặt đất
    o.bp[1].gan.set(0, 0.04 + caoThan * 0.60, 0);        // cành bám lưng chừng thân
    o.bp[0].gan.set(0, 0.04 + caoThan + 0.24 * laM, 0);  // tán ngồi trên ngọn

    o.bp[3].mesh.scale.setScalar(Math.max(0.02, reM));
    o.bp[2].mesh.scale.set(1, Math.max(0.02, thanM), 1);
    o.bp[1].mesh.scale.setScalar(Math.max(0.02, canhM));
    o.bp[0].mesh.scale.setScalar(Math.max(0.02, laM));

    /* ═══ gió: chuyển động phụ, thứ làm cây trông còn sống ═══ */
    if (S.tach < 0.05) {
      o.bp[2].mesh.rotation.z = gio * 0.028 * thanM;
      o.bp[2].mesh.rotation.x = gio * 0.018 * thanM;
      o.bp[1].mesh.rotation.z = gio * 0.05 * canhM;
      o.bp[0].mesh.rotation.z = gio * 0.085 * laM;
      o.bp[0].mesh.rotation.x = A.gio(S.tgSong * 0.8 + 2) * S.mo * 0.05 * laM;

      /* từng khối lá lắc lệch pha nhau, không lắc đồng loạt */
      for (var n = 0; n < o.la.length; n++) {
        var LA = o.la[n], g0 = LA.userData.goc;
        var r1 = A.gio(S.tgSong * 1.15 + LA.userData.pha) * S.mo;
        LA.position.set(g0.x + r1 * 0.035, g0.y + r1 * 0.018, g0.z + r1 * 0.03);
        LA.rotation.z = r1 * 0.12;
      }
      for (var cq = 0; cq < o.canh.length; cq++) {
        o.canh[cq].rotation.y = A.gio(S.tgSong + o.canh[cq].userData.pha) * S.mo * 0.07;
      }
    }

    /* ═══ mổ xẻ: bộ phận bật ra theo cung, có vọt qua rồi lùi về ═══ */
    for (var i = 0; i < o.bp.length; i++) {
      var b = o.bp[i];
      var muc = A.kep(S.tach - i, 0, 1);

      if (muc <= 0.001) {
        b.mesh.position.copy(b.gan);
      } else {
        var e = A.vot(muc, 1.25);
        b.mesh.position.set(
          b.gan.x + (b.dich[0] - b.gan.x) * e,
          b.gan.y + (b.dich[1] - b.gan.y) * e + Math.sin(muc * Math.PI) * 0.40,
          b.gan.z + (b.dich[2] - b.gan.z) * e
        );
        /* xoay quanh trục riêng, chậm dần rồi trôi lững lờ */
        var xoay = A.chamDan(muc) * 2.3 + (muc >= 1 ? S.tgTach * 0.25 : 0);
        b.mesh.setRotationFromAxisAngle(b.truc, xoay);
      }

      var hienNhan = A.kep((muc - 0.45) / 0.35, 0, 1);
      b.nhan.visible = hienNhan > 0.02;
      if (b.nhan.visible) {
        b.nhan.material.opacity = hienNhan * 0.95;
        b.nhan.position.copy(b.mesh.position)
          .add(new THREE.Vector3(0, 0.34 + hienNhan * 0.12, 0));
        b.nhan.lookAt(ctx.camera.position);
      }
    }
    if (S.tach >= 4) S.tgTach += dt;

    /* ═══ quả: chín SO LE, mỗi quả bật ra rồi lùi về ═══ */
    var chin = S.che === 'BIEN_CHUNG' ? A.doan(S.tg, 0.76, 0.98) : 0;
    var ngon = o.bp[0].mesh.position;
    for (var q = 0; q < o.qua.length; q++) {
      var Q = o.qua[q];
      var mq = A.doan(chin, Q.userData.thu * 0.55, Q.userData.thu * 0.55 + 0.45);
      Q.visible = mq > 0.02 && S.tach < 0.2;
      if (!Q.visible) continue;
      var ga = Q.userData.goc + gio * 0.06;
      Q.position.set(
        ngon.x + Math.cos(ga) * 0.30,
        ngon.y + Q.userData.cao + gio * 0.02,
        ngon.z + Math.sin(ga) * 0.30
      );
      Q.scale.setScalar(A.vot(mq, 2.2) * 1.0);
    }

    /* ═══ ba mối liên hệ ═══ */
    for (var k = 0; k < o.lienHe.length; k++) {
      var L = o.lienHe[k];
      var hien = S.mo * (0.30 + 0.70 * A.muot(A.doan(S.tg, 0, 0.6)));
      var nhip = 1 + Math.sin(S.tgSong * 1.6 + k * 2.1) * 0.10 * S.mo;
      L.hinh.material.opacity = hien * 0.85;
      L.day.material.opacity = hien * (0.35 + Math.sin(S.tgSong * 2.4 + k) * 0.15);
      L.nhan.material.opacity = hien * 0.9;
      L.den.intensity = hien * 1.3 * nhip;
      L.hinh.scale.setScalar(nhip);
      L.nhan.lookAt(ctx.camera.position);
      if (k === 2) L.hinh.rotation.y += dt * 0.3 * S.mo;
    }

    /* ═══ tay gạt: vọt qua rồi ổn định, như cần gạt thật ═══ */
    var dich = S.che === 'BIEN_CHUNG' ? 0.5 : -0.5;
    S.gatV = (S.gatV || 0) + (dich - o.tayGat.rotation.z) * dt * 260;
    S.gatV *= Math.exp(-13 * dt);
    o.tayGat.rotation.z += S.gatV * dt;
    o.matNum.color.setRGB(0.66 - S.mo * 0.10, 0.77 - S.mo * 0.06, 1.0 - S.mo * 0.59);

    /* ═══ ánh sáng phòng đổi theo phương pháp ═══ */
    o.den.roi.color.setRGB(0.80 + S.mo * 0.20, 0.86 + S.mo * 0.04, 1.0 - S.mo * 0.30);
    o.den.roi.intensity = 1.2 + S.mo * 0.5;
  }

  /* ═══════════ thẻ nội dung ═══════════ */

  function theBaiHoc(ctx) {
    var B = ctx.text.baiHoc;

    ctx.soTay.ghi({
      ten: ctx.text.soTay.ten,
      tom: ctx.text.soTay.tom,
      trichDan: B.trichDan,
      nguon: B.nguon
    });
    ctx.hoanThanh();

    var nhac = S.daThuTach
      ? '<p class="note">' + B.nhacTach.replace('%n', Math.floor(S.tach)) + '</p>'
      : '';

    ctx.hud.the(
      '<div class="eyebrow">' + B.nhan + '</div>' +
      '<h1>' + B.tieuDe + '</h1>' +
      '<p>' + B.dan + '</p>' +
      '<dl>' + B.dinhNghia.map(function (d) {
        return '<dt>' + d[0] + '</dt><dd>' + d[1] + '</dd>';
      }).join('') + '</dl>' +
      '<blockquote class="quote">' + B.trichDan +
        '<cite>' + B.nguon + '</cite></blockquote>' +
      '<h2>Ý nghĩa phương pháp luận</h2>' +
      B.phuongPhapLuan.map(function (d) {
        return '<p><strong>' + d[0] + ' —</strong> ' + d[1] + '</p>';
      }).join('') +
      '<h2>' + B.lienHe.tieuDe + '</h2>' +
      '<p>' + B.lienHe.than + '</p>' +
      nhac,
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var T = ctx.text;

    if (!S.xong) logic(dt, ctx);
    hinhAnh(dt, ctx);

    var bc = S.che === 'BIEN_CHUNG';

    el.m.textContent = T.cheDo[S.che];
    el.m.style.color = bc ? '#b86e14' : '#3d6fbf';
    el.n.textContent = bc ? Math.round(S.tg * 100) : Math.floor(S.tach);
    el.u.textContent = bc ? '%' : '/4';
    el.fill.style.width = (bc ? S.tg * 100 : S.tach / 4 * 100) + '%';
    el.lbl.textContent = bc ? T.nhan.thoiGian : T.nhan.tachRoi;

    el.node.classList.toggle('on', S.daBeTac && !bc);
    el.val.textContent = Math.floor(S.tach);

    ctx.hud.hienPanel(!!S.gan);
    ctx.hud.ngam(!!S.gan);

    if (S.nhacT > 0) {
      S.nhacT -= dt;
      ctx.hud.goiY(S.daBeTac && !bc ? T.beTac + ' &nbsp;·&nbsp; ' + T.nhacNho : T.nhacNho);
    } else if (S.gan === 'CAN') {
      ctx.hud.goiY(ctx.player.lockBroken ? T.goiYCanDP : T.goiYCan);
    } else if (S.gan === 'CAY') {
      ctx.hud.goiY(bc ? T.goiYCayB : T.goiYCayS);
    } else {
      ctx.hud.goiY(T.goiYXa);
    }
    ctx.hud.hienGoiY(!S.xong);
  }

  function dispose() { S = o = el = null; }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'bien-chung',
    tieuDe: 'Biện chứng · Siêu hình',
    nhanNgan: 'Tầng I · Chương 1',
    moTa: 'Một cái cây trong lồng kính. Hai cách nhìn, hai kết quả.',
    goiY: {
      khoa:    'Lại gần cần gạt hoặc cái cây, giữ <kbd>Chuột trái</kbd>',
      duPhong: 'Lại gần cần gạt hoặc cái cây, giữ <kbd>F</kbd> / <kbd>R</kbd>'
    },
    build: build,
    update: update,
    dispose: dispose
  });

})(window.TX);
