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

  TX.FONT_FANTASY = '"Cormorant Garamond", "Cormorant", Georgia, "Times New Roman", serif';

  /* Tiêu đề trên biển cửa: serif có dấu tiếng Việt dày, đọc rõ từ xa */
  TX.FONT_TIEU_DE = '"Playfair Display", "Noto Serif", Georgia, serif';

  /* Chữ mẫu để document.fonts.load tải cả subset tiếng Việt */
  TX.CHU_MAU_VI = 'AaĐđƠơƯư ạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ';

  /* Bảng màu dùng chung — xem phần Định hướng nghệ thuật trong GDD */
  TX.MAU = {
    nen:      0xf3eee7,   // trắng ngọc trai — nền và sương
    nhan:     0xffb469,   // cam ấm: tương tác được, điểm nút, nhiệt
    nhanPhu:  0x4aa3ff,   // xanh lạnh: trạng thái đầu, sự tĩnh
    kimLoai:  0xbfa676,   // vàng sâm-panh cho khung, viền
    be:       0xe6dfd3,   // đá ngọc cho bệ
    vang:     0xd4af6a,   // chỉ vàng trang trí
    tuong:    0xf4f0ea,
    san:      0xebe5dc
  };

  /* Chỉ vàng: ít kim loại, có chút tự sáng. Kim loại thật cần env map để
     phản chiếu; thiếu nó, vàng kim loại sẽ tối thành màu ô-liu. */
  TX.vatLieuVang = function () {
    return new THREE.MeshStandardMaterial({
      color: TX.MAU.vang, roughness: 0.35, metalness: 0.3,
      emissive: 0x6a4a18, emissiveIntensity: 0.35
    });
  };

  /* Đồng hồ dùng chung cho mọi shader — lõi cập nhật mỗi khung hình. */
  TX.uTime = { value: 0 };

  /* ---------- vỏ phòng ---------- */

  TX.dungVoPhong = function (group, opts) {
    opts = opts || {};
    var K = TX.KICH_THUOC;

    var san = new THREE.Mesh(
      new THREE.PlaneGeometry(K.w, K.d),
      new THREE.MeshStandardMaterial({ map: texSanNgoc(), color: 0xf2ede6, roughness: 0.7, metalness: 0.04 })
    );
    san.rotation.x = -Math.PI / 2;
    san.receiveShadow = true;
    group.add(san);

    var matTuong = new THREE.MeshStandardMaterial({
      color: TX.MAU.tuong, roughness: 0.6, side: THREE.DoubleSide,
      emissive: 0x4a4038, emissiveIntensity: 0.55     // ánh ấm tự thân, tránh tường xám đục
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
      new THREE.MeshStandardMaterial({ color: 0xf8f5f0, roughness: 0.9 })
    );
    tran.rotation.x = Math.PI / 2;
    tran.position.y = K.h;
    group.add(tran);

    /* chân tường và gờ trần: một dải đá trắng, một chỉ vàng mảnh */
    var matChan = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    var matChi  = TX.vatLieuVang();
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (h) {
      var dai = h[0] === 0 ? K.w : K.d;
      var x = h[0] * (K.w / 2 - 0.04), z = h[1] * (K.d / 2 - 0.04);
      var ry = h[0] === 0 ? 0 : Math.PI / 2;
      [[0.14, 0.07, matChan], [0.31, 0.012, matChi], [K.h - 0.12, 0.08, matChan], [K.h - 0.27, 0.012, matChi]]
        .forEach(function (d) {
          var m = new THREE.Mesh(new THREE.BoxGeometry(dai, d[1] * 2, 0.08), d[2]);
          m.position.set(x, d[0], z);
          m.rotation.y = ry;
          group.add(m);
        });
    });

    /* lưới sàn mảnh màu vàng nhạt — gợi không gian trừu tượng */
    var luoi = new THREE.GridHelper(K.w, 30, 0xd9c49a, 0xe4d9c4);
    luoi.position.y = 0.01;
    luoi.material.opacity = 0.3;
    luoi.material.transparent = true;
    group.add(luoi);

    /* bụi ngọc lơ lửng khắp phòng */
    TX.domSang(group, {
      soLuong: 90, tam: [0, 2.6, 0], rong: [K.w - 1, K.h - 0.6, K.d - 1],
      mau: [0xe2b866, 0xd9a5c8, 0x9cc2e6, 0xf0d28a], co: [10, 26], doMo: 0.55, troi: 0.35
    });

    if (opts.bien) TX.dungBien(group, opts.bien[0], opts.bien[1]);
  };

  /* Mặt sàn đá ngọc: vân loang nhẹ + vòng hoa văn vàng ở tâm.
     Dựng một lần, dùng chung cho mọi phòng và sảnh. */
  var texSan = null;
  TX.texSanNgoc = texSanNgoc;
  function texSanNgoc() {
    if (texSan) return texSan;
    var c = document.createElement('canvas');
    c.width = c.height = 1024;
    var g = c.getContext('2d');
    var nen = g.createRadialGradient(512, 512, 40, 512, 512, 720);
    nen.addColorStop(0, '#fffdf8');
    nen.addColorStop(0.6, '#f3ede3');
    nen.addColorStop(1, '#e7dfd2');
    g.fillStyle = nen;
    g.fillRect(0, 0, 1024, 1024);
    /* vân ngọc: hồng, lam, kem chồng lên nhau */
    for (var i = 0; i < 70; i++) {
      var x = Math.random() * 1024, y = Math.random() * 1024, r = 60 + Math.random() * 220;
      var v = g.createRadialGradient(x, y, 0, x, y, r);
      var mau = ['255,232,246', '228,240,255', '255,244,222'][i % 3];
      v.addColorStop(0, 'rgba(' + mau + ',.45)');
      v.addColorStop(1, 'rgba(' + mau + ',0)');
      g.fillStyle = v;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    /* hoa văn vòng tròn */
    g.strokeStyle = 'rgba(196,160,96,.55)';
    [150, 168, 300].forEach(function (r, k) {
      g.lineWidth = k === 1 ? 1.5 : 3;
      g.beginPath(); g.arc(512, 512, r, 0, Math.PI * 2); g.stroke();
    });
    g.lineWidth = 1.5;
    for (var k = 0; k < 16; k++) {
      var a = k / 16 * Math.PI * 2, r1 = 168, r2 = k % 2 ? 250 : 300;
      g.beginPath();
      g.moveTo(512 + Math.cos(a) * r1, 512 + Math.sin(a) * r1);
      g.lineTo(512 + Math.cos(a) * r2, 512 + Math.sin(a) * r2);
      g.stroke();
    }
    texSan = new THREE.CanvasTexture(c);
    texSan.encoding = THREE.sRGBEncoding;
    texSan.anisotropy = 4;
    texSan.dungChung = true;   // TX.don không được huỷ
    return texSan;
  }

  /* ---------- biển chữ trên tường, vẽ bằng canvas ---------- */

  TX.dungBien = function (group, dongLon, dongNho) {
    var c = document.createElement('canvas');
    c.width = 1024; c.height = 256;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.textAlign = 'center';
    try { g.letterSpacing = '12px'; } catch (e) {}
    g.fillStyle = '#6e5220';
    g.font = '700 52px ' + TX.FONT_FANTASY;
    g.fillText(dongLon, c.width / 2, 108);
    try { g.letterSpacing = '0px'; } catch (e) {}
    /* chỉ vàng hai bên dòng nhỏ */
    g.strokeStyle = 'rgba(184,140,70,.6)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(330, 158); g.lineTo(440, 158);
    g.moveTo(584, 158); g.lineTo(694, 158);
    g.stroke();
    g.fillStyle = '#5e564b';
    g.font = 'italic 500 34px ' + TX.FONT_FANTASY;
    g.fillText(dongNho, c.width / 2, 168);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    var bien = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 1.6),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.95 })
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
    /* trời kem ấm, đất tím ngọc — hai tông này tạo ánh xà cừ trên mặt trắng */
    group.add(new THREE.HemisphereLight(0xfffaf2, 0xd9cce6, 0.6));
    group.add(new THREE.AmbientLight(0xfff4e6, 0.12));

    var roi = new THREE.SpotLight(0xfff3e0, 1.0, 22, Math.PI / 5, 0.55, 1.4);
    roi.position.set(0, 5.0, 0);
    roi.target = target || group;
    roi.castShadow = true;
    roi.shadow.mapSize.set(1024, 1024);
    roi.shadow.radius = 4;
    group.add(roi);
    if (roi.target !== group && !roi.target.parent) group.add(roi.target);

    var vien = new THREE.DirectionalLight(0xc9d8ff, 0.35);
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
     phần Hiệu năng trong GDD. Hoà trộn thường, không cộng sáng: trên nền
     ngọc trai, hạt cộng sáng sẽ trắng lẫn vào nền và biến mất. */
  TX.heHat = function (group, soLuong, mau, coHat, doMo) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(soLuong * 3);
    for (var i = 0; i < soLuong; i++) pos[i * 3 + 1] = -99;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    var mat = new THREE.PointsMaterial({
      size: coHat, map: chamTron(), color: mau,
      transparent: true, opacity: doMo,
      depthWrite: false, blending: THREE.NormalBlending,
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

  /* ---------- đom đóm / bụi ngọc: chấm tròn trôi lơ lửng, nhấp nháy ----------
     Toàn bộ chuyển động nằm trong vertex shader, chạy theo TX.uTime, nên
     không ai phải cập nhật gì mỗi khung hình. Một lệnh vẽ cho cả đàn.

     opts: soLuong, tam [x,y,z], rong [w,h,d] hoặc viTri(i,n) -> [x,y,z],
           mau [hex...], co [min,max] (px), doMo, troi (biên độ trôi, m),
           uBoost (uniform dùng chung để làm cả đàn sáng/nhanh hơn) */

  var DOM_VS = [
    'attribute float aPha;',
    'attribute float aCo;',
    'attribute float aToc;',
    'attribute vec3 aMau;',
    'uniform float uTime;',
    'uniform float uBoost;',
    'uniform float uPR;',
    'uniform float uTroi;',
    'varying vec3 vMau;',
    'varying float vSang;',
    'void main() {',
    '  float t = uTime * aToc * (1.0 + 0.6 * uBoost);',
    '  vec3 p = position;',
    '  p.x += sin(t * 0.71 + aPha * 6.28) * uTroi;',
    '  p.y += sin(t * 0.53 + aPha * 11.0) * uTroi * 0.8;',
    '  p.z += cos(t * 0.62 + aPha * 8.30) * uTroi;',
    '  float nh = 0.5 + 0.5 * sin(uTime * (1.3 + aToc * 1.8) + aPha * 40.0);',
    '  nh = nh * nh * nh;',
    '  vSang = mix(0.12, 1.0, nh) * (0.75 + 0.45 * uBoost);',
    '  vMau = aMau;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  gl_PointSize = aCo * uPR * (0.65 + 0.45 * nh) * (1.0 + 0.3 * uBoost) * (4.0 / max(0.3, -mv.z));',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');

  var DOM_FS = [
    'uniform float uDoMo;',
    'varying vec3 vMau;',
    'varying float vSang;',
    'void main() {',
    '  float d = length(gl_PointCoord - 0.5) * 2.0;',
    '  if (d > 1.0) discard;',
    '  float loi  = smoothstep(0.32, 0.0, d);',
    '  float quan = pow(1.0 - d, 2.2);',
    '  vec3 c = mix(vMau, vec3(1.0, 0.99, 0.9), loi * 0.85);',
    '  gl_FragColor = vec4(c, clamp((quan * 0.75 + loi) * vSang * uDoMo, 0.0, 1.0));',
    '}'
  ].join('\n');

  TX.domSang = function (group, opts) {
    var n = opts.soLuong || 40;
    var tam = opts.tam || [0, 0, 0], rong = opts.rong || [1, 1, 1];
    var bangMau = (opts.mau || [0xffd86a]).map(function (h) { return new THREE.Color(h); });
    var co = opts.co || [8, 20];

    var pos = new Float32Array(n * 3), pha = new Float32Array(n),
        size = new Float32Array(n), toc = new Float32Array(n), mau = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var p = opts.viTri ? opts.viTri(i, n) : [
        tam[0] + (Math.random() - 0.5) * rong[0],
        tam[1] + (Math.random() - 0.5) * rong[1],
        tam[2] + (Math.random() - 0.5) * rong[2]
      ];
      pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2];
      pha[i] = Math.random();
      /* phần lớn là chấm nhỏ, thỉnh thoảng một quầng tròn to (bokeh) */
      size[i] = Math.random() < 0.18
        ? co[1] * (1.4 + Math.random())
        : co[0] + Math.random() * (co[1] - co[0]);
      toc[i] = 0.5 + Math.random();
      var m = bangMau[i % bangMau.length];
      mau[i * 3] = m.r; mau[i * 3 + 1] = m.g; mau[i * 3 + 2] = m.b;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aPha', new THREE.BufferAttribute(pha, 1));
    geo.setAttribute('aCo', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aToc', new THREE.BufferAttribute(toc, 1));
    geo.setAttribute('aMau', new THREE.BufferAttribute(mau, 3));

    var mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: TX.uTime,
        uBoost: opts.uBoost || { value: 0 },
        uPR: { value: Math.min(devicePixelRatio, 2) },
        uTroi: { value: opts.troi != null ? opts.troi : 0.25 },
        uDoMo: { value: opts.doMo != null ? opts.doMo : 1 }
      },
      vertexShader: DOM_VS,
      fragmentShader: DOM_FS,
      transparent: true,
      depthWrite: false
    });
    var pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    group.add(pts);
    return pts;
  };

  /* ---------- dọn dẹp ---------- */

  TX.don = function (obj) {
    obj.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        var ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach(function (m) {
          if (m.map && m.map.dispose && !m.map.dungChung) m.map.dispose();
          m.dispose();
        });
      }
    });
  };

})(window.TX);
