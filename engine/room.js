/* ═══════════════════════════════════════════════════════════════════
   DỰNG PHÒNG CHUẨN — mọi phòng đều là khối hộp 15 × 15 × 5,2 m,
   một vật thể trung tâm trên bệ, đèn rọi từ trên xuống.

   Không gian nhỏ có chủ đích: người chơi không được phép lạc,
   và vật thể trung tâm phải luôn nằm trong tầm mắt.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

(function (TX) {
  'use strict';

  TX.KICH_THUOC = { w: 15, d: 15, h: 5.2 };

  /* Bảng màu dùng chung — xem phần Định hướng nghệ thuật trong GDD */
  TX.MAU = {
    nen:      0x07080c,
    nhan:     0xffb469,   // cam ấm: tương tác được, điểm nút, nhiệt
    nhanPhu:  0x4aa3ff,   // xanh lạnh: trạng thái đầu, sự tĩnh
    kimLoai:  0x3a3f4d,
    be:       0x1b1d26
  };

  /* ---------- vỏ phòng ---------- */

  TX.dungVoPhong = function (group, opts) {
    opts = opts || {};
    var K = TX.KICH_THUOC;

    var san = new THREE.Mesh(
      new THREE.PlaneGeometry(K.w, K.d),
      new THREE.MeshStandardMaterial({ color: 0x14151c, roughness: 0.82, metalness: 0.1 })
    );
    san.rotation.x = -Math.PI / 2;
    san.receiveShadow = true;
    group.add(san);

    var matTuong = new THREE.MeshStandardMaterial({
      color: 0x0d0e14, roughness: 0.95, side: THREE.DoubleSide
    });
    function tuong(w, h, x, y, z, ry) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matTuong);
      m.position.set(x, y, z);
      m.rotation.y = ry;
      m.receiveShadow = true;
      group.add(m);
    }
    tuong(K.w, K.h, 0, K.h / 2, -K.d / 2, 0);
    tuong(K.w, K.h, 0, K.h / 2,  K.d / 2, Math.PI);
    tuong(K.d, K.h, -K.w / 2, K.h / 2, 0,  Math.PI / 2);
    tuong(K.d, K.h,  K.w / 2, K.h / 2, 0, -Math.PI / 2);

    var tran = new THREE.Mesh(
      new THREE.PlaneGeometry(K.w, K.d),
      new THREE.MeshStandardMaterial({ color: 0x0a0b10, roughness: 1 })
    );
    tran.rotation.x = Math.PI / 2;
    tran.position.y = K.h;
    group.add(tran);

    /* lưới sàn mảnh — gợi không gian trừu tượng, không phải căn phòng thật */
    var luoi = new THREE.GridHelper(K.w, 30, 0x2a2d3a, 0x1a1c24);
    luoi.position.y = 0.01;
    luoi.material.opacity = 0.35;
    luoi.material.transparent = true;
    group.add(luoi);

    if (opts.bien) TX.dungBien(group, opts.bien[0], opts.bien[1]);
  };

  /* ---------- biển chữ trên tường, vẽ bằng canvas ---------- */

  TX.dungBien = function (group, dongLon, dongNho) {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 256;
    var g = c.getContext('2d');
    g.fillStyle = '#07080c';
    g.fillRect(0, 0, c.width, c.height);
    g.textAlign = 'center';
    try { g.letterSpacing = '14px'; } catch (e) {}
    g.fillStyle = '#ffb469';
    g.font = '600 34px Inter, "Segoe UI", sans-serif';
    g.fillText(dongLon, c.width / 2, 108);
    try { g.letterSpacing = '0px'; } catch (e) {}
    g.fillStyle = '#4a4d59';
    g.font = '400 26px Inter, "Segoe UI", sans-serif';
    g.fillText(dongNho, c.width / 2, 168);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    var bien = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 1.6),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85 })
    );
    bien.position.set(0, 3.1, -TX.KICH_THUOC.d / 2 + 0.05);
    group.add(bien);
    return bien;
  };

  /* ---------- bệ đỡ trung tâm ---------- */

  TX.dungBe = function (group) {
    var be = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.35, 0.9, 48),
      new THREE.MeshStandardMaterial({ color: TX.MAU.be, roughness: 0.6, metalness: 0.35 })
    );
    be.position.y = 0.45;
    be.castShadow = true;
    be.receiveShadow = true;
    group.add(be);
    return be;
  };

  /* ---------- ánh sáng chuẩn ---------- */

  TX.dungAnhSang = function (group, target) {
    group.add(new THREE.AmbientLight(0x2a3040, 0.55));

    var roi = new THREE.SpotLight(0xdce7ff, 1.5, 22, Math.PI / 5, 0.55, 1.4);
    roi.position.set(0, 5.0, 0);
    roi.target = target || group;
    roi.castShadow = true;
    roi.shadow.mapSize.set(1024, 1024);
    group.add(roi);
    if (roi.target !== group && !roi.target.parent) group.add(roi.target);

    var vien = new THREE.DirectionalLight(0x4a6fa8, 0.5);
    vien.position.set(-6, 4, -6);
    group.add(vien);

    return { roi: roi, vien: vien };
  };

  /* ---------- hệ hạt dùng chung ---------- */

  var texCham = null;
  function chamTron() {
    if (texCham) return texCham;
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0,    'rgba(255,255,255,1)');
    grd.addColorStop(0.35, 'rgba(255,255,255,.55)');
    grd.addColorStop(1,    'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    texCham = new THREE.CanvasTexture(c);
    return texCham;
  }

  /* Dùng THREE.Points, không dùng mesh riêng cho từng hạt — xem
     phần Hiệu năng trong GDD. */
  TX.heHat = function (group, soLuong, mau, coHat, doMo) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(soLuong * 3);
    for (var i = 0; i < soLuong; i++) pos[i * 3 + 1] = -99;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    var mat = new THREE.PointsMaterial({
      size: coHat, map: chamTron(), color: mau,
      transparent: true, opacity: doMo,
      depthWrite: false, blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    var pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    group.add(pts);

    return {
      pts: pts, pos: pos,
      vel:  new Float32Array(soLuong * 3),
      life: new Float32Array(soLuong),
      count: soLuong,
      capNhat: function () { geo.attributes.position.needsUpdate = true; },
      an: function (i) { this.life[i] = 0; this.pos[i * 3 + 1] = -99; }
    };
  };

  /* ---------- dọn dẹp ---------- */

  TX.don = function (obj) {
    obj.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        var ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach(function (m) {
          if (m.map && m.map.dispose) m.map.dispose();
          m.dispose();
        });
      }
    });
  };

})(window.TX);
