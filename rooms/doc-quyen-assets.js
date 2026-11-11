/* ═══════════════════════════════════════════════════════════════════
   TÀI NGUYÊN 3D CHO PHÒNG CỜ TỶ PHÚ (doc-quyen)

   Không dùng file mô hình ngoài: mọi thứ dựng bằng mã, nhưng không còn là
   những khối hộp trơn. Các kỹ thuật dùng chung:

   - Bản đồ phản chiếu (env) vẽ từ bầu trời: kim loại, sơn bóng, thủy tinh
     có thứ để phản chiếu. Thiếu nó, vật liệu kim loại tối như màu ô-liu.
   - Vật liệu có vân (gỗ, đá, thép xước) vẽ bằng canvas.
   - Hình tiện (LatheGeometry) cho quân cờ, cột, ly, đèn.
   - Hình đùn có vát cạnh (ExtrudeGeometry) cho hộp bo góc, bánh răng có răng thật.
   - Đảo đá có đáy lởm chởm (đỉnh nón bị xê dịch), cây bụi, đèn.

   Mọi hàm nhận ctx.scene hoặc một Group làm cha và trả về Group / Mesh.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.dqAssets = (function () {
  'use strict';

  var cache = {};

  /* ---------- ngẫu nhiên có hạt giống, để các lần dựng giống nhau ---------- */
  function rnd(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function canvas(w, h, ve) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    ve(c.getContext('2d'), w, h);
    return c;
  }

  function tex(c, lap) {
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    if (lap) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(lap[0], lap[1]); }
    t.dungChung = true;          // dùng chung giữa nhiều vật liệu, TX.don không huỷ
    return t;
  }

  /* ═══════════ bản đồ phản chiếu từ bầu trời ═══════════ */

  function env() {
    if (cache.env) return cache.env;
    /* Bản đồ phản chiếu của VŨ TRỤ: nền xanh đen, một vệt Mặt Trời sáng gắt, ánh xanh lạnh phía thiên hà.
       Kim loại và sơn bóng phản chiếu thứ này nên có ánh nhìn "ngoài không gian". */
    function mat(kieu) {
      return canvas(64, 64, function (g, w, h) {
        var gr = g.createLinearGradient(0, 0, 0, h);
        if (kieu === 'tren') { gr.addColorStop(0, '#0a1030'); gr.addColorStop(1, '#141c46'); }
        else if (kieu === 'duoi') { gr.addColorStop(0, '#0c0a1c'); gr.addColorStop(1, '#171230'); }
        else { gr.addColorStop(0, '#101a44'); gr.addColorStop(0.5, '#1d2a5e'); gr.addColorStop(1, '#0f0c24'); }
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
        if (kieu === 'mat') {            // mặt trời: vệt sáng để có điểm bóng trên kim loại
          var sp = g.createRadialGradient(44, 14, 0, 44, 14, 24);
          sp.addColorStop(0, 'rgba(255,248,225,1)'); sp.addColorStop(1, 'rgba(255,230,170,0)');
          g.fillStyle = sp; g.fillRect(0, 0, w, h);
        }
        if (kieu === 'tren') {
          var th = g.createRadialGradient(20, 40, 0, 20, 40, 28);
          th.addColorStop(0, 'rgba(120,140,255,.5)'); th.addColorStop(1, 'rgba(120,140,255,0)');
          g.fillStyle = th; g.fillRect(0, 0, w, h);
        }
      });
    }
    var side = mat('ben');
    var t = new THREE.CubeTexture([side, side, mat('tren'), mat('duoi'), side, side]);
    t.encoding = THREE.sRGBEncoding;
    t.needsUpdate = true;
    t.dungChung = true;
    cache.env = t;
    return t;
  }

  /* Vật liệu chuẩn: tự gắn bản đồ phản chiếu. kieu 'son' = sơn bóng (clearcoat). */
  function vl(opts, kieu) {
    var o = Object.assign({ roughness: 0.5, metalness: 0.1, envMap: env(), envMapIntensity: 0.9 }, opts);
    if (o.map && o.map.nor && !o.normalMap) {         // ảnh thật có kèm bản đồ pháp tuyến
      o.normalMap = o.map.nor;
      o.normalScale = new THREE.Vector2(0.9, 0.9);
    }
    if (kieu === 'son') {
      o.clearcoat = 0.8; o.clearcoatRoughness = 0.12;
      return new THREE.MeshPhysicalMaterial(o);
    }
    return new THREE.MeshStandardMaterial(o);
  }

  /* ═══════════ vật liệu có vân ═══════════ */

  function texGoVe() {
    if (cache.go) return cache.go;
    var R = rnd(7);
    cache.go = tex(canvas(512, 512, function (g, w, h) {
      var nen = g.createLinearGradient(0, 0, w, 0);
      nen.addColorStop(0, '#8a5a2e'); nen.addColorStop(0.5, '#9c6a38'); nen.addColorStop(1, '#85562b');
      g.fillStyle = nen; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 230; i++) {                   // thớ gỗ
        var y = R() * h, a = 0.04 + R() * 0.14;
        g.strokeStyle = (R() < 0.5 ? 'rgba(60,32,12,' : 'rgba(210,160,100,') + a + ')';
        g.lineWidth = 0.6 + R() * 2.2;
        g.beginPath(); g.moveTo(0, y);
        for (var x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * (2 + R() * 4));
        g.stroke();
      }
      for (var k = 0; k < 5; k++) {                     // mắt gỗ
        var cx = R() * w, cy = R() * h;
        for (var r = 3; r < 20; r += 4) {
          g.strokeStyle = 'rgba(50,28,10,' + (0.2 - r * 0.008) + ')';
          g.beginPath(); g.ellipse(cx, cy, r * 2.2, r, 0, 0, Math.PI * 2); g.stroke();
        }
      }
    }), [1, 1]);
    return cache.go;
  }

  function texDaVe(lap) {
    var kk = 'da' + (lap ? lap.join('x') : '2x2');
    if (cache[kk]) return cache[kk];
    var R = rnd(11);
    return cache[kk] = tex(canvas(512, 512, function (g, w, h) {
      g.fillStyle = '#c9bfab'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 400; i++) {                   // đốm đá
        var x = R() * w, y = R() * h, r = 4 + R() * 38;
        var gr = g.createRadialGradient(x, y, 0, x, y, r);
        var m = R() < 0.5 ? '120,105,85' : '235,226,205';
        gr.addColorStop(0, 'rgba(' + m + ',' + (0.1 + R() * 0.22) + ')');
        gr.addColorStop(1, 'rgba(' + m + ',0)');
        g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
      }
      for (var j = 0; j < 36; j++) {                    // vết nứt
        g.strokeStyle = 'rgba(70,58,44,' + (0.1 + R() * 0.18) + ')';
        g.lineWidth = 0.6 + R();
        g.beginPath();
        var px = R() * w, py = R() * h; g.moveTo(px, py);
        for (var s = 0; s < 6; s++) { px += (R() - 0.5) * 60; py += R() * 40; g.lineTo(px, py); }
        g.stroke();
      }
    }), lap || [2, 2]);
  }

  function texDaHoaVe() {          // đá cẩm thạch trắng vân xám
    if (cache.hoa) return cache.hoa;
    var R = rnd(23);
    cache.hoa = tex(canvas(256, 512, function (g, w, h) {
      g.fillStyle = '#f2eee6'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 14; i++) {
        g.strokeStyle = 'rgba(120,115,120,' + (0.08 + R() * 0.16) + ')';
        g.lineWidth = 0.8 + R() * 2;
        g.beginPath();
        var x = R() * w, y = 0; g.moveTo(x, y);
        while (y < h) { y += 24 + R() * 30; x += (R() - 0.5) * 70; g.lineTo(x, y); }
        g.stroke();
      }
    }), [1, 1]);
    return cache.hoa;
  }

  function texThamVe() {           // thảm cỏ
    if (cache.tham) return cache.tham;
    var R = rnd(5);
    cache.tham = tex(canvas(256, 256, function (g, w, h) {
      g.fillStyle = '#7fae6a'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 1800; i++) {
        g.strokeStyle = (R() < 0.5 ? 'rgba(60,110,50,' : 'rgba(150,200,110,') + (0.25 + R() * 0.4) + ')';
        g.lineWidth = 1;
        var x = R() * w, y = R() * h;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - 0.5) * 5, y - 3 - R() * 6); g.stroke();
      }
    }), [3, 3]);
    return cache.tham;
  }

  function texThepVe() {           // thép xước, cho bánh răng và máy
    if (cache.thep) return cache.thep;
    var R = rnd(3);
    cache.thep = tex(canvas(256, 256, function (g, w, h) {
      g.fillStyle = '#9aa0a8'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 700; i++) {
        var y = R() * h;
        g.strokeStyle = (R() < 0.5 ? 'rgba(255,255,255,' : 'rgba(60,66,76,') + (0.05 + R() * 0.1) + ')';
        g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (R() - 0.5) * 3); g.stroke();
      }
    }), [1, 1]);
    return cache.thep;
  }


  /* ═══════════ ảnh vật liệu thật (Poly Haven, CC0) ═══════════
     Ảnh nằm ở assets/doc-quyen/. Mỗi vật liệu có bản màu (diff) và bản đồ
     pháp tuyến (nor) cho vân nổi. Chưa tải xong hoặc mở bằng file:// bị chặn
     thì dùng bản vẽ canvas ở các hàm ...Ve bên dưới. */

  var THU_MUC_ANH = 'assets/doc-quyen/';

  function anh(ten, lap, veDuPhong, laMau) {
    var t = new THREE.Texture();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (lap) t.repeat.set(lap[0], lap[1]);
    t.anisotropy = 8;
    if (laMau) t.encoding = THREE.sRGBEncoding;
    t.dungChung = true;
    var im = new Image();
    im.onload = function () { t.image = im; t.needsUpdate = true; };
    im.onerror = function () { if (veDuPhong) { t.image = veDuPhong.image; t.needsUpdate = true; } };
    im.src = THU_MUC_ANH + ten;
    return t;
  }

  function vatLieuAnh(khoa, ten, lap, ve) {
    var k = 'foto_' + khoa + (lap ? lap.join('x') : '');
    if (cache[k]) return cache[k];
    var t = anh(ten + '_diff.jpg', lap, ve ? ve() : null, true);
    t.nor = anh(ten + '_nor.jpg', lap, null, false);
    return cache[k] = t;
  }

  function texGo()     { return vatLieuAnh('go', 'go', [1, 1], texGoVe); }
  function texDaHoa()  { return vatLieuAnh('hoa', 'da_hoa', [1, 1], texDaHoaVe); }
  function texTham()   { return vatLieuAnh('co', 'co', [5, 5], texThamVe); }
  function texThep()   { return vatLieuAnh('thep', 'thep', [1, 1], texThepVe); }
  function texDa(lap)  { return vatLieuAnh('da', 'da', lap || [2, 2], function () { return texDaVe(lap); }); }

  /* ═══════════ mô hình 3D thật (Poly Haven, CC0, glTF) ═══════════
     Nạp ngầm ngay khi trang mở (không chặn việc chơi). Khi dựng phòng, nếu mô
     hình đã về thì dùng, chưa về hoặc lỗi thì dùng bản dựng bằng mã làm dự phòng.
       treasure_chest  rương báu, có nắp riêng để mở
       chess_set       quân tốt thật (lấy một quân, nhân bản)
       street_lamp_01  cột đèn đường
       rock_moss_set_01 đá phủ rêu, rải quanh đảo
       metal_office_desk bàn làm việc */

  var MO_HINH = { chest: 'treasure_chest', chess: 'chess_set', lamp: 'street_lamp_01',
                  rock: 'rock_moss_set_01', desk: 'metal_office_desk',
                  door: 'large_castle_door', frame: 'fancy_picture_frame_01',
                  shrub: 'shrub_03', fern: 'fern_02' };
  var kho = {};
  var daBatDauTai = false;

  function taiMoHinh() {
    if (daBatDauTai || !THREE.GLTFLoader) return;
    daBatDauTai = true;
    var L = new THREE.GLTFLoader();
    Object.keys(MO_HINH).forEach(function (k) {
      var id = MO_HINH[k];
      L.load('assets/doc-quyen/models/' + id + '/' + id + '_1k.gltf',
        function (g) { kho[k] = g.scene; },
        undefined,
        function () { /* lỗi hoặc mở bằng file:// → dùng bản dự phòng */ });
    });
  }

  function moHinh(k) { return kho[k] || null; }

  /* ---------- LOD: mô hình thật nặng (rương 100k tam giác, cột đèn 30k, đá 10k+) chỉ hiện
     khi người chơi bay lại gần; ở xa thay bằng bản dựng bằng mã, nhẹ. Nếu không, cả phòng
     lên tới ~1,2 triệu tam giác — quá sức điện thoại. ---------- */
  var danhSachLod = [];
  var _v = new THREE.Vector3();

  function datLaiLod() { danhSachLod = []; }

  function lod(gan, thuc, nhe, khoang) {
    /* Điện thoại / máy cảm ứng: bỏ hẳn mô hình nặng, chỉ giữ bản nhẹ (giữ khung hình mượt). */
    if (TX.camUng) { gan.add(nhe); return gan; }
    thuc.visible = false;
    gan.add(nhe);
    gan.add(thuc);
    danhSachLod.push({ g: gan, thuc: thuc, nhe: nhe, d2: khoang * khoang });
    return gan;
  }

  function capNhatLod(viTri) {
    for (var i = 0; i < danhSachLod.length; i++) {
      var l = danhSachLod[i];
      l.g.getWorldPosition(_v);
      var gan = _v.distanceToSquared(viTri) < l.d2;
      if (l.thuc.visible !== gan) { l.thuc.visible = gan; l.nhe.visible = !gan; }
    }
  }

  /* Nhân bản một mô hình đã nạp; gắn bản đồ phản chiếu cho vật liệu. */
  function nhanBan(k, rieng) {
    var s = kho[k];
    if (!s) return null;
    var c = s.clone(true);
    c.traverse(function (m) {
      if (!m.isMesh) return;
      if (rieng) m.material = m.material.clone();          // cần đổi màu riêng từng bản
      m.material.envMap = env();
      m.material.envMapIntensity = 0.7;
      m.material.needsUpdate = true;
    });
    return c;
  }

  /* Cửa lâu đài hai cánh thật (khung + hai cánh có bản lề hai bên). null nếu chưa nạp. */
  function cuaThat() {
    var d = nhanBan('door');
    if (!d) return null;
    var g = new THREE.Group();
    g.add(d);
    return { g: g, trai: d.getObjectByName('large_castle_door_left'), phai: d.getObjectByName('large_castle_door_right') };
  }

  /* Khung tranh chạm trổ thật, thay bức tranh bằng canvas của mình. null nếu chưa nạp. */
  function khungTranh(texTranh) {
    var f = nhanBan('frame');
    if (!f) return null;
    var cv = f.getObjectByName('fancy_picture_frame_01_canvas');
    if (cv) {
      texTranh.flipY = false;                   // UV của glTF quy ước gốc ở trên
      texTranh.needsUpdate = true;
      cv.material = new THREE.MeshStandardMaterial({ map: texTranh, roughness: 0.8, metalness: 0,
        envMap: env(), envMapIntensity: 0.15 });
    }
    return f;
  }

  /* ═══════════ hình dạng cơ sở ═══════════ */

  /* Hộp bo góc có vát cạnh (nhìn bắt sáng, không còn cứng như khối hộp). */
  function hopTron(parent, w, h, d, r, material, x, y, z) {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001);
    var sh = new THREE.Shape();
    var hw = w / 2, hh = h / 2;
    sh.moveTo(-hw + r, -hh);
    sh.lineTo(hw - r, -hh); sh.quadraticCurveTo(hw, -hh, hw, -hh + r);
    sh.lineTo(hw, hh - r);  sh.quadraticCurveTo(hw, hh, hw - r, hh);
    sh.lineTo(-hw + r, hh); sh.quadraticCurveTo(-hw, hh, -hw, hh - r);
    sh.lineTo(-hw, -hh + r); sh.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    var bv = Math.min(r * 0.6, d * 0.25, 0.02);
    var geo = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.001, d - bv * 2), bevelEnabled: true,
      bevelThickness: bv, bevelSize: bv * 0.9, bevelSegments: 2, curveSegments: 6 });
    geo.center();
    var m = new THREE.Mesh(geo, material);
    m.position.set(x || 0, y || 0, z || 0);
    if (parent) parent.add(m);
    return m;
  }

  /* Tấm nằm ngang: rộng w (x), dày thick (y), sâu d (z). */
  function hopNgang(parent, w, thick, d, r, material, x, y, z) {
    var m = hopTron(null, w, d, thick, r, material, 0, 0, 0);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x || 0, y || 0, z || 0);
    if (parent) parent.add(m);
    return m;
  }

  function lathe(parent, pts, material, seg, x, y, z) {
    var geo = new THREE.LatheGeometry(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), seg || 28);
    var m = new THREE.Mesh(geo, material);
    m.position.set(x || 0, y || 0, z || 0);
    if (parent) parent.add(m);
    return m;
  }

  /* ═══════════ quân cờ: hình tiện như quân tốt thật ═══════════ */

  var PROFIL_QUAN = [[0, 0], [0.15, 0], [0.16, 0.012], [0.155, 0.03], [0.12, 0.05], [0.085, 0.085], [0.06, 0.15],
    [0.052, 0.2], [0.075, 0.215], [0.105, 0.23], [0.105, 0.245], [0.07, 0.258], [0.05, 0.27], [0.062, 0.29],
    [0.085, 0.315], [0.092, 0.345], [0.082, 0.375], [0.055, 0.395], [0.02, 0.405], [0, 0.407]];

  function quanCo(mau) {
    var g = new THREE.Group();
    var cs = kho.chess && kho.chess.getObjectByName('piece_pawn_white_01');
    if (cs) {                                  // quân tốt thật trong bộ cờ vua, nhuộm màu theo từng doanh nghiệp
      var q = cs.clone();
      q.position.set(0, 0, 0);
      q.scale.setScalar(6.3);
      q.material = cs.material.clone();
      q.material.color = new THREE.Color(mau).lerp(new THREE.Color(0xffffff), 0.25);
      q.material.envMap = env();
      q.material.envMapIntensity = 0.6;
      q.material.roughness = 0.4;
      q.castShadow = true;
      g.add(q);
      g.userData.mat = q.material;
      return g;
    }
    var m = vl({ color: mau, roughness: 0.32, metalness: 0.05, envMapIntensity: 0.5 }, 'son');
    var th = lathe(g, PROFIL_QUAN, m, 32);
    th.castShadow = true;
    /* đế lót nỉ */
    var de = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.008, 28),
      new THREE.MeshStandardMaterial({ color: 0x2a2f2a, roughness: 1 }));
    de.position.y = 0.002;
    g.add(de);
    g.userData.mat = m;
    return g;
  }

  /* ═══════════ bánh răng có răng thật ═══════════ */

  function banhRangMoi(r, n, mau, sauDay) {
    var g = new THREE.Group();
    var sh = new THREE.Shape();
    var t = Math.PI * 2 / n, ri = r * 0.82, ro = r * 1.0;
    for (var i = 0; i < n; i++) {
      var a = i * t;
      var p = [[a - t * 0.30, ri], [a - t * 0.17, ro], [a + t * 0.17, ro], [a + t * 0.30, ri]];
      p.forEach(function (q, k) {
        var x = Math.cos(q[0]) * q[1], y = Math.sin(q[0]) * q[1];
        if (i === 0 && k === 0) sh.moveTo(x, y); else sh.lineTo(x, y);
      });
    }
    sh.closePath();
    var lo = new THREE.Path(); lo.absarc(0, 0, r * 0.2, 0, Math.PI * 2, true); sh.holes.push(lo);
    for (var k = 0; k < 5; k++) {                     // lỗ giảm khối lượng giữa nan hoa
      var ak = k * Math.PI * 2 / 5 + 0.3, ho = new THREE.Path();
      ho.absarc(Math.cos(ak) * r * 0.52, Math.sin(ak) * r * 0.52, r * 0.14, 0, Math.PI * 2, true);
      sh.holes.push(ho);
    }
    var geo = new THREE.ExtrudeGeometry(sh, { depth: sauDay || 0.1, bevelEnabled: true, bevelThickness: 0.015,
      bevelSize: 0.012, bevelSegments: 2, curveSegments: 10 });
    geo.translate(0, 0, -(sauDay || 0.1) / 2);
    var m = vl({ color: mau, metalness: 0.85, roughness: 0.32, map: texThep(), envMapIntensity: 1.2 });
    var mesh = new THREE.Mesh(geo, m);
    mesh.castShadow = true;
    g.add(mesh);
    /* chốt giữa */
    var chot = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.12, r * 0.12, (sauDay || 0.1) + 0.06, 16),
      vl({ color: 0x3a342c, metalness: 0.7, roughness: 0.4 }));
    chot.rotation.x = Math.PI / 2;
    g.add(chot);
    /* mâm giữ trục (vành đồng) và 6 bu lông lục giác quanh trục */
    var dong = vl({ color: 0xb98a3c, metalness: 0.9, roughness: 0.3, envMapIntensity: 1.3 });
    [-1, 1].forEach(function (mat0) {
      var dem = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.3, r * 0.3, 0.02, 24), dong);
      dem.rotation.x = Math.PI / 2;
      dem.position.z = mat0 * ((sauDay || 0.1) / 2 + 0.03);
      g.add(dem);
      for (var b = 0; b < 6; b++) {
        var ab = b / 6 * Math.PI * 2;
        var bl = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.04, r * 0.04, 0.03, 6), dong);
        bl.rotation.x = Math.PI / 2;
        bl.position.set(Math.cos(ab) * r * 0.22, Math.sin(ab) * r * 0.22, mat0 * ((sauDay || 0.1) / 2 + 0.05));
        g.add(bl);
      }
    });
    g.userData.mat = m;
    return g;
  }

  /* Đồng hồ áp suất gắn tường: mặt số có vạch, kính phủ, kim quay được (userData.kim). */
  function dongHoApSuat(r) {
    var g = new THREE.Group();
    var kl = vl({ color: 0xc9a24a, metalness: 0.95, roughness: 0.25, envMapIntensity: 1.5 });
    var vien = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.12, 12, 40), kl);
    g.add(vien);
    var mat = tex(canvas(256, 256, function (c, w, h) {
      c.fillStyle = '#f7f1e2'; c.beginPath(); c.arc(128, 128, 126, 0, Math.PI * 2); c.fill();
      c.translate(128, 128);
      for (var i = 0; i <= 20; i++) {
        var an = -Math.PI * 1.25 + i / 20 * Math.PI * 1.5;
        c.strokeStyle = i > 15 ? '#b02a2a' : '#3a2f1e';
        c.lineWidth = i % 5 === 0 ? 5 : 2;
        c.beginPath(); c.moveTo(Math.cos(an) * 100, Math.sin(an) * 100);
        c.lineTo(Math.cos(an) * (i % 5 === 0 ? 78 : 88), Math.sin(an) * (i % 5 === 0 ? 78 : 88)); c.stroke();
      }
      c.fillStyle = '#3a2f1e'; c.font = '700 22px ' + TX.FONT_TIEU_DE; c.textAlign = 'center';
      c.fillText('ÁP LỰC', 0, 56);
    }));
    var mat0 = new THREE.Mesh(new THREE.CircleGeometry(r, 36), new THREE.MeshBasicMaterial({ map: mat }));
    mat0.position.z = -0.002;
    g.add(mat0);
    var kim = new THREE.Group();
    var cay = new THREE.Mesh(new THREE.ConeGeometry(r * 0.04, r * 0.85, 8), new THREE.MeshBasicMaterial({ color: 0xb02a2a }));
    cay.position.y = r * 0.4;
    kim.add(cay);
    kim.position.z = 0.01;
    g.add(kim);
    var chot2 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.08, 10, 8), kl);
    chot2.position.z = 0.015;
    g.add(chot2);
    var kinh = new THREE.Mesh(new THREE.CircleGeometry(r * 0.98, 32),
      new THREE.MeshPhysicalMaterial({ color: 0xdff0fa, transparent: true, opacity: 0.18, roughness: 0.03, envMap: env(), envMapIntensity: 1.6, clearcoat: 1 }));
    kinh.position.z = 0.02;
    g.add(kinh);
    g.userData.kim = kim;
    return g;
  }

  /* Ống đồng thẳng đứng có mặt bích và bu lông. */
  function ongDong(dai) {
    var g = new THREE.Group();
    var kl = vl({ color: 0xb98a3c, metalness: 0.92, roughness: 0.3, envMapIntensity: 1.4 });
    var ong = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dai, 14), kl);
    ong.position.y = dai / 2;
    g.add(ong);
    [0.05, dai * 0.5, dai - 0.05].forEach(function (y) {
      var bich = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.045, 16), kl);
      bich.position.y = y;
      g.add(bich);
      for (var b = 0; b < 4; b++) {
        var ab = b / 4 * Math.PI * 2 + 0.4;
        var bl = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.055, 6), kl);
        bl.position.set(Math.cos(ab) * 0.065, y, Math.sin(ab) * 0.065);
        g.add(bl);
      }
    });
    return g;
  }

  /* Quả cân đồng tiện, có núm cầm. kich = 1 là loại vừa. */
  function quaCan(kich) {
    var g = new THREE.Group();
    var s = kich || 1;
    lathe(g, [[0, 0], [0.09 * s, 0], [0.1 * s, 0.01 * s], [0.1 * s, 0.1 * s], [0.07 * s, 0.13 * s], [0.07 * s, 0.15 * s],
      [0.03 * s, 0.17 * s], [0.035 * s, 0.2 * s], [0.05 * s, 0.225 * s], [0.02 * s, 0.24 * s], [0, 0.24 * s]],
      vl({ color: 0xb98a3c, metalness: 0.92, roughness: 0.3, envMapIntensity: 1.4 }), 22);
    return g;
  }

  /* ═══════════ rương báu ═══════════ */

  /* Rương báu: bản thật (glTF, nắp là một nút riêng) khi lại gần, bản dựng bằng mã khi ở xa.
     userData.nps = danh sách các nắp cần xoay khi mở rương. */
  function ruongBau() {
    var nhe = ruongBauMa();
    var g = new THREE.Group();
    var rb = nhanBan('chest');
    if (!rb) { g.add(nhe); g.userData.nps = [nhe.userData.np]; return g; }
    rb.scale.setScalar(0.7);
    lod(g, rb, nhe, 8.5);
    g.userData.nps = [nhe.userData.np, rb.getObjectByName('treasure_chest_lid')];
    return g;
  }

  function ruongBauMa() {
    var g = new THREE.Group();
    var go = vl({ color: 0xffffff, map: texGo(), roughness: 0.6, metalness: 0.02, envMapIntensity: 0.3 });
    var kl = vl({ color: 0xc9a24a, metalness: 0.9, roughness: 0.28, envMapIntensity: 1.3 });
    hopTron(g, 0.62, 0.3, 0.42, 0.025, go, 0, 0.15, 0);
    /* nắp vòm: bản lề ở mép sau */
    var np = new THREE.Group();
    np.position.set(0, 0.3, -0.21);
    var geoNap = new THREE.CylinderGeometry(0.21, 0.21, 0.62, 22, 1, false, 0, Math.PI);
    geoNap.rotateZ(Math.PI / 2);
    var nap = new THREE.Mesh(geoNap, go);
    nap.position.z = 0.21;
    np.add(nap);
    [-0.22, 0.22].forEach(function (x) {            // đai kim loại ôm nắp
      var geo = new THREE.TorusGeometry(0.214, 0.014, 8, 22, Math.PI);
      geo.rotateY(Math.PI / 2);
      var d = new THREE.Mesh(geo, kl);
      d.position.set(x, 0, 0.21);
      np.add(d);
    });
    g.add(np);
    [-0.22, 0.22].forEach(function (x) {            // đai thân rương
      hopTron(g, 0.04, 0.3, 0.44, 0.01, kl, x, 0.15, 0);
    });
    /* khóa: tấm và lỗ khóa */
    hopTron(g, 0.09, 0.1, 0.03, 0.015, kl, 0, 0.27, 0.215);
    var lk = new THREE.Mesh(new THREE.CircleGeometry(0.014, 12), new THREE.MeshBasicMaterial({ color: 0x1a1208 }));
    lk.position.set(0, 0.268, 0.232);
    g.add(lk);
    /* bốn góc bịt đồng */
    [[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]].forEach(function (p) {
      var c = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), kl);
      c.position.set(p[0], 0.02, p[1]);
      g.add(c);
    });
    g.userData.np = np;
    return g;
  }

  /* ═══════════ cột đá khía rãnh (đài trưng bày hồ sơ) ═══════════ */

  function cotDa(cao) {
    var g = new THREE.Group();
    var m = vl({ color: 0xffffff, map: texDaHoa(), roughness: 0.35, metalness: 0.05, envMapIntensity: 0.8 });
    cao = cao || 1.0;
    lathe(g, [[0, 0], [0.47, 0], [0.47, 0.05], [0.44, 0.07], [0.4, 0.1], [0.36, 0.12], [0.34, 0.13], [0, 0.13]], m, 36);
    var than = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.3, cao - 0.3, 24, 1), m);
    than.position.y = 0.13 + (cao - 0.3) / 2;
    g.add(than);
    for (var i = 0; i < 12; i++) {                     // rãnh dọc thân
      var a = i / 12 * Math.PI * 2;
      var r = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, cao - 0.34, 6),
        vl({ color: 0xcfc8ba, roughness: 0.6 }));
      r.position.set(Math.cos(a) * 0.285, 0.13 + (cao - 0.3) / 2, Math.sin(a) * 0.285);
      g.add(r);
    }
    lathe(g, [[0, cao - 0.17], [0.3, cao - 0.17], [0.34, cao - 0.15], [0.4, cao - 0.1], [0.44, cao - 0.06],
      [0.44, cao - 0.03], [0.4, cao], [0, cao]], m, 36);
    return g;
  }

  /* ═══════════ tập hồ sơ thật: bìa, tab, giấy, dấu mật ═══════════ */

  function hoSo(mauBia, so) {
    var g = new THREE.Group();
    var bia = vl({ color: mauBia, roughness: 0.75, metalness: 0, envMapIntensity: 0.3 });
    var giay = vl({ color: 0xfbf8ef, roughness: 0.95, metalness: 0, envMapIntensity: 0.2 });
    hopTron(g, 0.66, 0.012, 0.86, 0.004, bia, 0, 0, 0);                  // bìa dưới
    for (var i = 0; i < 6; i++) {                                         // chồng giấy so le
      var gi = hopTron(g, 0.6, 0.004, 0.8, 0.002, giay, (i % 2 - 0.5) * 0.008, 0.012 + i * 0.006, (i % 3 - 1) * 0.006);
      gi.rotation.y = (i - 2.5) * 0.012;
    }
    hopTron(g, 0.66, 0.012, 0.86, 0.004, bia, 0, 0.056, 0);               // bìa trên
    hopTron(g, 0.22, 0.012, 0.07, 0.004, bia, 0.18, 0.056, -0.47);        // tab chỉ mục
    /* nhãn dán + dấu "MẬT" in thẳng lên bìa */
    var nhan = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.62), new THREE.MeshBasicMaterial({
      map: tex(canvas(256, 320, function (c, w, h) {
        c.fillStyle = '#fffaf0'; c.fillRect(70, 20, 116, 62);
        c.fillStyle = '#6b5a3a'; c.font = '700 22px ' + TX.FONT_TIEU_DE; c.textAlign = 'center';
        c.fillText('HỒ SƠ', 128, 48); c.font = '700 26px ' + TX.FONT_TIEU_DE; c.fillText('Số ' + so, 128, 74);
        c.save(); c.translate(128, 190); c.rotate(-0.35);
        c.strokeStyle = '#b02a2a'; c.lineWidth = 6; c.strokeRect(-92, -34, 184, 68);
        c.fillStyle = '#b02a2a'; c.font = '700 54px ' + TX.FONT_TIEU_DE; c.fillText('MẬT', 0, 18);
        c.restore();
      })), transparent: true, depthWrite: false
    }));
    nhan.rotation.x = -Math.PI / 2;
    nhan.position.y = 0.0635;
    g.add(nhan);
    /* kẹp giấy */
    var kep = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.004, 6, 14, Math.PI * 1.6),
      vl({ color: 0xc8ccd2, metalness: 0.9, roughness: 0.3 }));
    kep.rotation.x = Math.PI / 2;
    kep.position.set(-0.28, 0.07, -0.36);
    g.add(kep);
    return g;
  }

  /* ═══════════ đĩa cân có dây xích ═══════════ */

  function diaCan(mau) {
    var g = new THREE.Group();
    var kl = vl({ color: 0xc9a24a, metalness: 0.9, roughness: 0.3, envMapIntensity: 1.2 });
    var dia = lathe(g, [[0, -0.05], [0.12, -0.045], [0.24, -0.015], [0.3, 0.02], [0.3, 0.035], [0.285, 0.035],
      [0.23, 0.005], [0.12, -0.03], [0, -0.035]],
      vl({ color: mau, metalness: 0.5, roughness: 0.35, envMapIntensity: 1.1 }), 28, 0, -0.34, 0);
    for (var i = 0; i < 3; i++) {                      // ba sợi xích về điểm treo
      var a = i / 3 * Math.PI * 2 + 0.5;
      var x = Math.cos(a) * 0.27, z = Math.sin(a) * 0.27;
      var dai = Math.hypot(0.34, Math.hypot(x, z));
      var xich = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, dai, 5), kl);
      /* sợi xích đi từ mép đĩa (x,-0.32,z) lên móc (0,0,0) */
      xich.position.set(x / 2, -0.16, z / 2);
      xich.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-x, 0.32, -z).normalize());
      g.add(xich);
    }
    var moc = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 6, 14), kl);
    moc.position.y = 0.02;
    g.add(moc);
    return g;
  }

  /* ═══════════ cửa gỗ có ô nổi, tay nắm đồng ═══════════ */

  function canhCua() {
    var g = new THREE.Group();
    var go = vl({ color: 0xffffff, map: texGo(), roughness: 0.55, metalness: 0.02, envMapIntensity: 0.4 });
    var goToi = vl({ color: 0xd6b48a, map: texGo(), roughness: 0.5, metalness: 0.02, envMapIntensity: 0.4 });
    hopTron(g, 1.7, 2.8, 0.09, 0.02, go, 0.85, 1.4, 0);
    [0.45, 1.25].forEach(function (x) {                 // bốn ô nổi, hai cột hai hàng
      [2.0, 0.85].forEach(function (y) { hopTron(g, 0.62, 0.9, 0.03, 0.025, goToi, x, y, 0.055); });
    });
    return g;
  }

  function tayNam() {
    var g = new THREE.Group();
    var kl = vl({ color: 0xd8b25a, metalness: 0.95, roughness: 0.22, envMapIntensity: 1.5 });
    hopTron(g, 0.08, 0.2, 0.012, 0.02, kl, 0, 0, 0);            // đế
    lathe(g, [[0, 0], [0.045, 0], [0.045, 0.02], [0.03, 0.03], [0.026, 0.06], [0.04, 0.075], [0.056, 0.1],
      [0.05, 0.125], [0.03, 0.14], [0, 0.145]], kl, 20, 0, 0, 0).rotation.x = Math.PI / 2;
    return g;
  }

  function banLamViec() {
    var g = new THREE.Group();
    var bt = nhanBan('desk');
    if (bt) {                                   // bàn văn phòng kim loại thật
      bt.scale.setScalar(0.66);
      g.add(bt);
      return g;
    }
    var go = vl({ color: 0xffffff, map: texGo(), roughness: 0.5, metalness: 0.02, envMapIntensity: 0.4 });
    hopTron(g, 0.62, 0.04, 0.34, 0.015, go, 0, 0.36, 0);
    [[-0.27, -0.13], [0.27, -0.13], [-0.27, 0.13], [0.27, 0.13]].forEach(function (p) {
      var c = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.34, 8), go);
      c.position.set(p[0], 0.17, p[1]);
      g.add(c);
    });
    /* đèn bàn nhỏ */
    var den = vl({ color: 0x2a6a4a, metalness: 0.5, roughness: 0.3 });
    lathe(g, [[0, 0], [0.05, 0], [0.05, 0.01], [0.012, 0.02], [0.01, 0.16]], den, 12, 0.22, 0.38, 0);
    var chao = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.06, 14, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x2a6a4a, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.4 }));
    chao.position.set(0.22, 0.56, 0);
    g.add(chao);
    var bong = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff0b0 }));
    bong.position.set(0.22, 0.54, 0);
    g.add(bong);
    /* tập giấy trên bàn */
    hopTron(g, 0.14, 0.012, 0.2, 0.004, vl({ color: 0xfbf8ef, roughness: 0.95 }), -0.12, 0.388, 0.02);
    return g;
  }

  /* ═══════════ cây bụi, đèn, đá: sống động cho đảo ═══════════ */

  function bui(R, co) {
    var g = new THREE.Group();
    var xanh = [0x5f9a54, 0x6fae5e, 0x4f8a4c];
    for (var i = 0; i < 4; i++) {
      var m = new THREE.Mesh(new THREE.IcosahedronGeometry(co * (0.55 + R() * 0.35), 1),
        vl({ color: xanh[i % 3], roughness: 0.85, metalness: 0, envMapIntensity: 0.3, flatShading: true }));
      m.position.set((R() - 0.5) * co, co * 0.45 + R() * co * 0.3, (R() - 0.5) * co);
      g.add(m);
    }
    return g;
  }

  function cayNho(R) {
    var g = new THREE.Group();
    lathe(g, [[0, 0], [0.09, 0], [0.07, 0.4], [0.05, 0.9], [0, 0.95]],
      vl({ color: 0x7a5a3a, roughness: 0.9, metalness: 0, envMapIntensity: 0.2 }), 8);
    var la = [0x6fae5e, 0x5f9a54, 0x84bc6a];
    for (var i = 0; i < 5; i++) {
      var m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42 - i * 0.03, 1),
        vl({ color: la[i % 3], roughness: 0.85, metalness: 0, envMapIntensity: 0.3, flatShading: true }));
      m.position.set((R() - 0.5) * 0.5, 1.0 + i * 0.12 + R() * 0.2, (R() - 0.5) * 0.5);
      g.add(m);
    }
    return g;
  }

  function denTru(mau) {
    var nhe = denTruMa(mau);
    var dt = nhanBan('lamp');
    if (!dt) return nhe;
    var g = new THREE.Group();                   // cột đèn đường thật khi lại gần
    var thuc = new THREE.Group();
    dt.scale.setScalar(0.44);
    thuc.add(dt);
    var qua0 = new THREE.Sprite(new THREE.SpriteMaterial({ map: quangTron(), color: mau || 0xfff0b0,
      transparent: true, opacity: 0.5, depthWrite: false }));
    qua0.scale.set(1.5, 1.5, 1);
    qua0.position.y = 1.62;
    thuc.add(qua0);
    return lod(g, thuc, nhe, 9);
  }

  function denTruMa(mau) {
    var g = new THREE.Group();
    var kl = vl({ color: 0x3a3630, metalness: 0.8, roughness: 0.4 });
    lathe(g, [[0, 0], [0.12, 0], [0.12, 0.06], [0.05, 0.1], [0.035, 0.2], [0.03, 1.5], [0.05, 1.56], [0.1, 1.6]], kl, 14);
    var cau = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10),
      new THREE.MeshBasicMaterial({ color: mau || 0xfff0b0 }));
    cau.position.y = 1.72;
    g.add(cau);
    var qua = new THREE.Sprite(new THREE.SpriteMaterial({ map: quangTron(), color: mau || 0xfff0b0,
      transparent: true, opacity: 0.55, depthWrite: false }));
    qua.scale.set(1.3, 1.3, 1);
    qua.position.y = 1.72;
    g.add(qua);
    return g;
  }

  function quangTron() {
    if (cache.quang) return cache.quang;
    cache.quang = tex(canvas(64, 64, function (g) {
      var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    }));
    return cache.quang;
  }

  /* ═══════════ hòn đảo bay: đĩa đá, đáy lởm chởm, cây, đèn ═══════════ */

  function daoBay(r, sau, seed, kieu) {
    var R = rnd(seed || 1);
    var g = new THREE.Group();
    var da = vl({ color: 0xffffff, map: texDa([2, 1]), roughness: 0.92, metalness: 0, envMapIntensity: 0.25, flatShading: true });

    /* đáy: hình nón nhiều mặt, đỉnh bị xê dịch theo nhiễu để thành mỏm đá */
    var non = new THREE.ConeGeometry(r * 0.97, sau, 26, 7, true);
    var p = non.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var t = 1 - (y + sau / 2) / sau;                  // 0 ở đỉnh nón, 1 ở sát mặt đĩa
      var k = 0.18 * (1 - t) + 0.05;
      var n = Math.sin(x * 2.3 + seed) * Math.cos(z * 2.1 - seed) + Math.sin(y * 3.1 + x);
      p.setXYZ(i, x * (1 + n * k), y + n * 0.18 * (1 - t), z * (1 + n * k));
    }
    non.computeVertexNormals();
    var m = new THREE.Mesh(non, da);
    m.rotation.x = Math.PI;
    m.position.y = -0.5 - sau / 2;
    m.material.side = THREE.DoubleSide;
    g.add(m);
    /* vài mỏm nhỏ phụ bên dưới */
    for (var j = 0; j < 4; j++) {
      var s = sau * (0.25 + R() * 0.25);
      var c = new THREE.Mesh(new THREE.ConeGeometry(r * (0.12 + R() * 0.1), s, 7, 1), da);
      c.rotation.x = Math.PI;
      var a = R() * Math.PI * 2, rr = r * (0.3 + R() * 0.45);
      c.position.set(Math.cos(a) * rr, -0.5 - s / 2 - sau * 0.2 * R(), Math.sin(a) * rr);
      g.add(c);
    }
    /* mép đĩa: lớp đá dày + viền vàng */
    var dia = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.95, 0.55, 40),
      vl({ color: 0xece5d6, roughness: 0.45, metalness: 0.05, map: texDaHoa(), envMapIntensity: 0.6 }));
    dia.position.y = -0.275;
    g.add(dia);
    var vien = new THREE.Mesh(new THREE.TorusGeometry(r, 0.045, 10, 72),
      vl({ color: 0xc9a24a, metalness: 0.9, roughness: 0.3, envMapIntensity: 1.2 }));
    vien.rotation.x = Math.PI / 2;
    g.add(vien);

    /* đá phủ rêu thật bám quanh rìa đảo */
    if (kho.rock) {
      var dem = ['rock_moss_set_01_rock01', 'rock_moss_set_01_rock02', 'rock_moss_set_01_rock03',
                 'rock_moss_set_01_rock04', 'rock_moss_set_01_rock05', 'rock_moss_set_01_rock06'];
      var soDa = kieu === 'giua' ? 9 : 5;
      for (var ri = 0; ri < soDa; ri++) {
        var nd = kho.rock.getObjectByName(dem[ri % dem.length]);
        if (!nd) continue;
        var rk = nd.clone();
        rk.position.set(0, 0, 0);
        var ang = (ri / soDa) * Math.PI * 2 + R() * 0.5;
        var sc = (kieu === 'giua' ? 0.42 : 0.3) * (0.7 + R() * 0.6);
        rk.scale.setScalar(sc);
        rk.rotation.y = R() * 6.28;
        var rrad = r - 0.1 + R() * 0.2;
        var holder = new THREE.Group();
        holder.position.set(Math.cos(ang) * rrad, 0.05, Math.sin(ang) * rrad);
        rk.material = nd.material.clone();
        rk.material.envMap = env(); rk.material.envMapIntensity = 0.3;
        /* bản nhẹ khi ở xa: khối đá nhiều mặt phủ ảnh đá */
        var daNhe = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1),
          vl({ color: 0x8a8272, map: texDa([1, 1]), roughness: 0.95, metalness: 0, flatShading: true, envMapIntensity: 0.2 }));
        daNhe.scale.set(sc * 1.5, sc * 0.95, sc * 1.4);
        daNhe.position.y = sc * 0.3;
        daNhe.rotation.y = rk.rotation.y;
        lod(holder, rk, daNhe, 8);
        g.add(holder);
      }
    }

    if (kieu !== 'giua') {
      /* mặt cỏ lõm vào trong + bụi cây + cây + đèn trụ ở rìa */
      var co = new THREE.Mesh(new THREE.CircleGeometry(r - 0.18, 40),
        vl({ color: 0xffffff, map: texTham(), roughness: 1, metalness: 0, envMapIntensity: 0.15 }));
      co.rotation.x = -Math.PI / 2;
      co.position.y = 0.012;
      g.add(co);
      for (var b = 0; b < 6; b++) {
        var ang = Math.PI * (0.5 + 1.0 * (b / 5)) + 0.0;       // nửa sau của đảo (xa tâm phòng)
        var bu = bui(R, 0.34 + R() * 0.2);
        var chuaBu = new THREE.Group();
        chuaBu.position.set(Math.cos(ang) * (r - 0.55), 0, Math.sin(ang) * (r - 0.55) - 0.0);
        var thatBu = nhanBan('shrub');                     // bụi cây thật khi lại gần
        if (thatBu) {
          thatBu.scale.setScalar(2.2 + R() * 0.8);
          thatBu.rotation.y = R() * 6.28;
          lod(chuaBu, thatBu, bu, 11);
        } else chuaBu.add(bu);
        g.add(chuaBu);
        if (kho.fern && b % 2 === 0) {                     // thêm dương xỉ thật xen giữa (chỉ khi lại gần)
          var duongXi = nhanBan('fern');
          duongXi.scale.setScalar(0.9 + R() * 0.4);
          duongXi.rotation.y = R() * 6.28;
          var chuaXi = new THREE.Group();
          chuaXi.position.set(Math.cos(ang + 0.22) * (r - 0.9), 0, Math.sin(ang + 0.22) * (r - 0.9));
          lod(chuaXi, duongXi, new THREE.Group(), 9);
          g.add(chuaXi);
        }
      }
      var cay = cayNho(R); cay.position.set(-(r - 0.9), 0, -(r - 1.2)); cay.scale.setScalar(1.15); g.add(cay);
      var cay2 = cayNho(R); cay2.position.set(r - 1.0, 0, -(r - 1.0)); cay2.scale.setScalar(0.9); g.add(cay2);
      var d1 = denTru(0xfff0b0); d1.position.set(r - 0.5, 0, 0.9); d1.scale.setScalar(0.9); g.add(d1);
    } else {
      /* đảo giữa: vòng đèn trụ quanh rìa */
      for (var q = 0; q < 8; q++) {
        var aq = q / 8 * Math.PI * 2 + 0.2;
        var dd = denTru(0xfff0b0); dd.position.set(Math.cos(aq) * (r - 0.35), 0, Math.sin(aq) * (r - 0.35)); dd.scale.setScalar(0.75);
        g.add(dd);
      }
    }
    return g;
  }

  /* ═══════════ cầu thang xoắn: bậc đá vát cạnh, cột, tay vịn đồng ═══════════ */

  function cauThangXoan(soBac, banKinh, cao) {
    var g = new THREE.Group();
    var cotM = vl({ color: 0xffffff, map: texDaHoa(), roughness: 0.35, metalness: 0.05, envMapIntensity: 0.7 });
    var cot = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, cao, 18), cotM);
    cot.position.y = cao / 2;
    g.add(cot);
    lathe(g, [[0, 0], [0.34, 0], [0.34, 0.06], [0.2, 0.12], [0.13, 0.2], [0, 0.2]], cotM, 24);
    var bac = [];
    var buoc = 0.4, dY = (cao - 0.4) / soBac;
    for (var i = 0; i < soBac; i++) {
      var a = i * buoc;
      var mat = vl({ color: 0xcfc8ba, map: texDa([1, 1]), roughness: 0.55, metalness: 0.05, envMapIntensity: 0.5,
        transparent: true, opacity: 0.45, emissive: 0x000000 });
      var b = hopTron(null, 0.88, 0.36, 0.1, 0.045, mat, 0, 0, 0);
      b.rotation.x = -Math.PI / 2;                   // nằm ngang, mặt rộng hướng lên
      var khung = new THREE.Group();
      khung.position.set(Math.cos(a) * banKinh, 0.15 + i * dY, Math.sin(a) * banKinh);
      khung.rotation.y = -a;
      khung.add(b);
      g.add(khung);
      bac.push({ m: khung, mat: mat });
    }
    /* tay vịn: ống chạy theo đường xoắn, mép ngoài bậc */
    var pts = [];
    for (var k = 0; k <= soBac * 4; k++) {
      var t = k / 4, ak = t * buoc;
      pts.push(new THREE.Vector3(Math.cos(ak) * (banKinh + 0.4), 0.15 + t * dY + 0.62, Math.sin(ak) * (banKinh + 0.4)));
    }
    var vay = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), soBac * 6, 0.022, 8, false),
      vl({ color: 0xc9a24a, metalness: 0.9, roughness: 0.28, envMapIntensity: 1.3 }));
    g.add(vay);
    /* trụ lan can tiện (hình bình), mỗi hai bậc một trụ */
    var kimLoai = vl({ color: 0xc9a24a, metalness: 0.9, roughness: 0.3, envMapIntensity: 1.3 });
    var hinhTru = [[0, 0], [0.018, 0], [0.02, 0.03], [0.012, 0.06], [0.012, 0.16], [0.026, 0.25], [0.03, 0.31], [0.026, 0.37],
                   [0.012, 0.46], [0.012, 0.56], [0.02, 0.6], [0.016, 0.62], [0, 0.62]];
    for (var s = 0; s < soBac; s += 2) {
      var as = s * buoc;
      lathe(g, hinhTru, kimLoai, 8, Math.cos(as) * (banKinh + 0.4), 0.15 + s * dY, Math.sin(as) * (banKinh + 0.4));
    }
    /* mũi bậc bằng đồng, chống trượt */
    for (var nb = 0; nb < soBac; nb++) {
      var anb = nb * buoc;
      var mui = hopTron(null, 0.9, 0.025, 0.03, 0.01, kimLoai, 0, 0, 0);
      mui.rotation.x = -Math.PI / 2;
      mui.position.set(0, 0.052, 0.18);
      bac[nb].m.add(mui);
    }
    /* trụ đầu cầu thang: bình tiện, nắp cầu */
    var tru0 = hinhTru.map(function (q) { return [q[0] * 2.4, q[1] * 1.8]; });
    lathe(g, tru0, kimLoai, 12, banKinh + 0.4, 0, 0.0);
    var cau = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), kimLoai);
    cau.position.set(banKinh + 0.4, 1.17, 0);
    g.add(cau);
    /* ba đai đồng quanh cột giữa */
    [0.8, cao * 0.5, cao - 0.5].forEach(function (y) {
      var dai = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 8, 24), kimLoai);
      dai.rotation.x = Math.PI / 2;
      dai.position.y = y;
      g.add(dai);
    });
    g.userData.bac = bac;
    return g;
  }

  /* ═══════════ máy bán hàng nhận thẻ ═══════════ */

  function mayBanHang(chuMay, chuKhe, mauThe) {
    var g = new THREE.Group();
    var son = vl({ color: 0x2f4a82, roughness: 0.3, metalness: 0.35, envMapIntensity: 1.1 }, 'son');
    var kl = vl({ color: 0xc9a24a, metalness: 0.9, roughness: 0.28, envMapIntensity: 1.3 });
    var den = vl({ color: 0x1a2236, roughness: 0.5, metalness: 0.4 });
    var thep = vl({ color: 0xffffff, map: texThep(), metalness: 0.9, roughness: 0.35, envMapIntensity: 1.2 });

    /* thân máy bo góc, mũ trên, chân đế */
    hopTron(g, 1.7, 2.7, 1.1, 0.12, son, 0, 1.5, 0);
    hopTron(g, 1.82, 0.16, 1.22, 0.07, kl, 0, 2.93, 0);
    hopTron(g, 1.84, 0.16, 1.24, 0.06, den, 0, 0.1, 0);
    [[-0.78, -0.5], [0.78, -0.5], [-0.78, 0.5], [0.78, 0.5]].forEach(function (p) {
      var c = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.1, 10), thep);
      c.position.set(p[0], 0.03, p[1]);
      g.add(c);
    });

    /* biển đèn trên nóc: hộp sáng có chữ */
    var bienTex = tex(canvas(512, 128, function (c, w, h) {
      var gr = c.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, '#fff6d8'); gr.addColorStop(1, '#ffe39a');
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = '#4a3410'; c.textAlign = 'center'; c.font = '700 54px ' + TX.FONT_TIEU_DE;
      c.fillText(chuMay, w / 2, 82);
    }));
    var bien = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.3), new THREE.MeshBasicMaterial({ map: bienTex }));
    bien.position.set(0, 2.72, 0.556);
    g.add(bien);
    hopTron(g, 1.5, 0.4, 0.04, 0.03, kl, 0, 2.72, 0.54);

    /* cửa kính: khung đồng + kính phản chiếu + các ngăn có thẻ */
    hopTron(g, 1.3, 1.0, 0.05, 0.03, kl, -0.12, 2.0, 0.55);
    hopTron(g, 1.2, 0.9, 0.03, 0.02, den, -0.12, 2.0, 0.57);
    var o = { theCho: [] };
    for (var r = 0; r < 3; r++) {                     // kệ
      hopTron(g, 1.16, 0.018, 0.2, 0.006, thep, -0.12, 1.66 + r * 0.3, 0.64);
    }
    for (var k = 0; k < 4; k++) {                     // bốn thẻ chờ trên kệ giữa, dựng nghiêng
      var the = hopTron(g, 0.22, 0.32, 0.01, 0.015,
        new THREE.MeshStandardMaterial({ color: mauThe[k], transparent: true, opacity: 0.4, roughness: 0.4 }), -0.56 + k * 0.29, 1.87, 0.66);
      the.rotation.x = -0.15;
      o.theCho.push(the);
    }
    var kinh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.9),
      new THREE.MeshPhysicalMaterial({ color: 0xcfe6f6, transparent: true, opacity: 0.22, roughness: 0.04,
        metalness: 0.1, envMap: env(), envMapIntensity: 1.6, clearcoat: 1 }));
    kinh.position.set(-0.12, 2.0, 0.725);
    g.add(kinh);

    /* bảng điều khiển bên phải: màn hình, bàn phím, khe thẻ */
    hopTron(g, 0.34, 1.9, 0.06, 0.03, den, 0.6, 1.72, 0.55);
    var manHinh = tex(canvas(128, 96, function (c, w, h) {
      c.fillStyle = '#071a18'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#5affc6'; c.font = '700 15px monospace'; c.textAlign = 'center';
      c.fillText('NẠP THẺ', w / 2, 34); c.fillText('BẰNG CHỨNG', w / 2, 58);
      c.fillStyle = '#2f9e7a'; c.fillRect(20, 72, 88, 3);
    }));
    var mh = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.2), new THREE.MeshBasicMaterial({ map: manHinh }));
    mh.position.set(0.6, 2.35, 0.585);
    g.add(mh);
    for (var i = 0; i < 4; i++) for (var j = 0; j < 3; j++) {     // bàn phím 3×4
      var ph = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.02, 14), thep);
      ph.rotation.x = Math.PI / 2;
      ph.position.set(0.5 + j * 0.1, 2.05 - i * 0.1, 0.585);
      g.add(ph);
    }
    /* khe nhận thẻ: khung đồng, lòng đen, vệt sáng */
    hopTron(g, 1.14, 0.2, 0.06, 0.04, kl, -0.06, 1.38, 0.57);
    hopTron(g, 1.0, 0.1, 0.04, 0.03, den, -0.06, 1.38, 0.6);
    var khe = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.035, 0.03), new THREE.MeshBasicMaterial({ color: 0xffc552 }));
    khe.position.set(-0.06, 1.38, 0.63);
    g.add(khe);
    var chuKheTex = tex(canvas(512, 64, function (c, w, h) {
      c.fillStyle = 'rgba(255,240,200,.95)'; c.textAlign = 'center'; c.font = '600 30px ' + TX.FONT_TIEU_DE;
      c.fillText('↓ ' + chuKhe + ' ↓', w / 2, 42);
    }));
    var ck = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.11), new THREE.MeshBasicMaterial({ map: chuKheTex, transparent: true }));
    ck.position.set(-0.06, 1.55, 0.605);
    g.add(ck);

    /* đèn tiến độ: bốn viên ngọc trên ngực máy */
    o.denMay = [];
    for (var d = 0; d < 4; d++) {
      var vong = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 20), kl);
      vong.position.set(-0.5 + d * 0.33, 1.14, 0.57);
      g.add(vong);
      var vn = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 12), new THREE.MeshBasicMaterial({ color: 0x555d70 }));
      vn.position.set(-0.5 + d * 0.33, 1.14, 0.575);
      vn.scale.z = 0.6;
      g.add(vn);
      o.denMay.push(vn);
    }
    /* cửa lấy hàng: nắp bản lề màu khói */
    hopTron(g, 1.2, 0.3, 0.06, 0.03, kl, 0, 0.55, 0.56);
    hopTron(g, 1.1, 0.22, 0.04, 0.03, new THREE.MeshStandardMaterial({ color: 0x0c1220, transparent: true, opacity: 0.85, roughness: 0.2 }), 0, 0.55, 0.59);
    /* lò xo xoắn giữ thẻ trên mỗi kệ, thẻ giá nhỏ dưới mỗi ngăn */
    var dayThep = vl({ color: 0xcfd3d8, metalness: 0.95, roughness: 0.3, envMapIntensity: 1.2 });
    for (var kk = 0; kk < 3; kk++) for (var ng = 0; ng < 4; ng++) {
      var diem = [];
      for (var q = 0; q <= 40; q++) {
        var tq = q / 40;
        diem.push(new THREE.Vector3(Math.cos(tq * Math.PI * 8) * 0.03, Math.sin(tq * Math.PI * 8) * 0.03, tq * 0.18));
      }
      var lo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(diem), 40, 0.004, 5, false), dayThep);
      lo.position.set(-0.56 + ng * 0.29, 1.69 + kk * 0.3, 0.55);
      g.add(lo);
    }
    for (var gi = 0; gi < 4; gi++) {
      var thGia = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.05), new THREE.MeshBasicMaterial({
        map: tex(canvas(128, 64, function (c, w, h) {
          c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h);
          c.fillStyle = '#2a2418'; c.font = '700 40px monospace'; c.textAlign = 'center';
          c.fillText('A' + (gi + 1), w / 2, 46);
        }))
      }));
      thGia.position.set(-0.56 + gi * 0.29, 1.59, 0.745);
      g.add(thGia);
    }
    /* khe thoát khí hai bên hông, lưới tản nhiệt dưới đáy */
    [-1, 1].forEach(function (sd) {
      for (var lv = 0; lv < 9; lv++) {
        var la = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.025, 0.7), den);
        la.position.set(sd * 0.86, 0.6 + lv * 0.07, 0);
        la.rotation.z = sd * 0.35;
        g.add(la);
      }
    });
    for (var gl = 0; gl < 7; gl++) hopTron(g, 1.3, 0.02, 0.02, 0.008, den, 0, 0.3 + gl * 0.035, 0.575);
    /* nút trả xu đỏ, khe xu nhỏ, huy hiệu vàng trên mũ máy */
    var nutDo = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 18),
      vl({ color: 0xc8302f, roughness: 0.3, metalness: 0.2 }, 'son'));
    nutDo.rotation.x = Math.PI / 2;
    nutDo.position.set(0.6, 1.3, 0.585);
    g.add(nutDo);
    hopTron(g, 0.18, 0.025, 0.02, 0.01, den, 0.6, 1.42, 0.585);
    var huyHieu = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), new THREE.MeshBasicMaterial({
      map: tex(canvas(128, 128, function (c) {
        var gr = c.createRadialGradient(64, 64, 6, 64, 64, 62);
        gr.addColorStop(0, '#fff3c0'); gr.addColorStop(1, '#c9a24a');
        c.fillStyle = gr; c.beginPath(); c.arc(64, 64, 62, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#6b4d12'; c.font = '700 72px ' + TX.FONT_TIEU_DE; c.textAlign = 'center'; c.fillText('✦', 64, 86);
      }))
    }));
    huyHieu.position.set(-0.7, 2.93, 0.62);
    huyHieu.rotation.x = -Math.PI / 2 + 0.0;
    huyHieu.position.y = 3.015;
    huyHieu.position.z = 0.0;
    huyHieu.position.x = 0.0;
    g.add(huyHieu);
    /* dải đèn LED viền khung kính */
    var ledM = new THREE.MeshBasicMaterial({ color: 0xfff2c0 });
    hopTron(g, 1.26, 0.012, 0.01, 0.004, ledM, -0.12, 2.49, 0.59);
    hopTron(g, 1.26, 0.012, 0.01, 0.004, ledM, -0.12, 1.51, 0.59);
    hopTron(g, 0.012, 0.98, 0.01, 0.004, ledM, -0.75, 2.0, 0.59);
    hopTron(g, 0.012, 0.98, 0.01, 0.004, ledM, 0.51, 2.0, 0.59);
    /* dây điện cắm phía sau thả xuống đất */
    var cap = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.3, 0.4, -0.55), new THREE.Vector3(0.38, 0.12, -0.75),
      new THREE.Vector3(0.7, 0.02, -1.0), new THREE.Vector3(1.2, 0.02, -1.3)]), 24, 0.018, 6, false),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }));
    g.add(cap);
    o.group = g; o.kheSang = khe;
    return o;
  }

  /* ═══════════ xúc xắc, xu, nhà nhỏ trên bàn cờ ═══════════ */

  function xucXac(cho) {
    var c = canvas(256, 256, function (g, w, h) {
      g.fillStyle = '#fbf6ec'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#d9cfba'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
      g.fillStyle = '#c8302f';
      var m = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]],
        5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] }[cho];
      m.forEach(function (p) { g.beginPath(); g.arc(64 + p[0] * 64, 64 + p[1] * 64, 18, 0, Math.PI * 2); g.fill(); });
    });
    var t = tex(c);
    var m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.35, envMap: env(), envMapIntensity: 0.6 });
    var bx = hopTron(null, 0.16, 0.16, 0.16, 0.025, m, 0, 0.08, 0);
    return bx;
  }

  function chongXu(n, mau) {
    var g = new THREE.Group();
    var m = vl({ color: mau || 0xe0b23a, metalness: 0.95, roughness: 0.25, envMapIntensity: 1.4 });
    for (var i = 0; i < n; i++) {
      var x = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.014, 20), m);
      x.position.set((i % 3 === 0 ? 0.004 : -0.003), 0.007 + i * 0.0145, (i % 2 ? 0.003 : -0.002));
      x.rotation.y = i * 0.7;
      g.add(x);
    }
    return g;
  }

  function nhaNho(mau, to) {
    var g = new THREE.Group();
    var tuong = vl({ color: mau, roughness: 0.55, metalness: 0.05, envMapIntensity: 0.4 });
    var w = to ? 0.17 : 0.1;
    var th = new THREE.Mesh(new THREE.BoxGeometry(w, w * 0.8, w * 0.8), tuong);
    th.position.y = w * 0.4;
    g.add(th);
    var mai = new THREE.Mesh(new THREE.ConeGeometry(w * 0.82, w * 0.5, 4),
      vl({ color: to ? 0xc2392b : 0x7a4a2a, roughness: 0.6 }));
    mai.rotation.y = Math.PI / 4;
    mai.scale.z = 0.8;
    mai.position.y = w * 0.8 + w * 0.25;
    g.add(mai);
    return g;
  }

  taiMoHinh();

  return {
    cuaThat: cuaThat, khungTranh: khungTranh, moHinh: moHinh, datLaiLod: datLaiLod, capNhatLod: capNhatLod,
    env: env, vl: vl, rnd: rnd, canvas: canvas, tex: tex,
    texGo: texGo, texDa: texDa, texDaHoa: texDaHoa, texThep: texThep,
    hopTron: hopTron, lathe: lathe,
    quanCo: quanCo, banhRang: banhRangMoi, ruongBau: ruongBau, cotDa: cotDa, hoSo: hoSo,
    diaCan: diaCan, canhCua: canhCua, tayNam: tayNam, banLamViec: banLamViec,
    dongHoApSuat: dongHoApSuat, ongDong: ongDong, quaCan: quaCan, daoBay: daoBay, cauThangXoan: cauThangXoan, mayBanHang: mayBanHang,
    hopNgang: hopNgang, xucXac: xucXac, chongXu: chongXu, nhaNho: nhaNho, denTru: denTru
  };
})();
