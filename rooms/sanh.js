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

  var R_TRONG = 4.2;    // mép trong cầu thang (sát trụ)
  var R_NGOAI = 6.5;    // mép ngoài
  var R_TUONG = 7.3;    // tường bao
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
        if (o.cua[i].id === TX.phongVua) { gocVao = o.cua[i].goc - 0.10; break; }
      }
    }
    var rGiua = (R_TRONG + R_NGOAI) / 2;
    ctx.player.spawn(Math.cos(gocVao) * rGiua, Math.sin(gocVao) * rGiua, -gocVao + Math.PI / 2);
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

  /* ---------- vỏ tháp: trụ giữa + tường bao ---------- */

  function dungVoThap(ctx) {
    var san = new THREE.Mesh(
      new THREE.CircleGeometry(R_TUONG, 64),
      new THREE.MeshStandardMaterial({ color: 0x101219, roughness: 0.9 })
    );
    san.rotation.x = -Math.PI / 2;
    san.receiveShadow = true;
    ctx.scene.add(san);

    var tru = new THREE.Mesh(
      new THREE.CylinderGeometry(R_TRONG, R_TRONG, 14, 48, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x14161e, roughness: 0.88, side: THREE.DoubleSide
      })
    );
    tru.position.y = 7;
    tru.receiveShadow = true;
    ctx.scene.add(tru);

    var tuong = new THREE.Mesh(
      new THREE.CylinderGeometry(R_TUONG, R_TUONG, 16, 64, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x0b0c12, roughness: 0.95, side: THREE.BackSide
      })
    );
    tuong.position.y = 7;
    ctx.scene.add(tuong);
  }

  /* ---------- cầu thang xoắn, dựng thành MỘT lưới duy nhất ----------
     Gộp hết vào một BufferGeometry để giữ số lệnh vẽ ở mức thấp,
     xem phần Hiệu năng trong GDD. */

  function dungCauThang(ctx) {
    var v = [];
    var dGoc = (GOC_CUOI - GOC_DAU) / SO_BAC;

    function diem(a, r, y) { return [Math.cos(a) * r, y, Math.sin(a) * r]; }
    function quad(p1, p2, p3, p4) {
      v.push.apply(v, p1); v.push.apply(v, p2); v.push.apply(v, p3);
      v.push.apply(v, p1); v.push.apply(v, p3); v.push.apply(v, p4);
    }

    for (var i = 0; i < SO_BAC; i++) {
      var a0 = GOC_DAU + i * dGoc;
      var a1 = a0 + dGoc;
      var y  = i * CAO_BAC;

      /* mặt bậc */
      quad(diem(a0, R_TRONG, y), diem(a0, R_NGOAI, y),
           diem(a1, R_NGOAI, y), diem(a1, R_TRONG, y));

      /* cổ bậc, dựng đứng ở đầu mỗi bậc */
      if (i > 0) {
        quad(diem(a0, R_TRONG, y - CAO_BAC), diem(a0, R_TRONG, y),
             diem(a0, R_NGOAI, y),           diem(a0, R_NGOAI, y - CAO_BAC));
      }

      /* má ngoài, để nhìn từ dưới lên thấy được đường xoắn */
      quad(diem(a0, R_NGOAI, y - 0.5), diem(a0, R_NGOAI, y),
           diem(a1, R_NGOAI, y),       diem(a1, R_NGOAI, y - 0.5));
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    geo.computeVertexNormals();

    var thang = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: 0x1a1d26, roughness: 0.82, metalness: 0.12, side: THREE.DoubleSide
    }));
    thang.castShadow = true;
    thang.receiveShadow = true;
    ctx.scene.add(thang);

    /* vệt sáng chạy dọc mép ngoài — dẫn mắt đi lên */
    var pts = [];
    for (var j = 0; j <= SO_BAC; j++) {
      var a = GOC_DAU + j * dGoc;
      var yy = Math.min(j, SO_BAC - 1) * CAO_BAC + 0.02;
      pts.push(new THREE.Vector3(Math.cos(a) * (R_NGOAI - 0.06), yy, Math.sin(a) * (R_NGOAI - 0.06)));
    }
    var vet = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xffb469, transparent: true, opacity: 0.45 })
    );
    ctx.scene.add(vet);
  }

  /* ---------- các cánh cửa ---------- */

  function dungCacCua(ctx) {
    var ds = ctx.danhSachPhong;
    var n = ds.length;

    for (var i = 0; i < n; i++) {
      /* rải đều dọc đường leo, chừa chân thang và đỉnh thang */
      var t = (i + 1) / (n + 1);
      var goc = GOC_DAU + t * (GOC_CUOI - GOC_DAU);
      dungMotCua(ctx, ds[i], goc);
    }
  }

  function dungMotCua(ctx, phong, goc) {
    var y = caoTaiGoc(goc);
    var r = R_NGOAI - 0.12;
    var x = Math.cos(goc) * r, z = Math.sin(goc) * r;
    var mau = phong.xong ? 0x7bc47f : 0xffb469;

    var nhom = new THREE.Group();
    nhom.position.set(x, y, z);
    nhom.lookAt(0, y + 1.6, 0);
    ctx.scene.add(nhom);

    /* khung cửa */
    var matKhung = new THREE.MeshStandardMaterial({
      color: 0x2a2d3a, roughness: 0.5, metalness: 0.6
    });
    var khung = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.9, 0.18), matKhung);
    khung.position.y = 1.45;
    nhom.add(khung);

    /* vùng bấm: khối vô hình rộng hơn cánh cửa, để bấm chuột không cần chính xác */
    var vungBam = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 4.2, 1.6),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    vungBam.position.set(0, 1.8, -0.4);
    vungBam.userData.phongId = phong.id;
    nhom.add(vungBam);

    /* lòng cửa phát sáng */
    var matLong = new THREE.MeshBasicMaterial({
      color: mau, transparent: true, opacity: 0.30,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    });
    var long = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.5), matLong);
    long.position.set(0, 1.42, 0.11);
    nhom.add(long);

    var den = new THREE.PointLight(mau, 1.1, 8, 2);
    den.position.set(0, 1.5, 0.7);
    nhom.add(den);

    /* biển tên phòng, treo trên cửa */
    var bien = bienCua(phong, mau);
    bien.position.set(0, 3.25, 0.1);
    nhom.add(bien);

    o.cua.push({
      id: phong.id, goc: goc, x: x, z: z, y: y,
      matLong: matLong, den: den, nhom: nhom, mau: mau, xong: phong.xong,
      vungBam: vungBam
    });
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

  function bienCua(phong, mau) {
    var c = document.createElement('canvas');
    c.width = 640; c.height = 200;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.textAlign = 'center';

    g.fillStyle = '#6f7280';
    g.font = '400 24px Inter, "Segoe UI", sans-serif';
    g.fillText(phong.nhanNgan || '', c.width / 2, 40);

    g.fillStyle = '#' + mau.toString(16).padStart(6, '0');
    g.font = '600 54px Inter, "Segoe UI", sans-serif';
    g.fillText(phong.tieuDe, c.width / 2, 104);

    if (phong.xong) {
      g.fillStyle = '#7bc47f';
      g.font = '400 24px Inter, "Segoe UI", sans-serif';
      g.fillText('ĐÃ QUA', c.width / 2, 146);
    }

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.81),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.95 })
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
    g.fillStyle = '#4a4d59';
    g.font = '600 40px Inter, "Segoe UI", sans-serif';
    g.fillText('ĐỈNH THÁP', c.width / 2, 58);
    g.font = '400 24px Inter, "Segoe UI", sans-serif';
    g.fillText('còn đang xây', c.width / 2, 104);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    var bien = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 0.65),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.7 })
    );
    bien.position.set(Math.cos(goc) * (R_NGOAI - 0.1), y + 2.0, Math.sin(goc) * (R_NGOAI - 0.1));
    bien.lookAt(0, y + 2.0, 0);
    ctx.scene.add(bien);

    o.dinh = { goc: goc, x: Math.cos(goc) * r, z: Math.sin(goc) * r };
  }

  /* ---------- ánh sáng ---------- */

  function dungAnhSang(ctx) {
    ctx.scene.add(new THREE.AmbientLight(0x2a3040, 0.42));

    /* một cột sáng lạnh rọi từ đỉnh tháp xuống */
    var tren = new THREE.SpotLight(0xa8c4ff, 1.1, 30, Math.PI / 4, 0.7, 1.2);
    tren.position.set(0, 13, 0);
    tren.target.position.set(0, 0, 0);
    ctx.scene.add(tren, tren.target);

    var day = new THREE.PointLight(0x3a5a8a, 0.5, 14, 2);
    day.position.set(0, 1.2, 0);
    ctx.scene.add(day);
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

    /* cửa thở nhẹ; cửa đang đứng cạnh thì sáng hẳn lên */
    for (var j = 0; j < o.cua.length; j++) {
      var d = o.cua[j];
      var tho = 0.26 + Math.sin(t * 1.4 + j) * 0.05;
      var muc = (d === sang) ? 0.62 : tho;
      d.matLong.opacity = TX.anim.damp(d.matLong.opacity, muc, 6, dt);
      d.den.intensity = TX.anim.damp(d.den.intensity, (d === sang) ? 2.4 : 1.1, 6, dt);
      d.nhom.scale.setScalar(TX.anim.damp(d.nhom.scale.x, (d === sang) ? 1.04 : 1.0, 7, dt));
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
