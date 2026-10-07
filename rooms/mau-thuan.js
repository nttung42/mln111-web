/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — NHÀ MÁY: HAI PHÍA CỦA DÂY CHUYỀN
   Quy luật thống nhất và đấu tranh của các mặt đối lập
   (Giáo trình, Chương 2, mục 2.2.2)

   Một vòng lặp duy nhất:
     chỉnh cần gạt → nhà máy phản ứng → mâu thuẫn bộc lộ
     → hệ thống mất cân bằng → chỉnh lại → tìm cách vận hành phát triển

   Bố cục (nhìn từ chỗ người chơi xuất hiện, mặt hướng về -z):
     · giữa phòng   dây chuyền 1 chạy từ trái (kho) sang phải (thành phẩm),
                    bốn công nhân đứng máy phía sau băng chuyền
     · cuối phòng   phòng kính ban quản lý trên cao, bảng chỉ tiêu;
                    bên dưới là dây chuyền 2 còn phủ bạt
     · trước mặt    bàn điều khiển với ba cần gạt
     · góc trái     góc nghỉ và lối ra (công nhân bỏ việc đi ra đây)

   Mô hình: ba cần gạt (tốc độ, nghỉ, lương) đặt "đích" cho sức khoẻ và
   tinh thần; hai chỉ số này đuổi theo đích chậm (~6 s) — nhà máy cần
   thời gian để phản ứng. Sản lượng phụ thuộc vào cả tốc độ lẫn sức của
   công nhân, nên ép công nhân thì về sau chính sản lượng cũng tụt. Lợi
   nhuận lấy sản lượng trừ lương.

   Không có "nút đúng": điểm giữa 50/50/50 chưa đủ ổn định (xem NGUONG).
   Phía nào bị ép quá lâu thì nhà máy rơi vào khủng hoảng và dừng hẳn.

   Lưu ý học thuật: kết thúc KHÔNG phải là điều hoà mâu thuẫn. Hai phía
   vẫn tự đòi (yêu sách) cả khi đã ổn định; thẻ bài học nói rõ thống
   nhất là tạm thời, đấu tranh là tuyệt đối, và mô hình này đơn giản
   hoá mâu thuẫn đối kháng giữa lao động và tư bản.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var K = TX.KICH_THUOC;

  /* ---------- bố cục (m) ---------- */
  var Z_DC = -1.6, Y_DC = 0.84;              // dây chuyền 1: trục và mặt băng
  var X_DAU = -4.9, X_CUOI = 5.1;
  var X_MAY = [-3.3, -1.1, 1.1, 3.3];        // bốn trạm máy
  var Z_CN = -2.45;                          // chỗ công nhân đứng: sau băng, giữa hai máy
  var LECH_CN = 1.05;                        // đứng lệch sang phải máy của mình chừng này
  var Z_DC2 = -4.3, Z_CN2 = -5.0;            // dây chuyền 2
  var X_DAU2 = -3.2, X_CUOI2 = 3.2, X_MAY2 = [-1.2, 1.2];
  var Y_PK = 2.7, Z_PK = -5.55;              // sàn và mặt kính phòng quản lý
  var Z_BAN = 1.9;                           // bàn điều khiển
  var NGHIENG = 0.35;                        // độ dốc mặt bàn
  var X_HL = -5.6;                           // hành lang dọc tường trái
  var CUA = [-7.35, 0.6];                    // lối ra
  var GHE = [[-6.6, 2.85], [-6.6, 3.7]];     // chỗ ngồi ở góc nghỉ
  var DEN = [5.75, -0.35];                   // tháp đèn báo
  var PALLET = [6.4, -1.6];

  var CAN = [
    { id: 'toc',   x: -0.85, mau: 0x4f86d9 },   // lạnh: nghiêng về ban quản lý
    { id: 'nghi',  x:  0.0,  mau: 0xe8823a },   // ấm: nghiêng về công nhân
    { id: 'luong', x:  0.85, mau: 0xe2b33c }
  ];

  /* ---------- nhịp chơi ---------- */
  var NGUONG     = 72;    // cả bốn chỉ số từ mức này trở lên mới tính là ổn định
  var GIU_CAN    = 8;     // giữ ổn định chừng ấy giây thì nhà máy bước sang nấc mới
  var TAU        = 6;     // giây — sức khoẻ, tinh thần đuổi theo đích chậm cỡ này
  var TOC_CAN    = 0.38;  // cần gạt đi được bấy nhiêu mỗi giây khi giữ chuột
  var BAT_ON_MAX = 5;     // bị ép quá mức liên tục chừng ấy giây thì vỡ
  var TAM_CAN    = 3.2;   // nhìn cần gạt trong tầm này mới gạt được
  var NHIN_TRE   = 0.35;

  var MAU_QL = '#3f6fb5', MAU_CN = '#d77a2c';

  var S, o, el;

  /* ═══════════ mô hình ═══════════ */

  function kep(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function dichSuc(c)       { return kep(100 * (1.05 - 0.95 * c.toc + 0.5 * c.nghi), 5, 100); }
  function dichTinh(c, suc) { return kep(100 * (0.2 + 0.7 * c.luong + 0.3 * c.nghi) - 0.4 * Math.max(0, 60 - suc), 3, 100); }
  /* công nhân yếu hoặc chán thì làm chậm, máy hay lỗi */
  function hieuSuat(suc, tinh) { return 0.5 + 0.5 * kep((Math.min(suc, tinh) - 15) / 45, 0, 1); }
  function slTu(c, suc, tinh) {
    return kep(100 * (0.3 + 0.7 * c.toc) * (1 - 0.5 * c.nghi) * 1.6 * hieuSuat(suc, tinh), 0, 100);
  }
  function lnTu(c, sl) { return kep(100 * (0.25 + 0.9 * sl / 100 - 0.4 * c.luong), 0, 100); }

  /* chỉ số thấp nhất, làm tròn đúng như con số người chơi thấy trên bảng */
  function thapNhat() {
    return Math.min(Math.round(S.sl), Math.round(S.ln), Math.round(S.suc), Math.round(S.tinh));
  }

  /* nhà máy sẽ dừng ở đâu nếu giữ nguyên cần gạt đủ lâu */
  function diemDung(c) {
    var s = dichSuc(c), t = dichTinh(c, s), sl = slTu(c, s, t);
    return { suc: s, tinh: t, sl: sl, ln: lnTu(c, sl) };
  }

  /* ═══════════ tiện ích dựng hình ═══════════ */

  function mat(mau, them) {
    var p = { color: mau, roughness: 0.75, metalness: 0.05, flatShading: true };
    if (them) for (var k in them) p[k] = them[k];
    return new THREE.MeshStandardMaterial(p);
  }

  function hop(w, h, d, m) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); }

  function dat(g, mesh, x, y, z, bong) {
    mesh.position.set(x, y, z);
    if (bong !== false) { mesh.castShadow = true; mesh.receiveShadow = true; }
    g.add(mesh);
    return mesh;
  }

  var SANS = '"Be Vietnam Pro", "Segoe UI", sans-serif';
  function fSans(co, dam) { return (dam || 600) + ' ' + co + 'px ' + SANS; }

  /* Chữ vẽ bằng canvas lên một tấm phẳng.
     dong: [[chữ, font, màu, y, giãn chữ], ...] — y tính theo pixel canvas. */
  function bang(cw, ch, rong, dong, nen) {
    var c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    var g = c.getContext('2d');
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
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    return new THREE.Mesh(
      new THREE.PlaneGeometry(rong, rong * ch / cw),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
  }

  function nenBien(mau, vien) {
    return function (g, w, h) {
      g.fillStyle = mau;
      g.fillRect(0, 0, w, h);
      if (vien) {
        g.strokeStyle = vien;
        g.lineWidth = 8;
        g.strokeRect(4, 4, w - 8, h - 8);
      }
    };
  }

  /* hộp ẩn để bắt ánh nhìn: chú giải (nhin) hoặc cần gạt (can) */
  function vungNhin(g, w, h, d, x, y, z, du) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial());
    m.visible = false;                 // r128: tia vẫn trúng vật ẩn
    m.position.set(x, y, z);
    for (var k in du) m.userData[k] = du[k];
    g.add(m);
    o.nhin.push(m);
    return m;
  }

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    var c0 = { toc: 0.95, nghi: 0.05, luong: 0.2 };   // ban quản lý vừa cho chạy hết công suất
    var suc0 = 66, tinh0 = 58, sl0 = slTu(c0, suc0, tinh0);

    S = {
      can: c0,
      suc: suc0, tinh: tinh0, sl: sl0, ln: lnTu(c0, sl0),
      batOn: 0,
      khung: null, khungT: 0, soKhung: 0,
      chayLaiT: 0,
      giu: 0,
      ket: false, ketT: 0, daNhay: false, daThe: false,
      chon: null,
      nhamId: null, nhamT: 0,
      ysT: 15, ysChu: null, ysChuT: 0,
      vBang: 0, sinh: 0, tp: 0,
      boT: 0, veT: 0, soBo: 0,
      lichSu: [], lichSuT: 0, kpiT: 0,
      batDau: false,     // nhà máy chỉ chạy sau khi đọc xong thẻ mở đầu
      do: 0              // mức nhuộm đỏ khi khủng hoảng
    };
    o = {
      nhin: [], tia: new THREE.Raycaster(), diemNhin: new THREE.Vector2(),
      can: {}, may: [], hang: [], hang2: [], cn: [], ql: [], chanHop: []
    };

    var g = ctx.scene;

    /* không khí nhà xưởng: sương xám thép, nhìn xa vẫn rõ */
    o.mauSuong = new THREE.Color(0xc9cdd1);
    o.mauDo = new THREE.Color(0x9a5450);
    ctx.moiTruong.suong.color.copy(o.mauSuong);
    ctx.moiTruong.suong.density = 0.016;
    ctx.moiTruong.nen.copy(o.mauSuong);

    dungVo(g);
    dungAnhSang(g);
    dungDayChuyen(g);
    dungKho(g);
    dungThanhPham(g);
    dungPhongKinh(g);
    dungDayChuyen2(g);
    dungGocNghi(g);
    dungDenBao(g);
    dungBanDieuKhien(g, ctx);
    dungCongNhan(g);
    dungPanel(ctx);

    o.tiaLua = TX.heHat(g, 90, 0xffb340, 0.06, 0.95);

    /* vật cản: hình chữ nhật [x0, x1, z0, z1] và hình tròn */
    o.chanHop = [
      [X_DAU - 0.4, X_CUOI + 0.1, Z_DC - 0.5, Z_DC + 0.5],
      [X_CUOI, PALLET[0] + 0.65, Z_DC - 0.6, Z_DC + 0.6],
      [X_DAU2 - 0.3, X_CUOI2 + 0.3, Z_DC2 - 0.7, Z_DC2 + 0.7],
      [-7.6, -6.4, -6.9, -3.3],
      [-1.5, 1.5, Z_BAN - 0.42, Z_BAN + 0.42],
      [-7.6, -6.25, 2.3, 4.3]
    ];
    ctx.player.blockers = [
      { x: 3.25, z: -5.65, r: 0.35 }, { x: -3.25, z: -5.65, r: 0.35 },
      { x: DEN[0], z: DEN[1], r: 0.35 }, { x: 5.65, z: -2.85, r: 0.5 },
      { x: -7.0, z: 4.85, r: 0.4 }
    ];
    ctx.player.constrain = chanNguoiChoi;
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

  /* ---------- 1. vỏ nhà xưởng ---------- */

  function texSan() {
    var c = document.createElement('canvas');
    c.width = c.height = 1024;
    var g = c.getContext('2d');
    var px = 1024 / K.w;
    function P(x, z) { return [(x + K.w / 2) * px, (z + K.d / 2) * px]; }
    function chuNhat(x0, x1, z0, z1) { var a = P(x0, z0), b = P(x1, z1); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }

    g.fillStyle = '#a7aaab';
    g.fillRect(0, 0, 1024, 1024);
    /* bê tông: vết loang sáng tối */
    for (var i = 0; i < 260; i++) {
      var x = Math.random() * 1024, y = Math.random() * 1024, r = 20 + Math.random() * 90;
      var v = g.createRadialGradient(x, y, 0, x, y, r);
      var mau = i % 2 ? '70,74,78' : '255,255,255';
      v.addColorStop(0, 'rgba(' + mau + ',' + (i % 2 ? 0.07 : 0.05) + ')');
      v.addColorStop(1, 'rgba(' + mau + ',0)');
      g.fillStyle = v;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    /* khe co giãn mỗi 2,5 m */
    g.strokeStyle = 'rgba(55,58,62,.35)';
    g.lineWidth = 2;
    for (var k = 1; k < 6; k++) {
      var p = k * 2.5 * px;
      g.beginPath(); g.moveTo(p, 0); g.lineTo(p, 1024); g.stroke();
      g.beginPath(); g.moveTo(0, p); g.lineTo(1024, p); g.stroke();
    }
    /* vạch vàng an toàn quanh hai dây chuyền */
    g.strokeStyle = '#e0ae2a';
    g.lineWidth = 7;
    g.strokeRect.apply(g, chuNhat(-5.3, 5.55, -2.95, -0.3));
    g.strokeRect.apply(g, chuNhat(-3.7, 3.7, -5.45, -3.55));
    /* hành lang đi bộ: hai mép đứt nét trắng */
    g.strokeStyle = 'rgba(245,245,240,.8)';
    g.lineWidth = 4;
    g.setLineDash([22, 16]);
    [-6.05, -5.15].forEach(function (xx) {
      var a = P(xx, -6.2), b = P(xx, 5.2);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    });
    g.setLineDash([]);
    /* vùng bàn điều khiển và góc nghỉ */
    g.fillStyle = 'rgba(63,111,181,.18)';
    g.fillRect.apply(g, chuNhat(-1.9, 1.9, 1.25, 3.1));
    g.fillStyle = 'rgba(215,122,44,.16)';
    g.fillRect.apply(g, chuNhat(-7.5, -5.95, 2.0, 5.3));
    /* chữ sơn dưới sàn */
    g.fillStyle = 'rgba(40,62,104,.55)';
    g.font = fSans(22, 700);
    g.textAlign = 'center';
    var q = P(0, 3.0);
    g.fillText('BÀN ĐIỀU KHIỂN', q[0], q[1] - 6);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 8;
    return tex;
  }

  function texTuong() {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 356;
    var g = c.getContext('2d');
    var chan = Math.round(356 * 1.3 / K.h);
    /* tôn sóng: sọc đứng sáng tối xen kẽ */
    for (var x = 0; x < 1024; x += 16) {
      var grd = g.createLinearGradient(x, 0, x + 16, 0);
      grd.addColorStop(0, '#aeb5bb');
      grd.addColorStop(0.5, '#c7cdd2');
      grd.addColorStop(1, '#a9b0b6');
      g.fillStyle = grd;
      g.fillRect(x, 0, 16, 356 - chan);
    }
    /* chân tường bê tông */
    g.fillStyle = '#8c9094';
    g.fillRect(0, 356 - chan, 1024, chan);
    /* dải vàng đen */
    var y0 = 356 - chan - 8;
    g.save();
    g.beginPath(); g.rect(0, y0, 1024, 10); g.clip();
    for (var s = -20, n = 0; s < 1044; s += 20, n++) {
      g.fillStyle = n % 2 ? '#2b2b2b' : '#e2b12c';
      g.beginPath();
      g.moveTo(s, y0 + 10); g.lineTo(s + 10, y0); g.lineTo(s + 30, y0); g.lineTo(s + 20, y0 + 10);
      g.fill();
    }
    g.restore();
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function dungVo(g) {
    var san = new THREE.Mesh(
      new THREE.PlaneGeometry(K.w, K.d),
      new THREE.MeshStandardMaterial({ map: texSan(), roughness: 0.92, metalness: 0.02 })
    );
    san.rotation.x = -Math.PI / 2;
    san.receiveShadow = true;
    g.add(san);

    var matTuong = new THREE.MeshStandardMaterial({ map: texTuong(), roughness: 0.7, metalness: 0.15, side: THREE.DoubleSide });
    [[0, -K.d / 2, 0], [0, K.d / 2, Math.PI], [-K.w / 2, 0, Math.PI / 2], [K.w / 2, 0, -Math.PI / 2]].forEach(function (d) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(K.w, K.h), matTuong);
      m.position.set(d[0], K.h / 2, d[1]);
      m.rotation.y = d[2];
      m.receiveShadow = true;
      g.add(m);
    });

    var tran = new THREE.Mesh(new THREE.PlaneGeometry(K.w, K.d), new THREE.MeshStandardMaterial({ color: 0x5c6268, roughness: 0.9 }));
    tran.rotation.x = Math.PI / 2;
    tran.position.y = K.h;
    g.add(tran);

    /* giàn thép mái và cửa trời */
    var matDam = mat(0x4a5560, { metalness: 0.4, roughness: 0.55 });
    [-5, -2.5, 0, 2.5, 5].forEach(function (z) {
      dat(g, hop(K.w, 0.2, 0.14, matDam), 0, K.h - 0.32, z, false);
    });
    [-5, 0, 5].forEach(function (x) {
      dat(g, hop(0.12, 0.14, K.d, matDam), x, K.h - 0.16, 0, false);
    });
    var matTroi = new THREE.MeshBasicMaterial({ color: 0xeef5fb });
    [-3.75, 1.25].forEach(function (z) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(K.w - 1, 0.9), matTroi);
      m.rotation.x = Math.PI / 2;
      m.position.set(0, K.h - 0.01, z);
      g.add(m);
    });

    /* đèn treo nhà xưởng */
    var matChao = mat(0x3c4248, { side: THREE.DoubleSide, metalness: 0.5, roughness: 0.4 });
    var matBong = new THREE.MeshBasicMaterial({ color: 0xfff4dc });
    [[-3.5, -2.6], [3.5, -2.6], [-3.5, 2.4], [3.5, 2.4], [0, 0]].forEach(function (p) {
      var chao = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.4, 0.3, 8, 1, true), matChao);
      chao.position.set(p[0], 4.3, p[1]);
      g.add(chao);
      var bong = new THREE.Mesh(new THREE.CircleGeometry(0.36, 8), matBong);
      bong.rotation.x = Math.PI / 2;
      bong.position.set(p[0], 4.16, p[1]);
      g.add(bong);
      dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.75, 4), matChao), p[0], 4.82, p[1], false);
    });

    /* biển tên phòng sơn trên tường phải */
    var ten = bang(1024, 300, 4.2, [
      ['NHÀ MÁY', fSans(118, 800), '#2c3a4c', 140, '18px'],
      ['Phòng II · Hai phía của dây chuyền', fSans(46, 500), '#4b5a6c', 228]
    ]);
    ten.position.set(K.w / 2 - 0.03, 3.45, 1.6);
    ten.rotation.y = -Math.PI / 2;
    g.add(ten);

    /* lối ra trên tường trái — công nhân bỏ việc đi ra đây */
    var matKhung = mat(0x3e4a44, { metalness: 0.3 });
    [-0.62, 0.62].forEach(function (dz) {
      dat(g, hop(0.12, 2.3, 0.1, matKhung), -K.w / 2 + 0.05, 1.15, CUA[1] + dz, false);
    });
    dat(g, hop(0.12, 0.1, 1.34, matKhung), -K.w / 2 + 0.05, 2.32, CUA[1], false);
    dat(g, hop(0.04, 2.2, 1.14, mat(0x5d7a68)), -K.w / 2 + 0.02, 1.1, CUA[1], false);
    var loiRa = bang(512, 128, 0.9, [['LỐI RA', fSans(64, 800), '#ffffff', 88, '6px']], nenBien('#2e8b57'));
    loiRa.position.set(-K.w / 2 + 0.09, 2.62, CUA[1]);
    loiRa.rotation.y = Math.PI / 2;
    g.add(loiRa);
  }

  /* ---------- 2. ánh sáng ---------- */

  function dungAnhSang(g) {
    g.add(new THREE.HemisphereLight(0xe9eff6, 0x6c655c, 0.72));
    g.add(new THREE.AmbientLight(0xffffff, 0.12));

    var nang = new THREE.DirectionalLight(0xfff3e2, 0.75);
    nang.position.set(4, 9, 5);
    nang.target.position.set(0, 0, -1.5);
    nang.castShadow = true;
    nang.shadow.mapSize.set(2048, 2048);
    var sc = nang.shadow.camera;
    sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9; sc.near = 1; sc.far = 25;
    nang.shadow.bias = -0.0008;
    g.add(nang, nang.target);

    /* ánh ấm trên khu công nhân */
    o.denCN = new THREE.PointLight(0xffc489, 0.55, 10, 2);
    o.denCN.position.set(0, 3.4, -2.8);
    g.add(o.denCN);

    /* đèn báo động: đỏ, chỉ bật khi khủng hoảng */
    o.denDo = new THREE.PointLight(0xff3020, 0, 16, 1.6);
    o.denDo.position.set(0, 4.0, -1.5);
    g.add(o.denDo);
  }

  /* ---------- 3. dây chuyền 1 ---------- */

  function texBang() {
    var c = document.createElement('canvas');
    c.width = 128; c.height = 64;
    var g = c.getContext('2d');
    g.fillStyle = '#2f3337';
    g.fillRect(0, 0, 128, 64);
    g.fillStyle = '#3d4247';
    for (var x = 0; x < 128; x += 32) g.fillRect(x, 0, 14, 64);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  /* băng chuyền dùng chung cho hai dây chuyền; trả về texture để cuộn */
  function bangChuyen(g, x0, x1, z) {
    var dai = x1 - x0, xm = (x0 + x1) / 2;
    var matKhung = mat(0x55606b, { metalness: 0.45, roughness: 0.5 });
    var matChan = mat(0x3d454d, { metalness: 0.4 });
    [-1, 1].forEach(function (s) {
      dat(g, hop(dai, 0.16, 0.06, matKhung), xm, Y_DC - 0.06, z + s * 0.36);
    });
    for (var x = x0 + 0.3; x < x1; x += 1.6) {
      [-1, 1].forEach(function (s) { dat(g, hop(0.07, Y_DC - 0.1, 0.07, matChan), x, (Y_DC - 0.1) / 2, z + s * 0.32); });
    }
    var tex = texBang();
    tex.repeat.set(dai / 0.5, 1);
    var mBang = new THREE.Mesh(new THREE.PlaneGeometry(dai, 0.66), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }));
    mBang.rotation.x = -Math.PI / 2;
    mBang.position.set(xm, Y_DC, z);
    mBang.receiveShadow = true;
    g.add(mBang);
    [x0, x1].forEach(function (x) {
      var lo = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 10), matKhung);
      lo.rotation.x = Math.PI / 2;
      dat(g, lo, x, Y_DC - 0.07, z);
    });
    return tex;
  }

  /* một trạm máy: khung hầm ôm lấy băng, piston dập, bánh răng, đèn trạng thái */
  function mayDap(g, x, z, mauThan) {
    var matThan = mat(mauThan, { metalness: 0.35, roughness: 0.5 });
    var matToi = mat(0x2d3237, { metalness: 0.5, roughness: 0.4 });
    var dinh = Y_DC + 0.5;                     // nóc máy thấp, để thấy người đứng sau
    [-1, 1].forEach(function (s) { dat(g, hop(0.8, dinh, 0.1, matThan), x, dinh / 2, z + s * 0.43); });
    dat(g, hop(0.86, 0.22, 0.96, matThan), x, dinh, z);
    var piston = dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8), mat(0xc9ced3, { metalness: 0.7, roughness: 0.3 })), x, Y_DC + 0.3, z);
    var matDen = new THREE.MeshStandardMaterial({ color: 0x2bd46a, emissive: 0x2bd46a, emissiveIntensity: 1.2 });
    dat(g, new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 6), matDen), x + 0.3, dinh + 0.16, z + 0.3, false);
    var rang = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.06, 10), matToi);
    rang.rotation.x = Math.PI / 2;
    dat(g, rang, x - 0.2, dinh, z + 0.5);
    return { x: x, z: z, piston: piston, matDen: matDen, rang: rang, pha: Math.random() * 6 };
  }

  function dungDayChuyen(g) {
    o.texBang = bangChuyen(g, X_DAU, X_CUOI, Z_DC);
    o.may = X_MAY.map(function (x) { return mayDap(g, x, Z_DC, 0x4d7fa8); });

    /* phễu nạp phôi ở đầu băng */
    dat(g, hop(0.5, 0.5, 0.75, mat(0x6b7682, { metalness: 0.4 })), X_DAU - 0.12, Y_DC + 0.35, Z_DC);

    /* biển "DÂY CHUYỀN 1" trên máy đầu tiên */
    var b = bang(512, 128, 0.72, [['DÂY CHUYỀN 1', fSans(54, 800), '#ffffff', 84, '4px']], nenBien('#2c3a4c'));
    b.position.set(X_DAU + 0.75, Y_DC - 0.3, Z_DC + 0.4);
    g.add(b);

    /* hàng chạy trên băng — một kho cố định, dùng lại, không tạo mới */
    var geoPhoi = new THREE.BoxGeometry(0.28, 0.2, 0.28);
    var geoThung = new THREE.BoxGeometry(0.36, 0.3, 0.36);
    o.geoPhoi = geoPhoi;
    o.geoThung = geoThung;
    o.matPhoi = mat(0x8a96a3, { metalness: 0.5, roughness: 0.4 });
    o.matThung = mat(0xc29a62);
    o.matLoi = mat(0xb5523f);
    for (var i = 0; i < 26; i++) {
      var m = new THREE.Mesh(geoPhoi, o.matPhoi);
      m.castShadow = true;
      m.visible = false;
      g.add(m);
      o.hang.push({ m: m, x: 0, on: false, loi: false });
    }

    vungNhin(g, X_CUOI - X_DAU, 1.5, 1.05, (X_DAU + X_CUOI) / 2, 0.75, Z_DC, { nhin: 'dayChuyen' });
  }

  /* ---------- 4. kho nguyên liệu (tường trái, cuối phòng) ---------- */

  function dungKho(g) {
    var matTru = mat(0xd9822b, { metalness: 0.3 });
    var matDam = mat(0x2f5f9e, { metalness: 0.3 });
    var x = -7.0;
    [-6.8, -5.1, -3.4].forEach(function (z) {
      [-0.38, 0.38].forEach(function (dx) { dat(g, hop(0.08, 3.4, 0.08, matTru), x + dx, 1.7, z); });
    });
    var matThung = [mat(0x8a96a3, { metalness: 0.45 }), mat(0x9aa4ad, { metalness: 0.45 }), mat(0x7d8994, { metalness: 0.45 })];
    [0.1, 1.2, 2.3].forEach(function (y, tang) {
      dat(g, hop(0.85, 0.06, 3.5, matDam), x, y + 0.05, -5.1);
      var n = 0;
      for (var z = -6.55; z < -3.6; z += 0.55, n++) {
        if ((n + tang * 2) % 5 === 3) continue;          // vài ô trống cho tự nhiên
        dat(g, hop(0.5, 0.42, 0.42, matThung[(tang + n) % 3]), x, y + 0.29, z);
        if (tang === 0 && n % 2) dat(g, hop(0.42, 0.36, 0.42, matThung[1]), x, y + 0.7, z);
      }
    });
    var b = bang(512, 128, 1.6, [['KHO NGUYÊN LIỆU', fSans(52, 800), '#ffffff', 84, '4px']], nenBien('#2f5f9e'));
    b.position.set(-6.35, 3.75, -5.1);
    b.rotation.y = Math.PI / 2;
    g.add(b);
    vungNhin(g, 1.0, 3.4, 3.6, x, 1.7, -5.1, { nhin: 'kho' });
  }

  /* ---------- 5. thành phẩm (cuối băng, bên phải) ---------- */

  function dungThanhPham(g) {
    var matGo = mat(0x9a7448);
    /* máng trượt từ cuối băng xuống pallet */
    var mang = dat(g, hop(0.9, 0.05, 0.6, mat(0x55606b, { metalness: 0.45 })), X_CUOI + 0.45, Y_DC - 0.2, Z_DC);
    mang.rotation.z = -0.4;
    dat(g, hop(1.15, 0.14, 1.15, matGo), PALLET[0], 0.07, PALLET[1]);
    o.pallet = [];
    var geo = new THREE.BoxGeometry(0.34, 0.3, 0.34);
    for (var t = 0; t < 3; t++) for (var a = 0; a < 3; a++) for (var b = 0; b < 2; b++) {
      var m = dat(g, new THREE.Mesh(geo, o.matThung), PALLET[0] - 0.36 + a * 0.36, 0.3 + t * 0.31, PALLET[1] - 0.18 + b * 0.36);
      m.visible = false;
      o.pallet.push(m);
    }
    /* thùng phế phẩm */
    dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.7, 10, 1, true), mat(0xa8433a, { side: THREE.DoubleSide })), 5.65, 0.35, -2.85);
    var bl = bang(512, 128, 0.8, [['PHẾ PHẨM', fSans(56, 800), '#ffffff', 86, '4px']], nenBien('#a8433a'));
    bl.position.set(5.65, 0.86, -2.42);
    g.add(bl);

    var bt = bang(512, 128, 1.4, [['THÀNH PHẨM', fSans(56, 800), '#ffffff', 86, '4px']], nenBien('#2e8b57'));
    bt.position.set(PALLET[0], 2.7, PALLET[1]);
    g.add(bt);
    var matDay = mat(0x3c4248);
    [-0.5, 0.5].forEach(function (dx) {
      dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 2.0, 4), matDay), PALLET[0] + dx, 3.9, PALLET[1], false);
    });
    vungNhin(g, 1.3, 1.4, 1.3, PALLET[0], 0.7, PALLET[1], { nhin: 'thanhPham' });
  }

  /* ---------- 6. phòng kính ban quản lý ---------- */

  function dungPhongKinh(g) {
    var matThep = mat(0x47525d, { metalness: 0.5, roughness: 0.45 });
    var dz = (K.d / 2 + Z_PK) / 2;   // nửa chiều sâu phòng kính
    var zm = Z_PK - dz;

    /* sàn treo và cột đỡ sơn vàng */
    dat(g, hop(6.7, 0.18, dz * 2, mat(0xd4d8dc, { roughness: 0.6 })), 0, Y_PK - 0.09, zm);
    dat(g, hop(6.8, 0.22, 0.1, mat(0xe0ae2a)), 0, Y_PK - 0.12, Z_PK + 0.02);
    [-3.25, 3.25].forEach(function (x) { dat(g, hop(0.22, Y_PK - 0.18, 0.22, mat(0xe0ae2a, { metalness: 0.3 })), x, (Y_PK - 0.18) / 2, -5.65); });

    /* kính: lạnh, sạch, trong */
    var matKinh = new THREE.MeshStandardMaterial({
      color: 0xd8ecf7, transparent: true, opacity: 0.2, roughness: 0.05, metalness: 0.2,
      depthWrite: false, side: THREE.DoubleSide
    });
    var cao = K.h - Y_PK;
    var kinh = new THREE.Mesh(new THREE.PlaneGeometry(6.6, cao), matKinh);
    kinh.position.set(0, Y_PK + cao / 2, Z_PK);
    g.add(kinh);
    [-3.3, 3.3].forEach(function (x) {
      var k = new THREE.Mesh(new THREE.PlaneGeometry(dz * 2, cao), matKinh);
      k.position.set(x, Y_PK + cao / 2, zm);
      k.rotation.y = Math.PI / 2;
      g.add(k);
    });
    /* song kính và lan can */
    [-3.3, -1.1, 1.1, 3.3].forEach(function (x) { dat(g, hop(0.06, cao, 0.06, matThep), x, Y_PK + cao / 2, Z_PK, false); });
    dat(g, hop(6.66, 0.06, 0.06, matThep), 0, Y_PK + 1.05, Z_PK, false);

    /* trần phòng kính sáng trắng */
    var tran = new THREE.Mesh(new THREE.PlaneGeometry(6.4, dz * 2 - 0.2), new THREE.MeshBasicMaterial({ color: 0xf4f9ff }));
    tran.rotation.x = Math.PI / 2;
    tran.position.set(0, K.h - 0.02, zm);
    g.add(tran);
    var den = new THREE.PointLight(0xe3f0ff, 1.0, 6, 2);
    den.position.set(0, 4.7, zm);
    g.add(den);

    /* bảng chỉ tiêu trên tường sau */
    var cv = document.createElement('canvas');
    cv.width = 1024; cv.height = 512;
    o.kpiG = cv.getContext('2d');
    o.texKPI = new THREE.CanvasTexture(cv);
    o.texKPI.encoding = THREE.sRGBEncoding;
    var man = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.5), new THREE.MeshBasicMaterial({ map: o.texKPI }));
    man.position.set(0, 4.05, -K.d / 2 + 0.07);
    g.add(man);
    dat(g, hop(3.12, 1.62, 0.06, mat(0x1d2430)), 0, 4.05, -K.d / 2 + 0.03, false);
    vungNhin(g, 3.0, 1.5, 0.1, 0, 4.05, -K.d / 2 + 0.1, { nhin: 'kpi' });

    /* bàn làm việc */
    dat(g, hop(1.6, 0.06, 0.6, mat(0xeef1f4)), 2.0, Y_PK + 0.74, -7.0);
    dat(g, hop(0.5, 0.32, 0.04, mat(0x1d2430)), 2.0, Y_PK + 0.95, -7.12);

    /* biển dưới sàn treo */
    var b = bang(768, 128, 2.6, [['BAN QUẢN LÝ', fSans(60, 800), '#ffffff', 86, '10px']], nenBien('#2c3a4c'));
    b.position.set(0, Y_PK - 0.42, Z_PK + 0.06);
    g.add(b);

    /* hai người quản lý đứng nhìn xuống xưởng */
    [[-1.5, -5.95], [0.9, -6.2]].forEach(function (p, i) {
      var q = nguoi({ ao: 0xf2f4f7, quan: 0x2f3640, caVat: 0x23395d, toc: 0x2a2420 });
      q.g.position.set(p[0], Y_PK, p[1]);
      g.add(q.g);
      q.x0 = p[0];
      q.pha = i * 2.3;
      o.ql.push(q);
      vungNhin(q.g, 0.7, 1.9, 0.6, 0, 0.95, 0, { nhin: 'quanLy' });
    });
  }

  /* ---------- 7. dây chuyền 2 — còn phủ bạt ---------- */

  function dungDayChuyen2(g) {
    o.texBang2 = bangChuyen(g, X_DAU2, X_CUOI2, Z_DC2);
    o.may2 = X_MAY2.map(function (x) { return mayDap(g, x, Z_DC2, 0x5c8f6e); });
    o.may2.forEach(function (m) {
      m.matDen.color.setHex(0x3a3f44);
      m.matDen.emissive.setHex(0x000000);
    });

    o.bat = new THREE.Group();
    o.bat.position.set(0, 0, Z_DC2);
    g.add(o.bat);
    var vai = new THREE.Mesh(new THREE.BoxGeometry(6.9, 1.75, 1.35), mat(0x6f7868, { roughness: 1 }));
    vai.position.y = 0.875;
    vai.castShadow = vai.receiveShadow = true;
    o.bat.add(vai);
    var b = bang(768, 200, 2.2, [
      ['DÂY CHUYỀN 2', fSans(64, 800), '#2c3a4c', 90, '8px'],
      ['chưa vận hành', fSans(44, 500), '#5d6670', 160]
    ], nenBien('#e8e4d8', '#2c3a4c'));
    b.position.set(0, 1.0, 0.68);
    o.bat.add(b);
    o.batHop = vungNhin(g, 6.9, 1.8, 1.4, 0, 0.9, Z_DC2, { nhin: 'day2' });

    for (var i = 0; i < 10; i++) {
      var m = new THREE.Mesh(o.geoThung, o.matThung);
      m.castShadow = true;
      m.visible = false;
      g.add(m);
      o.hang2.push({ m: m, x: X_DAU2 + i * (X_CUOI2 - X_DAU2) / 10 });
    }
  }

  /* ---------- 8. góc nghỉ ---------- */

  function dungGocNghi(g) {
    var matGo = mat(0xb07a46);
    dat(g, hop(0.5, 0.08, 1.9, matGo), -6.85, 0.46, 3.3);
    dat(g, hop(0.08, 0.5, 1.9, matGo), -7.1, 0.75, 3.3);
    var matChan = mat(0x3d454d);
    [2.5, 4.1].forEach(function (z) { dat(g, hop(0.44, 0.42, 0.06, matChan), -6.85, 0.21, z); });
    /* bình nước */
    dat(g, hop(0.36, 1.0, 0.36, mat(0xe9edf0)), -7.0, 0.5, 4.85);
    dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.38, 10), mat(0x8cc3e8, { transparent: true, opacity: 0.8 })), -7.0, 1.2, 4.85);
    var b = bang(512, 128, 1.1, [['GÓC NGHỈ', fSans(56, 800), '#ffffff', 86, '4px']], nenBien('#d77a2c'));
    b.position.set(-K.w / 2 + 0.04, 1.85, 3.3);
    b.rotation.y = Math.PI / 2;
    g.add(b);
    var den = new THREE.PointLight(0xffb36b, 0.35, 4, 2);
    den.position.set(-6.4, 2.4, 3.4);
    g.add(den);
    vungNhin(g, 1.0, 1.6, 2.6, -6.85, 0.8, 3.5, { nhin: 'nghi' });
  }

  /* ---------- 9. tháp đèn báo ---------- */

  function dungDenBao(g) {
    var matTru = mat(0x3d454d, { metalness: 0.5 });
    dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 8), matTru), DEN[0], 1.3, DEN[1]);
    dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.1, 10), matTru), DEN[0], 0.05, DEN[1]);
    o.den = [0xff3a2a, 0xffc22a, 0x2bd46a].map(function (mau, i) {
      var m = new THREE.MeshStandardMaterial({ color: mau, emissive: mau, emissiveIntensity: 0.05, transparent: true, opacity: 0.92 });
      dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.26, 12), m), DEN[0], 3.2 - i * 0.28, DEN[1], false);
      return m;
    });
    dat(g, new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 12), matTru), DEN[0], 3.36, DEN[1], false);
    o.denTha = new THREE.PointLight(0xffffff, 0, 5, 2);
    o.denTha.position.set(DEN[0] - 0.4, 3.0, DEN[1] + 0.3);
    g.add(o.denTha);
    vungNhin(g, 0.6, 3.5, 0.6, DEN[0], 1.75, DEN[1], { nhin: 'den' });
  }

  /* ---------- 10. bàn điều khiển và ba cần gạt ---------- */

  function yMatBan(dz) { return 0.84 - dz * Math.tan(NGHIENG); }

  function dungBanDieuKhien(g, ctx) {
    dat(g, hop(2.9, 0.78, 0.72, mat(0x39424c, { metalness: 0.35, roughness: 0.5 })), 0, 0.39, Z_BAN);
    var matBan = dat(g, hop(2.98, 0.07, 0.86, mat(0x2a3138, { metalness: 0.3 })), 0, 0.805, Z_BAN);
    matBan.rotation.x = NGHIENG;
    /* viền xanh — màu của bàn điều khiển trên sàn */
    dat(g, hop(2.92, 0.06, 0.04, mat(0x3f6fb5)), 0, 0.74, Z_BAN + 0.37, false);

    var matO = mat(0x1c2126, { metalness: 0.5 });
    var matThan = mat(0xc9ced3, { metalness: 0.75, roughness: 0.3 });
    CAN.forEach(function (cd) {
      var T = ctx.text.can[cd.id];
      /* ổ cần gạt */
      var oCan = dat(g, hop(0.22, 0.08, 0.34, matO), cd.x, yMatBan(0) + 0.02, Z_BAN);
      oCan.rotation.x = NGHIENG;

      var truc = new THREE.Group();
      truc.position.set(cd.x, yMatBan(0) + 0.05, Z_BAN);
      g.add(truc);
      var than = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.032, 0.38, 8), matThan);
      than.position.y = 0.19;
      than.castShadow = true;
      truc.add(than);
      var matNum = new THREE.MeshStandardMaterial({ color: cd.mau, emissive: cd.mau, emissiveIntensity: 0.15, roughness: 0.35, flatShading: true });
      var num = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 1), matNum);
      num.position.y = 0.41;
      num.castShadow = true;
      truc.add(num);

      /* biển tên + vạch giá trị, nằm trên mặt bàn phía trước cần gạt */
      var bien = bang(512, 200, 0.74, [
        [T.ten, fSans(44, 800), '#e9eef3', 70, '2px'],
        [T.thap + '  ◂            ▸  ' + T.cao, fSans(30, 600), '#8f9aa6', 168]
      ], nenBien('#20262c', '#' + cd.mau.toString(16).padStart(6, '0')));
      var dzB = 0.25;
      bien.position.set(cd.x, yMatBan(dzB) + 0.045, Z_BAN + dzB);
      bien.rotation.x = -Math.PI / 2 + NGHIENG;
      g.add(bien);

      var geoVach = new THREE.PlaneGeometry(0.36, 0.035);
      geoVach.translate(0.18, 0, 0);
      var vach = new THREE.Mesh(geoVach, new THREE.MeshBasicMaterial({ color: cd.mau }));
      vach.position.set(cd.x - 0.18, yMatBan(dzB) + 0.048, Z_BAN + dzB);
      vach.rotation.x = -Math.PI / 2 + NGHIENG;
      g.add(vach);

      o.can[cd.id] = { truc: truc, matNum: matNum, vach: vach, hien: S.can[cd.id], sang: 0 };
      vungNhin(g, 0.55, 0.75, 0.62, cd.x, 1.1, Z_BAN, { can: cd.id });
    });
  }

  /* ---------- 11. người ---------- */

  /* Người low-poly. Gốc ở chân, mặt quay về +z.
     m: { ao, quan, mu (mũ bảo hộ), phanQuang, caVat, toc } */
  function nguoi(m) {
    var g = new THREE.Group();
    var mDa = mat(0xd9a77f), mAo = mat(m.ao), mQuan = mat(m.quan);
    var hong = new THREE.Group();
    hong.position.y = 0.9;
    g.add(hong);

    var matGiay = mat(0x2b2b2e);
    var chan = [-1, 1].map(function (s) {
      var p = new THREE.Group();
      p.position.x = s * 0.1;
      hong.add(p);
      var c = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.84, 0.17), mQuan);
      c.position.y = -0.42;
      c.castShadow = true;
      p.add(c);
      var giay = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.25), matGiay);
      giay.position.set(0, -0.86, 0.04);
      p.add(giay);
      return p;
    });

    var than = new THREE.Group();
    hong.add(than);
    var ng = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.17, 0.62, 6), mAo);
    ng.position.y = 0.31;
    ng.castShadow = true;
    than.add(ng);
    if (m.phanQuang) {
      var pq = new THREE.Mesh(new THREE.CylinderGeometry(0.206, 0.196, 0.05, 6),
        new THREE.MeshStandardMaterial({ color: 0xe8ecef, emissive: 0x9aa0a6, emissiveIntensity: 0.4, flatShading: true }));
      pq.position.y = 0.24;
      than.add(pq);
    }
    if (m.caVat) {
      var cv = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.03), mat(m.caVat));
      cv.position.set(0, 0.42, 0.19);
      than.add(cv);
    }
    var dau = new THREE.Mesh(new THREE.IcosahedronGeometry(0.135, 0), mDa);
    dau.position.y = 0.76;
    dau.castShadow = true;
    than.add(dau);
    if (m.mu) {
      var mMu = mat(m.mu, { roughness: 0.4 });
      var mu = new THREE.Mesh(new THREE.SphereGeometry(0.155, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), mMu);
      mu.position.y = 0.8;
      than.add(mu);
      var vanh = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.025, 10), mMu);
      vanh.position.y = 0.8;
      than.add(vanh);
    } else if (m.toc) {
      var toc = new THREE.Mesh(new THREE.SphereGeometry(0.145, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2), mat(m.toc));
      toc.position.set(0, 0.79, -0.015);
      than.add(toc);
    }

    var tay = [-1, 1].map(function (s) {
      var p = new THREE.Group();
      p.position.set(s * 0.26, 0.56, 0);
      than.add(p);
      var a = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.54, 0.11), mAo);
      a.position.y = -0.27;
      a.castShadow = true;
      p.add(a);
      var b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.055, 0), mDa);
      b.position.y = -0.58;
      p.add(b);
      return p;
    });

    return { g: g, hong: hong, chan: chan, than: than, dau: dau, tay: tay };
  }

  function dungCongNhan(g) {
    /* 0..3: dây chuyền 1 · 4, 5: dây chuyền 2, chỉ vào làm khi nhà máy mở rộng */
    var nha = X_MAY.map(function (x) { return [x + LECH_CN, Z_CN]; }).concat(X_MAY2.map(function (x) { return [x + LECH_CN, Z_CN2]; }));
    var ao = [0xe8823a, 0xdb6f2f, 0xe8823a, 0xef9446, 0xe8823a, 0xdb6f2f];
    nha.forEach(function (p, i) {
      var w = nguoi({ ao: ao[i], quan: 0x34445a, mu: 0xf2c230, phanQuang: true });
      w.nha = p;
      w.an = i >= 4;
      w.x = w.an ? CUA[0] : p[0];
      w.z = w.an ? CUA[1] : p[1];
      w.yaw = 0; w.yawDich = 0; w.yawNghi = 0;
      w.duong = [];
      w.dich = 'tram'; w.ghe = -1;
      w.bo = false;
      w.pha = Math.random() * 6;
      w.buoc = 0;
      w.dangDi = false;
      w.g.position.set(w.x, 0, w.z);
      w.g.visible = !w.an;
      g.add(w.g);
      var hb = vungNhin(w.g, 0.7, 1.85, 0.6, 0, 0.92, 0, { nhin: 'congNhan' });
      hb.userData.nguoi = w;
      o.cn.push(w);
    });
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function dungPanel(ctx) {
    var N = ctx.text.nhan;
    function dong(id, ten, mau) {
      return '<div class="nm-r"><span>' + ten + '</span>' +
             '<div class="nm-t"><i id="nm' + id + 'B" style="background:' + mau + '"></i><s style="left:' + NGUONG + '%"></s></div>' +
             '<em id="nm' + id + '">0</em></div>';
    }
    ctx.hud.datPanel(
      '<style>' +
        '#panel .nm-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}' +
        '#panel .nm-h .val{font-size:20px;margin:0}' +
        '#panel .nm-h .lbl{display:inline;margin-right:8px}' +
        '#panel .nm-g{display:grid;grid-template-columns:1fr 1fr;gap:0 24px}' +
        '#panel .nm-b{font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;margin-bottom:1px}' +
        '#panel .nm-r{display:grid;grid-template-columns:66px 1fr 26px;align-items:center;gap:8px;font-size:12px;color:var(--muc2);margin-top:3px}' +
        '#panel .nm-r em{font-style:normal;font-weight:600;font-variant-numeric:tabular-nums;color:var(--muc);text-align:right}' +
        '#panel .nm-t{position:relative;height:6px;border-radius:3px;background:#ece5d9}' +
        '#panel .nm-t i{position:absolute;left:0;top:0;bottom:0;border-radius:3px}' +
        '#panel .nm-t s{position:absolute;top:-3px;bottom:-3px;width:1px;background:var(--muc2);opacity:.45}' +
        '#panel .nodebar{margin-top:8px}' +
      '</style>' +
      '<div class="nm-h">' +
        '<div class="phase"><span class="lbl">' + N.trangThai + '</span><span class="val" id="nmS"></span></div>' +
        '<div class="phase"><span class="lbl">' + N.khungHoang + '</span><span class="val" id="nmK">0</span></div>' +
      '</div>' +
      '<div class="nm-g">' +
        '<div><div class="nm-b" style="color:' + MAU_QL + '">' + N.benQL + '</div>' +
          dong('SL', N.sanLuong, MAU_QL) + dong('LN', N.loiNhuan, MAU_QL) + '</div>' +
        '<div><div class="nm-b" style="color:' + MAU_CN + '">' + N.benCN + '</div>' +
          dong('SK', N.sucKhoe, MAU_CN) + dong('TT', N.tinhThan, MAU_CN) + '</div>' +
      '</div>' +
      '<div class="nodebar on">' +
        '<div class="cap"><span>' + N.giu.replace('%n', NGUONG) + '</span><span id="nmGiuS"></span></div>' +
        '<div class="track"><div class="bar" id="nmGiu"></div></div>' +
      '</div>'
    );
    el = {};
    ['S', 'K', 'SL', 'LN', 'SK', 'TT', 'SLB', 'LNB', 'SKB', 'TTB', 'Giu', 'GiuS'].forEach(function (k) {
      el[k] = document.getElementById('nm' + k);
    });
  }

  /* ═══════════ khi bước vào ═══════════ */

  function onEnter(ctx) {
    S.batDau = true;
    o.nen = ctx.audio.canhNen();
    /* còi báo động: sóng vuông qua lọc thấp, chỉ kêu mấy giây đầu khủng hoảng */
    var a = ctx.audio.ngu();
    if (a) {
      var os = a.createOscillator(), f = a.createBiquadFilter(), gn = a.createGain();
      os.type = 'square';
      os.frequency.value = 620;
      f.type = 'lowpass';
      f.frequency.value = 1500;
      gn.gain.value = 0.0001;
      os.connect(f); f.connect(gn); gn.connect(a.destination);
      os.start();
      o.coi = { a: a, os: os, g: gn };
    }
  }

  /* ═══════════ logic ═══════════ */

  function logic(dt, ctx) {
    var c = S.can, A = TX.anim;

    /* --- cần gạt --- */
    var tacDong = S.chon && !S.ket ? ctx.player.action() : 0;
    if (tacDong) {
      c[S.chon] = kep(c[S.chon] + tacDong * TOC_CAN * dt, 0, 1);
      S.ysChuT = Math.min(S.ysChuT, 0.6);   // người chơi đã ra tay thì tắt bớt lời đòi
    }

    /* --- nhà máy phản ứng --- */
    var dangKhung = !!S.khung;
    var sucDich = dichSuc(c);
    if (dangKhung) sucDich = Math.max(sucDich, 55);    // máy dừng, người được nghỉ
    S.suc  = A.damp(S.suc,  sucDich, 1 / TAU, dt);
    S.tinh = A.damp(S.tinh, dichTinh(c, S.suc), 1 / TAU, dt);
    S.sl   = A.damp(S.sl, dangKhung ? 0 : slTu(c, S.suc, S.tinh), dangKhung ? 1.6 : 0.8, dt);
    S.ln   = A.damp(S.ln, lnTu(c, S.sl), 1.2, dt);

    /* --- khủng hoảng --- */
    if (dangKhung) {
      S.khungT += dt;
      var d = diemDung(c);
      if (S.khungT > 4 && d.suc >= 40 && d.tinh >= 40 && d.ln >= 40) {
        S.khung = null;
        S.suc = Math.max(S.suc, 35);
        S.tinh = Math.max(S.tinh, 35);
        S.batOn = 0;
        S.chayLaiT = 3;
        ctx.audio.diemNut();
      }
    } else {
      var epCN = S.suc < 25 || S.tinh < 25;
      var epQL = S.ln < 25;
      /* vừa chạy lại thì sản lượng còn đang lên, đừng tính là bị ép */
      if ((epCN || epQL) && S.chayLaiT <= 0) S.batOn += dt;
      else S.batOn = Math.max(0, S.batOn - dt * 0.6);
      if (S.batOn >= BAT_ON_MAX && !S.ket) {
        S.khung = epCN ? 'CN' : 'QL';
        S.khungT = 0;
        S.soKhung++;
        S.giu = 0;
        S.batOn = 0;
        ctx.hud.buocNhay('⚠ ' + ctx.text.trangThai.BAT_ON, ctx.text.trangThai.KHUNG);
        ctx.audio.buocNhay();
      }
    }

    /* --- ổn định đủ lâu thì nhà máy bước sang nấc mới --- */
    var on = !S.khung && thapNhat() >= NGUONG;
    if (S.ket) S.giu = GIU_CAN;
    else if (on) S.giu = Math.min(GIU_CAN, S.giu + dt);
    else S.giu = Math.max(0, S.giu - dt * 2);
    if (S.giu >= GIU_CAN && !S.ket) {
      S.ket = true;
      S.ketT = 0;
      ctx.hud.anChuGiai();
    }

    /* --- hai phía không đứng yên: phía đang chịu thiệt tự đòi --- */
    if (!S.khung && !S.ket && S.giu < 0.5) {
      S.ysT -= dt;
      if (S.ysT <= 0) {
        S.ysT = 18 + Math.random() * 6;
        var ql = (S.sl + S.ln) / 2, cn = (S.suc + S.tinh) / 2, Y = ctx.text.yeuSach, id = null, chu = null;
        if (ql < cn - 10) { id = 'toc'; chu = Y.ql; }
        else if (cn < ql - 10) {
          id = c.nghi < c.luong ? 'nghi' : 'luong';
          chu = id === 'nghi' ? Y.cnNghi : Y.cnLuong;
        }
        if (id) {
          c[id] = kep(c[id] + 0.08, 0, 1);
          S.ysChu = chu;
          S.ysChuT = 4.5;
          o.can[id].sang = 1;
          ctx.audio.diemNut();
        }
      }
    }
    if (S.ysChuT > 0) S.ysChuT -= dt;
    if (S.chayLaiT > 0) S.chayLaiT -= dt;

    /* --- công nhân nghỉ việc khi chán quá lâu, quay lại khi đỡ hơn --- */
    if (!S.ket) {
      if (S.tinh < 22 && S.soBo < 2) {
        S.boT += dt;
        if (S.boT > 5) { S.boT = 0; o.cn[[2, 0][S.soBo]].bo = true; S.soBo++; }
      } else S.boT = 0;
      if (S.tinh > 45 && S.soBo > 0) {
        S.veT += dt;
        if (S.veT > 4) { S.veT = 0; S.soBo--; o.cn[[2, 0][S.soBo]].bo = false; }
      } else S.veT = 0;
    }

    /* --- lịch sử cho bảng chỉ tiêu --- */
    S.lichSuT += dt;
    if (S.lichSuT > 0.5) {
      S.lichSuT = 0;
      S.lichSu.push([S.sl, S.ln, S.suc, S.tinh]);
      if (S.lichSu.length > 90) S.lichSu.shift();
    }
  }

  /* ═══════════ kết: đèn đỏ → vàng → xanh, dây chuyền 2 vận hành ═══════════ */

  function ket(dt, ctx) {
    S.ketT += dt;
    if (S.ketT > 2.0 && !S.daNhay) {
      S.daNhay = true;
      ctx.hud.buocNhay(ctx.text.nhan.buocNhay, 'DÂY CHUYỀN 2 VẬN HÀNH');
      ctx.audio.buocNhay();
      ctx.hoanThanh();
    }
    if (S.ketT > 2.6 && o.cn[4].an && !o.cn[4].daGoi) {
      [4, 5].forEach(function (i) { var w = o.cn[i]; w.daGoi = true; w.an = false; w.dich = null; });
    }
    if (S.ketT > 8.5 && !S.daThe) {
      S.daThe = true;
      theBaiHoc(ctx);
    }
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
    ctx.hud.anChuGiai();

    var nhac = S.soKhung > 0 ? B.nhacKhung.replace('%n', S.soKhung) : B.nhacKhong;

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
      '<p class="note">' + B.luuY + '</p>' +
      '<h2>' + B.lienHe.tieuDe + '</h2>' +
      '<p>' + B.lienHe.than + '</p>' +
      '<p class="note">' + nhac + '</p>',
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  /* ═══════════ hình ảnh ═══════════ */

  function hinhAnh(dt, ctx) {
    var A = TX.anim, t = ctx.clock, c = S.can;
    var hs = hieuSuat(S.suc, S.tinh);
    var chay = !S.khung;

    /* --- cần gạt: tay gạt đuổi theo giá trị, núm sáng khi đang chọn --- */
    CAN.forEach(function (cd) {
      var k = o.can[cd.id];
      k.hien = A.damp(k.hien, c[cd.id], 12, dt);
      k.truc.rotation.x = (k.hien - 0.5) * 1.3;
      k.vach.scale.x = Math.max(0.02, k.hien);
      k.sang = Math.max(0, k.sang - dt * 0.5);
      var dich = (S.chon === cd.id ? 0.9 : 0.15) + k.sang * (0.6 + 0.6 * Math.sin(t * 12));
      k.matNum.emissiveIntensity = A.damp(k.matNum.emissiveIntensity, dich, 10, dt);
    });

    /* --- băng chuyền: chạy nhanh theo tốc độ, chậm lại khi người mệt --- */
    S.vBang = A.damp(S.vBang, chay ? (0.35 + 1.15 * c.toc) * hs : 0, chay ? 2 : 4, dt);
    o.texBang.offset.x -= S.vBang * dt / 0.5;
    capNhatHang(dt, hs, chay);

    /* --- máy: piston dập, bánh răng quay, đèn trạng thái --- */
    o.may.forEach(function (m, i) {
      m.pha += dt * S.vBang * 7;
      m.piston.position.y = Y_DC + 0.36 - (0.5 + 0.5 * Math.sin(m.pha)) * 0.08;
      m.rang.rotation.y += dt * S.vBang * 3;
      var mau = !chay ? ((t * 2 + i * 0.3) % 1 < 0.5 ? 0xff3a2a : 0x3a1410)
              : hs < 0.72 ? 0xff3a2a : hs < 0.85 ? 0xffc22a : 0x2bd46a;
      m.matDen.color.setHex(mau);
      m.matDen.emissive.setHex(mau);
    });

    /* --- tia lửa ở máy lỗi khi công nhân quá mệt --- */
    if (chay && hs < 0.75 && Math.random() < dt * (0.75 - hs) * 14) {
      var m = o.may[Math.floor(Math.random() * 4)];
      phunTia(m.x, Y_DC + 0.65, Z_DC + 0.3, 14);
    }
    capNhatTia(dt);

    /* --- dây chuyền 2 --- */
    if (S.ket) {
      var p = A.muot((S.ketT - 2.2) / 1.4);
      o.bat.scale.y = Math.max(0.01, 1 - p);
      o.bat.visible = p < 1;
      if (p >= 1 && o.batHop) {
        o.batHop.parent.remove(o.batHop);
        o.nhin.splice(o.nhin.indexOf(o.batHop), 1);
        o.batHop = null;
      }
      var v2 = S.ketT > 4.5 ? 0.9 : 0;
      o.texBang2.offset.x -= v2 * dt / 0.5;
      o.may2.forEach(function (m) {
        if (S.ketT > 3.6) {
          m.matDen.color.setHex(0x2bd46a);
          m.matDen.emissive.setHex(0x2bd46a);
        }
        m.pha += dt * v2 * 7;
        m.piston.position.y = Y_DC + 0.36 - (0.5 + 0.5 * Math.sin(m.pha)) * 0.08;
        m.rang.rotation.y += dt * v2 * 3;
      });
      if (v2) o.hang2.forEach(function (h) {
        h.x += v2 * dt;
        if (h.x > X_CUOI2) h.x = X_DAU2;
        h.m.visible = true;
        h.m.position.set(h.x, Y_DC + 0.15, Z_DC2);
      });
    }

    /* --- đèn báo: đỏ khủng hoảng · vàng lệch · xanh ổn định --- */
    var den;
    if (S.ket) den = S.ketT < 0.9 ? 0 : (S.ketT < 1.8 ? 1 : 2);
    else if (S.khung) den = 0;
    else den = thapNhat() >= NGUONG ? 2 : 1;
    var nhay = !S.ket && (S.khung || S.batOn > 0.5) ? (Math.sin(t * 9) > 0 ? 1 : 0.15) : 1;
    o.den.forEach(function (m, i) {
      m.emissiveIntensity = A.damp(m.emissiveIntensity, i === den ? 1.8 * nhay : 0.05, 14, dt);
    });
    o.denTha.color.setHex([0xff3a2a, 0xffc22a, 0x2bd46a][den]);
    o.denTha.intensity = 0.8 * nhay;

    /* --- báo động đỏ khắp xưởng khi khủng hoảng --- */
    var bao = S.khung ? (0.5 + 0.5 * Math.sin(t * 6)) * 1.6 : 0;
    o.denDo.intensity = A.damp(o.denDo.intensity, bao, 8, dt);
    o.denCN.intensity = A.damp(o.denCN.intensity, S.khung ? 0.15 : 0.55, 3, dt);
    S.do = A.damp(S.do, S.khung ? 0.55 + 0.15 * Math.sin(t * 6) : 0, 3, dt);
    ctx.moiTruong.suong.color.copy(o.mauSuong).lerp(o.mauDo, S.do);
    ctx.moiTruong.nen.copy(ctx.moiTruong.suong.color);

    /* --- người --- */
    capNhatCongNhan(dt, t, hs, chay);
    capNhatQuanLy(dt, t);

    /* --- bảng chỉ tiêu: vẽ lại vài lần mỗi giây là đủ --- */
    S.kpiT -= dt;
    if (S.kpiT <= 0) { S.kpiT = 0.25; veKPI(ctx, t); }

    /* --- âm thanh --- */
    if (o.nen) o.nen.set(chay ? 0.12 + 0.4 * c.toc * hs : 0.03);
    if (o.coi) {
      var keu = S.khung && S.khungT < 4.5;
      var tt = o.coi.a.currentTime;
      o.coi.g.gain.setTargetAtTime(keu ? 0.035 : 0.0001, tt, 0.05);
      if (keu) o.coi.os.frequency.setTargetAtTime(Math.floor(t / 0.42) % 2 ? 470 : 640, tt, 0.01);
    }
  }

  /* --- hàng trên băng --- */
  function capNhatHang(dt, hs, chay) {
    var gan = 99;
    if (chay) S.sinh += dt * S.sl / 100 * 1.5;
    for (var i = 0; i < o.hang.length; i++) {
      var h = o.hang[i];
      if (!h.on) continue;
      h.x += S.vBang * dt;
      if (h.x - X_DAU < gan) gan = h.x - X_DAU;
      /* qua máy thứ hai thì phôi thành thùng; hàng lỗi lộ màu đỏ sau máy thứ ba */
      var thung = h.x > X_MAY[1] + 0.2;
      h.m.geometry = thung ? o.geoThung : o.geoPhoi;
      h.m.material = thung ? (h.loi && h.x > X_MAY[2] ? o.matLoi : o.matThung) : o.matPhoi;
      h.m.position.set(h.x, Y_DC + (thung ? 0.15 : 0.1), Z_DC);
      if (h.x > X_CUOI) {
        h.on = false;
        h.m.visible = false;
        if (!h.loi) S.tp++;
      }
    }
    if (S.sinh >= 1 && gan > 0.5) {
      for (var k = 0; k < o.hang.length; k++) {
        if (o.hang[k].on) continue;
        var n = o.hang[k];
        n.on = true;
        n.x = X_DAU;
        n.m.visible = true;
        n.loi = Math.random() < (1 - hs) * 0.9;
        S.sinh -= 1;
        break;
      }
    }
    S.sinh = Math.min(S.sinh, 2);
    var day = S.tp % (o.pallet.length + 1);
    for (var j = 0; j < o.pallet.length; j++) o.pallet[j].visible = j < day;
  }

  function phunTia(x, y, z, n) {
    var T = o.tiaLua;
    for (var i = 0; i < T.count && n > 0; i++) {
      if (T.life[i] > 0) continue;
      T.pos[i * 3] = x; T.pos[i * 3 + 1] = y; T.pos[i * 3 + 2] = z;
      var a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 1.6;
      T.vel[i * 3] = Math.cos(a) * v * 0.6;
      T.vel[i * 3 + 1] = 1 + Math.random() * 1.5;
      T.vel[i * 3 + 2] = Math.sin(a) * v * 0.6 + 0.4;
      T.life[i] = 0.6 + Math.random() * 0.4;
      n--;
    }
  }

  function capNhatTia(dt) {
    var T = o.tiaLua;
    for (var i = 0; i < T.count; i++) {
      if (T.life[i] <= 0) continue;
      T.life[i] -= dt;
      T.vel[i * 3 + 1] -= dt * 6;
      T.pos[i * 3] += T.vel[i * 3] * dt;
      T.pos[i * 3 + 1] += T.vel[i * 3 + 1] * dt;
      T.pos[i * 3 + 2] += T.vel[i * 3 + 2] * dt;
      if (T.life[i] <= 0 || T.pos[i * 3 + 1] < 0.02) T.an(i);
    }
    T.capNhat();
  }

  /* --- công nhân: chọn chỗ, đi tới, tư thế --- */

  /* Đường đi: cùng một dãy thì đi thẳng, khác dãy thì vòng qua hành lang
     trái — không ai đi xuyên băng chuyền. */
  function lo(x, z, tx, tz) {
    function sau(zz) { return zz < -1.0; }
    if (sau(z) === sau(tz) && (!sau(z) || Math.abs(z - tz) < 0.3)) return [[tx, tz]];
    return [[X_HL, z], [X_HL, tz], [tx, tz]];
  }

  function datDich(w, dich, ghe) {
    w.dich = dich;
    w.ghe = ghe;
    var p = dich === 'bo' ? CUA : (dich === 'nghi' ? GHE[ghe] : w.nha);
    w.duong = lo(w.x, w.z, p[0], p[1]);
    w.yawNghi = dich === 'nghi' ? Math.PI / 2 : 0;
  }

  function capNhatCongNhan(dt, t, hs, chay) {
    var c = S.can;
    /* thời gian nghỉ nhiều thì một, hai người ra góc nghỉ */
    var soNghi = c.nghi >= 0.62 ? 2 : (c.nghi >= 0.3 ? 1 : 0);
    var luotNghi = [3, 1];

    for (var i = 0; i < o.cn.length; i++) {
      var w = o.cn[i];

      if (i >= 4) {
        /* dây chuyền 2 chỉ có người khi nhà máy đã mở rộng */
        if (w.an) { w.g.visible = false; continue; }
        if (w.dich === null) datDich(w, 'tram', -1);
      } else {
        var muon = 'tram', ghe = -1, luot = luotNghi.indexOf(i);
        if (w.bo) muon = 'bo';
        else if (S.khung && w.dich === 'nghi') { muon = 'nghi'; ghe = w.ghe; }   // khủng hoảng: ai đang nghỉ cứ ngồi đó
        else if (!S.khung && luot >= 0 && luot < soNghi) { muon = 'nghi'; ghe = luot; }
        if (muon !== w.dich || ghe !== w.ghe) { w.an = false; datDich(w, muon, ghe); }
        if (w.an) { w.g.visible = false; continue; }
      }
      w.g.visible = true;

      /* đi theo đường */
      w.dangDi = false;
      if (w.duong.length) {
        var d = w.duong[0], dx = d[0] - w.x, dz = d[1] - w.z, L = Math.hypot(dx, dz), b = 1.5 * dt;
        if (L <= b) { w.x = d[0]; w.z = d[1]; w.duong.shift(); }
        else { w.x += dx / L * b; w.z += dz / L * b; w.yawDich = Math.atan2(dx, dz); w.dangDi = true; }
        if (!w.duong.length && w.dich === 'bo') { w.an = true; w.g.visible = false; continue; }
      } else w.yawDich = w.yawNghi;

      var dy = w.yawDich - w.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      w.yaw += dy * Math.min(1, dt * 8);
      w.g.position.set(w.x, 0, w.z);
      w.g.rotation.y = w.yaw;

      poseCongNhan(w, dt, t, i, chay);
    }
  }

  function poseCongNhan(w, dt, t, i, chay) {
    var A = TX.anim;
    var toi = !w.dangDi && !w.duong.length;
    var ngoi = toi && w.dich === 'nghi';
    var lam = toi && w.dich === 'tram';
    var met = kep((45 - S.suc) / 35, 0, 1);       // 0 khoẻ … 1 kiệt sức
    var d = { hong: 0, chan: [0, 0], than: 0, xoay: 0, tayX: [0, 0], tayZ: [0, 0], dau: 0 };

    if (w.dangDi) {
      w.buoc += dt * 9;
      var s = Math.sin(w.buoc);
      d.chan = [s * 0.5, -s * 0.5];
      d.tayX = [-s * 0.45, s * 0.45];
      d.than = 0.05;
    } else if (ngoi) {
      d.hong = -0.42;
      d.chan = [-1.45, -1.45];
      d.tayX = [-0.5, -0.5];
      d.than = -0.1 + Math.sin(t * 0.8 + i) * 0.03;
      d.dau = Math.sin(t * 0.5 + i) * 0.1;
    } else if (lam && S.khung === 'CN' && i < 4) {
      /* đình công: khoanh tay, đứng thẳng */
      d.tayX = [-1.25, -1.25];
      d.tayZ = [0.95, -0.95];
      d.dau = -0.08;
    } else if (lam && (i >= 4 ? S.ketT > 4.5 : chay)) {
      /* làm việc: với tay ra băng, xoay người nhặt hàng theo nhịp máy; mệt thì còng lưng */
      var nhip = (i >= 4 ? 0.9 : S.vBang) * 6 + 1;
      w.pha += dt * nhip;
      d.tayX = [-0.95 + Math.sin(w.pha) * 0.35, -0.95 + Math.sin(w.pha + Math.PI) * 0.35];
      d.tayZ = [0.15 + Math.sin(w.pha * 0.5) * 0.3, -0.15 + Math.sin(w.pha * 0.5) * 0.3];
      d.xoay = Math.sin(w.pha * 0.5) * 0.35;
      d.than = 0.18 + (i < 4 ? met * 0.32 : 0) + Math.sin(w.pha * 0.5) * 0.03;
      d.dau = 0.25 + (i < 4 ? met * 0.2 : 0);
    } else if (lam) {
      /* máy dừng: đứng chờ, cúi đầu */
      d.than = 0.05 + met * 0.3;
      d.dau = 0.3;
      d.tayX = [-0.1, -0.1];
    }

    var k = 10;
    w.hong.position.y = 0.9 + A.damp(w.hong.position.y - 0.9, d.hong, k, dt);
    w.chan[0].rotation.x = A.damp(w.chan[0].rotation.x, d.chan[0], k, dt);
    w.chan[1].rotation.x = A.damp(w.chan[1].rotation.x, d.chan[1], k, dt);
    w.than.rotation.x = A.damp(w.than.rotation.x, d.than, k, dt);
    w.than.rotation.y = A.damp(w.than.rotation.y, d.xoay, k, dt);
    w.dau.rotation.x = A.damp(w.dau.rotation.x, d.dau, k, dt);
    for (var j = 0; j < 2; j++) {
      w.tay[j].rotation.x = A.damp(w.tay[j].rotation.x, d.tayX[j], k, dt);
      w.tay[j].rotation.z = A.damp(w.tay[j].rotation.z, d.tayZ[j], k, dt);
    }
  }

  /* --- ban quản lý: đứng nhìn xuống khi lãi, đi lại sốt ruột khi lỗ hoặc máy dừng --- */
  function capNhatQuanLy(dt, t) {
    var A = TX.anim;
    var sotRuot = S.khung || S.ln < 45;
    o.ql.forEach(function (q, i) {
      q.pha += dt * (sotRuot ? 2 : 0.6);
      var x = A.damp(q.g.position.x, q.x0 + (sotRuot ? Math.sin(q.pha) * 0.9 : 0), 3, dt);
      var vx = (x - q.g.position.x) / Math.max(dt, 1e-4);
      q.g.position.x = x;
      var di = Math.abs(vx) > 0.15;
      q.g.rotation.y = A.damp(q.g.rotation.y, di ? (vx > 0 ? Math.PI / 2 : -Math.PI / 2) : 0, 6, dt);
      var buoc = di ? Math.sin(t * 8 + i) * 0.4 : 0;
      q.chan[0].rotation.x = A.damp(q.chan[0].rotation.x, buoc, 10, dt);
      q.chan[1].rotation.x = A.damp(q.chan[1].rotation.x, -buoc, 10, dt);
      /* lỗ: một người giơ tay chỉ trỏ xuống xưởng */
      q.tay[1].rotation.x = A.damp(q.tay[1].rotation.x, S.ln < 45 && i === 0 ? -1.9 : -0.15, 6, dt);
      q.tay[0].rotation.x = A.damp(q.tay[0].rotation.x, -0.15, 6, dt);
      q.dau.rotation.x = A.damp(q.dau.rotation.x, 0.35, 4, dt);
    });
  }

  /* --- bảng chỉ tiêu trong phòng kính --- */
  function veKPI(ctx, t) {
    var g = o.kpiG, N = ctx.text.nhan, W = 1024, H = 512;
    g.fillStyle = '#0f1824';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#7f93aa';
    g.font = fSans(26, 700);
    g.textAlign = 'left';
    try { g.letterSpacing = '4px'; } catch (e) {}
    g.fillText('BẢNG CHỈ TIÊU · CA SẢN XUẤT', 36, 52);
    try { g.letterSpacing = '0px'; } catch (e) {}

    [[N.sanLuong, S.sl, MAU_QL], [N.loiNhuan, S.ln, MAU_QL], [N.sucKhoe, S.suc, MAU_CN], [N.tinhThan, S.tinh, MAU_CN]].forEach(function (d, i) {
      var y = 96 + i * 92;
      g.fillStyle = '#c9d4e0';
      g.font = fSans(26, 600);
      g.fillText(d[0], 36, y + 24);
      g.fillStyle = '#1f2b3a';
      g.fillRect(36, y + 38, 380, 22);
      g.fillStyle = d[1] < 25 ? '#e2483a' : d[2];
      g.fillRect(36, y + 38, 380 * d[1] / 100, 22);
      g.fillStyle = '#ffffff';
      g.fillRect(36 + 380 * NGUONG / 100, y + 32, 2, 34);
      g.font = fSans(40, 700);
      g.textAlign = 'right';
      g.fillText(Math.round(d[1]), 520, y + 60);
      g.textAlign = 'left';
    });

    /* biểu đồ: sản lượng (xanh) và sức khoẻ (cam) theo thời gian */
    var x0 = 580, y0 = 90, w = 410, h = 330, yN = y0 + h * (1 - NGUONG / 100);
    g.strokeStyle = '#2a3a4e';
    g.lineWidth = 2;
    g.strokeRect(x0, y0, w, h);
    g.setLineDash([6, 6]);
    g.beginPath(); g.moveTo(x0, yN); g.lineTo(x0 + w, yN); g.stroke();
    g.setLineDash([]);
    var L = S.lichSu;
    if (L.length > 1) [[0, MAU_QL], [2, MAU_CN]].forEach(function (cot) {
      g.strokeStyle = cot[1];
      g.lineWidth = 4;
      g.beginPath();
      for (var k = 0; k < L.length; k++) {
        var px = x0 + w * k / 89, py = y0 + h * (1 - L[k][cot[0]] / 100);
        if (k) g.lineTo(px, py); else g.moveTo(px, py);
      }
      g.stroke();
    });

    /* dải trạng thái */
    var dai = S.khung ? [Math.sin(t * 6) > 0 ? '#c8352a' : '#7a1f18', '⚠ ' + ctx.text.trangThai.KHUNG + ' · DÂY CHUYỀN DỪNG']
            : (S.ket || S.giu > 0.5) ? ['#1e7a46', S.ket ? ctx.text.trangThai.XONG : ctx.text.trangThai.ON]
            : null;
    if (dai) {
      g.fillStyle = dai[0];
      g.fillRect(0, H - 64, W, 64);
      g.fillStyle = '#ffffff';
      g.font = fSans(34, 800);
      g.textAlign = 'center';
      g.fillText(dai[1], W / 2, H - 20);
      g.textAlign = 'left';
    }
    o.texKPI.needsUpdate = true;
  }

  /* ═══════════ ánh nhìn: cần gạt và chú giải ═══════════ */

  function nhinVao(dt, ctx) {
    var P = ctx.player, id = null, chon = null;
    if (!S.ket && !ctx.hud.theDangMo() && !ctx.hud.soTayDangMo()) {
      if (P.lockBroken) o.diemNhin.set(P.chuot.x / innerWidth * 2 - 1, -(P.chuot.y / innerHeight) * 2 + 1);
      else o.diemNhin.set(0, 0);
      o.tia.setFromCamera(o.diemNhin, ctx.camera);
      o.tia.far = 14;
      var trung = o.tia.intersectObjects(o.nhin, false);
      for (var i = 0; i < trung.length; i++) {
        var u = trung[i].object.userData;
        if (u.nguoi && u.nguoi.an) continue;          // người đã bỏ việc thì không còn ở đó
        if (u.can) { if (trung[i].distance < TAM_CAN) chon = u.can; }
        else id = u.nhin;
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
    var T = ctx.text, G = T.goiY, TS = T.trangThai;

    var ql = (S.sl + S.ln) / 2, cn = (S.suc + S.tinh) / 2;
    var tt = S.ket ? 'XONG' : S.khung ? 'KHUNG' : S.batOn > 1 ? 'BAT_ON'
           : thapNhat() >= NGUONG ? 'ON'
           : ql - cn > 15 ? 'LECH_QL' : cn - ql > 15 ? 'LECH_CN' : 'CHAY';
    el.S.textContent = TS[tt];
    el.S.style.color = { KHUNG: '#c8352a', BAT_ON: '#c8352a', ON: '#1e7a46', XONG: '#1e7a46', LECH_QL: MAU_QL, LECH_CN: MAU_CN }[tt] || '';
    el.K.textContent = S.soKhung;

    [['SL', S.sl], ['LN', S.ln], ['SK', S.suc], ['TT', S.tinh]].forEach(function (d) {
      el[d[0]].textContent = Math.round(d[1]);
      el[d[0]].style.color = d[1] < 25 ? '#c8352a' : '';
      el[d[0] + 'B'].style.width = d[1] + '%';
    });
    el.Giu.style.width = (S.giu / GIU_CAN * 100) + '%';
    el.GiuS.textContent = S.giu.toFixed(1) + ' / ' + GIU_CAN + ' s';

    ctx.hud.hienPanel(!S.daThe);
    ctx.hud.ngam(!!S.chon);

    var goiY;
    if (S.ket) goiY = G.ket;
    else if (S.khung) goiY = (S.khung === 'CN' ? G.khungCN : G.khungQL) + (S.khungT > 2.5 ? '<br>' + G.khungSua : '');
    else if (S.ysChuT > 0) goiY = S.ysChu;
    else if (S.chayLaiT > 0) goiY = G.chayLai;
    else if (S.chon) goiY = (ctx.player.lockBroken ? G.canDP : G.can)[S.chon];
    else if (S.batOn > 0.5) goiY = G.batOn;
    else if (S.giu > 0.5) goiY = G.on;
    else goiY = G.xa;
    ctx.hud.goiY(goiY);
    ctx.hud.hienGoiY(!S.daThe);
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    /* đang đọc thẻ hay sổ tay thì cả nhà máy đứng hình — không để nó
       sụp sau lưng người chơi */
    var chay = S.batDau && !ctx.hud.theDangMo() && !ctx.hud.soTayDangMo();
    if (chay) {
      nhinVao(dt, ctx);
      logic(dt, ctx);
      if (S.ket) ket(dt, ctx);
    }
    hinhAnh(chay ? dt : 0, ctx);
    hud(ctx);
  }

  function dispose() {
    if (o && o.nen) o.nen.stop();
    if (o && o.coi) { try { o.coi.os.stop(); } catch (e) {} }
    S = o = el = null;
  }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'mau-thuan',
    tieuDe: 'Mâu thuẫn',
    nhanNgan: 'Tầng II · Chương 2',
    moTa: 'Một nhà máy, hai phía, ba cần gạt. Ép một phía thì cả hệ thống sụp.',
    goiY: {
      khoa:    'Nhìn vào một cần gạt, giữ <kbd>Chuột trái</kbd> / <kbd>Chuột phải</kbd>',
      duPhong: 'Nhìn vào một cần gạt, giữ <kbd>F</kbd> / <kbd>R</kbd>'
    },
    build: build,
    onEnter: onEnter,
    update: update,
    dispose: dispose
  });

})(window.TX);
