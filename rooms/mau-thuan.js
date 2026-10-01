/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — THỐNG NHẤT VÀ ĐẤU TRANH CỦA CÁC MẶT ĐỐI LẬP
   (Giáo trình, Chương 2, mục 2.2.2)

   Ba cần gạt, hai trong ba là BẪY HỌC THUẬT cố ý:

     A · TÁCH RỜI       tắt một cực  → lõi chết, hết vận động
     B · HOÀ GIẢI       cân bằng      → lõi đứng yên, không phát triển
     C · CẤP NĂNG LƯỢNG để đấu tranh  → đến độ chín thì chuyển hoá

   Hai lựa chọn đầu không bị phạt, chỉ đơn giản là không dẫn đến đâu.
   Đó chính là bài học: mâu thuẫn là NGUỒN GỐC của vận động và phát
   triển, không phải trở ngại cần loại bỏ.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var TOC_DO_CANG = 0.20;   // độ căng tăng mỗi giây khi cấp năng lượng
  var TU_NGUOI    = 0.07;   // độ căng tự nguội mỗi giây khi buông tay
  var TAM_VOI     = 1.9;    // phải đứng sát cần gạt mới gạt được
  var BAN_KINH    = 3.3;    // ba cần gạt nằm trên vòng tròn này

  var S, o, el;

  /* ═══════════ dựng hình ═══════════ */

  function build(ctx) {
    var T = ctx.text;

    S = {
      cang: 0,
      pha: 'IDLE',
      canGan: null,      // cần gạt người chơi đang đứng cạnh
      soLanDap: 0,       // đếm số lần thử dập tắt mâu thuẫn
      daThuA: false,
      daThuB: false,
      xong: false,
      noT: 0             // đồng hồ hiệu ứng sau khi chuyển hoá
    };
    o = { can: {} };

    TX.dungVoPhong(ctx.scene, { bien: ['MÂU  THUẪN', 'phòng II'] });
    o.be = TX.dungBe(ctx.scene);
    ctx.player.blockers = [{ x: 0, z: 0, r: 1.75 }];

    /* ---------- lõi: hai mặt đối lập ---------- */
    o.loi = new THREE.Group();
    o.loi.position.y = 1.85;
    ctx.scene.add(o.loi);

    o.matDuong = new THREE.MeshStandardMaterial({
      color: 0xff8c3c, emissive: 0xff6a1c, emissiveIntensity: 1.4, roughness: 0.3
    });
    o.matAm = new THREE.MeshStandardMaterial({
      color: 0x4aa3ff, emissive: 0x2c7fd6, emissiveIntensity: 1.4, roughness: 0.3
    });

    o.cucDuong = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 1), o.matDuong);
    o.cucAm    = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 1), o.matAm);
    o.loi.add(o.cucDuong, o.cucAm);

    o.denDuong = new THREE.PointLight(0xff7a2c, 1.2, 7, 2);
    o.denAm    = new THREE.PointLight(0x4aa3ff, 1.2, 7, 2);
    o.loi.add(o.denDuong, o.denAm);

    /* dây nối giữa hai cực — sự thống nhất, nương tựa vào nhau */
    o.matDay = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.30, blending: THREE.AdditiveBlending
    });
    o.day = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 8), o.matDay);
    o.loi.add(o.day);

    /* quầng sáng bao ngoài, phình ra theo độ căng */
    o.matQuang = new THREE.MeshBasicMaterial({
      color: 0xffb469, transparent: true, opacity: 0.05,
      side: THREE.BackSide, blending: THREE.AdditiveBlending
    });
    o.quang = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 16), o.matQuang);
    o.loi.add(o.quang);

    /* tia lửa khi đấu tranh gay gắt */
    o.tia = TX.heHat(ctx.scene, 260, 0xffd9b0, 0.055, 0.0);

    /* ---------- vật thể mới, sinh ra sau khi chuyển hoá ---------- */
    o.matMoi = new THREE.MeshStandardMaterial({
      color: 0xf2efe9, emissive: 0xffb469, emissiveIntensity: 0.9,
      roughness: 0.25, metalness: 0.4, transparent: true, opacity: 0
    });
    o.moi = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 0), o.matMoi);
    o.moi.position.y = 1.85;
    o.moi.visible = false;
    ctx.scene.add(o.moi);

    /* ---------- ba cần gạt ---------- */
    dungCan(ctx, 'A', -Math.PI / 2,            0xff5a4a);
    dungCan(ctx, 'B',  Math.PI / 2 - 2.094,    0x8a8d99);
    dungCan(ctx, 'C',  Math.PI / 2 + 2.094,    0xffb469);

    o.den = TX.dungAnhSang(ctx.scene, o.loi);

    dungPanel(ctx, T);
  }

  function dungCan(ctx, id, goc, mau) {
    var x = Math.cos(goc) * BAN_KINH;
    var z = Math.sin(goc) * BAN_KINH;

    var than = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.30, 1.05, 24),
      new THREE.MeshStandardMaterial({ color: TX.MAU.be, roughness: 0.6, metalness: 0.35 })
    );
    than.position.set(x, 0.52, z);
    than.castShadow = true;
    ctx.scene.add(than);

    var matVong = new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.35 });
    var vong = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 10, 40), matVong);
    vong.rotation.x = Math.PI / 2;
    vong.position.set(x, 1.07, z);
    ctx.scene.add(vong);

    /* biển chữ nhỏ trên mỗi cần gạt */
    var T = ctx.text.can[id];
    var bien = bienNho(T.ten, T.mo, mau);
    bien.position.set(x, 1.55, z);
    bien.lookAt(0, 1.55, 0);
    ctx.scene.add(bien);

    o.can[id] = { x: x, z: z, vong: vong, matVong: matVong, bien: bien, mau: mau };
    ctx.player.blockers.push({ x: x, z: z, r: 0.55 });
  }

  function bienNho(dongLon, dongNho, mau) {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 160;
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    g.textAlign = 'center';
    g.fillStyle = '#' + mau.toString(16).padStart(6, '0');
    g.font = '600 44px Inter, "Segoe UI", sans-serif';
    g.fillText(dongLon, c.width / 2, 62);
    g.fillStyle = '#8a8d99';
    g.font = '400 27px Inter, "Segoe UI", sans-serif';
    g.fillText(dongNho, c.width / 2, 108);

    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.47),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.9 })
    );
  }

  /* ═══════════ bảng chỉ số ═══════════ */

  function dungPanel(ctx, T) {
    ctx.hud.datPanel(
      '<div class="readout">' +
        '<div class="temp"><b id="mtC">0</b><span>%</span></div>' +
        '<div class="phase"><div class="lbl">' + T.nhan.trangThai + '</div>' +
          '<div class="val" id="mtS"></div></div>' +
      '</div>' +
      '<div class="scale">' +
        '<div class="fill" id="mtFill"></div>' +
        '<div class="cursor" id="mtCur" style="left:100%"></div>' +
      '</div>' +
      '<div class="ticks">' +
        '<i style="left:0"><b>0%</b>THỐNG NHẤT</i>' +
        '<i style="left:100%"><b>100%</b>' + T.nhan.doChin + '</i>' +
        '<span class="bandlabel" style="left:50%">' + T.nhan.doCang + '</span>' +
      '</div>' +
      '<div id="mtNode" class="nodebar">' +
        '<div class="cap"><span>' + T.nhan.soLanDap + '</span><span id="mtDap">0</span></div>' +
      '</div>'
    );

    el = {
      c:    document.getElementById('mtC'),
      s:    document.getElementById('mtS'),
      fill: document.getElementById('mtFill'),
      node: document.getElementById('mtNode'),
      dap:  document.getElementById('mtDap')
    };
  }

  /* ═══════════ khi bước vào ═══════════ */

  function onEnter(ctx) {
    o.nen = ctx.audio.canhNen();
  }

  /* ═══════════ mỗi khung hình ═══════════ */

  function update(dt, ctx) {
    var T = ctx.text;

    /* --- cần gạt nào đang trong tầm với --- */
    S.canGan = null;
    for (var id in o.can) {
      if (ctx.player.distTo(o.can[id].x, o.can[id].z) < TAM_VOI) { S.canGan = id; break; }
    }
    var tacDong = S.canGan ? ctx.player.action() : 0;

    if (!S.xong) logic(dt, tacDong, ctx);
    hinhAnh(dt, ctx);
    hud(ctx, T, tacDong);
  }

  function logic(dt, tacDong, ctx) {
    var T = ctx.text;
    var giu = tacDong > 0;

    if (S.canGan === 'A' && giu) {
      /* Tắt một cực → không còn mặt đối lập → hết vận động */
      if (S.pha !== 'SUPPRESSED') { S.pha = 'SUPPRESSED'; demDap(ctx, 'A'); }
      S.cang = Math.max(0, S.cang - dt * 0.9);

    } else if (S.canGan === 'B' && giu) {
      /* Hoà giải → cân bằng chết, cũng không phát triển */
      if (S.pha !== 'RECONCILED') { S.pha = 'RECONCILED'; demDap(ctx, 'B'); }
      S.cang = Math.max(0, S.cang - dt * 0.9);

    } else if (S.canGan === 'C' && tacDong !== 0) {
      /* Để hai cực đấu tranh */
      S.pha = 'IDLE';
      S.cang += tacDong * dt * TOC_DO_CANG;
      S.cang = Math.max(0, Math.min(1, S.cang));
      if (S.cang >= 1) chuyenHoa(ctx);

    } else {
      /* buông tay: lõi hồi phục, độ căng tự nguội dần */
      S.pha = 'IDLE';
      S.cang = Math.max(0, S.cang - dt * TU_NGUOI);
    }
  }

  function demDap(ctx, can) {
    S.soLanDap++;
    if (can === 'A') S.daThuA = true;
    if (can === 'B') S.daThuB = true;

    /* Thử đủ cả hai bẫy rồi mà vẫn chưa ra thì nhắc một câu, đúng một lần. */
    if (S.daThuA && S.daThuB && !S.daNhac) {
      S.daNhac = true;
      S.nhacT = 6;                     // hiện 6 giây rồi trả lại gợi ý thường
    }
  }

  function chuyenHoa(ctx) {
    var T = ctx.text;
    S.xong = true;
    S.pha = 'RESOLVED';
    S.cang = 1;
    S.noT = 0;

    ctx.hud.buocNhay(T.nhan.buocNhay, 'MÂU THUẪN → DẠNG MỚI');
    ctx.audio.buocNhay();
    if (o.nen) o.nen.set(0);

    /* hai cực văng ra thành tia lửa */
    for (var i = 0; i < o.tia.count; i++) sinhTia(i, true);

    o.moi.visible = true;
    setTimeout(function () { theBaiHoc(ctx); }, 1400);
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

    var nhacDap = S.soLanDap > 0
      ? '<p class="note">' + B.nhacDap.replace('%n', S.soLanDap) + '</p>'
      : '';

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
      nhacDap,
      TX.VI.game.veSanh,
      function () { ctx.veSanh(); }
    );
  }

  /* ═══════════ tia lửa ═══════════ */

  function sinhTia(i, no) {
    var a = Math.random() * Math.PI * 2;
    var b = Math.acos(2 * Math.random() - 1);
    var v = no ? (1.8 + Math.random() * 2.2) : (0.5 + Math.random() * 0.9);
    o.tia.pos[i * 3]     = 0;
    o.tia.pos[i * 3 + 1] = 1.85;
    o.tia.pos[i * 3 + 2] = 0;
    o.tia.vel[i * 3]     = Math.sin(b) * Math.cos(a) * v;
    o.tia.vel[i * 3 + 1] = Math.cos(b) * v;
    o.tia.vel[i * 3 + 2] = Math.sin(b) * Math.sin(a) * v;
    o.tia.life[i] = 1;
  }

  function capNhatTia(dt) {
    var muon = S.xong ? 0 : Math.max(0, (S.cang - 0.35)) * 6;
    for (var i = 0; i < o.tia.count; i++) {
      if (o.tia.life[i] > 0) {
        o.tia.life[i] -= dt * (S.xong ? 0.55 : 1.5);
        o.tia.pos[i * 3]     += o.tia.vel[i * 3]     * dt;
        o.tia.pos[i * 3 + 1] += o.tia.vel[i * 3 + 1] * dt;
        o.tia.pos[i * 3 + 2] += o.tia.vel[i * 3 + 2] * dt;
        o.tia.vel[i * 3 + 1] -= dt * 1.2;
        if (o.tia.life[i] <= 0) o.tia.an(i);
      } else if (muon > 0) {
        sinhTia(i, false); muon--;
      }
    }
    o.tia.capNhat();
    o.tia.pts.material.opacity = S.xong ? 0.9 : Math.max(0, (S.cang - 0.3)) * 1.3;
  }

  /* ═══════════ hình ảnh ═══════════ */

  function hinhAnh(dt, ctx) {
    var t = ctx.clock;

    if (S.xong) {
      /* sau chuyển hoá: hai cực tắt, dạng mới nổi lên */
      S.noT += dt;
      o.cucDuong.visible = o.cucAm.visible = o.day.visible = false;
      o.denDuong.intensity = o.denAm.intensity = 0;
      o.matQuang.opacity = Math.max(0, 0.35 - S.noT * 0.2);
      o.matMoi.opacity = Math.min(1, S.noT * 0.9);
      o.moi.position.y = 1.85 + Math.min(0.55, S.noT * 0.35) + Math.sin(t * 1.2) * 0.04;
      o.moi.rotation.y += dt * 0.5;
      o.moi.rotation.x += dt * 0.2;
      o.moi.scale.setScalar(0.6 + Math.min(0.4, S.noT * 0.5));
      capNhatTia(dt);
      return;
    }

    var song = S.pha === 'SUPPRESSED' ? 0
             : S.pha === 'RECONCILED' ? 0
             : 1;

    /* Bán kính đập nhịp: vừa hút vừa đẩy. Càng căng càng nhanh, càng xa. */
    var nhip = Math.sin(t * (1.6 + S.cang * 7)) * (0.10 + S.cang * 0.34);
    var r = (S.pha === 'RECONCILED' ? 0.0 : 0.42 + nhip) * (S.pha === 'SUPPRESSED' ? 0.35 : 1);
    var goc = S.quay = (S.quay || 0) + dt * song * (0.7 + S.cang * 4.5);

    o.cucDuong.position.set(Math.cos(goc) * r, Math.sin(goc * 0.7) * r * 0.35,  Math.sin(goc) * r);
    o.cucAm.position.set(-Math.cos(goc) * r, -Math.sin(goc * 0.7) * r * 0.35, -Math.sin(goc) * r);

    var spin = dt * (1 + S.cang * 6);
    o.cucDuong.rotation.y += spin;
    o.cucAm.rotation.y -= spin;
    o.denDuong.position.copy(o.cucDuong.position);
    o.denAm.position.copy(o.cucAm.position);

    /* dây nối: nối đúng hai cực */
    var kc = o.cucDuong.position.distanceTo(o.cucAm.position);
    o.day.visible = kc > 0.02;
    if (o.day.visible) {
      o.day.position.set(0, 0, 0);
      o.day.scale.set(1, kc, 1);
      o.day.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        o.cucDuong.position.clone().sub(o.cucAm.position).normalize()
      );
    }

    /* Bị tắt hoặc hoà giải: lõi mờ đi, ánh sáng phẳng lại. */
    var mucA = S.pha === 'SUPPRESSED' ? 0.04 : 1;
    var deu   = S.pha === 'RECONCILED' ? 1 : 0;

    o.matAm.emissiveIntensity += (1.4 * mucA - o.matAm.emissiveIntensity) * Math.min(1, dt * 5);
    o.denAm.intensity += (1.2 * mucA * (1 + S.cang) - o.denAm.intensity) * Math.min(1, dt * 5);
    o.denDuong.intensity += (1.2 * (1 + S.cang) - o.denDuong.intensity) * Math.min(1, dt * 5);
    o.matDuong.emissiveIntensity = 1.4 + S.cang * 1.6;

    /* cân bằng chết: hai màu nhoà về cùng một sắc xám */
    o.matDuong.color.setRGB(1 - deu * 0.35, 0.55 + deu * 0.03, 0.24 + deu * 0.35);
    o.matAm.color.setRGB(0.29 + deu * 0.36, 0.64 - deu * 0.06, 1 - deu * 0.41);

    o.matDay.opacity = 0.18 + S.cang * 0.5;
    o.matQuang.opacity = 0.03 + S.cang * 0.22;
    o.quang.scale.setScalar(0.9 + S.cang * 0.45 + Math.sin(t * 3) * 0.02);

    o.den.roi.intensity = 1.5 - S.cang * 0.5;   // càng căng, phòng càng chỉ còn lõi sáng

    capNhatTia(dt);
    if (o.nen) o.nen.set(S.pha === 'IDLE' ? S.cang : 0);
  }

  /* ═══════════ HUD ═══════════ */

  function hud(ctx, T, tacDong) {
    var gan = !!S.canGan;

    el.c.textContent = Math.round(S.cang * 100);
    el.s.textContent = T.trangThai[S.pha];
    el.s.style.color = S.pha === 'SUPPRESSED' ? '#ff7a6a'
                     : S.pha === 'RECONCILED' ? '#8a8d99'
                     : S.pha === 'RESOLVED'   ? '#ffd9b0' : '#e8e6e1';
    el.fill.style.width = (S.cang * 100) + '%';

    el.node.classList.toggle('on', S.soLanDap > 0);
    el.dap.textContent = S.soLanDap;

    /* vòng sáng trên cần gạt đang đứng cạnh */
    for (var id in o.can) {
      var c = o.can[id];
      var muc = (id === S.canGan) ? (tacDong > 0 ? 1.0 : 0.75) : 0.3;
      c.matVong.opacity += (muc - c.matVong.opacity) * 0.2;
      c.vong.scale.setScalar(1 + (id === S.canGan ? 0.18 : 0));
    }

    ctx.hud.hienPanel(gan || S.cang > 0.02);
    ctx.hud.ngam(gan);

    if (S.nhacT > 0) {
      S.nhacT -= ctx.dt;
      ctx.hud.goiY(T.nhacNho);
      ctx.hud.hienGoiY(!S.xong);
    } else {
      ctx.hud.goiY(gan ? T.goiYCan[S.canGan] : T.goiYXa);
      ctx.hud.hienGoiY(!S.xong);
    }
  }

  function dispose() {
    if (o && o.nen) o.nen.stop();
    S = o = el = null;
  }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'mau-thuan',
    tieuDe: 'Mâu thuẫn',
    nhanNgan: 'Tầng II · Chương 2',
    moTa: 'Hai cực đối lập và ba cần gạt. Cái nào làm lõi phát triển?',
    goiY: {
      khoa:    'Lại gần một cần gạt, giữ <kbd>Chuột trái</kbd>',
      duPhong: 'Lại gần một cần gạt, giữ <kbd>F</kbd>'
    },
    build: build,
    onEnter: onEnter,
    update: update,
    dispose: dispose
  });

})(window.TX);
