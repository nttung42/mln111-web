/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — HAI CÁCH NHÌN  (Biện chứng và Siêu hình)
   (Giáo trình, Chương 1, mục 1.1.3)

   Một phòng — hai thế giới — cùng một sự vật.

   Một đường ranh giới chạy dọc giữa phòng (trục x = 0):

     x < 0   SIÊU HÌNH   tĩnh · tách rời · cố định · hình học.
             Mặt trời, nước, đất, bánh răng — mỗi thứ một bệ vuông,
             cách đều nhau, đứng yên tuyệt đối. Trần lưới dầm thẳng.

     x > 0   BIỆN CHỨNG  động · liên hệ · biến đổi · hữu cơ.
             Vẫn bốn thứ ấy, nhưng nối vào nhau: nắng rọi xuống mầm,
             mưa thấm vào đất, bánh răng kéo nhau quay. Trần là mạng
             cành rễ.

   Ngay trên ranh giới có QUẢ CẦU và CÁI CÂY. Hai vật này không có
   "trạng thái riêng" — chúng mang cách nhìn của phía người chơi đang
   đứng (S.ben). Đó là cơ chế duy nhất của phòng: đi lại và nhìn.

   Cuối phòng là cánh cửa "Sự vật là gì?". Cửa chỉ mở khi đã nhìn cái
   cây từ cả hai phía. Qua cửa, ranh giới tan và hai nửa nối vào nhau.

   Lưu ý học thuật: phòng KHÔNG nói siêu hình là vô dụng — hiện vật bên
   trái được đo đạc chính xác, và khi hợp nhất chúng không biến mất mà
   được nối vào mạng liên hệ. Thẻ bài học nói rõ điều này.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  /* ---------- bố cục (m) ---------- */
  var X_BE   = -4.6;                       // hàng bệ bên siêu hình
  var Z_BE   = [3.9, 1.3, -1.3, -3.9];     // cách đều 2,6 m — đúng tinh thần "cố định"
  var CAU    = { z: 1.2, y: 1.62, r: 0.42 };
  var CAY_Z  = -3.0;
  var CUA_Z  = -TX.KICH_THUOC.d / 2;
  var TAM_CUA = 2.5;                       // đứng trong bán kính này thì tương tác được với cửa
  var TAM_CAY = 4.2;                       // đứng trong bán kính này thì tính là "đã nhìn cái cây"

  /* bên biện chứng */
  var P_TROI  = [4.2, 4.0, 1.6];           // mặt trời treo
  var P_DAT   = [4.2, 0.0, 1.6];           // gò đất, ngay dưới mặt trời
  var P_MAY   = [6.0, 3.5, 4.4];           // mây
  var P_VUNG  = [6.0, 0.0, 4.4];           // vũng nước dưới mây
  var X_RANG  = TX.KICH_THUOC.w / 2 - 0.16;   // bánh răng gắn trên tường phải

  var CHU_KY_CAY = 17;   // giây cho một vòng mầm → cây → lá rụng → về đất
  var CHU_KY_CAU = 9;    // giây cho một vòng ● → ◐ → ○ → ✦ → ●
  var NHIN_TRE   = 0.3;  // nhìn chừng ấy giây mới hiện chú giải

  var MAU_LANH = 0x8fa3bf;   // xám lam — bên siêu hình
  var MAU_AM   = 0xe9a35a;   // cam hổ phách — bên biện chứng

  var S, o, el;

  /* ═══════════ tiện ích ═══════════ */

  function v3(a) { return new THREE.Vector3(a[0], a[1], a[2]); }

  /* RNG có hạt giống: cành trên trần mọc giống hệt nhau mỗi lần vào phòng */
  function rngHat(hat) {
    return function () {
      hat |= 0; hat = hat + 0x6D2B79F5 | 0;
      var t = Math.imul(hat ^ hat >>> 15, 1 | hat);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* tham số phải đi qua constructor: gán thẳng m.emissive = 0x... sẽ thay
     đối tượng Color bằng một con số và vật liệu render ra màu đen */
  function matDung(mau, them) {
    var thamSo = { color: mau, roughness: 0.6 };
    if (them) for (var k in them) thamSo[k] = them[k];
    return new THREE.MeshStandardMaterial(thamSo);
  }

  function hop(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }

  /* Chữ vẽ bằng canvas lên một tấm phẳng.
     dong: [[chữ, font, màu, y], ...] — y tính theo pixel canvas. */
  function chu(cw, ch, rong, dong, nen) {
    var c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    var g = c.getContext('2d');
    g.clearRect(0, 0, cw, ch);
    if (nen) nen(g, cw, ch);
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    dong.forEach(function (d) {
      g.font = d[1];
      g.fillStyle = d[2];
      try { g.letterSpacing = d[4] || '0px'; } catch (e) {}
      /* dòng dài thì co chữ cho vừa tấm, không để tràn mép */
      var co = parseInt(/(\d+)px/.exec(d[1])[1], 10);
      while (co > 12 && g.measureText(d[0]).width > cw - 56) {
        co -= 2;
        g.font = d[1].replace(/\d+px/, co + 'px');
      }
      g.fillText(d[0], cw / 2, d[3]);
    });
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    return new THREE.Mesh(
      new THREE.PlaneGeometry(rong, rong * ch / cw),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
  }

  var SANS = '"Be Vietnam Pro", "Segoe UI", sans-serif';
  function fTieuDe(co, nghieng) { return (nghieng ? 'italic 500 ' : '600 ') + co + 'px ' + TX.FONT_TIEU_DE; }
  function fSans(co, dam) { return (dam || 500) + ' ' + co + 'px ' + SANS; }

  /* Đường năng lượng: một ống mảnh dọc theo đường cong, và những chấm
     sáng chạy dọc theo nó. Đây là "mối liên hệ" nhìn thấy được. */
  function duongNang(nhom, diem, mau, opts) {
    opts = opts || {};
    var curve = new THREE.CatmullRomCurve3(diem.map(v3));
    var mat = new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0, depthWrite: false });
    var ong = new THREE.Mesh(new THREE.TubeGeometry(curve, opts.doan || 64, opts.ban || 0.014, 6, false), mat);
    nhom.add(ong);
    var so = opts.so || 10;
    var hat = TX.heHat(nhom, so, mau, opts.coHat || 0.12, 0);
    var d = {
      curve: curve, ong: ong, mat: mat, hat: hat, so: so,
      toc: opts.toc || 0.18, doMo: opts.doMo === undefined ? 0.5 : opts.doMo,
      soChiSo: ong.geometry.index.count
    };
    o.duong.push(d);
    return d;
  }

  /* muc: 0..1 độ hiện; mocRa: 0..1 phần đường đã mọc (để vẽ dần khi hợp nhất) */
  function capNhatDuong(d, t, muc, mocRa) {
    if (mocRa === undefined) mocRa = 1;
    var hien = muc > 0.005 && mocRa > 0.005;
    d.ong.visible = d.hat.pts.visible = hien;
    if (!hien) return;
    d.mat.opacity = d.doMo * muc;
    d.ong.geometry.setDrawRange(0, Math.floor(d.soChiSo * mocRa / 3) * 3);
    d.hat.pts.material.opacity = 0.95 * muc;
    var p = d.hat.pos;
    for (var i = 0; i < d.so; i++) {
      var u = (((t * d.toc + i / d.so) % 1 + 1) % 1) * mocRa;
      var q = d.curve.getPointAt(u);
      p[i * 3] = q.x; p[i * 3 + 1] = q.y; p[i * 3 + 2] = q.z;
    }
    d.hat.capNhat();
  }

  /* Bánh răng: đường viền răng cưa, đục lỗ giữa, đùn dày. */
  function hinhBanhRang(r, soRang, day) {
    var s = new THREE.Shape();
    var rTrong = r * 0.82, buoc = Math.PI * 2 / soRang;
    for (var i = 0; i < soRang; i++) {
      var a = i * buoc;
      var diem = [[rTrong, a], [r, a + buoc * 0.18], [r, a + buoc * 0.46], [rTrong, a + buoc * 0.64]];
      for (var k = 0; k < 4; k++) {
        var x = Math.cos(diem[k][1]) * diem[k][0], y = Math.sin(diem[k][1]) * diem[k][0];
        if (i === 0 && k === 0) s.moveTo(x, y); else s.lineTo(x, y);
      }
    }
    var lo = new THREE.Path();
    lo.absarc(0, 0, r * 0.2, 0, Math.PI * 2, true);
    s.holes.push(lo);
    var geo = new THREE.ExtrudeGeometry(s, { depth: day, bevelEnabled: false, curveSegments: 6 });
    geo.translate(0, 0, -day / 2);
    return geo;
  }

  /* Giọt nước: xoay một đường cong quanh trục đứng */
  function hinhGiot(r) {
    var pts = [];
    for (var i = 0; i <= 16; i++) {
      var t = i / 16;
      var y = -Math.cos(t * Math.PI) * r;                         // -r..r
      var ban = Math.sin(t * Math.PI) * r * (1 - t * 0.55);       // nhọn dần về đỉnh
      pts.push(new THREE.Vector2(Math.max(0.0001, ban), y + (t > 0.85 ? (t - 0.85) * r * 2.5 : 0)));
    }
    return new THREE.LatheGeometry(pts, 24);
  }

  function texQuang(mau) {
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, mau + '1)');
    grd.addColorStop(0.3, mau + '.45)');
    grd.addColorStop(1, mau + '0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    S = {
      ben: 0.5,           // 0 = đứng hẳn bên siêu hình, 1 = hẳn bên biện chứng
      benHien: 0.5,       // cách nhìn áp lên quả cầu và cái cây (sau hợp nhất = 1)
      thay: { trai: false, phai: false },
      chuCay: 0.5,        // pha của vòng đời cái cây, 0..1 — bắt đầu khi cây đã lớn
      phaCau: 0,          // pha của quả cầu, 0..1
      tgSong: 0,          // đồng hồ của sự sống — đứng yên khi nhìn theo lối siêu hình
      t: 0,               // đồng hồ chung cho bên biện chứng (bên ấy luôn chạy)
      moCua: 0,           // 0..1
      hop: 0,             // 0..1 — hai nửa hợp nhất
      dangHop: false,
      xong: false,
      gan: null,          // 'CUA' | 'CAY' | null
      nhamId: null, nhamT: 0
    };
    o = { duong: [], nhin: [], tia: new THREE.Raycaster(), diemNhin: new THREE.Vector2() };

    TX.dungVoPhong(ctx.scene);
    /* lưới sàn chung của mọi phòng: tắt đi, mỗi bên tự kẻ sàn theo kiểu của mình */
    ctx.scene.children.forEach(function (c) { if (c.type === 'GridHelper') c.visible = false; });

    o.cayNhom = new THREE.Group();
    o.cayNhom.position.set(0, 0, CAY_Z);
    ctx.scene.add(o.cayNhom);
    o.den = TX.dungAnhSang(ctx.scene, o.cayNhom);
    o.den.roi.position.set(0, 5.0, -1.2);
    o.den.roi.angle = Math.PI / 3.6;
    o.den.roi.intensity = 0.8;

    dungRanhGioi(ctx);
    dungBenTrai(ctx);
    dungBenPhai(ctx);
    dungQuaCau(ctx);
    dungCay(ctx);
    dungCua(ctx);
    dungDuongHopNhat(ctx);
    dungPanel(ctx);

    var bl = [
      { x: 0, z: CAU.z, r: 0.95 },
      { x: 0, z: CAY_Z, r: 1.25 },
      { x: P_DAT[0], z: P_DAT[2], r: 1.1 },
      { x: P_VUNG[0], z: P_VUNG[2], r: 0.7 }
    ];
    Z_BE.forEach(function (z) { bl.push({ x: X_BE, z: z, r: 0.75 }); });
    ctx.player.blockers = bl;
  }

  /* ---------- 2. ranh giới và vỏ phòng chia đôi ---------- */

  function dungRanhGioi(ctx) {
    var g = ctx.scene, K = TX.KICH_THUOC;

    /* vạch sáng trên sàn, chạy suốt chiều dài phòng, nối lên tường và trần */
    o.matVach = new THREE.MeshBasicMaterial({ color: 0xb8873a, transparent: true, opacity: 0.85 });
    var vachSan = hop(0.06, 0.01, K.d, o.matVach);
    vachSan.position.set(0, 0.02, 0);
    g.add(vachSan);
    var vachTran = hop(0.06, 0.01, K.d, o.matVach);
    vachTran.position.set(0, K.h - 0.02, 0);
    g.add(vachTran);
    [-1, 1].forEach(function (s) {
      var v = hop(0.06, K.h, 0.01, o.matVach);
      v.position.set(0, K.h / 2, s * (K.d / 2 - 0.03));
      g.add(v);
    });

    /* "màng" ranh giới: một tấm trong suốt, đậm ở chân, nhạt dần lên trên */
    o.matMang = new THREE.ShaderMaterial({
      uniforms: { uDoMo: { value: 1 }, uTime: TX.uTime },
      vertexShader:
        'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: [
        'uniform float uDoMo; uniform float uTime; varying vec2 vUv;',
        'void main(){',
        '  float chan = pow(1.0 - vUv.y, 2.2);',
        '  float soc = 0.5 + 0.5 * sin(vUv.x * 120.0);',
        '  float a = (0.10 * chan + 0.025 * soc * (1.0 - vUv.y)) * uDoMo;',
        '  gl_FragColor = vec4(0.80, 0.62, 0.30, a);',
        '}'
      ].join('\n'),
      transparent: true, depthWrite: false, side: THREE.DoubleSide
    });
    var mang = new THREE.Mesh(new THREE.PlaneGeometry(K.d, K.h), o.matMang);
    mang.rotation.y = Math.PI / 2;
    mang.position.set(0, K.h / 2, 0);
    g.add(mang);

    /* hai nửa tường, sàn, trần mang hai sắc khác nhau */
    o.matPhuTrai = new THREE.MeshStandardMaterial({
      color: 0xdfe4ec, roughness: 0.5, emissive: 0x3a4250, emissiveIntensity: 0.45, side: THREE.DoubleSide
    });
    o.matPhuPhai = new THREE.MeshStandardMaterial({
      color: 0xeed6b6, roughness: 0.85, emissive: 0x5a4028, emissiveIntensity: 0.3, side: THREE.DoubleSide
    });
    [[-1, o.matPhuTrai], [1, o.matPhuPhai]].forEach(function (b) {
      var s = b[0], m = b[1];
      var canh = new THREE.Mesh(new THREE.PlaneGeometry(K.d, K.h - 0.7), m);   // tường cạnh
      canh.rotation.y = -s * Math.PI / 2;
      canh.position.set(s * (K.w / 2 - 0.02), K.h / 2, 0);
      g.add(canh);
      [-1, 1].forEach(function (zs) {                                         // nửa tường đầu và cuối
        var dau = new THREE.Mesh(new THREE.PlaneGeometry(K.w / 2 - 0.05, K.h - 0.7), m);
        dau.rotation.y = zs > 0 ? Math.PI : 0;
        dau.position.set(s * (K.w / 4 + 0.02), K.h / 2, zs * (K.d / 2 - 0.02));
        g.add(dau);
      });
    });

    /* sàn: bên trái lưới ô vuông đều tăm tắp, bên phải những đường nối uốn lượn */
    g.add(sanNua(-1));
    g.add(sanNua(1));
  }

  function sanNua(s) {
    var K = TX.KICH_THUOC;
    var c = document.createElement('canvas');
    c.width = 512; c.height = 1024;
    var g = c.getContext('2d');
    var px = 512 / (K.w / 2);                 // pixel trên mỗi mét
    /* đổi toạ độ phòng (x, z) sang pixel của nửa sàn này */
    function P(x, z) { return [(s > 0 ? x : x + K.w / 2) * px, (z + K.d / 2) * px]; }

    if (s < 0) {
      g.fillStyle = 'rgba(196,206,222,.30)';
      g.fillRect(0, 0, 512, 1024);
      g.strokeStyle = 'rgba(110,128,156,.45)';
      g.lineWidth = 2;
      for (var x = 0; x <= 512; x += px) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1024); g.stroke(); }
      for (var y = 0; y <= 1024; y += px) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
      /* ô vuông dưới mỗi bệ */
      g.strokeStyle = 'rgba(80,98,128,.6)';
      g.lineWidth = 3;
      Z_BE.forEach(function (z) {
        var p = P(X_BE, z);
        g.strokeRect(p[0] - px * 0.6, p[1] - px * 0.6, px * 1.2, px * 1.2);
      });
    } else {
      g.fillStyle = 'rgba(244,214,170,.22)';
      g.fillRect(0, 0, 512, 1024);
      var nut = [P(0.6, CAU.z), P(0.9, CAY_Z), P(P_DAT[0], P_DAT[2]), P(P_VUNG[0], P_VUNG[2]),
                 P(7.2, -2.6), P(5.5, -5.8), P(2.6, 5.6), P(6.4, 6.6), P(3.0, -1.0)];
      var rnd = rngHat(7);
      g.lineCap = 'round';
      for (var i = 0; i < nut.length; i++) {
        for (var j = i + 1; j < nut.length; j++) {
          if (rnd() < 0.45) continue;
          var a = nut[i], b = nut[j];
          g.strokeStyle = 'rgba(196,128,56,' + (0.18 + rnd() * 0.25).toFixed(2) + ')';
          g.lineWidth = 2 + rnd() * 3;
          g.beginPath();
          g.moveTo(a[0], a[1]);
          g.bezierCurveTo(a[0] + (rnd() - 0.5) * 300, a[1] + (rnd() - 0.5) * 300,
                          b[0] + (rnd() - 0.5) * 300, b[1] + (rnd() - 0.5) * 300, b[0], b[1]);
          g.stroke();
        }
      }
      nut.forEach(function (n) {
        g.fillStyle = 'rgba(206,136,60,.55)';
        g.beginPath(); g.arc(n[0], n[1], 7, 0, Math.PI * 2); g.fill();
      });
    }
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    var m = new THREE.Mesh(new THREE.PlaneGeometry(K.w / 2, K.d),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(s * K.w / 4, 0.012, 0);
    return m;
  }

  /* ---------- 3. bên SIÊU HÌNH ---------- */

  function dungBenTrai(ctx) {
    var g = ctx.scene, K = TX.KICH_THUOC, T = ctx.text;

    /* trụ áp tường: cách đều, góc vuông */
    var matTru = matDung(0xeef1f5, { roughness: 0.4 });
    [-6.3, -4.2, -2.1, 2.1, 4.2, 6.3].forEach(function (z) {
      var t = hop(0.28, K.h, 0.36, matTru);
      t.position.set(-K.w / 2 + 0.14, K.h / 2, z);
      g.add(t);
    });
    [-6.4, -4.8].forEach(function (x) {
      [-1, 1].forEach(function (zs) {
        var t = hop(0.36, K.h, 0.28, matTru);
        t.position.set(x, K.h / 2, zs * (K.d / 2 - 0.14));
        g.add(t);
      });
    });

    /* trần: lưới dầm thẳng, đều tuyệt đối */
    var matDam = matDung(0xd6dce6, { roughness: 0.5 });
    for (var x = -7.0; x <= -0.4; x += 1.1) {
      var d1 = hop(0.12, 0.22, K.d, matDam);
      d1.position.set(x, K.h - 0.11, 0);
      g.add(d1);
    }
    for (var z = -6.6; z <= 6.6; z += 1.1) {
      var d2 = hop(K.w / 2 - 0.3, 0.16, 0.10, matDam);
      d2.position.set(-K.w / 4 - 0.15, K.h - 0.08, z);
      g.add(d2);
    }

    /* biển lớn trên tường trái */
    var bien = chu(1024, 300, 3.6, [
      [T.tuong.trai[0], fTieuDe(92), '#3f4f6a', 130, '14px'],
      [T.tuong.trai[1], fTieuDe(44, true), '#6f7d93', 220]
    ]);
    bien.position.set(-K.w / 2 + 0.06, 3.55, 0);
    bien.rotation.y = Math.PI / 2;
    g.add(bien);

    /* ánh sáng: lạnh, thẳng, cố định — một đèn rọi cho mỗi bệ */
    var lanh = new THREE.DirectionalLight(0xdbe6ff, 0.35);
    lanh.position.set(-6, 6, 2);
    g.add(lanh);
    o.denBe = [];

    /* bệ và hiện vật */
    var matBe = matDung(0xf2f4f7, { roughness: 0.35, metalness: 0.1 });
    o.hienVat = [];
    var vat = [
      /* 0 MẶT TRỜI: một quả cầu vàng đặc, không toả sáng */
      function () {
        return new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 20),
          matDung(0xd9b45a, { roughness: 0.45, metalness: 0.2, emissive: 0xffa040, emissiveIntensity: 0 }));
      },
      /* 1 NƯỚC: một giọt đông cứng */
      function () {
        return new THREE.Mesh(hinhGiot(0.22),
          new THREE.MeshPhysicalMaterial({ color: 0x8ec3ee, roughness: 0.08, transmission: 0, opacity: 0.85,
            transparent: true, emissive: 0x2a5d8a, emissiveIntensity: 0 }));
      },
      /* 2 ĐẤT: một khối vuông nén chặt */
      function () {
        return new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4),
          matDung(0x8a6a44, { roughness: 0.95, flatShading: true, emissive: 0x5a3a18, emissiveIntensity: 0 }));
      },
      /* 3 BÁNH RĂNG: đứng yên, không ăn khớp với gì */
      function () {
        var m = new THREE.Mesh(hinhBanhRang(0.3, 12, 0.08),
          matDung(0xa9b2bf, { roughness: 0.35, metalness: 0.6, emissive: 0x806030, emissiveIntensity: 0 }));
        m.rotation.y = Math.PI / 2;
        return m;
      }
    ];

    Z_BE.forEach(function (z, i) {
      var be = hop(0.72, 1.05, 0.72, matBe);
      be.position.set(X_BE, 0.525, z);
      be.castShadow = be.receiveShadow = true;
      g.add(be);
      var mu = hop(0.82, 0.06, 0.82, matBe);
      mu.position.set(X_BE, 1.08, z);
      g.add(mu);

      var m = vat[i]();
      m.position.set(X_BE, 1.4, z);
      m.castShadow = true;
      g.add(m);
      o.hienVat.push({ mesh: m, y: 1.4, i: i });

      /* nhãn hiện vật trên mặt bệ hướng ra lối đi */
      var nhan = chu(512, 200, 0.62, [
        [T.hienVat[i][0], fTieuDe(64), '#33415a', 92, '4px'],
        [T.hienVat[i][1], fSans(30, 400), '#7a8496', 150, '3px']
      ], function (c, w, h) {
        c.fillStyle = 'rgba(255,255,255,.75)';
        c.fillRect(8, 8, w - 16, h - 16);
        c.strokeStyle = 'rgba(80,98,128,.5)';
        c.lineWidth = 3;
        c.strokeRect(8, 8, w - 16, h - 16);
      });
      nhan.position.set(X_BE + 0.362, 0.72, z);
      nhan.rotation.y = Math.PI / 2;
      g.add(nhan);

      /* đèn rọi thẳng đứng, lạnh */
      var den = new THREE.SpotLight(0xe4ecff, 0.9, 7, 0.32, 0.25, 1.5);
      den.position.set(X_BE, K.h - 0.3, z);
      den.target = m;
      g.add(den);
      o.denBe.push(den);

      vungNhin(g, new THREE.BoxGeometry(0.9, 1.9, 0.9), [X_BE, 0.95, z], 'be');
    });
  }

  /* ---------- 4. bên BIỆN CHỨNG ---------- */

  function dungBenPhai(ctx) {
    var g = ctx.scene, K = TX.KICH_THUOC, T = ctx.text;
    var rnd = rngHat(42);

    /* gân cong: mọc từ chân tường phải, uốn lên trần rồi toả thành cành */
    var matGan = matDung(0xc9a477, { roughness: 0.7, emissive: 0x5a3818, emissiveIntensity: 0.35 });
    var dauCanh = [];
    [-6.2, -4.7, -0.4, 3.1, 5.9].forEach(function (z0, i) {
      var lech = (i % 2 ? 1 : -1) * 0.5;
      var pts = [
        [K.w / 2 - 0.05, 0, z0],
        [K.w / 2 - 0.25, 1.6, z0 + lech * 0.4],
        [K.w / 2 - 0.55, 3.4, z0 + lech],
        [K.w / 2 - 1.6,  K.h - 0.25, z0 + lech * 1.6],
        [K.w / 2 - 3.0,  K.h - 0.12, z0 + lech * 1.2]
      ];
      var curve = new THREE.CatmullRomCurve3(pts.map(v3));
      var ong = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.07 - i * 0.004, 8, false), matGan);
      g.add(ong);
      dauCanh.push(pts[4]);
    });

    /* trần: mạng cành rễ nối vào nhau, mọc dần về phía ranh giới */
    o.matCanhTran = matDung(0xc9a477, { roughness: 0.7, emissive: 0x7a4a18, emissiveIntensity: 0.35 });
    var matNut = matDung(0xf0c27a, { emissive: 0xd08a3a, emissiveIntensity: 0.6 });
    var nutTran = [];
    function moc(p, huong, dai, cap) {
      if (cap === 0 || dai < 0.35) return;
      var q = [p[0] + Math.cos(huong) * dai, K.h - 0.1 - rnd() * 0.12, p[2] + Math.sin(huong) * dai];
      q[0] = Math.max(0.4, Math.min(K.w / 2 - 0.4, q[0]));
      q[2] = Math.max(-K.d / 2 + 0.4, Math.min(K.d / 2 - 0.4, q[2]));
      var giua = [(p[0] + q[0]) / 2 + (rnd() - 0.5) * 0.4, K.h - 0.22, (p[2] + q[2]) / 2 + (rnd() - 0.5) * 0.4];
      var curve = new THREE.CatmullRomCurve3([v3(p), v3(giua), v3(q)]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.012 + cap * 0.01, 5, false), o.matCanhTran));
      var nut = new THREE.Mesh(new THREE.SphereGeometry(0.035 + cap * 0.008, 8, 6), matNut);
      nut.position.copy(v3(q));
      g.add(nut);
      nutTran.push(q);
      moc(q, huong + 0.35 + rnd() * 0.4, dai * 0.72, cap - 1);
      moc(q, huong - 0.35 - rnd() * 0.4, dai * 0.72, cap - 1);
    }
    dauCanh.forEach(function (p) { moc(p, Math.PI + (rnd() - 0.5) * 0.8, 1.5, 3); });

    /* những nhịp sáng chạy qua mạng cành, nối các nút trên trần */
    o.nhipTran = [];
    for (var k = 0; k < 4; k++) {
      var a = nutTran[(k * 7) % nutTran.length], b = nutTran[(k * 11 + 5) % nutTran.length];
      o.nhipTran.push(duongNang(g, [a, [(a[0] + b[0]) / 2, K.h - 0.35, (a[2] + b[2]) / 2], b], MAU_AM,
        { so: 4, toc: 0.12, ban: 0.008, doMo: 0.25, coHat: 0.1 }));
    }

    /* biển lớn trên tường phải */
    var bien = chu(1024, 300, 3.6, [
      [T.tuong.phai[0], fTieuDe(92), '#8a4f14', 130, '14px'],
      [T.tuong.phai[1], fTieuDe(44, true), '#a0703a', 220]
    ]);
    bien.position.set(K.w / 2 - 0.06, 3.55, 1.4);
    bien.rotation.y = -Math.PI / 2;
    g.add(bien);

    /* --- MẶT TRỜI: toả sáng, trôi nhẹ, rọi nắng xuống mầm --- */
    o.troi = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 20),
      new THREE.MeshBasicMaterial({ color: 0xffc56e }));
    o.troi.position.copy(v3(P_TROI));
    g.add(o.troi);
    o.quangTroi = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texQuang('rgba(255,190,100,'), transparent: true, depthWrite: false, opacity: 0.9
    }));
    o.quangTroi.scale.set(2.4, 2.4, 1);
    o.troi.add(o.quangTroi);
    o.denTroi = new THREE.PointLight(0xffb866, 1.3, 11, 1.6);
    o.troi.add(o.denTroi);

    /* chùm nắng: nón trong suốt từ mặt trời xuống mầm */
    var caoNang = P_TROI[1] - 0.3;
    o.matNang = new THREE.MeshBasicMaterial({ color: 0xffd08a, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
    var nang = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.85, caoNang, 32, 1, true), o.matNang);
    nang.position.set(P_TROI[0], caoNang / 2, P_TROI[2]);
    g.add(nang);

    /* --- ĐẤT: gò đất với một cái mầm --- */
    var go = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      matDung(0x8a6a44, { roughness: 0.95 }));
    go.scale.y = 0.28;
    go.position.copy(v3(P_DAT));
    go.receiveShadow = true;
    g.add(go);

    o.mam = new THREE.Group();
    o.mam.position.set(P_DAT[0], 0.27, P_DAT[2]);
    g.add(o.mam);
    var matMam = matDung(0x6fae5a, { roughness: 0.6, emissive: 0x2a5a1a, emissiveIntensity: 0.3 });
    var gThanMam = new THREE.CylinderGeometry(0.02, 0.03, 0.5, 6);
    gThanMam.translate(0, 0.25, 0);
    o.mam.add(new THREE.Mesh(gThanMam, matMam));
    o.laMam = [];
    [-1, 1].forEach(function (s) {
      var la = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), matMam);
      la.scale.set(1, 0.25, 0.5);
      la.position.set(s * 0.1, 0.48, 0);
      la.rotation.z = s * 0.5;
      o.mam.add(la);
      o.laMam.push(la);
    });

    /* --- NƯỚC: mây, mưa rơi xuống vũng, vũng thấm vào đất --- */
    o.may = new THREE.Group();
    o.may.position.copy(v3(P_MAY));
    g.add(o.may);
    var matMay = matDung(0xdfeaf6, { roughness: 0.9, flatShading: true, emissive: 0x6a88a8, emissiveIntensity: 0.35 });
    [[0, 0, 0, 0.42], [0.42, -0.06, 0.1, 0.32], [-0.4, -0.04, -0.08, 0.34], [0.12, 0.2, -0.2, 0.3]].forEach(function (d) {
      var c = new THREE.Mesh(new THREE.IcosahedronGeometry(d[3], 1), matMay);
      c.position.set(d[0], d[1], d[2]);
      o.may.add(c);
    });
    o.mua = TX.heHat(g, 36, 0x5a9ad8, 0.07, 0.8);
    for (var m = 0; m < o.mua.count; m++) {
      o.mua.life[m] = Math.random();
    }
    var vung = new THREE.Mesh(new THREE.CircleGeometry(0.6, 32),
      new THREE.MeshStandardMaterial({ color: 0x8ec3ee, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.75 }));
    vung.rotation.x = -Math.PI / 2;
    vung.position.set(P_VUNG[0], 0.02, P_VUNG[2]);
    g.add(vung);
    o.gon = [];
    for (var r = 0; r < 3; r++) {
      var gon = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.008, 4, 40),
        new THREE.MeshBasicMaterial({ color: 0x5a9ad8, transparent: true, opacity: 0 }));
      gon.rotation.x = Math.PI / 2;
      gon.position.set(P_VUNG[0], 0.03, P_VUNG[2]);
      gon.userData.pha = r / 3;
      g.add(gon);
      o.gon.push(gon);
    }

    /* --- BÁNH RĂNG: ba chiếc ăn khớp, kéo nhau quay --- */
    var matRang = matDung(0xc9a46a, { roughness: 0.35, metalness: 0.5, emissive: 0x6a4a18, emissiveIntensity: 0.3 });
    var rang = [
      { r: 0.6,  n: 16, y: 2.5, z: -2.3 },
      { r: 0.42, n: 11 },
      { r: 0.5,  n: 13 }
    ];
    /* đặt bánh sau ăn khớp với bánh trước theo một góc cho trước */
    [[1, -2.2], [2, Math.PI + 0.5]].forEach(function (d) {
      var a = rang[d[0] - 1], b = rang[d[0]], kc = (a.r + b.r) * 0.9;
      b.y = a.y + Math.sin(d[1]) * kc;
      b.z = a.z + Math.cos(d[1]) * kc;
    });
    o.rang = rang.map(function (d, i) {
      var m = new THREE.Mesh(hinhBanhRang(d.r, d.n, 0.1), matRang);
      var nhom = new THREE.Group();
      nhom.position.set(X_RANG, d.y, d.z);
      nhom.rotation.y = -Math.PI / 2;
      nhom.add(m);
      var truc = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 12), matDung(0x7a6040, { metalness: 0.6 }));
      truc.rotation.x = Math.PI / 2;
      nhom.add(truc);
      g.add(nhom);
      return { mesh: m, n: d.n, chieu: i % 2 ? -1 : 1, lech: i % 2 ? Math.PI / d.n : 0 };
    });

    /* --- các mối liên hệ nối mọi thứ bên này với nhau --- */
    var R0 = rang[0];
    o.lienHePhai = [
      duongNang(g, [P_TROI, [P_TROI[0], 2.0, P_TROI[2]], [P_DAT[0], 0.5, P_DAT[2]]], 0xf0a040, { so: 8, toc: 0.35, doMo: 0.45 }),
      duongNang(g, [[P_VUNG[0], 0.04, P_VUNG[2]], [5.3, 0.05, 3.3], [4.9, 0.06, 2.5], [P_DAT[0] + 0.4, 0.2, P_DAT[2] + 0.4]], 0x5a9ad8, { so: 7, toc: 0.25 }),
      duongNang(g, [[P_DAT[0] + 0.7, 0.1, P_DAT[2] - 0.5], [6.2, 0.06, -0.6], [X_RANG - 0.1, 0.6, -1.6], [X_RANG - 0.1, R0.y - 0.6, R0.z]], 0xc0803a, { so: 8, toc: 0.2 }),
      duongNang(g, [[X_RANG - 0.1, R0.y + 0.6, R0.z], [5.0, 4.4, -1.4], [2.2, 3.8, -0.2], [0.42, CAU.y + 0.25, CAU.z]], 0xd08a3a, { so: 10, toc: 0.16 }),
      duongNang(g, [[P_DAT[0] - 0.7, 0.1, P_DAT[2] - 0.6], [2.6, 0.06, -1.2], [1.2, 0.2, CAY_Z + 0.6]], 0x9a6a30, { so: 8, toc: 0.22 }),
      duongNang(g, [P_TROI, [2.8, 4.3, -0.6], [0.7, 2.6, CAY_Z + 0.2]], 0xf0a040, { so: 9, toc: 0.2 }),
      duongNang(g, [[0.42, CAU.y - 0.1, CAU.z - 0.2], [1.1, 1.3, -0.9], [0.6, 1.6, CAY_Z + 0.7]], 0xd08a3a, { so: 6, toc: 0.24 })
    ];

    vungNhin(g, new THREE.SphereGeometry(0.75, 10, 8), P_TROI, 'lienHe');
    vungNhin(g, new THREE.CylinderGeometry(1.0, 1.0, 1.0, 12), [P_DAT[0], 0.4, P_DAT[2]], 'lienHe');
    vungNhin(g, new THREE.SphereGeometry(0.8, 10, 8), P_MAY, 'lienHe');
    vungNhin(g, new THREE.BoxGeometry(0.4, 2.4, 2.4), [X_RANG - 0.1, 2.3, -2.6], 'lienHe');
  }

  /* ---------- 5. QUẢ CẦU trên ranh giới ---------- */

  var CAU_VS = [
    'varying vec3 vN;',
    'void main() {',
    '  vN = normalize(normalMatrix * normal);',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  /* Màu trả thẳng ra màn hình (không qua chuyển đổi sRGB) nên chọn sẵn ở dạng hiển thị.
     Trái: một nguồn sáng cố định trong không gian thế giới, tông lạnh.
     Phải: nguồn sáng xoay quanh quả cầu trong không gian camera, nên người
     chơi luôn thấy đủ các pha ● → ◐ → ○ dù đứng ở đâu. */
  var CAU_FS = [
    'uniform float uBen;',
    'uniform float uAnh;',
    'uniform float uBung;',
    'uniform vec3 uDenTrai;',
    'varying vec3 vN;',
    'void main() {',
    '  vec3 n = normalize(vN);',
    '  float l1 = max(dot(n, uDenTrai), 0.0);',
    '  vec3 cT = vec3(0.62, 0.67, 0.75) * (0.35 + 0.75 * l1) + vec3(0.06);',
    '  vec3 ld = normalize(vec3(sin(uAnh), 0.12, cos(uAnh)));',
    '  float l2 = smoothstep(-0.06, 0.22, dot(n, ld));',
    '  float vien = pow(1.0 - max(n.z, 0.0), 3.0);',
    '  vec3 cP = mix(vec3(0.20, 0.15, 0.22), vec3(1.0, 0.80, 0.50), l2);',
    '  cP += vien * vec3(1.0, 0.62, 0.30) * 0.55 + uBung * vec3(1.0, 0.86, 0.62);',
    '  gl_FragColor = vec4(mix(cT, cP, uBen), 1.0);',
    '}'
  ].join('\n');

  function dungQuaCau(ctx) {
    var g = ctx.scene;

    /* bệ chia đôi: nửa trái hộp vuông, nửa phải trụ tròn */
    var cao = 1.15;
    var beT = hop(0.55, cao, 1.1, matDung(0xeef1f5, { roughness: 0.4 }));
    beT.position.set(-0.275, cao / 2, CAU.z);
    g.add(beT);
    var beP = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, cao, 32, 1, false, 0, Math.PI),
      matDung(0xe9d4b4, { roughness: 0.7 }));
    beP.position.set(0, cao / 2, CAU.z);
    g.add(beP);

    o.cauU = {
      uBen: { value: 0.5 }, uAnh: { value: 0 }, uBung: { value: 0 },
      uDenTrai: { value: new THREE.Vector3() }
    };
    o.cau = new THREE.Mesh(new THREE.SphereGeometry(CAU.r, 48, 32),
      new THREE.ShaderMaterial({ uniforms: o.cauU, vertexShader: CAU_VS, fragmentShader: CAU_FS }));
    o.cau.position.set(0, CAU.y, CAU.z);
    g.add(o.cau);

    /* nguồn sáng cố định bên trái — thấy được cả chùm sáng */
    o.huongDenTrai = new THREE.Vector3(-2.4, 5.1, CAU.z + 0.6).sub(o.cau.position).normalize();
    var goc = o.cau.position.clone().add(o.huongDenTrai.clone().multiplyScalar(4.0));
    var dai = goc.distanceTo(o.cau.position) - 0.1;
    o.matChumTrai = new THREE.MeshBasicMaterial({ color: 0xc8d6f0, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide });
    var chum = new THREE.Mesh(new THREE.ConeGeometry(0.55, dai, 32, 1, true), o.matChumTrai);
    chum.position.copy(o.cau.position).add(o.huongDenTrai.clone().multiplyScalar(dai / 2 + 0.1));
    chum.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), o.huongDenTrai.clone().negate());
    g.add(chum);
    o.denCau = new THREE.SpotLight(0xe0e8ff, 1.0, 8, 0.2, 0.2, 1.2);
    o.denCau.position.copy(goc);
    o.denCau.target = o.cau;
    g.add(o.denCau);

    /* bên phải: vành năng lượng quay quanh quả cầu */
    o.vanh = [];
    [[0.66, 0.4, 0.2], [0.8, -0.5, 1.1], [0.94, 1.2, -0.4]].forEach(function (d, i) {
      var v = new THREE.Mesh(new THREE.TorusGeometry(d[0], 0.007, 6, 80),
        new THREE.MeshBasicMaterial({ color: i === 1 ? 0xffc06a : MAU_AM, transparent: true, opacity: 0, depthWrite: false }));
      v.position.copy(o.cau.position);
      v.rotation.set(d[1], d[2], 0);
      v.userData.toc = 0.5 + i * 0.25;
      g.add(v);
      o.vanh.push(v);
    });
    o.hatCau = TX.heHat(g, 40, 0xf0a040, 0.06, 0);

    /* ✦: tám tia bung ra ở cuối mỗi vòng */
    o.sao = new THREE.Group();          // nhóm ngoài: luôn quay mặt về người chơi
    o.sao.position.copy(o.cau.position);
    o.saoTrong = new THREE.Group();     // nhóm trong: các tia xoay trong mặt phẳng ấy
    o.sao.add(o.saoTrong);
    var matSao = new THREE.MeshBasicMaterial({ color: 0xffd28a, transparent: true, opacity: 0.9 });
    for (var i = 0; i < 8; i++) {
      var tia = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.5, 6), matSao);
      tia.geometry.translate(0, CAU.r + 0.25, 0);
      tia.rotation.z = i / 8 * Math.PI * 2;
      o.saoTrong.add(tia);
    }
    o.sao.scale.setScalar(0.001);
    g.add(o.sao);

    vungNhin(g, new THREE.SphereGeometry(0.75, 12, 8), [0, CAU.y, CAU.z],
      function () { return S.benHien > 0.5 ? 'cauPhai' : 'cauTrai'; });
  }

  /* ---------- 6. CÁI CÂY trên ranh giới ---------- */

  var CAO_THAN = 1.5;
  var MAU_TUONG = new THREE.Color(0xe8e4dc);    // đá cẩm thạch
  var MAU_VO    = new THREE.Color(0x5a4a32);
  var MAU_LA    = new THREE.Color(0x4e8f5a);
  var MAU_THU   = new THREE.Color(0xd58a36);

  function dungCay(ctx) {
    var g = o.cayNhom;

    /* nền chia đôi: nửa trái bệ đá vuông, nửa phải gò đất */
    var nenT = hop(1.1, 0.35, 2.2, matDung(0xeef1f5, { roughness: 0.4 }));
    nenT.position.set(-0.55, 0.175, 0);
    nenT.receiveShadow = true;
    g.add(nenT);
    var nenP = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 10, Math.PI / 2, Math.PI, 0, Math.PI / 2),
      matDung(0x7a5a38, { roughness: 0.95 }));
    nenP.scale.y = 0.32;
    nenP.receiveShadow = true;
    g.add(nenP);

    o.cay = new THREE.Group();
    o.cay.position.y = 0.35;
    g.add(o.cay);

    o.matVo = matDung(0x5a4a32, { roughness: 0.85 });
    o.matLa = matDung(0x4e8f5a, { roughness: 0.7, flatShading: true });

    /* thân: gốc toạ độ ở chân, nên scale.y làm nó mọc lên */
    var gThan = new THREE.CylinderGeometry(0.08, 0.15, CAO_THAN, 12);
    gThan.translate(0, CAO_THAN / 2, 0);
    o.than = new THREE.Mesh(gThan, o.matVo);
    o.than.castShadow = true;
    o.cay.add(o.than);

    /* cành và tán gắn vào thân, nên lớn lên cùng thân */
    o.canh = [];
    for (var c = 0; c < 5; c++) {
      var b = (c / 5) * Math.PI * 2 + 0.4;
      var dc = 0.5 + (c % 2) * 0.18;
      var gc = new THREE.CylinderGeometry(0.025, 0.045, dc, 6);
      gc.translate(0, dc / 2, 0);
      var canh = new THREE.Mesh(gc, o.matVo);
      canh.position.y = (0.55 + c * 0.08);
      canh.rotation.set(Math.sin(b) * 0.95, 0, -Math.cos(b) * 0.95);
      canh.castShadow = true;
      o.than.add(canh);
      o.canh.push(canh);
    }

    /* tán đặt ngoài thân để không bị méo theo tỉ lệ của thân; vị trí bám tính lại mỗi khung hình */
    o.tan = new THREE.Group();
    o.cay.add(o.tan);
    o.la = [];
    [[0, 0.32, 0, 0.42], [0.36, 0.12, 0.18, 0.3], [-0.34, 0.16, -0.16, 0.32], [0.1, 0.42, -0.3, 0.26],
     [-0.12, 0.05, 0.34, 0.26], [0.28, 0.3, -0.22, 0.22], [-0.3, 0.38, 0.2, 0.22]].forEach(function (d, l) {
      var la = new THREE.Mesh(new THREE.IcosahedronGeometry(d[3], 0), o.matLa);
      la.position.set(d[0], d[1], d[2]);
      la.rotation.set(l * 0.7, l * 1.1, l * 0.5);
      la.userData.goc = la.position.clone();
      la.userData.pha = l * 0.9;
      la.castShadow = true;
      o.tan.add(la);
      o.la.push(la);
    });

    /* rễ: chỉ hiện ở nửa phải — rễ là liên hệ với đất */
    o.re = [];
    for (var r = 0; r < 6; r++) {
      var a = -1.2 + r * 0.48;
      var dai = 1.6 + (r % 3) * 0.5;
      var pts = [[0, 0.3, 0], [Math.cos(a) * 0.6, 0.22, Math.sin(a) * 0.6],
                 [Math.cos(a + 0.2) * dai * 0.65, 0.04, Math.sin(a + 0.2) * dai * 0.65],
                 [Math.cos(a - 0.1) * dai, 0.02, Math.sin(a - 0.1) * dai]];
      var d = duongNang(g, pts, 0x5a9ad8, { so: 4, toc: -0.22, ban: 0.022, doMo: 0.6, coHat: 0.09 });
      d.mat.color.setHex(0x7a5a38);
      o.re.push(d);
    }

    o.laRoi = TX.heHat(ctx.scene, 26, 0xd58a36, 0.12, 0.9);

    vungNhin(ctx.scene, new THREE.CylinderGeometry(1.0, 1.0, 3.2, 12), [0, 1.6, CAY_Z],
      function () { return S.benHien > 0.5 ? 'cayPhai' : 'cayTrai'; });
  }

  /* ---------- 7. CÁNH CỬA cuối phòng ---------- */

  function dungCua(ctx) {
    var g = ctx.scene, T = ctx.text.cua;
    var RONG = 1.9, CAO = 2.6;

    var matKhung = TX.vatLieuVang();
    [-1, 1].forEach(function (s) {
      var tru = hop(0.2, CAO + 0.15, 0.24, matKhung);
      tru.position.set(s * (RONG / 2 + 0.1), (CAO + 0.15) / 2, CUA_Z + 0.12);
      g.add(tru);
    });
    var dinh = hop(RONG + 0.4, 0.2, 0.24, matKhung);
    dinh.position.set(0, CAO + 0.1, CUA_Z + 0.12);
    g.add(dinh);

    /* khoảng sáng phía sau cửa */
    o.matSangCua = new THREE.MeshBasicMaterial({ color: 0xfff6e2, transparent: true, opacity: 0 });
    var sang = new THREE.Mesh(new THREE.PlaneGeometry(RONG, CAO), o.matSangCua);
    sang.position.set(0, CAO / 2, CUA_Z + 0.04);
    g.add(sang);
    o.denCua = new THREE.PointLight(0xfff0d0, 0, 9, 1.5);
    o.denCua.position.set(0, 1.6, CUA_Z + 0.8);
    g.add(o.denCua);

    /* hai cánh: trái đá xám kẻ ô vuông, phải gỗ ấm vân uốn lượn */
    function texCanh(trai) {
      var c = document.createElement('canvas');
      c.width = 256; c.height = 704;
      var x = c.getContext('2d');
      x.fillStyle = trai ? '#dfe4ec' : '#c99a62';
      x.fillRect(0, 0, 256, 704);
      if (trai) {
        x.strokeStyle = 'rgba(80,98,128,.55)'; x.lineWidth = 4;
        for (var i = 0; i < 4; i++) x.strokeRect(28, 28 + i * 166, 200, 140);
      } else {
        x.strokeStyle = 'rgba(110,64,20,.5)'; x.lineWidth = 3;
        for (var k = 0; k < 9; k++) {
          x.beginPath();
          x.moveTo(20 + k * 26, 704);
          x.bezierCurveTo(-40 + k * 40, 480, 260 - k * 20, 260, 40 + k * 22, 0);
          x.stroke();
        }
      }
      var t = new THREE.CanvasTexture(c);
      t.encoding = THREE.sRGBEncoding;
      return t;
    }
    o.canhCua = [-1, 1].map(function (s) {
      var truc = new THREE.Group();
      truc.position.set(s * RONG / 2, 0, CUA_Z + 0.14);
      var la = new THREE.Mesh(new THREE.BoxGeometry(RONG / 2, CAO, 0.06),
        new THREE.MeshStandardMaterial({ map: texCanh(s < 0), roughness: s < 0 ? 0.4 : 0.75 }));
      la.position.set(-s * RONG / 4, CAO / 2, 0);
      la.castShadow = true;
      truc.add(la);
      g.add(truc);
      return { truc: truc, s: s };
    });

    /* câu hỏi phía trên cửa */
    var hoi = chu(1024, 200, 3.2, [[T.hoi, fTieuDe(104), '#5a4020', 138, '4px']]);
    hoi.position.set(0, 3.45, CUA_Z + 0.08);
    g.add(hoi);

    /* hai câu trả lời hai bên cửa */
    function bang(dong, mauTieu, mauChu, nenMau, vienMau) {
      var d = [[dong[0], fTieuDe(52), mauTieu, 76, '8px'], [dong[1], fTieuDe(40, true), mauChu, 152]];
      if (dong[2]) d.push([dong[2], fTieuDe(40, true), mauChu, 206]);
      return chu(768, 260, 2.6, d, function (c, w, h) {
        c.fillStyle = nenMau;
        c.fillRect(6, 6, w - 12, h - 12);
        c.strokeStyle = vienMau; c.lineWidth = 3;
        c.strokeRect(6, 6, w - 12, h - 12);
      });
    }
    var bT = bang(T.trai, '#3f4f6a', '#4a5568', 'rgba(232,237,244,.88)', 'rgba(80,98,128,.6)');
    bT.position.set(-2.85, 1.75, CUA_Z + 0.08);
    g.add(bT);
    var bP = bang(T.phai, '#8a4f14', '#6a4a24', 'rgba(250,236,214,.88)', 'rgba(196,128,56,.6)');
    bP.position.set(2.85, 1.75, CUA_Z + 0.08);
    g.add(bP);

    vungNhin(g, new THREE.BoxGeometry(RONG + 0.4, CAO + 1.4, 0.4), [0, (CAO + 1.4) / 2, CUA_Z + 0.3], 'cua');
  }

  /* đường nối hai nửa — chỉ mọc ra khi hợp nhất */
  function dungDuongHopNhat(ctx) {
    var R0 = o.rang[0].mesh.parent.position;
    var dich = [P_TROI, P_MAY, [P_DAT[0], 0.3, P_DAT[2]], [R0.x - 0.1, R0.y, R0.z]];
    var mau = [0xf0a040, 0x5a9ad8, 0x9a6a30, 0xc0803a];
    o.duongHop = Z_BE.map(function (z, i) {
      var a = [X_BE, 1.4, z], b = dich[i];
      var giua = [(a[0] + b[0]) / 2, 4.3 + i * 0.12, (a[2] + b[2]) / 2];
      return duongNang(ctx.scene, [a, [X_BE + 1.2, 3.0, z], giua, b], mau[i], { so: 12, toc: 0.14, ban: 0.02, doMo: 0.7, doan: 96 });
    });
  }

  /* ---------- vùng nhìn để hiện chú giải ---------- */

  function vungNhin(g, geo, pos, id) {
    var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
    m.visible = false;              // r128: tia vẫn trúng vật ẩn
    m.position.copy(v3(pos));
    m.userData.nhin = id;
    g.add(m);
    o.nhin.push(m);
  }

  /* ═══════════ 8. bảng chỉ số ═══════════ */

  function dungPanel(ctx) {
    var N = ctx.text.nhan;
    ctx.hud.datPanel(
      '<div class="readout">' +
        '<div class="temp"><b id="bcN">0</b><span>/2</span></div>' +
        '<div class="phase"><div class="lbl">' + N.cachNhin + '</div>' +
          '<div class="val" id="bcM"></div></div>' +
      '</div>' +
      '<div class="scale"><div class="cursor" id="bcCur"></div></div>' +
      '<div class="ticks">' +
        '<i style="left:12%"><b>' + N.thanhTrai + '</b></i>' +
        '<i style="left:88%"><b>' + N.thanhPhai + '</b></i>' +
      '</div>' +
      '<div class="nodebar on">' +
        '<div class="cap"><span>' + N.daNhin + '</span><span id="bcThay"></span></div>' +
      '</div>'
    );
    el = {
      n: document.getElementById('bcN'),
      m: document.getElementById('bcM'),
      cur: document.getElementById('bcCur'),
      thay: document.getElementById('bcThay')
    };
  }

  /* ═══════════ logic ═══════════ */

  function logic(dt, ctx) {
    var P = ctx.player;
    var x = P.pos.x;

    S.ben = TX.anim.damp(S.ben, TX.anim.muot((x + 0.7) / 1.4), 5, dt);

    var dCay = P.distTo(0, CAY_Z);
    if (dCay < TAM_CAY) {
      if (x < -0.7) S.thay.trai = true;
      if (x > 0.7) S.thay.phai = true;
    }

    var dCua = P.distTo(0, CUA_Z);
    S.gan = dCua < TAM_CUA ? 'CUA' : (dCay < 3.0 ? 'CAY' : null);

    if (S.dangHop) {
      S.hop = Math.min(1, S.hop + dt / 4.0);
      if (S.hop >= 1 && !S.xong) nhinThay(ctx);
      return;
    }

    if (S.gan === 'CUA' && S.thay.trai && S.thay.phai && P.action() > 0) {
      S.moCua = Math.min(1, S.moCua + dt * 0.7);
      if (S.moCua >= 1) {
        S.dangHop = true;
        ctx.audio.diemNut();
        ctx.hud.loeSang();
      }
    }
  }

  function nhinThay(ctx) {
    S.xong = true;
    ctx.hud.buocNhay(ctx.text.nhan.buocNhay, 'MỘT SỰ VẬT, HAI CÁCH NHÌN');
    ctx.audio.buocNhay();
    setTimeout(function () { if (S) theBaiHoc(ctx); }, 1500);
  }

  /* ═══════════ hình ảnh ═══════════ */

  function hinhAnh(dt, ctx) {
    var A = TX.anim;
    S.benHien = Math.max(S.ben, A.muot(S.hop));
    var bh = S.benHien;

    S.t += dt;                       // bên biện chứng: luôn chạy
    S.tgSong += dt * bh;             // quả cầu và cái cây: chỉ chạy khi nhìn biện chứng

    /* ═══ ranh giới tan dần khi hợp nhất ═══ */
    var conRanh = 1 - A.muot(S.hop);
    o.matVach.opacity = 0.85 * conRanh;
    o.matMang.uniforms.uDoMo.value = conRanh;
    o.matPhuTrai.color.setRGB(0.875 + 0.09 * S.hop, 0.894 + 0.01 * S.hop, 0.925 - 0.1 * S.hop);

    /* ═══ bên siêu hình: đứng yên tuyệt đối — cho đến khi hợp nhất ═══ */
    for (var i = 0; i < o.hienVat.length; i++) {
      var hv = o.hienVat[i], m = hv.mesh, h = A.muot(S.hop);
      m.position.y = hv.y + Math.sin(S.t * 1.4 + i) * 0.05 * h;
      if (i === 0) m.material.emissiveIntensity = 0.9 * h;
      else m.material.emissiveIntensity = 0.35 * h;
      if (i === 3) m.rotation.x += dt * 1.2 * h;
      else m.rotation.y += dt * 0.5 * h;
      o.denBe[i].color.setRGB(0.89 + 0.11 * h, 0.92 - 0.06 * h, 1.0 - 0.3 * h);
    }

    /* ═══ bên biện chứng ═══ */
    var t = S.t;
    o.troi.position.set(P_TROI[0] + Math.sin(t * 0.3) * 0.15, P_TROI[1] + Math.sin(t * 0.7) * 0.08, P_TROI[2]);
    o.denTroi.intensity = 1.2 + Math.sin(t * 2.1) * 0.12 + A.gio(t) * 0.08;
    o.quangTroi.material.rotation = t * 0.1;
    o.matNang.opacity = 0.10 + Math.sin(t * 1.3) * 0.025;

    var mamLon = 0.85 + 0.15 * Math.sin(t * 0.4);
    o.mam.scale.setScalar(mamLon);
    o.mam.rotation.z = A.gio(t * 1.2) * 0.08;
    o.laMam.forEach(function (la, k) { la.rotation.y = Math.sin(t * 1.6 + k * 2) * 0.25; });

    o.may.position.x = P_MAY[0] + Math.sin(t * 0.25) * 0.2;
    o.may.rotation.y = t * 0.05;
    capNhatMua(dt);
    o.gon.forEach(function (gon) {
      var p = (t * 0.6 + gon.userData.pha) % 1;
      gon.scale.setScalar(0.4 + p * 1.6);
      gon.material.opacity = 0.6 * (1 - p);
    });

    for (var r = 0; r < o.rang.length; r++) {
      var R = o.rang[r];
      R.mesh.rotation.z = R.lech + R.chieu * t * 0.9 * (16 / R.n);
    }

    o.lienHePhai.forEach(function (d) { capNhatDuong(d, t, 1); });
    o.nhipTran.forEach(function (d, q) { capNhatDuong(d, t + q * 0.3, 1); });

    /* đường nối hai nửa — mọc dần khi hợp nhất */
    o.duongHop.forEach(function (d, k) {
      var moc = A.muot(A.doan(S.hop, k * 0.12, 0.55 + k * 0.12));
      capNhatDuong(d, t, Math.min(1, moc * 1.4), moc);
    });

    capNhatCau(dt, ctx, bh);
    capNhatCay(dt, ctx, bh);
    capNhatCua(dt);

    /* ánh sáng chung nghiêng theo cách nhìn */
    o.den.roi.color.setRGB(0.86 + bh * 0.14, 0.9 + bh * 0.02, 1.0 - bh * 0.25);
  }

  function capNhatMua(dt) {
    var M = o.mua;
    for (var i = 0; i < M.count; i++) {
      M.life[i] -= dt * 0.8;
      if (M.life[i] <= 0) {
        M.life[i] = 1;
        M.pos[i * 3] = o.may.position.x + (Math.random() - 0.5) * 0.8;
        M.pos[i * 3 + 1] = P_MAY[1] - 0.25 - Math.random() * 0.3;
        M.pos[i * 3 + 2] = P_MAY[2] + (Math.random() - 0.5) * 0.6;
        M.vel[i * 3 + 1] = -2.5 - Math.random();
      }
      M.pos[i * 3 + 1] += M.vel[i * 3 + 1] * dt;
      if (M.pos[i * 3 + 1] < 0.05) M.an(i);
    }
    M.capNhat();
  }

  /* quả cầu: ● → ◐ → ○ → ✦ → ● khi nhìn biện chứng; đứng yên khi nhìn siêu hình */
  var _v = new THREE.Vector3();
  function capNhatCau(dt, ctx, bh) {
    var A = TX.anim;
    S.phaCau = (S.phaCau + dt * bh / CHU_KY_CAU) % 1;
    var p = S.phaCau, anh, bung = 0;
    if (p < 0.55) anh = p / 0.55 * Math.PI;
    else if (p < 0.75) { anh = Math.PI; bung = Math.sin((p - 0.55) / 0.2 * Math.PI); }
    else anh = Math.PI + (p - 0.75) / 0.25 * Math.PI;

    o.cauU.uBen.value = bh;
    o.cauU.uAnh.value = anh;
    o.cauU.uBung.value = bung * 0.55 * bh;
    o.cauU.uDenTrai.value.copy(o.huongDenTrai).transformDirection(ctx.camera.matrixWorldInverse);

    o.sao.scale.setScalar(Math.max(0.001, A.vot(bung, 1.4) * bh));
    o.sao.lookAt(ctx.camera.position);
    o.saoTrong.rotation.z = S.tgSong * 0.4;

    o.matChumTrai.opacity = 0.1 * (1 - bh);
    o.denCau.intensity = 1.1 * (1 - bh);

    o.vanh.forEach(function (v, k) {
      v.material.opacity = 0.75 * bh;
      v.rotation.y += dt * v.userData.toc * bh;
      v.rotation.x += dt * v.userData.toc * 0.4 * bh;
      v.visible = bh > 0.01;
    });

    /* hạt bay theo quỹ đạo quanh quả cầu */
    var H = o.hatCau;
    H.pts.material.opacity = 0.9 * bh;
    H.pts.visible = bh > 0.01;
    for (var i = 0; i < H.count; i++) {
      var a = S.tgSong * (0.6 + (i % 5) * 0.15) + i * 2.4;
      var rr = 0.6 + (i % 4) * 0.1, nghieng = (i % 3 - 1) * 0.7;
      H.pos[i * 3]     = Math.cos(a) * rr;
      H.pos[i * 3 + 1] = CAU.y + Math.sin(a) * rr * Math.sin(nghieng);
      H.pos[i * 3 + 2] = CAU.z + Math.sin(a) * rr * Math.cos(nghieng);
    }
    H.capNhat();
  }

  /* cái cây: tượng đá khi nhìn siêu hình; một vòng đời khi nhìn biện chứng */
  function capNhatCay(dt, ctx, bh) {
    var A = TX.anim;
    S.chuCay = (S.chuCay + dt * bh / CHU_KY_CAY) % 1;
    var c = S.chuCay;

    /* 🌱 → 🌿 → 🌳 (0..0.42) · giữ · 🍂 (0.58..0.72) · lá rụng (0.70..0.86) · về đất (0.86..1) */
    var lon = A.muot(A.doan(c, 0, 0.42)) * (1 - A.muot(A.doan(c, 0.86, 1)));
    var thu = A.doan(c, 0.58, 0.72);
    var conLa = 1 - A.muot(A.doan(c, 0.70, 0.86));

    /* nhìn siêu hình: cây đứng nguyên một trạng thái đầy đủ */
    var gThan = 1 + (lon - 1) * bh;
    var gLa = 1 + (A.muot(A.doan(c, 0.04, 0.42)) * conLa * (1 - A.muot(A.doan(c, 0.86, 1))) - 1) * bh;
    var gCanh = 1 + (A.muot(A.doan(c, 0.12, 0.42)) - 1) * bh;

    var beNgang = 0.35 + 0.65 * gThan;
    o.than.scale.set(beNgang, Math.max(0.03, gThan), beNgang);
    o.tan.scale.setScalar(Math.max(0.001, gLa));
    o.tan.position.set(0, 1.05 * Math.max(0.03, gThan), 0);
    o.canh.forEach(function (k) { k.scale.setScalar(Math.max(0.001, gCanh)); });

    /* màu: cẩm thạch ↔ sống; lá xanh → vàng cam vào thu */
    o.matVo.color.copy(MAU_TUONG).lerp(MAU_VO, bh);
    _mauLa.copy(MAU_LA).lerp(MAU_THU, thu);
    o.matLa.color.copy(MAU_TUONG).lerp(_mauLa, bh);
    o.matVo.roughness = o.matLa.roughness = 0.45 + 0.4 * bh;

    /* gió — chỉ có khi nhìn biện chứng */
    var gio = A.gio(S.tgSong) * bh;
    o.than.rotation.z = gio * 0.03;
    o.than.rotation.x = A.gio(S.tgSong * 0.8 + 2) * bh * 0.02;
    o.tan.rotation.z = gio * 0.06;
    o.tan.position.x = gio * 0.03;
    for (var n = 0; n < o.la.length; n++) {
      var LA = o.la[n], g0 = LA.userData.goc;
      var r1 = A.gio(S.tgSong * 1.15 + LA.userData.pha) * bh;
      LA.position.set(g0.x + r1 * 0.035, g0.y + r1 * 0.02, g0.z + r1 * 0.03);
    }

    /* rễ: chỉ thấy khi nhìn biện chứng */
    o.re.forEach(function (d) { capNhatDuong(d, S.tgSong, bh); });

    /* lá rụng */
    var L = o.laRoi, dangRung = bh > 0.3 && c > 0.66 && c < 0.88;
    L.pts.material.opacity = 0.9 * bh;
    for (var i = 0; i < L.count; i++) {
      if (L.life[i] <= 0) {
        if (!dangRung || Math.random() > dt * 3) continue;
        L.life[i] = 1;
        var a = Math.random() * Math.PI * 2, rr = Math.random() * 0.5;
        L.pos[i * 3] = Math.cos(a) * rr;
        L.pos[i * 3 + 1] = 2.2 + Math.random() * 0.4;
        L.pos[i * 3 + 2] = CAY_Z + Math.sin(a) * rr;
        L.vel[i * 3] = (Math.random() - 0.5) * 0.4;
        L.vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        L.vel[i * 3 + 1] = Math.random() * 3;     // pha lắc lư riêng
      }
      L.pos[i * 3] += (L.vel[i * 3] + Math.sin(S.t * 2 + L.vel[i * 3 + 1]) * 0.3) * dt;
      L.pos[i * 3 + 2] += L.vel[i * 3 + 2] * dt;
      L.pos[i * 3 + 1] -= 0.45 * dt;
      if (L.pos[i * 3 + 1] < 0.4) L.an(i);
    }
    L.capNhat();
  }
  var _mauLa = new THREE.Color();

  function capNhatCua(dt) {
    var A = TX.anim, m = A.muot(S.moCua);
    o.canhCua.forEach(function (c) { c.truc.rotation.y = c.s * m * 1.35; });
    o.matSangCua.opacity = m;
    o.denCua.intensity = m * 2.2;
  }

  /* ═══════════ chú giải theo ánh nhìn ═══════════ */

  function nhinVao(dt, ctx) {
    var P = ctx.player, id = null;
    if (!S.xong && !ctx.hud.theDangMo() && !ctx.hud.soTayDangMo()) {
      if (P.lockBroken) o.diemNhin.set(P.chuot.x / innerWidth * 2 - 1, -(P.chuot.y / innerHeight) * 2 + 1);
      else o.diemNhin.set(0, 0);
      o.tia.setFromCamera(o.diemNhin, ctx.camera);
      o.tia.far = 9;
      var trung = o.tia.intersectObjects(o.nhin, false);
      if (trung.length) {
        var n = trung[0].object.userData.nhin;
        id = typeof n === 'function' ? n() : n;
      }
    }
    if (id !== S.nhamId) { S.nhamId = id; S.nhamT = 0; }
    else S.nhamT += dt;
    ctx.hud.nhinChuGiai(id && S.nhamT >= NHIN_TRE ? ctx.text.chuGiai[id] : null);
  }

  /* ═══════════ thẻ bài học ═══════════ */

  function theBaiHoc(ctx) {
    var B = ctx.text.baiHoc;

    ctx.soTay.ghi({
      ten: ctx.text.soTay.ten,
      tom: ctx.text.soTay.tom,
      trichDan: B.trichDan,
      nguon: B.nguon
    });
    ctx.hoanThanh();
    ctx.hud.anChuGiai();

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
      '<p>' + B.lienHe.than + '</p>',
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var T = ctx.text, G = T.goiY, P = ctx.player;

    if (!S.xong) logic(dt, ctx);
    hinhAnh(dt, ctx);
    nhinVao(dt, ctx);

    /* bảng chỉ số */
    var benChu = S.ben < 0.3 ? 'TRAI' : (S.ben > 0.7 ? 'PHAI' : 'GIUA');
    el.m.textContent = T.ben[benChu];
    el.m.style.color = benChu === 'TRAI' ? '#3d5f9f' : (benChu === 'PHAI' ? '#b86e14' : '#8a7a5a');
    el.cur.style.left = (S.ben * 100) + '%';
    el.n.textContent = (S.thay.trai ? 1 : 0) + (S.thay.phai ? 1 : 0);
    el.thay.innerHTML =
      (S.thay.trai ? '✓ ' : '○ ') + T.nhan.thanhTrai + ' &nbsp; ' +
      (S.thay.phai ? '✓ ' : '○ ') + T.nhan.thanhPhai;
    ctx.hud.hienPanel(!S.xong);
    ctx.hud.ngam(S.gan === 'CUA');

    /* gợi ý */
    var goiY;
    if (S.dangHop) goiY = G.hopNhat;
    else if (S.gan === 'CUA') {
      if (!S.thay.trai || !S.thay.phai) goiY = G.cuaThieu.replace('%s', !S.thay.trai ? T.nhan.thanhTrai : T.nhan.thanhPhai);
      else goiY = P.lockBroken ? G.cuaMoDP : G.cuaMo;
    }
    else if (S.gan === 'CAY' && benChu !== 'GIUA') goiY = benChu === 'TRAI' ? G.cayTrai : G.cayPhai;
    else goiY = benChu === 'TRAI' ? G.trai : (benChu === 'PHAI' ? G.phai : G.giua);
    ctx.hud.goiY(goiY);
    ctx.hud.hienGoiY(!S.xong);
  }

  function dispose() { S = o = el = null; }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'bien-chung',
    tieuDe: 'Biện chứng · Siêu hình',
    nhanNgan: 'Tầng I · Chương 1',
    moTa: 'Một phòng, hai thế giới, cùng một sự vật.',
    goiY: {
      khoa:    'Đi qua lại ranh giới giữa phòng · giữ <kbd>Chuột trái</kbd> ở cánh cửa',
      duPhong: 'Đi qua lại ranh giới giữa phòng · giữ <kbd>F</kbd> ở cánh cửa'
    },
    build: build,
    update: update,
    dispose: dispose
  });

})(window.TX);
