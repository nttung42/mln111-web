/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — PHỦ ĐỊNH CỦA PHỦ ĐỊNH
   (Giáo trình, Chương 2, mục 2.2.2)

   Ba luống đất đặt trên một đường xoắn đi lên. Người chơi nuôi hạt
   thành cây, cây để lại hạt mới, hạt bay sang luống kế tiếp — cao hơn,
   nhiều hạt hơn, cây to hơn.

   Khoảnh khắc "à há" nằm ở cuối: camera tự bay lên và vạch lại quỹ đạo
   vừa đi. Nó KHÔNG phải vòng tròn khép kín mà là một đường xoáy trôn ốc.
   Và đó cũng chính là hình dạng của toà tháp người chơi đang leo.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var TOC_DO_MOC = 0.30;    // tiến trình mỗi giây khi nuôi dưỡng
  var TAM_VOI    = 2.2;
  var SO_VONG    = 3;
  var BAN_KINH   = 3.0;
  var SO_HAT     = [1, 3, 9];
  var CO_CAY     = [1.0, 1.36, 1.78];
  var CAO_LUONG  = [0.0, 0.55, 1.10];
  var GOC_LUONG  = [-Math.PI / 2, -Math.PI / 2 + 2.094, -Math.PI / 2 + 4.189];

  var S, o, el;

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    S = {
      vong: 0, moc: 0, giaiDoan: 'HAT',
      chuyen: 0,            // >0: hạt đang bay sang luống kế tiếp
      xong: false,
      bay: 0,               // đồng hồ đoạn camera tự bay
      gan: false
    };
    o = { luong: [] };

    TX.dungVoPhong(ctx.scene, { bien: ['PHỦ  ĐỊNH', 'phòng III'] });
    ctx.player.blockers = [];

    for (var i = 0; i < SO_VONG; i++) dungLuong(ctx, i);

    o.hat = TX.heHat(ctx.scene, 200, 0xe8a040, 0.07, 0.0);

    /* đường xoắn, vẽ dần trong đoạn camera bay cuối phòng */
    o.duong = duongXoan(ctx);

    o.den = TX.dungAnhSang(ctx.scene, o.luong[0].nhom);
    dungPanel(ctx, ctx.text);
  }

  function dungLuong(ctx, i) {
    var goc = GOC_LUONG[i];
    var x = Math.cos(goc) * BAN_KINH;
    var z = Math.sin(goc) * BAN_KINH;
    var y = CAO_LUONG[i];

    var nhom = new THREE.Group();
    nhom.position.set(x, y, z);
    ctx.scene.add(nhom);

    /* bệ luống — mỗi luống cao hơn luống trước */
    var be = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 1.1, y + 0.55, 32),
      new THREE.MeshStandardMaterial({ color: TX.MAU.be, roughness: 0.7, metalness: 0.2 })
    );
    be.position.y = -y / 2 - 0.02;
    be.castShadow = true;
    be.receiveShadow = true;
    nhom.add(be);

    var dat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.82, 0.82, 0.1, 32),
      new THREE.MeshStandardMaterial({ color: 0x241d16, roughness: 1 })
    );
    dat.position.y = 0.3;
    nhom.add(dat);

    /* vòng sáng báo luống đang hoạt động */
    var matVong = new THREE.MeshBasicMaterial({
      color: TX.MAU.nhan, transparent: true, opacity: 0.15
    });
    var vong = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.025, 10, 48), matVong);
    vong.rotation.x = Math.PI / 2;
    vong.position.y = 0.36;
    nhom.add(vong);

    /* hạt giống */
    var matHat = new THREE.MeshStandardMaterial({
      color: 0xd9c08a, emissive: 0x6a5020, roughness: 0.6
    });
    var hat = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 0), matHat);
    hat.position.y = 0.4;
    hat.visible = (i === 0);
    nhom.add(hat);

    /* thân cây */
    var than = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.075, 1, 10),
      new THREE.MeshStandardMaterial({ color: 0x5a4a32, roughness: 0.85 })
    );
    than.position.y = 0.35;
    than.scale.y = 0.001;
    nhom.add(than);

    /* tán lá */
    var matTan = new THREE.MeshStandardMaterial({
      color: 0x4e8f5a, roughness: 0.7, flatShading: true
    });
    var tan = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), matTan);
    tan.visible = false;
    nhom.add(tan);

    /* quả — số lượng tăng theo từng chu kỳ */
    var qua = [];
    var matQua = new THREE.MeshStandardMaterial({
      color: 0xffb469, emissive: 0xff8c3c, emissiveIntensity: 0.7, roughness: 0.4
    });
    for (var k = 0; k < SO_HAT[i]; k++) {
      var q = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), matQua);
      var a = (k / SO_HAT[i]) * Math.PI * 2;
      q.userData.goc = a;
      q.visible = false;
      nhom.add(q);
      qua.push(q);
    }

    var den = new THREE.PointLight(0xffb469, 0, 4, 2);
    den.position.y = 1.2;
    nhom.add(den);

    o.luong.push({
      i: i, x: x, z: z, y: y, nhom: nhom,
      hat: hat, than: than, tan: tan, qua: qua,
      vong: vong, matVong: matVong, den: den,
      co: CO_CAY[i]
    });
  }

  /* Đường nối tâm ba luống, kéo dài lên trên — chính là đường xoắn. */
  function duongXoan(ctx) {
    var pts = [];
    for (var t = 0; t <= 1.0001; t += 1 / 96) {
      var i = Math.min(SO_VONG - 1, t * (SO_VONG - 1));
      var goc = GOC_LUONG[0] + t * (GOC_LUONG[SO_VONG - 1] - GOC_LUONG[0]);
      var y = CAO_LUONG[0] + t * (CAO_LUONG[SO_VONG - 1] - CAO_LUONG[0]);
      pts.push(new THREE.Vector3(
        Math.cos(goc) * BAN_KINH, y + 0.75, Math.sin(goc) * BAN_KINH
      ));
      void i;
    }
    var geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setDrawRange(0, 0);
    var line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: 0xffb469, transparent: true, opacity: 0.9
    }));
    ctx.scene.add(line);
    return { line: line, tong: pts.length };
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function dungPanel(ctx, T) {
    ctx.hud.datPanel(
      '<div class="readout">' +
        '<div class="temp"><b id="pdV">1</b><span>/3</span></div>' +
        '<div class="phase"><div class="lbl">' + T.nhan.giaiDoan + '</div>' +
          '<div class="val" id="pdG"></div></div>' +
      '</div>' +
      '<div class="scale"><div class="fill" id="pdFill"></div></div>' +
      '<div class="ticks">' +
        '<span class="bandlabel" style="left:50%">' + T.nhan.nuoiDuong + '</span>' +
      '</div>' +
      '<div id="pdNode" class="nodebar on">' +
        '<div class="cap"><span>' + T.nhan.soHat + '</span><span id="pdHat">1</span></div>' +
      '</div>'
    );
    el = {
      v:    document.getElementById('pdV'),
      g:    document.getElementById('pdG'),
      fill: document.getElementById('pdFill'),
      hat:  document.getElementById('pdHat')
    };
  }

  /* ═══════════ logic ═══════════ */

  function logic(dt, ctx) {
    var L = o.luong[S.vong];

    /* hạt đang bay sang luống kế tiếp */
    if (S.chuyen > 0) {
      S.chuyen -= dt;
      if (S.chuyen <= 0) {
        S.vong++;
        S.moc = 0;
        S.giaiDoan = 'HAT';
        o.luong[S.vong].hat.visible = true;
      }
      return;
    }

    S.gan = ctx.player.distTo(L.x, L.z) < TAM_VOI;
    var tacDong = S.gan ? ctx.player.action() : 0;

    if (tacDong > 0 && S.moc < 1) {
      S.moc = Math.min(1, S.moc + dt * TOC_DO_MOC);

      var gd = S.moc < 0.18 ? 'HAT' : S.moc < 0.62 ? 'MAM' : S.moc < 0.94 ? 'CAY' : 'QUA';
      if (gd !== S.giaiDoan) {
        S.giaiDoan = gd;
        if (gd === 'QUA') ketThucChuKy(ctx);
      }
    }
  }

  function ketThucChuKy(ctx) {
    var T = ctx.text;
    ctx.hud.buocNhay(T.nhan.buocNhay, T.phuDinh[S.vong]);
    ctx.audio.diemNut();

    if (S.vong < SO_VONG - 1) {
      /* hạt mới bay sang luống cao hơn */
      var tu = o.luong[S.vong], den = o.luong[S.vong + 1];
      for (var i = 0; i < o.hat.count; i++) sinhHat(i, tu, den);
      S.chuyen = 1.4;
    } else {
      /* chu kỳ cuối: bộc lộ hình dạng */
      S.xong = true;
      S.bay = 0;
      ctx.khoaCamera = true;
      ctx.player.enabled = false;
      ctx.audio.buocNhay();
      o.camTu = ctx.camera.position.clone();
    }
  }

  /* ═══════════ hạt bay ═══════════ */

  function sinhHat(i, tu, den) {
    var t = Math.random();
    o.hat.pos[i * 3]     = tu.x + (Math.random() - 0.5) * 0.4;
    o.hat.pos[i * 3 + 1] = tu.y + 1.1 + Math.random() * 0.3;
    o.hat.pos[i * 3 + 2] = tu.z + (Math.random() - 0.5) * 0.4;
    /* vận tốc hướng về luống kế tiếp, có vồng lên */
    o.hat.vel[i * 3]     = (den.x - tu.x) / 1.4 + (Math.random() - 0.5) * 0.5;
    o.hat.vel[i * 3 + 1] = 1.6 + Math.random() * 0.6;
    o.hat.vel[i * 3 + 2] = (den.z - tu.z) / 1.4 + (Math.random() - 0.5) * 0.5;
    o.hat.life[i] = 1;
    void t;
  }

  function capNhatHat(dt) {
    var co = 0;
    for (var i = 0; i < o.hat.count; i++) {
      if (o.hat.life[i] <= 0) continue;
      co++;
      o.hat.life[i] -= dt * 0.7;
      o.hat.pos[i * 3]     += o.hat.vel[i * 3]     * dt;
      o.hat.pos[i * 3 + 1] += o.hat.vel[i * 3 + 1] * dt;
      o.hat.pos[i * 3 + 2] += o.hat.vel[i * 3 + 2] * dt;
      o.hat.vel[i * 3 + 1] -= dt * 2.2;
      if (o.hat.life[i] <= 0) o.hat.an(i);
    }
    o.hat.capNhat();
    o.hat.pts.material.opacity = co > 0 ? 0.95 : 0;
  }

  /* ═══════════ hình ảnh ═══════════ */

  function hinhAnh(dt, ctx) {
    var t = ctx.clock;

    for (var i = 0; i < o.luong.length; i++) {
      var L = o.luong[i];
      var m = (i < S.vong) ? 1 : (i === S.vong ? S.moc : 0);

      /* hạt biến mất khi mầm nhú — cây phủ định hạt */
      L.hat.visible = (i <= S.vong) && m < 0.18;
      L.hat.rotation.y += dt * 0.8;

      /* thân */
      var caoThan = Math.max(0.001, Math.min(1, (m - 0.12) / 0.55)) * 1.15 * L.co;
      L.than.scale.y += (caoThan - L.than.scale.y) * Math.min(1, dt * 6);
      L.than.position.y = 0.35 + L.than.scale.y / 2;

      /* tán */
      var coTan = Math.max(0, Math.min(1, (m - 0.42) / 0.45)) * L.co;
      L.tan.visible = coTan > 0.01;
      L.tan.scale.setScalar(coTan);
      L.tan.position.y = 0.35 + L.than.scale.y + coTan * 0.28;
      L.tan.rotation.y = t * 0.15 + i;

      /* quả */
      var coQua = Math.max(0, Math.min(1, (m - 0.86) / 0.14));
      for (var k = 0; k < L.qua.length; k++) {
        var q = L.qua[k];
        q.visible = coQua > 0.02;
        if (!q.visible) continue;
        var r = 0.34 * L.co;
        q.position.set(
          Math.cos(q.userData.goc + t * 0.25) * r,
          L.tan.position.y + Math.sin(q.userData.goc * 2.3) * 0.16,
          Math.sin(q.userData.goc + t * 0.25) * r
        );
        q.scale.setScalar(coQua);
      }

      /* vòng sáng + đèn: chỉ luống đang làm mới sáng */
      var dangLam = (i === S.vong && !S.xong);
      var mucVong = dangLam ? (0.45 + Math.sin(t * 2.2) * 0.14) : (i < S.vong ? 0.22 : 0.08);
      L.matVong.opacity += (mucVong - L.matVong.opacity) * Math.min(1, dt * 5);
      L.den.intensity += ((dangLam ? 1.4 : (i < S.vong ? 0.5 : 0)) - L.den.intensity) * Math.min(1, dt * 4);
    }

    capNhatHat(dt);
  }

  /* ═══════════ đoạn camera tự bay cuối phòng ═══════════ */

  function bayLen(dt, ctx) {
    S.bay += dt;

    var T1 = 3.2;                                   // thời gian bay lên
    var k = Math.min(1, S.bay / T1);
    var e = k * k * (3 - 2 * k);                    // mượt hai đầu

    var tren = new THREE.Vector3(0, 11.5, 0.01);
    ctx.camera.position.lerpVectors(o.camTu, tren, e);
    ctx.camera.lookAt(0, 0.6, 0);

    /* vạch dần đường xoắn */
    var veTu = Math.max(0, (S.bay - 1.0) / 2.0);
    o.duong.line.geometry.setDrawRange(0, Math.floor(Math.min(1, veTu) * o.duong.tong));

    if (S.bay > 5.2 && !S.daHienThe) {
      S.daHienThe = true;
      theBaiHoc(ctx);
    }
  }

  /* ═══════════ thẻ nội dung ═══════════ */

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

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var T = ctx.text;

    if (!S.xong) logic(dt, ctx);
    hinhAnh(dt, ctx);
    if (S.xong) bayLen(dt, ctx);

    /* HUD */
    el.v.textContent = Math.min(SO_VONG, S.vong + 1);
    el.g.textContent = T.giaiDoan[S.xong ? 'XONG' : S.giaiDoan];
    el.g.style.color = S.giaiDoan === 'QUA' || S.xong ? '#b86e14' : '';
    el.fill.style.width = (S.moc * 100) + '%';
    el.hat.textContent = SO_HAT[Math.min(SO_VONG - 1, S.vong)];

    ctx.hud.hienPanel(!S.xong && (S.gan || S.moc > 0.02));
    ctx.hud.ngam(!S.xong && S.gan);
    ctx.hud.goiY(S.xong ? T.dangBay : (S.gan ? T.goiYGan : T.goiYXa));
    ctx.hud.hienGoiY(true);
  }

  function dispose(ctx) {
    if (ctx) ctx.khoaCamera = false;
    S = o = el = null;
  }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'phu-dinh',
    tieuDe: 'Phủ định của phủ định',
    nhanNgan: 'Tầng II · Chương 2',
    moTa: 'Hạt thành cây, cây thành hạt. Có thật sự quay về chỗ cũ?',
    goiY: {
      khoa:    'Lại gần luống đất, giữ <kbd>Chuột trái</kbd> để nuôi dưỡng',
      duPhong: 'Lại gần luống đất, giữ <kbd>F</kbd> để nuôi dưỡng'
    },
    build: build,
    update: update,
    dispose: dispose
  });

})(window.TX);
