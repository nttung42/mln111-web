/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — LƯỢNG ĐỔI DẪN ĐẾN CHẤT ĐỔI
   Quy luật chuyển hoá từ những thay đổi về lượng thành những thay đổi
   về chất và ngược lại. (Giáo trình, Chương 2, mục 2.2.2)

   Ánh xạ khái niệm → cơ chế:
     Chất      : ba trạng thái rắn – lỏng – khí
     Lượng     : nhiệt độ; bọt khí và màu nước biến đổi theo
     Độ        : dải 0–100 °C, vẽ nổi trên thanh đo
     Điểm nút  : mốc 0 °C và 100 °C
     Bước nhảy : nhiệt độ ĐỨNG YÊN tại điểm nút, tích luỹ tiếp, rồi bùng
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  /* --- Hai con số quyết định bài học có thấm hay không. Cần thử với
         người thật rồi chỉnh, xem phần Lộ trình tuần 2 trong GDD. --- */
  var TOC_DO_NHIET = 20;    // °C mỗi giây
  var GIU_DIEM_NUT = 2.6;   // giây giữ tại điểm nút để đủ lượng

  var T_MIN = -40, T_MAX = 160;
  var TAM_VOI = 4.2;        // phải lại gần bình mới điều khiển được

  /* Quan hệ giữa các chất quanh mỗi điểm nút */
  var THAP = { 0: 'ICE',   100: 'WATER' };
  var CAO  = { 0: 'WATER', 100: 'STEAM' };

  var S, o, el, daThay, xongLanDau, xongHai;

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    var T = ctx.text;

    S = { temp: 20, chat: 'WATER', chuyen: null, tongNhiet: 0 };
    daThay = { hoi: false, da: false };
    xongLanDau = false;
    xongHai = false;
    o = {};

    TX.dungVoPhong(ctx.scene, { bien: ['LƯỢNG  →  CHẤT', 'phòng I'] });
    o.be = TX.dungBe(ctx.scene);
    ctx.player.blockers = [{ x: 0, z: 0, r: 1.75 }];

    /* vòng đốt dưới đáy bình */
    o.matDot = new THREE.MeshBasicMaterial({ color: 0x2a2118 });
    var dot = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.055, 12, 64), o.matDot);
    dot.rotation.x = Math.PI / 2;
    dot.position.y = 0.93;
    ctx.scene.add(dot);

    o.denDot = new THREE.PointLight(0xff7a2c, 0, 5, 2);
    o.denDot.position.set(0, 1.0, 0);
    ctx.scene.add(o.denDot);

    /* thành bình bằng kính */
    var kinh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 1.7, 48, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0xcfe6ff, roughness: 0.08, metalness: 0,
        transparent: true, opacity: 0.16, side: THREE.DoubleSide
      })
    );
    kinh.position.y = 1.85;
    ctx.scene.add(kinh);

    var matVien = new THREE.MeshStandardMaterial({
      color: TX.MAU.kimLoai, roughness: 0.35, metalness: 0.75
    });
    [2.7, 1.0].forEach(function (y) {
      var v = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.03, 10, 56), matVien);
      v.rotation.x = Math.PI / 2;
      v.position.y = y;
      ctx.scene.add(v);
    });
    var day = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 48), matVien);
    day.position.y = 0.99;
    day.castShadow = true;
    ctx.scene.add(day);

    /* khối nước — chiều cao và màu đổi theo trạng thái */
    o.matNuoc = new THREE.MeshStandardMaterial({
      color: 0x3d8fd6, roughness: 0.15, metalness: 0.05,
      transparent: true, opacity: 0.88, emissive: 0x000000
    });
    o.nuoc = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 1, 48), o.matNuoc);
    o.nuoc.position.y = 1.5;
    o.nuoc.scale.y = 1.45;
    ctx.scene.add(o.nuoc);

    /* lớp tinh thể phủ ngoài khi hoá đá */
    o.matDa = new THREE.MeshStandardMaterial({
      color: 0xdff2ff, roughness: 0.35, metalness: 0.05,
      flatShading: true, transparent: true, opacity: 0
    });
    o.da = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 1), o.matDa);
    o.da.position.y = 1.5;
    o.da.scale.set(1, 1.5, 1);
    o.da.visible = false;
    ctx.scene.add(o.da);

    o.den = TX.dungAnhSang(ctx.scene, o.nuoc);

    o.bot = TX.heHat(ctx.scene, 220, 0xbfe4ff, 0.05, 0.9);
    o.hoi = TX.heHat(ctx.scene, 420, 0xaebcd0, 0.30, 0.22);

    dungPanel(ctx, T);
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function pct(t) { return ((t - T_MIN) / (T_MAX - T_MIN)) * 100; }

  function dungPanel(ctx, T) {
    ctx.hud.datPanel(
      '<div class="readout">' +
        '<div class="temp"><b id="lcT">20</b><span>°C</span></div>' +
        '<div class="phase"><div class="lbl">' + T.nhan.chat + '</div>' +
          '<div class="val" id="lcP"></div></div>' +
      '</div>' +
      '<div class="scale">' +
        '<div class="band" id="lcBand"></div>' +
        '<div class="fill" id="lcFill"></div>' +
        '<div class="cursor" id="lcCur"></div>' +
      '</div>' +
      '<div class="ticks">' +
        '<i id="lcTk0"><b>0°</b>' + T.nhan.diemNut + '</i>' +
        '<i id="lcTk100"><b>100°</b>' + T.nhan.diemNut + '</i>' +
        '<span class="bandlabel" id="lcBL">' + T.nhan.do + '</span>' +
      '</div>' +
      '<div id="lcNode" class="nodebar">' +
        '<div class="cap"><span>' + T.nhan.tichLuy + '</span><span id="lcPct">0%</span></div>' +
        '<div class="track"><div class="bar" id="lcBar"></div></div>' +
      '</div>'
    );

    el = {
      t:    document.getElementById('lcT'),
      p:    document.getElementById('lcP'),
      fill: document.getElementById('lcFill'),
      cur:  document.getElementById('lcCur'),
      node: document.getElementById('lcNode'),
      bar:  document.getElementById('lcBar'),
      pct:  document.getElementById('lcPct')
    };

    var band = document.getElementById('lcBand');
    band.style.left = pct(0) + '%';
    band.style.width = (pct(100) - pct(0)) + '%';
    document.getElementById('lcTk0').style.left = pct(0) + '%';
    document.getElementById('lcTk100').style.left = pct(100) + '%';
    document.getElementById('lcBL').style.left = ((pct(0) + pct(100)) / 2) + '%';
  }

  /* ═══════════ vật lý: lượng, điểm nút, bước nhảy ═══════════ */

  function capNhiet(d, ctx) {
    S.tongNhiet += Math.abs(d);

    /* Đang ở điểm nút: nhiệt độ đứng yên, chỉ tích luỹ về lượng. */
    if (S.chuyen) {
      S.chuyen.p += d / GIU_DIEM_NUT;
      if (S.chuyen.p >= 1)      ketThucChuyen(CAO[S.chuyen.nut], ctx);
      else if (S.chuyen.p <= 0) ketThucChuyen(THAP[S.chuyen.nut], ctx);
      return;
    }

    S.temp += d * TOC_DO_NHIET;

    /* Chạm điểm nút theo chiều đang đi */
    var nuts = d > 0 ? [0, 100] : [100, 0];
    for (var i = 0; i < nuts.length; i++) {
      var n = nuts[i];
      if (d > 0 && S.chat === THAP[n] && S.temp >= n) {
        S.temp = n; S.chuyen = { nut: n, p: 0 }; ctx.audio.diemNut(); break;
      }
      if (d < 0 && S.chat === CAO[n] && S.temp <= n) {
        S.temp = n; S.chuyen = { nut: n, p: 1 }; ctx.audio.diemNut(); break;
      }
    }

    S.temp = Math.max(T_MIN, Math.min(T_MAX, S.temp));
  }

  function ketThucChuyen(chatMoi, ctx) {
    var cu = S.chat;
    S.temp = S.chuyen.nut;
    S.chuyen = null;
    S.chat = chatMoi;
    if (cu !== chatMoi) buocNhay(cu, chatMoi, ctx);
  }

  function buocNhay(cu, moi, ctx) {
    var T = ctx.text;
    ctx.hud.buocNhay(T.nhan.buocNhay, T.nhan_buocNhay[cu + '>' + moi] || '');
    ctx.audio.buocNhay();

    if (moi === 'STEAM') {
      daThay.hoi = true;
      for (var i = 0; i < o.hoi.count; i++) sinhHoi(i, true);
    }
    if (moi === 'ICE') daThay.da = true;

    if (!xongLanDau) {
      xongLanDau = true;
      setTimeout(function () { theBaiHoc(ctx); }, 1150);
    } else if (!xongHai && daThay.hoi && daThay.da) {
      xongHai = true;
      setTimeout(function () { theKetThuc(ctx); }, 1150);
    }
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
      '<h2>' + K.lienHe.tieuDe + '</h2>' +
      '<p>' + K.lienHe.than + '</p>',
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  /* ═══════════ hạt ═══════════ */

  function sinhBot(i) {
    var a = Math.random() * Math.PI * 2, r = Math.random() * 0.5;
    o.bot.pos[i * 3]     = Math.cos(a) * r;
    o.bot.pos[i * 3 + 1] = 1.05 + Math.random() * 0.1;
    o.bot.pos[i * 3 + 2] = Math.sin(a) * r;
    o.bot.vel[i * 3 + 1] = 0.35 + Math.random() * 0.8;
    o.bot.life[i] = 1;
  }

  function sinhHoi(i, no) {
    var a = Math.random() * Math.PI * 2, r = Math.random() * (no ? 0.55 : 0.4);
    o.hoi.pos[i * 3]     = Math.cos(a) * r;
    o.hoi.pos[i * 3 + 1] = 2.7 + Math.random() * 0.15;
    o.hoi.pos[i * 3 + 2] = Math.sin(a) * r;
    o.hoi.vel[i * 3]     = (Math.random() - 0.5) * (no ? 1.6 : 0.35);
    o.hoi.vel[i * 3 + 1] = (no ? 1.6 : 0.5) + Math.random() * 0.9;
    o.hoi.vel[i * 3 + 2] = (Math.random() - 0.5) * (no ? 1.6 : 0.35);
    o.hoi.life[i] = 1;
  }

  function capNhatHat(dt, matNuoc, clock) {
    /* Bọt khí: càng nóng càng nhiều — lượng biến đổi thấy được bằng mắt. */
    var nong = Math.max(0, Math.min(1, (S.temp - 45) / 55));
    var muon = (S.chat === 'WATER') ? nong : 0;
    var quota = muon * 9;

    for (var i = 0; i < o.bot.count; i++) {
      if (o.bot.life[i] > 0) {
        o.bot.pos[i * 3 + 1] += o.bot.vel[i * 3 + 1] * dt * (0.4 + nong);
        o.bot.pos[i * 3]     += Math.sin(clock * 3 + i) * dt * 0.05;
        if (o.bot.pos[i * 3 + 1] > matNuoc) o.bot.an(i);
      } else if (quota > 0 && Math.random() < muon * 0.5) {
        sinhBot(i); quota--;
      }
    }
    o.bot.capNhat();
    o.bot.pts.material.opacity = 0.15 + nong * 0.75;

    /* Hơi nước */
    var quotaH = (S.chat === 'STEAM') ? 5 : 0;
    for (var j = 0; j < o.hoi.count; j++) {
      if (o.hoi.life[j] > 0) {
        o.hoi.life[j] -= dt * 0.42;
        o.hoi.pos[j * 3]     += o.hoi.vel[j * 3]     * dt;
        o.hoi.pos[j * 3 + 1] += o.hoi.vel[j * 3 + 1] * dt;
        o.hoi.pos[j * 3 + 2] += o.hoi.vel[j * 3 + 2] * dt;
        o.hoi.vel[j * 3 + 1] *= (1 - dt * 0.5);
        o.hoi.vel[j * 3 + 1] += dt * 0.45;
        if (o.hoi.life[j] <= 0) o.hoi.an(j);
      } else if (quotaH > 0) {
        sinhHoi(j, false); quotaH--;
      }
    }
    o.hoi.capNhat();
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var trongTam = ctx.player.distTo(0, 0) < TAM_VOI;
    var tacDong = trongTam ? ctx.player.action() : 0;

    if (tacDong !== 0) capNhiet(tacDong * dt, ctx);

    /* --- hình --- */
    var caoDich = S.chat === 'STEAM' ? 0.22 : 1.45;
    o.nuoc.scale.y += (caoDich - o.nuoc.scale.y) * Math.min(1, dt * 3.2);
    o.nuoc.position.y = 1.02 + o.nuoc.scale.y / 2;

    var nong = Math.max(0, Math.min(1, (S.temp - 20) / 80));
    var lanh = Math.max(0, Math.min(1, -S.temp / 40));
    o.matNuoc.color.setRGB(
      0.24 + nong * 0.76,
      0.56 - nong * 0.22 + lanh * 0.20,
      0.84 - nong * 0.62 + lanh * 0.16
    );
    o.matNuoc.emissive.setRGB(nong * 0.35, nong * 0.10, 0);

    var mucDa = S.chat === 'ICE' ? 1 : (S.chuyen && S.chuyen.nut === 0 ? 1 - S.chuyen.p : 0);
    o.matDa.opacity += (mucDa * 0.92 - o.matDa.opacity) * Math.min(1, dt * 4);
    o.da.visible = o.matDa.opacity > 0.01;
    o.da.rotation.y += dt * 0.12;
    o.matNuoc.opacity = 0.88 - mucDa * 0.55;

    var sang = tacDong > 0 ? 1 : 0;
    o.denDot.intensity += (sang * 2.6 - o.denDot.intensity) * Math.min(1, dt * 6);
    o.matDot.color.setRGB(0.16 + sang * 0.84, 0.13 + sang * 0.30, 0.09);

    /* màu đèn phản ứng theo trạng thái — phản hồi rẻ nhất và hiệu quả nhất */
    o.den.roi.color.setRGB(0.86 + sang * 0.14, 0.90, 1.0 - sang * 0.25);

    capNhatHat(dt, 1.02 + o.nuoc.scale.y, ctx.clock);

    /* --- HUD --- */
    var T = ctx.text;
    el.t.textContent = Math.round(S.temp);
    el.p.textContent = T.trangThai[S.chat];
    el.p.style.color = S.chat === 'ICE' ? '#2f7fc1'
                     : S.chat === 'STEAM' ? '#b86e14' : '';

    var p = pct(S.temp);
    el.fill.style.width = p + '%';
    el.cur.style.left = p + '%';

    if (S.chuyen) {
      el.node.classList.add('on');
      var v = Math.max(0, Math.min(1, S.chuyen.p));
      el.bar.style.width = (v * 100) + '%';
      el.pct.textContent = Math.round(v * 100) + '%';
    } else {
      el.node.classList.remove('on');
    }

    ctx.hud.hienPanel(trongTam);
    ctx.hud.hienGoiY(trongTam && tacDong === 0 && !S.chuyen);
    ctx.hud.ngam(trongTam);
  }

  function dispose() { S = o = el = null; }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'luong-chat',
    tieuDe: 'Lượng đổi → Chất đổi',
    nhanNgan: 'Tầng II · Chương 2',
    moTa: 'Một bình nước, và câu hỏi: chất thay đổi vào lúc nào?',
    goiY: {
      khoa:    'Giữ <kbd>Chuột trái</kbd> để cấp nhiệt &nbsp;·&nbsp; Giữ <kbd>Chuột phải</kbd> để làm lạnh',
      duPhong: 'Giữ <kbd>F</kbd> để cấp nhiệt &nbsp;·&nbsp; Giữ <kbd>R</kbd> để làm lạnh &nbsp;·&nbsp; <kbd>Kéo chuột</kbd> để nhìn quanh'
    },
    build: build,
    update: update,
    dispose: dispose
  });

})(window.TX);
