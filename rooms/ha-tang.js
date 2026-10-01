/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — CƠ SỞ HẠ TẦNG VÀ KIẾN TRÚC THƯỢNG TẦNG
   (Giáo trình, Chương 3, mục 3.1.3)

   Hiểu theo nghĩa đen: một khối móng, và những khối lơ lửng bên trên.
   Hai bàn điều khiển, và sự BẤT ĐỐI XỨNG giữa chúng chính là bài học:

     Đổi móng    → toàn bộ tầng trên nứt vỡ và dựng lại. Có thiết chế
                   biến mất hẳn, có thiết chế mới xuất hiện.
     Đẩy tầng trên → móng chỉ dịch được tối đa 18%, rồi tự trở về.

   Chi tiết đắt nhất: ở cơ sở hạ tầng công hữu nguyên thuỷ, khối
   NHÀ NƯỚC và PHÁP LUẬT KHÔNG TỒN TẠI. Nhà nước không có sẵn từ đầu —
   nó ra đời cùng với tư hữu và giai cấp.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var TOC_DO_DOI  = 0.85;   // tiến trình gạt để đổi móng, mỗi giây
  var TOC_DO_DAY  = 0.55;   // tiến trình đẩy tầng trên, mỗi giây
  var TRAN_DAY    = 0.18;   // tác động ngược tối đa — con số của bài học
  var TAM_BAN     = 1.8;
  var BAN_KINH    = 3.9;

  /* Mỗi kiểu cơ sở hạ tầng sinh ra một kiến trúc thượng tầng khác nhau.
     null = thiết chế ấy KHÔNG tồn tại ở cơ sở hạ tầng này. */
  var CAU_HINH = [
    /* 0 · công hữu nguyên thuỷ */
    [null, null, { co: 1.00 }, { co: 0.85 }, { co: 0.95 }],
    /* 1 · tư hữu */
    [{ co: 1.40 }, { co: 1.25 }, { co: 0.85 }, { co: 1.05 }, { co: 0.80 }],
    /* 2 · công hữu trình độ cao */
    [{ co: 0.40, mo: 0.28 }, { co: 0.75, mo: 0.8 }, { co: 1.15 }, { co: 0.65, mo: 0.75 }, { co: 1.30 }]
  ];

  var MAU_MONG = [0x4e7a5a, 0xc4603c, 0x3c78c4];

  /* vị trí gốc của năm khối thượng tầng */
  var VI_TRI = [
    [ 0.00, 3.55,  0.00],
    [-1.05, 2.95,  0.35],
    [ 1.05, 2.95, -0.35],
    [-0.75, 2.35, -0.95],
    [ 0.85, 2.35,  0.90]
  ];

  var S, o, el;

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    S = {
      kieu: 1,              // bắt đầu ở tư hữu — đủ cả năm thiết chế
      gat: 0,               // tiến trình gạt ở bàn móng
      day: 0,               // tiến trình đẩy ở bàn tầng trên
      xay: 0,               // >0: tầng trên đang xây lại
      ban: null,            // 'MONG' | 'TREN' | null
      daDoiMong: false,
      daDayTren: false,
      daChamTran: false,
      nhacT: 0,
      xong: false
    };
    o = { khoi: [] };

    TX.dungVoPhong(ctx.scene, { bien: ['HẠ TẦNG  ·  THƯỢNG TẦNG', 'tầng III'] });

    dungMong(ctx);
    dungThuongTang(ctx);
    dungBan(ctx, 'MONG', -Math.PI / 2, 0xffb469);
    dungBan(ctx, 'TREN',  Math.PI / 2, 0x8fb8ff);

    ctx.player.blockers = [{ x: 0, z: 0, r: 2.6 }];

    o.den = TX.dungAnhSang(ctx.scene, o.mong);
    dungPanel(ctx, ctx.text);
    apDungKieu(ctx, true);
  }

  function dungMong(ctx) {
    o.matMong = new THREE.MeshStandardMaterial({
      color: MAU_MONG[1], roughness: 0.75, metalness: 0.15
    });
    o.mong = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.0, 3.4), o.matMong);
    o.mong.position.y = 0.5;
    o.mong.castShadow = true;
    o.mong.receiveShadow = true;
    ctx.scene.add(o.mong);

    /* vạch sáng viền quanh mặt móng */
    o.matVien = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.25
    });
    var vien = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.04, 3.5), o.matVien);
    vien.position.y = 1.02;
    ctx.scene.add(vien);

    o.nhanMong = nhanChu('', '', 0xffffff, 520, 150);
    o.nhanMong.position.set(0, 1.45, 1.78);
    ctx.scene.add(o.nhanMong);
  }

  function dungThuongTang(ctx) {
    var T = ctx.text.khoi;

    for (var i = 0; i < 5; i++) {
      var mat = new THREE.MeshStandardMaterial({
        color: 0xdfe4ee, roughness: 0.5, metalness: 0.25,
        transparent: true, opacity: 1
      });
      var m = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.5, 0.85), mat);
      m.position.set(VI_TRI[i][0], VI_TRI[i][1], VI_TRI[i][2]);
      m.castShadow = true;
      ctx.scene.add(m);

      var nhan = nhanChu(T[i], '', 0xdfe4ee, 460, 110);
      ctx.scene.add(nhan);

      /* cột nối từ móng lên khối — cái nền sinh ra nó */
      var day = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(VI_TRI[i][0] * 0.35, 1.05, VI_TRI[i][2] * 0.35),
          new THREE.Vector3(VI_TRI[i][0], VI_TRI[i][1], VI_TRI[i][2])
        ]),
        new THREE.LineBasicMaterial({ color: 0xffb469, transparent: true, opacity: 0.22 })
      );
      ctx.scene.add(day);

      o.khoi.push({
        i: i, mesh: m, mat: mat, nhan: nhan, day: day,
        goc: VI_TRI[i].slice(),
        co: 1, coDich: 1, mo: 1, moDich: 1,
        run: 0
      });
    }

    o.manh = TX.heHat(ctx.scene, 240, 0xdfe4ee, 0.06, 0.0);
  }

  function dungBan(ctx, id, goc, mau) {
    var x = Math.cos(goc) * BAN_KINH;
    var z = Math.sin(goc) * BAN_KINH;

    var than = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.44, 1.0, 24),
      new THREE.MeshStandardMaterial({ color: TX.MAU.be, roughness: 0.6, metalness: 0.35 })
    );
    than.position.set(x, 0.5, z);
    than.castShadow = true;
    ctx.scene.add(than);

    var matMat = new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.3 });
    var mat = new THREE.Mesh(new THREE.CircleGeometry(0.3, 28), matMat);
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(x, 1.01, z);
    ctx.scene.add(mat);

    var den = new THREE.PointLight(mau, 0.5, 6, 2);
    den.position.set(x, 1.3, z);
    ctx.scene.add(den);

    var nhan = nhanChu(ctx.text.banDieuKhien[id === 'MONG' ? 'mong' : 'tren'], '', mau, 560, 110);
    nhan.position.set(x, 1.55, z);
    nhan.lookAt(0, 1.55, 0);
    ctx.scene.add(nhan);

    o[id] = { x: x, z: z, matMat: matMat, den: den, mau: mau };
  }

  function nhanChu(dongLon, dongNho, mau, w, h) {
    var c = document.createElement('canvas');
    c.width = w || 460; c.height = h || 130;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.textAlign = 'center';
    g.fillStyle = '#' + mau.toString(16).padStart(6, '0');
    g.font = '600 42px Inter, "Segoe UI", sans-serif';
    g.fillText(dongLon, c.width / 2, dongNho ? 50 : c.height / 2 + 15);
    if (dongNho) {
      g.fillStyle = '#8a8d99';
      g.font = '400 26px Inter, "Segoe UI", sans-serif';
      g.fillText(dongNho, c.width / 2, 96);
    }
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    var m = new THREE.Mesh(
      new THREE.PlaneGeometry((w || 460) / 380, (h || 130) / 380),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.92 })
    );
    m.userData.ve = function (a, b, mau2) {
      g.clearRect(0, 0, c.width, c.height);
      g.textAlign = 'center';
      g.fillStyle = '#' + (mau2 || mau).toString(16).padStart(6, '0');
      g.font = '600 42px Inter, "Segoe UI", sans-serif';
      g.fillText(a, c.width / 2, b ? 50 : c.height / 2 + 15);
      if (b) {
        g.fillStyle = '#8a8d99';
        g.font = '400 26px Inter, "Segoe UI", sans-serif';
        g.fillText(b, c.width / 2, 96);
      }
      tex.needsUpdate = true;
    };
    return m;
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function dungPanel(ctx, T) {
    ctx.hud.datPanel(
      '<div class="readout">' +
        '<div class="temp"><b id="htN">100</b><span>%</span></div>' +
        '<div class="phase"><div class="lbl">' + T.nhan.coSo + '</div>' +
          '<div class="val" id="htK"></div></div>' +
      '</div>' +
      '<div class="scale"><div class="fill" id="htFill"></div></div>' +
      '<div class="ticks">' +
        '<span class="bandlabel" style="left:50%">' + T.nhan.doPhuHop + '</span>' +
      '</div>' +
      '<div id="htNode" class="nodebar">' +
        '<div class="cap"><span>' + T.nhan.tacDongNguoc + '</span><span id="htD">0%</span></div>' +
        '<div class="track"><div class="bar" id="htBar"></div></div>' +
      '</div>'
    );
    el = {
      n:    document.getElementById('htN'),
      k:    document.getElementById('htK'),
      fill: document.getElementById('htFill'),
      node: document.getElementById('htNode'),
      d:    document.getElementById('htD'),
      bar:  document.getElementById('htBar')
    };
  }

  /* ═══════════ đổi cơ sở hạ tầng ═══════════ */

  function apDungKieu(ctx, ngay) {
    var cfg = CAU_HINH[S.kieu];
    var K = ctx.text.kieu[S.kieu];

    for (var i = 0; i < 5; i++) {
      var k = o.khoi[i];
      k.coDich = cfg[i] ? cfg[i].co : 0;
      k.moDich = cfg[i] ? (cfg[i].mo !== undefined ? cfg[i].mo : 1) : 0;
      if (ngay) { k.co = k.coDich; k.mo = k.moDich; }
    }

    o.nhanMong.userData.ve(K.ten, K.mo, MAU_MONG[S.kieu]);
  }

  function doiMong(ctx) {
    S.kieu = (S.kieu + 1) % CAU_HINH.length;
    S.daDoiMong = true;
    S.xay = 1.6;
    S.gat = 0;

    ctx.hud.buocNhay(ctx.text.nhan.buocNhay, ctx.text.kieu[S.kieu].ten);
    ctx.audio.buocNhay();

    /* tầng trên nứt vỡ */
    for (var i = 0; i < o.khoi.length; i++) o.khoi[i].run = 1;
    for (var j = 0; j < o.manh.count; j++) sinhManh(j);

    apDungKieu(ctx, false);
    kiemTraXong(ctx);
  }

  function sinhManh(i) {
    var k = o.khoi[Math.floor(Math.random() * o.khoi.length)];
    o.manh.pos[i * 3]     = k.goc[0] + (Math.random() - 0.5) * 0.8;
    o.manh.pos[i * 3 + 1] = k.goc[1] + (Math.random() - 0.5) * 0.5;
    o.manh.pos[i * 3 + 2] = k.goc[2] + (Math.random() - 0.5) * 0.8;
    o.manh.vel[i * 3]     = (Math.random() - 0.5) * 2.4;
    o.manh.vel[i * 3 + 1] = Math.random() * 1.6;
    o.manh.vel[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
    o.manh.life[i] = 1;
  }

  function kiemTraXong(ctx) {
    if (S.xong || !S.daDoiMong || !S.daDayTren) return;
    S.xong = true;
    setTimeout(function () { theBaiHoc(ctx); }, 2200);
  }

  /* ═══════════ logic ═══════════ */

  function logic(dt, ctx) {
    var dM = ctx.player.distTo(o.MONG.x, o.MONG.z);
    var dT = ctx.player.distTo(o.TREN.x, o.TREN.z);
    S.ban = dM < TAM_BAN ? 'MONG' : (dT < TAM_BAN ? 'TREN' : null);

    var td = S.ban ? ctx.player.action() : 0;

    if (S.xay > 0) { S.xay -= dt; S.gat = 0; return; }

    if (S.ban === 'MONG' && td > 0) {
      S.gat += dt * TOC_DO_DOI;
      if (S.gat >= 1) doiMong(ctx);
    } else {
      S.gat = Math.max(0, S.gat - dt * 1.6);
    }

    if (S.ban === 'TREN' && td > 0) {
      S.daDayTren = true;
      S.day = Math.min(1, S.day + dt * TOC_DO_DAY);
      if (S.day >= 1 && !S.daChamTran) {
        S.daChamTran = true;
        S.nhacT = 6;
        ctx.audio.diemNut();
        kiemTraXong(ctx);
      }
    } else {
      /* buông tay là tầng trên tự trở về theo móng */
      S.day = Math.max(0, S.day - dt * 0.9);
    }
  }

  /* ═══════════ hình ảnh ═══════════ */

  function hinhAnh(dt, ctx) {
    var t = ctx.clock;

    /* móng: màu theo kiểu, và dịch RẤT ít khi bị tầng trên đẩy */
    var mucDay = S.day * TRAN_DAY;
    var mm = new THREE.Color(MAU_MONG[S.kieu]);
    o.matMong.color.lerp(mm, Math.min(1, dt * 3));
    o.mong.position.y = 0.5 + Math.sin(t * 5) * mucDay * 0.05;
    o.mong.rotation.z = Math.sin(t * 3.4) * mucDay * 0.02;
    o.matVien.opacity = 0.22 + mucDay * 1.2;

    o.nhanMong.lookAt(ctx.camera.position);

    /* năm khối thượng tầng */
    for (var i = 0; i < o.khoi.length; i++) {
      var k = o.khoi[i];

      k.co += (k.coDich - k.co) * Math.min(1, dt * (S.xay > 0 ? 2.4 : 5));
      k.mo += (k.moDich - k.mo) * Math.min(1, dt * 4);
      k.run = Math.max(0, k.run - dt * 0.9);

      k.mesh.visible = k.co > 0.02;
      k.mesh.scale.set(k.co, k.co * 0.9, k.co);
      k.mat.opacity = k.mo;

      /* đẩy tầng trên: khối nghiêng và sáng lên, nhưng vẫn bị móng kéo về */
      var lech = S.day * 0.28;
      k.mesh.position.set(
        k.goc[0] + Math.sin(t * 2 + i) * lech,
        k.goc[1] + Math.cos(t * 1.7 + i) * lech * 0.5 + Math.sin(t * 0.8 + i) * 0.03,
        k.goc[2] + Math.cos(t * 2.3 + i) * lech
      );
      k.mesh.rotation.y = Math.sin(t * 0.5 + i) * 0.1 + S.day * 0.5;
      k.mesh.rotation.z = Math.sin(t * 22 + i) * k.run * 0.14;   // rung lúc nứt vỡ

      k.mat.emissive = k.mat.emissive || new THREE.Color(0);
      k.mat.color.setRGB(0.87 + S.day * 0.13, 0.89, 0.93 - S.day * 0.25);

      k.nhan.visible = k.mesh.visible && k.mo > 0.25;
      if (k.nhan.visible) {
        k.nhan.position.copy(k.mesh.position).add(new THREE.Vector3(0, 0.45 * k.co + 0.18, 0));
        k.nhan.lookAt(ctx.camera.position);
        k.nhan.material.opacity = k.mo * 0.92;
      }

      k.day.material.opacity = 0.10 + k.co * 0.16 + (S.xay > 0 ? 0.3 : 0);
    }

    /* mảnh vỡ */
    var co = 0;
    for (var j = 0; j < o.manh.count; j++) {
      if (o.manh.life[j] <= 0) continue;
      co++;
      o.manh.life[j] -= dt * 0.8;
      o.manh.pos[j * 3]     += o.manh.vel[j * 3]     * dt;
      o.manh.pos[j * 3 + 1] += o.manh.vel[j * 3 + 1] * dt;
      o.manh.pos[j * 3 + 2] += o.manh.vel[j * 3 + 2] * dt;
      o.manh.vel[j * 3 + 1] -= dt * 3.2;
      if (o.manh.life[j] <= 0) o.manh.an(j);
    }
    o.manh.capNhat();
    o.manh.pts.material.opacity = co > 0 ? 0.85 : 0;

    /* mặt bàn điều khiển sáng lên khi đứng cạnh */
    ['MONG', 'TREN'].forEach(function (id) {
      var b = o[id];
      var muc = (S.ban === id) ? 0.75 : 0.25;
      b.matMat.opacity += (muc - b.matMat.opacity) * Math.min(1, dt * 6);
      b.den.intensity += (((S.ban === id) ? 1.8 : 0.5) - b.den.intensity) * Math.min(1, dt * 6);
    });

    o.den.roi.intensity = 1.5 + (S.xay > 0 ? 0.6 : 0);
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
      '<p>' + B.lienHe.than + '</p>' +
      '<p class="note">' + B.ghiChuNhaNuoc + '</p>',
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var T = ctx.text;

    if (!S.xong || S.xay > 0) logic(dt, ctx);
    hinhAnh(dt, ctx);

    /* độ phù hợp: tụt khi đang xây lại, và khi tầng trên bị đẩy */
    var phuHop = 100;
    if (S.xay > 0) phuHop = Math.round(30 + (1 - S.xay / 1.6) * 70);
    else phuHop = Math.round(100 - S.day * TRAN_DAY * 100);

    el.n.textContent = phuHop;
    el.k.textContent = T.kieu[S.kieu].ten;
    el.k.style.color = '#' + MAU_MONG[S.kieu].toString(16).padStart(6, '0');
    el.fill.style.width = phuHop + '%';

    el.node.classList.toggle('on', S.daDayTren);
    el.d.textContent = Math.round(S.day * TRAN_DAY * 100) + '%';
    el.bar.style.width = (S.day * 100) + '%';

    ctx.hud.hienPanel(!!S.ban || S.xay > 0);
    ctx.hud.ngam(!!S.ban);

    if (S.nhacT > 0) {
      S.nhacT -= dt;
      ctx.hud.goiY(T.chamTran);
    } else if (S.xay > 0) {
      ctx.hud.goiY(T.dangXay);
    } else if (S.ban === 'MONG') {
      ctx.hud.goiY(T.goiYMong);
    } else if (S.ban === 'TREN') {
      ctx.hud.goiY(T.goiYTren);
    } else {
      ctx.hud.goiY(T.goiYXa);
    }
    ctx.hud.hienGoiY(true);
  }

  function dispose() { S = o = el = null; }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'ha-tang',
    tieuDe: 'Hạ tầng · Thượng tầng',
    nhanNgan: 'Tầng III · Chương 3',
    moTa: 'Một khối móng, năm khối bên trên. Bên nào quyết định bên nào?',
    goiY: {
      khoa:    'Lại gần một bàn điều khiển, giữ <kbd>Chuột trái</kbd>',
      duPhong: 'Lại gần một bàn điều khiển, giữ <kbd>F</kbd>'
    },
    build: build,
    update: update,
    dispose: dispose
  });

})(window.TX);
