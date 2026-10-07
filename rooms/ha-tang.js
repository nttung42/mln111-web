/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — THÀNH PHỐ TRÊN NỀN MÓNG
   Cơ sở hạ tầng và Kiến trúc thượng tầng
   (Giáo trình, Chương 3, mục 3.1.3)

   Giữa phòng là sa bàn một thành phố, cắt ngang làm hai tầng:
     · dưới mặt đất  nhà máy, nhà máy điện, đường ray, đường ống, công nhân
     · trên mặt đất  tòa thị chính, tòa án, trường học, nhà hát, tháp truyền hình
   Giữa hai tầng là trục của cải: hạt vàng đi lên (hạ tầng nuôi thượng tầng),
   hạt tím đi xuống (chính sách tác động trở lại).

   Bốn nút, mỗi lượt bấm một nút rồi thành phố phản ứng theo hai nhịp:
     nhịp 1 (ngay)    tác động trực tiếp lên tầng được xây
     nhịp 2 (sau ~1s) tầng kia phản ứng — người chơi THẤY nhân quả

   Bốn nhiệm vụ, S.nv chạy: 1 → 'phim1' → 2 → 'phim2' → 3 → 'phim3' → 4 → 'ket'
     NV1 · Mở mặt đất     kéo cần ở mép sa bàn → cảnh 1 dẫn đi xem tầng dưới
     NV2 · Xây nền móng   xây hạ tầng 3 lần → cảnh 2: tầng trên tự lớn lên
                          → thẻ 1: cơ sở hạ tầng quyết định
     NV3 · Chính sách     ban hành Luật môi trường → cảnh 3: tác động ngược
                          xuống tận nhà máy
     NV4 · Phát triển     đạt DIEM_DICH điểm → cảnh kết: tia sáng nối hai tầng
                          → thẻ cuối: tác động trở lại, độc lập tương đối

   Mô hình (đã chạy thử): chỉ xây hạ tầng thì dừng quanh 70 điểm vì thượng
   tầng chỉ tự theo được ~72% kinh tế; chỉ xây thượng tầng thì dừng quanh
   45 vì phần vượt quá kinh tế + 15 bị teo lại. Cân đối thì tới 80 sau
   khoảng 17–19 lượt.

   Lưu ý học thuật: "cơ sở hạ tầng" là quan hệ sản xuất, không phải đường sá
   điện nước. Thẻ 1 và chú giải nói rõ điều này.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var K = TX.KICH_THUOC;

  /* ---------- bố cục (m) ---------- */
  var X0 = -3.6, X1 = 3.6, Z0 = -3.5, Z1 = 0.3;   // sa bàn
  var YD = 1.0;                                   // mặt đất của sa bàn
  var YT = YD - 0.14;                             // trần tầng dưới
  var Z_TRUC = -1.75;                             // trục của cải, trước tòa thị chính
  var Z_RAY = -0.05;                              // đường ray ngầm
  var Z_BAN = 2.5;                                // bàn điều khiển
  var NGHIENG = 0.35;
  var Z_DL = -1.25;                               // đại lộ
  var Z_SAU = -2.52, Z_TRUOC = -0.37;             // hai dãy lô đất

  var NUT = [
    { id: 'sx', x: -1.5, mau: 0xd9822b },
    { id: 'gt', x: -0.5, mau: 0x3c8fc4 },
    { id: 'nl', x:  0.5, mau: 0xe2b33c },
    { id: 'cs', x:  1.5, mau: 0x8a5cc4 }
  ];
  var CS = ['mt', 'gd', 'vh'];

  /* ---------- nhịp chơi ---------- */
  var DIEM_DICH = 80;
  var SO_XAY = 3;           // nhiệm vụ 2
  var TAM_NUT = 3.4;
  var NHIN_TRE = 0.35;

  var MAU_HT = '#c27a2c', MAU_TT = '#7a55b8';

  var S, o, el, F;

  /* ═══════════ mô hình ═══════════ */

  function kep(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function tang(v, d) { return kep(v + d * (1 - v / 115), 0, 100); }

  function kinhTe(m) {
    var tac = Math.max(0, m.sx - m.gt - 25), dien = Math.max(0, m.sx - m.nl - 25);
    var hs = kep(1 - (tac + dien) / 60, 0.55, 1);
    return kep((0.5 * m.sx + 0.25 * m.gt + 0.25 * m.nl) * hs, 0, 100);
  }
  function thuongTang(m) { return (m.tc + m.gd + m.vh) / 3; }
  function diem(m) {
    var k = kinhTe(m), t = thuongTang(m), lech = Math.max(0, Math.abs(k - t) - 10);
    return kep(0.5 * k + 0.5 * t - 0.8 * lech - 0.6 * Math.max(0, m.on - 40), 0, 100);
  }
  function oDich(m) {
    return kep(m.sx * (m.luat ? 0.35 : 0.8) - (m.luat ? m.nl * 0.2 : 0) - m.gt * 0.1, 0, 100);
  }

  /* nhịp 1: tác động trực tiếp */
  function tacDong(m, loai) {
    if (loai === 'sx') m.sx = tang(m.sx, 32);
    if (loai === 'gt') m.gt = tang(m.gt, 32);
    if (loai === 'nl') m.nl = tang(m.nl, 32);
    if (loai === 'mt') {
      m.tc = tang(m.tc, 30);
      m.on = kep(m.on - 15, 0, 100);
      m.sx = kep(m.sx - (m.luat ? 4 : 10), 0, 100);
      m.luat = true;
    }
    if (loai === 'gd') m.gd = tang(m.gd, 30);
    if (loai === 'vh') m.vh = tang(m.vh, 30);
  }

  /* nhịp 2: tầng trên theo nền (lớn lên hoặc teo lại), tầng dưới nhận phản hồi */
  function phanUng(m) {
    var k = kinhTe(m);
    ['tc', 'gd', 'vh'].forEach(function (u) {
      var d = 0.72 * k;
      if (m[u] < d) m[u] += (d - m[u]) * 0.35;
      else if (m[u] > k + 15) m[u] -= (m[u] - k - 15) * 0.5;
    });
    m.sx = kep(m.sx + (m.gd - 50) * 0.06, 0, 100);
    m.on = m.on + (oDich(m) - m.on) * 0.4;
  }

  function vanDe(m) {
    var k = kinhTe(m), t = thuongTang(m), r = [];
    if (m.sx - m.gt > 25) r.push('UN_TAC');
    if (m.sx - m.nl > 25) r.push('THIEU_DIEN');
    if (m.on > 40) r.push('O_NHIEM');
    if (k - t > 18) r.push('TUT_HAU');
    if (t - k > 12) r.push('QUA_TAI');
    return r;
  }

  function chup(m) {
    return { sx: m.sx, gt: m.gt, nl: m.nl, tc: m.tc, gd: m.gd, vh: m.vh, on: m.on,
             kt: kinhTe(m), tt: thuongTang(m), d: diem(m) };
  }

  /* ═══════════ tiện ích dựng hình ═══════════ */

  function mat(mau, them) {
    var p = { color: mau, roughness: 0.75, metalness: 0.05, flatShading: true };
    if (them) for (var k in them) p[k] = them[k];
    return new THREE.MeshStandardMaterial(p);
  }
  function hop(w, h, d, m) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); }
  function tru(r1, r2, h, n, m) { return new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, n || 10), m); }
  function dat(g, mesh, x, y, z, bong) {
    mesh.position.set(x, y, z);
    if (bong !== false) { mesh.castShadow = true; mesh.receiveShadow = true; }
    g.add(mesh);
    return mesh;
  }

  var SANS = '"Be Vietnam Pro", "Segoe UI", sans-serif';
  function fSans(co, dam) { return (dam || 600) + ' ' + co + 'px ' + SANS; }

  /* Tấm chữ canvas, vẽ lại được. dong: [[chữ, font, màu, y, giãn], ...] */
  function bangDong(cw, ch, rong) {
    var c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    var g = c.getContext('2d');
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    var mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(rong, rong * ch / cw),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    function ve(dong, nen) {
      g.clearRect(0, 0, cw, ch);
      if (nen) nen(g, cw, ch);
      g.textAlign = 'center';
      dong.forEach(function (d) {
        g.font = d[1];
        g.fillStyle = d[2];
        try { g.letterSpacing = d[4] || '0px'; } catch (e) {}
        var co = parseInt(/(\d+)px/.exec(d[1])[1], 10);
        while (co > 12 && g.measureText(d[0]).width > cw - 40) {
          co -= 2;
          g.font = d[1].replace(/\d+px/, co + 'px');
        }
        g.fillText(d[0], cw / 2, d[3]);
      });
      tex.needsUpdate = true;
    }
    return { mesh: mesh, ve: ve };
  }
  function bang(cw, ch, rong, dong, nen) {
    var b = bangDong(cw, ch, rong);
    b.ve(dong, nen);
    return b.mesh;
  }
  function nenBien(mau, vien, bo) {
    return function (g, w, h) {
      g.fillStyle = mau;
      if (bo) {
        var r = h / 2;
        g.beginPath();
        g.moveTo(r, 0); g.lineTo(w - r, 0); g.arc(w - r, r, r, -Math.PI / 2, Math.PI / 2);
        g.lineTo(r, h); g.arc(r, r, r, Math.PI / 2, Math.PI * 1.5);
        g.fill();
      } else g.fillRect(0, 0, w, h);
      if (vien) {
        g.strokeStyle = vien;
        g.lineWidth = 6;
        g.strokeRect(3, 3, w - 6, h - 6);
      }
    };
  }

  /* hộp ẩn để bắt ánh nhìn */
  function vungNhin(g, w, h, d, x, y, z, du) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial());
    m.visible = false;
    m.position.set(x, y, z);
    for (var k in du) m.userData[k] = du[k];
    g.add(m);
    o.nhin.push(m);
    return m;
  }

  /* nhãn nổi luôn quay về camera */
  function nhanNoi(g, chu, mau) {
    var m = bang(512, 96, 0.82, [[chu, fSans(40, 800), '#ffffff', 63, '3px']], nenBien(mau, null, true));
    m.material.opacity = 0.9;
    g.add(m);
    o.bien.push(m);
    return m;
  }

  /* điểm trên đường gấp khúc theo tỉ lệ độ dài */
  function diemTrenDuong(d, u, out) {
    var L = d.dai * kep(u, 0, 1);
    for (var i = 1; i < d.p.length; i++) {
      if (L <= d.cum[i] || i === d.p.length - 1) {
        var a = d.p[i - 1], b = d.p[i], k = (L - d.cum[i - 1]) / Math.max(1e-6, d.cum[i] - d.cum[i - 1]);
        return out.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
      }
    }
    return out;
  }
  function duong(p) {
    var cum = [0];
    for (var i = 1; i < p.length; i++) {
      cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1], p[i][2] - p[i - 1][2]));
    }
    return { p: p, cum: cum, dai: cum[cum.length - 1] };
  }

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    S = {
      m: { sx: 28, gt: 22, nl: 24, tc: 26, gd: 22, vh: 22, on: 15, luat: false },
      nv: 1, daXay: 0,
      mo: 0, daKeo: false, keoT: 0,
      luot: null, soLuot: 0, soVanDe: 0, vd: [], chuoi: '',
      truoc: null, deltaT: 0,
      cs: 'mt',
      chon: null, nhamId: null, nhamT: 0, tdTruoc: 0,
      ket: false, sangTia: 0, giamT: 0,
      batDau: false, daThe: false
    };
    S.hien = chup(S.m);
    S.truoc = chup(S.m);
    o = {
      nhin: [], bien: [], tia: new THREE.Raycaster(), diemNhin: new THREE.Vector2(),
      nut: {}, may: [], thap: [], toa: [], toaTT: {}, xe: [], toa_: [], cn: [], matNha: [],
      day: [], ongKhoi: [], v: new THREE.Vector3(), v2: new THREE.Vector3()
    };

    var g = ctx.scene;
    ctx.moiTruong.suong.color.setHex(0xdfe6ee);
    ctx.moiTruong.suong.density = 0.018;
    ctx.moiTruong.nen.setHex(0xdfe6ee);

    dungVo(g);
    dungAnhSang(g);
    dungSaBan(g, ctx);
    dungTangDuoi(g, ctx);
    dungThanhPho(g, ctx);
    dungBanDieuKhien(g, ctx);
    dungHieuUng(g, ctx);
    dungPanel(ctx);
    capNhatToaNha(0, true);

    o.chanHop = [
      [X0 - 0.15, X1 + 0.15, Z0 - 0.15, Z1 + 0.22],
      [-2.2, 2.2, Z_BAN - 0.42, Z_BAN + 0.42]
    ];
    ctx.player.constrain = chanNguoiChoi;
    ctx.player.spawn(0, 5.4);
  }

  function chanNguoiChoi(pos) {
    var R = 0.32;
    for (var i = 0; i < o.chanHop.length; i++) {
      var h = o.chanHop[i];
      var x0 = h[0] - R, x1 = h[1] + R, z0 = h[2] - R, z1 = h[3] + R;
      if (pos.x > x0 && pos.x < x1 && pos.z > z0 && pos.z < z1) {
        var dx0 = pos.x - x0, dx1 = x1 - pos.x, dz0 = pos.z - z0, dz1 = z1 - pos.z;
        var m = Math.min(dx0, dx1, dz0, dz1);
        if (m === dx0) pos.x = x0; else if (m === dx1) pos.x = x1;
        else if (m === dz0) pos.z = z0; else pos.z = z1;
      }
    }
  }

  /* ---------- 1. vỏ phòng: quảng trường giữa thành phố ---------- */

  function texTuong() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 356;
    var g = c.getContext('2d');
    var troi = g.createLinearGradient(0, 0, 0, 356);
    troi.addColorStop(0, '#c9d8ea');
    troi.addColorStop(0.7, '#eef0ee');
    troi.addColorStop(1, '#f4e6d4');
    g.fillStyle = troi;
    g.fillRect(0, 0, 1024, 356);
    var chan = Math.round(356 * 0.5 / K.h);
    /* hai lớp đường chân trời, lớp sau nhạt hơn */
    [['rgba(150,165,185,.55)', 80, 210, 0.15], ['rgba(105,120,142,.8)', 40, 150, 0.5]].forEach(function (l) {
      for (var x = -20; x < 1044;) {
        var w = 30 + Math.random() * 60, h = l[1] + Math.random() * l[2];
        g.fillStyle = l[0];
        g.fillRect(x, 356 - chan - h, w, h);
        g.fillStyle = 'rgba(255,236,190,' + l[3] + ')';
        for (var wy = 356 - chan - h + 8; wy < 356 - chan - 8; wy += 12) {
          for (var wx = x + 5; wx < x + w - 6; wx += 10) if (Math.random() < 0.35) g.fillRect(wx, wy, 4, 5);
        }
        x += w + 2 + Math.random() * 10;
      }
    });
    g.fillStyle = '#b9b2a6';
    g.fillRect(0, 356 - chan, 1024, chan);
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function texSanPhong() {
    var c = document.createElement('canvas');
    c.width = c.height = 1024;
    var g = c.getContext('2d');
    g.fillStyle = '#e4ded3';
    g.fillRect(0, 0, 1024, 1024);
    var px = 1024 / K.w;
    for (var i = 0; i < 300; i++) {
      var x = Math.random() * 1024, y = Math.random() * 1024, r = 15 + Math.random() * 60;
      var v = g.createRadialGradient(x, y, 0, x, y, r);
      v.addColorStop(0, 'rgba(255,255,255,.08)');
      v.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = v;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    g.strokeStyle = 'rgba(150,140,125,.35)';
    g.lineWidth = 2;
    for (var k = 0; k <= 15; k++) {
      g.beginPath(); g.moveTo(k * px, 0); g.lineTo(k * px, 1024); g.stroke();
      g.beginPath(); g.moveTo(0, k * px); g.lineTo(1024, k * px); g.stroke();
    }
    /* lối vào: dải đá sẫm từ chỗ đứng tới bàn điều khiển */
    g.fillStyle = 'rgba(120,108,92,.18)';
    g.fillRect((K.w / 2 - 1.2) * px, (K.d / 2 + Z_BAN + 0.4) * px, 2.4 * px, 4 * px);
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 8;
    return tex;
  }

  function dungVo(g) {
    var san = new THREE.Mesh(new THREE.PlaneGeometry(K.w, K.d),
      new THREE.MeshStandardMaterial({ map: texSanPhong(), roughness: 0.85 }));
    san.rotation.x = -Math.PI / 2;
    san.receiveShadow = true;
    g.add(san);

    var matTuong = new THREE.MeshBasicMaterial({ map: texTuong(), side: THREE.DoubleSide });
    [[0, -K.d / 2, 0], [0, K.d / 2, Math.PI], [-K.w / 2, 0, Math.PI / 2], [K.w / 2, 0, -Math.PI / 2]].forEach(function (d) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(K.w, K.h), matTuong);
      m.position.set(d[0], K.h / 2, d[1]);
      m.rotation.y = d[2];
      g.add(m);
    });
    var tran = new THREE.Mesh(new THREE.PlaneGeometry(K.w, K.d), new THREE.MeshBasicMaterial({ color: 0xc4d4e8 }));
    tran.rotation.x = Math.PI / 2;
    tran.position.y = K.h;
    g.add(tran);

    var ten = bang(1024, 300, 4.0, [
      ['THÀNH PHỐ', fSans(112, 800), '#3a4a60', 140, '16px'],
      ['Phòng III · Trên nền móng', fSans(46, 500), '#55657a', 228]
    ]);
    ten.position.set(0, 4.25, -K.d / 2 + 0.04);
    g.add(ten);

    /* vài cây và ghế quanh quảng trường */
    var matLa = mat(0x7fa36a), matGoc = mat(0x7a5a3c);
    [[-6, -6], [6, -6], [-6, 4.5], [6, 4.5], [-6.2, -1], [6.2, -1]].forEach(function (p) {
      dat(g, tru(0.06, 0.08, 0.9, 6, matGoc), p[0], 0.45, p[1]);
      dat(g, new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 0), matLa), p[0], 1.35, p[1]);
    });
  }

  /* ---------- 2. ánh sáng ---------- */

  function dungAnhSang(g) {
    g.add(new THREE.HemisphereLight(0xf4f7ff, 0x8a8070, 0.72));
    g.add(new THREE.AmbientLight(0xffffff, 0.1));
    var nang = new THREE.DirectionalLight(0xfff1dc, 0.85);
    nang.position.set(5, 9, 6);
    nang.target.position.set(0, 0, -1.6);
    nang.castShadow = true;
    nang.shadow.mapSize.set(2048, 2048);
    var sc = nang.shadow.camera;
    sc.left = -6; sc.right = 6; sc.top = 6; sc.bottom = -6; sc.near = 1; sc.far = 25;
    nang.shadow.bias = -0.0008;
    g.add(nang, nang.target);

    /* ánh ấm trong tầng dưới */
    o.denDuoi = [-2.4, 0, 2.4].map(function (x) {
      var d = new THREE.PointLight(0xffa860, 1.5, 3.4, 2);
      d.position.set(x, 0.66, -1.6);
      g.add(d);
      return d;
    });
  }

  /* ---------- 3. vỏ sa bàn: tầng dưới, mặt cắt, nắp che ---------- */

  function texDat() {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 64;
    var g = c.getContext('2d');
    var lop = [['#6f6a62', 0, 8], ['#8a6a48', 8, 18], ['#76563a', 26, 16], ['#5e4632', 42, 22]];
    lop.forEach(function (l) { g.fillStyle = l[0]; g.fillRect(0, l[1], 512, l[2]); });
    for (var i = 0; i < 140; i++) {
      g.fillStyle = 'rgba(40,28,18,' + (0.15 + Math.random() * 0.25) + ')';
      g.beginPath(); g.arc(Math.random() * 512, 10 + Math.random() * 54, 1 + Math.random() * 2.5, 0, 7); g.fill();
    }
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = 4;
    return t;
  }

  function texNap(T) {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 128;
    var g = c.getContext('2d');
    g.fillStyle = '#8f7a62';
    g.fillRect(0, 0, 1024, 128);
    for (var i = 0; i < 400; i++) {
      g.fillStyle = 'rgba(60,44,30,' + Math.random() * 0.25 + ')';
      g.fillRect(Math.random() * 1024, Math.random() * 128, 2 + Math.random() * 6, 2 + Math.random() * 4);
    }
    g.strokeStyle = 'rgba(255,240,215,.35)';
    g.lineWidth = 3;
    g.strokeRect(10, 10, 1004, 108);
    g.fillStyle = 'rgba(255,244,225,.75)';
    g.font = fSans(30, 800);
    g.textAlign = 'center';
    try { g.letterSpacing = '10px'; } catch (e) {}
    g.fillText('MẶT ĐẤT', 300, 78);
    g.fillText('MẶT ĐẤT', 724, 78);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  function dungSaBan(g, ctx) {
    var W = X1 - X0, D = Z1 - Z0, xm = (X0 + X1) / 2, zm = (Z0 + Z1) / 2;
    var matToi = mat(0x24272c, { roughness: 0.95 });
    dat(g, hop(W, 0.04, D, matToi), xm, 0.02, zm);

    /* tường sau và hai bên: đá, đất */
    var matDat = new THREE.MeshStandardMaterial({ map: texDat(), roughness: 0.95 });
    var matDaToi = mat(0x30343a, { roughness: 0.95 });
    dat(g, hop(W, YT, 0.08, matDaToi), xm, YT / 2, Z0 + 0.04);
    [X0 + 0.04, X1 - 0.04].forEach(function (x) {
      var m = dat(g, hop(0.08, YT, D, [matDat, matDat, matDaToi, matDaToi, matDat, matDat]), x, YT / 2, zm);
      void m;
    });

    /* tấm mặt đất: mặt trên là bản đồ thành phố, các mép là mặt cắt đất */
    var matTren = new THREE.MeshStandardMaterial({ map: texThanhPho(), roughness: 0.85 });
    var matDuoi = mat(0x2c3036);
    var tam = dat(g, hop(W + 0.1, 0.14, D + 0.1, [matDat, matDat, matTren, matDuoi, matDat, matDat]), xm, YD - 0.07, zm);
    tam.receiveShadow = true;
    vungNhin(g, W + 0.1, 0.16, 0.08, xm, YD - 0.07, Z1 + 0.05, { nhin: 'matCat' });

    /* kính mặt cắt phía trước */
    var kinh = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.1, YT),
      new THREE.MeshStandardMaterial({ color: 0xd8ecf7, transparent: true, opacity: 0.1, roughness: 0.05, depthWrite: false }));
    kinh.position.set(xm, YT / 2, Z1 + 0.01);
    g.add(kinh);
    var matKhung = mat(0x2f343a, { metalness: 0.5, roughness: 0.4 });
    dat(g, hop(W + 0.1, 0.05, 0.08, matKhung), xm, 0.025, Z1 + 0.02);

    /* nắp che mặt cắt + cần MỞ MẶT ĐẤT; kéo cần thì nắp lún xuống sàn */
    o.nap = new THREE.Group();
    g.add(o.nap);
    var nap = new THREE.Mesh(new THREE.BoxGeometry(W + 0.1, YT, 0.06),
      [matDat, matDat, matDat, matDat, new THREE.MeshStandardMaterial({ map: texNap(), roughness: 0.9 }), matDat]);
    nap.position.set(xm, YT / 2, Z1 + 0.07);
    nap.castShadow = true;
    o.nap.add(nap);
    o.napHop = vungNhin(g, W, YT, 0.1, xm, YT / 2, Z1 + 0.08, { chan: true });

    var matDe = mat(0x3a3f46, { metalness: 0.4 });
    var de = hop(0.36, 0.3, 0.06, matDe);
    de.position.set(0, 0.5, Z1 + 0.12);
    o.nap.add(de);
    o.can = new THREE.Group();
    o.can.position.set(0, 0.42, Z1 + 0.16);
    o.nap.add(o.can);
    var than = tru(0.025, 0.025, 0.4, 8, mat(0xc9ced3, { metalness: 0.7, roughness: 0.3 }));
    than.position.y = 0.2;
    o.can.add(than);
    o.matNumCan = new THREE.MeshStandardMaterial({ color: 0xe0503a, emissive: 0xe0503a, emissiveIntensity: 0.3, flatShading: true });
    var num = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 1), o.matNumCan);
    num.position.y = 0.42;
    o.can.add(num);
    o.can.rotation.x = 0.5;
    var bc = bang(512, 96, 0.62, [[ctx.text.can, fSans(44, 800), '#ffffff', 64, '4px']], nenBien('#a8433a', null, true));
    bc.position.set(0, 0.2, Z1 + 0.115);
    o.nap.add(bc);
    o.canHop = vungNhin(g, 0.7, 0.9, 0.4, 0, 0.55, Z1 + 0.2, { can: true });

    /* thước hai tầng ở hai góc trước */
    [X0 - 0.25, X1 + 0.25].forEach(function (x) {
      dat(g, tru(0.03, 0.03, 2.2, 6, matKhung), x, 1.1, Z1);
      var tren = bang(512, 160, 0.55, [[ctx.text.tangTren.split(' ').slice(0, 2).join(' '), fSans(40, 800), '#ffffff', 62, '2px'],
        [ctx.text.tangTren.split(' ').slice(2).join(' ') + '  ↑', fSans(40, 800), '#ffffff', 120, '2px']], nenBien(MAU_TT));
      tren.position.set(x, YD + 0.5, Z1 + 0.04);
      g.add(tren);
      var duoi = bang(512, 160, 0.55, [[ctx.text.tangDuoi.split(' ').slice(0, 2).join(' '), fSans(40, 800), '#ffffff', 62, '2px'],
        [ctx.text.tangDuoi.split(' ').slice(2).join(' ') + '  ↓', fSans(40, 800), '#ffffff', 120, '2px']], nenBien(MAU_HT));
      duoi.position.set(x, 0.45, Z1 + 0.04);
      g.add(duoi);
    });
  }

  /* bản đồ mặt đất: vỉa hè, đại lộ, phố, bãi cỏ, quảng trường */
  function texThanhPho() {
    var W = X1 - X0 + 0.1, D = Z1 - Z0 + 0.1;
    var cw = 1024, ch = Math.round(1024 * D / W);
    var c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    var g = c.getContext('2d');
    var px = cw / W;
    function P(x, z) { return [(x - X0 + 0.05) * px, (z - Z0 + 0.05) * px]; }
    function cn(x0, x1, z0, z1, mau) { var a = P(x0, z0); g.fillStyle = mau; g.fillRect(a[0], a[1], (x1 - x0) * px, (z1 - z0) * px); }

    g.fillStyle = '#d9d4ca';
    g.fillRect(0, 0, cw, ch);
    /* bãi cỏ sau các dãy nhà */
    cn(X0, X1, Z0, Z0 + 0.35, '#a9c48a');
    cn(-0.62, 0.62, Z_TRUC - 0.28, Z_TRUC + 0.28, '#e9e2d4');
    /* đại lộ */
    cn(X0, X1, Z_DL - 0.24, Z_DL + 0.24, '#5b5f66');
    /* phố dọc xuống mép trước */
    cn(-0.2, 0.2, Z_DL, Z1, '#5b5f66');
    g.strokeStyle = '#f2efe6';
    g.lineWidth = 3;
    g.setLineDash([14, 12]);
    var a = P(X0, Z_DL), b = P(X1, Z_DL);
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    g.setLineDash([]);
    /* vạch qua đường */
    g.fillStyle = '#f2efe6';
    for (var i = 0; i < 6; i++) {
      var q = P(-0.18 + i * 0.07, Z_DL + 0.26);
      g.fillRect(q[0], q[1], 0.035 * px, 0.12 * px);
    }
    /* quảng trường trước tòa thị chính */
    var t = P(0, Z_TRUC);
    g.strokeStyle = '#c9a76a';
    g.lineWidth = 4;
    g.beginPath(); g.arc(t[0], t[1], 0.26 * px, 0, 7); g.stroke();
    /* lô đất: viền nhạt */
    g.strokeStyle = 'rgba(120,110,95,.35)';
    g.lineWidth = 2;
    [-2.75, -1.4, 0, 1.4, 2.75].forEach(function (x) { var p = P(x - 0.6, Z_SAU - 0.45); g.strokeRect(p[0], p[1], 1.2 * px, 0.9 * px); });
    [-2.85, -1.45, 1.45, 2.85].forEach(function (x) { var p = P(x - 0.6, Z_TRUOC - 0.5); g.strokeRect(p[0], p[1], 1.2 * px, 1.0 * px); });

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 8;
    return tex;
  }

  /* ---------- 4. tầng dưới: nhà máy, điện, ray, ống, công nhân ---------- */

  function dungTangDuoi(g, ctx) {
    var matSat = mat(0x55606b, { metalness: 0.45, roughness: 0.5 });

    /* nhà máy: bốn ô, hiện dần theo sản xuất; ống khói xuyên lên mặt đất */
    var matGach = mat(0xb8643c), matMai = mat(0x8b4a2e), matRang = mat(0x2d3237, { metalness: 0.5 });
    /* thứ tự hiện: ô giữa trước, để cảnh phim luôn bắt được nhà máy đầu tiên */
    [-2.4, -1.7, -3.1, -1.0].forEach(function (x, i) {
      var m = new THREE.Group();
      m.position.set(x, 0.04, -2.75);
      g.add(m);
      dat(m, hop(0.58, 0.32, 0.72, matGach), 0, 0.16, 0);
      for (var k = 0; k < 3; k++) {
        var mai = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.58, 3), matMai);
        mai.rotation.z = Math.PI / 2;
        mai.position.set(0, 0.36, -0.24 + k * 0.24);
        mai.castShadow = true;
        m.add(mai);
      }
      var matSang = new THREE.MeshStandardMaterial({ color: 0xffc070, emissive: 0xff9a40, emissiveIntensity: 1 });
      dat(m, hop(0.42, 0.06, 0.01, matSang), 0, 0.2, 0.365, false);
      var rang = tru(0.1, 0.1, 0.04, 8, matRang);
      rang.rotation.x = Math.PI / 2;
      dat(m, rang, -0.18, 0.1, 0.38);
      /* ống khói: từ mái nhà máy xuyên qua tấm đất, nhô lên sau dãy nhà */
      var ong = new THREE.Group();
      g.add(ong);
      var cao = YD + 0.95 - 0.3;
      dat(ong, tru(0.05, 0.065, cao, 8, mat(0xa8a39c)), x + 0.18, 0.3 + cao / 2, Z0 + 0.22);
      dat(ong, tru(0.056, 0.056, 0.08, 8, mat(0xc8352a)), x + 0.18, YD + 0.85, Z0 + 0.22, false);
      o.may.push({ g: m, ong: ong, rang: rang, matSang: matSang, x: x, hien: 0, khoiT: Math.random(),
                   dinh: [x + 0.18, YD + 0.97, Z0 + 0.22] });
      vungNhin(g, 0.62, 0.5, 0.76, x, 0.28, -2.75, { nhin: 'nhaMay', duoi: true });
    });

    /* nhà máy điện: gian tua-bin + tháp làm mát, lò đổi màu khi thành điện sạch */
    dat(g, hop(0.9, 0.32, 0.6, mat(0x6b7682, { metalness: 0.35 })), 1.5, 0.2, -2.75);
    o.matLo = new THREE.MeshStandardMaterial({ color: 0xff8a3a, emissive: 0xff7a20, emissiveIntensity: 1.2 });
    dat(g, hop(0.5, 0.12, 0.01, o.matLo), 1.5, 0.22, -2.44, false);
    var pts = [];
    for (var k = 0; k <= 8; k++) {
      var y = k / 8;
      pts.push(new THREE.Vector2(0.2 - 0.07 * Math.sin(y * Math.PI) + (1 - y) * 0.03, y * 0.58));
    }
    var geoThap = new THREE.LatheGeometry(pts, 14);
    var matThap = mat(0xd9d6cf, { side: THREE.DoubleSide });
    [[2.3, -2.75], [3.05, -2.75], [2.68, -1.95]].forEach(function (p) {
      var t = new THREE.Mesh(geoThap, matThap);
      t.position.set(p[0], 0.04, p[1]);
      t.castShadow = true;
      g.add(t);
      o.thap.push({ m: t, hien: 0, dinh: [p[0], 0.66, p[1]] });
    });
    vungNhin(g, 2.2, 0.7, 1.6, 2.3, 0.35, -2.4, { nhin: 'dien', duoi: true });

    /* đường ray ngầm + đoàn tàu */
    [-0.07, 0.07].forEach(function (dz) { dat(g, hop(X1 - X0 - 0.2, 0.02, 0.02, matSat), 0, 0.06, Z_RAY + dz, false); });
    for (var x = X0 + 0.2; x < X1 - 0.1; x += 0.2) dat(g, hop(0.04, 0.015, 0.22, mat(0x6a5440)), x, 0.045, Z_RAY, false);
    var matTau = [mat(0x3c8fc4, { metalness: 0.3 }), mat(0x9aa4ad, { metalness: 0.3 })];
    for (var i = 0; i < 5; i++) {
      var toa = new THREE.Group();
      dat(toa, hop(0.34, 0.16, 0.18, i === 0 ? matTau[0] : matTau[1]), 0, 0.15, 0);
      if (i > 0) dat(toa, hop(0.28, 0.08, 0.14, mat(0xc29a62)), 0, 0.27, 0);
      else dat(toa, hop(0.12, 0.06, 0.16, mat(0xfff2c0, { emissive: 0xffe08a, emissiveIntensity: 1 })), 0.12, 0.2, 0, false);
      toa.position.z = Z_RAY;
      g.add(toa);
      o.toa_.push(toa);
    }
    o.tauX = X0;
    vungNhin(g, X1 - X0, 0.36, 0.3, 0, 0.18, Z_RAY, { nhin: 'duongRay', duoi: true });

    /* đường ống nước dọc tường sau, nước chảy (vạch sáng trôi) */
    var c = document.createElement('canvas');
    c.width = 128; c.height = 16;
    var gc = c.getContext('2d');
    gc.fillStyle = '#2f6fa6'; gc.fillRect(0, 0, 128, 16);
    gc.fillStyle = '#9fd4ff'; gc.fillRect(0, 0, 30, 16);
    o.texNuoc = new THREE.CanvasTexture(c);
    o.texNuoc.wrapS = o.texNuoc.wrapT = THREE.RepeatWrapping;
    o.texNuoc.repeat.set(1, 10);
    var matOng = new THREE.MeshStandardMaterial({ map: o.texNuoc, emissive: 0x2a5f90, emissiveIntensity: 0.4, roughness: 0.4 });
    var ong = tru(0.045, 0.045, X1 - X0 - 0.2, 10, matOng);
    ong.rotation.z = Math.PI / 2;
    dat(g, ong, 0, 0.72, Z0 + 0.16);
    [-0.5, 0.9].forEach(function (x) { dat(g, tru(0.035, 0.035, YT - 0.72, 8, matOng), x, (0.72 + YT) / 2, Z0 + 0.16); });
    vungNhin(g, X1 - X0, 0.16, 0.16, 0, 0.72, Z0 + 0.2, { nhin: 'ongNuoc', duoi: true });

    /* trục của cải: ống kính sáng xuyên hai tầng */
    o.matTruc = new THREE.MeshStandardMaterial({ color: 0xfff1c8, emissive: 0xffc24a, emissiveIntensity: 0.4,
      transparent: true, opacity: 0.35, depthWrite: false });
    dat(g, tru(0.14, 0.14, YD + 0.3, 16, o.matTruc), 0, (YD + 0.3) / 2, Z_TRUC, false);
    dat(g, tru(0.2, 0.22, 0.05, 16, mat(0xc9a76a, { metalness: 0.4 })), 0, YD + 0.025, Z_TRUC);
    dat(g, tru(0.2, 0.22, 0.05, 16, mat(0xc9a76a, { metalness: 0.4 })), 0, 0.065, Z_TRUC);
    vungNhin(g, 0.36, YD + 0.4, 0.36, 0, (YD + 0.3) / 2, Z_TRUC, { nhin: 'truc' });

    /* công nhân tí hon đi lại giữa nhà máy và đường ray */
    for (var w = 0; w < 6; w++) {
      var n = new THREE.Group();
      dat(n, tru(0.035, 0.03, 0.12, 6, mat(0xe8823a)), 0, 0.1, 0);
      dat(n, new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 4), mat(0xf2c230)), 0, 0.19, 0);
      g.add(n);
      o.cn.push({ g: n, x0: -3.2 + Math.random() * 2.4, z: -1.9 + (w % 3) * 0.35, pha: Math.random() * 6, toc: 0.3 + Math.random() * 0.3 });
    }

    /* dây điện: từ nhà máy điện lên các toà nhà, có xung sáng chạy */
    var dich = [[0, Z_SAU], [2.75, Z_SAU], [-2.75, Z_SAU], [-2.85, Z_TRUOC], [2.85, Z_TRUOC], [1.4, Z_SAU], [1.45, Z_TRUOC]];
    var matDay = new THREE.LineBasicMaterial({ color: 0xc9a040, transparent: true, opacity: 0.5 });
    dich.forEach(function (d, i) {
      var yy = 0.78 - i * 0.012;
      var p = [[1.5, 0.36, -2.6], [1.5, yy, -2.6], [d[0], yy, -2.6], [d[0], yy, d[1]], [d[0], YD + 0.02, d[1]]];
      o.day.push(duong(p));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p.map(function (q) { return new THREE.Vector3(q[0], q[1], q[2]); })), matDay));
    });

    /* nhãn tầng dưới, sau kính mặt cắt — chỉ hiện khi mặt đất đã mở */
    var T = ctx.text.chuGiai;
    o.nhanDuoi = [[T.nhaMay.tieuDe, -2.05], [T.duongRay.tieuDe, -0.6], [T.dien.tieuDe, 2.3]].map(function (d) {
      var m = bang(512, 96, 0.46, [[d[0].toUpperCase(), fSans(40, 800), '#ffffff', 63, '3px']], nenBien(MAU_HT, null, true));
      m.position.set(d[1], 0.79, Z1 - 0.02);
      m.material.opacity = 0;
      g.add(m);
      return m;
    });
  }

  /* ---------- 5. thành phố trên mặt đất ---------- */

  function texCua() {
    function ve(sang) {
      var c = document.createElement('canvas');
      c.width = 128; c.height = 32;
      var g = c.getContext('2d');
      g.fillStyle = sang ? '#000' : '#ffffff';
      g.fillRect(0, 0, 128, 32);
      for (var i = 0; i < 4; i++) {
        g.fillStyle = sang ? (i === 2 ? '#333' : '#fff') : '#5f6f84';
        g.fillRect(10 + i * 30, 9, 18, 15);
      }
      var t = new THREE.CanvasTexture(c);
      t.encoding = sang ? THREE.LinearEncoding : THREE.sRGBEncoding;
      return t;
    }
    o.texCua = ve(false);
    o.texCuaSang = ve(true);
  }

  /* Một toà nhà = chồng tầng, hiện dần theo mức (tầng lẻ là đang xây dở).
     d: { id, x, z, w, sau, hT, max, mau, kinh, muc, dinh(cap, d), nhan } */
  function toaNha(g, d) {
    var grp = new THREE.Group();
    grp.position.set(d.x, YD, d.z);
    g.add(grp);
    var m = new THREE.MeshStandardMaterial({
      color: d.mau, map: o.texCua, emissiveMap: o.texCuaSang, emissive: 0xffd58a, emissiveIntensity: 0.4,
      roughness: d.kinh ? 0.3 : 0.7, metalness: d.kinh ? 0.35 : 0.05, flatShading: true
    });
    o.matNha.push(m);
    var geo = new THREE.BoxGeometry(d.w, d.hT * 0.97, d.sau);
    geo.translate(0, d.hT * 0.485, 0);
    var tangs = [];
    for (var i = 0; i < d.max; i++) {
      var t = new THREE.Mesh(geo, m);
      t.position.y = i * d.hT;
      t.castShadow = true;
      t.receiveShadow = true;
      grp.add(t);
      tangs.push(t);
    }
    var cap = new THREE.Group();
    grp.add(cap);
    if (d.dinh) d.dinh(cap, d, grp);
    var nha = { d: d, g: grp, tang: tangs, cap: cap, hien: 1, dich: 1, rung: 0 };
    if (d.nhan) nha.bien = nhanNoi(g, d.nhan, MAU_TT);
    vungNhin(g, d.w + 0.1, d.max * d.hT + 0.4, d.sau + 0.1, d.x, YD + (d.max * d.hT + 0.4) / 2, d.z, { nhin: d.nhin });
    o.toa.push(nha);
    o.toaTT[d.id] = nha;
    return nha;
  }

  function maiPhang(cap, d, mau) {
    dat(cap, hop(d.w + 0.06, 0.04, d.sau + 0.06, mat(mau || 0x8a8478)), 0, 0.02, 0);
  }
  function co(cap, x, y, z, mau) {
    dat(cap, tru(0.008, 0.008, 0.36, 4, mat(0x888888)), x, y + 0.18, z, false);
    dat(cap, hop(0.12, 0.07, 0.005, mat(mau, { side: THREE.DoubleSide })), x + 0.06, y + 0.32, z, false);
  }

  function dungThanhPho(g, ctx) {
    texCua();
    var T = ctx.text.chuGiai;

    toaNha(g, { id: 'thiChinh', nhin: 'thiChinh', nhan: T.thiChinh.tieuDe.toUpperCase(), muc: 'tc',
      x: 0, z: Z_SAU, w: 1.15, sau: 0.8, hT: 0.2, max: 5, mau: 0xefe6d2,
      dinh: function (cap, d) {
        maiPhang(cap, d, 0xd8cdb4);
        var vom = new THREE.Group();
        cap.add(vom);
        dat(vom, tru(0.22, 0.22, 0.12, 16, mat(0xefe6d2)), 0, 0.1, 0);
        dat(vom, new THREE.Mesh(new THREE.SphereGeometry(0.23, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), TX.vatLieuVang()), 0, 0.16, 0);
        co(vom, 0, 0.38, 0, 0xc8352a);
        cap.userData.vom = vom;
      } });

    toaNha(g, { id: 'toaAn', nhin: 'toaAn', nhan: T.toaAn.tieuDe.toUpperCase(), muc: 'tc',
      x: -2.75, z: Z_SAU, w: 0.95, sau: 0.66, hT: 0.2, max: 4, mau: 0xf2f2ee,
      dinh: function (cap, d, grp) {
        var tg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, d.w + 0.06, 3), mat(0xe9e6dc));
        tg.rotation.z = Math.PI / 2;
        tg.rotation.x = Math.PI / 2;
        tg.scale.set(1, 1, 0.55);
        tg.position.y = 0.06;
        tg.castShadow = true;
        cap.add(tg);
        var matCot = mat(0xffffff);
        for (var i = 0; i < 5; i++) dat(grp, tru(0.025, 0.025, d.hT, 6, matCot), -0.36 + i * 0.18, d.hT / 2, d.sau / 2 + 0.06);
        dat(grp, hop(d.w, 0.03, 0.14, matCot), 0, d.hT, d.sau / 2 + 0.04);
      } });

    toaNha(g, { id: 'truong', nhin: 'truong', nhan: T.truong.tieuDe.toUpperCase(), muc: 'gd',
      x: -2.85, z: Z_TRUOC, w: 1.0, sau: 0.7, hT: 0.19, max: 4, mau: 0xc9714a,
      dinh: function (cap, d) {
        maiPhang(cap, d, 0x8b4a2e);
        dat(cap, hop(0.2, 0.26, 0.2, mat(0xd9875c)), 0, 0.15, 0);
        var mat_ = new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), mat(0xffffff));
        mat_.position.set(0, 0.2, 0.101);
        cap.add(mat_);
        co(cap, 0, 0.28, 0, 0xc8352a);
      } });

    toaNha(g, { id: 'nhaHat', nhin: 'nhaHat', nhan: T.nhaHat.tieuDe.toUpperCase(), muc: 'vh',
      x: 2.85, z: Z_TRUOC, w: 1.0, sau: 0.75, hT: 0.24, max: 3, mau: 0x9468ac,
      dinh: function (cap, d) {
        /* mái vòm: nửa trụ nằm ngang dọc theo chiều rộng */
        var vom = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, d.w, 14, 1, false, -Math.PI / 2, Math.PI), mat(0xc9a14a, { metalness: 0.3 }));
        vom.rotation.z = Math.PI / 2;
        vom.scale.set(0.55, 1, 1);
        vom.castShadow = true;
        cap.add(vom);
      } });

    toaNha(g, { id: 'thapTH', nhin: 'thapTH', nhan: T.thapTH.tieuDe.toUpperCase(), muc: 'vh',
      x: 2.75, z: Z_SAU, w: 0.34, sau: 0.34, hT: 0.28, max: 7, mau: 0xc8d3dc, kinh: true,
      dinh: function (cap) {
        dat(cap, tru(0.24, 0.18, 0.14, 12, mat(0xe6ecf1, { metalness: 0.3 })), 0, 0.07, 0);
        dat(cap, tru(0.012, 0.02, 0.55, 6, mat(0xb0b6bc, { metalness: 0.6 })), 0, 0.42, 0);
        o.matDenThap = new THREE.MeshStandardMaterial({ color: 0xff3a2a, emissive: 0xff3a2a, emissiveIntensity: 1 });
        dat(cap, new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), o.matDenThap), 0, 0.71, 0, false);
      } });

    /* đời sống kinh tế trên mặt đất: nhà ở, doanh nghiệp — lớn theo kinh tế */
    [[-1.4, Z_SAU], [-1.45, Z_TRUOC]].forEach(function (p, i) {
      toaNha(g, { id: 'nhaO' + i, nhin: 'nhaO', muc: 'kt', x: p[0], z: p[1], w: 0.85, sau: 0.66, hT: 0.17, max: 5, mau: 0xe8d9c0,
        dinh: function (cap, d) { maiPhang(cap, d, 0x9a6a4a); dat(cap, tru(0.07, 0.07, 0.12, 8, mat(0x8a8f96)), 0.2, 0.1, 0.1); } });
    });
    [[1.4, Z_SAU], [1.45, Z_TRUOC]].forEach(function (p, i) {
      toaNha(g, { id: 'vanPhong' + i, nhin: 'vanPhong', muc: 'kt', x: p[0], z: p[1], w: 0.78, sau: 0.66, hT: 0.2, max: 7, mau: 0x8fb2cc, kinh: true,
        dinh: function (cap, d) { maiPhang(cap, d, 0x55606b); dat(cap, hop(0.26, 0.1, 0.22, mat(0x6b7682)), -0.12, 0.08, 0); } });
    });

    /* xe trên đại lộ */
    var mauXe = [0xd9483a, 0xf2c230, 0x3c8fc4, 0xf4f4f0, 0x2e8b57, 0x5a5f66, 0xe8823a, 0x8a5cc4];
    for (var i = 0; i < 8; i++) {
      var x = new THREE.Group();
      dat(x, hop(0.2, 0.06, 0.1, mat(mauXe[i])), 0, 0.05, 0);
      dat(x, hop(0.11, 0.05, 0.09, mat(0x2a3138)), -0.02, 0.1, 0);
      var den = new THREE.MeshStandardMaterial({ color: 0x551010, emissive: 0xff2a20, emissiveIntensity: 0 });
      dat(x, hop(0.01, 0.025, 0.08, den), -0.1, 0.05, 0, false);
      x.position.y = YD;
      g.add(x);
      o.xe.push({ g: x, den: den, chieu: i % 2 ? 1 : -1, x: X0 + Math.random() * (X1 - X0), v: 0 });
    }

    /* cây xanh */
    var matLa = mat(0x6f9a5a), matGoc = mat(0x7a5a3c);
    [[-3.35, -3.32], [-0.75, -3.3], [0.75, -3.3], [3.35, -3.32], [-0.5, -0.1], [0.5, -0.1], [-0.45, Z_TRUC], [0.45, Z_TRUC]].forEach(function (p) {
      dat(g, tru(0.015, 0.02, 0.1, 5, matGoc), p[0], YD + 0.05, p[1]);
      dat(g, new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 6), matLa), p[0], YD + 0.2, p[1]);
    });
  }

  /* ---------- 6. bàn điều khiển: bốn nút ---------- */

  function yMatBan(dz) { return 0.84 - dz * Math.tan(NGHIENG); }

  function dungBanDieuKhien(g, ctx) {
    dat(g, hop(4.0, 0.78, 0.72, mat(0x39424c, { metalness: 0.35, roughness: 0.5 })), 0, 0.39, Z_BAN);
    var matBan = dat(g, hop(4.08, 0.07, 0.86, mat(0x2a3138, { metalness: 0.3 })), 0, 0.805, Z_BAN);
    matBan.rotation.x = NGHIENG;

    NUT.forEach(function (cd) {
      var de = dat(g, tru(0.17, 0.19, 0.05, 20, mat(0x1c2126, { metalness: 0.5 })), cd.x, yMatBan(-0.08) + 0.03, Z_BAN - 0.08);
      de.rotation.x = NGHIENG;
      var num = new THREE.Group();
      num.position.set(cd.x, yMatBan(-0.08) + 0.06, Z_BAN - 0.08);
      num.rotation.x = NGHIENG;
      g.add(num);
      var matNum = new THREE.MeshStandardMaterial({ color: cd.mau, emissive: cd.mau, emissiveIntensity: 0.2, roughness: 0.35 });
      var nap = tru(0.13, 0.14, 0.07, 20, matNum);
      nap.position.y = 0.035;
      nap.castShadow = true;
      num.add(nap);

      var nhan = bangDong(512, 220, 0.86);
      nhan.mesh.position.set(cd.x, yMatBan(0.24) + 0.045, Z_BAN + 0.24);
      nhan.mesh.rotation.x = -Math.PI / 2 + NGHIENG;
      g.add(nhan.mesh);

      o.nut[cd.id] = { nap: nap, matNum: matNum, nhan: nhan, mau: cd.mau, an: 0, sang: 0, khoa: null };
      vungNhin(g, 0.8, 0.7, 0.8, cd.x, 1.0, Z_BAN, { nut: cd.id });
    });
    veNhanNut(ctx);
  }

  function veNhanNut(ctx) {
    var N = ctx.text.nut, CSx = ctx.text.chinhSach;
    NUT.forEach(function (cd) {
      var n = o.nut[cd.id];
      var khoa = !nutMo(cd.id);
      var khoaVe = [khoa, S.m.luat, S.cs, S.nv === 4].join();
      if (n.khoaVe === khoaVe) return;
      n.khoaVe = khoaVe;
      var hex = '#' + cd.mau.toString(16).padStart(6, '0');
      var ten = cd.id === 'nl' && S.m.luat ? ctx.text.nlSach : N[cd.id].ten;
      var dong = [[ten, fSans(46, 800), khoa ? '#6b737c' : '#eef2f6', 64, '3px']];
      if (cd.id === 'cs') {
        dong.push([CSx[S.cs].ten, fSans(38, 700), khoa ? '#6b737c' : '#d9c6f5', 124]);
        if (S.nv === 4) dong.push([N.cs.mo, fSans(26, 500), '#8f9aa6', 184]);
      } else dong.push([N[cd.id].mo, fSans(28, 500), khoa ? '#5a626b' : '#9aa6b2', 140]);
      n.nhan.ve(dong, nenBien('#20262c', khoa ? '#3a424b' : hex));
    });
  }

  /* ---------- 7. hạt: của cải, chính sách, khói, hơi, xung điện ---------- */

  /* dòng chảy qua trục: nguồn → chân trục → đỉnh trục → đích (hoặc ngược lại) */
  function dongChay(g, n, mau) {
    var h = TX.heHat(g, n, mau, 0.075, 0.95);
    h.ab = new Float32Array(n * 6);
    h.u = new Float32Array(n);
    h.nguoc = new Uint8Array(n);
    return h;
  }
  function sinhDong(h, nguon, dich, nguoc) {
    for (var i = 0; i < h.count; i++) {
      if (h.life[i] > 0) continue;
      h.life[i] = 1;
      h.u[i] = 0;
      h.nguoc[i] = nguoc ? 1 : 0;
      h.ab[i * 6] = nguon[0]; h.ab[i * 6 + 1] = nguon[1]; h.ab[i * 6 + 2] = nguon[2];
      h.ab[i * 6 + 3] = dich[0]; h.ab[i * 6 + 4] = dich[1]; h.ab[i * 6 + 5] = dich[2];
      return;
    }
  }
  var TRUC_D = [0, 0.15, Z_TRUC], TRUC_T = [0, YD + 0.35, Z_TRUC];
  function capNhatDong(h, dt) {
    for (var i = 0; i < h.count; i++) {
      if (h.life[i] <= 0) continue;
      h.u[i] += dt * 1.1;
      var u = h.u[i], a, b, k, cong = 0;
      var N = [h.ab[i * 6], h.ab[i * 6 + 1], h.ab[i * 6 + 2]], D = [h.ab[i * 6 + 3], h.ab[i * 6 + 4], h.ab[i * 6 + 5]];
      var p1 = h.nguoc[i] ? TRUC_T : TRUC_D, p2 = h.nguoc[i] ? TRUC_D : TRUC_T;
      if (u < 1) { a = N; b = p1; k = u; cong = h.nguoc[i] ? 0.25 : 0; }
      else if (u < 2) { a = p1; b = p2; k = u - 1; }
      else if (u < 3) { a = p2; b = D; k = u - 2; cong = h.nguoc[i] ? 0 : 0.35; }
      else { h.an(i); continue; }
      var s = Math.sin(k * Math.PI) * cong;
      h.pos[i * 3] = a[0] + (b[0] - a[0]) * k;
      h.pos[i * 3 + 1] = a[1] + (b[1] - a[1]) * k + s;
      h.pos[i * 3 + 2] = a[2] + (b[2] - a[2]) * k;
    }
    h.capNhat();
  }

  function dungHieuUng(g) {
    o.vang = dongChay(g, 160, 0xf2b630);
    o.tim = dongChay(g, 120, 0x9a5cf0);
    o.khoi = TX.heHat(g, 220, 0x8f8b86, 0.17, 0.55);
    o.hoi = TX.heHat(g, 90, 0xf6f6f6, 0.15, 0.7);
    o.tiaLua = TX.heHat(g, 90, 0xffcf5a, 0.06, 0.95);
    o.xung = TX.heHat(g, 32, 0xffe27a, 0.07, 0.95);
    o.xungD = [];
    for (var i = 0; i < 32; i++) o.xungD.push({ day: i % o.day.length, u: Math.random() });

    /* lớp khói mù phủ thành phố */
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var gc = c.getContext('2d');
    for (var k = 0; k < 18; k++) {
      var x = Math.random() * 256, y = Math.random() * 256, r = 40 + Math.random() * 70;
      var v = gc.createRadialGradient(x, y, 0, x, y, r);
      v.addColorStop(0, 'rgba(255,255,255,.55)');
      v.addColorStop(1, 'rgba(255,255,255,0)');
      gc.fillStyle = v;
      gc.fillRect(0, 0, 256, 256);
    }
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    o.mu = [0.55, 0.9, 1.25].map(function (y, i) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0 + 0.6, Z1 - Z0 + 0.6),
        new THREE.MeshBasicMaterial({ map: tex.clone(), color: 0x7d715d, transparent: true, opacity: 0, depthWrite: false }));
      m.material.map.needsUpdate = true;
      m.rotation.x = -Math.PI / 2;
      m.position.set(0, YD + y, (Z0 + Z1) / 2);
      m.userData.toc = 0.01 + i * 0.006;
      g.add(m);
      return m;
    });

    /* biển báo vấn đề */
    o.bao = {};
    var VI = { UN_TAC: [0, YD + 0.7, Z_DL], THIEU_DIEN: [2.3, 0.7, Z1 + 0.14], O_NHIEM: [-2.2, YD + 1.4, -3.1],
               TUT_HAU: [-2.85, YD + 1.25, Z_TRUOC], QUA_TAI: [0, YD + 1.85, Z_SAU] };
    Object.keys(VI).forEach(function (k) {
      var b = bangDong(512, 96, 0.9);
      b.ve([['⚠ ' + TX.VI['ha-tang'].vanDe[k].bien, fSans(40, 800), '#ffffff', 63, '2px']], nenBien('#c8352a', null, true));
      b.mesh.position.set(VI[k][0], VI[k][1], VI[k][2]);
      b.mesh.material.opacity = 0;
      b.mesh.visible = false;
      b.mesh.userData.y0 = VI[k][1];
      g.add(b.mesh);
      o.bao[k] = b.mesh;
    });

    /* tia sáng nối hai tầng, chỉ bật ở cảnh kết */
    o.matTia = new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, depthWrite: false });
    o.tiaNoi = [[0, Z_SAU], [-2.75, Z_SAU], [2.75, Z_SAU], [-2.85, Z_TRUOC], [2.85, Z_TRUOC], [0, Z_TRUC]].map(function (p) {
      var m = tru(0.09, 0.09, 1, 10, o.matTia);
      m.position.set(p[0], 0, p[1]);
      m.visible = false;
      g.add(m);
      return m;
    });
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function dungPanel(ctx) {
    var N = ctx.text.nhan;
    function dong(id, ten, mau, dam) {
      return '<div class="ht-r' + (dam ? ' dam' : '') + '"><span>' + ten + '</span>' +
             '<div class="ht-t"><i id="ht' + id + 'B" style="background:' + mau + '"></i></div>' +
             '<em id="ht' + id + '">0</em><b id="ht' + id + 'D"></b></div>';
    }
    ctx.hud.datPanel(
      '<style>' +
        '#panel .ht-h{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:8px;gap:12px}' +
        '#panel .ht-h .temp{font-size:40px}' +
        '#panel .ht-h .temp span{font-size:18px}' +
        '#panel .ht-h .phase .val{font-size:18px;margin:0}' +
        '#panel .ht-g{display:grid;grid-template-columns:1fr 1fr;gap:0 22px}' +
        '#panel .ht-b{font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;margin-bottom:1px}' +
        '#panel .ht-r{display:grid;grid-template-columns:112px 1fr 24px 30px;align-items:center;gap:6px;font-size:11.5px;color:var(--muc2);margin-top:3px}' +
        '#panel .ht-r span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '#panel .ht-r.dam{font-weight:700;color:var(--muc);margin-top:5px}' +
        '#panel .ht-r em{font-style:normal;font-weight:600;font-variant-numeric:tabular-nums;color:var(--muc);text-align:right}' +
        '#panel .ht-r b{font-size:10.5px;font-weight:700;font-variant-numeric:tabular-nums;transition:opacity .4s}' +
        '#panel .ht-t{position:relative;height:6px;border-radius:3px;background:#ece5d9;overflow:hidden}' +
        '#panel .ht-r.dam .ht-t{height:8px}' +
        '#panel .ht-t i{position:absolute;left:0;top:0;bottom:0;border-radius:3px}' +
        '#panel .ht-o{margin-top:6px}' +
        '#panel .ht-o .ht-r{grid-template-columns:112px 1fr 24px 30px}' +
        '#panel .ht-c{margin-top:7px;font-size:11.5px;color:var(--muc2);line-height:1.45;min-height:16px}' +
        '#panel .ht-c b{color:var(--muc)}' +
        '#panel .ht-w{margin-top:3px;font-size:11.5px;color:#c8352a;font-weight:600;line-height:1.4}' +
        '#panel .ht-w:empty{display:none}' +
      '</style>' +
      '<div class="ht-h">' +
        '<div><div class="phase" style="text-align:left"><span class="lbl">' + N.diem + '</span></div>' +
          '<div class="temp"><b id="htP" style="font-weight:500">0</b><span>/ ' + DIEM_DICH + '</span></div></div>' +
        '<div class="phase"><div class="lbl">' + N.trangThai + '</div><div class="val" id="htS"></div></div>' +
        '<div class="phase"><div class="lbl">' + N.luot + '</div><div class="val" id="htL">0</div></div>' +
      '</div>' +
      '<div class="ht-g">' +
        '<div><div class="ht-b" style="color:' + MAU_HT + '">' + N.haTang + '</div>' +
          dong('sx', N.sx, MAU_HT) + dong('gt', N.gt, MAU_HT) + dong('nl', N.nl, MAU_HT) + dong('kt', N.kt, MAU_HT, true) + '</div>' +
        '<div><div class="ht-b" style="color:' + MAU_TT + '">' + N.thuongTang + '</div>' +
          dong('tc', N.tc, MAU_TT) + dong('gd', N.gd, MAU_TT) + dong('vh', N.vh, MAU_TT) + dong('tt', N.tt, MAU_TT, true) + '</div>' +
      '</div>' +
      '<div class="ht-g ht-o"><div>' + dong('on', N.on, '#8a7d66') + '</div><div></div></div>' +
      '<div class="ht-c" id="htC"></div>' +
      '<div class="ht-w" id="htW"></div>'
    );
    el = {};
    ['P', 'S', 'L', 'C', 'W'].forEach(function (k) { el[k] = document.getElementById('ht' + k); });
    ['sx', 'gt', 'nl', 'kt', 'tc', 'gd', 'vh', 'tt', 'on'].forEach(function (k) {
      el[k] = document.getElementById('ht' + k);
      el[k + 'B'] = document.getElementById('ht' + k + 'B');
      el[k + 'D'] = document.getElementById('ht' + k + 'D');
    });
    dungONhiemVu(ctx);
  }

  function dungONhiemVu(ctx) {
    var NV = ctx.text.nhiemVu;
    var o1 = document.createElement('div');
    o1.id = 'htNV';
    o1.innerHTML =
      '<style>' +
        '#htNV{position:absolute;left:24px;top:104px;width:300px;padding:12px 16px 12px;border-radius:12px;' +
          'background:var(--kinh);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
          'border:1px solid var(--vien);box-shadow:var(--bong);font-size:12.5px;color:var(--muc2);transition:opacity .4s}' +
        '#htNV.an{opacity:0}' +
        '#htNV .k{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--vang);margin-bottom:6px}' +
        '#htNV .nv{display:grid;grid-template-columns:22px 1fr;gap:0 6px;padding:6px 0;opacity:.5;transition:opacity .3s}' +
        '#htNV .nv+.nv{border-top:1px solid var(--vien)}' +
        '#htNV .nv.dang,#htNV .nv.xong{opacity:1}' +
        '#htNV .o{width:16px;height:16px;margin-top:1px;border-radius:50%;border:1.5px solid var(--vangN);' +
          'display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff}' +
        '#htNV .nv.dang .o{border-color:var(--vang)}' +
        '#htNV .nv.xong .o{background:#1e7a46;border-color:#1e7a46}' +
        '#htNV .t{font-weight:600;color:var(--muc)}' +
        '#htNV .nv.xong .t{text-decoration:line-through;text-decoration-color:rgba(30,122,70,.6)}' +
        '#htNV .m{margin-top:1px;line-height:1.4}' +
        '#htNV .nv:not(.dang) .m{display:none}' +
        '#htNV .tr{grid-column:2;display:none;align-items:center;gap:8px;margin-top:6px}' +
        '#htNV .nv.dang .tr.co{display:flex}' +
        '#htNV .tr div{flex:1;height:4px;border-radius:2px;background:#ece5d9;overflow:hidden}' +
        '#htNV .tr i{display:block;height:100%;width:0;background:linear-gradient(90deg,#e9c47a,#d18a2e)}' +
        '#htNV .tr span{font-size:11px;font-variant-numeric:tabular-nums;color:var(--muc2)}' +
        '#htNV .canh{grid-column:2;display:none;margin-top:5px;font-size:11.5px;color:#c8352a;font-weight:600}' +
        '#htNV .canh:not(:empty){display:block}' +
      '</style>' +
      '<div class="k">' + NV.tieuDe + '</div>' +
      [1, 2, 3, 4].map(function (n) {
        var d = NV['nv' + n];
        return '<div class="nv" id="htNV' + n + '">' +
                 '<div class="o"></div>' +
                 '<div><div class="t">' + n + '. ' + d.ten + '</div>' +
                   '<div class="m">' + d.mo.replace('%n', n === 2 ? SO_XAY : DIEM_DICH) + '</div></div>' +
                 '<div class="tr' + (n === 2 || n === 4 ? ' co' : '') + '"><div><i></i></div><span></span></div>' +
                 '<div class="canh"></div>' +
               '</div>';
      }).join('');
    document.getElementById('hud').appendChild(o1);
    el.nv = o1;
    el.nvDong = [1, 2, 3, 4].map(function (n) {
      var d = document.getElementById('htNV' + n);
      return { d: d, o: d.querySelector('.o'), i: d.querySelector('.tr i'), so: d.querySelector('.tr span'), canh: d.querySelector('.canh') };
    });
  }

  function soNV() {
    return { 1: 1, phim1: 1, 2: 2, phim2: 2, 3: 3, phim3: 3, 4: 4, ket: 4 }[S.nv];
  }

  function capNhatONhiemVu(ctx) {
    var NV = ctx.text.nhiemVu;
    var tag = document.getElementById('roomTag');
    if (tag) el.nv.style.top = (tag.getBoundingClientRect().bottom + 10) + 'px';
    el.nv.classList.toggle('an', !!F);
    var n = soNV();
    el.nvDong.forEach(function (r, k) {
      var so = k + 1;
      var xong = so < n || (so === 4 && S.ket);
      r.d.classList.toggle('xong', xong);
      r.d.classList.toggle('dang', so === n && !xong);
      r.o.textContent = xong ? '✓' : '';
      r.canh.textContent = '';
    });
    var b = el.nvDong[1], d = el.nvDong[3], cur = el.nvDong[n - 1];
    b.i.style.width = (S.daXay / SO_XAY * 100) + '%';
    b.so.textContent = S.daXay + ' / ' + SO_XAY;
    d.i.style.width = Math.min(100, S.hien.d / DIEM_DICH * 100) + '%';
    d.so.textContent = Math.round(S.hien.d) + ' / ' + DIEM_DICH;
    if (typeof S.nv === 'string' && S.nv !== 'ket') cur.canh.textContent = NV.phim;
    else if (n === 4 && !S.ket && S.vd.length) cur.canh.textContent = NV.khung;
  }

  /* ═══════════ khi bước vào ═══════════ */

  function onEnter(ctx) {
    S.batDau = true;
    o.nen = ctx.audio.canhNen();
  }

  /* ═══════════ nút: mở theo nhiệm vụ ═══════════ */

  function nutMo(id) {
    if (S.nv === 2) return id !== 'cs';
    if (S.nv === 3) return id === 'cs';
    return S.nv === 4;
  }

  /* ═══════════ một lượt ═══════════ */

  function loaiCuaNut(id) { return id === 'cs' ? S.cs : id; }

  function batDauLuot(ctx, id) {
    var loai = loaiCuaNut(id);
    var luot = { loai: loai, nut: id, t: 0, tHat: 0.15, t2: 1.1, tKet: 2.3, xong2: false, xongHat: false, phim: null };
    S.truoc = chup(S.m);
    tacDong(S.m, loai);
    S.soLuot++;
    o.nut[id].an = 1;
    ctx.audio.diemNut();

    /* nhịp 1: hiệu ứng tại chỗ được xây */
    if (loai === 'sx') { var m = mayCuoi(); phunTia(m.x, 0.5, -2.4, 30); }
    if (loai === 'nl') phunTia(2.3, 0.6, -2.4, 30);
    if (loai === 'gt') phunTia(0, 0.3, Z_RAY, 24);
    if (loai === 'mt') S.giamT = 4;

    if (S.nv === 2) {
      S.daXay++;
      if (S.daXay >= SO_XAY) {
        S.nv = 'phim2';
        luot.tHat = 2.6; luot.t2 = 6.0; luot.tKet = 7.0;
        batDauPhim(ctx, phim2(), ctx.text.phim2, function () { theCanh1(ctx); });
      }
    } else if (S.nv === 3) {
      S.nv = 'phim3';
      luot.tHat = 1.6; luot.t2 = 4.3; luot.tKet = 5.5;
      S.giamT = 0;
      luot.giamLuc = 3.6;
      batDauPhim(ctx, phim3(), ctx.text.phim3, function () { S.nv = 4; veNhanNut(ctx); });
    }
    S.luot = luot;
    veNhanNut(ctx);
  }

  function mayCuoi() {
    var n = soMay();
    return o.may[Math.max(0, n - 1)];
  }
  function soMay() { return kep(1 + Math.floor((S.m.sx - 10) / 23), 1, 4); }
  function soThap() { return kep(1 + Math.floor((S.m.nl - 10) / 30), 1, 3); }

  function capNhatLuot(dt, ctx) {
    var L = S.luot;
    if (!L) return;
    L.t += dt;
    var tren = L.loai === 'mt' || L.loai === 'gd' || L.loai === 'vh';
    if (L.giamLuc && L.t >= L.giamLuc) { L.giamLuc = 0; S.giamT = 4; }
    /* hạt: vàng đi lên khi xây hạ tầng, tím đi xuống khi ban hành chính sách */
    if (!L.xongHat && L.t >= L.tHat) {
      L.xongHat = true;
      for (var i = 0; i < 28; i++) {
        if (tren) sinhDong(o.tim, dinhNgauNhien(L.loai), nguonNgauNhien(), true);
        else sinhDong(o.vang, nguonNgauNhien(L.loai), dinhNgauNhien());
      }
    }
    if (!L.xong2 && L.t >= L.t2) {
      L.xong2 = true;
      phanUng(S.m);
      S.vd = vanDe(S.m);
      if (S.nv === 4 && S.vd.length) S.soVanDe++;
      S.chuoi = chuoi(ctx, L.loai, S.truoc, chup(S.m));
      S.deltaT = 4.5;
      ctx.audio.diemNut();
    }
    if (L.t >= L.tKet) {
      S.luot = null;
      if (S.nv === 4 && !S.ket && diem(S.m) >= DIEM_DICH) ketThuc(ctx);
    }
  }

  /* toạ độ ngẫu nhiên cho hạt: nguồn ở tầng dưới, đích trên nóc toà nhà */
  function nguonNgauNhien(loai) {
    if (loai === 'nl') return [2.3 + (Math.random() - 0.5) * 1, 0.4, -2.5];
    if (loai === 'gt') return [(Math.random() - 0.5) * 6, 0.2, Z_RAY];
    var m = o.may[Math.floor(Math.random() * soMay())];
    return [m.x + (Math.random() - 0.5) * 0.4, 0.45, -2.5];
  }
  function dinhNgauNhien(loai) {
    var ds = o.toa;
    if (loai === 'mt') ds = [o.toaTT.thiChinh, o.toaTT.toaAn];
    if (loai === 'gd') ds = [o.toaTT.truong];
    if (loai === 'vh') ds = [o.toaTT.nhaHat, o.toaTT.thapTH];
    var t = ds[Math.floor(Math.random() * ds.length)];
    return [t.d.x + (Math.random() - 0.5) * 0.3, YD + t.hien * t.d.hT + 0.1, t.d.z + (Math.random() - 0.5) * 0.3];
  }

  /* chuỗi phản ứng của lượt vừa rồi, đọc từ thay đổi thật của mô hình */
  function chuoi(ctx, loai, a, b) {
    var C = ctx.text.chuoi, r = [];
    r.push('<b>' + (loai === 'nl' && S.m.luat ? C.nlSach : C[loai]) + '</b>');
    var tren = loai === 'mt' || loai === 'gd' || loai === 'vh';
    if (tren) {
      if (loai === 'mt') r.push(C.onXuong, C.sxXuong);
      if (loai === 'gd' && b.sx > a.sx + 0.3) r.push(C.sxLen);
      if (b.kt < a.kt - 0.5) r.push(C.ktXuong);
      if (b.tt < a.tt + 2 && S.vd.indexOf('QUA_TAI') >= 0) r.push(C.ttXuong);
    } else {
      r.push(b.kt >= a.kt ? C.ktLen : C.ktXuong);
      if (S.vd.indexOf('UN_TAC') >= 0) r.push(C.unTac);
      if (S.vd.indexOf('THIEU_DIEN') >= 0) r.push(C.thieuDien);
      if (b.tt > a.tt + 0.5) r.push(C.ttLen);
      if (b.on > a.on + 2) r.push(C.onLen);
      else if (b.on < a.on - 2) r.push(C.onXuong);
    }
    return '<b>' + ctx.text.nhan.luotTruoc + ':</b> ' + r.join(' → ');
  }

  function ketThuc(ctx) {
    S.ket = true;
    S.nv = 'ket';
    ctx.hud.buocNhay(ctx.text.nhan.buocNhay, Math.round(diem(S.m)) + ' / ' + DIEM_DICH);
    ctx.audio.buocNhay();
    ctx.hoanThanh();
    o.tiaNoi.forEach(function (m) { m.visible = true; });
    setTimeout(function () {
      if (!S) return;
      batDauPhim(ctx, phim4(), ctx.text.phim4, function () { theBaiHoc(ctx); });
    }, 1400);
  }

  /* ═══════════ cảnh phim: camera tự dẫn ═══════════ */

  function phim1() {
    return [
      { p: [0, 0.75, 2.3], n: [0, 0.42, -1.6], d: 2.2, giu: 2.6, chu: 0 },
      { p: [-2.1, 0.62, 1.2], n: [-2.1, 0.32, -2.6], d: 1.8, giu: 2.8, chu: 1 },
      { p: [2.2, 0.66, 1.2], n: [2.2, 0.45, -2.4], d: 2.2, giu: 2.8, chu: 2 },
      { p: [0.9, 0.36, 1.1], n: [-1.4, 0.15, -0.1], d: 1.8, giu: 2.6, chu: 3 },
      { p: [0, 3.3, 3.0], n: [0, 1.3, -1.6], d: 2.6, giu: 3.4, chu: 4 }
    ];
  }
  function phim2() {
    return [
      { p: [-1.6, 0.62, 1.4], n: [-1.8, 0.4, -2.5], d: 1.6, giu: 1.6, chu: 0 },
      { p: [0, 0.6, 0.9], n: [0, 0.9, Z_TRUC], d: 1.4, giu: 0.6 },
      { p: [0, 2.9, 2.3], n: [0, 1.4, -2.0], d: 2.2, giu: 3.6, chu: 1 }
    ];
  }
  function phim3() {
    return [
      { p: [-1.2, 2.6, 0.7], n: [-1.5, 1.3, -2.5], d: 1.8, giu: 1.8, chu: 0 },
      { p: [-2.0, 0.62, 1.3], n: [-2.1, 0.4, -2.6], d: 2.0, giu: 3.4, chu: 1 },
      { p: [0, 3.2, 3.2], n: [0, 1.2, -1.6], d: 2.2, giu: 4.6, chu: 2 }
    ];
  }
  function phim4() {
    return [
      { p: [0, 4.4, 6.6], n: [0, 0.8, -1.5], d: 3.5, giu: 6.5, chu: 0 }
    ];
  }

  function v3(a) { return new THREE.Vector3(a[0], a[1], a[2]); }

  function batDauPhim(ctx, keys, chu, xong) {
    var P = ctx.player, cam = ctx.camera;
    var dau = cam.position.clone();
    var huong = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion);
    var nhin = dau.clone().addScaledVector(huong, 3);
    var ks = [{ p: dau, n: nhin }];
    keys.forEach(function (k) { ks.push({ p: v3(k.p), n: v3(k.n), d: k.d, giu: k.giu, chu: k.chu }); });
    ks.push({ p: dau.clone(), n: nhin.clone(), d: 2.0, giu: 0 });
    F = { k: ks, i: 1, t: 0, giu: false, chu: chu, xong: xong,
          pos: P.pos.clone(), yaw: P.yaw, pitch: P.pitch, nhin: new THREE.Vector3() };
    ctx.khoaCamera = true;
    ctx.hud.phim(true);
    ctx.hud.ngamTat(true);
    document.body.classList.add('lc-phim');     // ẩn nhãn phòng dưới viền phim
    ctx.hud.anChuGiai();
    ctx.hud.hienPanel(false);
    ctx.hud.hienGoiY(false);
    var k1 = ks[1];
    if (k1.chu != null) { var c = chu[k1.chu]; ctx.hud.phimChu(c.k, c.t, c.p); }
  }

  function capNhatPhim(dt, ctx) {
    if (!F) return;
    var cam = ctx.camera, A = TX.anim;
    F.t += dt;
    var a = F.k[F.i - 1], k = F.k[F.i];
    if (!F.giu) {
      var u = A.muot(F.t / k.d);
      cam.position.lerpVectors(a.p, k.p, u);
      F.nhin.lerpVectors(a.n, k.n, u);
      if (F.t >= k.d) { F.giu = true; F.t = 0; }
    } else {
      var tr = Math.sin(ctx.clock * 0.4) * 0.06;
      cam.position.set(k.p.x + tr, k.p.y, k.p.z);
      F.nhin.copy(k.n);
      if (F.t >= (k.giu || 0)) {
        F.i++;
        F.giu = false;
        F.t = 0;
        if (F.i >= F.k.length) { ketThucPhim(ctx); return; }
        var kn = F.k[F.i];
        if (kn.chu != null) { var c = F.chu[kn.chu]; ctx.hud.phimChu(c.k, c.t, c.p); }
        else if (F.i === F.k.length - 1) ctx.hud.phimChu();
      }
    }
    cam.lookAt(F.nhin);
  }

  function ketThucPhim(ctx) {
    var P = ctx.player, f = F;
    F = null;
    P.pos.copy(f.pos);
    P.yaw = f.yaw;
    P.pitch = f.pitch;
    ctx.khoaCamera = false;
    ctx.hud.phim(false);
    ctx.hud.phimChu();
    ctx.hud.ngamTat(false);
    document.body.classList.remove('lc-phim');
    if (f.xong) f.xong();
  }

  /* ═══════════ thẻ bài học ═══════════ */

  function theCanh1(ctx) {
    var B = ctx.text.canh1;
    ctx.hud.anChuGiai();
    ctx.hud.the(
      '<div class="eyebrow">' + B.nhan + '</div>' +
      '<h1>' + B.tieuDe + '</h1>' +
      '<p>' + B.dan + '</p>' +
      '<dl>' + B.dinhNghia.map(function (d) { return '<dt>' + d[0] + '</dt><dd>' + d[1] + '</dd>'; }).join('') + '</dl>' +
      '<p class="note">' + B.luuY + '</p>' +
      '<h2>' + B.nhiemVu3.tieuDe + '</h2>' +
      '<p>' + B.nhiemVu3.than + '</p>',
      B.nut,
      function () { S.nv = 3; S.cs = 'mt'; veNhanNut(ctx); }
    );
  }

  function theBaiHoc(ctx) {
    var B = ctx.text.baiHoc;
    S.daThe = true;
    ctx.soTay.ghi({ ten: ctx.text.soTay.ten, tom: ctx.text.soTay.tom, trichDan: B.trichDan, nguon: B.nguon });
    ctx.hud.anChuGiai();
    var nhac = (S.soVanDe ? B.nhacLuot.replace('%k', S.soVanDe) : B.nhacKhong).replace('%n', S.soLuot);
    ctx.hud.the(
      '<div class="eyebrow">' + B.nhan + '</div>' +
      '<h1>' + B.tieuDe + '</h1>' +
      '<p>' + B.dan + '</p>' +
      '<dl>' + B.dinhNghia.map(function (d) { return '<dt>' + d[0] + '</dt><dd>' + d[1] + '</dd>'; }).join('') + '</dl>' +
      '<blockquote class="quote">' + B.trichDan + '<cite>' + B.nguon + '</cite></blockquote>' +
      '<h2>Ý nghĩa phương pháp luận</h2>' +
      B.phuongPhapLuan.map(function (d) { return '<p><strong>' + d[0] + ' —</strong> ' + d[1] + '</p>'; }).join('') +
      '<h2>' + B.lienHe.tieuDe + '</h2>' +
      '<p>' + B.lienHe.than + '</p>' +
      '<p class="note">' + nhac + '</p>',
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  /* ═══════════ logic mỗi khung hình ═══════════ */

  function logic(dt, ctx) {
    var td = ctx.player.action();
    var canh = td !== 0 && S.tdTruoc === 0;    // chỉ tính lúc vừa bấm
    S.tdTruoc = td;

    /* NV1: kéo cần mở mặt đất */
    if (S.nv === 1 && S.chon === 'can' && canh && td > 0) {
      S.nv = 'phim1';
      S.daKeo = true;
      ctx.audio.buocNhay();
      batDauPhim(ctx, phim1(), ctx.text.phim1, function () { S.nv = 2; veNhanNut(ctx); });
    }

    if (S.chon && S.chon !== 'can' && canh && !S.luot) {
      if (td < 0 && S.chon === 'cs' && S.nv === 4) {
        S.cs = CS[(CS.indexOf(S.cs) + 1) % CS.length];
        o.nut.cs.sang = 1;
        ctx.audio.diemNut();
        veNhanNut(ctx);
      } else if (td > 0 && nutMo(S.chon)) {
        batDauLuot(ctx, S.chon);
      } else if (td > 0) {
        S.khoaT = 1.6;
      }
    }
    if (S.khoaT > 0) S.khoaT -= dt;
    capNhatLuot(dt, ctx);
    if (S.giamT > 0) S.giamT -= dt;
    if (S.deltaT > 0) S.deltaT -= dt;
  }

  /* ═══════════ hình ảnh ═══════════ */

  function capNhatToaNha(dt, ngay) {
    var A = TX.anim, k = kinhTe(S.m), m = S.m;
    o.toa.forEach(function (t) {
      var muc = t.d.muc === 'kt' ? k : m[t.d.muc];
      t.dich = Math.max(1, muc / 100 * t.d.max);
      t.hien = ngay ? t.dich : A.damp(t.hien, t.dich, 2.2, dt);
      for (var i = 0; i < t.tang.length; i++) {
        var s = kep(t.hien - i, 0, 1);
        t.tang[i].visible = s > 0.02;
        t.tang[i].scale.y = Math.max(0.02, s);
      }
      t.cap.position.y = t.hien * t.d.hT;
      if (t.cap.userData.vom) {
        var v = kep((m.tc - 40) / 15, 0, 1);
        t.cap.userData.vom.scale.setScalar(Math.max(0.01, v));
        t.cap.userData.vom.visible = v > 0.02;
      }
      /* thượng tầng vượt sức nền thì toà nhà rung */
      var rung = t.d.muc !== 'kt' && S.vd.indexOf('QUA_TAI') >= 0 ? 1 : 0;
      t.g.rotation.z = rung ? Math.sin(TX.uTime.value * 30 + t.d.x) * 0.012 : 0;
      if (t.bien) t.bien.position.set(t.d.x, YD + t.hien * t.d.hT + 0.42 + (t.d.id === 'thapTH' ? 0.6 : t.d.id === 'thiChinh' ? 0.4 : 0.2), t.d.z);
    });
  }

  function phunTia(x, y, z, n) {
    var T = o.tiaLua;
    for (var i = 0; i < T.count && n > 0; i++) {
      if (T.life[i] > 0) continue;
      T.pos[i * 3] = x; T.pos[i * 3 + 1] = y; T.pos[i * 3 + 2] = z;
      var a = Math.random() * Math.PI * 2, v = 0.6 + Math.random();
      T.vel[i * 3] = Math.cos(a) * v * 0.6;
      T.vel[i * 3 + 1] = 0.8 + Math.random() * 1.2;
      T.vel[i * 3 + 2] = Math.sin(a) * v * 0.6;
      T.life[i] = 0.6 + Math.random() * 0.4;
      n--;
    }
  }

  function capNhatHat(h, dt, trongLuc, dau) {
    for (var i = 0; i < h.count; i++) {
      if (h.life[i] <= 0) continue;
      h.life[i] -= dt * dau;
      h.vel[i * 3 + 1] -= dt * trongLuc;
      h.pos[i * 3] += h.vel[i * 3] * dt;
      h.pos[i * 3 + 1] += h.vel[i * 3 + 1] * dt;
      h.pos[i * 3 + 2] += h.vel[i * 3 + 2] * dt;
      if (h.life[i] <= 0) h.an(i);
    }
    h.capNhat();
  }

  function phat(h, p, vx, vy, vz, life) {
    for (var i = 0; i < h.count; i++) {
      if (h.life[i] > 0) continue;
      h.pos[i * 3] = p[0] + (Math.random() - 0.5) * 0.05;
      h.pos[i * 3 + 1] = p[1];
      h.pos[i * 3 + 2] = p[2] + (Math.random() - 0.5) * 0.05;
      h.vel[i * 3] = vx + (Math.random() - 0.5) * 0.08;
      h.vel[i * 3 + 1] = vy * (0.8 + Math.random() * 0.4);
      h.vel[i * 3 + 2] = vz + (Math.random() - 0.5) * 0.08;
      h.life[i] = life;
      return;
    }
  }

  function hinhAnh(dt, ctx) {
    var A = TX.anim, t = ctx.clock, m = S.m, k = kinhTe(m);
    var unTac = S.vd.indexOf('UN_TAC') >= 0, thieuDien = S.vd.indexOf('THIEU_DIEN') >= 0;
    var giam = S.giamT > 0 ? 0.35 : 1;

    /* nắp mặt đất: cần gạt xuống rồi nắp lún vào sàn */
    if (S.daKeo) {
      S.keoT += dt;
      o.can.rotation.x = A.damp(o.can.rotation.x, -0.6, 8, dt);
      if (S.keoT > 0.5) S.mo = Math.min(1, S.mo + dt / 1.6);
      var u = A.muot(S.mo);
      o.nap.position.y = -u * (YT + 0.1);
      o.nap.visible = S.mo < 1;
      if (S.mo >= 1 && o.napHop) {
        o.napHop.parent.remove(o.napHop); o.nhin.splice(o.nhin.indexOf(o.napHop), 1); o.napHop = null;
        o.canHop.parent.remove(o.canHop); o.nhin.splice(o.nhin.indexOf(o.canHop), 1); o.canHop = null;
      }
    }
    o.matNumCan.emissiveIntensity = S.nv === 1 ? 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 4)) + (S.chon === 'can' ? 0.6 : 0) : 0.1;
    o.nhanDuoi.forEach(function (b) { b.material.opacity = S.mo * 0.9; });

    /* nhà máy */
    var nMay = soMay();
    o.may.forEach(function (f, i) {
      f.hien = A.damp(f.hien, i < nMay ? 1 : 0, 6, dt);
      var s = Math.max(0.001, A.vot(f.hien, 1.4));
      f.g.scale.set(s, s, s);
      f.g.visible = f.ong.visible = f.hien > 0.02;
      f.ong.scale.y = Math.max(0.001, f.hien);
      f.rang.rotation.y += dt * (0.5 + m.sx / 30) * giam;
      f.matSang.emissiveIntensity = (0.4 + m.sx / 100) * giam;
      /* khói: nhiều khi chưa có luật môi trường */
      f.khoiT += dt * (0.3 + m.on / 12) * f.hien * giam;
      while (f.khoiT > 1) { f.khoiT -= 1; phat(o.khoi, f.dinh, 0.05, 0.35, 0.06, 1); }
    });
    capNhatHat(o.khoi, dt, -0.05, 0.28);

    /* nhà máy điện: tháp hiện theo năng lượng, lò xanh khi điện sạch */
    var nTh = soThap();
    o.thap.forEach(function (th, i) {
      th.hien = A.damp(th.hien, i < nTh ? 1 : 0, 6, dt);
      var s = Math.max(0.001, A.vot(th.hien, 1.4));
      th.m.scale.set(s, s, s);
      th.m.visible = th.hien > 0.02;
      if (th.hien > 0.5 && Math.random() < dt * 5) phat(o.hoi, th.dinh, 0, 0.3, 0, 0.8);
    });
    capNhatHat(o.hoi, dt, -0.03, 0.9);
    var mauLo = m.luat ? 0x3fd47a : 0xff7a20;
    o.matLo.emissive.lerp(new THREE.Color(mauLo), Math.min(1, dt * 2));
    o.matLo.color.copy(o.matLo.emissive);

    /* đoàn tàu */
    var nToa = kep(1 + Math.floor(m.gt / 25), 1, 5);
    var vTau = (0.4 + 1.3 * m.gt / 100) * (unTac ? 0.3 : 1);
    o.tauX += vTau * dt;
    var dai = X1 - X0 + nToa * 0.4;
    if (o.tauX > X1 + nToa * 0.4) o.tauX -= dai;
    o.toa_.forEach(function (tt, i) {
      var x = o.tauX - i * 0.4;
      tt.position.x = x;
      tt.visible = i < nToa && x > X0 + 0.25 && x < X1 - 0.25;
    });

    /* công nhân */
    var nCn = Math.round(1 + m.sx / 100 * 5);
    o.cn.forEach(function (c, i) {
      c.g.visible = i < nCn;
      c.pha += dt * c.toc * giam;
      c.g.position.set(c.x0 + Math.sin(c.pha) * 0.5, 0.04, c.z);
      c.g.rotation.y = Math.cos(c.pha) > 0 ? Math.PI / 2 : -Math.PI / 2;
    });

    /* nước chảy */
    o.texNuoc.offset.y -= dt * 0.8;

    /* xung điện */
    var nXung = Math.round(4 + m.nl / 100 * 26);
    for (var x = 0; x < o.xungD.length; x++) {
      var xd = o.xungD[x];
      if (x < nXung) {
        xd.u += dt * 0.35 * (thieuDien ? 0.5 : 1);
        if (xd.u > 1) { xd.u -= 1; xd.day = Math.floor(Math.random() * o.day.length); }
        diemTrenDuong(o.day[xd.day], xd.u, o.v);
        o.xung.pos[x * 3] = o.v.x; o.xung.pos[x * 3 + 1] = o.v.y; o.xung.pos[x * 3 + 2] = o.v.z;
      } else o.xung.pos[x * 3 + 1] = -99;
    }
    o.xung.capNhat();

    /* cửa sổ: sáng theo điện, chập chờn khi thiếu điện */
    var sang = kep(0.15 + m.nl / 100 * 0.8, 0.1, 1);
    if (thieuDien) sang *= 0.5 + 0.5 * (Math.sin(t * 13) > 0.2 ? 1 : 0.2);
    o.matNha.forEach(function (mn) { mn.emissiveIntensity = sang; });
    if (o.matDenThap) o.matDenThap.emissiveIntensity = Math.sin(t * 4) > 0 ? 1.5 : 0.1;

    capNhatToaNha(dt, false);

    /* xe */
    var nXe = 2 + Math.round(m.gt / 100 * 6);
    o.xe.forEach(function (xe, i) {
      xe.g.visible = i < nXe;
      if (!xe.g.visible) return;
      var vd = unTac ? 0.06 : 0.5 + (i % 3) * 0.12;
      xe.v = A.damp(xe.v, vd, 3, dt);
      xe.x += xe.chieu * xe.v * dt;
      if (xe.x > X1 - 0.15) xe.x = X0 + 0.15;
      if (xe.x < X0 + 0.15) xe.x = X1 - 0.15;
      xe.g.position.set(xe.x, YD, Z_DL + (xe.chieu > 0 ? 0.11 : -0.11));
      xe.g.rotation.y = xe.chieu > 0 ? 0 : Math.PI;
      xe.den.emissiveIntensity = unTac ? 1.4 : 0;
    });

    /* của cải chảy lên đều đặn theo kinh tế; tím chỉ khi có chính sách */
    S.vangT = (S.vangT || 0) + dt * (0.5 + k / 100 * 3.5) * giam;
    while (S.vangT > 1) { S.vangT -= 1; sinhDong(o.vang, nguonNgauNhien(), dinhNgauNhien()); }
    capNhatDong(o.vang, dt);
    capNhatDong(o.tim, dt);
    capNhatHat(o.tiaLua, dt, 3, 1);
    o.matTruc.emissiveIntensity = 0.3 + k / 100 * 0.8;

    /* khói mù */
    var mu = kep((m.on - 12) / 45, 0, 1);
    S.mu = A.damp(S.mu || 0, mu, 1.5, dt);
    o.mu.forEach(function (p) {
      p.material.opacity = S.mu * 0.32;
      p.visible = S.mu > 0.01;
      p.material.map.offset.x += dt * p.userData.toc;
    });

    /* biển báo vấn đề */
    Object.keys(o.bao).forEach(function (kk) {
      var b = o.bao[kk], co = S.vd.indexOf(kk) >= 0 && S.nv !== 'ket';
      b.material.opacity = A.damp(b.material.opacity, co ? 0.95 : 0, 6, dt);
      b.visible = b.material.opacity > 0.02;
      b.position.y = b.userData.y0 + Math.sin(t * 2.4) * 0.04;
      b.lookAt(ctx.camera.position);
    });
    o.bien.forEach(function (b) { b.lookAt(ctx.camera.position); });

    /* tia sáng nối hai tầng ở cảnh kết */
    if (S.ket) {
      S.sangTia = Math.min(1, S.sangTia + dt / 2.5);
      o.matTia.opacity = S.sangTia * (0.6 + 0.2 * Math.sin(t * 3));
      var dichs = [o.toaTT.thiChinh, o.toaTT.toaAn, o.toaTT.thapTH, o.toaTT.truong, o.toaTT.nhaHat];
      o.tiaNoi.forEach(function (tia, i) {
        var top = i < 5 ? YD + dichs[i].hien * dichs[i].d.hT + 0.3 : YD + 0.6;
        var h = (top - 0.1) * S.sangTia;
        tia.scale.y = Math.max(0.01, h);
        tia.position.y = 0.1 + h / 2;
      });
    }

    /* nút: nhấn xuống, sáng khi được nhìn, tối khi khoá */
    NUT.forEach(function (cd) {
      var n = o.nut[cd.id];
      n.an = Math.max(0, n.an - dt * 2.5);
      n.sang = Math.max(0, n.sang - dt * 2);
      n.nap.position.y = 0.035 - Math.sin(Math.min(1, n.an) * Math.PI) * 0.03;
      var mo = nutMo(cd.id) && !S.luot;
      var dich = !mo ? 0.02 : (S.chon === cd.id ? 1.1 : 0.3 + 0.2 * Math.sin(t * 3 + cd.x)) + n.sang;
      n.matNum.emissiveIntensity = A.damp(n.matNum.emissiveIntensity, dich, 10, dt);
      n.matNum.color.setHex(nutMo(cd.id) ? cd.mau : 0x4a5058);
    });
    veNhanNut(ctx);

    /* bảng hiển thị đuổi theo mô hình */
    var c = chup(S.m);
    for (var kk in c) S.hien[kk] = A.damp(S.hien[kk], c[kk], 4, dt);

    if (o.nen) o.nen.set(0.08 + m.sx / 100 * 0.3 * giam);
  }

  /* ═══════════ ánh nhìn ═══════════ */

  function nhinVao(dt, ctx) {
    var P = ctx.player, id = null, chon = null;
    if (!F && !ctx.hud.theDangMo() && !ctx.hud.soTayDangMo()) {
      if (P.lockBroken) o.diemNhin.set(P.chuot.x / innerWidth * 2 - 1, -(P.chuot.y / innerHeight) * 2 + 1);
      else o.diemNhin.set(0, 0);
      o.tia.setFromCamera(o.diemNhin, ctx.camera);
      o.tia.far = 14;
      var trung = o.tia.intersectObjects(o.nhin, false);
      for (var i = 0; i < trung.length; i++) {
        var u = trung[i].object.userData;
        if (u.duoi && S.mo < 1) continue;
        if (u.chan) break;
        if (u.can) { if (S.nv === 1 && trung[i].distance < TAM_NUT + 0.4) chon = 'can'; break; }
        if (u.nut) { if (trung[i].distance < TAM_NUT) chon = u.nut; break; }
        id = u.nhin;
        break;
      }
    }
    S.chon = chon;
    if (id !== S.nhamId) { S.nhamId = id; S.nhamT = 0; }
    else S.nhamT += dt;
    ctx.hud.nhinChuGiai(id && S.nhamT >= NHIN_TRE ? ctx.text.chuGiai[id] : null);
  }

  /* ═══════════ HUD ═══════════ */

  function hud(ctx) {
    var T = ctx.text, G = T.goiY, H = S.hien;
    var dp = DIEM_DICH;

    el.P.textContent = Math.round(H.d);
    el.P.style.color = H.d >= dp ? '#1e7a46' : '';
    var tt = S.ket ? 'XONG' : S.vd.length ? 'VAN_DE' : (Math.abs(H.kt - H.tt) <= 10 && H.d >= 50) ? 'CAN' : H.d >= 35 ? 'LON' : 'NHO';
    el.S.textContent = T.trangThai[tt];
    el.S.style.color = { VAN_DE: '#c8352a', XONG: '#1e7a46', CAN: '#1e7a46' }[tt] || '';
    el.L.textContent = S.soLuot;

    ['sx', 'gt', 'nl', 'kt', 'tc', 'gd', 'vh', 'tt', 'on'].forEach(function (kk) {
      el[kk].textContent = Math.round(H[kk]);
      el[kk + 'B'].style.width = H[kk] + '%';
      var d = Math.round(S.m[kk] !== undefined ? S.m[kk] - S.truoc[kk] : (kk === 'kt' ? kinhTe(S.m) : thuongTang(S.m)) - S.truoc[kk]);
      var tot = kk === 'on' ? d < 0 : d > 0;
      el[kk + 'D'].textContent = d ? (d > 0 ? '▲' : '▼') + Math.abs(d) : '';
      el[kk + 'D'].style.color = tot ? '#1e7a46' : '#c8352a';
      el[kk + 'D'].style.opacity = S.deltaT > 0 ? Math.min(1, S.deltaT) : 0;
    });
    el.C.innerHTML = S.chuoi;
    el.W.innerHTML = S.vd.map(function (v) { return '⚠ ' + T.vanDe[v].mo; }).join('<br>');

    capNhatONhiemVu(ctx);

    var hienPanel = !F && !S.daThe && S.nv !== 1;
    ctx.hud.hienPanel(hienPanel);
    ctx.hud.ngam(!!S.chon);

    var lock = ctx.player.lockBroken, goiY;
    if (S.ket) goiY = G.ket;
    else if (S.luot) goiY = G.dangLuot;
    else if (S.chon === 'can') goiY = lock ? G.canDP : G.can;
    else if (S.chon && S.khoaT > 0) goiY = S.nv === 3 ? G.khoaCS : G.khoa;
    else if (S.chon === 'cs' && nutMo('cs')) goiY = (lock ? G.nutCSDP : G.nutCS).replace('%s', T.chinhSach[S.cs].ten);
    else if (S.chon && nutMo(S.chon)) goiY = (lock ? G.nutDP : G.nut).replace('%s', S.chon === 'nl' && S.m.luat ? T.nlSach : T.nut[S.chon].ten);
    else if (S.chon) goiY = S.nv === 3 ? G.khoaCS : G.khoa;
    else if (S.nv === 1) goiY = G.nv1;
    else if (S.nv === 2) goiY = G.nv2;
    else if (S.nv === 3) goiY = G.nv3;
    else if (S.nv === 4) goiY = G.nv4;
    else goiY = '';
    ctx.hud.goiY(goiY);
    ctx.hud.hienGoiY(!F && !S.daThe && !!goiY);
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    /* đang đọc thẻ hay sổ tay thì thành phố đứng hình */
    var chay = S.batDau && !ctx.hud.theDangMo() && !ctx.hud.soTayDangMo();
    if (chay) {
      nhinVao(dt, ctx);
      if (F) { S.tdTruoc = ctx.player.action(); capNhatLuot(dt, ctx); if (S.giamT > 0) S.giamT -= dt; }
      else logic(dt, ctx);
      capNhatPhim(dt, ctx);
    }
    hinhAnh(chay ? dt : 0, ctx);
    hud(ctx);
  }

  function dispose(ctx) {
    if (el && el.nv && el.nv.parentNode) el.nv.parentNode.removeChild(el.nv);
    if (o && o.nen) o.nen.stop();
    if (ctx) ctx.khoaCamera = false;
    document.body.classList.remove('lc-phim');
    S = o = el = F = null;
  }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'ha-tang',
    tieuDe: 'Hạ tầng · Thượng tầng',
    nhanNgan: 'Tầng III · Chương 3',
    moTa: 'Một thành phố trên nền móng. Xây ở dưới, xem phía trên lớn lên, rồi xem nó tác động ngược.',
    goiY: {
      khoa:    'Nhìn vào một nút, bấm <kbd>Chuột trái</kbd>',
      duPhong: 'Nhìn vào một nút, bấm <kbd>F</kbd>'
    },
    build: build,
    onEnter: onEnter,
    update: update,
    dispose: dispose
  });

})(window.TX);
