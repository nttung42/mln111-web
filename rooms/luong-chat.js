/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — ĐỘT PHÁ CẢNH GIỚI  (Lượng đổi dẫn đến Chất đổi)
   Quy luật chuyển hoá từ những thay đổi về lượng thành những thay đổi
   về chất và ngược lại. (Giáo trình, Chương 2, mục 2.2.2)

   Một động phủ tu luyện. Hai bước:
     1. Người chơi bước tới bồ đoàn giữa trận pháp và nhảy lên ngồi —
        camera lùi ra, thấy hình một tu sĩ đang ngồi thiền.
     2. Vận công: khí bay vòng quanh tu sĩ, tu vi càng cao khí xoay càng
        nhanh, càng dày. Tới ngưỡng thì tự canh điểm nút để đột phá.

   Ánh xạ khái niệm → cơ chế:
     Chất      : cảnh giới — Luyện Khí, Trúc Cơ; và cả động phủ đổi theo
     Lượng     : tu vi; khí quanh người xoay nhanh dần, quả cầu khí trong tay sáng
                 dần, cột đá khắc hoa văn sáng lần lượt
     Độ        : 0 → 100 tu vi của Luyện Khí, vẽ nổi trên thanh đo
     Điểm nút  : mốc 100
     Bước nhảy : bấm đúng lúc con trỏ chạm 100 → quả cầu khí vỡ, vách đá
                 sụp, trần mở ra trời, cây tiên mọc lên

   Phương pháp luận nằm trong chính lối chơi:
     bấm sớm  (con trỏ < 97)  → tả khuynh: tẩu hoả nhập ma, tu vi tụt
     bấm muộn (> 103) hoặc chần chừ quá lâu → hữu khuynh: linh lực tán
   Chiều ngược lại: Trúc Cơ có giới hạn 1000 và hấp thụ nhanh gấp năm —
   chất mới quy định lượng mới.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  /* ---------- nhịp chơi ---------- */
  var GIOI_HAN   = { LUYEN_KHI: 100, TRUC_CO: 1000 };
  var TOC_DO     = { LUYEN_KHI: 7.5, TRUC_CO: 37.5 };  // tu vi mỗi giây khi vận công
  var NGUONG_DOT = 90;          // tới đây thì bắt đầu canh đột phá
  var VUNG       = [97, 103];   // bấm trong khoảng này là đột phá thành công
  var VIEN_MAN   = 0.8;         // lệch khỏi 100 không quá chừng này là viên mãn
  var TOC_CON    = 15;          // con trỏ chạy bao nhiêu đơn vị mỗi giây
  var SO_LUOT    = 3;           // con trỏ chạm mép 110 chừng ấy lần mà chưa bấm = chần chừ
  var SAU_TA     = 70;          // tu vi còn lại sau khi tẩu hoả nhập ma
  var SAU_HUU    = 78;          // tu vi còn lại sau khi linh lực tán
  var XONG_TRUC  = 200;         // tu vi Trúc Cơ cần có để thấy rõ "lượng mới"
  var TAM_NGOI   = 2.5;         // đứng trong bán kính này thì nhảy lên bồ đoàn được
  var NHIN_TRE   = 0.3;

  /* ---------- nhịp cảnh (giây) ---------- */
  var T_LEN  = 0.9;             // nhảy lên bồ đoàn
  var T_NO   = 0.8;             // im lặng, quả cầu khí rung — rồi nổ
  var T_BIEN = 3.8;             // động phủ biến thành tiên cảnh

  /* ---------- bố cục (m) ---------- */
  var GHE_Y   = 0.48;           // mặt bồ đoàn
  var NGUC    = new THREE.Vector3(0, GHE_Y + 0.43, 0.24);  // quả cầu giữa hai tay — khí hội tụ về đây
  var CAY_Z   = -2.8;           // cây tiên mọc sau lưng tu sĩ
  var TINH_Y  = 3.4;            // tiên tinh bay vào giữa tán cây
  var R_COT   = 5.4;
  var R_DAO   = 11;             // bán kính đảo nổi
  var LO      = [[-3.0, -0.6], [3.0, -0.6]];
  var TUONG   = 7.6;

  /* camera khi ngồi: xoay quanh tu sĩ theo chuột */
  var TAM_NHIN = new THREE.Vector3(0, 1.3, 0);
  var CAM_XA   = 3.9;
  var CAM_TOI_DA = 4.5;         // xa hơn là chạm vào vòng cột đá
  var CAM_YAW  = 0.33;          // mặc định nhìn chéo từ trước mặt
  var CAM_PITCH = -0.16;

  var S, o, el;

  /* ═══════════ tiện ích ═══════════ */

  function mau(h) { return new THREE.Color(h); }

  /* Làm méo khối cho ra đá. Đỉnh trùng vị trí thì méo như nhau,
     nên mặt không bị toác ở đường nối. */
  function goGhe(geo, bien, giuDinh) {
    var p = geo.attributes.position, nho = {};
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var k = Math.round(x * 500) + ',' + Math.round(y * 500) + ',' + Math.round(z * 500);
      if (!nho[k]) nho[k] = [(Math.random() - 0.5) * bien, (Math.random() - 0.5) * bien, (Math.random() - 0.5) * bien];
      var d = nho[k];
      if (giuDinh !== undefined && y >= giuDinh) { p.setX(i, x + d[0]); p.setZ(i, z + d[2]); continue; }
      p.setXYZ(i, x + d[0], y + d[1], z + d[2]);
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

  function texTu(c) {
    var t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }

  /* quầng sáng tròn cho sprite */
  function texQuang() {
    var c = canvas(128, 128), g = c.getContext('2d');
    var r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.25, 'rgba(255,255,255,.45)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    return texTu(c);
  }

  function quang(tex, mauQ, co) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, color: mauQ, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    s.scale.setScalar(co);
    return s;
  }

  /* ═══════════ vân trận pháp, vẽ bằng canvas ═══════════ */

  /* Một ấn ký hình học, tâm ở gốc toạ độ, cỡ s. Không dùng chữ viết. */
  function veAnKy(g, kieu, s) {
    g.lineWidth = s * 0.14;
    g.beginPath();
    if (kieu === 0) {                       // vòng tròn có chấm giữa
      g.arc(0, 0, s, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(0, 0, s * 0.28, 0, Math.PI * 2); g.fill();
    } else if (kieu === 1) {                // hình thoi lồng hình thoi
      g.moveTo(0, -s); g.lineTo(s * 0.7, 0); g.lineTo(0, s); g.lineTo(-s * 0.7, 0); g.closePath(); g.stroke();
      g.beginPath();
      g.moveTo(0, -s * 0.45); g.lineTo(s * 0.32, 0); g.lineTo(0, s * 0.45); g.lineTo(-s * 0.32, 0); g.closePath(); g.fill();
    } else if (kieu === 2) {                // tam giác có vạch ngang
      g.moveTo(0, -s); g.lineTo(s * 0.9, s * 0.7); g.lineTo(-s * 0.9, s * 0.7); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(-s * 0.45, s * 0.1); g.lineTo(s * 0.45, s * 0.1); g.stroke();
    } else {                                // ba chấm thẳng hàng giữa hai vạch
      for (var k = -1; k <= 1; k++) { g.beginPath(); g.arc(0, k * s * 0.6, s * 0.17, 0, Math.PI * 2); g.fill(); }
      g.beginPath();
      g.moveTo(-s * 0.55, -s); g.lineTo(-s * 0.55, s);
      g.moveTo(s * 0.55, -s); g.lineTo(s * 0.55, s);
      g.stroke();
    }
  }

  /* Ba vòng: ngoài là ấn ký hình học, giữa là bát quái, trong là sao mười
     hai cánh. Vẽ trắng trên nền trong, màu do vật liệu nhuộm. */
  function texTranPhap(kieu) {
    var c = canvas(1024, 1024), g = c.getContext('2d');
    g.translate(512, 512);
    g.strokeStyle = g.fillStyle = '#fff';

    function vong(r, day) { g.lineWidth = day; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke(); }

    if (kieu === 'ngoai') {
      vong(500, 6); vong(478, 2); vong(388, 3); vong(372, 1.5);
      for (var k = 0; k < 72; k++) {
        var a = k / 72 * Math.PI * 2;
        g.lineWidth = k % 6 ? 1.5 : 3;
        g.beginPath();
        g.moveTo(Math.cos(a) * 478, Math.sin(a) * 478);
        g.lineTo(Math.cos(a) * (k % 6 ? 466 : 456), Math.sin(a) * (k % 6 ? 466 : 456));
        g.stroke();
      }
      /* vòng ấn ký hình học: tròn, thoi, tam giác, ba chấm — xen kẽ */
      for (var i = 0; i < 24; i++) {
        g.save();
        g.rotate(i / 24 * Math.PI * 2);
        g.translate(0, -425);
        veAnKy(g, i % 4, 26);
        g.restore();
      }
    } else if (kieu === 'giua') {
      vong(500, 4); vong(452, 2); vong(300, 4);
      /* bát giác */
      g.lineWidth = 2.5;
      g.beginPath();
      for (var j = 0; j <= 8; j++) {
        var a2 = j / 8 * Math.PI * 2 + Math.PI / 8;
        g[j ? 'lineTo' : 'moveTo'](Math.cos(a2) * 300, Math.sin(a2) * 300);
      }
      g.stroke();
      /* tám quẻ: mỗi quẻ ba hào, liền hoặc đứt */
      var QUE = [7, 3, 5, 1, 6, 2, 4, 0];
      for (var q = 0; q < 8; q++) {
        g.save();
        g.rotate(q / 8 * Math.PI * 2);
        for (var h = 0; h < 3; h++) {
          var y = -350 - h * 26, lien = (QUE[q] >> h) & 1;
          g.fillRect(-58, y - 7, lien ? 116 : 50, 14);
          if (!lien) g.fillRect(8, y - 7, 50, 14);
        }
        g.restore();
        g.save();
        g.rotate(q / 8 * Math.PI * 2 + Math.PI / 8);
        g.lineWidth = 2;
        g.beginPath(); g.moveTo(0, -300); g.lineTo(0, -452); g.stroke();
        g.restore();
      }
    } else {
      vong(500, 5); vong(470, 2);
      /* sao mười hai cánh: nối mỗi đỉnh với đỉnh cách nó năm bước */
      g.lineWidth = 3;
      g.beginPath();
      for (var s = 0; s <= 12; s++) {
        var a3 = (s * 5 % 12) / 12 * Math.PI * 2;
        g[s ? 'lineTo' : 'moveTo'](Math.cos(a3) * 470, Math.sin(a3) * 470);
      }
      g.stroke();
      vong(300, 2);
    }
    return texTu(c);
  }

  /* Hoa văn khắc trên mỗi mặt cột vuông: khung chữ nhật, vạch gấp khúc
     hai đầu, giữa là một chuỗi ấn ký hình học. */
  function texKhac() {
    var c = canvas(256, 1024), g = c.getContext('2d');
    g.strokeStyle = g.fillStyle = '#fff';
    g.lineWidth = 6;
    g.strokeRect(18, 18, 220, 988);
    g.lineWidth = 2.5;
    g.strokeRect(34, 34, 188, 956);
    /* dải gấp khúc trên và dưới */
    [70, 954].forEach(function (y) {
      g.beginPath();
      for (var x = 46; x <= 210; x += 20) {
        g.lineTo(x, y - 12); g.lineTo(x + 10, y - 12); g.lineTo(x + 10, y + 12); g.lineTo(x + 20, y + 12);
      }
      g.stroke();
    });
    /* chuỗi ấn ký, nối nhau bằng một đường dọc */
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(128, 120); g.lineTo(128, 904); g.stroke();
    for (var i = 0; i < 6; i++) {
      g.save();
      g.translate(128, 170 + i * 136);
      g.clearRect(-48, -48, 96, 96);
      veAnKy(g, i % 4, 40);
      g.restore();
    }
    return texTu(c);
  }

  /* mặt đá động phủ: loang xám, vài vết nứt */
  function texDa() {
    var c = canvas(1024, 1024), g = c.getContext('2d');
    g.fillStyle = '#8a8690';
    g.fillRect(0, 0, 1024, 1024);
    for (var i = 0; i < 160; i++) {
      var x = Math.random() * 1024, y = Math.random() * 1024, r = 30 + Math.random() * 160;
      var v = g.createRadialGradient(x, y, 0, x, y, r);
      var sang = Math.random() < 0.5;
      v.addColorStop(0, sang ? 'rgba(200,196,206,.35)' : 'rgba(40,36,46,.35)');
      v.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = v;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    g.strokeStyle = 'rgba(30,26,34,.55)';
    for (var k = 0; k < 26; k++) {
      var px = Math.random() * 1024, py = Math.random() * 1024;
      g.lineWidth = 1 + Math.random() * 2;
      g.beginPath(); g.moveTo(px, py);
      for (var s = 0; s < 6; s++) { px += (Math.random() - 0.5) * 90; py += (Math.random() - 0.5) * 90; g.lineTo(px, py); }
      g.stroke();
    }
    var t = texTu(c);
    t.encoding = THREE.sRGBEncoding;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    return t;
  }

  /* biển mây dưới đảo */
  function texMay() {
    var c = canvas(1024, 1024), g = c.getContext('2d');
    for (var i = 0; i < 260; i++) {
      var x = Math.random() * 1024, y = Math.random() * 1024, r = 40 + Math.random() * 150;
      var v = g.createRadialGradient(x, y, 0, x, y, r);
      v.addColorStop(0, 'rgba(255,246,250,.32)');
      v.addColorStop(1, 'rgba(255,240,248,0)');
      g.fillStyle = v;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    var t = texTu(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    return t;
  }

  /* ═══════════ trời: tối om trong động, hoàng hôn đầy sao khi mở ═══════════ */

  var TROI_VS = [
    'varying vec3 vDir;',
    'void main() {',
    '  vDir = position;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var TROI_FS = [
    'uniform float uMo;',
    'uniform float uTime;',
    'varying vec3 vDir;',
    'float hash(vec3 p) {',
    '  p = fract(p * 0.3183099 + 0.1); p *= 17.0;',
    '  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));',
    '}',
    'float sao(vec3 d, float mat, float nguong) {',
    '  vec3 p = d * mat; vec3 i = floor(p); vec3 f = fract(p) - 0.5;',
    '  float r = hash(i);',
    '  float s = step(nguong, r) * smoothstep(0.3, 0.0, length(f));',
    '  return s * (0.55 + 0.45 * sin(uTime * (1.5 + r * 3.0) + r * 90.0));',
    '}',
    'void main() {',
    '  vec3 d = normalize(vDir);',
    '  float h = d.y;',
    '  vec3 dinh  = vec3(0.10, 0.11, 0.30);',
    '  vec3 giua  = vec3(0.42, 0.32, 0.62);',
    '  vec3 chan  = vec3(1.00, 0.74, 0.58);',
    '  vec3 duoi  = vec3(0.86, 0.76, 0.86);',
    '  vec3 c = mix(chan, giua, smoothstep(-0.02, 0.22, h));',
    '  c = mix(c, dinh, smoothstep(0.22, 0.85, h));',
    '  c = mix(c, duoi, smoothstep(0.0, -0.25, h));',
    '  vec3 mt = normalize(vec3(-0.45, 0.10, -0.89));',
    '  float m = max(dot(d, mt), 0.0);',
    '  c += vec3(1.0, 0.78, 0.55) * (pow(m, 90.0) * 1.4 + pow(m, 8.0) * 0.28);',
    '  float dai = smoothstep(0.22, 0.0, abs(h - 0.42 - 0.12 * sin(d.x * 2.6 + d.z * 1.7)));',
    '  c += vec3(0.55, 0.35, 0.75) * dai * 0.18;',
    '  float cao = smoothstep(0.05, 0.4, h);',
    '  c += vec3(1.0, 0.97, 0.9) * (sao(d, 150.0, 0.985) + sao(d, 60.0, 0.993) * 1.4) * cao;',
    '  vec3 dong = vec3(0.03, 0.028, 0.04);',
    '  gl_FragColor = vec4(mix(dong, c, uMo), 1.0);',
    '}'
  ].join('\n');

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    var g = ctx.scene;

    S = {
      pha: 'TICH', canh: 'LUYEN_KHI',
      tuVi: 0, hienThi: 0,
      con: 90, huong: 1, soLuot: 0, nhanTruoc: true,
      t: 0, W: 0, vienMan: false, daNo: false, daChuong: false,
      taKhuynh: 0, huuKhuynh: 0, daTheTa: false, daTheHuu: false,
      phanPhe: 0, loe: 0,
      /* ngoi: false (đang đứng) · 'LEN' (đang nhảy lên bồ đoàn) · true (đang ngồi) */
      ngoi: false, tLen: 0, tacTruoc: 1, quay: 0, hienTS: 0,
      camXa: CAM_XA, phuDe: 0, lech: null,
      goiY: '', nhamId: null, nhamT: 0
    };
    o = {
      nhin: [], tia: new THREE.Raycaster(), diemNhin: new THREE.Vector2(),
      quang: texQuang(), dich: NGUC.clone(),
      tuMat: new THREE.Vector3(), tuYaw: 0, tuPitch: 0, camDich: new THREE.Vector3(),
      tamNhin: TAM_NHIN.clone()
    };

    /* không khí động phủ: tối, sương dày */
    o.mauSuong = [mau(0x16141b), mau(0xa395c0)];
    ctx.moiTruong.suong.color.copy(o.mauSuong[0]);
    ctx.moiTruong.suong.density = 0.07;
    ctx.moiTruong.nen.copy(o.mauSuong[0]);

    o.matDa = new THREE.MeshStandardMaterial({ color: 0x3a3741, roughness: 0.95, flatShading: true });

    dungTroi(g);
    dungDao(g);
    dungTuong(g);
    dungTran(g);
    dungTranPhap(g);
    dungCot(g);
    dungLinhCau(g);
    dungTuSi(g);
    dungLo(g);
    dungCay(g);
    dungDaoNoi(g);
    dungAnhSang(g);
    dungHat(g);

    var P = ctx.player;
    P.bounds = 6.0;
    P.blockers = [{ x: 0, z: 0, r: 1.5 }];
    for (var k = 0; k < 8; k++) {
      var a = k / 8 * Math.PI * 2 + Math.PI / 8;
      P.blockers.push({ x: Math.sin(a) * R_COT, z: Math.cos(a) * R_COT, r: 0.75 });
    }
    LO.forEach(function (l) { P.blockers.push({ x: l[0], z: l[1], r: 0.55 }); });

    dungPanel(ctx);
  }

  function dungTroi(g) {
    o.troiU = { uMo: { value: 0 }, uTime: TX.uTime };
    o.troi = new THREE.Mesh(
      new THREE.SphereGeometry(60, 40, 20),
      new THREE.ShaderMaterial({
        uniforms: o.troiU, vertexShader: TROI_VS, fragmentShader: TROI_FS,
        side: THREE.BackSide, depthWrite: false
      })
    );
    o.troi.renderOrder = -1;
    g.add(o.troi);

    o.matMay = new THREE.MeshBasicMaterial({
      map: texMay(), color: 0xf6e6f0, transparent: true, opacity: 0, depthWrite: false
    });
    var may = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), o.matMay);
    may.rotation.x = -Math.PI / 2;
    may.position.y = -9;
    g.add(may);
    o.may = may;
  }

  /* Đảo nổi: mặt đảo là sàn động phủ, phần đá phía dưới chỉ lộ ra
     khi vách động sụp xuống. */
  function dungDao(g) {
    o.matSan = new THREE.MeshStandardMaterial({ map: texDa(), color: 0x5e5a66, roughness: 0.92 });
    var san = new THREE.Mesh(new THREE.CircleGeometry(R_DAO, 72), o.matSan);
    san.rotation.x = -Math.PI / 2;
    g.add(san);

    var day = new THREE.Mesh(
      goGhe(new THREE.CylinderGeometry(R_DAO, 1.2, 9, 30, 5), 1.1, 4.3),
      o.matDa
    );
    day.position.y = -4.55;
    g.add(day);

    /* viền cỏ ngọc quanh mép đảo, chỉ hiện sau bước nhảy */
    o.matVien = new THREE.MeshStandardMaterial({
      color: 0x5f9a7c, emissive: 0x1e4a38, emissiveIntensity: 0.2,
      roughness: 0.8, transparent: true, opacity: 0
    });
    var vien = new THREE.Mesh(new THREE.RingGeometry(8.2, R_DAO, 72), o.matVien);
    vien.rotation.x = -Math.PI / 2;
    vien.position.y = 0.01;
    g.add(vien);
  }

  /* Vách động: những khối đá chồng lên nhau. Khi đột phá, từng khối
     trượt ra ngoài và rơi xuống vực mây, so le chứ không cùng lúc. */
  function dungTuong(g) {
    o.khoi = [];
    var geo = goGhe(new THREE.IcosahedronGeometry(1, 1), 0.28);
    var COT = 13, HANG = [0.95, 2.55, 4.15];
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (h) {
      for (var c = 0; c < COT; c++) {
        var doc = -TUONG + (c + 0.5) * (2 * TUONG / COT);
        for (var r = 0; r < HANG.length; r++) {
          var m = new THREE.Mesh(geo, o.matDa);
          var x = h[0] ? h[0] * (TUONG + Math.random() * 0.3) : doc;
          var z = h[1] ? h[1] * (TUONG + Math.random() * 0.3) : doc;
          m.position.set(x, HANG[r] + (Math.random() - 0.5) * 0.35, z);
          m.scale.set(0.95 + Math.random() * 0.35, 0.95 + Math.random() * 0.3, 0.9 + Math.random() * 0.3);
          m.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
          m.userData = {
            goc: m.position.clone(), quay: m.rotation.clone(),
            nx: h[0], nz: h[1],
            /* hàng trên đổ trước, rải ngẫu nhiên cho khỏi đều tăm tắp */
            tre: (2 - r) * 0.08 + Math.random() * 0.22,
            xoay: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
          };
          g.add(m);
          o.khoi.push(m);
        }
      }
    });
  }

  /* Trần: các phiến đá có thạch nhũ, bay lên và tách ra khi trời mở. */
  function dungTran(g) {
    o.phien = [];
    var geo = goGhe(new THREE.BoxGeometry(3.4, 0.7, 3.4, 3, 1, 3), 0.35);
    var geoNhu = new THREE.ConeGeometry(0.18, 1, 5);
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        var p = new THREE.Mesh(geo, o.matDa);
        p.position.set((i - 2) * 3.2, 5.55, (j - 2) * 3.2);
        p.rotation.set((Math.random() - 0.5) * 0.12, Math.random() * 3, (Math.random() - 0.5) * 0.12);
        var soNhu = 1 + Math.floor(Math.random() * 3);
        for (var k = 0; k < soNhu; k++) {
          var n = new THREE.Mesh(geoNhu, o.matDa);
          var dai = 0.5 + Math.random() * 1.0;
          n.scale.set(0.8 + Math.random(), dai, 0.8 + Math.random());
          n.rotation.x = Math.PI;
          n.position.set((Math.random() - 0.5) * 2.6, -0.35 - dai / 2, (Math.random() - 0.5) * 2.6);
          p.add(n);
        }
        p.userData = {
          goc: p.position.clone(),
          tre: Math.hypot(i - 2, j - 2) * 0.05 + Math.random() * 0.12,
          xoay: (Math.random() - 0.5) * 2
        };
        g.add(p);
        o.phien.push(p);
      }
    }
  }

  function dungTranPhap(g) {
    o.tran = [];
    [['ngoai', 9.6, 0.012], ['giua', 6.6, 0.016], ['trong', 4.4, 0.02]].forEach(function (d) {
      var mat = new THREE.MeshBasicMaterial({
        map: texTranPhap(d[0]), color: 0x6b5224, transparent: true,
        depthWrite: false, blending: THREE.AdditiveBlending
      });
      var m = new THREE.Mesh(new THREE.PlaneGeometry(d[1], d[1]), mat);
      m.rotation.x = -Math.PI / 2;
      m.position.y = d[2];
      g.add(m);
      o.tran.push(m);
    });
    vungNhin(g, new THREE.CylinderGeometry(4.8, 4.8, 0.05, 32), [0, 0.03, 0], 'tranPhap');
  }

  /* Tám cột đá vuông vức: đế, thân, mũ cột. Bốn mặt thân khắc hoa văn
     hình học, sáng lên lần lượt khi tu vi tăng. */
  function dungCot(g) {
    o.cot = [];
    var matCot = new THREE.MeshStandardMaterial({ color: 0x4a4652, roughness: 0.85 });
    var geoDe   = new THREE.BoxGeometry(1.0, 0.3, 1.0);
    var geoThan = new THREE.BoxGeometry(0.66, 3.2, 0.66);
    var geoMu   = new THREE.BoxGeometry(0.92, 0.22, 0.92);
    var geoDinh = new THREE.BoxGeometry(0.8, 0.12, 0.8);
    var geoMat  = new THREE.PlaneGeometry(0.56, 2.5);
    var geoTinh = new THREE.OctahedronGeometry(0.2, 0);
    var tex = texKhac();

    for (var k = 0; k < 8; k++) {
      var a = k / 8 * Math.PI * 2 + Math.PI / 8;
      var x = Math.sin(a) * R_COT, z = Math.cos(a) * R_COT;
      var cot = new THREE.Group();
      cot.position.set(x, 0, z);
      cot.rotation.y = a;
      g.add(cot);

      [[geoDe, 0.15], [geoThan, 1.9], [geoMu, 3.61], [geoDinh, 3.78]].forEach(function (d) {
        var m = new THREE.Mesh(d[0], matCot);
        m.position.y = d[1];
        cot.add(m);
      });

      var matKhac = new THREE.MeshBasicMaterial({
        map: tex, color: 0x3a2f20, transparent: true,
        depthWrite: false, blending: THREE.AdditiveBlending
      });
      for (var f = 0; f < 4; f++) {
        var mat = new THREE.Mesh(geoMat, matKhac);
        var b = f / 4 * Math.PI * 2;
        mat.position.set(Math.sin(b) * 0.333, 1.9, Math.cos(b) * 0.333);
        mat.rotation.y = b;
        cot.add(mat);
      }

      /* tinh thể đá phát sáng — chỉ có ở cảnh giới mới */
      var tinh = new THREE.Mesh(geoTinh, new THREE.MeshStandardMaterial({
        color: 0xfff1c8, emissive: 0xffc970, emissiveIntensity: 1.2, flatShading: true
      }));
      tinh.position.set(x, 4.3, z);
      tinh.scale.setScalar(0.001);
      g.add(tinh);

      o.cot.push({ mat: matKhac, sang: 0, tinh: tinh, pha: Math.random() * 6 });
      vungNhin(g, new THREE.BoxGeometry(0.9, 3.8, 0.9), [x, 1.9, z], 'cot');
    }
  }

  /* Bệ thấp bát giác giữa trận pháp, trên là bồ đoàn. Kèm mảnh vỡ và tiên tinh
     dùng cho bước nhảy. */
  function dungLinhCau(g) {
    var be = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 0.3, 8), o.matDa);
    be.position.y = 0.15;
    g.add(be);
    var vienVang = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.03, 8, 8), TX.vatLieuVang());
    vienVang.rotation.x = Math.PI / 2;
    vienVang.rotation.z = Math.PI / 8;
    vienVang.position.y = 0.3;
    g.add(vienVang);

    /* bồ đoàn: đệm cói tròn, mặt trên đan xoắn ốc */
    var c = canvas(256, 256), cg = c.getContext('2d');
    cg.fillStyle = '#b48a46';
    cg.fillRect(0, 0, 256, 256);
    cg.strokeStyle = 'rgba(90,60,25,.55)';
    cg.lineWidth = 3;
    cg.beginPath();
    for (var a = 0; a < Math.PI * 2 * 9; a += 0.05) {
      var r = a / (Math.PI * 2 * 9) * 124;
      cg.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r);
    }
    cg.stroke();
    var texCoi = texTu(c);
    texCoi.encoding = THREE.sRGBEncoding;
    var matCoi = new THREE.MeshStandardMaterial({ color: 0xc8a060, roughness: 0.9 });
    var matMatCoi = new THREE.MeshStandardMaterial({ map: texCoi, roughness: 0.9 });
    o.boDoan = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.47, 0.16, 32),
      [matCoi, matMatCoi, matCoi]);
    o.boDoan.position.y = 0.38;
    g.add(o.boDoan);
    var gioVien = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.045, 8, 40), matCoi);
    gioVien.rotation.x = Math.PI / 2;
    gioVien.position.y = 0.46;
    g.add(gioVien);

    /* vòng sáng dưới chân bồ đoàn: gọi người chơi lại gần */
    o.matMoi = new THREE.MeshBasicMaterial({
      color: 0xffc870, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var moi = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.68, 48), o.matMoi);
    moi.rotation.x = -Math.PI / 2;
    moi.position.y = 0.31;
    g.add(moi);
    vungNhin(g, new THREE.CylinderGeometry(0.6, 0.6, 0.4, 12), [0, 0.4, 0], function () {
      return S.ngoi ? null : 'boDoan';
    });

    /* mảnh vỡ */
    o.manh = [];
    o.matManh = new THREE.MeshBasicMaterial({ color: 0xd8f6ff, transparent: true, opacity: 1 });
    var geoManh = new THREE.TetrahedronGeometry(0.1, 0);
    for (var i = 0; i < 46; i++) {
      var m = new THREE.Mesh(geoManh, o.matManh);
      m.visible = false;
      m.userData.v = new THREE.Vector3();
      g.add(m);
      o.manh.push(m);
    }

    /* tiên tinh: thứ quả cầu khí trong tay trở thành sau bước nhảy */
    o.tinh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.34, 0),
      new THREE.MeshStandardMaterial({
        color: 0xfff6dc, emissive: 0xffd27a, emissiveIntensity: 1.4,
        roughness: 0.2, flatShading: true
      })
    );
    o.tinh.position.copy(NGUC);
    o.tinh.scale.setScalar(0.001);
    g.add(o.tinh);
    o.quangTinh = quang(o.quang, 0xffd690, 0.001);
    g.add(o.quangTinh);

    o.vungTinh = vungNhin(g, new THREE.SphereGeometry(0.7, 12, 8), [NGUC.x, NGUC.y, NGUC.z], function () {
      return S.W > 0.6 ? 'tienTinh' : null;
    });
  }

  /* Tu sĩ ngồi kiết già trên bồ đoàn, mặt quay ra phía cửa vào (+z).
     Dáng kiếm tu: áo trắng tay rộng lót lam, đai lam bản to thả hai dải
     dài, tóc buộc cao có băng trán, kiếm đeo chéo sau lưng — chuôi nhô
     qua vai phải. Hai tay nâng một quả cầu khí trước đan điền.
     Dựng bằng khối cơ bản; chỉ hiện khi người chơi đã nhảy lên ngồi. */
  function dungTuSi(g) {
    var ts = new THREE.Group();
    ts.position.y = GHE_Y;
    ts.visible = false;
    g.add(ts);
    o.tuSi = ts;
    o.bay = [];                         // dải vải bay phấp phới theo luồng khí

    o.matAo = new THREE.MeshStandardMaterial({
      color: 0xf2f0ea, roughness: 0.75, emissive: 0x4fc3ff, emissiveIntensity: 0,
      side: THREE.DoubleSide
    });
    var matLot   = new THREE.MeshStandardMaterial({ color: 0x8db3e6, roughness: 0.7 });
    var matLotTr = new THREE.MeshStandardMaterial({ color: 0x8db3e6, roughness: 0.7, side: THREE.BackSide });
    var matDai   = new THREE.MeshStandardMaterial({ color: 0x35609f, roughness: 0.5, metalness: 0.2, side: THREE.DoubleSide });
    var matBang  = new THREE.MeshStandardMaterial({ color: 0xf6f4ef, roughness: 0.6, side: THREE.DoubleSide });
    var matDa    = new THREE.MeshStandardMaterial({ color: 0xf0d2b8, roughness: 0.65 });
    var matToc   = new THREE.MeshStandardMaterial({ color: 0x17121a, roughness: 0.45 });
    var matMat   = new THREE.MeshBasicMaterial({ color: 0x2a1c18 });
    var matBac   = new THREE.MeshStandardMaterial({ color: 0xc9d3e0, roughness: 0.3, metalness: 0.85 });
    var matVo    = new THREE.MeshStandardMaterial({ color: 0x1d2944, roughness: 0.45, metalness: 0.3 });
    var cau = new THREE.SphereGeometry(1, 24, 16);
    var TRUC_Y = new THREE.Vector3(0, 1, 0);

    function khoi(geo, mat, p, sc, rot, cha) {
      var m = new THREE.Mesh(geo, mat);
      m.position.set(p[0], p[1], p[2]);
      if (sc) m.scale.set(sc[0], sc[1], sc[2]);
      if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
      (cha || ts).add(m);
      return m;
    }

    /* ống thuôn nối hai điểm — tay, lọn tóc, đuôi tóc */
    function ong(a, b, r0, r1, mat, cha) {
      var A = new THREE.Vector3().fromArray(a), d = new THREE.Vector3().fromArray(b).sub(A);
      var m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, d.length(), 12), mat);
      m.position.copy(A).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(TRUC_Y, d.normalize());
      (cha || ts).add(m);
      return m;
    }

    function tien(diem, doan, mat, ngang) {
      var geo = new THREE.LatheGeometry(diem.map(function (d) { return new THREE.Vector2(d[0], d[1]); }), doan);
      var m = new THREE.Mesh(geo, mat);
      if (ngang) m.scale.set(1, 1, ngang);
      ts.add(m);
      return m;
    }

    /* dải vải: mặt phẳng treo từ mép trên, uốn từng đỉnh mỗi khung hình */
    function dai(L, w, mat, p, rx, rz, cha) {
      var geo = new THREE.PlaneGeometry(w, L, 1, 10);
      geo.translate(0, -L / 2, 0);
      var m = new THREE.Mesh(geo, mat);
      m.position.set(p[0], p[1], p[2]);
      m.rotation.set(rx, 0, rz);
      (cha || ts).add(m);
      o.bay.push({ geo: geo, goc: Float32Array.from(geo.attributes.position.array), L: L, pha: Math.random() * 6 });
    }

    /* --- vạt áo phủ lên hai chân xếp bằng --- */
    tien([[0.16, 0.3], [0.24, 0.22], [0.38, 0.12], [0.5, 0.04], [0.53, 0]], 32, o.matAo, 0.82).position.z = 0.04;
    khoi(new THREE.TorusGeometry(0.53, 0.016, 6, 48), matDai, [0, 0.004, 0.04], [1, 0.82, 1], [Math.PI / 2, 0, 0]);
    [-1, 1].forEach(function (s) {
      khoi(cau, o.matAo, [s * 0.27, 0.09, 0.17], [0.2, 0.1, 0.13], [0, -s * 0.6, 0]);
    });
    khoi(cau, o.matAo, [0, 0.07, 0.27], [0.28, 0.07, 0.09]);

    /* --- thân trên: eo thon, ngực, vai --- */
    tien([[0.17, 0.24], [0.155, 0.32], [0.165, 0.42], [0.185, 0.52], [0.18, 0.6],
          [0.15, 0.655], [0.08, 0.69], [0.045, 0.71]], 28, o.matAo, 0.72);
    /* cổ áo giao lĩnh: lớp trong màu lam */
    [-1, 1].forEach(function (s) {
      khoi(new THREE.BoxGeometry(0.034, 0.2, 0.01), matLot, [s * 0.045, 0.6, 0.128], null, [-0.25, 0, -s * 0.45]);
    });

    /* --- đai lưng lam bản to, nút thắt và hai dải dài --- */
    khoi(new THREE.CylinderGeometry(0.172, 0.168, 0.1, 28, 1, true), matDai, [0, 0.33, 0], [1, 1, 0.73]);
    khoi(new THREE.BoxGeometry(0.07, 0.06, 0.03), matDai, [0, 0.33, 0.125]);
    dai(0.6, 0.036, matDai, [-0.02, 0.31, 0.135], -1.05, 0.08);
    dai(0.52, 0.03, matDai, [0.025, 0.31, 0.135], -1.15, -0.1);

    /* --- hai tay: nâng quả cầu khí trước đan điền --- */
    [-1, 1].forEach(function (s) {
      var vai = [s * 0.17, 0.62, -0.01], khuyu = [s * 0.27, 0.42, 0.06], co = [s * 0.1, 0.37, 0.2];
      ong(vai, khuyu, 0.062, 0.055, o.matAo);
      ong(khuyu, co, 0.045, 0.035, matLot);
      khoi(cau, matDa, [s * 0.065, 0.375, 0.225], [0.04, 0.05, 0.035], [0, 0, s * 0.4]);

      /* tay áo rộng rủ xuống từ khuỷu, mặt trong lót lam */
      var huong = new THREE.Vector3(s * 0.1, -1, 0.18).normalize();
      var geoTay = new THREE.CylinderGeometry(0.06, 0.17, 0.34, 18, 1, true);
      geoTay.scale(0.55, 1, 1);            // dẹt sang hai bên cho giống vải rủ, không thành ống
      var tam = new THREE.Vector3().fromArray(khuyu).addScaledVector(huong, 0.17);
      [o.matAo, matLotTr].forEach(function (mat, k) {
        var m = new THREE.Mesh(geoTay, mat);
        m.position.copy(tam);
        m.quaternion.setFromUnitVectors(TRUC_Y, huong.clone().negate());
        if (k) m.scale.setScalar(0.96);
        ts.add(m);
      });
    });

    /* quả cầu khí giữa hai bàn tay — sáng dần theo tu vi */
    o.matCauTay = new THREE.MeshBasicMaterial({ color: 0xcff6ff, transparent: true, opacity: 0.85 });
    o.cauTay = khoi(new THREE.SphereGeometry(0.05, 20, 14), o.matCauTay, [0, 0.43, 0.24]);
    o.quangTay = quang(o.quang, 0x8fdcff, 0.3);
    o.quangTay.position.set(0, 0.43, 0.24);
    ts.add(o.quangTay);

    /* --- đầu --- */
    ong([0, 0.66, 0], [0, 0.77, 0.01], 0.045, 0.04, matDa);
    khoi(cau, matDa, [0, 0.86, 0.015], [0.092, 0.115, 0.1]);
    [-1, 1].forEach(function (s) {
      khoi(new THREE.BoxGeometry(0.03, 0.005, 0.005), matMat, [s * 0.034, 0.868, 0.108], null, [0, 0, s * 0.12]); // mắt nhắm
      ong([s * 0.075, 0.93, 0.06], [s * 0.098, 0.74, 0.07], 0.018, 0.005, matToc);   // tóc mai
    });
    khoi(new THREE.SphereGeometry(0.105, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6),
      matToc, [0, 0.875, -0.005], [1, 1.05, 1.08], [-0.35, 0, 0]);
    khoi(cau, matToc, [0, 0.82, -0.05], [0.095, 0.1, 0.07]);

    /* băng trán trắng, nạm bạc, hai đuôi băng bay sau gáy */
    khoi(new THREE.TorusGeometry(0.104, 0.008, 6, 36), matBang, [0, 0.905, 0.005], [1, 1, 1.06], [Math.PI / 2 - 0.3, 0, 0]);
    khoi(new THREE.BoxGeometry(0.026, 0.016, 0.008), matBac, [0, 0.912, 0.108]);
    dai(0.46, 0.024, matBang, [-0.014, 0.9, -0.1], 0.5, 0.15);
    dai(0.4, 0.022, matBang, [0.014, 0.9, -0.1], 0.55, -0.12);

    /* tóc buộc cao: dây buộc trắng, đuôi tóc thuôn rủ sau lưng */
    o.duoi = new THREE.Group();
    o.duoi.position.set(0, 0.985, -0.035);
    ts.add(o.duoi);
    khoi(new THREE.CylinderGeometry(0.026, 0.026, 0.035, 12), matBang, [0, 0, 0], null, [0.5, 0, 0], o.duoi);
    var DUOI = [[0, 0.01, 0], [0, 0.02, -0.08], [0, -0.05, -0.15], [0, -0.18, -0.19], [0, -0.36, -0.19], [0, -0.5, -0.16]];
    for (var k = 0; k < DUOI.length - 1; k++) {
      ong(DUOI[k], DUOI[k + 1], 0.036 - k * 0.006, 0.032 - k * 0.006, matToc, o.duoi);
    }

    /* --- kiếm đeo chéo sau lưng, chuôi nhô qua vai phải --- */
    var kiem = new THREE.Group();
    kiem.position.set(0, 0.5, -0.2);
    kiem.rotation.set(-0.1, 0, 0.55);
    ts.add(kiem);
    khoi(new THREE.CylinderGeometry(0.026, 0.021, 0.78, 8), matVo, [0, -0.12, 0], [1, 1, 0.45], null, kiem);   // vỏ
    [0.24, -0.1].forEach(function (y) {
      khoi(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 8), matBac, [0, y, 0], [1, 1, 0.5], null, kiem);     // đai bạc
    });
    khoi(new THREE.ConeGeometry(0.024, 0.06, 8), matBac, [0, -0.53, 0], [1, 1, 0.5], [Math.PI, 0, 0], kiem); // mũi vỏ
    khoi(new THREE.BoxGeometry(0.11, 0.024, 0.034), matBac, [0, 0.3, 0], null, null, kiem);                   // chắn tay
    [-1, 1].forEach(function (s) {
      khoi(new THREE.TorusGeometry(0.02, 0.007, 6, 16), matBac, [s * 0.058, 0.31, 0], null, null, kiem);     // hoa văn mây
    });
    khoi(new THREE.CylinderGeometry(0.018, 0.02, 0.2, 10), matLot, [0, 0.41, 0], null, null, kiem);          // chuôi
    [0.35, 0.47].forEach(function (y) {
      khoi(new THREE.CylinderGeometry(0.022, 0.022, 0.014, 10), matBac, [0, y, 0], null, null, kiem);
    });
    khoi(new THREE.BoxGeometry(0.04, 0.04, 0.024), matBac, [0, 0.53, 0], null, [0, 0, Math.PI / 4], kiem);   // núm chuôi
    dai(0.2, 0.016, matDai, [0, 0.52, 0], 0, 0.3, kiem);                                                       // tua kiếm

    vungNhin(g, new THREE.CylinderGeometry(0.5, 0.5, 1.1, 10), [0, GHE_Y + 0.5, 0], function () {
      return S.ngoi === true && S.canh === 'LUYEN_KHI' ? 'tuSi' : null;
    });
  }

  /* Gió khí: dải đai, băng trán, tua kiếm bay; đuôi tóc đung đưa.
     Tu vi càng cao, gió càng mạnh và nhanh. Quả cầu giữa tay sáng dần. */
  function capNhatTuSi(t, muc, dung) {
    if (!o.tuSi.visible || dung) return;
    var gio = 0.15 + muc * 0.85;
    var bien = 0.02 + gio * 0.11, tan = 1.6 + gio * 6;
    o.bay.forEach(function (b) {
      var arr = b.geo.attributes.position.array, goc = b.goc;
      for (var i = 0; i < arr.length; i += 3) {
        var k = Math.min(1, -goc[i + 1] / b.L), kk = k * k;
        var a = t * tan + k * 4 + b.pha;
        arr[i]     = goc[i] + Math.sin(a) * bien * kk;
        arr[i + 2] = goc[i + 2] + (Math.cos(a * 0.8) * 0.6 - 0.4) * bien * kk;
      }
      b.geo.attributes.position.needsUpdate = true;
    });
    o.duoi.rotation.x = Math.sin(t * 1.7) * 0.05 * gio - gio * 0.12;
    o.duoi.rotation.z = Math.sin(t * 2.3 + 1) * 0.1 * gio;

    /* vừa vỡ ở bước nhảy; tới tiên cảnh thì tụ lại, sắc vàng của cảnh giới mới */
    var co = !S.daNo || S.W > 0.6;
    o.cauTay.visible = o.quangTay.visible = co;
    if (S.daNo) {
      o.matCauTay.color.setHex(0xfff0c8);
      o.quangTay.material.color.setHex(0xffd690);
    }
    var nhip = 1 + Math.sin(t * (3 + muc * 6)) * 0.08;
    o.cauTay.scale.setScalar((0.6 + muc * 0.9) * nhip);
    o.quangTay.scale.setScalar((0.2 + muc * 0.7) * nhip);
    o.quangTay.material.opacity = 0.35 + muc * 0.6;
  }

  function dungLo(g) {
    o.lo = [];
    var matDong = new THREE.MeshStandardMaterial({ color: 0x6a4a2a, roughness: 0.5, metalness: 0.6 });
    var geoChau = new THREE.CylinderGeometry(0.36, 0.2, 0.32, 10, 1, true);
    var geoChan = new THREE.CylinderGeometry(0.035, 0.05, 0.8, 5);
    LO.forEach(function (l) {
      var chau = new THREE.Mesh(geoChau, matDong);
      chau.position.set(l[0], 0.98, l[1]);
      g.add(chau);
      for (var k = 0; k < 3; k++) {
        var a = k / 3 * Math.PI * 2;
        var c = new THREE.Mesh(geoChan, matDong);
        c.position.set(l[0] + Math.cos(a) * 0.2, 0.4, l[1] + Math.sin(a) * 0.2);
        c.rotation.set(Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25);
        g.add(c);
      }
      var den = new THREE.PointLight(0xff8a3c, 1.1, 8, 2);
      den.position.set(l[0], 1.4, l[1]);
      g.add(den);
      o.lo.push({ den: den, x: l[0], z: l[1] });
    });
  }

  /* Cây tiên mọc sau lưng tu sĩ; tiên tinh bay lên nằm giữa tán. */
  function dungCay(g) {
    o.cay = new THREE.Group();
    o.cay.position.set(0, 0.02, CAY_Z);
    o.cay.visible = false;
    g.add(o.cay);

    var matVo = new THREE.MeshStandardMaterial({
      color: 0x4e3a2e, roughness: 0.85, emissive: 0x2a1608, emissiveIntensity: 0.25
    });
    o.than = new THREE.Group();
    o.cay.add(o.than);

    function canh(diem, ban) {
      var cong = new THREE.CatmullRomCurve3(diem.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); }));
      o.than.add(new THREE.Mesh(new THREE.TubeGeometry(cong, 32, ban, 7, false), matVo));
    }
    canh([[0, -0.1, 0], [0.14, 0.8, 0.06], [-0.1, 1.6, -0.08], [0.06, 2.4, 0.06], [0, 3.0, 0]], 0.17);
    for (var k = 0; k < 6; k++) {
      var a = k / 6 * Math.PI * 2 + 0.3, y0 = 2.0 + (k % 3) * 0.3;
      canh([[0, y0, 0], [Math.cos(a) * 0.6, y0 + 0.45, Math.sin(a) * 0.6], [Math.cos(a) * 1.3, y0 + 0.75, Math.sin(a) * 1.3]], 0.06);
    }
    for (var r = 0; r < 5; r++) {
      var b = r / 5 * Math.PI * 2;
      canh([[0, 0.3, 0], [Math.cos(b) * 0.4, 0.06, Math.sin(b) * 0.4], [Math.cos(b) * 0.8, -0.02, Math.sin(b) * 0.8]], 0.07);
    }

    /* tán hoa: một đàn chấm sáng trong khối bầu dục */
    o.tan = new THREE.Group();
    o.tan.position.y = 3.2;
    o.cay.add(o.tan);
    TX.domSang(o.tan, {
      soLuong: 720,
      viTri: function () {
        var u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1), r = Math.cbrt(Math.random());
        return [Math.sin(v) * Math.cos(u) * 2.1 * r, Math.cos(v) * 0.85 * r, Math.sin(v) * Math.sin(u) * 2.1 * r];
      },
      mau: [0xffd6e8, 0xfff3d6, 0xffc0da, 0xf6e7a8, 0xd8f0ff],
      co: [20, 44], doMo: 1, troi: 0.12
    });

    vungNhin(g, new THREE.CylinderGeometry(1.9, 1.9, 4.4, 12), [0, 2.3, CAY_Z], function () {
      return S.W > 0.6 ? 'cay' : null;
    });
  }

  /* Những đảo nhỏ trôi ngoài xa, một ngôi lầu trên đảo lớn nhất. */
  function dungDaoNoi(g) {
    o.daoNoi = [];
    var matCo = new THREE.MeshStandardMaterial({ color: 0x8fc7a8, roughness: 0.85, flatShading: true });
    var matCay = new THREE.MeshStandardMaterial({ color: 0xf2b8d0, emissive: 0x8a3a5a, emissiveIntensity: 0.25, flatShading: true });
    var DS = [
      [0.35, 30, 3.0, 4.2, true],
      [-0.55, 20, 5.5, 1.6], [0.9, 26, -1.0, 2.4], [1.9, 22, 7.0, 1.3],
      [2.6, 28, 1.5, 2.0], [-1.6, 21, 6.0, 1.5], [-2.4, 27, -2.0, 2.2], [-1.0, 17, 8.5, 1.0]
    ];
    DS.forEach(function (d) {
      var gr = new THREE.Group();
      var r = d[3];
      var mat = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.9, 0.4, 10), matCo);
      gr.add(mat);
      var day = new THREE.Mesh(goGhe(new THREE.ConeGeometry(r * 0.92, r * 1.8, 9, 3), r * 0.25), o.matDa);
      day.rotation.x = Math.PI;
      day.position.y = -0.2 - r * 0.9;
      gr.add(day);
      if (d[4]) gr.add(dungLau());
      else {
        for (var k = 0; k < 2; k++) {
          var c = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.28, 0), matCay);
          c.position.set((Math.random() - 0.5) * r, 0.4 + r * 0.2, (Math.random() - 0.5) * r);
          gr.add(c);
        }
      }
      var y = d[2];
      gr.position.set(Math.sin(d[0] + Math.PI) * d[1], y - 30, Math.cos(d[0] + Math.PI) * d[1]);
      gr.userData = { y: y, pha: Math.random() * 6, tre: Math.random() * 0.25 };
      g.add(gr);
      o.daoNoi.push(gr);
    });
  }

  function dungLau() {
    var lau = new THREE.Group();
    var matTuong = new THREE.MeshStandardMaterial({ color: 0x8a2f26, emissive: 0x3a0e08, emissiveIntensity: 0.5, roughness: 0.7 });
    var matMai = new THREE.MeshStandardMaterial({ color: 0x2f4f52, roughness: 0.6 });
    var matDen = new THREE.MeshBasicMaterial({ color: 0xffc77a });
    var y = 0.2;
    for (var t = 0; t < 3; t++) {
      var w = 2.2 - t * 0.55, h = 1.05;
      var than = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), matTuong);
      than.position.y = y + h / 2;
      lau.add(than);
      var cuaSo = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.5, h * 0.45), matDen);
      cuaSo.position.set(0, y + h * 0.5, w / 2 + 0.01);
      lau.add(cuaSo);
      var mai = new THREE.Mesh(new THREE.ConeGeometry(w * 0.95, 0.75, 4, 1), matMai);
      mai.rotation.y = Math.PI / 4;
      mai.position.y = y + h + 0.3;
      lau.add(mai);
      y += h + 0.45;
    }
    var chop = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 6), TX.vatLieuVang());
    chop.position.y = y + 0.2;
    lau.add(chop);
    lau.rotation.y = 0.5;
    return lau;
  }

  function dungAnhSang(g) {
    o.hemi = new THREE.HemisphereLight(0x8a8296, 0x1c1820, 0.34);
    g.add(o.hemi);
    g.add(new THREE.AmbientLight(0x2c2832, 0.3));

    o.denCau = new THREE.PointLight(0x8fdcff, 0.6, 10, 2);
    o.denCau.position.copy(NGUC);
    g.add(o.denCau);

    o.denTroi = new THREE.DirectionalLight(0xffc49a, 0);
    o.denTroi.position.set(-12, 7, -22);
    g.add(o.denTroi);

    o.mauHemi = [[mau(0x8a8296), mau(0xe8e4ff)], [mau(0x1c1820), mau(0x7a6890)]];
    o.mauSan  = [mau(0x5e5a66), mau(0xc9d4cf)];
  }

  function dungHat(g) {
    o.khi  = TX.heHat(g, 340, 0xa8ecff, 0.07, 0.9);   // linh khí hội tụ
    o.no   = TX.heHat(g, 380, 0xe9fbff, 0.1, 1.0);    // linh khí bùng ra
    o.lua  = TX.heHat(g, 140, 0xff9a4a, 0.09, 0.85);  // lửa lò
    o.dong = TX.heHat(g, 260, 0xd8f2ff, 0.08, 0);     // dòng linh khí quấn quanh cây

    o.dongTs = [];
    for (var i = 0; i < o.dong.count; i++) {
      o.dongTs.push([Math.random() * Math.PI * 2, Math.random(), 0.7 + Math.random() * 0.6]);
    }

    /* khí quanh tu sĩ: chia thành năm dải, mỗi dải là một chùm hạt
       xoắn ốc từ chân lên đầu, nên khi quay trông như những vệt khí */
    o.vong = TX.heHat(g, 420, 0xa8ecff, 0.075, 0.9);
    o.vongTs = [];
    for (var j = 0; j < o.vong.count; j++) {
      o.vongTs.push([
        (j % 5) / 5 * Math.PI * 2 + (Math.random() - 0.5) * 0.7,
        Math.random(),
        0.75 + Math.random() * 0.5,
        0.85 + Math.random() * 0.3
      ]);
    }
  }

  /* Vùng nhìn vô hình để bắn tia chú giải. id có thể là hàm, trả null
     nếu lúc đó vật chưa có nghĩa gì để giải thích. */
  function vungNhin(g, geo, pos, id) {
    var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
    m.visible = false;              // r128: tia vẫn trúng vật ẩn
    m.position.set(pos[0], pos[1], pos[2]);
    m.userData.nhin = id;
    g.add(m);
    o.nhin.push(m);
    return m;
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function dungPanel(ctx) {
    var N = ctx.text.nhan;
    ctx.hud.datPanel(
      '<div class="readout">' +
        '<div class="temp"><b id="lcT">0</b><span id="lcCap">/100</span></div>' +
        '<div class="phase"><div class="lbl">' + N.canhGioi + '</div>' +
          '<div class="val" id="lcP"></div></div>' +
      '</div>' +
      '<div id="lcTich">' +
        '<div class="scale">' +
          '<div class="band" id="lcBand"></div>' +
          '<div class="fill" id="lcFill"></div>' +
          '<div class="cursor" id="lcCur"></div>' +
        '</div>' +
        '<div class="ticks">' +
          '<span class="bandlabel" id="lcBL">' + N.do + '</span>' +
          '<i id="lcTkCu"><b>100</b>' + N.nutCu + '</i>' +
          '<i id="lcTkNut"><b id="lcNutSo">100</b>' + N.diemNut + '</i>' +
        '</div>' +
        '<div class="lc-dau" id="lcDau"></div>' +
      '</div>' +
      '<div class="lc-dot" id="lcDot">' +
        '<div class="lc-dot-k">' + N.dotPha + '</div>' +
        '<div class="lc-thoi">' +
          '<div class="vung som"></div><div class="vung trung"></div><div class="vung muon"></div>' +
          '<div class="nut"></div>' +
          '<div class="con" id="lcCon"></div>' +
        '</div>' +
        '<div class="lc-thoi-nhan">' +
          '<i style="left:0;transform:none"><b>90</b></i>' +
          '<i style="left:17.5%">' + N.chuaDu + '</i>' +
          '<i style="left:50%"><b>100</b>' + N.diemNut + '</i>' +
          '<i style="left:82.5%">' + N.loThoiCo + '</i>' +
          '<i style="right:0;left:auto;transform:none"><b>110</b></i>' +
        '</div>' +
        '<div class="lc-dot-g">' + N.nhanDung + '</div>' +
      '</div>'
    );

    el = {
      t: document.getElementById('lcT'),
      cap: document.getElementById('lcCap'),
      p: document.getElementById('lcP'),
      tich: document.getElementById('lcTich'),
      band: document.getElementById('lcBand'),
      fill: document.getElementById('lcFill'),
      cur: document.getElementById('lcCur'),
      bl: document.getElementById('lcBL'),
      tkCu: document.getElementById('lcTkCu'),
      tkNut: document.getElementById('lcTkNut'),
      nutSo: document.getElementById('lcNutSo'),
      dau: document.getElementById('lcDau'),
      dot: document.getElementById('lcDot'),
      con: document.getElementById('lcCon')
    };
    datThang(ctx);
  }

  /* Vẽ lại thang đo theo cảnh giới: mỗi chất có độ và điểm nút của nó. */
  function datThang(ctx) {
    var cap = GIOI_HAN[S.canh];
    var nut = pct(cap);
    el.band.style.left = '0%';
    el.band.style.width = nut + '%';
    el.tkNut.style.left = nut + '%';
    el.nutSo.textContent = cap;
    el.bl.style.left = (nut / 2) + '%';
    el.cap.textContent = '/' + cap;
    el.p.textContent = ctx.text.canhGioi[S.canh];
    el.tkCu.style.display = S.canh === 'TRUC_CO' ? '' : 'none';
    el.tkCu.style.left = pct(100) + '%';
  }

  function pct(v) { return v / (GIOI_HAN[S.canh] * 1.15) * 100; }

  /* ═══════════ logic ═══════════ */

  function tichLuy(dt) {
    S.tuVi = Math.min(GIOI_HAN[S.canh], S.tuVi + TOC_DO[S.canh] * dt);
  }

  function batDauDot(ctx) {
    S.pha = 'DOT';
    S.tuVi = NGUONG_DOT;
    S.con = 90; S.huong = 1; S.soLuot = 0;
    S.nhanTruoc = true;         // đang giữ chuột từ lúc vận công thì phải nhả ra đã
    ctx.audio.diemNut();
  }

  function capNhatDot(dt, ctx, trongTam) {
    var P = ctx.player;
    var nhan = trongTam && P.enabled &&
               (P.action() > 0 || P.key('Enter') || P.key('NumpadEnter'));
    if (nhan && !S.nhanTruoc) { S.nhanTruoc = true; phanXu(ctx); return; }
    S.nhanTruoc = nhan;

    if (!trongTam) return;      // đứng dậy khỏi bồ đoàn thì thời gian đứng lại

    S.con += S.huong * TOC_CON * dt;
    if (S.con >= 110) {
      S.con = 110; S.huong = -1;
      if (++S.soLuot >= SO_LUOT) thatBai('HUU', ctx);
    } else if (S.con <= 90) {
      S.con = 90; S.huong = 1;
    }
  }

  function phanXu(ctx) {
    if (S.con < VUNG[0]) thatBai('TA', ctx);
    else if (S.con > VUNG[1]) thatBai('HUU', ctx);
    else dotPha(ctx, Math.abs(S.con - 100) <= VIEN_MAN);
  }

  function thatBai(kieu, ctx) {
    var N = ctx.text.nhan, ta = kieu === 'TA';
    S.pha = 'TICH';
    S.tuVi = ta ? SAU_TA : SAU_HUU;
    if (ta) S.taKhuynh++; else S.huuKhuynh++;
    S.phanPhe = 1;

    ctx.hud.buocNhay(ta ? N.taKhuynhPhu : N.huuKhuynhPhu, ta ? N.taKhuynh : N.huuKhuynh);
    amHong(ta);
    banHat(ta ? 0xff7a5a : 0x9aa6c8, 160, 3.2, NGUC.y);

    var lan = ta ? !S.daTheTa : !S.daTheHuu;
    if (!lan) return;
    if (ta) S.daTheTa = true; else S.daTheHuu = true;
    var phien = S;
    setTimeout(function () {
      if (S !== phien) return;
      var B = ctx.text[ta ? 'taKhuynh' : 'huuKhuynh'];
      ctx.hud.the(
        '<div class="eyebrow">' + B.nhan + '</div>' +
        '<h1>' + B.tieuDe + '</h1>' +
        '<p>' + B.than + '</p>',
        TX.VI.game.troLai,
        function () { ctx.player.grab(); }
      );
    }, 1300);
  }

  function dotPha(ctx, vienMan) {
    S.pha = 'NHAY';
    S.t = 0;
    S.vienMan = vienMan;
    S.tuVi = 100;
    amTat();
  }

  function capNhatNhay(dt, ctx) {
    S.t += dt;
    if (!S.daNo && S.t >= T_NO) { S.daNo = true; no(ctx); }
    if (S.daNo) S.W = Math.min(1, (S.t - T_NO - 0.15) / T_BIEN);
    if (!S.daChuong && S.t >= T_NO + 0.9) { S.daChuong = true; amChuong(); }

    if (S.t >= T_NO + T_BIEN + 0.5) {
      S.W = 1;
      S.pha = 'TRUC';
      var phien = S;
      setTimeout(function () { if (S === phien) theBaiHoc(ctx); }, 300);
    }
  }

  /* Khoảnh khắc bước nhảy */
  function no(ctx) {
    var N = ctx.text.nhan;
    ctx.hud.buocNhay(S.vienMan ? N.vienMan : N.buocNhay,
      ctx.text.canhGioi.LUYEN_KHI + ' → ' + ctx.text.canhGioi.TRUC_CO);
    ctx.audio.buocNhay();

    o.cauTay.visible = false;
    o.quangTay.visible = false;
    S.loe = 1;

    for (var i = 0; i < o.manh.length; i++) {
      var m = o.manh[i];
      m.visible = true;
      m.position.copy(NGUC);
      m.userData.v.set(Math.random() - 0.5, Math.random() - 0.3, Math.random() - 0.5)
        .normalize().multiplyScalar(3 + Math.random() * 4);
      m.scale.setScalar(0.6 + Math.random() * 1.2);
    }
    o.matManh.opacity = 1;
    banHat(0xe9fbff, S.vienMan ? 380 : 260, S.vienMan ? 6 : 4.5);

    /* chất mới, ngay lập tức: cảnh giới khác, giới hạn khác */
    S.canh = 'TRUC_CO';
    S.tuVi = 0;
    S.hienThi = 0;
    datThang(ctx);
  }

  /* ═══════════ hạt ═══════════ */

  function banHat(mauH, so, tocDo, y0) {
    if (y0 === undefined) y0 = NGUC.y;
    o.no.pts.material.color.setHex(mauH);
    var dem = 0;
    for (var i = 0; i < o.no.count && dem < so; i++) {
      if (o.no.life[i] > 0) continue;
      var v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.4, Math.random() - 0.5).normalize();
      var toc = tocDo * (0.4 + Math.random() * 0.8);
      o.no.pos[i * 3] = v.x * 0.3; o.no.pos[i * 3 + 1] = y0 + v.y * 0.3; o.no.pos[i * 3 + 2] = NGUC.z + v.z * 0.3;
      o.no.vel[i * 3] = v.x * toc; o.no.vel[i * 3 + 1] = v.y * toc; o.no.vel[i * 3 + 2] = v.z * toc;
      o.no.life[i] = 1;
      dem++;
    }
  }

  function sinhKhi(i) {
    var a = Math.random() * Math.PI * 2, r = 4.5 + Math.random() * 2.5;
    o.khi.pos[i * 3]     = Math.cos(a) * r;
    o.khi.pos[i * 3 + 1] = 0.3 + Math.random() * 4.2;
    o.khi.pos[i * 3 + 2] = Math.sin(a) * r;
    o.khi.vel[i * 3] = 1.6 + Math.random() * 1.2;
    o.khi.life[i] = 1;
  }

  function capNhatHat(dt, ctx, giu, dung) {
    var t = ctx.clock;

    /* linh khí: từ bốn phía chảy về người tu sĩ, càng vận công càng dày */
    var m = mucLuong();
    var tocSinh = dung ? 0
      : S.ngoi !== true ? 4
      : S.pha === 'DOT' ? 200
      : giu ? (S.canh === 'TRUC_CO' ? 320 : 60 + m * 170)
      : 5 + m * 18;
    var quota = tocSinh * dt;
    if (quota < 1 && Math.random() < quota) quota = 1;
    var tang = S.canh === 'TRUC_CO' ? 2 : 1;
    var d = o.dich;
    for (var i = 0; i < o.khi.count; i++) {
      if (o.khi.life[i] > 0) {
        if (dung) continue;
        var px = o.khi.pos[i * 3], py = o.khi.pos[i * 3 + 1], pz = o.khi.pos[i * 3 + 2];
        var dx = d.x - px, dy = d.y - py, dz = d.z - pz;
        var kc = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (kc < 0.3) { o.khi.an(i); continue; }
        var toc = o.khi.vel[i * 3] * tang * (1 + m * 0.8) / kc;
        o.khi.pos[i * 3]     += (dx * toc - dz * 0.35) * dt;
        o.khi.pos[i * 3 + 1] += dy * toc * dt;
        o.khi.pos[i * 3 + 2] += (dz * toc + dx * 0.35) * dt;
        o.khi.life[i] -= dt * 0.12;
        if (o.khi.life[i] <= 0) o.khi.an(i);
      } else if (quota >= 1) {
        sinhKhi(i); quota--;
      }
    }
    o.khi.capNhat();

    /* bùng nổ */
    for (var j = 0; j < o.no.count; j++) {
      if (o.no.life[j] <= 0 || dung) continue;
      o.no.life[j] -= dt * 0.55;
      o.no.pos[j * 3]     += o.no.vel[j * 3] * dt;
      o.no.pos[j * 3 + 1] += o.no.vel[j * 3 + 1] * dt;
      o.no.pos[j * 3 + 2] += o.no.vel[j * 3 + 2] * dt;
      var ham = Math.exp(-dt * 1.6);
      o.no.vel[j * 3] *= ham; o.no.vel[j * 3 + 1] *= ham; o.no.vel[j * 3 + 2] *= ham;
      if (o.no.life[j] <= 0) o.no.an(j);
    }
    o.no.capNhat();

    /* lửa lò: cam trong động, hoá linh hoả xanh ở cảnh giới mới */
    var quotaL = dung ? 0 : 3;
    for (var k = 0; k < o.lua.count; k++) {
      if (o.lua.life[k] > 0) {
        if (dung) continue;
        o.lua.life[k] -= dt * 1.5;
        o.lua.pos[k * 3]     += o.lua.vel[k * 3] * dt;
        o.lua.pos[k * 3 + 1] += o.lua.vel[k * 3 + 1] * dt;
        o.lua.pos[k * 3 + 2] += o.lua.vel[k * 3 + 2] * dt;
        if (o.lua.life[k] <= 0) o.lua.an(k);
      } else if (quotaL > 0) {
        var l = LO[k % 2];
        o.lua.pos[k * 3]     = l[0] + (Math.random() - 0.5) * 0.35;
        o.lua.pos[k * 3 + 1] = 1.08;
        o.lua.pos[k * 3 + 2] = l[1] + (Math.random() - 0.5) * 0.35;
        o.lua.vel[k * 3]     = (Math.random() - 0.5) * 0.15;
        o.lua.vel[k * 3 + 1] = 0.6 + Math.random() * 0.6;
        o.lua.vel[k * 3 + 2] = (Math.random() - 0.5) * 0.15;
        o.lua.life[k] = 1;
        quotaL--;
      }
    }
    o.lua.capNhat();

    /* dòng linh khí xoắn quanh cây — chỉ có ở tiên cảnh */
    var hien = TX.anim.doan(S.W, 0.55, 1);
    o.dong.pts.material.opacity = hien * 0.75;
    if (hien > 0) {
      for (var n = 0; n < o.dong.count; n++) {
        var p = o.dongTs[n];
        var a = p[0] + t * 0.55 * p[2];
        var h = (p[1] + t * 0.07 * p[2]) % 1;
        var r = 2.2 + Math.sin(a * 2 + p[1] * 6) * 0.35 + (1 - h) * 0.9;
        o.dong.pos[n * 3]     = Math.cos(a) * r;
        o.dong.pos[n * 3 + 1] = 0.25 + h * 5.2;
        o.dong.pos[n * 3 + 2] = CAY_Z + Math.sin(a) * r;
      }
      o.dong.capNhat();
    }

    capNhatVong(dt, t, dung);
  }

  /* Bước 2: khí bay vòng quanh tu sĩ. Tu vi càng cao, vòng càng nhanh,
     càng dày và càng siết sát người — lượng biến đổi thấy được bằng mắt. */
  function capNhatVong(dt, t, dung) {
    var V = o.vong;
    var truc = S.canh === 'TRUC_CO';
    var muc = truc ? 0.4 + S.tuVi / GIOI_HAN.TRUC_CO * 0.6 : Math.min(1, mucLuong());
    var omega = S.pha === 'DOT' ? 8 + Math.sin(t * 9) * 1.2
              : truc ? 2.5 + muc * 4
              : 0.5 + muc * 6.5;
    if (!dung) S.quay += dt * omega;

    /* lúc quả cầu khí vừa nổ thì khí tan theo, tới tiên cảnh mới tụ lại */
    var hien = S.ngoi === true && (!S.daNo || S.W > 0.6);
    var n = hien ? Math.floor(V.count * (0.12 + 0.88 * muc)) : 0;
    var r0 = 1.3 - muc * 0.45;

    for (var i = 0; i < V.count; i++) {
      if (i >= n) { V.pos[i * 3 + 1] = -99; continue; }
      var p = o.vongTs[i];
      var a = p[0] + S.quay * p[3] + p[1] * 3.2;
      var r = r0 * p[2];
      V.pos[i * 3]     = Math.cos(a) * r;
      V.pos[i * 3 + 1] = GHE_Y + 0.04 + p[1] * 1.3 + Math.sin(a * 1.5 + p[0]) * 0.06;
      V.pos[i * 3 + 2] = Math.sin(a) * r;
    }
    V.capNhat();
    V.pts.material.opacity = 0.5 + muc * 0.45;
    V.pts.material.color.setRGB(
      truc ? 1 : 0.62 + S.phanPhe * 0.38,
      truc ? 0.86 : 0.93 - S.phanPhe * 0.4,
      truc ? 0.55 : 1 - S.phanPhe * 0.6
    );
  }

  /* độ sáng "lượng" của quả cầu khí: 0 → 1, vượt lên chút khi đang canh đột phá */
  function mucLuong() {
    if (S.canh === 'TRUC_CO') return S.tuVi / GIOI_HAN.TRUC_CO;
    if (S.pha === 'DOT') return S.con / 100;
    if (S.pha === 'NHAY') return 1.1;
    return S.hienThi / 100;
  }

  /* ═══════════ hình ảnh ═══════════ */

  function hinhAnh(dt, ctx, giu, dung) {
    var A = TX.anim, t = ctx.clock;
    var m = mucLuong();
    var W = S.W, Wm = A.muot(A.doan(W, 0.05, 0.8));

    S.phanPhe = Math.max(0, S.phanPhe - dt * 0.8);
    S.loe = Math.max(0, S.loe - dt * 1.4);

    /* --- vòng sáng mời ngồi, và áo tu sĩ phát sáng theo lượng --- */
    o.matMoi.opacity = S.ngoi ? 0 : 0.25 + (Math.sin(t * 3) * 0.5 + 0.5) * 0.45;
    o.matAo.emissiveIntensity = Math.min(m, 1.1) * 0.32 + S.phanPhe * 0.5;
    o.matAo.emissive.setRGB(0.31 + S.phanPhe * 0.69, 0.76 - S.phanPhe * 0.5, 1 - S.phanPhe * 0.7);
    capNhatTuSi(t, S.canh === 'TRUC_CO' ? 0.5 + S.tuVi / GIOI_HAN.TRUC_CO * 0.5 : Math.min(1, m), dung);

    /* --- khoảnh khắc đứng yên trước bước nhảy: chỉ quả cầu trong tay
           còn rung và phình lên --- */
    if (S.pha === 'NHAY' && !S.daNo) {
      var cang = A.doan(S.t, 0.1, T_NO);
      o.cauTay.scale.setScalar(1.5 + cang * 1.2 + Math.sin(t * 60) * 0.15 * cang);
      o.quangTay.scale.setScalar(0.9 + cang * 1.6);
      o.quangTay.material.opacity = 1;
    }

    /* --- đèn chính: đi theo quả cầu khí, rồi theo tiên tinh --- */
    var denCau = !S.daNo ? 0.4 + Math.min(m, 1.1) * 1.5 : 1.0 + Wm * 0.8;
    o.denCau.intensity = denCau + S.loe * 8;
    o.denCau.color.setRGB(
      0.56 + Wm * 0.44 + S.phanPhe * 0.44,
      0.86 - S.phanPhe * 0.4,
      1 - Wm * 0.45 - S.phanPhe * 0.5
    );

    /* --- trận pháp: quay nhanh dần theo lượng --- */
    if (!dung) {
      var tocTran = S.canh === 'TRUC_CO' ? 0.25 : m;
      o.tran[0].rotation.z += dt * (0.04 + tocTran * 0.5);
      o.tran[1].rotation.z -= dt * (0.07 + tocTran * 0.8);
      o.tran[2].rotation.z += dt * (0.1 + tocTran * 1.3);
    }
    var sangTran = Math.max(Math.min(m, 1), Wm) + S.loe;
    o.tran.forEach(function (tr, i) {
      tr.material.color.setRGB(
        0.42 + sangTran * 0.58,
        0.32 + sangTran * 0.5 - S.phanPhe * 0.2,
        0.14 + sangTran * 0.3 - S.phanPhe * 0.1
      ).multiplyScalar(i === 2 ? 1.1 : 1);
    });

    /* --- cột phù văn: mỗi cột là một nấc lượng --- */
    for (var k = 0; k < o.cot.length; k++) {
      var c = o.cot[k];
      var dich = (S.canh === 'TRUC_CO' || S.hienThi >= (k + 1) * NGUONG_DOT / 8 - 0.01) ? 1 : 0;
      c.sang = A.damp(c.sang, dich, 5, dt);
      var nhay = 0.85 + Math.sin(t * 2 + c.pha) * 0.15;
      c.mat.color.setRGB(0.23 + c.sang * 0.77 * nhay, 0.18 + c.sang * 0.6 * nhay, 0.12 + c.sang * 0.25 * nhay);
      var coTinh = A.vot(A.doan(W, 0.5 + k * 0.03, 0.85 + k * 0.03));
      c.tinh.scale.setScalar(Math.max(0.001, coTinh));
      c.tinh.position.y = 4.2 + Math.sin(t * 1.4 + c.pha) * 0.12;
      c.tinh.rotation.y += dt * 0.9;
    }

    /* --- lò lửa --- */
    o.lo.forEach(function (l, i) {
      l.den.intensity = 0.9 + Math.sin(t * 13 + i * 3) * 0.12 + Math.sin(t * 7.3 + i) * 0.1;
      l.den.color.setRGB(1 - Wm * 0.45, 0.54 + Wm * 0.36, 0.24 + Wm * 0.76);
    });
    o.lua.pts.material.color.setRGB(1 - Wm * 0.4, 0.6 + Wm * 0.3, 0.29 + Wm * 0.71);

    /* --- mảnh vỡ --- */
    if (S.daNo && o.matManh.opacity > 0) {
      o.matManh.opacity = Math.max(0, 1 - (S.t - T_NO) / 2.2);
      for (var i = 0; i < o.manh.length; i++) {
        var mm = o.manh[i], v = mm.userData.v;
        mm.position.addScaledVector(v, dt);
        v.multiplyScalar(Math.exp(-dt * 1.2));
        mm.rotation.x += dt * 4; mm.rotation.y += dt * 3;
        if (o.matManh.opacity <= 0) mm.visible = false;
      }
    }

    /* --- biến hoá động phủ thành tiên cảnh --- */
    if (W > 0) bienCanh(dt, ctx, W, Wm, t);
  }

  function bienCanh(dt, ctx, W, Wm, t) {
    var A = TX.anim;

    o.khoi.forEach(function (b) {
      var u = b.userData, p = A.doan(W, u.tre, u.tre + 0.4);
      if (p >= 1) { b.visible = false; return; }
      var e = p * p;
      b.position.set(u.goc.x + u.nx * (p * 5 + e * 4), u.goc.y - e * 14, u.goc.z + u.nz * (p * 5 + e * 4));
      b.rotation.set(u.quay.x + u.xoay.x * p * 4, u.quay.y + u.xoay.y * p * 4, u.quay.z + u.xoay.z * p * 4);
    });

    o.phien.forEach(function (ph) {
      var u = ph.userData, p = A.doan(W, u.tre, u.tre + 0.38);
      if (p >= 1) { ph.visible = false; return; }
      var e = p * p;
      ph.position.set(u.goc.x * (1 + e * 2.5), u.goc.y + e * 26, u.goc.z * (1 + e * 2.5));
      ph.rotation.y += dt * u.xoay * p;
      ph.rotation.x += dt * u.xoay * 0.4 * p;
    });

    /* trời, sương, ánh sáng */
    o.troiU.uMo.value = Wm;
    ctx.moiTruong.suong.color.copy(o.mauSuong[0]).lerp(o.mauSuong[1], Wm);
    ctx.moiTruong.suong.density = 0.07 + (0.011 - 0.07) * Wm;
    ctx.moiTruong.nen.copy(ctx.moiTruong.suong.color);
    o.hemi.color.copy(o.mauHemi[0][0]).lerp(o.mauHemi[0][1], Wm);
    o.hemi.groundColor.copy(o.mauHemi[1][0]).lerp(o.mauHemi[1][1], Wm);
    o.hemi.intensity = 0.34 + Wm * 0.66;
    o.denTroi.intensity = Wm * 0.9;
    o.matSan.color.copy(o.mauSan[0]).lerp(o.mauSan[1], Wm);
    o.matVien.opacity = A.doan(W, 0.4, 0.9);
    o.matMay.opacity = A.doan(W, 0.2, 0.8) * 0.9;
    o.may.position.x = Math.sin(t * 0.02) * 6;

    /* cây tiên mọc lên */
    var gThan = A.chamDan(A.doan(W, 0.2, 0.65));
    var gTan  = A.vot(A.doan(W, 0.45, 0.9), 1.2);
    o.cay.visible = gThan > 0.001;
    o.than.scale.set(0.4 + gThan * 0.6, Math.max(0.001, gThan), 0.4 + gThan * 0.6);
    o.tan.scale.setScalar(Math.max(0.001, gTan));
    o.tan.position.y = 0.2 + gThan * 3.0;

    /* tiên tinh: hiện ra nơi quả cầu khí vỡ, rồi bay lên giữa tán */
    var hien = A.vot(A.doan(W, 0.08, 0.3));
    var len = A.muot(A.doan(W, 0.35, 0.85));
    /* bay vồng lên rồi hạ vào tán cây sau lưng tu sĩ */
    var y = NGUC.y + (TINH_Y - NGUC.y) * len + Math.sin(len * Math.PI) * 1.2 + Math.sin(t * 1.1) * 0.06 * len;
    var z = NGUC.z + (CAY_Z - NGUC.z) * len;
    o.tinh.scale.setScalar(Math.max(0.001, hien));
    o.tinh.position.set(0, y, z);
    o.tinh.rotation.y += dt * 0.8;
    o.tinh.rotation.x = Math.sin(t * 0.7) * 0.2;
    o.quangTinh.scale.setScalar(Math.max(0.001, hien * (1.6 + Math.sin(t * 2) * 0.12)));
    o.quangTinh.position.set(0, y, z);
    o.denCau.position.set(0, y, z);
    o.vungTinh.position.set(0, y, z);
    /* ở cảnh giới mới, khí đi từ tiên tinh về người */
    o.dich.copy(NGUC);

    /* đảo nổi trồi lên từ biển mây */
    o.daoNoi.forEach(function (d) {
      var u = d.userData, p = A.chamDan(A.doan(W, 0.3 + u.tre, 0.95));
      d.position.y = u.y - 30 * (1 - p) + Math.sin(t * 0.5 + u.pha) * 0.35;
      d.rotation.y += dt * 0.02;
    });
  }

  /* ═══════════ âm thanh ═══════════ */

  function dungAm(ctx) {
    var a = ctx.audio.ngu();
    if (!a) return;
    var g = a.createGain(), f = a.createBiquadFilter();
    var o1 = a.createOscillator(), o2 = a.createOscillator();
    g.gain.value = 0.0001;
    f.type = 'lowpass'; f.frequency.value = 300;
    o1.type = 'sine'; o1.frequency.value = 62;
    o2.type = 'triangle'; o2.frequency.value = 93;
    o1.connect(f); o2.connect(f); f.connect(g); g.connect(a.destination);
    o1.start(); o2.start();
    o.am = { a: a, g: g, f: f, o1: o1, o2: o2, tat: false };
  }

  function capNhatAm(ctx, giu) {
    var am = o.am;
    if (!am || am.tat) return;
    var a = am.a, now = a.currentTime;
    var vol, tan, loc;
    if (S.pha === 'DOT') {
      var gan = 1 - Math.abs(S.con - 100) / 10;
      vol = 0.05 + gan * 0.04;
      tan = 105 + gan * 35;
      loc = 700 + gan * 1500;
    } else if (S.canh === 'TRUC_CO') {
      vol = 0.022 + (giu ? 0.02 : 0);
      tan = 98;
      loc = 1100 + (giu ? 500 : 0);
    } else {
      var m = S.hienThi / 100;
      vol = 0.008 + m * 0.04 + (giu ? 0.012 : 0);
      tan = 58 + m * 45;
      loc = 260 + m * 900;
    }
    am.g.gain.setTargetAtTime(vol, now, 0.12);
    am.o1.frequency.setTargetAtTime(tan, now, 0.2);
    am.o2.frequency.setTargetAtTime(tan * 1.5, now, 0.2);
    am.f.frequency.setTargetAtTime(loc, now, 0.2);
  }

  /* Bước nhảy bắt đầu bằng im lặng tuyệt đối. */
  function amTat() {
    var am = o.am;
    if (!am) return;
    var now = am.a.currentTime;
    am.g.gain.cancelScheduledValues(now);
    am.g.gain.setValueAtTime(0.0001, now);
    am.tat = true;
  }

  /* Hợp âm trong sáng khi tiên cảnh mở ra, rồi nền trở lại ở cung mới. */
  function amChuong() {
    var am = o.am;
    if (!am) return;
    var a = am.a, t = a.currentTime;
    [392, 493.9, 587.3, 784, 987.8].forEach(function (f, i) {
      var os = a.createOscillator(), g = a.createGain();
      os.type = 'sine';
      os.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.05, t + i * 0.09 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 3.2);
      os.connect(g); g.connect(a.destination);
      os.start(t + i * 0.09); os.stop(t + i * 0.09 + 3.3);
    });
    am.tat = false;
  }

  /* Tiếng phản phệ: lệch tông, rơi xuống. */
  function amHong(ta) {
    var am = o.am;
    if (!am) return;
    var a = am.a, t = a.currentTime;
    [ta ? 220 : 160, ta ? 233 : 170].forEach(function (f) {
      var os = a.createOscillator(), g = a.createGain();
      os.type = 'sawtooth';
      os.frequency.setValueAtTime(f, t);
      os.frequency.exponentialRampToValueAtTime(f * 0.45, t + 0.7);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
      os.connect(g); g.connect(a.destination);
      os.start(t); os.stop(t + 0.85);
    });
  }

  /* ═══════════ chú giải theo ánh nhìn ═══════════ */

  function nhinVao(dt, ctx) {
    var P = ctx.player, id = null;
    /* đang ngồi thì như xem phim: không bật chú giải theo ánh nhìn */
    var ranh = !S.ngoi && (S.pha === 'TICH' || S.pha === 'TRUC' || S.pha === 'XONG');
    if (ranh && !ctx.hud.theDangMo() && !ctx.hud.soTayDangMo()) {
      if (P.lockBroken) o.diemNhin.set(P.chuot.x / innerWidth * 2 - 1, -(P.chuot.y / innerHeight) * 2 + 1);
      else o.diemNhin.set(0, 0);
      o.tia.setFromCamera(o.diemNhin, ctx.camera);
      o.tia.far = 10;
      var trung = o.tia.intersectObjects(o.nhin, false);
      /* tiên tinh nằm lọt trong vùng của cây, nên được ưu tiên */
      for (var i = 0; i < trung.length; i++) {
        var n = trung[i].object.userData.nhin;
        n = typeof n === 'function' ? n() : n;
        if (n && (!id || n === 'tienTinh')) id = n;
      }
    }
    if (id !== S.nhamId) { S.nhamId = id; S.nhamT = 0; }
    else S.nhamT += dt;
    ctx.hud.nhinChuGiai(id && S.nhamT >= NHIN_TRE ? ctx.text.chuGiai[id] : null);
  }

  /* ═══════════ thẻ nội dung ═══════════ */

  function theBaiHoc(ctx) {
    var B = ctx.text.baiHoc;
    ctx.hud.the(
      '<div class="eyebrow">' + B.nhan + '</div>' +
      '<h1>' + B.tieuDe + '</h1>' +
      '<p>' + B.dan + '</p>' +
      '<dl>' + B.dinhNghia.map(function (d) {
        return '<dt>' + d[0] + '</dt><dd>' + d[1] + '</dd>';
      }).join('') + '</dl>' +
      '<p>' + B.ghiChu + '</p>' +
      '<blockquote class="quote">' + B.trichDan +
        '<cite>' + B.nguon + '</cite></blockquote>' +
      '<h2>' + B.tiepTheo.tieuDe + '</h2>' +
      '<p>' + B.tiepTheo.than + '</p>',
      TX.VI.game.troLai,
      function () { ctx.player.grab(); }
    );
  }

  function theKetThuc(ctx) {
    var K = ctx.text.ketThuc;
    var B = ctx.text.baiHoc;

    ctx.soTay.ghi({
      ten: ctx.text.soTay.ten,
      tom: ctx.text.soTay.tom,
      trichDan: B.trichDan,
      nguon: B.nguon
    });
    ctx.hoanThanh();

    ctx.hud.the(
      '<div class="eyebrow">' + K.nhan + '</div>' +
      '<h1>' + K.tieuDe + '</h1>' +
      '<p>' + K.dan + '</p>' +
      '<h2>Ý nghĩa phương pháp luận</h2>' +
      K.phuongPhapLuan.map(function (d) {
        return '<p><strong>' + d[0] + ' —</strong> ' + d[1] + '</p>';
      }).join('') +
      '<p>' + K.banThan.replace('{ta}', S.taKhuynh).replace('{huu}', S.huuKhuynh) + '</p>' +
      '<h2>' + K.lienHe.tieuDe + '</h2>' +
      '<p>' + K.lienHe.than + '</p>',
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  /* ═══════════ bước 1: nhảy lên bồ đoàn ═══════════ */

  var _f = new THREE.Vector3();

  /* Ngồi rồi thì mắt người chơi thành camera góc nhìn thứ ba, xoay quanh
     tu sĩ: lùi khỏi tâm nhìn một đoạn S.camXa, ngược hướng đang nhìn.
     Không dùng ctx.khoaCamera — để Esc vẫn hỏi rời phòng được. */
  function viTriCam(yaw, pitch, out) {
    _f.set(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    return out.copy(o.tamNhin).addScaledVector(_f, -S.camXa);
  }

  /* Đạo diễn: camera tự trôi chậm quanh tu sĩ như máy quay phim, đẩy cận
     khi canh điểm nút, kéo xa và ngẩng lên khi động phủ mở ra trời. */
  function daoDien(dt, ctx, giu) {
    var P = ctx.player, A = TX.anim;
    var mo = S.pha === 'NHAY' && S.daNo;

    /* máy quay đung đưa chậm hai bên trước mặt tu sĩ; chuột vẫn xoay
       tự do, phần đung đưa chỉ cộng thêm vào */
    var lech = Math.sin(ctx.clock * 0.16) * 0.45;
    if (S.lech !== null && !(S.pha === 'NHAY' && !S.daNo)) P.yaw += lech - S.lech;
    S.lech = lech;

    var xa = S.pha === 'DOT' ? 3.0
           : S.pha === 'NHAY' ? (S.daNo ? CAM_TOI_DA : 2.6)
           : CAM_XA;
    /* cây tiên mọc sau lưng tu sĩ: vòng ra sau thì đứng gần lại, đừng để thân cây chắn */
    if (o.cay.visible && Math.cos(P.yaw) < -0.55) xa = Math.min(xa, 2.0);
    S.camXa = A.damp(S.camXa, xa, mo ? 1.1 : 2.4, dt);
    o.tamNhin.y = A.damp(o.tamNhin.y, mo ? 2.3 : TAM_NHIN.y, 1.2, dt);
    if (mo) P.pitch = A.damp(P.pitch, 0.28, 1.4, dt);   // ngẩng lên khi trời mở

    /* không cho camera chui xuống sàn, không chạm vòng cột */
    var tran = Math.asin(Math.min(1, (o.tamNhin.y - 0.4) / S.camXa));
    P.pitch = A.kep(P.pitch, -1.0, tran);
    S.camXa = Math.min(S.camXa, CAM_TOI_DA / Math.max(0.3, Math.cos(P.pitch)));
  }

  function batPhim(ctx, on) {
    ctx.hud.phim(on);
    ctx.hud.ngamTat(on);
    document.body.classList.toggle('lc-phim', on);
    S.lech = null;              // khung hình đầu chỉ ghi nhận, không giật góc
    if (!on) { ctx.hud.phimChu(); S.phuDe = 0; }
  }

  function gocGon(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  function nhayLen(ctx) {
    var P = ctx.player;
    S.ngoi = 'LEN';
    S.tLen = 0;
    S.hienTS = 0;
    o.tuMat.copy(P.pos);
    o.tuYaw = P.yaw;
    o.tuPitch = P.pitch;
    ctx.audio.the();
  }

  function dungDay(ctx) {
    var P = ctx.player;
    S.ngoi = false;
    batPhim(ctx, false);
    o.tuSi.visible = false;
    /* đứng xuống ngay phía camera đang nhìn, vẫn quay mặt vào bồ đoàn */
    P.pos.set(Math.sin(P.yaw) * 2.2, P.CAO_MAT, Math.cos(P.yaw) * 2.2);
    P.pitch = -0.05;
  }

  function capNhatNgoi(dt, ctx, giu) {
    var P = ctx.player, A = TX.anim;
    if (S.ngoi === 'LEN') {
      S.tLen += dt;
      var k = A.muot(S.tLen / T_LEN);
      P.yaw = o.tuYaw + gocGon(CAM_YAW - o.tuYaw) * k;
      P.pitch = o.tuPitch + (CAM_PITCH - o.tuPitch) * k;
      viTriCam(P.yaw, P.pitch, o.camDich);
      P.pos.lerpVectors(o.tuMat, o.camDich, k);
      P.pos.y += Math.sin(k * Math.PI) * 0.9;          // vồng lên: một cú nhảy
      if (S.tLen >= T_LEN * 0.5 && !o.tuSi.visible) {
        o.tuSi.visible = true;                          // chạm bồ đoàn: hiện tu sĩ
        banHat(0xffe2a8, 90, 2.2, GHE_Y + 0.3);
        ctx.audio.diemNut();
        batPhim(ctx, true);
      }
      if (S.tLen >= T_LEN) {
        S.ngoi = true;
        if (S.canh === 'LUYEN_KHI') {
          var F = ctx.text.phuDe;
          ctx.hud.phimChu(F.nhan, F.tieuDe, F.than);
          S.phuDe = 4.5;
        }
      }
    } else if (S.ngoi === true) {
      daoDien(dt, ctx, giu);
      viTriCam(P.yaw, P.pitch, P.pos);
    }
    if (S.phuDe > 0) {
      S.phuDe -= dt;
      if (S.phuDe <= 0 || S.pha === 'DOT') { S.phuDe = 0; ctx.hud.phimChu(); }
    }
    if (o.tuSi.visible) {
      S.hienTS = Math.min(1, S.hienTS + dt * 2.6);
      var c = Math.max(0.001, A.vot(S.hienTS, 2.2));
      o.tuSi.scale.set(c, c, c);
    }
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var P = ctx.player;
    var ngoi = S.ngoi === true;
    var gan = !S.ngoi && P.distTo(0, 0) < TAM_NGOI;
    var tacDong = P.action();

    /* bấm (cạnh lên) để nhảy lên; tác động ngược để đứng dậy */
    if (gan && tacDong > 0 && S.tacTruoc <= 0) nhayLen(ctx);
    if (ngoi && tacDong < 0 && S.tacTruoc >= 0 && S.pha !== 'DOT' && S.pha !== 'NHAY') {
      dungDay(ctx);
      ngoi = false;
    }
    S.tacTruoc = tacDong;

    var giu = ngoi && S.pha !== 'DOT' && tacDong > 0;

    if (S.pha === 'TICH') {
      if (giu) tichLuy(dt);
      if (S.tuVi >= NGUONG_DOT) batDauDot(ctx);
    } else if (S.pha === 'DOT') {
      capNhatDot(dt, ctx, ngoi);
    } else if (S.pha === 'NHAY') {
      capNhatNhay(dt, ctx);
    } else {
      if (giu) tichLuy(dt);
      if (S.pha === 'TRUC' && S.tuVi >= XONG_TRUC) {
        S.pha = 'XONG';
        ctx.audio.diemNut();
        var phien = S;
        setTimeout(function () { if (S === phien) theKetThuc(ctx); }, 900);
      }
    }

    /* tu vi hiển thị: tụt về từ từ sau phản phệ, tăng thì theo sát */
    S.hienThi = S.tuVi < S.hienThi ? TX.anim.damp(S.hienThi, S.tuVi, 3, dt) : S.tuVi;

    /* nửa giây trước bước nhảy: mọi thứ đứng yên */
    var dung = S.pha === 'NHAY' && !S.daNo;

    capNhatNgoi(dt, ctx, giu);
    hinhAnh(dt, ctx, giu, dung);
    capNhatHat(dt, ctx, giu, dung);
    capNhatAm(ctx, giu);
    capNhatHud(ctx, gan, giu);
    nhinVao(dt, ctx);
  }

  function capNhatHud(ctx, gan, giu) {
    var T = ctx.text, P = ctx.player;
    var dot = S.pha === 'DOT';
    var ngoi = S.ngoi === true;

    el.t.textContent = dot ? Math.round(S.con) : Math.floor(S.hienThi);
    el.tich.style.display = dot ? 'none' : '';
    el.dot.classList.toggle('on', dot);

    if (dot) {
      el.con.style.left = ((S.con - 90) / 20 * 100) + '%';
    } else {
      var p = pct(S.hienThi);
      el.fill.style.width = p + '%';
      el.cur.style.left = p + '%';
      var ds = S.canh === 'TRUC_CO' ? T.dauHieuTrucCo : T.dauHieu, dau = ds[0][1];
      for (var i = 0; i < ds.length; i++) if (S.hienThi >= ds[i][0]) dau = ds[i][1];
      if (el.dau.textContent !== dau) el.dau.textContent = dau;
    }

    /* dòng hướng dẫn đổi theo việc người chơi đang phải làm */
    var viec = !ngoi ? 'ngoi' : dot ? 'dotPha' : 'vanCong';
    var kieu = viec + (P.lockBroken ? '1' : '0');
    if (kieu !== S.goiY) {
      S.goiY = kieu;
      var gy = T.goiY[viec];
      ctx.hud.goiY(P.lockBroken ? gy.duPhong : gy.khoa);
    }

    /* lúc bước nhảy diễn ra thì nhường cả màn hình cho cảnh phim */
    ctx.hud.hienPanel(ngoi && S.phuDe <= 0 && S.pha !== 'NHAY');
    ctx.hud.hienGoiY(ngoi ? (S.pha !== 'NHAY' && (dot || !giu)) : gan);
    ctx.hud.ngam(gan);
  }

  function onEnter(ctx) {
    if (!o.am) dungAm(ctx);
  }

  function dispose() {
    document.body.classList.remove('lc-phim');
    if (o && o.am) {
      try { o.am.o1.stop(); o.am.o2.stop(); o.am.g.disconnect(); } catch (e) {}
    }
    S = o = el = null;
  }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'luong-chat',
    tieuDe: 'Lượng đổi → Chất đổi',
    nhanNgan: 'Tầng II · Chương 2',
    moTa: 'Một động phủ, một bồ đoàn, và câu hỏi: khi nào thì đột phá?',
    goiY: TX.VI['luong-chat'].goiY.ngoi,
    build: build,
    update: update,
    onEnter: onEnter,
    dispose: dispose
  });

})(window.TX);
