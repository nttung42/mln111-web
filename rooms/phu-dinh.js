/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — KHU VƯỜN BA THẾ HỆ  (Phủ định của phủ định)
   (Giáo trình, Chương 2, mục 2.2.2)

   Một khu vườn bỏ hoang, ba luống đất nối nhau bằng một lối đá đi lên
   theo hình xoắn. Người chơi KHÔNG đọc định nghĩa trước: họ tự làm, và
   chơi xong thì tự thấy bốn ý.

     1. Cái cũ có giới hạn     — cây non tự tàn sau khi cho quả; tưới thêm
                                 cũng vô ích (tính khách quan, tự thân).
     2. Cái mới phủ định cái cũ — dưới gốc cây chết có một hạt sáng.
     3. Cái mới kế thừa         — người chơi chọn đặc tính mang theo trong
                                 hạt; cây thế hệ hai thể hiện đúng lựa chọn
                                 đó. Không chọn gì = phủ định sạch trơn,
                                 giữ cả "thân mảnh" = kế thừa nguyên xi:
                                 cả hai đều không cho đi tiếp.
     4. Không quay về chỗ cũ    — thế hệ ba lại cần hạt, nước, mùn NHƯ LÚC
                                 ĐẦU, nhưng lần này cả ba đến từ chính
                                 khu vườn cũ, và thứ mọc lên là cả một
                                 hệ sinh thái trên luống cao nhất.

   Các chặng (S.pha), theo thứ tự trong PHA:
     TH1   nuôi cây non: tưới nước (giếng) · hắt nắng (xoay gương) · bón mùn
     LON1  cây lớn hết cỡ          QUA1  chờ hái quả      HAI  vừa hái xong
     TAN1  PHỦ ĐỊNH LẦN 1: cây tàn, không cứu được
     HAT1  hạt sáng dưới gốc → thẻ chọn đặc tính
     GIEO2 mang hạt lên luống hai  LON2  cây thế hệ hai lớn lên
     TH2   hệ sinh thái: khơi nước, trồng hoa → ong → quả → cây con
     TAN2  GIỚI HẠN NỘI TẠI: rễ lan kín đất, nước cạn, hoa héo, ong bỏ đi
     GOM   gom hạt · giọt nước · mùn từ khu vườn cũ
     LON3  PHỦ ĐỊNH LẦN 2: khu vườn mới bung ra ở đỉnh, suối chảy ngược
           xuống qua cả hai luống cũ
     TH3   dạo quanh      BAY  camera bay lên, vạch đường xoắn
     HOI   câu hỏi, rồi thẻ bài học

   Màu của cả khung cảnh kể chuyện: xám nâu → tối → xanh → vàng bụi →
   rực rỡ. Xem BANG_MAU.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  /* ---------- bố cục (m) ---------- */
  var LUONG = [
    { x: 3.4,  z: 3.0,  R: 2.0, h: 0.12 },
    { x: -3.3, z: 1.2,  R: 1.9, h: 0.75 },
    { x: 0.0,  z: -3.3, R: 2.4, h: 1.5 }
  ];
  var DOC = 1.4;                                   // bề rộng sườn quanh mỗi luống
  /* lối đá: từ luống 1 vòng ngược chiều kim đồng hồ lên luống 3 */
  var DUONG = [[3.4, 3.0, 0.12], [1.6, 4.4, 0.2], [-0.8, 4.4, 0.36], [-2.8, 3.2, 0.58],
               [-3.3, 1.2, 0.75], [-4.0, -1.4, 0.98], [-2.7, -3.8, 1.25], [0.0, -3.3, 1.5]];
  /* đường xoắn còn đi tiếp lên trời — chỉ hiện trong đoạn camera bay */
  var DUONG_TIEP = [[0.0, -3.3, 1.5], [1.9, -2.0, 2.0], [1.7, 0.0, 2.6], [0.2, 1.0, 3.2],
                    [-0.9, 0.0, 3.8], [-0.4, -1.2, 4.3], [0.4, -0.9, 4.7]];
  var SPAWN  = [5.3, 5.9];
  var BIA    = [2.2, 6.0];
  var GIENG  = [5.3, 1.5];
  var GUONG  = [1.3, 1.7];
  var MUN    = [[5.8, 3.7], [3.1, 0.6], [4.5, 5.0]];
  var NGUON2 = [-5.5, 2.4];
  var SUOI2  = [[-5.5, 2.4], [-4.9, 2.0], [-4.2, 1.5], [-3.6, 1.3]];
  var HOA2   = [[-1.9, 2.3], [-4.5, -0.2], [-2.0, -0.1]];
  var CON2   = [[-2.2, 1.9], [-4.3, 0.4], [-2.7, -0.3]];
  var GOM    = { gomHat: [-2.6, 1.7], gomNuoc: [-5.5, 2.4], gomMun: [-3.9, 0.2] };
  var CAY3   = [[0.1, -3.6], [1.7, -2.5], [-1.4, -4.7]];
  var CON3   = [[1.0, -5.0], [2.2, -3.9], [-1.9, -2.6], [-0.6, -2.0]];
  var SUOI3  = [[1.6, -4.9], [-0.4, -5.4], [-2.4, -4.9], [-3.9, -3.6], [-5.0, -1.6], [-5.7, 0.4],
                [-5.5, 2.2], [-4.6, 3.5], [-2.6, 4.5], [-0.6, 5.3], [1.3, 5.4], [2.6, 4.7], [3.0, 3.8]];
  var NGUON3 = SUOI3[0];

  /* ---------- nhịp chơi ---------- */
  var TAM_VOI   = 3.8;      // nhìn vật trong tầm này mới tác động được
  var TOC_GUONG = 0.9;      // rad/giây khi giữ để xoay gương
  var KHOP_GUONG = 0.07;    // lệch dưới chừng này là vệt nắng trúng cây
  var NHIN_TRE  = 0.35;

  var PHA = ['TH1', 'LON1', 'QUA1', 'HAI', 'TAN1', 'HAT1', 'GIEO2', 'LON2', 'TH2',
             'TAN2', 'GOM', 'LON3', 'TH3', 'BAY', 'HOI'];

  /* Bảng màu theo chặng: 0 khởi đầu · 1 tàn lần 1 · 2 xanh · 3 tàn lần 2 · 4 khu vườn mới */
  var BANG_MAU = [
    { tren: 0xa7abae, chan: 0xd8ccb6, dat: 0x8a7356, doi: 0x9a8d76, hT: 0xe9e2d4, hD: 0x6f604d, nang: 0xffeed6, nI: 1.0,  hI: 0.55, suong: 0.020 },
    { tren: 0x7b7d84, chan: 0xb1a089, dat: 0x6c5a46, doi: 0x7b705d, hT: 0xb9b2a8, hD: 0x4d4236, nang: 0xffd9b0, nI: 0.55, hI: 0.45, suong: 0.028 },
    { tren: 0x7cb4e4, chan: 0xe6eed8, dat: 0x86704f, doi: 0x7c9e62, hT: 0xeaf4ff, hD: 0x5f7a45, nang: 0xfff4e0, nI: 1.2,  hI: 0.6,  suong: 0.016 },
    { tren: 0xb8a27a, chan: 0xe9d19e, dat: 0x977c55, doi: 0xa69760, hT: 0xf2e2c0, hD: 0x7a6a45, nang: 0xffd59a, nI: 1.0,  hI: 0.55, suong: 0.022 },
    { tren: 0x6ca6e4, chan: 0xffe0c2, dat: 0x7c8650, doi: 0x6c985a, hT: 0xfff4e6, hD: 0x5f8a4a, nang: 0xfff0d4, nI: 1.3,  hI: 0.65, suong: 0.014 }
  ];
  var MAU_XANH = 0x557f36, MAU_VANG = 0xa18a3c;

  var S, o, el;

  /* ═══════════ tiện ích ═══════════ */

  function ss(a, b, x) {
    var t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function gocGon(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function idx(p) { return PHA.indexOf(p); }
  function tu(p) { return idx(S.pha) >= idx(p); }

  /* số ngẫu nhiên có hạt giống — cây dựng lại vẫn y hình cũ */
  function rng(s) {
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function mat(mau, them) {
    var p = { color: mau, roughness: 0.85, flatShading: true };
    if (them) for (var k in them) p[k] = them[k];
    return new THREE.MeshStandardMaterial(p);
  }

  /* Làm méo khối cho ra đá, ra tán lá. Đỉnh trùng vị trí thì méo như nhau,
     nên mặt không bị toác ở đường nối. */
  function meo(geo, bien, r) {
    r = r || Math.random;
    var p = geo.attributes.position, nho = {};
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var k = Math.round(x * 500) + ',' + Math.round(y * 500) + ',' + Math.round(z * 500);
      if (!nho[k]) nho[k] = [(r() - 0.5) * bien, (r() - 0.5) * bien, (r() - 0.5) * bien];
      p.setXYZ(i, x + nho[k][0], y + nho[k][1], z + nho[k][2]);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  function canvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  function texQuang() {
    var c = canvas(128, 128), g = c.getContext('2d');
    var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.25, 'rgba(255,255,255,.45)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  function quang(mau, co) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: o.texQuang, color: mau, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    s.scale.setScalar(co);
    return s;
  }

  /* ═══════════ địa hình ═══════════ */

  /* Cao độ mặt đất tại (x, z): ba gò đất phẳng đỉnh, một con dốc đi theo
     lối đá, và chút gợn ở những chỗ còn lại. Người chơi bám theo đúng hàm
     này (player.groundAt), nên thấy gì thì đứng nấy. */
  function hDat(x, z) {
    var h = 0, phang = 0;
    for (var i = 0; i < LUONG.length; i++) {
      var L = LUONG[i], d = Math.hypot(x - L.x, z - L.z);
      h = Math.max(h, L.h * (1 - ss(L.R, L.R + DOC, d)));
      phang = Math.max(phang, 1 - ss(L.R * 0.8, L.R + 0.2, d));
    }
    var gan = ganDuong(x, z);
    h = Math.max(h, gan.h * (1 - ss(0.75, 1.7, gan.d)));
    phang = Math.max(phang, 1 - ss(0.4, 1.0, gan.d));
    return h + (Math.sin(x * 0.9 + 1.0) * Math.cos(z * 1.1) * 0.06 + Math.sin(x * 2.3 + z * 1.7) * 0.02) * (1 - phang);
  }

  var _gan = { d: 0, h: 0, i: 0 };
  function ganDuong(x, z) {
    var m = o.mauDuong, best = 1e9, bi = 0;
    for (var i = 0; i < m.length; i++) {
      var dx = x - m[i].x, dz = z - m[i].z, d = dx * dx + dz * dz;
      if (d < best) { best = d; bi = i; }
    }
    _gan.d = Math.sqrt(best); _gan.h = m[bi].y; _gan.i = bi;
    return _gan;
  }

  function dungMauDuong() {
    var c = new THREE.CatmullRomCurve3(DUONG.map(function (p) { return new THREE.Vector3(p[0], p[2], p[1]); }));
    o.congDuong = c;
    o.mauDuong = c.getSpacedPoints(160);
  }

  /* Trải một geometry (đã nằm ngang) lên mặt đất, cách đất một chút. */
  function phuDat(geo, cx, cz, nang) {
    var p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) p.setY(i, hDat(p.getX(i) + cx, p.getZ(i) + cz) + nang);
    p.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  /* ═══════════ trời ═══════════ */

  var TROI_VS = [
    'varying vec3 vDir;',
    'void main() {',
    '  vDir = position;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var TROI_FS = [
    'uniform vec3 uTren;',
    'uniform vec3 uChan;',
    'uniform vec3 uNang;',
    'varying vec3 vDir;',
    'void main() {',
    '  vec3 d = normalize(vDir);',
    '  float h = d.y;',
    '  vec3 c = mix(uChan, uTren, smoothstep(-0.02, 0.55, h));',
    '  c = mix(c, uChan * 0.92, smoothstep(0.0, -0.3, h));',
    '  vec3 mt = normalize(vec3(0.5, 0.62, 0.35));',
    '  float m = max(dot(d, mt), 0.0);',
    '  c += uNang * (pow(m, 220.0) * 1.1 + pow(m, 9.0) * 0.18);',
    '  gl_FragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  /* ═══════════ dòng nước ═══════════ */

  var NUOC_VS = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var NUOC_FS = [
    'uniform float uTime;',
    'uniform float uDoMo;',
    'uniform vec3 uMau;',
    'varying vec2 vUv;',
    'void main() {',
    '  float bien = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);',
    '  float song = 0.5 + 0.5 * sin(vUv.y * 5.0 - uTime * 2.6 + sin(vUv.x * 9.0 + vUv.y * 2.0) * 1.2);',
    '  float lap = pow(0.5 + 0.5 * sin(vUv.y * 13.0 - uTime * 4.2 + vUv.x * 5.0), 8.0);',
    '  vec3 c = mix(uMau, vec3(0.93, 0.98, 1.0), song * 0.22 + lap * 0.55);',
    '  gl_FragColor = vec4(c, bien * uDoMo * (0.72 + 0.28 * song));',
    '}'
  ].join('\n');

  /* Dải nước trải theo mặt đất qua các điểm [x, z]. Trả về mesh; cho
     nước "chảy tới" bằng setDrawRange theo tỉ lệ 0..1 (xem moSuoi). */
  function dungSuoi(g, diem, rong) {
    var cong = new THREE.CatmullRomCurve3(diem.map(function (p) { return new THREE.Vector3(p[0], 0, p[1]); }));
    var pts = cong.getSpacedPoints(Math.max(16, Math.round(cong.getLength() * 6)));
    var n = pts.length, pos = new Float32Array(n * 6), uv = new Float32Array(n * 4), chiSo = [];
    var dai = 0;
    for (var i = 0; i < n; i++) {
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      var tx = b.x - a.x, tz = b.z - a.z, l = Math.hypot(tx, tz) || 1;
      var nx = -tz / l * rong / 2, nz = tx / l * rong / 2;
      if (i) dai += pts[i].distanceTo(pts[i - 1]);
      var lx = pts[i].x + nx, lz = pts[i].z + nz, rx = pts[i].x - nx, rz = pts[i].z - nz;
      pos.set([lx, hDat(lx, lz) + 0.04, lz, rx, hDat(rx, rz) + 0.04, rz], i * 6);
      uv.set([0, dai / rong * 0.5, 1, dai / rong * 0.5], i * 4);
      if (i < n - 1) chiSo.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(chiSo);
    geo.setDrawRange(0, 0);
    var m = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms: { uTime: TX.uTime, uDoMo: { value: 0.9 }, uMau: { value: new THREE.Color(0x4f9fd6) } },
      vertexShader: NUOC_VS, fragmentShader: NUOC_FS,
      transparent: true, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
    }));
    m.renderOrder = 2;
    m.userData.tong = chiSo.length;
    g.add(m);
    return m;
  }

  function moSuoi(m, k) {
    m.geometry.setDrawRange(0, Math.floor(Math.max(0, Math.min(1, k)) * m.userData.tong / 6) * 6);
  }

  /* ═══════════ cỏ và hoa: mọc lên bằng một uniform ═══════════
     Mỗi vùng là một InstancedMesh. Vertex shader nhân chiều cao cục bộ
     của mỗi ngọn với uCao, nên chỉ cần đổi một số là cả vùng mọc lên hay
     rạp xuống — không phải cập nhật từng ngọn. */

  function vatLieuMoc(uCao, lac) {
    var m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
    m.onBeforeCompile = function (sh) {
      sh.uniforms.uCao = uCao;
      sh.uniforms.uTime = TX.uTime;
      sh.vertexShader = 'uniform float uCao;\nuniform float uTime;\n' + sh.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n' +
        '  transformed.y *= uCao;\n' +
        '#ifdef USE_INSTANCING\n' +
        '  float ph = instanceMatrix[3].x * 1.7 + instanceMatrix[3].z * 1.3;\n' +
        '  transformed.x += sin(uTime * 1.7 + ph) * ' + lac.toFixed(3) + ' * position.y * uCao;\n' +
        '#endif'
      );
    };
    return m;
  }

  /* chọn n điểm ngẫu nhiên thoả điều kien(x, z) */
  function rai(n, x0, x1, z0, z1, dieuKien, r) {
    r = r || Math.random;
    var ra = [], thu = 0;
    while (ra.length < n && thu++ < n * 60) {
      var x = x0 + r() * (x1 - x0), z = z0 + r() * (z1 - z0);
      if (dieuKien(x, z)) ra.push([x, z]);
    }
    return ra;
  }

  function dungCo(g, diem, uCao, mauCo) {
    var geo = new THREE.ConeGeometry(0.03, 0.32, 3);
    geo.translate(0, 0.16, 0);
    var m = new THREE.InstancedMesh(geo, vatLieuMoc(uCao, 0.25), diem.length);
    var mt = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    var c = new THREE.Color();
    diem.forEach(function (d, i) {
      e.set((Math.random() - 0.5) * 0.4, Math.random() * 6.28, (Math.random() - 0.5) * 0.4);
      q.setFromEuler(e);
      var k = 0.6 + Math.random() * 0.8;
      s.set(k, k * (0.7 + Math.random() * 0.6), k);
      p.set(d[0], hDat(d[0], d[1]) - 0.02, d[1]);
      m.setMatrixAt(i, mt.compose(p, q, s));
      m.setColorAt(i, c.setHex(mauCo[i % mauCo.length]));
    });
    m.receiveShadow = true;
    g.add(m);
    return m;
  }

  function dungHoa(g, diem, uCao, mauHoa) {
    var geoCuong = new THREE.CylinderGeometry(0.008, 0.012, 0.34, 4);
    geoCuong.translate(0, 0.17, 0);
    var geoBong = new THREE.IcosahedronGeometry(0.06, 0);
    geoBong.scale(1, 0.55, 1);
    geoBong.translate(0, 0.35, 0);
    var cuong = new THREE.InstancedMesh(geoCuong, vatLieuMoc(uCao, 0.12), diem.length);
    var bong = new THREE.InstancedMesh(geoBong, vatLieuMoc(uCao, 0.12), diem.length);
    var mt = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    var c = new THREE.Color();
    diem.forEach(function (d, i) {
      e.set(0, Math.random() * 6.28, 0);
      q.setFromEuler(e);
      s.setScalar(0.75 + Math.random() * 0.6);
      p.set(d[0], hDat(d[0], d[1]) - 0.01, d[1]);
      mt.compose(p, q, s);
      cuong.setMatrixAt(i, mt);
      bong.setMatrixAt(i, mt);
      cuong.setColorAt(i, c.setHex(0x4f8a34));
      bong.setColorAt(i, c.setHex(mauHoa[i % mauHoa.length]));
    });
    g.add(cuong);
    g.add(bong);
    return [cuong, bong];
  }

  /* ═══════════ cây ═══════════
     d: { x, z, cao, day, canh, tan, soTan, soQua, mauLa, mauThan, mauQua, re, hat }
     Trả về một đối tượng có dat(m, heo): m là độ lớn 0..1, heo là độ tàn
     0..1 (lá ngả vàng rồi nâu, teo lại, thân xám đi, cây nghiêng). */

  function taoCay(g, d) {
    var r = rng(d.hat || 7);
    var A = TX.anim;
    var nhom = new THREE.Group();
    nhom.position.set(d.x, hDat(d.x, d.z) - 0.03, d.z);
    g.add(nhom);

    var matThan = mat(d.mauThan || 0x6b5038, { roughness: 0.95 });
    var matLa = mat(d.mauLa, { roughness: 0.8 });
    var matQua = mat(d.mauQua || 0xd9542e, { emissive: 0x5a1a08, emissiveIntensity: 0.4, roughness: 0.45, flatShading: false });

    var geoThan = new THREE.CylinderGeometry(d.day * 0.45, d.day, d.cao, 9, 5);
    geoThan.translate(0, d.cao / 2, 0);
    var ph = r() * 6, pt = geoThan.attributes.position;
    for (var i = 0; i < pt.count; i++) {
      var k = pt.getY(i) / d.cao;
      pt.setX(i, pt.getX(i) + Math.sin(k * 2.4 + ph) * d.day * 0.9 * k);
    }
    geoThan.computeVertexNormals();
    var than = new THREE.Mesh(geoThan, matThan);
    than.castShadow = true;
    nhom.add(than);

    var canh = [];
    for (var c = 0; c < d.canh; c++) {
      var hk = d.cao * (0.42 + 0.5 * (c + 0.5) / d.canh);
      var a = c * 2.399 + r() * 0.6;
      var t = 0.55 + r() * 0.45;
      var L = d.cao * (0.3 + r() * 0.16) * (1 - 0.3 * c / d.canh);
      var geo = new THREE.CylinderGeometry(d.day * 0.16, d.day * 0.42, L, 6);
      geo.translate(0, L / 2, 0);
      var piv = new THREE.Group();
      piv.rotation.order = 'YXZ';
      piv.rotation.set(t, a, 0);
      var mc = new THREE.Mesh(geo, matThan);
      mc.castShadow = true;
      piv.add(mc);
      nhom.add(piv);
      canh.push({ piv: piv, hk: hk, L: L, huong: new THREE.Vector3(Math.sin(a) * Math.sin(t), Math.cos(t), Math.cos(a) * Math.sin(t)), s: 0 });
    }

    /* tán lá: một chùm ở đỉnh thân, một chùm ở mỗi đầu cành, còn lại rải quanh */
    var tan = [];
    function chum(goc, lech, rr) {
      var m = new THREE.Mesh(meo(new THREE.IcosahedronGeometry(rr, 1), rr * 0.35, r), matLa);
      m.castShadow = true;
      m.rotation.set(r() * 3, r() * 3, 0);
      nhom.add(m);
      tan.push({ m: m, goc: goc, lech: lech, r: rr });
    }
    chum(-1, new THREE.Vector3(0, d.tan * 0.4, 0), d.tan * 1.1);
    canh.forEach(function (cn, j) { chum(j, new THREE.Vector3(0, d.tan * 0.25, 0), d.tan * (0.8 + r() * 0.35)); });
    for (var e = tan.length; e < d.soTan; e++) {
      var j = Math.floor(r() * (canh.length + 1)) - 1;
      var v = new THREE.Vector3(r() - 0.5, r() * 0.6, r() - 0.5).normalize().multiplyScalar(d.tan * 0.85);
      chum(j, v, d.tan * (0.6 + r() * 0.35));
    }

    /* quả nằm trên mặt các chùm lá, phía dưới nhiều hơn phía trên */
    var qua = [];
    for (var q = 0; q < d.soQua; q++) {
      var ti = q % tan.length;
      var hv = new THREE.Vector3(r() - 0.5, -0.6 + r() * 0.9, r() - 0.5).normalize();
      var mq = new THREE.Mesh(new THREE.SphereGeometry(0.055 + d.tan * 0.05, 10, 8), matQua);
      mq.castShadow = true;
      mq.visible = false;
      nhom.add(mq);
      qua.push({ m: mq, tan: ti, huong: hv });
    }

    /* rễ nổi trên mặt đất */
    var reNhom = null;
    if (d.re) {
      reNhom = new THREE.Group();
      for (var k2 = 0; k2 < 6; k2++) {
        var ar = k2 / 6 * 6.28 + r() * 0.5, lr = d.cao * (0.28 + r() * 0.12);
        var cr = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.12, 0),
          new THREE.Vector3(Math.cos(ar) * lr * 0.4, 0.06, Math.sin(ar) * lr * 0.4),
          new THREE.Vector3(Math.cos(ar + 0.2) * lr, -0.04, Math.sin(ar + 0.2) * lr)
        ]);
        var mr = new THREE.Mesh(new THREE.TubeGeometry(cr, 10, d.day * 0.32, 5, false), matThan);
        mr.castShadow = true;
        reNhom.add(mr);
      }
      nhom.add(reNhom);
    }

    var mauLa0 = new THREE.Color(d.mauLa), mauThan0 = new THREE.Color(d.mauThan || 0x6b5038);
    var VANG = new THREE.Color(0xc9a446), NAU = new THREE.Color(0x7a5a34), XAM = new THREE.Color(0x6e6258);
    var _v = new THREE.Vector3();

    var cay = {
      nhom: nhom, tan: tan, qua: qua, vQua: 0, m: 0, heo: 0,

      dat: function (m, heo) {
        cay.m = m; cay.heo = heo;
        nhom.visible = m > 0.002;
        if (!nhom.visible) return;
        var sy = Math.max(0.03, A.chamDan(A.doan(m, 0, 0.6)));
        var sx = 0.3 + 0.7 * A.doan(m, 0, 0.85);
        than.scale.set(sx, sy, sx);
        canh.forEach(function (cn, j) {
          var n = canh.length;
          cn.s = Math.max(0.001, A.chamDan(A.doan(m, 0.25 + 0.3 * j / n, 0.62 + 0.3 * j / n)));
          cn.piv.position.set(0, cn.hk * sy, 0);
          cn.piv.scale.setScalar(cn.s);
        });
        var nt = tan.length;
        tan.forEach(function (ta, j) {
          if (ta.goc < 0) _v.set(0, d.cao * sy, 0);
          else { var cn = canh[ta.goc]; _v.copy(cn.piv.position).addScaledVector(cn.huong, cn.L * cn.s); }
          var sc = ta.goc < 0 ? sy : canh[ta.goc].s;
          ta.m.position.copy(_v).addScaledVector(ta.lech, sc);
          var k = (j === 0 ? A.vot(A.doan(m, 0.04, 0.3), 1.4)
                           : A.vot(A.doan(m, 0.42 + 0.35 * j / nt, 0.72 + 0.28 * j / nt), 1.4)) * (1 - 0.9 * heo);
          ta.m.scale.setScalar(Math.max(0.001, k));
          ta.m.visible = k > 0.01;
        });
        if (heo < 0.5) matLa.color.copy(mauLa0).lerp(VANG, heo * 2);
        else matLa.color.copy(VANG).lerp(NAU, (heo - 0.5) * 2);
        matThan.color.copy(mauThan0).lerp(XAM, heo * 0.7);
        nhom.rotation.z = heo * (d.nghieng || 0.05);
        /* quả: hiện lần lượt theo vQua */
        var nq = cay.vQua * qua.length;
        qua.forEach(function (qu, j) {
          var k = A.vot(A.doan(nq - j, 0, 1), 2) * Math.min(1, m * 1.2);
          qu.m.visible = k > 0.01;
          if (!qu.m.visible) return;
          var ta = tan[qu.tan];
          qu.m.position.copy(ta.m.position).addScaledVector(qu.huong, ta.r * 0.9 * ta.m.scale.x);
          qu.m.scale.setScalar(k);
        });
        if (reNhom) {
          var kr = A.doan(m, 0.15, 0.7);
          reNhom.scale.set(Math.max(0.001, kr), 1, Math.max(0.001, kr));
        }
      },

      /* vị trí thế giới của một chùm lá đang hiện, để rắc lá rụng */
      viTriLa: function (out) {
        var hien = tan.filter(function (t) { return t.m.visible; });
        if (!hien.length) return null;
        var t = hien[Math.floor(Math.random() * hien.length)];
        t.m.getWorldPosition(out);
        out.x += (Math.random() - 0.5) * t.r * t.m.scale.x * 1.6;
        out.y += (Math.random() - 0.5) * t.r * t.m.scale.x;
        out.z += (Math.random() - 0.5) * t.r * t.m.scale.x * 1.6;
        return out;
      }
    };
    cay.dat(0, 0);
    return cay;
  }

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    var g = ctx.scene;

    S = {
      pha: 'TH1', t: 0, batDau: false,
      th1: { nuoc: false, sang: false, bon: false },
      tay: { nuoc: false, mun: 0, hat: false },
      m1: 0.12, heo1: 0, m2: 0, heo2: 0,
      dacTinh: null,
      th2: { nguon: false, hoa: [false, false, false], ong: 0, thuPhan: 0, con: 0, onT: 0, suoi: 0 },
      tan2: { re: 0, nuoc: 1, hoaHeo: 0, ongDi: 0, conHeo: 0 },
      gom: { gomHat: false, gomNuoc: false, gomMun: false },
      m3: 0, m3b: 0, m3c: 0, hoa3: 0, suoi3: 0, buom: 0,
      kk: 0, kkDich: 0,
      da: {},                 // những thông báo / khoảnh khắc đã xảy ra
      tacTruoc: 0, bam: false,
      chon: null, nhamId: null, nhamT: 0,
      tb: 0, chimT: 3, suoiDau: 0
    };
    o = {
      nhin: [], tia: new THREE.Raycaster(), diemNhin: new THREE.Vector2(),
      texQuang: texQuang(), vung: [], mun: [], hoa2: [], ong: [], buom: [], con2: [], con3: []
    };

    dungMauDuong();

    /* sương và nền lấy theo bảng màu, cập nhật mỗi khung hình */
    ctx.moiTruong.suong.density = BANG_MAU[0].suong;

    dungTroi(g);
    dungDat(g);
    dungTuongRao(g);
    dungDoi(g);
    dungLoiDa(g);
    dungBia(g, ctx.text.bia);
    dungAnhSang(g);

    dungLuong1(g);
    dungLuong2(g);
    dungLuong3(g);
    dungCoVaHoa(g);
    dungXoan(g);
    dungTay(g);

    o.la    = TX.heHat(g, 260, 0xb08a48, 0.09, 0.95);
    o.sang  = TX.heHat(g, 220, 0xffcf6a, 0.08, 0.95);
    o.giot  = TX.heHat(g, 90, 0x6fb4e8, 0.06, 0.9);
    o.bui = TX.domSang(g, {
      soLuong: 80, tam: [0, 2.2, 0], rong: [13, 3.4, 13],
      mau: [0xffe7a0, 0xf6c6de, 0xbfe3ff, 0xd8f0a0], co: [8, 18], doMo: 0.2, troi: 0.45
    });

    var P = ctx.player;
    P.bounds = 6.6;
    P.groundAt = hDat;
    P.blockers = [
      { x: LUONG[0].x, z: LUONG[0].z, r: 0.4 },
      { x: GIENG[0], z: GIENG[1], r: 0.85 },
      { x: GUONG[0], z: GUONG[1], r: 0.4 },
      { x: BIA[0], z: BIA[1], r: 0.6 },
      { x: NGUON2[0], z: NGUON2[1], r: 0.55 },
      { x: NGUON3[0], z: NGUON3[1], r: 0.5 }
    ];
    P.spawn(SPAWN[0], SPAWN[1]);
    P.onClick = function () { if (S) S.bam = true; };

    dungONhiemVu(ctx);
    ctx.hud.hienPanel(false);
  }

  function dungTroi(g) {
    o.troiU = { uTren: { value: new THREE.Color() }, uChan: { value: new THREE.Color() }, uNang: { value: new THREE.Color(0xfff0d0) } };
    var troi = new THREE.Mesh(
      new THREE.SphereGeometry(58, 32, 16),
      new THREE.ShaderMaterial({ uniforms: o.troiU, vertexShader: TROI_VS, fragmentShader: TROI_FS, side: THREE.BackSide, depthWrite: false, fog: false })
    );
    g.add(troi);
  }

  /* đất khô nứt — vẽ một lần, màu do màu đỉnh (vertex color) nhuộm */
  function texDat() {
    var c = canvas(1024, 1024), g = c.getContext('2d');
    g.fillStyle = '#d8d0c4';
    g.fillRect(0, 0, 1024, 1024);
    for (var i = 0; i < 2600; i++) {
      var s = Math.random() < 0.5 ? 'rgba(90,70,50,' : 'rgba(255,250,240,';
      g.fillStyle = s + (0.05 + Math.random() * 0.12) + ')';
      var r = 1 + Math.random() * 4;
      g.fillRect(Math.random() * 1024, Math.random() * 1024, r, r);
    }
    g.strokeStyle = 'rgba(70,52,36,.32)';
    for (var k = 0; k < 70; k++) {
      var px = Math.random() * 1024, py = Math.random() * 1024;
      g.lineWidth = 0.8 + Math.random() * 1.6;
      g.beginPath(); g.moveTo(px, py);
      for (var j = 0; j < 5; j++) { px += (Math.random() - 0.5) * 70; py += (Math.random() - 0.5) * 70; g.lineTo(px, py); }
      g.stroke();
    }
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 4);
    t.anisotropy = 4;
    return t;
  }

  function dungDat(g) {
    var geo = new THREE.PlaneGeometry(15.4, 15.4, 96, 96);
    geo.rotateX(-Math.PI / 2);
    var p = geo.attributes.position, n = p.count;
    for (var i = 0; i < n; i++) p.setY(i, hDat(p.getX(i), p.getZ(i)));
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));

    /* trọng số của từng vùng cho mỗi đỉnh: ba luống và lối đá */
    LUONG.forEach(function (L, k) {
      var w = new Float32Array(n);
      for (var i = 0; i < n; i++) w[i] = 1 - ss(L.R * 0.85, L.R + 1.1, Math.hypot(p.getX(i) - L.x, p.getZ(i) - L.z));
      o.vung.push({ w: w, xanh: 0, xanhDich: 0, vang: 0, vangDich: 0, uCo: { value: 0 } });
    });
    var wd = new Float32Array(n);
    for (var j = 0; j < n; j++) wd[j] = 1 - ss(0.5, 1.5, ganDuong(p.getX(j), p.getZ(j)).d);
    o.vung.push({ w: wd, xanh: 0, xanhDich: 0, vang: 0, vangDich: 0, uCo: { value: 0 } });

    o.dat = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: texDat(), vertexColors: true, roughness: 0.95 }));
    o.dat.receiveShadow = true;
    g.add(o.dat);
    o.datKy = -1;

    /* đất ngoài rào, kéo ra tới chân trời */
    o.matNgoai = new THREE.MeshStandardMaterial({ color: 0x8a7356, roughness: 1 });
    var ngoai = new THREE.Mesh(new THREE.RingGeometry(10.5, 70, 48, 1), o.matNgoai);
    ngoai.rotation.x = -Math.PI / 2;
    ngoai.position.y = -0.15;
    g.add(ngoai);
    var ke = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), o.matNgoai);
    ke.rotation.x = -Math.PI / 2;
    ke.position.y = -0.16;
    g.add(ke);

    /* đất tơi sẫm màu ở giữa mỗi luống */
    o.matToi = mat(0x4a3a2a, { roughness: 1, flatShading: false });
    LUONG.forEach(function (L) {
      var gd = new THREE.CircleGeometry(1.05, 36);
      gd.rotateX(-Math.PI / 2);
      var m = new THREE.Mesh(phuDat(gd, L.x, L.z, 0.015), o.matToi);
      m.position.set(L.x, 0, L.z);
      m.receiveShadow = true;
      g.add(m);
    });

    /* kè đá quanh hai luống cao */
    var matDa = mat(0x9b9184);
    [1, 2].forEach(function (k) {
      var L = LUONG[k], soDa = Math.round((L.R + 0.3) * 9);
      for (var i = 0; i < soDa; i++) {
        var a = i / soDa * 6.28 + Math.random() * 0.1;
        var x = L.x + Math.cos(a) * (L.R + 0.3), z = L.z + Math.sin(a) * (L.R + 0.3);
        if (ganDuong(x, z).d < 0.9) continue;     // chừa lối đi
        var rr = 0.16 + Math.random() * 0.12;
        var m = new THREE.Mesh(meo(new THREE.DodecahedronGeometry(rr, 0), rr * 0.4), matDa);
        m.position.set(x, hDat(x, z) - rr * 0.2, z);
        m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
        m.castShadow = true;
        g.add(m);
      }
    });
  }

  function dungTuongRao(g) {
    var matDa = mat(0xa39886);
    var K = 7.35;
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (h) {
      for (var s = -K; s < K; s += 0.62) {
        var w = 0.5 + Math.random() * 0.2, cao = 0.38 + Math.random() * 0.22;
        var m = new THREE.Mesh(meo(new THREE.BoxGeometry(w, cao, 0.42, 2, 1, 1), 0.08), matDa);
        if (h[0] === 0) m.position.set(s + 0.31, cao / 2 - 0.05, h[1] * K);
        else m.position.set(h[0] * K, cao / 2 - 0.05, s + 0.31);
        if (h[0] !== 0) m.rotation.y = Math.PI / 2;
        m.castShadow = true;
        m.receiveShadow = true;
        g.add(m);
      }
    });
  }

  /* đồi xa: chân trời mềm, đổi màu theo khu vườn */
  function dungDoi(g) {
    o.matDoi = mat(0x9a8d76, { roughness: 1, flatShading: false });
    for (var i = 0; i < 14; i++) {
      var a = i / 14 * 6.28 + Math.random() * 0.3, d = 24 + Math.random() * 10, r = 7 + Math.random() * 6;
      var m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 10), o.matDoi);
      m.scale.y = 0.22 + Math.random() * 0.18;
      m.position.set(Math.cos(a) * d, -0.5, Math.sin(a) * d);
      g.add(m);
    }
  }

  function dungLoiDa(g) {
    var matDa = mat(0xbdb1a0, { roughness: 0.9 });
    var dai = o.congDuong.getLength(), r = rng(11);
    for (var s = 0.9; s < dai - 1.2; s += 0.62) {
      var p = o.congDuong.getPointAt(s / dai), tg = o.congDuong.getTangentAt(s / dai);
      var lech = (r() - 0.5) * 0.3;
      var x = p.x - tg.z * lech, z = p.z + tg.x * lech;
      var rr = 0.24 + r() * 0.08;
      var m = new THREE.Mesh(meo(new THREE.CylinderGeometry(rr, rr * 1.05, 0.08, 9), 0.05, r), matDa);
      m.position.set(x, hDat(x, z) + 0.02, z);
      m.rotation.y = r() * 3;
      m.receiveShadow = true;
      m.castShadow = true;
      g.add(m);
    }
  }

  function dungBia(g, B) {
    var c = canvas(512, 640), x = c.getContext('2d');
    x.fillStyle = '#b9b0a2';
    x.fillRect(0, 0, 512, 640);
    for (var i = 0; i < 90; i++) {
      var px = Math.random() * 512, py = Math.random() * 640, r = 20 + Math.random() * 80;
      var v = x.createRadialGradient(px, py, 0, px, py, r);
      var sang = Math.random() < 0.5;
      v.addColorStop(0, sang ? 'rgba(230,224,214,.35)' : 'rgba(90,80,70,.22)');
      v.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = v;
      x.fillRect(px - r, py - r, r * 2, r * 2);
    }
    x.strokeStyle = 'rgba(70,58,44,.55)';
    x.lineWidth = 3;
    x.strokeRect(26, 26, 460, 588);
    x.textAlign = 'center';
    x.fillStyle = '#3e3326';
    x.font = '700 38px ' + TX.FONT_TIEU_DE;
    x.fillText(B.tieuDe, 256, 120);
    x.strokeStyle = 'rgba(70,58,44,.5)';
    x.lineWidth = 2;
    x.beginPath(); x.moveTo(150, 156); x.lineTo(362, 156); x.stroke();
    x.font = 'italic 600 40px ' + TX.FONT_FANTASY;
    B.dong.forEach(function (d, k) { x.fillText(d, 256, 250 + k * 62); });
    /* ba chấm, như ba thế hệ */
    [216, 256, 296].forEach(function (cx, k) { x.beginPath(); x.arc(cx, 540 - k * 6, 6 + k * 2, 0, 6.28); x.fill(); });
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;

    var nhom = new THREE.Group();
    nhom.position.set(BIA[0], hDat(BIA[0], BIA[1]), BIA[1]);
    nhom.rotation.y = Math.atan2(SPAWN[0] - BIA[0], SPAWN[1] - BIA[1]) - 0.5;
    var matDa = mat(0xa79d8e);
    var de = new THREE.Mesh(meo(new THREE.BoxGeometry(1.4, 0.3, 0.6, 2, 1, 1), 0.06), matDa);
    de.position.y = 0.1;
    de.castShadow = true;
    nhom.add(de);
    var tam = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 0.18), [matDa, matDa, matDa, matDa,
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), matDa]);
    tam.position.y = 0.95;
    tam.castShadow = true;
    nhom.add(tam);
    g.add(nhom);
    vungNhin(g, new THREE.BoxGeometry(1.3, 1.8, 0.7), [BIA[0], nhom.position.y + 0.9, BIA[1]], 'bia');
  }

  function dungAnhSang(g) {
    o.hemi = new THREE.HemisphereLight(0xffffff, 0x666666, 0.55);
    g.add(o.hemi);
    g.add(new THREE.AmbientLight(0xfff4e6, 0.12));
    o.nang = new THREE.DirectionalLight(0xfff0d8, 1.0);
    o.nang.position.set(7, 11, 5);
    o.nang.castShadow = true;
    o.nang.shadow.mapSize.set(2048, 2048);
    var sc = o.nang.shadow.camera;
    sc.left = sc.bottom = -10; sc.right = sc.top = 10; sc.near = 1; sc.far = 30;
    o.nang.shadow.bias = -0.0006;
    o.nang.shadow.radius = 3;
    g.add(o.nang);
    g.add(o.nang.target);
  }

  /* hộp ẩn để bắt ánh nhìn */
  function vungNhin(g, geo, p, id, them) {
    var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
    m.visible = false;                 // r128: tia vẫn trúng vật ẩn
    m.position.set(p[0], p[1], p[2]);
    m.userData.id = id;
    if (them) for (var k in them) m.userData[k] = them[k];
    g.add(m);
    o.nhin.push(m);
    return m;
  }

  function vongSang(g, L, r, mau) {
    var mt = new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0, depthWrite: false });
    var m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.035, 8, 64), mt);
    m.rotation.x = Math.PI / 2;
    m.position.set(L.x, L.h + 0.06, L.z);
    g.add(m);
    return m;
  }

  /* ═══════════ luống 1: cây non, giếng, gương, mùn ═══════════ */

  function dungLuong1(g) {
    var L = LUONG[0];
    o.cay1 = taoCay(g, { x: L.x, z: L.z, cao: 1.45, day: 0.06, canh: 2, tan: 0.3, soTan: 4, soQua: 3,
                         mauLa: 0x93ae5c, mauThan: 0x7a5f45, hat: 3, nghieng: 0.12 });
    vungNhin(g, new THREE.CylinderGeometry(0.8, 0.8, 2.2, 10), [L.x, L.h + 1.0, L.z], 'cay1');

    /* giếng */
    var y = hDat(GIENG[0], GIENG[1]);
    var gi = new THREE.Group();
    gi.position.set(GIENG[0], y, GIENG[1]);
    gi.rotation.y = 0.6;
    var matDa = mat(0x9c9284), matGo = mat(0x6e5236);
    var than = new THREE.Mesh(meo(new THREE.CylinderGeometry(0.62, 0.68, 0.7, 14, 2, true), 0.05), matDa);
    than.position.y = 0.33;
    than.material.side = THREE.DoubleSide;
    than.castShadow = true;
    gi.add(than);
    var mieng = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.08, 6, 18), matDa);
    mieng.rotation.x = Math.PI / 2;
    mieng.position.y = 0.7;
    gi.add(mieng);
    o.matNuocGieng = mat(0x2e4a5a, { roughness: 0.2, metalness: 0.3, flatShading: false });
    var mat0 = new THREE.Mesh(new THREE.CircleGeometry(0.56, 18), o.matNuocGieng);
    mat0.rotation.x = -Math.PI / 2;
    mat0.position.y = 0.4;
    gi.add(mat0);
    [-1, 1].forEach(function (s) {
      var cot = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.3, 0.09), matGo);
      cot.position.set(s * 0.68, 0.95, 0);
      cot.castShadow = true;
      gi.add(cot);
    });
    var xa = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8), matGo);
    xa.rotation.z = Math.PI / 2;
    xa.position.y = 1.5;
    gi.add(xa);
    var mai = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.45, 4), mat(0x7b5a3a));
    mai.position.y = 1.85;
    mai.rotation.y = Math.PI / 4;
    mai.castShadow = true;
    gi.add(mai);
    var day = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.7, 4), mat(0xcbb48a));
    day.position.y = 1.15;
    gi.add(day);
    o.gauGieng = taoGau();
    o.gauGieng.position.y = 0.72;
    gi.add(o.gauGieng);
    g.add(gi);
    vungNhin(g, new THREE.CylinderGeometry(0.85, 0.85, 2.0, 10), [GIENG[0], y + 0.9, GIENG[1]], 'gieng');

    /* gương đồng trên trụ: giữ chuột để xoay, hắt nắng vào cây */
    var yg = hDat(GUONG[0], GUONG[1]);
    var tru = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 1.05, 8), matGo);
    tru.position.set(GUONG[0], yg + 0.52, GUONG[1]);
    tru.castShadow = true;
    g.add(tru);
    var piv = new THREE.Group();
    piv.position.set(GUONG[0], yg + 1.2, GUONG[1]);
    g.add(piv);
    var gia = new THREE.Group();
    gia.rotation.x = -0.42;               // ngửa lên đón nắng
    piv.add(gia);
    var vanh = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 28), mat(0xb88a3e, { metalness: 0.5, roughness: 0.4 }));
    gia.add(vanh);
    o.matGuong = new THREE.MeshStandardMaterial({ color: 0xe9d9a8, metalness: 0.9, roughness: 0.12, emissive: 0x6a5020, emissiveIntensity: 0.3 });
    var mg = new THREE.Mesh(new THREE.CircleGeometry(0.29, 28), o.matGuong);
    mg.position.z = 0.01;
    gia.add(mg);
    var lung = new THREE.Mesh(new THREE.CircleGeometry(0.29, 28), mat(0x5a4632));
    lung.rotation.y = Math.PI;
    lung.position.z = -0.01;
    gia.add(lung);
    /* vệt nắng hắt ra từ mặt gương */
    var geoTia = new THREE.CylinderGeometry(0.07, 0.11, 1, 10, 1, true);
    geoTia.rotateX(Math.PI / 2);
    geoTia.translate(0, 0, 0.5);
    o.matTia = new THREE.MeshBasicMaterial({ color: 0xffdf8a, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    o.tia1 = new THREE.Mesh(geoTia, o.matTia);
    piv.add(o.tia1);
    /* cột nắng từ trời rọi xuống gương */
    var cot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.6, 7, 14, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xfff0c0, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    cot.position.set(GUONG[0] + 1.6, yg + 4.6, GUONG[1] + 1.0);
    cot.lookAt(piv.position);
    cot.rotateX(Math.PI / 2);
    g.add(cot);
    o.cotNang = cot;
    var dich = Math.atan2(L.x - GUONG[0], L.z - GUONG[1]);
    o.guong = { piv: piv, goc: dich + 2.0, dich: dich, dai: Math.hypot(L.x - GUONG[0], L.z - GUONG[1]) };
    vungNhin(g, new THREE.CylinderGeometry(0.5, 0.5, 1.7, 10), [GUONG[0], yg + 0.85, GUONG[1]], 'guong');

    /* ba nắm mùn */
    var matMun = mat(0x3d2c1c, { roughness: 1 }), matLaKho = mat(0x9a7444, { side: THREE.DoubleSide });
    MUN.forEach(function (p, i) {
      var nh = new THREE.Group();
      nh.position.set(p[0], hDat(p[0], p[1]), p[1]);
      var u = new THREE.Mesh(meo(new THREE.SphereGeometry(0.26, 10, 6, 0, 6.28, 0, Math.PI / 2), 0.06), matMun);
      u.scale.y = 0.55;
      u.receiveShadow = true;
      nh.add(u);
      for (var k = 0; k < 6; k++) {
        var la = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.06), matLaKho);
        la.position.set((Math.random() - 0.5) * 0.36, 0.08 + Math.random() * 0.05, (Math.random() - 0.5) * 0.36);
        la.rotation.set(-1.2 + Math.random() * 0.6, Math.random() * 3, 0);
        nh.add(la);
      }
      var q = quang(0xffd27a, 0.9);
      q.position.y = 0.25;
      nh.add(q);
      g.add(nh);
      var hb = vungNhin(g, new THREE.SphereGeometry(0.45, 8, 6), [p[0], nh.position.y + 0.15, p[1]], 'mun', { i: i });
      o.mun.push({ nhom: nh, quang: q, hop: hb, lay: false });
    });

    /* hạt sáng dưới gốc — hiện sau khi cây tàn */
    o.hat1 = taoHatSang(g, L.x + 0.45, L.z + 0.35);
    o.hopHat1 = vungNhin(g, new THREE.SphereGeometry(0.45, 8, 6), [L.x + 0.45, L.h + 0.25, L.z + 0.35], 'hat1');
  }

  function taoGau() {
    var gau = new THREE.Group();
    var than = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.2, 12, 1, true), mat(0x7a5a3a, { side: THREE.DoubleSide }));
    gau.add(than);
    var day = new THREE.Mesh(new THREE.CircleGeometry(0.1, 12), mat(0x5e442b));
    day.rotation.x = -Math.PI / 2;
    day.position.y = -0.1;
    gau.add(day);
    var nuoc = new THREE.Mesh(new THREE.CircleGeometry(0.12, 14), mat(0x4f9fd6, { emissive: 0x1a4a6a, emissiveIntensity: 0.4 }));
    nuoc.rotation.x = -Math.PI / 2;
    nuoc.position.y = 0.06;
    nuoc.name = 'nuoc';
    gau.add(nuoc);
    var quai = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.01, 4, 16, Math.PI), mat(0x6a6a6a));
    quai.position.y = 0.1;
    gau.add(quai);
    return gau;
  }

  function taoHatSang(g, x, z) {
    var nh = new THREE.Group();
    nh.position.set(x, hDat(x, z) + 0.18, z);
    var h = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 0),
      mat(0xffd88a, { emissive: 0xc08020, emissiveIntensity: 0.9 }));
    h.scale.set(0.8, 1.15, 0.8);
    nh.add(h);
    nh.add(quang(0xffc860, 0.9));
    nh.visible = false;
    g.add(nh);
    return nh;
  }

  /* ═══════════ luống 2: mạch nước, ba bồn hoa; cây dựng sau khi chọn hạt ═══════════ */

  function dungLuong2(g) {
    var L = LUONG[1];
    o.vong2 = vongSang(g, L, 1.15, 0xffb469);
    vungNhin(g, new THREE.CylinderGeometry(1.1, 1.1, 0.8, 12), [L.x, L.h + 0.3, L.z], 'dat2');

    /* hòn đá mạch nước */
    var y = hDat(NGUON2[0], NGUON2[1]);
    var da = new THREE.Mesh(meo(new THREE.DodecahedronGeometry(0.5, 1), 0.2), mat(0x8d877c));
    da.scale.set(1, 0.75, 0.9);
    da.position.set(NGUON2[0], y + 0.2, NGUON2[1]);
    da.castShadow = true;
    g.add(da);
    o.suoi2 = dungSuoi(g, SUOI2, 0.42);
    o.vungNguon = vungNhin(g, new THREE.SphereGeometry(0.75, 8, 6), [NGUON2[0], y + 0.35, NGUON2[1]], 'nguon');
    o.quangNguon = quang(0x8fd0ff, 1.4);
    o.quangNguon.position.set(NGUON2[0], y + 0.8, NGUON2[1]);
    o.quangNguon.material.opacity = 0;
    g.add(o.quangNguon);

    /* ba bồn hoa: luống đất nhỏ, trồng xong thì năm bông nở */
    var mauBong = [0xf28ab0, 0xfff1f4, 0xf5c84a, 0xb98be0, 0xff9a6a];
    HOA2.forEach(function (p, i) {
      var nh = new THREE.Group();
      nh.position.set(p[0], hDat(p[0], p[1]), p[1]);
      var bon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.44, 0.08, 16), o.matToi);
      bon.position.y = 0.02;
      bon.receiveShadow = true;
      nh.add(bon);
      var matCuong = mat(0x4f8a34), matBong = mat(mauBong[i % mauBong.length], { emissive: 0x302020, emissiveIntensity: 0.15 });
      var bong = [];
      for (var k = 0; k < 6; k++) {
        var b = new THREE.Group();
        var a = k / 6 * 6.28 + i, rr = k === 0 ? 0 : 0.24;
        b.position.set(Math.cos(a) * rr, 0.04, Math.sin(a) * rr);
        var cuong = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.014, 0.36, 4), matCuong);
        cuong.position.y = 0.18;
        b.add(cuong);
        var dau = new THREE.Group();
        dau.position.y = 0.37;
        var canhHoa = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 0), k % 2 ? matBong : mat(mauBong[(i + k) % mauBong.length]));
        canhHoa.scale.set(1, 0.45, 1);
        dau.add(canhHoa);
        var nhuy = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 4), mat(0xf2b632));
        nhuy.position.y = 0.03;
        dau.add(nhuy);
        b.add(dau);
        b.scale.setScalar(0.001);
        b.userData.dau = dau;
        nh.add(b);
        bong.push(b);
      }
      var q = quang(0xffd27a, 1.0);
      q.position.y = 0.3;
      nh.add(q);
      g.add(nh);
      vungNhin(g, new THREE.CylinderGeometry(0.5, 0.5, 0.8, 10), [p[0], nh.position.y + 0.3, p[1]], 'hoa', { i: i });
      o.hoa2.push({ nhom: nh, bong: bong, quang: q, matBong: matBong, mauBong: new THREE.Color(matBong.color), k: 0 });
    });

    /* ong: tới khi có đủ nước và hoa */
    var matOng = mat(0xf2c12e, { emissive: 0x5a3a00, emissiveIntensity: 0.3, flatShading: false });
    var matSoc = mat(0x2a2218, { flatShading: false });
    var matCanh = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65, side: THREE.DoubleSide, depthWrite: false });
    for (var b = 0; b < 7; b++) {
      var ong = new THREE.Group();
      var than = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), matOng);
      than.scale.set(0.85, 0.85, 1.4);
      ong.add(than);
      var soc = new THREE.Mesh(new THREE.TorusGeometry(0.044, 0.012, 6, 14), matSoc);
      soc.position.z = -0.015;
      ong.add(soc);
      var canh = [-1, 1].map(function (s) {
        var c = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.045), matCanh);
        c.geometry.translate(0.035, 0, 0);
        c.position.set(s * 0.02, 0.04, 0);
        c.rotation.x = -Math.PI / 2;
        if (s < 0) c.rotation.y = Math.PI;
        ong.add(c);
        return c;
      });
      ong.visible = false;
      g.add(ong);
      o.ong.push({ nhom: ong, canh: canh, ph: Math.random(), hoa: b % 3, truoc: new THREE.Vector3() });
    }

    /* vật để gom ở chặng GOM */
    o.gom = {};
    var yh = hDat(GOM.gomHat[0], GOM.gomHat[1]);
    o.gom.gomHat = taoHatSang(g, GOM.gomHat[0], GOM.gomHat[1]);
    vungNhin(g, new THREE.SphereGeometry(0.42, 8, 6), [GOM.gomHat[0], yh + 0.2, GOM.gomHat[1]], 'gomHat');
    var giot = new THREE.Group();
    giot.position.set(GOM.gomNuoc[0], y + 1.0, GOM.gomNuoc[1]);
    giot.add(new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x6fc0f0, emissive: 0x1a5a8a, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.9 })));
    giot.add(quang(0x8fd0ff, 0.9));
    giot.visible = false;
    g.add(giot);
    o.gom.gomNuoc = giot;
    vungNhin(g, new THREE.SphereGeometry(0.4, 8, 6), [GOM.gomNuoc[0], y + 1.0, GOM.gomNuoc[1]], 'gomNuoc');
    var ym = hDat(GOM.gomMun[0], GOM.gomMun[1]);
    var mun = new THREE.Group();
    mun.position.set(GOM.gomMun[0], ym, GOM.gomMun[1]);
    var u = new THREE.Mesh(meo(new THREE.SphereGeometry(0.24, 10, 6, 0, 6.28, 0, Math.PI / 2), 0.06), mat(0x4a3420, { roughness: 1 }));
    u.scale.y = 0.6;
    mun.add(u);
    var qm = quang(0xffd27a, 0.9);
    qm.position.y = 0.25;
    mun.add(qm);
    mun.visible = false;
    g.add(mun);
    o.gom.gomMun = mun;
    vungNhin(g, new THREE.SphereGeometry(0.42, 8, 6), [GOM.gomMun[0], ym + 0.15, GOM.gomMun[1]], 'gomMun');
  }

  /* Cây thế hệ hai mang đúng những đặc tính người chơi đã chọn. */
  function taoCay2(ctx) {
    var g = ctx.scene, L = LUONG[1], D = S.dacTinh;
    o.cay2 = taoCay(g, {
      x: L.x, z: L.z,
      cao: D.sang ? 2.7 : 2.1, day: D.re ? 0.15 : 0.12,
      canh: 5, tan: D.sang ? 0.56 : 0.5, soTan: 9,
      soQua: D.qua ? 12 : 4,
      mauLa: D.re ? 0x3f7c38 : 0x5f9a44, mauThan: 0x6a4e36, re: D.re, hat: 21, nghieng: 0.04
    });
    o.cay2Hop = vungNhin(g, new THREE.CylinderGeometry(1.0, 1.0, 3.2, 10), [L.x, L.h + 1.4, L.z], 'cay2');
    S.cay2Cao = D.sang ? 2.7 : 2.1;
    /* rễ lan kín luống khi khu vườn vượt quá giới hạn */
    o.reLan = new THREE.Group();
    o.reLan.position.set(L.x, L.h, L.z);
    var matRe = mat(0x5e4430);
    for (var k = 0; k < 9; k++) {
      var a = k / 9 * 6.28 + Math.random() * 0.3, l = 2.2 + Math.random() * 0.8;
      var pts = [];
      for (var s = 0; s <= 6; s++) {
        var u = s / 6, rr = 0.2 + u * l, aa = a + Math.sin(u * 4 + k) * 0.25;
        var x = Math.cos(aa) * rr, z = Math.sin(aa) * rr;
        pts.push(new THREE.Vector3(x, hDat(L.x + x, L.z + z) - L.h + 0.03, z));
      }
      var mr = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.05 - 0.01 * (k % 3), 5, false), matRe);
      mr.castShadow = true;
      mr.geometry.setDrawRange(0, 0);
      o.reLan.add(mr);
    }
    g.add(o.reLan);
    ctx.player.blockers.push({ x: L.x, z: L.z, r: 0.5 });
    /* cây con mọc từ quả rụng */
    CON2.forEach(function (p, i) {
      o.con2.push(taoCay(g, { x: p[0], z: p[1], cao: 0.75, day: 0.035, canh: 2, tan: 0.2, soTan: 3, soQua: 0,
                              mauLa: 0x6aa84a, hat: 40 + i }));
    });
  }

  /* ═══════════ luống 3: khu vườn thế hệ ba (dựng sẵn, ẩn) ═══════════ */

  function dungLuong3(g) {
    var L = LUONG[2];
    o.vong3 = vongSang(g, L, 1.15, 0xffb469);
    vungNhin(g, new THREE.CylinderGeometry(1.2, 1.2, 0.8, 12), [L.x, L.h + 0.3, L.z], 'dat3');
    o.cay3 = [
      taoCay(g, { x: CAY3[0][0], z: CAY3[0][1], cao: 3.1, day: 0.2, canh: 7, tan: 0.62, soTan: 14, soQua: 14,
                  mauLa: 0x3f8a3c, mauThan: 0x5e4430, re: true, hat: 31 }),
      taoCay(g, { x: CAY3[1][0], z: CAY3[1][1], cao: 2.2, day: 0.11, canh: 5, tan: 0.48, soTan: 9, soQua: 0,
                  mauLa: 0xf0a8c4, mauThan: 0x6a4a3a, hat: 32 }),
      taoCay(g, { x: CAY3[2][0], z: CAY3[2][1], cao: 2.4, day: 0.12, canh: 5, tan: 0.5, soTan: 9, soQua: 8,
                  mauLa: 0x8fbf4a, mauThan: 0x6a5038, mauQua: 0xf2b632, hat: 33 })
    ];
    CON3.forEach(function (p, i) {
      o.con3.push(taoCay(g, { x: p[0], z: p[1], cao: 0.8, day: 0.04, canh: 2, tan: 0.22, soTan: 3, soQua: 0,
                              mauLa: [0x6aa84a, 0x8fc25a][i % 2], hat: 50 + i }));
    });
    vungNhin(g, new THREE.CylinderGeometry(2.0, 2.0, 4.0, 12), [L.x, L.h + 1.8, L.z - 0.3], 'cay3');

    /* mạch nước trên đỉnh, suối chảy ngược xuống qua cả hai luống cũ */
    var y = hDat(NGUON3[0], NGUON3[1]);
    var da = new THREE.Mesh(meo(new THREE.DodecahedronGeometry(0.45, 1), 0.18), mat(0x8d877c));
    da.scale.set(1, 0.7, 0.9);
    da.position.set(NGUON3[0], y + 0.15, NGUON3[1]);
    da.castShadow = true;
    g.add(da);
    o.suoi3 = dungSuoi(g, SUOI3, 0.5);

    /* bướm */
    var mauBuom = [0xffb0d0, 0xfff0a0, 0xa8d8ff, 0xffc38a, 0xd8b0ff];
    for (var b = 0; b < 9; b++) {
      var bu = new THREE.Group();
      var mt = new THREE.MeshStandardMaterial({ color: mauBuom[b % mauBuom.length], side: THREE.DoubleSide, roughness: 0.6, emissive: mauBuom[b % mauBuom.length], emissiveIntensity: 0.25 });
      var canh = [-1, 1].map(function (s) {
        var geo = new THREE.CircleGeometry(0.07, 8);
        geo.scale(1, 0.75, 1);
        geo.translate(0.065, 0, 0);
        geo.rotateX(-Math.PI / 2);
        var c = new THREE.Mesh(geo, mt);
        if (s < 0) c.scale.x = -1;
        bu.add(c);
        return c;
      });
      bu.visible = false;
      g.add(bu);
      var md = o.mauDuong[Math.floor(Math.random() * 140)];
      var goc = b < 5 ? [L.x + (Math.random() - 0.5) * 3, L.z + (Math.random() - 0.5) * 2.5] : [md.x, md.z];
      o.buom.push({ nhom: bu, canh: canh, ph: Math.random() * 6.28, tam: goc, toc: 0.6 + Math.random() * 0.6, truoc: new THREE.Vector3() });
    }
  }

  /* ═══════════ cỏ của bốn vùng và hoa của khu vườn mới ═══════════ */

  function dungCoVaHoa(g) {
    var mauCo = [0x5f9a3a, 0x77ad45, 0x4c8434, 0x86b84e];
    var so = [150, 170, 230, 260];
    o.vung.forEach(function (v, k) {
      var dk = k < 3
        ? function (x, z) { var L = LUONG[k]; return Math.hypot(x - L.x, z - L.z) < L.R + 0.7; }
        : function (x, z) { return ganDuong(x, z).d < 1.2; };
      var x0 = -6.8, x1 = 6.8, z0 = -6.8, z1 = 6.8;
      if (k < 3) { var L = LUONG[k]; x0 = L.x - 3; x1 = L.x + 3; z0 = L.z - 3; z1 = L.z + 3; }
      var diem = rai(so[k], x0, x1, z0, z1, function (x, z) {
        return Math.abs(x) < 6.9 && Math.abs(z) < 6.9 && dk(x, z) && Math.hypot(x - LUONG[k < 3 ? k : 0].x, z - LUONG[k < 3 ? k : 0].z) > (k < 3 ? 0.35 : 0);
      });
      v.co = dungCo(g, diem, v.uCo, mauCo);
    });

    /* hoa thế hệ ba: vòng quanh đỉnh, ven suối, và cả quanh gốc cây cũ */
    o.uHoa3 = { value: 0 };
    var cong = new THREE.CatmullRomCurve3(SUOI3.map(function (p) { return new THREE.Vector3(p[0], 0, p[1]); }));
    var venSuoi = cong.getSpacedPoints(60).map(function (p, i) {
      var s = i % 2 ? 1 : -1, l = 0.4 + Math.random() * 0.4;
      return [p.x + s * l * (Math.random() - 0.2), p.z + s * l * (Math.random() - 0.2)];
    });
    var dinh = rai(55, -3, 3, -6.6, 0, function (x, z) {
      var d = Math.hypot(x - LUONG[2].x, z - LUONG[2].z);
      return d > 0.9 && d < LUONG[2].R + 0.5;
    });
    var goc1 = rai(16, LUONG[0].x - 1.4, LUONG[0].x + 1.4, LUONG[0].z - 1.4, LUONG[0].z + 1.4, function (x, z) {
      var d = Math.hypot(x - LUONG[0].x, z - LUONG[0].z);
      return d > 0.35 && d < 1.3;
    });
    o.hoa3 = dungHoa(g, dinh.concat(venSuoi, goc1), o.uHoa3, [0xf28ab0, 0xfff4f6, 0xf5c84a, 0xb98be0, 0xff9a6a, 0x8fc8ff]);
  }

  /* ═══════════ đường xoắn, chỉ hiện trong đoạn camera bay ═══════════ */

  function dungXoan(g) {
    function ong(diem, dayOng, doMo) {
      var c = new THREE.CatmullRomCurve3(diem.map(function (p) { return new THREE.Vector3(p[0], p[2] + 0.5, p[1]); }));
      var geo = new THREE.TubeGeometry(c, 260, dayOng, 8, false);
      geo.setDrawRange(0, 0);
      var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffc35a, transparent: true, opacity: doMo, depthWrite: false, fog: false }));
      m.renderOrder = 5;
      g.add(m);
      return m;
    }
    o.xoan = ong(DUONG, 0.09, 0.95);
    o.xoanTiep = ong(DUONG_TIEP, 0.07, 0.6);
    o.dauXoan = LUONG.map(function (L) {
      var q = quang(0xffc35a, 0.001);
      q.position.set(L.x, L.h + 0.55, L.z);
      q.material.fog = false;
      g.add(q);
      return q;
    });
  }

  /* ═══════════ thứ người chơi đang cầm, lơ lửng góc dưới tầm nhìn ═══════════ */

  function dungTay(g) {
    o.tay = new THREE.Group();
    g.add(o.tay);
    function vat(m, x, y) {
      m.position.set(x, y, 0);
      m.traverse(function (c) {
        if (!c.material) return;
        c.material = c.material.clone();
        c.material.depthTest = false;
        c.renderOrder = 60;
      });
      o.tay.add(m);
      return m;
    }
    o.tayGau = vat(taoGau(), 0.02, 0);
    o.tayMun = [0, 1, 2].map(function (k) {
      return vat(new THREE.Mesh(meo(new THREE.IcosahedronGeometry(0.045, 1), 0.02), mat(0x3d2c1c)), -0.07 + k * 0.06, 0.0);
    });
    o.tayHat = vat(new THREE.Mesh(new THREE.IcosahedronGeometry(0.035, 0), mat(0xffd88a, { emissive: 0xc08020, emissiveIntensity: 0.9 })), -0.12, 0.05);
    o.tayGom = {
      gomHat: vat(new THREE.Mesh(new THREE.IcosahedronGeometry(0.035, 0), mat(0xffd88a, { emissive: 0xc08020, emissiveIntensity: 0.9 })), -0.12, 0.06),
      gomNuoc: vat(new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), mat(0x6fc0f0, { emissive: 0x1a5a8a, emissiveIntensity: 0.6, flatShading: false })), -0.03, 0.06),
      gomMun: vat(new THREE.Mesh(meo(new THREE.IcosahedronGeometry(0.045, 1), 0.02), mat(0x4a3420)), 0.06, 0.06)
    };
  }

  var _q = new THREE.Quaternion(), _e = new THREE.Euler(0, 0, 0, 'YXZ'), _v1 = new THREE.Vector3();

  function capNhatTay(ctx) {
    var P = ctx.player;
    _e.set(P.pitch, P.yaw, 0, 'YXZ');
    _q.setFromEuler(_e);
    o.tay.quaternion.copy(_q);
    _v1.set(0.26, -0.24, -0.55).applyQuaternion(_q);
    o.tay.position.copy(P.pos).add(_v1);
    var bay = S.pha === 'BAY';
    o.tay.visible = !bay;
    o.tayGau.visible = S.tay.nuoc;
    o.tayMun.forEach(function (m, k) { m.visible = S.tay.mun > k; });
    o.tayHat.visible = S.tay.hat;
    for (var k in o.tayGom) o.tayGom[k].visible = S.gom[k] && S.pha === 'GOM';
  }

  /* ═══════════ hạt (particle) ═══════════ */

  var _p = new THREE.Vector3();

  function rungLa(cay, n) {
    var h = o.la;
    for (var i = 0, sinh = 0; i < h.count && sinh < n; i++) {
      if (h.life[i] > 0) continue;
      if (!cay.viTriLa(_p)) return;
      h.pos[i * 3] = _p.x; h.pos[i * 3 + 1] = _p.y; h.pos[i * 3 + 2] = _p.z;
      h.vel[i * 3] = (Math.random() - 0.5) * 0.3;
      h.vel[i * 3 + 1] = -0.35 - Math.random() * 0.3;
      h.vel[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      h.life[i] = 1;
      sinh++;
    }
  }

  function phun(h, x, y, z, n, toc, len) {
    for (var i = 0, sinh = 0; i < h.count && sinh < n; i++) {
      if (h.life[i] > 0) continue;
      h.pos[i * 3] = x + (Math.random() - 0.5) * 0.2;
      h.pos[i * 3 + 1] = y + Math.random() * 0.2;
      h.pos[i * 3 + 2] = z + (Math.random() - 0.5) * 0.2;
      var a = Math.random() * 6.28, r = Math.random() * toc;
      h.vel[i * 3] = Math.cos(a) * r;
      h.vel[i * 3 + 1] = (len || 1) * (0.6 + Math.random() * 1.2);
      h.vel[i * 3 + 2] = Math.sin(a) * r;
      h.life[i] = 1;
      sinh++;
    }
  }

  function capNhatHat(dt, t) {
    var h = o.la;
    for (var i = 0; i < h.count; i++) {
      if (h.life[i] <= 0) continue;
      h.life[i] -= dt * 0.18;
      var x = h.pos[i * 3], z = h.pos[i * 3 + 2];
      if (h.pos[i * 3 + 1] > hDat(x, z) + 0.03) {
        h.pos[i * 3] += (h.vel[i * 3] + Math.sin(t * 2.2 + i) * 0.35) * dt;
        h.pos[i * 3 + 1] += h.vel[i * 3 + 1] * dt;
        h.pos[i * 3 + 2] += (h.vel[i * 3 + 2] + Math.cos(t * 1.7 + i) * 0.35) * dt;
      }
      if (h.life[i] <= 0) h.an(i);
    }
    h.capNhat();

    [[o.sang, 0.55, 0.25], [o.giot, 1.6, -5.5]].forEach(function (d) {
      var hh = d[0];
      for (var j = 0; j < hh.count; j++) {
        if (hh.life[j] <= 0) continue;
        hh.life[j] -= dt * d[1];
        hh.pos[j * 3] += hh.vel[j * 3] * dt;
        hh.pos[j * 3 + 1] += hh.vel[j * 3 + 1] * dt;
        hh.pos[j * 3 + 2] += hh.vel[j * 3 + 2] * dt;
        hh.vel[j * 3 + 1] += d[2] * dt;
        hh.vel[j * 3] *= 0.98; hh.vel[j * 3 + 2] *= 0.98;
        if (hh.life[j] <= 0) hh.an(j);
      }
      hh.capNhat();
    });
  }

  /* ═══════════ âm thanh ═══════════ */

  function not(f, kieu, to, dai, tre, f2) {
    var a = TX.audio.ngu(); if (!a) return;
    var t = a.currentTime + (tre || 0);
    var os = a.createOscillator(), gn = a.createGain();
    os.type = kieu || 'sine';
    os.frequency.setValueAtTime(f, t);
    if (f2) os.frequency.exponentialRampToValueAtTime(f2, t + dai);
    gn.gain.setValueAtTime(0.0001, t);
    gn.gain.exponentialRampToValueAtTime(to, t + 0.01);
    gn.gain.exponentialRampToValueAtTime(0.0001, t + dai);
    os.connect(gn); gn.connect(a.destination);
    os.start(t); os.stop(t + dai + 0.05);
  }

  function amNuoc() {
    var a = TX.audio.ngu(); if (!a) return;
    var t = a.currentTime, len = Math.floor(a.sampleRate * 0.5);
    var buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    var src = a.createBufferSource(); src.buffer = buf;
    var f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 0.8;
    var gn = a.createGain(); gn.gain.value = 0.22;
    src.connect(f); f.connect(gn); gn.connect(a.destination);
    src.start(t);
    not(620, 'sine', 0.05, 0.12, 0.05, 900);
  }

  function amNhat() { not(740, 'triangle', 0.07, 0.12); not(1110, 'sine', 0.05, 0.18, 0.06); }

  function amHop(goc) {
    [0, 4, 7, 12].forEach(function (b, k) { not(goc * Math.pow(2, b / 12), 'sine', 0.06, 1.6, k * 0.09); });
  }

  function amChim() {
    var f = 2600 + Math.random() * 900, n = 2 + Math.floor(Math.random() * 3);
    for (var k = 0; k < n; k++) not(f, 'sine', 0.025, 0.09, k * 0.13, f * 1.25);
  }

  function amGio(ctx) {
    var a = ctx.audio.ngu(); if (!a) return;
    var len = a.sampleRate * 2, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    var tr = 0;
    for (var i = 0; i < len; i++) { tr = tr * 0.97 + (Math.random() * 2 - 1) * 0.03; d[i] = tr * 4; }
    var src = a.createBufferSource(); src.buffer = buf; src.loop = true;
    var f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 520;
    var gn = a.createGain(); gn.gain.value = 0.0001;
    src.connect(f); f.connect(gn); gn.connect(a.destination);
    src.start();
    o.gio = { a: a, src: src, gn: gn };
  }

  /* ═══════════ ô nhiệm vụ và thông báo ═══════════ */

  function dungONhiemVu(ctx) {
    var NV = ctx.text.nhiemVu;
    var d = document.createElement('div');
    d.id = 'pdNV';
    d.innerHTML =
      '<style>' +
        '#pdNV{position:absolute;left:24px;top:104px;width:310px;padding:12px 16px;border-radius:12px;' +
          'background:var(--kinh);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
          'border:1px solid var(--vien);box-shadow:var(--bong);font-size:12.5px;color:var(--muc2);transition:opacity .4s}' +
        '#pdNV .k{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--vang);margin-bottom:6px}' +
        '#pdNV .nv{display:grid;grid-template-columns:22px 1fr;gap:0 6px;padding:7px 0;opacity:.45;transition:opacity .3s}' +
        '#pdNV .nv+.nv{border-top:1px solid var(--vien)}' +
        '#pdNV .nv.dang,#pdNV .nv.xong{opacity:1}' +
        '#pdNV .o{width:16px;height:16px;margin-top:1px;border-radius:50%;border:1.5px solid var(--vangN);' +
          'display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff}' +
        '#pdNV .nv.dang .o{border-color:var(--vang)}' +
        '#pdNV .nv.xong .o{background:#1e7a46;border-color:#1e7a46}' +
        '#pdNV .t{font-weight:600;color:var(--muc)}' +
        '#pdNV .m{margin-top:1px;line-height:1.4}' +
        '#pdNV .nv.xong .m{display:none}' +
        '#pdNV .ch{grid-column:2;display:none;flex-wrap:wrap;gap:4px;margin-top:6px}' +
        '#pdNV .nv.dang .ch{display:flex}' +
        '#pdNV .ch span{font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid var(--vien);color:var(--mo);background:rgba(255,255,255,.5)}' +
        '#pdNV .ch span.on{color:#1e7a46;border-color:rgba(30,122,70,.45);background:#eef8f0}' +
        '#pdNV .ch span.on::before{content:"✓ "}' +
        '#pdNV .canh{grid-column:2;display:none;margin-top:5px;font-size:11.5px;color:#a8641c;font-weight:600}' +
        '#pdNV .canh:not(:empty){display:block}' +
        '#pdNV .tay{display:none;margin-top:8px;padding-top:8px;border-top:1px solid var(--vien);font-size:11.5px}' +
        '#pdNV .tay:not(:empty){display:block}' +
        '#pdNV .tay b{color:var(--vang);font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:10px;margin-right:6px}' +
        '#pdTB{position:absolute;left:50%;top:21%;transform:translate(-50%,8px);max-width:min(560px,calc(100vw - 32px));' +
          'padding:12px 20px;border-radius:12px;text-align:center;font-size:14.5px;line-height:1.55;color:var(--muc);' +
          'background:var(--kinh);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
          'border:1px solid var(--vien);box-shadow:var(--bong);opacity:0;transition:opacity .4s,transform .4s;pointer-events:none}' +
        '#pdTB.on{opacity:1;transform:translate(-50%,0)}' +
        '#pdTB b{color:var(--vang)}' +
      '</style>' +
      '<div class="k">' + NV.tieuDe + '</div>' +
      ['th1', 'th2', 'th3'].map(function (k, i) {
        return '<div class="nv" id="pdNV' + i + '"><div class="o"></div>' +
                 '<div><div class="t">' + NV[k].ten + '</div><div class="m">' + NV[k].mo + '</div></div>' +
                 '<div class="ch">' + NV[k].chip.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>' +
                 '<div class="canh"></div>' +
               '</div>';
      }).join('') +
      '<div class="tay"></div>';
    document.getElementById('hud').appendChild(d);
    var tb = document.createElement('div');
    tb.id = 'pdTB';
    document.getElementById('hud').appendChild(tb);
    el = {
      nv: d, tb: tb, tay: d.querySelector('.tay'),
      dong: [0, 1, 2].map(function (i) {
        var r = document.getElementById('pdNV' + i);
        return { d: r, o: r.querySelector('.o'), ch: r.querySelectorAll('.ch span'), canh: r.querySelector('.canh') };
      }),
      ky: ''
    };
  }

  function thongBao(html, giay) {
    el.tb.innerHTML = html;
    el.tb.classList.add('on');
    S.tb = giay || 3.2;
  }

  function mot(ten, html, giay) {
    if (S.da[ten]) return;
    S.da[ten] = true;
    thongBao(html, giay);
  }

  function capNhatONhiemVu(ctx) {
    var NV = ctx.text.nhiemVu, th2 = S.th2, i = idx(S.pha);
    var tag = document.getElementById('roomTag');
    if (tag) el.nv.style.top = (tag.getBoundingClientRect().bottom + 10) + 'px';
    el.nv.style.opacity = S.pha === 'BAY' || S.pha === 'HOI' ? 0 : 1;

    var soHoa = th2.hoa.filter(Boolean).length;
    var ky = [S.pha, S.th1.nuoc, S.th1.sang, S.th1.bon, soHoa, th2.nguon, th2.ong >= 1, th2.thuPhan >= 1, th2.con >= 1,
              S.gom.gomHat, S.gom.gomNuoc, S.gom.gomMun, S.tay.nuoc, S.tay.mun, S.tay.hat].join('|');
    if (ky === el.ky) return;
    el.ky = ky;

    var trang = [
      [i >= idx('HAI'), i < idx('HAI') || S.pha === 'TAN1' || S.pha === 'HAT1',
       [S.th1.nuoc, S.th1.sang, S.th1.bon, i >= idx('HAI')]],
      [i >= idx('TAN2'), i >= idx('GIEO2') && i < idx('TAN2'),
       [i >= idx('LON2'), th2.nguon, soHoa === 3, th2.ong >= 1, th2.thuPhan >= 1, th2.con >= 1]],
      [i >= idx('LON3'), i >= idx('TAN2') && i < idx('LON3'),
       [S.gom.gomHat, S.gom.gomNuoc, S.gom.gomMun, i >= idx('LON3')]]
    ];
    trang.forEach(function (tt, k) {
      var r = el.dong[k];
      var xong = tt[0] && !tt[1];
      r.d.classList.toggle('xong', xong);
      r.d.classList.toggle('dang', tt[1]);
      r.o.textContent = xong ? '✓' : '';
      tt[2].forEach(function (on, j) { r.ch[j].classList.toggle('on', !!on); });
    });
    el.dong[1].ch[2].textContent = NV.th2.chip[2] + (soHoa < 3 ? ' ' + soHoa + '/3' : '');
    var tt2 = NV.trangThai;
    el.dong[0].canh.textContent = S.pha === 'TAN1' ? tt2.TAN1 : S.pha === 'HAT1' ? tt2.HAT1 : '';
    el.dong[1].canh.textContent = S.pha === 'GIEO2' ? tt2.GIEO2 : S.pha === 'TAN2' ? tt2.TAN2 : '';
    el.dong[2].canh.textContent = S.pha === 'GOM' ? tt2.GOM : '';

    var V = NV.vat, cam = [];
    if (S.tay.nuoc) cam.push(V.nuoc);
    if (S.tay.mun) cam.push(V.mun.replace('%n', S.tay.mun));
    if (S.tay.hat) cam.push(V.hat);
    if (S.pha === 'GOM') ['gomHat', 'gomNuoc', 'gomMun'].forEach(function (k) { if (S.gom[k]) cam.push(V[k]); });
    el.tay.innerHTML = cam.length ? '<b>' + NV.tay + '</b>' + cam.join(' · ') : '';
  }

  /* ═══════════ ánh nhìn ═══════════ */

  function thayPhim(s, ctx) {
    var gay = ctx.player.lockBroken;
    return s.replace(/%b/g, gay ? '<kbd>F</kbd>' : '<kbd>Chuột trái</kbd>')
            .replace(/%r/g, gay ? '<kbd>R</kbd>' : '<kbd>Chuột phải</kbd>');
  }

  /* Gợi ý cho vật đang nhìn, theo chặng hiện tại. null = vật này lúc
     này không có gì để làm, tia nhìn đi xuyên qua nó. */
  function nhamChu(u, N) {
    var p = S.pha, id = u.id;
    switch (id) {
      case 'bia': return N.bia;
      case 'gieng': return p === 'TH1' ? (S.tay.nuoc || S.th1.nuoc ? N.giengXong : N.gieng) : null;
      case 'guong': return p === 'TH1' ? (S.th1.sang ? N.guongXong : N.guong) : null;
      case 'mun': return p === 'TH1' && !o.mun[u.i].lay ? N.mun : null;
      case 'cay1':
        if (p === 'TH1') return S.tay.nuoc ? N.cay1Nuoc : S.tay.mun >= 3 ? N.cay1Mun : N.cay1;
        if (p === 'QUA1') return N.cay1Qua;
        if (p === 'TAN1') return N.cay1Tan;
        if (p === 'TAN2' || p === 'GOM') return N.goc1;
        return null;
      case 'hat1': return p === 'HAT1' ? N.hat1 : null;
      case 'dat2': return p === 'GIEO2' ? N.dat2 : p === 'HAT1' ? N.dat2Chua : null;
      case 'nguon': return p === 'TH2' && !S.th2.nguon ? N.nguon : (p === 'TAN2' || p === 'GOM') ? N.nguonCan : null;
      case 'hoa': return p === 'TH2' && !S.th2.hoa[u.i] ? N.hoa : null;
      case 'cay2': return p === 'TAN2' || p === 'GOM' ? N.cay2Tan : (p === 'TH2' || p === 'LON2') ? N.cay2 : null;
      case 'gomHat': case 'gomNuoc': case 'gomMun': return p === 'GOM' && !S.gom[id] ? N[id] : null;
      case 'dat3': return p === 'GOM' ? (S.gom.gomHat && S.gom.gomNuoc && S.gom.gomMun ? N.dat3 : N.dat3Chua) : null;
      case 'cay3': return p === 'TH3' ? N.cay3 : null;
    }
    return null;
  }

  function chuGiaiCho(u) {
    var p = S.pha;
    if (u.id === 'bia') return 'bia';
    if (u.id === 'cay1' && tu('HAT1') && p !== 'BAY') return 'goc1';
    if (u.id === 'hat1' && p === 'HAT1') return 'hat1';
    if ((u.id === 'cay2' || u.id === 'nguon') && (p === 'TAN2' || p === 'GOM')) return 'gioiHan';
    if (u.id === 'cay3' && p === 'TH3') return 'vuon3';
    return null;
  }

  /* Các hộp bắt ánh nhìn chồng lên nhau (hạt nằm trong bóng cây, giọt
     nước lơ lửng ngay trên mạch nước), nên vật nhỏ được ưu tiên hơn. */
  var UU_TIEN = { gomHat: 3, gomNuoc: 3, gomMun: 3, hat1: 3, mun: 2, hoa: 2, gieng: 2, guong: 2, nguon: 2, dat2: 1, dat3: 1 };

  function nhinVao(dt, ctx) {
    var P = ctx.player, chon = null, chu = null, cg = null, uu = -1;
    if (S.pha !== 'BAY' && S.pha !== 'HOI') {
      if (P.lockBroken) o.diemNhin.set(P.chuot.x / innerWidth * 2 - 1, -(P.chuot.y / innerHeight) * 2 + 1);
      else o.diemNhin.set(0, 0);
      o.tia.setFromCamera(o.diemNhin, ctx.camera);
      o.tia.far = 9;
      var trung = o.tia.intersectObjects(o.nhin, false);
      for (var i = 0; i < trung.length; i++) {
        var u = trung[i].object.userData;
        var k = chuGiaiCho(u);
        if (k && !cg) cg = k;
        if (trung[i].distance > TAM_VOI) continue;
        var c = nhamChu(u, ctx.text.nham), p = UU_TIEN[u.id] || 0;
        if (c && p > uu) { chon = u; chu = c; uu = p; }
      }
    }
    S.chon = chon;
    S.chonChu = chu;
    if (cg !== S.nhamId) { S.nhamId = cg; S.nhamT = 0; }
    else S.nhamT += dt;
    ctx.hud.nhinChuGiai(cg && S.nhamT >= NHIN_TRE ? ctx.text.chuGiai[cg] : null);
  }

  /* ═══════════ chuyển chặng ═══════════ */

  function doiPha(p) {
    S.pha = p;
    S.t = 0;
  }

  /* ═══════════ tác động lên một vật ═══════════ */

  function tacDong(u, ctx) {
    var T = ctx.text.thongBao, p = S.pha, L1 = LUONG[0];
    switch (u.id) {
      case 'gieng':
        if (p === 'TH1' && !S.th1.nuoc && !S.tay.nuoc) {
          S.tay.nuoc = true;
          amNuoc();
          phun(o.giot, GIENG[0], hDat(GIENG[0], GIENG[1]) + 0.6, GIENG[1], 14, 0.6, 1.2);
        }
        break;

      case 'mun':
        if (p === 'TH1' && !o.mun[u.i].lay) {
          o.mun[u.i].lay = true;
          S.tay.mun++;
          amNhat();
          var mp = o.mun[u.i].nhom.position;
          phun(o.sang, mp.x, mp.y + 0.1, mp.z, 14, 0.5, 0.8);
        }
        break;

      case 'cay1':
        if (p === 'TH1') {
          if (S.tay.nuoc) {
            S.tay.nuoc = false;
            S.th1.nuoc = true;
            amNuoc();
            phun(o.giot, L1.x, L1.h + 0.5, L1.z, 30, 0.8, 0.9);
            thongBao(T.tuoi, 2);
          } else if (S.tay.mun >= 3) {
            S.tay.mun = 0;
            S.th1.bon = true;
            amNhat();
            phun(o.sang, L1.x, L1.h + 0.1, L1.z, 26, 0.7, 0.6);
            thongBao(T.bon, 2);
          } else if (S.tay.mun > 0) thongBao(T.canMun, 2.4);
          else thongBao(T.canGi, 2.6);
        } else if (p === 'QUA1') {
          haiQua(ctx);
        } else if (p === 'TAN1') {
          if (S.tay.nuoc) { S.tay.nuoc = false; amNuoc(); phun(o.giot, L1.x, L1.h + 0.5, L1.z, 20, 0.8, 0.9); }
          thongBao(T.khongCuu, 2.6);
          not(220, 'sine', 0.06, 0.5, 0, 160);
        } else if (p === 'TAN2' || p === 'GOM') {
          thongBao(T.quayLai, 3.6);
          not(220, 'sine', 0.06, 0.5, 0, 160);
        }
        break;

      case 'hat1':
        if (p === 'HAT1') moChonHat(ctx);
        break;

      case 'dat2':
        if (p === 'GIEO2' && S.tay.hat) {
          S.tay.hat = false;
          doiPha('LON2');
          amHop(392);
          phun(o.sang, LUONG[1].x, LUONG[1].h + 0.1, LUONG[1].z, 50, 1.0, 1.0);
          var mang = ['re', 'sang', 'qua'].filter(function (k) { return S.dacTinh[k]; })
            .map(function (k) { return ctx.text.dacTinhNgan[k]; }).join(', ');
          thongBao(T.cay2Mang.replace('%s', mang), 5);
        }
        break;

      case 'nguon':
        if (p === 'TH2' && !S.th2.nguon) {
          S.th2.nguon = true;
          amNuoc();
          phun(o.giot, NGUON2[0], hDat(NGUON2[0], NGUON2[1]) + 0.5, NGUON2[1], 30, 0.9, 1.3);
          if (S.th2.hoa.indexOf(false) >= 0) thongBao(T.canHoa, 3);
        } else if (p === 'TAN2' || p === 'GOM') {
          thongBao(T.giuNguyen, 4);
          not(220, 'sine', 0.06, 0.5, 0, 160);
        }
        break;

      case 'hoa':
        if (p === 'TH2' && !S.th2.hoa[u.i]) {
          S.th2.hoa[u.i] = true;
          amNhat();
          var hp = o.hoa2[u.i].nhom.position;
          phun(o.sang, hp.x, hp.y + 0.2, hp.z, 18, 0.5, 0.8);
          if (!S.th2.nguon && S.th2.hoa.indexOf(false) < 0) thongBao(T.canHoa, 3);
        }
        break;

      case 'cay2':
        if (p === 'TAN2' || p === 'GOM') {
          thongBao(T.giuNguyen, 4);
          not(220, 'sine', 0.06, 0.5, 0, 160);
        }
        break;

      case 'gomHat': case 'gomNuoc': case 'gomMun':
        if (p === 'GOM' && !S.gom[u.id]) {
          S.gom[u.id] = true;
          o.gom[u.id].visible = false;
          amNhat();
          var gp = o.gom[u.id].position;
          phun(o.sang, gp.x, gp.y, gp.z, 20, 0.6, 0.8);
          if (S.gom.gomHat && S.gom.gomNuoc && S.gom.gomMun) thongBao(T.du, 3);
        }
        break;

      case 'dat3':
        if (p === 'GOM') {
          if (S.gom.gomHat && S.gom.gomNuoc && S.gom.gomMun) gieo3(ctx);
          else thongBao(T.canDu, 2.6);
        }
        break;
    }
  }

  function haiQua(ctx) {
    var B = ctx.text;
    o.cay1.qua.forEach(function (q) {
      if (!q.m.visible) return;
      q.m.getWorldPosition(_p);
      phun(o.sang, _p.x, _p.y, _p.z, 10, 0.4, 0.6);
    });
    o.cay1.vQua = 0;
    amHop(523.25);
    thongBao(B.thongBao.hai, 3.4);
    doiPha('HAI');
  }

  function gieo3(ctx) {
    var B = ctx.text.buocNhay, L = LUONG[2];
    doiPha('LON3');
    CAY3.forEach(function (c, i) { ctx.player.blockers.push({ x: c[0], z: c[1], r: i ? 0.35 : 0.5 }); });
    ctx.hud.buocNhay(B.nhan3, B.t3);
    ctx.audio.buocNhay();
    amHop(392);
    amHop(587.33);
    phun(o.sang, L.x, L.h + 0.1, L.z, 80, 1.4, 1.2);
    phun(o.giot, NGUON3[0], hDat(NGUON3[0], NGUON3[1]) + 0.4, NGUON3[1], 30, 0.9, 1.3);
  }

  /* ═══════════ logic từng chặng ═══════════ */

  function logic(dt, ctx) {
    var P = ctx.player, T = ctx.text.thongBao, B = ctx.text.buocNhay, A = TX.anim;
    S.t += dt;

    var tac = P.action();
    var bam = (tac > 0 && S.tacTruoc <= 0) || S.bam;
    S.bam = false;
    S.tacTruoc = tac;

    /* gương: giữ chuột để xoay, không phải bấm */
    var u = S.chon;
    if (u && u.id === 'guong' && S.pha === 'TH1' && !S.th1.sang) {
      if (tac) {
        o.guong.goc += tac * TOC_GUONG * dt;
        S.xoayAm = (S.xoayAm || 0) - dt;
        if (S.xoayAm <= 0) { not(180 + Math.random() * 30, 'triangle', 0.02, 0.06); S.xoayAm = 0.12; }
        if (Math.abs(gocGon(o.guong.goc - o.guong.dich)) < KHOP_GUONG) {
          o.guong.goc = o.guong.dich;
          S.th1.sang = true;
          amHop(659.25);
          phun(o.sang, LUONG[0].x, LUONG[0].h + 1.2, LUONG[0].z, 30, 0.6, 0.6);
          thongBao(T.nang, 2.2);
        }
      }
    } else if (bam && u && S.chonChu) {
      tacDong(u, ctx);
    }

    switch (S.pha) {
      case 'TH1':
        var soViec = (S.th1.nuoc ? 1 : 0) + (S.th1.sang ? 1 : 0) + (S.th1.bon ? 1 : 0);
        S.m1 = A.damp(S.m1, 0.12 + 0.2 * soViec, 1.6, dt);
        if (soViec === 3) doiPha('LON1');
        break;

      case 'LON1':
        S.m1 = A.damp(S.m1, 1, 1.4, dt);
        o.vung[0].xanhDich = 0.35;
        if (S.t > 3.2) {
          doiPha('QUA1');
          not(880, 'sine', 0.05, 0.4);
        }
        break;

      case 'QUA1':
        o.cay1.vQua = Math.min(1, o.cay1.vQua + dt * 1.2);
        break;

      case 'HAI':
        if (S.t > 2.6) doiPha('TAN1');
        break;

      case 'TAN1':
        S.kkDich = 1;
        S.heo1 = A.muot(S.t / 6);
        o.vung[0].xanhDich = 0;
        if (Math.random() < dt * 14 * (1 - S.heo1 * 0.6)) rungLa(o.cay1, 2);
        if (S.t > 6.6) {
          o.hat1.visible = true;
          phun(o.sang, LUONG[0].x + 0.45, LUONG[0].h + 0.3, LUONG[0].z + 0.35, 40, 0.8, 1.0);
          ctx.hud.buocNhay(B.nhan1, B.t1);
          ctx.audio.buocNhay();
          doiPha('HAT1');
        }
        break;

      case 'LON2':
        S.kkDich = 2;
        var dai = S.dacTinh.sang ? 4 : 5.5;
        S.m2 = A.muot(S.t / dai);
        o.vung[1].xanhDich = 1;
        o.vung[3].xanhDich = 0.25;
        if (Math.random() < dt * 20) phun(o.sang, LUONG[1].x + (Math.random() - 0.5) * 2, LUONG[1].h + 0.2, LUONG[1].z + (Math.random() - 0.5) * 2, 1, 0.2, 0.6);
        if (S.t > dai + 0.4) doiPha('TH2');
        break;

      case 'TH2':
        logicTH2(dt, ctx);
        break;

      case 'TAN2':
        logicTAN2(dt, ctx);
        break;

      case 'LON3':
        S.kkDich = 4;
        S.m3 = A.muot(S.t / 5);
        S.m3b = A.muot((S.t - 1.2) / 4.5);
        S.m3c = A.muot((S.t - 2.6) / 3);
        S.hoa3 = A.muot((S.t - 2) / 3.5);
        S.suoi3 = A.muot((S.t - 0.8) / 5.5);
        S.buom = A.muot((S.t - 3.5) / 2);
        o.vung.forEach(function (v) { v.xanhDich = 1; v.vangDich = 0; });
        o.cay3[0].vQua = A.doan(S.t, 4.5, 7);
        o.cay3[2].vQua = A.doan(S.t, 5, 7.5);
        if (S.t > 7.5) {
          doiPha('TH3');
          thongBao(T.vuon3, 4);
        }
        break;

      case 'TH3':
        if (S.t > 8) batDauBay(ctx);
        break;
    }
  }

  function logicTH2(dt, ctx) {
    var T = ctx.text.thongBao, th = S.th2;
    th.suoi = Math.min(1, th.suoi + (th.nguon ? dt / 1.6 : 0));
    var du = th.nguon && th.hoa.indexOf(false) < 0;
    if (du) {
      if (th.ong === 0) thongBao(T.ong, 3.4);
      th.ong = Math.min(1, th.ong + dt / 2.5);
    }
    if (th.ong >= 1 && th.thuPhan < 1) {
      th.thuPhan = Math.min(1, th.thuPhan + dt / 7);
      o.cay2.vQua = th.thuPhan;
    }
    if (th.thuPhan >= 1) {
      if (th.con === 0) {
        thongBao(T.qua2, 4);
        /* quả rụng xuống chỗ cây con sắp mọc */
        CON2.forEach(function (p) { phun(o.sang, p[0], hDat(p[0], p[1]) + 0.1, p[1], 10, 0.3, 0.6); });
        amHop(440);
      }
      th.con = Math.min(1, th.con + dt / 3);
      o.cay2.vQua = 1 - th.con * 0.6;
    }
    if (th.con >= 1) {
      th.onT += dt;
      if (th.onT > 1.2) mot('onDinh', T.onDinh, 3);
      if (th.onT > 6) doiPha('TAN2');
    }
  }

  /* Giới hạn nội tại: không thiên tai, không ai phá. Rễ lan, nước cạn,
     hoa héo, ong bỏ đi — lần lượt, để người chơi kịp thấy nguyên nhân. */
  function logicTAN2(dt, ctx) {
    var T = ctx.text.thongBao, B = ctx.text.buocNhay, A = TX.anim, t = S.t, z = S.tan2;
    if (t > 1.5) S.kkDich = 3;
    z.re = A.muot(t / 3.2);
    if (t > 0.4) mot('re', T.re, 3);
    z.nuoc = 1 - A.doan(t, 3.4, 6);
    if (t > 3.4) mot('can', T.can, 3);
    z.hoaHeo = A.doan(t, 6.4, 8.4);
    z.ongDi = A.doan(t, 6.4, 9);
    z.conHeo = A.doan(t, 6.8, 9.5);
    if (t > 6.4) mot('matCanBang', T.matCanBang, 3.2);
    S.heo2 = 0.6 * A.doan(t, 6, 10.5);
    o.vung[1].vangDich = A.doan(t, 4, 9);
    if (t > 6 && Math.random() < dt * 16) rungLa(o.cay2, 2);
    if (t > 11) {
      ctx.hud.buocNhay(B.nhan2, B.t2);
      ctx.audio.buocNhay();
      for (var k in o.gom) {
        o.gom[k].visible = true;
        phun(o.sang, o.gom[k].position.x, o.gom[k].position.y + 0.1, o.gom[k].position.z, 20, 0.5, 0.8);
      }
      doiPha('GOM');
    }
  }

  /* ═══════════ thẻ chọn đặc tính ═══════════ */

  function moChonHat(ctx) {
    var C = ctx.text.chonHat, chon = {};
    ctx.hud.anChuGiai();
    ctx.hud.the(
      '<style>' +
        '.pdDT{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0 4px}' +
        '@media (max-width:560px){.pdDT{grid-template-columns:1fr}}' +
        '.pdDT button{font:inherit;text-align:left;padding:12px 14px;border-radius:12px;border:1px solid var(--vien);' +
          'background:rgba(255,255,255,.6);cursor:pointer;color:var(--muc2);transition:border-color .2s,box-shadow .2s,background .2s}' +
        '.pdDT button:hover{border-color:var(--vangN)}' +
        '.pdDT b{display:block;font-size:14.5px;color:var(--muc);margin-bottom:3px}' +
        '.pdDT span{display:block;font-size:12.5px;line-height:1.5}' +
        '.pdDT i{display:block;margin-top:6px;font-size:11.5px;font-style:normal;letter-spacing:.04em;color:var(--vang)}' +
        '.pdDT button.on{border-color:var(--vang);background:#fff8e8;box-shadow:0 0 0 3px rgba(226,197,138,.35)}' +
        '.pdDT button.on b::before{content:"✓ ";color:#1e7a46}' +
        '.pdDT button.on.xau{border-color:#c8352a;background:#fff1ee;box-shadow:0 0 0 3px rgba(200,53,42,.15)}' +
        '.pdDT button.on.xau b::before{color:#c8352a}' +
        '#card p.pdKQ{min-height:3.4em;margin:14px 0 0;font-size:13.5px}' +
        '#card p.pdKQ.sai{color:#a8392c}' +
        '#card p.pdKQ.dung{color:#1e7a46}' +
        '#card p.pdKQ b{font-weight:700}' +
        '#cardGo:disabled{opacity:.4;cursor:default;transform:none;box-shadow:none}' +
      '</style>' +
      '<div class="eyebrow">' + C.nhan + '</div>' +
      '<h1>' + C.tieuDe + '</h1>' +
      '<p>' + C.dan + '</p>' +
      '<div class="pdDT">' + C.dacTinh.map(function (d) {
        return '<button type="button" data-id="' + d.id + '"' + (d.id === 'gay' ? ' class="xau"' : '') + '>' +
                 '<b>' + d.ten + '</b><span>' + d.mo + '</span><i>→ ' + d.the + '</i></button>';
      }).join('') + '</div>' +
      '<p class="pdKQ" id="pdKQ"></p>',
      C.nut,
      function () {
        S.dacTinh = { re: !!chon.re, sang: !!chon.sang, qua: !!chon.qua };
        o.hat1.visible = false;
        taoCay2(ctx);
        S.tay.hat = true;
        amNhat();
        doiPha('GIEO2');
        if (!ctx.player.chuotTuDo) ctx.player.grab();
      }
    );
    var nut = document.getElementById('cardGo'), kq = document.getElementById('pdKQ');
    function capNhat() {
      var tot = chon.re || chon.sang || chon.qua, xau = chon.gay, n = Object.keys(chon).filter(function (k) { return chon[k]; }).length;
      var ok = tot && !xau;
      nut.disabled = !ok;
      kq.className = 'pdKQ' + (n === 0 ? '' : ok ? ' dung' : ' sai');
      kq.innerHTML = n === 0 ? C.trong : xau ? C.nguyenXi : !tot ? C.sachTron : C.on;
    }
    Array.prototype.forEach.call(document.querySelectorAll('.pdDT button'), function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        chon[id] = !chon[id];
        b.classList.toggle('on', chon[id]);
        not(chon[id] ? 660 : 440, 'triangle', 0.04, 0.1);
        capNhat();
      });
    });
    capNhat();
  }

  /* ═══════════ đoạn camera bay lên: vạch đường xoắn ═══════════ */

  var Q1 = new THREE.Vector3(9.5, 8.0, 10.0), TAM = new THREE.Vector3(0, 1.0, 0);
  /* nhìn gần như thẳng xuống, khu vườn đẩy lên nửa trên khung hình để
     phụ đề ở dưới không che mất đường xoắn */
  var DINH = new THREE.Vector3(0.4, 19, 6.5), TAM_DINH = new THREE.Vector3(0, 0.5, 2.6);
  var CAU = [1.0, 5.0, 9.2, 13.4, 17.6];        // lúc hiện từng dòng phụ đề
  var T_BAY = 22.5;
  var _a = new THREE.Vector3(), _b = new THREE.Vector3();

  function batDauBay(ctx) {
    doiPha('BAY');
    ctx.khoaCamera = true;
    ctx.hud.anChuGiai();
    ctx.hud.phim(true);
    ctx.hud.ngamTat(true);
    ctx.hud.hienGoiY(false);
    document.body.classList.add('lc-phim');
    o.camTu = ctx.camera.position.clone();
    ctx.camera.getWorldDirection(_a);
    o.nhinTu = o.camTu.clone().addScaledVector(_a, 5);
    S.cau = -1;
    amHop(329.63);
  }

  function quy(t, out) {
    var a = Math.atan2(Q1.x, Q1.z) + t * 0.1, R = Math.hypot(Q1.x, Q1.z);
    return out.set(Math.sin(a) * R, Q1.y, Math.cos(a) * R);
  }

  function bay(dt, ctx) {
    var A = TX.anim, t = S.t, cam = ctx.camera;
    if (t < 4) {
      var k = A.muot(t / 4);
      cam.position.lerpVectors(o.camTu, Q1, k);
      cam.position.y += Math.sin(k * Math.PI) * 1.2;
      _b.lerpVectors(o.nhinTu, TAM, k);
    } else if (t < 13.5) {
      quy(t - 4, cam.position);
      _b.copy(TAM);
    } else {
      var k2 = A.muot((t - 13.5) / 4.5);
      quy(9.5, _a);
      cam.position.lerpVectors(_a, DINH, k2);
      _b.lerpVectors(TAM, TAM_DINH, k2);
    }
    cam.lookAt(_b);

    var N = o.xoan.geometry.index.count;
    o.xoan.geometry.setDrawRange(0, Math.floor(A.doan(t, 1.5, 6.5) * N / 6) * 6);
    var N2 = o.xoanTiep.geometry.index.count;
    o.xoanTiep.geometry.setDrawRange(0, Math.floor(A.doan(t, 6.5, 9.5) * N2 / 6) * 6);

    /* ba đốm sáng ở ba luống, sáng lên theo dòng phụ đề đang nói về chúng */
    var sangLuong = [[1, 1, 1], [1, 1, 0.3], [0.3, 1, 1], [1, 0.3, 1], [1, 1, 1]][Math.max(0, S.cau)];
    o.dauXoan.forEach(function (q, i) {
      var muc = t > 1.5 + i * 2 ? sangLuong[i] : 0;
      q.scale.setScalar(Math.max(0.001, A.damp(q.scale.x, muc * (1.6 + Math.sin(ctx.clock * 3 + i) * 0.2), 3, dt)));
    });

    var F = ctx.text.phim;
    for (var c = CAU.length - 1; c >= 0; c--) {
      if (t >= CAU[c]) {
        if (S.cau !== c) {
          S.cau = c;
          var p = F[c].p;
          if (p.indexOf('%s') >= 0) {
            p = p.replace('%s', ['re', 'sang', 'qua'].filter(function (k) { return S.dacTinh[k]; })
              .map(function (k) { return ctx.text.dacTinhNgan[k]; }).join(', '));
          }
          ctx.hud.phimChu(F[c].k, F[c].t, p);
          not(523.25 * Math.pow(2, [0, 2, 4, 7, 12][c] / 12), 'sine', 0.05, 1.4);
        }
        break;
      }
    }

    if (t > T_BAY) {
      ctx.hud.phimChu();
      ctx.hud.phim(false);
      ctx.hud.ngamTat(false);
      document.body.classList.remove('lc-phim');
      ctx.khoaCamera = false;
      doiPha('HOI');
      hoiCauHoi(ctx);
    }
  }

  /* ═══════════ câu hỏi và bài học ═══════════ */

  function hoiCauHoi(ctx) {
    var C = ctx.text.cauHoi;
    ctx.hud.the(
      '<style>' +
        '.pdCH{display:grid;gap:8px;margin:4px 0 0}' +
        '.pdCH button{font:inherit;display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;text-align:left;' +
          'padding:11px 14px;border-radius:12px;border:1px solid var(--vien);background:rgba(255,255,255,.6);' +
          'cursor:pointer;color:var(--muc);font-size:14px;line-height:1.5;transition:border-color .2s,background .2s}' +
        '.pdCH button:hover{border-color:var(--vangN)}' +
        '.pdCH button em{font-style:normal;font-weight:700;color:var(--vang);font-size:13px;margin-top:1px}' +
        '.pdCH button.sai{border-color:rgba(200,53,42,.5);background:#fff3f0;color:var(--muc2)}' +
        '.pdCH button.sai em{color:#c8352a}' +
        '.pdCH button.dung{border-color:#1e7a46;background:#eef8f0}' +
        '.pdCH button.dung em{color:#1e7a46}' +
        '.pdCH button small{display:block;grid-column:2;font-size:12.5px;line-height:1.5;margin-top:4px;color:var(--muc2)}' +
        '#cardGo.pdAn{display:none}' +
      '</style>' +
      '<div class="eyebrow">' + C.nhan + '</div>' +
      '<h1>' + C.tieuDe + '</h1>' +
      '<div class="pdCH">' + C.chon.map(function (c, i) {
        return '<button type="button" data-i="' + i + '"><em>' + 'ABCD'[i] + '</em><span>' + c.chu + '</span></button>';
      }).join('') + '</div>',
      C.nut,
      function () { theBaiHoc(ctx); }
    );
    var nut = document.getElementById('cardGo');
    nut.classList.add('pdAn');
    Array.prototype.forEach.call(document.querySelectorAll('.pdCH button'), function (b) {
      b.addEventListener('click', function () {
        var c = C.chon[+b.getAttribute('data-i')];
        if (b.querySelector('small')) return;
        b.classList.add(c.dung ? 'dung' : 'sai');
        var s = document.createElement('small');
        s.innerHTML = c.giai;
        b.appendChild(s);
        if (c.dung) {
          nut.classList.remove('pdAn');
          amHop(523.25);
        } else not(200, 'triangle', 0.05, 0.25);
      });
    });
  }

  function theBaiHoc(ctx) {
    var B = ctx.text.baiHoc;
    ctx.soTay.ghi({
      ten: ctx.text.soTay.ten,
      tom: ctx.text.soTay.tom,
      trichDan: B.trichDan,
      nguon: B.nguon
    });
    ctx.hoanThanh();
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

  /* ═══════════ hình ảnh ═══════════ */

  var _c1 = new THREE.Color(), _c2 = new THREE.Color(), _cX = new THREE.Color(MAU_XANH), _cV = new THREE.Color(MAU_VANG);

  function mauBang(key, kk, out) {
    var i = Math.min(BANG_MAU.length - 2, Math.floor(kk)), f = kk - i;
    return out.setHex(BANG_MAU[i][key]).lerp(_c2.setHex(BANG_MAU[i + 1][key]), f);
  }
  function soBang(key, kk) {
    var i = Math.min(BANG_MAU.length - 2, Math.floor(kk)), f = kk - i;
    return BANG_MAU[i][key] + (BANG_MAU[i + 1][key] - BANG_MAU[i][key]) * f;
  }

  function khongKhi(dt, ctx) {
    var A = TX.anim;
    S.kk = A.damp(S.kk, S.kkDich, 0.9, dt);
    var kk = S.kk;
    mauBang('tren', kk, o.troiU.uTren.value);
    mauBang('chan', kk, o.troiU.uChan.value);
    /* sương nhân trong không gian tuyến tính rồi mới mã hoá sRGB — đổi
       ngược trước để chân trời của sương khớp đúng màu trời */
    ctx.moiTruong.suong.color.copy(o.troiU.uChan.value).convertSRGBToLinear();
    ctx.moiTruong.nen.copy(o.troiU.uChan.value);
    ctx.moiTruong.suong.density = soBang('suong', kk);
    mauBang('doi', kk, o.matDoi.color);
    mauBang('dat', kk, o.matNgoai.color);
    mauBang('hT', kk, o.hemi.color);
    mauBang('hD', kk, o.hemi.groundColor);
    o.hemi.intensity = soBang('hI', kk);
    mauBang('nang', kk, o.nang.color);
    o.nang.intensity = soBang('nI', kk);
    o.troiU.uNang.value.copy(o.nang.color).multiplyScalar(o.nang.intensity / 1.3);
    o.bui.material.uniforms.uDoMo.value = A.damp(o.bui.material.uniforms.uDoMo.value,
      kk < 1.5 ? 0.18 : kk < 3.5 ? 0.45 : 0.95, 1, dt);

    /* màu đất theo vùng: đất khô ở nền, xanh hoặc vàng úa đè lên */
    var doi = o.datKy < 0 || Math.abs(kk - S.kkVe) > 0.002;
    o.vung.forEach(function (v) {
      var x0 = v.xanh, v0 = v.vang;
      v.xanh = A.damp(v.xanh, v.xanhDich, 1.1, dt);
      v.vang = A.damp(v.vang, v.vangDich, 1.0, dt);
      if (Math.abs(v.xanh - x0) > 1e-4 || Math.abs(v.vang - v0) > 1e-4) doi = true;
      v.uCo.value = v.xanh * (1 - 0.55 * v.vang);
      v.co.material.color.setHex(0xffffff).lerp(_c1.setHex(0xe0c070), v.vang);
    });
    if (doi) {
      S.kkVe = kk;
      o.datKy = 1;
      mauBang('dat', kk, _c1);
      var col = o.dat.geometry.attributes.color, a = col.array, n = col.count;
      var vx = o.vung;
      for (var i = 0; i < n; i++) {
        var r = _c1.r, g = _c1.g, b = _c1.b;
        for (var k = 0; k < vx.length; k++) {
          var w = vx[k].w[i] * vx[k].xanh;
          if (w <= 0.001) continue;
          var tr = _cX.r + (_cV.r - _cX.r) * vx[k].vang, tg = _cX.g + (_cV.g - _cX.g) * vx[k].vang, tb = _cX.b + (_cV.b - _cX.b) * vx[k].vang;
          r += (tr - r) * w; g += (tg - g) * w; b += (tb - b) * w;
        }
        a[i * 3] = r; a[i * 3 + 1] = g; a[i * 3 + 2] = b;
      }
      col.needsUpdate = true;
    }
  }

  function hinhAnh(dt, ctx) {
    var A = TX.anim, t = ctx.clock;

    khongKhi(dt, ctx);

    o.cay1.dat(S.m1, S.heo1);
    if (o.cay2) {
      o.cay2.dat(S.m2, S.heo2);
      o.con2.forEach(function (c, i) {
        c.dat(A.doan(S.th2.con * 1.4 - i * 0.2, 0, 1), S.tan2.conHeo);
        c.nhom.scale.y = 1 - S.tan2.conHeo * 0.5;
      });
      o.reLan.children.forEach(function (r, i) {
        var k = A.doan(S.tan2.re * 1.3 - i * 0.03, 0, 1);
        r.geometry.setDrawRange(0, Math.floor(k * r.geometry.index.count / 3) * 3);
      });
    }
    o.cay3[0].dat(S.m3, 0);
    o.cay3[1].dat(S.m3b, 0);
    o.cay3[2].dat(S.m3b, 0);
    o.con3.forEach(function (c, i) { c.dat(A.doan(S.m3c * 1.5 - i * 0.15, 0, 1), 0); });
    o.uHoa3.value = S.hoa3;

    /* gương và vệt nắng */
    var G = o.guong;
    G.piv.rotation.y = G.goc;
    var lech = Math.abs(gocGon(G.goc - G.dich));
    o.tia1.scale.z = S.th1.sang ? G.dai : 2.6;
    o.matTia.opacity = S.pha === 'TH1' || S.pha === 'LON1' || S.pha === 'QUA1'
      ? (S.th1.sang ? 0.5 + Math.sin(t * 3) * 0.08 : 0.22 + 0.25 * Math.max(0, 1 - lech / 0.6))
      : A.damp(o.matTia.opacity, 0, 2, dt);
    o.tia1.visible = o.matTia.opacity > 0.01;
    o.cotNang.material.opacity = o.tia1.visible ? 0.12 : A.damp(o.cotNang.material.opacity, 0, 2, dt);
    o.matGuong.emissiveIntensity = 0.3 + (S.th1.sang ? 0.5 : 0);

    /* nước giếng cạn dần sau thế hệ một */
    o.gauGieng.visible = !S.tay.nuoc && !S.th1.nuoc;

    /* mùn */
    o.mun.forEach(function (m, i) {
      m.nhom.visible = !m.lay;
      m.quang.material.opacity = S.pha === 'TH1' ? 0.35 + Math.sin(t * 2.4 + i) * 0.15 : 0;
    });

    /* hạt sáng dưới gốc cây cũ */
    if (o.hat1.visible) {
      o.hat1.rotation.y += dt * 1.2;
      o.hat1.position.y = LUONG[0].h + 0.2 + Math.sin(t * 2) * 0.05;
    }

    /* vòng sáng mời gieo */
    var v2 = S.pha === 'GIEO2' ? 0.55 + Math.sin(t * 2.6) * 0.2 : 0;
    o.vong2.material.opacity = A.damp(o.vong2.material.opacity, v2, 4, dt);
    var du = S.gom.gomHat && S.gom.gomNuoc && S.gom.gomMun;
    var v3 = S.pha === 'GOM' && du ? 0.55 + Math.sin(t * 2.6) * 0.2 : 0;
    o.vong3.material.opacity = A.damp(o.vong3.material.opacity, v3, 4, dt);

    /* suối luống 2: chảy tới cây, cạn dần khi khu vườn mất cân bằng */
    moSuoi(o.suoi2, S.th2.suoi);
    o.suoi2.material.uniforms.uDoMo.value = 0.9 * S.tan2.nuoc;
    o.quangNguon.material.opacity = S.pha === 'TH2' && !S.th2.nguon ? 0.5 + Math.sin(t * 2.4) * 0.2 : 0;

    /* bồn hoa */
    o.hoa2.forEach(function (h, i) {
      h.k = A.damp(h.k, S.th2.hoa[i] ? 1 : 0, 3, dt);
      h.quang.material.opacity = S.pha === 'TH2' && !S.th2.hoa[i] ? 0.4 + Math.sin(t * 2.4 + i) * 0.15 : 0;
      h.bong.forEach(function (b, j) {
        var k = A.vot(A.doan(h.k * 1.3 - j * 0.06, 0, 1), 1.6);
        b.scale.setScalar(Math.max(0.001, k));
        b.userData.dau.rotation.x = S.tan2.hoaHeo * 1.4;
        b.scale.y = Math.max(0.001, k * (1 - S.tan2.hoaHeo * 0.45));
      });
      h.matBong.color.copy(h.mauBong).lerp(_c1.setHex(0x8a6a44), S.tan2.hoaHeo);
    });

    capNhatOng(dt, t);
    capNhatBuom(dt, t);

    /* suối thế hệ ba: chảy từ đỉnh xuống, qua cả hai luống cũ */
    moSuoi(o.suoi3, S.suoi3);

    /* vật để gom: lơ lửng nhẹ */
    if (S.pha === 'GOM') {
      o.gom.gomNuoc.position.y = hDat(GOM.gomNuoc[0], GOM.gomNuoc[1]) + 1.0 + Math.sin(t * 2) * 0.06;
      o.gom.gomHat.rotation.y += dt;
    }

    capNhatHat(dt, t);
    capNhatTay(ctx);
  }

  var _d = new THREE.Vector3();

  function capNhatOng(dt, t) {
    var th = S.th2, L = LUONG[1];
    var hien = th.ong > 0.01 && S.tan2.ongDi < 1;
    o.ong.forEach(function (b, i) {
      b.nhom.visible = hien;
      if (!hien) return;
      var F = o.hoa2[b.hoa].nhom.position;
      var u = (t * 0.16 + b.ph) % 1, w = 0.5 - 0.5 * Math.cos(u * 6.28);
      var cy = L.h + (S.cay2Cao || 2.2) * 0.75;
      _p.set(F.x + (L.x - F.x) * w, F.y + 0.45 + (cy - F.y - 0.45) * w + Math.sin(w * Math.PI) * 0.5, F.z + (L.z - F.z) * w);
      _p.x += Math.sin(t * 7 + i * 3) * 0.1;
      _p.y += Math.sin(t * 9 + i) * 0.06;
      _p.z += Math.cos(t * 8 + i * 2) * 0.1;
      /* bay tới từ ngoài vườn, rồi bỏ đi lên trời */
      _d.set(L.x - 6 + i, L.h + 4, L.z + 5);
      _p.lerpVectors(_d, _p, TX.anim.muot(th.ong));
      _p.y += S.tan2.ongDi * S.tan2.ongDi * 6;
      _p.x += S.tan2.ongDi * 3;
      b.nhom.position.copy(_p);
      if (b.truoc.distanceToSquared(_p) > 1e-6) b.nhom.lookAt(_d.copy(_p).multiplyScalar(2).sub(b.truoc));
      b.truoc.copy(_p);
      var vo = Math.sin(t * 70 + i) * 0.7;
      b.canh[0].rotation.z = vo; b.canh[1].rotation.z = -vo;
    });
  }

  function capNhatBuom(dt, t) {
    var hien = S.buom > 0.01;
    o.buom.forEach(function (b, i) {
      b.nhom.visible = hien;
      if (!hien) return;
      var x = b.tam[0] + Math.sin(t * 0.5 * b.toc + b.ph) * 1.3;
      var z = b.tam[1] + Math.cos(t * 0.37 * b.toc + b.ph * 2) * 1.3;
      _p.set(x, hDat(x, z) + 0.7 + Math.sin(t * 0.9 + b.ph) * 0.3 + Math.sin(t * 6 + i) * 0.04, z);
      _p.y += (1 - S.buom) * 3;
      b.nhom.position.copy(_p);
      if (b.truoc.distanceToSquared(_p) > 1e-6) b.nhom.lookAt(_d.copy(_p).multiplyScalar(2).sub(b.truoc));
      b.truoc.copy(_p);
      var vo = Math.sin(t * 14 + b.ph) * 1.0;
      b.canh[0].rotation.z = vo; b.canh[1].rotation.z = -vo;
      b.nhom.scale.setScalar(Math.max(0.001, S.buom));
    });
  }

  /* ═══════════ HUD ═══════════ */

  function hud(dt, ctx) {
    var G = ctx.text.goiY;
    capNhatONhiemVu(ctx);

    if (S.tb > 0) {
      S.tb -= dt;
      if (S.tb <= 0) el.tb.classList.remove('on');
    }
    if (S.pha === 'BAY' || S.pha === 'HOI') el.tb.classList.remove('on');

    var key = S.pha;
    if (key === 'TH2' && S.th2.nguon && S.th2.hoa.indexOf(false) < 0) key = 'TH2Cho';
    if (key === 'GOM' && S.gom.gomHat && S.gom.gomNuoc && S.gom.gomMun) key = 'GOMDu';
    if (key === 'HAI') key = 'TAN1';
    if (key === 'LON1') key = 'TH1';
    var chu = S.chonChu || G[key] || '';
    ctx.hud.goiY(thayPhim(chu, ctx));
    ctx.hud.hienGoiY(!!chu && S.pha !== 'BAY' && S.pha !== 'HOI');
    ctx.hud.ngam(!!(S.chonChu && S.chonChu.indexOf('%b') >= 0));
    ctx.hud.hienPanel(false);
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function onEnter(ctx) {
    S.batDau = true;
    amGio(ctx);
  }

  function update(dt, ctx) {
    var chay = S.batDau && !ctx.hud.theDangMo() && !ctx.hud.soTayDangMo();
    if (chay) {
      if (S.pha === 'BAY') { S.t += dt; bay(dt, ctx); }
      else if (S.pha !== 'HOI') {
        nhinVao(dt, ctx);
        logic(dt, ctx);
      }
      /* chim hót khi khu vườn còn sống */
      S.chimT -= dt;
      if (S.chimT <= 0) {
        S.chimT = 1.8 + Math.random() * 3.5;
        if ((S.pha === 'TH2' || tu('LON3')) && S.pha !== 'HOI') amChim();
      }
    }
    hinhAnh(chay ? dt : 0, ctx);
    hud(dt, ctx);
    if (o.gio) {
      var muc = S.kk < 1.5 ? 0.05 : S.kk < 3.5 ? 0.025 : 0.015;
      o.gio.gn.gain.setTargetAtTime(chay ? muc : 0.0001, o.gio.a.currentTime, 0.4);
    }
  }

  function dispose(ctx) {
    if (ctx) ctx.khoaCamera = false;
    document.body.classList.remove('lc-phim');
    if (ctx) { ctx.hud.phim(false); ctx.hud.ngamTat(false); }
    if (el) {
      if (el.nv && el.nv.parentNode) el.nv.parentNode.removeChild(el.nv);
      if (el.tb && el.tb.parentNode) el.tb.parentNode.removeChild(el.tb);
    }
    if (o && o.gio) { try { o.gio.src.stop(); } catch (e) {} }
    if (o && o.texQuang) o.texQuang.dispose();
    S = o = el = null;
  }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'phu-dinh',
    tieuDe: 'Phủ định của phủ định',
    nhanNgan: 'Tầng II · Chương 2',
    moTa: 'Một khu vườn qua ba thế hệ. Cái mới mọc lên từ cái cũ — nhưng không giống cái cũ.',
    goiY: {
      khoa:    'Nhìn vào một vật, bấm <kbd>Chuột trái</kbd>',
      duPhong: 'Nhìn vào một vật, nhấn <kbd>F</kbd>'
    },
    build: build,
    onEnter: onEnter,
    update: update,
    dispose: dispose
  });

})(window.TX);
