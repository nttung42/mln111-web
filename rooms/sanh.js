/* ═══════════════════════════════════════════════════════════════════
   SẢNH — THÁP XOẮN ỐC

   Không phải một bảng chọn, mà là một không gian thật: cầu thang xoắn
   đi lên quanh một trụ trung tâm, các cánh cửa phát sáng gắn dọc đường,
   mỗi cửa mang tên một phòng.

   Cấu trúc này không phải trang trí. Nó chính là hình ảnh của quy luật
   phủ định của phủ định — phát triển theo đường xoáy trôn ốc, lặp lại
   cái cũ ở trình độ cao hơn. Đứng ở bậc trên nhìn xuống, người chơi
   thấy lại toàn bộ chặng đã qua.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var R_TRONG = 3.2;    // mép trong cầu thang (sát trụ)
  var R_NGOAI = 7.8;    // mép ngoài — bậc rộng 4,6 m
  var R_TUONG = 8.6;    // tường bao
  var CAO     = 5.4;    // tổng độ cao leo được sau trọn một vòng
  var SO_BAC  = 40;     // số bậc trong một vòng
  var CAO_BAC = CAO / SO_BAC;

  var GOC_DAU = 0.16;   // chừa một khoảng ở chân thang
  var GOC_CUOI = Math.PI * 2 - 0.16;
  var TAM_CUA = 1.9;    // khoảng cách đứng đủ gần để bước vào cửa

  var S, o;

  /* Góc của một điểm, tính theo chiều đi lên, trả về [0, 2π) */
  function gocCua(x, z) {
    var a = Math.atan2(z, x);
    return a < 0 ? a + Math.PI * 2 : a;
  }

  /* Cao độ mặt bậc tại một điểm — phải khớp đúng với hình đã dựng */
  function caoTaiGoc(a) {
    var t = (a - GOC_DAU) / (GOC_CUOI - GOC_DAU);
    t = Math.max(0, Math.min(1, t));
    return Math.floor(t * SO_BAC) * CAO_BAC;
  }

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    /* khoaT: chặn nửa giây đầu, tránh bước ngay vào cửa vì cú bấm vừa rồi */
    S = { cuaGan: null, daVao: false, dinh: false, khoaT: 0.5 };
    o = { cua: [] };

    dungVoThap(ctx);
    dungCauThang(ctx);
    dungCacCua(ctx);
    dungDinh(ctx);
    dungAnhSang(ctx);

    /* ---------- người chơi bám theo cầu thang ---------- */
    ctx.player.bounds = R_TUONG;
    ctx.player.blockers = [];
    ctx.player.groundAt = function (x, z) {
      return caoTaiGoc(gocCua(x, z));
    };
    ctx.player.constrain = function (pos, truocX, truocZ) {
      /* giữ trong vành khuyên của cầu thang */
      var r = Math.hypot(pos.x, pos.z);
      if (r < R_TRONG + 0.35) {
        var k = (R_TRONG + 0.35) / r;
        pos.x *= k; pos.z *= k;
      } else if (r > R_NGOAI - 0.35) {
        var k2 = (R_NGOAI - 0.35) / r;
        pos.x *= k2; pos.z *= k2;
      }
      /* không cho bước qua khe nối giữa chân thang và đỉnh thang */
      var a = gocCua(pos.x, pos.z);
      if (a < GOC_DAU || a > GOC_CUOI) { pos.x = truocX; pos.z = truocZ; }
    };

    /* đặt người chơi ở chân thang, hoặc cạnh cánh cửa vừa bước ra */
    var gocVao = GOC_DAU + 0.12;
    if (TX.phongVua) {
      for (var i = 0; i < o.cua.length; i++) {
        if (o.cua[i].id === TX.phongVua) { gocVao = o.cua[i].goc - 0.38; break; }
      }
    }
    var rGiua = (R_TRONG + R_NGOAI) / 2;
    /* nhìn theo chiều leo lên (tiếp tuyến), hơi ngoảnh ra phía tường có cửa */
    ctx.player.spawn(Math.cos(gocVao) * rGiua, Math.sin(gocVao) * rGiua, Math.PI - gocVao - 0.3);
    ctx.player.batDatDat();

    /* Sảnh dùng chuột tự do: thấy con trỏ, bấm thẳng vào cửa muốn vào.
       Kéo chuột vẫn để nhìn quanh, W A S D vẫn để leo. */
    o.tia = new THREE.Raycaster();
    o.diem = new THREE.Vector2();
    ctx.player.onClick = function () {
      if (S.daVao || S.khoaT > 0) return;
      var c = layCuaDuoiChuot(ctx);
      if (c) { S.daVao = true; ctx.vaoPhong(c.id); }
    };
  }

  /* ---------- vỏ tháp: trụ giữa + tường bao, đá trắng ngọc trai ---------- */

  function dungVoThap(ctx) {
    var san = new THREE.Mesh(
      new THREE.CircleGeometry(R_TUONG, 64),
      new THREE.MeshStandardMaterial({ map: TX.texSanNgoc(), roughness: 0.4, metalness: 0.08 })
    );
    san.rotation.x = -Math.PI / 2;
    san.receiveShadow = true;
    ctx.scene.add(san);

    var tru = new THREE.Mesh(
      new THREE.CylinderGeometry(R_TRONG, R_TRONG, 14, 64, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xf6f1ea, roughness: 0.38, metalness: 0.05, side: THREE.DoubleSide,
        emissive: 0x4a4038, emissiveIntensity: 0.6
      })
    );
    tru.position.y = 7;
    tru.receiveShadow = true;
    ctx.scene.add(tru);

    var tuong = new THREE.Mesh(
      new THREE.CylinderGeometry(R_TUONG, R_TUONG, 16, 96, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xf1ece5, roughness: 0.7, side: THREE.BackSide,
        emissive: 0x4a4038, emissiveIntensity: 0.6
      })
    );
    tuong.position.y = 7;
    ctx.scene.add(tuong);

    /* chỉ vàng quấn quanh trụ và tường, cứ mỗi tầng một vòng */
    var matVang = TX.vatLieuVang();
    for (var y = 0.3; y < 14; y += 2.2) {
      var vt = new THREE.Mesh(new THREE.TorusGeometry(R_TRONG + 0.01, 0.022, 6, 96), matVang);
      vt.rotation.x = Math.PI / 2;
      vt.position.y = y;
      ctx.scene.add(vt);
      var vn = new THREE.Mesh(new THREE.TorusGeometry(R_TUONG - 0.02, 0.022, 6, 128), matVang);
      vn.rotation.x = Math.PI / 2;
      vn.position.y = y;
      ctx.scene.add(vn);
    }

    /* trụ áp tường trắng — trên nền toàn trắng, chúng cho mắt cảm giác chiều sâu */
    var matTruAp = new THREE.MeshStandardMaterial({ color: 0xfbf8f3, roughness: 0.45, emissive: 0x4a4038, emissiveIntensity: 0.5 });
    for (var k = 0; k < 24; k++) {
      var a = k / 24 * Math.PI * 2;
      var ap = new THREE.Mesh(new THREE.BoxGeometry(0.3, 16, 0.14), matTruAp);
      ap.position.set(Math.cos(a) * (R_TUONG - 0.07), 7, Math.sin(a) * (R_TUONG - 0.07));
      ap.lookAt(0, 7, 0);
      ctx.scene.add(ap);
    }

    /* giếng trời: đĩa sáng trắng ở đỉnh tháp */
    var troi = new THREE.Mesh(
      new THREE.CircleGeometry(R_TUONG, 64),
      new THREE.MeshBasicMaterial({ color: 0xfffdf8, fog: false })
    );
    troi.rotation.x = Math.PI / 2;
    troi.position.y = 14.9;
    ctx.scene.add(troi);

    /* bụi ngọc lơ lửng trong lòng tháp */
    TX.domSang(ctx.scene, {
      soLuong: 240,
      viTri: function () {
        var a = Math.random() * Math.PI * 2;
        var r = R_TRONG + 0.25 + Math.random() * (R_TUONG - R_TRONG - 0.5);
        return [Math.cos(a) * r, 0.3 + Math.random() * 10, Math.sin(a) * r];
      },
      mau: [0xe0b45c, 0xd79ac6, 0x8fb9e6, 0xb7a4e0, 0xf0cf7c],
      co: [9, 24], doMo: 0.6, troi: 0.4
    });
  }

  /* ---------- cầu thang xoắn, dựng thành MỘT lưới duy nhất ----------
     Gộp hết vào một BufferGeometry để giữ số lệnh vẽ ở mức thấp,
     xem phần Hiệu năng trong GDD. Mặt bậc trắng, cổ bậc và má ngoài
     tông sâm-panh — trắng chồng trắng thì không thấy bậc đâu mà bước. */

  function dungCauThang(ctx) {
    var v = [], col = [];
    var dGoc = (GOC_CUOI - GOC_DAU) / SO_BAC;
    var MAT = [0.97, 0.955, 0.93], CO = [0.86, 0.80, 0.70], MA = [0.82, 0.75, 0.64];

    function diem(a, r, y) { return [Math.cos(a) * r, y, Math.sin(a) * r]; }
    function quad(p1, p2, p3, p4, c) {
      v.push.apply(v, p1); v.push.apply(v, p2); v.push.apply(v, p3);
      v.push.apply(v, p1); v.push.apply(v, p3); v.push.apply(v, p4);
      for (var k = 0; k < 6; k++) col.push(c[0], c[1], c[2]);
    }

    for (var i = 0; i < SO_BAC; i++) {
      var a0 = GOC_DAU + i * dGoc;
      var a1 = a0 + dGoc;
      var y  = i * CAO_BAC;

      /* mặt bậc */
      quad(diem(a0, R_TRONG, y), diem(a0, R_NGOAI, y),
           diem(a1, R_NGOAI, y), diem(a1, R_TRONG, y), MAT);

      /* cổ bậc, dựng đứng ở đầu mỗi bậc */
      if (i > 0) {
        quad(diem(a0, R_TRONG, y - CAO_BAC), diem(a0, R_TRONG, y),
             diem(a0, R_NGOAI, y),           diem(a0, R_NGOAI, y - CAO_BAC), CO);
      }

      /* má ngoài, để nhìn từ dưới lên thấy được đường xoắn */
      quad(diem(a0, R_NGOAI, y - 0.5), diem(a0, R_NGOAI, y),
           diem(a1, R_NGOAI, y),       diem(a1, R_NGOAI, y - 0.5), MA);
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();

    var thang = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.4, metalness: 0.06, side: THREE.DoubleSide
    }));
    thang.castShadow = true;
    thang.receiveShadow = true;
    ctx.scene.add(thang);

    /* chỉ vàng chạy dọc mép ngoài và mép trong — dẫn mắt đi lên */
    [R_NGOAI - 0.06, R_TRONG + 0.06].forEach(function (rr, k) {
      var pts = [];
      for (var j = 0; j <= SO_BAC; j++) {
        var a = GOC_DAU + j * dGoc;
        var yy = Math.min(j, SO_BAC - 1) * CAO_BAC + 0.02;
        pts.push(new THREE.Vector3(Math.cos(a) * rr, yy, Math.sin(a) * rr));
      }
      ctx.scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0xc89a4a, transparent: true, opacity: k ? 0.5 : 0.9 })
      ));
    });
  }

  /* ---------- các cánh cửa ---------- */

  /* Mỗi cửa một thế giới riêng: viền tối, giữa đậm, lõi sáng, màu đom đóm.
     Lõi sáng nằm sâu trong lòng cửa như cuối một đường hầm cây. */
  var BANG_MAU = [
    { vien: 0x0c3420, giua: 0x3f9a3c, loi: 0xfff2a8, dom: [0xf2c230, 0xb8e05a] },   // rừng
    { vien: 0x0b2650, giua: 0x3a86d6, loi: 0xe6f6ff, dom: [0x3aa0e8, 0x9fd8ff] },   // biển trời
    { vien: 0x341048, giua: 0xa45bd0, loi: 0xffe4fa, dom: [0xd46fc8, 0xb68cf0] },   // tử đinh hương
    { vien: 0x4a2006, giua: 0xd9822b, loi: 0xfff0c4, dom: [0xe8952a, 0xf6c74a] },   // hổ phách
    { vien: 0x053a3a, giua: 0x2fb3a0, loi: 0xe8fff4, dom: [0x2fbf9c, 0x9de8c8] }    // ngọc bích
  ];

  function dungCacCua(ctx) {
    var ds = ctx.danhSachPhong;
    var n = ds.length;

    var j = 0;   // phòng có màu cửa riêng không chiếm lượt trong bảng màu chung
    for (var i = 0; i < n; i++) {
      /* rải đều dọc đường leo, chừa chân thang và đỉnh thang */
      var t = (i + 1) / (n + 1);
      var goc = GOC_DAU + t * (GOC_CUOI - GOC_DAU);
      dungMotCua(ctx, ds[i], goc, ds[i].mauCua || BANG_MAU[j++ % BANG_MAU.length]);
    }
  }

  /* Lòng cửa: một đường hầm ánh sáng vẽ hoàn toàn bằng shader —
     tán lá trôi về phía người nhìn, tia sáng toả từ lõi, hạt lấp lánh bay ra. */
  var CUA_VS = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var CUA_FS = [
    'uniform float uTime;',
    'uniform float uHover;',
    'uniform vec3 uVien;',
    'uniform vec3 uGiua;',
    'uniform vec3 uLoi;',
    'varying vec2 vUv;',
    'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p), f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),',
    '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);',
    '}',
    'float fbm(vec2 p) {',
    '  float v = 0.0, a = 0.5;',
    '  for (int k = 0; k < 4; k++) { v += a * noise(p); p *= 2.03; a *= 0.5; }',
    '  return v;',
    '}',
    'void main() {',
    '  vec2 p = (vUv - vec2(0.5, 0.42)) * vec2(1.5, 2.5);',
    '  float r = length(p);',
    '  float a = atan(p.y, p.x);',
    '  vec2 huong = vec2(cos(a), sin(a));',
    '  float sau = 1.0 / (r + 0.12);',
    '  float tr = uTime * 0.35 * (1.0 + uHover);',
    /* tán lá: nhiễu trong không gian đường hầm, trôi dần ra ngoài */
    '  float la  = fbm(huong * 2.2 + vec2(sau * 0.55 - tr, sau * 0.3));',
    '  float la2 = fbm(huong * 5.0 + vec2(-sau * 0.9 + tr * 1.3, 1.7));',
    '  vec3 c = mix(uLoi, uGiua, smoothstep(0.0, 0.42, r + (la - 0.5) * 0.25));',
    '  c = mix(c, uVien, smoothstep(0.1, 0.8, r + (la - 0.5) * 0.55));',
    '  c *= 0.72 + 0.55 * la2;',
    /* lõi sáng thở nhẹ */
    '  float loi = exp(-r * r * 9.0) * (0.9 + 0.25 * sin(uTime * 1.7) + 0.6 * uHover);',
    '  c += uLoi * loi * 0.85;',
    /* tia sáng toả từ lõi */
    '  float tia = pow(0.5 + 0.5 * sin(a * 9.0 + sin(uTime * 0.4) * 1.5), 6.0) * exp(-r * 2.2) * 0.35;',
    '  c += uLoi * tia;',
    /* hạt lấp lánh bay ra theo đường hầm */
    '  vec2 g = vec2((a / 6.2832 + 0.5) * 28.0, sau * 2.2 - uTime * 0.9 * (1.0 + uHover));',
    '  vec2 id = floor(g), f = fract(g) - 0.5;',
    '  float h = hash(id + 3.1);',
    '  vec2 lech = vec2(hash(id + 7.3), hash(id + 1.9)) - 0.5;',
    '  float sp = smoothstep(0.2, 0.0, length(f - lech * 0.6)) * step(0.7, h);',
    '  sp *= 0.5 + 0.5 * sin(uTime * 4.0 + h * 60.0);',
    '  c += vec3(1.0, 0.96, 0.7) * sp * smoothstep(0.1, 0.35, r) * 1.3;',
    /* tối dần sát mép khung */
    '  vec2 e = min(vUv, 1.0 - vUv);',
    '  c *= mix(0.45, 1.0, smoothstep(0.0, 0.07, min(e.x * 1.6, e.y)));',
    '  c *= 1.0 + 0.2 * uHover;',
    '  gl_FragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  /* quầng sáng tròn, dùng chung cho mọi cửa */
  var texQuang = null;
  function quangTron() {
    if (texQuang) return texQuang;
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0,   'rgba(255,255,255,1)');
    grd.addColorStop(0.4, 'rgba(255,255,255,.45)');
    grd.addColorStop(1,   'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    texQuang = new THREE.CanvasTexture(c);
    texQuang.dungChung = true;
    return texQuang;
  }

  function dungMotCua(ctx, phong, goc, bang) {
    var y = caoTaiGoc(goc);
    var r = R_NGOAI - 0.12;
    var x = Math.cos(goc) * r, z = Math.sin(goc) * r;

    var nhom = new THREE.Group();
    nhom.position.set(x, y, z);
    nhom.lookAt(0, y, 0);        // quay thẳng vào trục tháp, không ngả ra sau
    ctx.scene.add(nhom);

    /* bậc thềm trước cửa — phủ lên các bậc thấp hơn bên dưới */
    var them = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 0.12, 1.3),
      new THREE.MeshStandardMaterial({ color: 0xfbf8f3, roughness: 0.35 })
    );
    them.position.set(0, -0.06, 0.55);
    them.receiveShadow = true;
    nhom.add(them);

    /* quầng sáng hắt lên tường phía sau và xuống thềm */
    var matQuang = new THREE.MeshBasicMaterial({
      map: quangTron(), color: bang.giua, transparent: true, opacity: 0.45, depthWrite: false
    });
    var quang = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.8), matQuang);
    quang.position.set(0, 1.45, -0.12);
    nhom.add(quang);

    var matHat = new THREE.MeshBasicMaterial({
      map: quangTron(), color: bang.giua, transparent: true, opacity: 0.4, depthWrite: false
    });
    var hatSan = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), matHat);
    hatSan.rotation.x = -Math.PI / 2;
    hatSan.position.set(0, 0.006, 0.45);
    nhom.add(hatSan);

    /* lòng cửa: đường hầm ánh sáng */
    var uCua = {
      uTime: TX.uTime,
      uHover: { value: 0 },
      uVien: { value: new THREE.Color(bang.vien) },
      uGiua: { value: new THREE.Color(bang.giua) },
      uLoi:  { value: new THREE.Color(bang.loi) }
    };
    var long = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 2.5),
      new THREE.ShaderMaterial({ uniforms: uCua, vertexShader: CUA_VS, fragmentShader: CUA_FS })
    );
    long.position.set(0, 1.27, 0.02);
    nhom.add(long);

    /* khung cửa cổ điển: trụ trắng, mũ cột vàng, đầu hồi có gờ */
    var matKhung = new THREE.MeshStandardMaterial({ color: 0xfdfbf7, roughness: 0.32 });
    var matVang  = TX.vatLieuVang();
    function khoi(w, h, d, px, py, pz, mat) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(px, py, pz);
      m.castShadow = true;
      nhom.add(m);
      return m;
    }
    [-0.87, 0.87].forEach(function (sx) {
      khoi(0.22, 2.62, 0.26, sx, 1.31, 0.02, matKhung);        // trụ
      khoi(0.28, 0.2, 0.32, sx, 0.1, 0.02, matKhung);           // chân trụ
      khoi(0.27, 0.05, 0.31, sx, 2.6, 0.02, matVang);           // mũ trụ
      khoi(0.022, 2.5, 0.03, sx * 0.875, 1.27, 0.16, matVang);  // chỉ vàng lòng khung
    });
    khoi(2.1, 0.24, 0.28, 0, 2.74, 0.02, matKhung);             // đầu hồi
    khoi(2.36, 0.07, 0.36, 0, 2.89, 0.02, matKhung);            // gờ trên
    khoi(2.2, 0.025, 0.31, 0, 2.63, 0.03, matVang);             // chỉ vàng đầu hồi
    khoi(1.55, 0.022, 0.03, 0, 2.53, 0.16, matVang);

    /* viên ngọc trên đỉnh khung, mang màu thế giới bên trong */
    var ngoc = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      new THREE.MeshStandardMaterial({
        color: bang.giua, emissive: bang.giua, emissiveIntensity: 0.8,
        roughness: 0.15, metalness: 0.3, flatShading: true
      })
    );
    ngoc.position.set(0, 2.76, 0.2);
    ngoc.scale.y = 1.4;
    nhom.add(ngoc);

    /* hai cánh cửa mở toang ra ngoài, bản lề ở hai mép khung */
    var matCanh = new THREE.MeshStandardMaterial({ color: 0xfaf6f0, roughness: 0.4 });
    var canh = [-1, 1].map(function (ben) {
      var banLe = new THREE.Group();
      banLe.position.set(ben * 0.75, 0, 0.06);
      nhom.add(banLe);
      var tam = new THREE.Mesh(new THREE.BoxGeometry(0.74, 2.48, 0.05), matCanh);
      tam.position.set(-ben * 0.37, 1.27, 0);
      tam.castShadow = true;
      banLe.add(tam);
      /* ô trang trí viền vàng ở mặt trong cánh */
      [[0.48, 1.0, 1.85], [0.48, 0.7, 0.6]].forEach(function (o2) {
        var w = o2[0], h = o2[1], cy = o2[2];
        [[w, 0.018, 0, h / 2], [w, 0.018, 0, -h / 2], [0.018, h, w / 2, 0], [0.018, h, -w / 2, 0]]
          .forEach(function (q) {
            var v = new THREE.Mesh(new THREE.BoxGeometry(q[0], q[1], 0.012), matVang);
            v.position.set(-ben * 0.37 + q[2], cy + q[3], 0.03);
            banLe.add(v);
          });
      });
      var num = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), matVang);
      num.position.set(-ben * 0.66, 1.15, 0.05);
      banLe.add(num);
      return { g: banLe, ben: ben };
    });

    /* đom đóm: nửa đàn lượn trong lòng cửa, nửa kia tràn ra bậc thềm */
    var uBoost = { value: 0 };
    TX.domSang(nhom, {
      soLuong: 64,
      viTri: function (i) {
        function ng(a, b) { return a + Math.random() * (b - a); }
        return i % 2
          ? [ng(-0.68, 0.68), ng(0.15, 2.45), ng(0.05, 0.4)]
          : [ng(-1.5, 1.5), ng(0.0, 3.3), ng(0.35, 1.9)];
      },
      mau: bang.dom, co: [9, 22], troi: 0.24, doMo: 1, uBoost: uBoost
    });

    var den = new THREE.PointLight(bang.giua, 0.6, 5, 2);
    den.position.set(0, 1.4, 0.9);
    nhom.add(den);

    /* biển tên phòng, treo trên cửa */
    var bien = bienCua(phong);
    bien.position.set(0, 3.42, 0.14);
    nhom.add(bien);

    o.cua.push({
      id: phong.id, goc: goc, x: x, z: z, y: y,
      nhom: nhom, den: den, xong: phong.xong,
      uCua: uCua, uBoost: uBoost, matQuang: matQuang, matHat: matHat,
      ngoc: ngoc, canh: canh, hover: 0,
      vungBam: dungVungBam(nhom, phong.id)
    });
  }

  /* vùng bấm: khối vô hình rộng hơn cánh cửa, để bấm chuột không cần chính xác */
  function dungVungBam(nhom, id) {
    var vungBam = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 4.2, 1.6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    vungBam.position.set(0, 1.8, -0.4);
    vungBam.userData.phongId = id;
    nhom.add(vungBam);
    return vungBam;
  }

  /* ---------- bấm chuột thẳng vào cánh cửa ---------- */

  function layCuaDuoiChuot(ctx) {
    if (!o || !o.tia) return null;
    var c = ctx.player.chuot;
    o.diem.x = (c.x / innerWidth) * 2 - 1;
    o.diem.y = -(c.y / innerHeight) * 2 + 1;
    o.tia.setFromCamera(o.diem, ctx.camera);

    var vung = o.cua.map(function (d) { return d.vungBam; });
    var trung = o.tia.intersectObjects(vung, false);
    if (!trung.length) return null;

    var id = trung[0].object.userData.phongId;
    for (var i = 0; i < o.cua.length; i++) if (o.cua[i].id === id) return o.cua[i];
    return null;
  }

  function bienCua(phong) {
    var c = document.createElement('canvas');
    c.width = 720; c.height = 240;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.textAlign = 'center';
    /* viền trắng mờ quanh chữ để đọc được cả khi quầng màu hắt sau lưng */
    g.shadowColor = 'rgba(255,253,248,.95)';
    g.shadowBlur = 14;

    g.fillStyle = '#9a7432';
    g.font = 'italic 500 28px ' + TX.FONT_FANTASY;
    g.fillText(phong.nhanNgan || '', c.width / 2, 40);

    g.fillStyle = '#3a3226';
    g.font = '600 62px ' + TX.FONT_FANTASY;
    g.fillText(phong.tieuDe, c.width / 2, 110);

    /* hoa văn: — ✦ — */
    g.shadowBlur = 0;
    g.strokeStyle = 'rgba(184,140,70,.75)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(250, 146); g.lineTo(340, 146);
    g.moveTo(380, 146); g.lineTo(470, 146);
    g.stroke();
    g.fillStyle = '#c0954a';
    g.font = '400 24px ' + TX.FONT_FANTASY;
    g.fillText('✦', c.width / 2, 154);

    if (phong.xong) {
      g.shadowBlur = 10;
      g.fillStyle = '#3f8f62';
      g.font = '600 26px ' + TX.FONT_FANTASY;
      try { g.letterSpacing = '6px'; } catch (e) {}
      g.fillText('ĐÃ QUA', c.width / 2, 196);
    }

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return new THREE.Mesh(
      new THREE.PlaneGeometry(2.7, 0.9),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
  }

  /* ---------- đỉnh tháp ---------- */

  function dungDinh(ctx) {
    var goc = GOC_CUOI - 0.06;
    var y = caoTaiGoc(goc);
    var r = (R_TRONG + R_NGOAI) / 2;

    var c = document.createElement('canvas');
    c.width = 640; c.height = 160;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.textAlign = 'center';
    g.fillStyle = '#9a7432';
    g.font = '600 46px ' + TX.FONT_FANTASY;
    g.fillText('ĐỈNH THÁP', c.width / 2, 58);
    g.fillStyle = '#8a8172';
    g.font = 'italic 400 28px ' + TX.FONT_FANTASY;
    g.fillText('còn đang xây', c.width / 2, 104);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    var bien = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.65),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9 })
    );
    bien.position.set(Math.cos(goc) * (R_NGOAI - 0.1), y + 2.0, Math.sin(goc) * (R_NGOAI - 0.1));
    bien.lookAt(0, y + 2.0, 0);
    ctx.scene.add(bien);

    o.dinh = { goc: goc, x: Math.cos(goc) * r, z: Math.sin(goc) * r };
  }

  /* ---------- ánh sáng ---------- */

  function dungAnhSang(ctx) {
    /* trời kem ấm, đất tím ngọc — ánh xà cừ trên đá trắng */
    ctx.scene.add(new THREE.HemisphereLight(0xfffaf2, 0xd9cce6, 0.55));
    ctx.scene.add(new THREE.AmbientLight(0xfff4e6, 0.08));

    /* cột sáng ấm rọi từ giếng trời xuống */
    var tren = new THREE.SpotLight(0xfff1dc, 0.6, 30, Math.PI / 4, 0.7, 1.2);
    tren.position.set(0, 13, 0);
    tren.target.position.set(0, 0, 0);
    ctx.scene.add(tren, tren.target);
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var t = ctx.clock;

    /* Cửa được chọn = cửa đang trỏ chuột vào, hoặc cửa đang đứng cạnh. */
    var troVao = layCuaDuoiChuot(ctx);
    S.cuaGan = null;
    var gan = null;
    for (var i = 0; i < o.cua.length; i++) {
      var c = o.cua[i];
      if (ctx.player.distTo(c.x, c.z) < TAM_CUA) { S.cuaGan = c.id; gan = c; break; }
    }
    var sang = troVao || gan;
    ctx.dom.style.cursor = troVao ? 'pointer' : '';

    /* cửa thở nhẹ; cửa đang trỏ vào hay đứng cạnh thì bừng sáng,
       đom đóm bay nhanh hơn, hai cánh mở rộng thêm */
    for (var j = 0; j < o.cua.length; j++) {
      var d = o.cua[j];
      d.hover = TX.anim.damp(d.hover, (d === sang) ? 1 : 0, 5, dt);
      var h = d.hover;
      var tho = Math.sin(t * 1.4 + j * 1.3);
      d.uCua.uHover.value = h;
      d.uBoost.value = h;
      d.matQuang.opacity = 0.4 + tho * 0.06 + h * 0.3;
      d.matHat.opacity = 0.35 + tho * 0.05 + h * 0.3;
      d.den.intensity = 0.6 + tho * 0.12 + h * 1.0;
      d.ngoc.rotation.y += dt * (0.8 + h * 2.5);
      d.ngoc.position.y = 2.76 + Math.sin(t * 2 + j) * 0.03;
      for (var k = 0; k < d.canh.length; k++) {
        var cg = d.canh[k];
        cg.g.rotation.y = cg.ben * (1.7 + h * 0.35 + Math.sin(t * 0.9 + j + k) * 0.025);
      }
      d.nhom.scale.setScalar(1 + h * 0.03);
    }

    /* bước vào */
    if (S.khoaT > 0) S.khoaT -= dt;
    if (gan && S.khoaT <= 0 && ctx.player.action() > 0 && !S.daVao) {
      S.daVao = true;
      ctx.vaoPhong(gan.id);
      return;
    }

    /* đỉnh tháp */
    S.dinh = ctx.player.distTo(o.dinh.x, o.dinh.z) < 2.2;

    var V = TX.VI.sanh;
    ctx.hud.hienPanel(false);
    ctx.hud.goiY(troVao ? V.bamCua : (gan ? V.vaoCua : (S.dinh ? V.dinhThap : V.leoLen)));
    ctx.hud.hienGoiY(true);
  }

  function dispose(ctx) {
    if (ctx && ctx.player) {
      ctx.player.groundAt = null;
      ctx.player.constrain = null;
      ctx.player.onClick = null;
    }
    if (ctx && ctx.dom) ctx.dom.style.cursor = '';
    S = o = null;
  }

  TX.sanh = {
    id: 'sanh',
    tieuDe: 'Tháp Xoắn Ốc',
    chuotTuDo: true,          // thấy con trỏ, bấm thẳng vào cửa
    build: build,
    update: update,
    dispose: dispose
  };

})(window.TX);
