/* ═══════════════════════════════════════════════════════════════════
   TRANH TREO TƯỜNG — PHÒNG LÝ LUẬN NHẬN THỨC

   Năm bức tranh theo năm prompt trong tài liệu thiết kế. Ảnh thật (tạo
   bằng AI) đặt vào assets/nhan-thuc/ đúng tên file dưới đây — xem
   README trong thư mục đó. Khi chưa có ảnh, hoặc khi mở game bằng
   file:// (trình duyệt cấm nạp ảnh vào WebGL), mỗi bức được vẽ tạm
   bằng canvas để phòng không bao giờ có khung tranh trống.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.tranhNhanThuc = (function () {
  'use strict';

  var W = 1024, H = 576;

  function nen(g, tren, duoi) {
    var l = g.createLinearGradient(0, 0, 0, H);
    l.addColorStop(0, tren);
    l.addColorStop(1, duoi);
    g.fillStyle = l;
    g.fillRect(0, 0, W, H);
  }

  function quang(g, x, y, r, mau) {
    var q = g.createRadialGradient(x, y, 0, x, y, r);
    q.addColorStop(0, mau);
    q.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = q;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function nguoi(g, x, y, s) {
    g.beginPath(); g.arc(x, y - 62 * s, 16 * s, 0, Math.PI * 2); g.fill();
    g.beginPath();
    g.moveTo(x - 24 * s, y); g.lineTo(x - 18 * s, y - 44 * s);
    g.quadraticCurveTo(x, y - 54 * s, x + 18 * s, y - 44 * s);
    g.lineTo(x + 24 * s, y); g.closePath(); g.fill();
  }

  /* chữ chú thích nhỏ, kiểu khắc trên tranh cổ */
  function chuThich(g, chu, x, y, mau, canh, co) {
    g.save();
    g.font = 'italic 500 ' + (co || 22) + 'px "Cormorant Garamond", Georgia, serif';
    g.textAlign = canh || 'center';
    g.fillStyle = mau;
    g.fillText(chu, x, y);
    g.restore();
  }

  /* người ngồi, nhìn sang phải, cổ bị xích */
  function tuNhan(g, x, y, s) {
    g.beginPath(); g.arc(x, y - 52 * s, 13 * s, 0, Math.PI * 2); g.fill();
    g.beginPath();
    g.moveTo(x - 16 * s, y); g.quadraticCurveTo(x - 20 * s, y - 34 * s, x - 6 * s, y - 40 * s);
    g.lineTo(x + 8 * s, y - 38 * s); g.quadraticCurveTo(x + 18 * s, y - 20 * s, x + 26 * s, y);
    g.closePath(); g.fill();
  }

  /* 1 · Ngụ ngôn hang động — đủ bốn bậc: bóng → vật → lửa → mặt trời */
  function hangDong(g) {
    /* ngoài cửa hang: trời sáng và mặt trời — ý niệm cái Thiện */
    var troi = g.createLinearGradient(0, 0, 0, 260);
    troi.addColorStop(0, '#fff6dc'); troi.addColorStop(1, '#e9c98a');
    g.fillStyle = troi; g.fillRect(0, 0, W, H);
    quang(g, 120, 70, 200, 'rgba(255,250,220,1)');
    quang(g, 120, 70, 60, 'rgba(255,255,255,1)');

    /* khối đá hang, khoét một cửa hang ở góc trên bên trái */
    g.fillStyle = '#1a0f2a';
    g.beginPath();
    g.rect(0, 0, W, H);
    g.moveTo(40, 20);
    g.bezierCurveTo(30, 110, 120, 200, 210, 190);
    g.bezierCurveTo(290, 180, 300, 90, 250, 20);
    g.closePath();
    g.fill('evenodd');

    /* con dốc từ đáy hang lên cửa hang, và một người đang leo ra ánh sáng */
    var doc = g.createLinearGradient(400, 430, 180, 170);
    doc.addColorStop(0, 'rgba(60,40,80,.0)'); doc.addColorStop(1, 'rgba(230,200,150,.55)');
    g.fillStyle = doc;
    g.beginPath(); g.moveTo(170, 185); g.lineTo(240, 182); g.lineTo(470, 440); g.lineTo(380, 440); g.closePath(); g.fill();
    g.fillStyle = '#2a1c18';
    g.beginPath(); g.arc(233, 214, 8, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(226, 222); g.lineTo(240, 222); g.lineTo(246, 252); g.lineTo(222, 252); g.closePath(); g.fill();
    quang(g, 225, 205, 40, 'rgba(255,240,200,.5)');

    /* vách phía phải — nơi in bóng, hắt ánh lửa */
    var vach = g.createRadialGradient(560, 380, 40, 700, 260, 520);
    vach.addColorStop(0, 'rgba(150,90,70,.75)'); vach.addColorStop(1, 'rgba(50,30,70,.9)');
    g.fillStyle = vach;
    g.beginPath(); g.moveTo(560, 40); g.quadraticCurveTo(800, 10, 1010, 50); g.lineTo(1010, 430); g.quadraticCurveTo(780, 450, 560, 420); g.closePath(); g.fill();

    /* ngọn lửa phía sau bức tường thấp */
    quang(g, 330, 400, 300, 'rgba(255,130,50,.45)');
    quang(g, 330, 410, 70, 'rgba(255,220,140,.95)');
    g.fillStyle = 'rgba(255,170,70,.95)';
    g.beginPath(); g.moveTo(300, 430); g.quadraticCurveTo(310, 380, 330, 350); g.quadraticCurveTo(352, 385, 362, 430); g.closePath(); g.fill();

    /* bức tường thấp, người khiêng vật thể giơ cao — "vật" thật */
    g.fillStyle = '#120a1e';
    g.fillRect(380, 420, 330, 26);
    g.fillStyle = '#0c0614';
    [[420, 'ngua'], [520, 'binh'], [620, 'nguoi']].forEach(function (v) {
      var x = v[0];
      g.fillRect(x - 2, 360, 4, 62);                         // cây gậy
      if (v[1] === 'ngua') {
        g.beginPath(); g.ellipse(x, 350, 22, 10, 0, 0, Math.PI * 2); g.fill();
        g.fillRect(x + 14, 330, 6, 18); g.fillRect(x - 16, 352, 4, 14); g.fillRect(x + 10, 352, 4, 14);
      } else if (v[1] === 'binh') {
        g.beginPath(); g.moveTo(x - 6, 330); g.quadraticCurveTo(x - 24, 350, x - 8, 362);
        g.lineTo(x + 8, 362); g.quadraticCurveTo(x + 24, 350, x + 6, 330); g.closePath(); g.fill();
      } else {
        g.beginPath(); g.arc(x, 330, 8, 0, Math.PI * 2); g.fill(); g.fillRect(x - 7, 338, 14, 24);
      }
    });

    /* bóng phóng to trên vách — thứ duy nhất tù nhân từng thấy */
    g.save();
    try { g.filter = 'blur(3px)'; } catch (e) {}
    g.fillStyle = 'rgba(15,5,25,.85)';
    g.beginPath(); g.ellipse(700, 210, 70, 32, 0, 0, Math.PI * 2); g.fill();
    g.fillRect(745, 140, 18, 60); g.fillRect(650, 220, 12, 60); g.fillRect(730, 220, 12, 60);
    g.beginPath(); g.moveTo(830, 120); g.quadraticCurveTo(780, 190, 818, 236);
    g.lineTo(862, 236); g.quadraticCurveTo(900, 190, 850, 120); g.closePath(); g.fill();
    g.beginPath(); g.arc(950, 140, 22, 0, Math.PI * 2); g.fill(); g.fillRect(930, 160, 40, 80);
    g.restore();

    /* hàng tù nhân quay lưng về phía lửa, cổ bị xích — chỉ nhìn được vách */
    g.fillStyle = '#05010a';
    for (var i = 0; i < 6; i++) tuNhan(g, 600 + i * 66, 540, 1.15);
    g.strokeStyle = 'rgba(120,100,140,.7)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(580, 488); g.lineTo(950, 488); g.stroke();

    chuThich(g, 'mặt trời · ý niệm', 130, 160, '#6a4a10');
    chuThich(g, 'lửa', 330, 470, '#ffd9a0');
    chuThich(g, 'vật', 520, 315, '#e8d6ff');
    chuThich(g, 'bóng', 790, 290, '#e8d6ff');
    g.strokeStyle = 'rgba(190,120,255,.55)'; g.lineWidth = 4;
    g.strokeRect(14, 14, W - 28, H - 28);
  }

  /* 2 · Kant: thế giới hiện tượng, cặp kính của chủ thể, và bức tường sương */
  function canhVat(g, x, y, s) {                                /* một cái cây và một ngôi nhà */
    g.beginPath(); g.arc(x, y - 90 * s, 42 * s, 0, Math.PI * 2); g.fill();
    g.fillRect(x - 7 * s, y - 60 * s, 14 * s, 60 * s);
    g.fillRect(x + 70 * s, y - 60 * s, 80 * s, 60 * s);
    g.beginPath(); g.moveTo(x + 60 * s, y - 60 * s); g.lineTo(x + 110 * s, y - 100 * s); g.lineTo(x + 160 * s, y - 60 * s); g.closePath(); g.fill();
  }

  function kant(g) {
    /* trời và đất của thế giới hiện tượng — sáng, rõ */
    var troi = g.createLinearGradient(0, 0, 0, H);
    troi.addColorStop(0, '#d9c8f0'); troi.addColorStop(0.62, '#f3e6d0'); troi.addColorStop(0.63, '#7d6a58'); troi.addColorStop(1, '#4a3c34');
    g.fillStyle = troi; g.fillRect(0, 0, W, H);
    quang(g, 140, 110, 110, 'rgba(255,240,200,.9)');
    g.fillStyle = '#4f7a4a'; canhVat(g, 120, 360, 1.0);
    g.fillStyle = '#b06a4a'; g.fillRect(190, 300, 80, 60);
    g.fillStyle = '#8a4a3a'; g.beginPath(); g.moveTo(180, 300); g.lineTo(230, 260); g.lineTo(280, 300); g.closePath(); g.fill();
    chuThich(g, 'hiện tượng', 170, 420, '#3a2a20');

    /* bức tường sương: dày dần sang phải; sau nó là chính những sự vật ấy — mờ */
    g.save();
    g.globalAlpha = 0.18;
    g.fillStyle = '#3a3048';
    canhVat(g, 760, 360, 1.2);
    g.restore();
    for (var i = 0; i < 26; i++) {
      var x = 560 + i * 18;
      var l = g.createLinearGradient(x, 0, x + 60, 0);
      l.addColorStop(0, 'rgba(200,196,214,0)');
      l.addColorStop(1, 'rgba(200,196,214,' + (0.05 + i * 0.012) + ')');
      g.fillStyle = l;
      g.fillRect(x, 0, 60 + i * 6, H);
    }
    for (i = 0; i < 40; i++) quang(g, 600 + Math.random() * 420, Math.random() * H, 60 + Math.random() * 120, 'rgba(225,220,235,.16)');
    chuThich(g, 'bản chất ?', 820, 420, '#5a5068');

    /* vạch giới hạn dưới chân — nhận thức dừng ở đây */
    g.strokeStyle = '#c9a24a'; g.lineWidth = 4; g.setLineDash([14, 10]);
    g.beginPath(); g.moveTo(560, 372); g.lineTo(560, 576); g.stroke();
    g.setLineDash([]);

    /* Kant: áo choàng, tóc giả, mũ ba góc, gậy — và cặp kính loé sáng */
    g.fillStyle = '#16111c';
    g.beginPath(); g.moveTo(470, 520); g.lineTo(488, 380); g.quadraticCurveTo(510, 360, 532, 380); g.lineTo(548, 520); g.closePath(); g.fill();
    g.beginPath(); g.arc(510, 350, 22, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(482, 336); g.lineTo(538, 336); g.lineTo(510, 314); g.closePath(); g.fill();
    g.fillRect(546, 430, 5, 92);
    g.strokeStyle = '#ffd27a'; g.lineWidth = 2.5;
    g.beginPath(); g.arc(522, 350, 6, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(536, 350, 6, 0, Math.PI * 2); g.stroke();
    quang(g, 530, 350, 26, 'rgba(255,220,140,.6)');
    chuThich(g, 'cặp kính của chủ thể', 470, 300, '#4a3a58', 'right');

    g.fillStyle = 'rgba(120,60,200,.10)'; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(190,120,255,.45)'; g.lineWidth = 4;
    g.strokeRect(14, 14, W - 28, H - 28);
  }

  /* 3 · Ba mặt thực tiễn: sản xuất, xã hội, phòng thí nghiệm */
  function thucTien(g) {
    g.fillStyle = '#120804'; g.fillRect(0, 0, W, H);
    var o = [24, 356, 688];
    o.forEach(function (x0, k) {
      var l = g.createLinearGradient(0, 30, 0, 546);
      l.addColorStop(0, '#ff8a2a'); l.addColorStop(1, '#3a1400');
      g.fillStyle = l; g.fillRect(x0, 30, 312, 516);
      g.strokeStyle = '#ffd700'; g.lineWidth = 4; g.strokeRect(x0, 30, 312, 516);
      g.fillStyle = 'rgba(25,8,0,.9)'; g.strokeStyle = 'rgba(25,8,0,.9)';
      var cx = x0 + 156;
      if (k === 0) {                                  /* bánh răng */
        [[cx - 30, 260, 90, 14], [cx + 80, 380, 55, 10]].forEach(function (b) {
          g.beginPath(); g.arc(b[0], b[1], b[2], 0, Math.PI * 2); g.fill();
          for (var i = 0; i < b[3]; i++) {
            var a = i / b[3] * Math.PI * 2;
            g.save(); g.translate(b[0], b[1]); g.rotate(a);
            g.fillRect(b[2] - 4, -9, 22, 18); g.restore();
          }
          quang(g, b[0], b[1], b[2] * 0.3, 'rgba(255,215,0,.9)');
          g.fillStyle = 'rgba(25,8,0,.9)';
        });
      } else if (k === 1) {                           /* đoàn người, lá cờ */
        for (var i = 0; i < 7; i++) nguoi(g, x0 + 30 + i * 42, 520, 1.1 + (i % 2) * 0.2);
        g.fillRect(cx - 4, 140, 8, 280);
        g.fillStyle = 'rgba(255,215,0,.95)';
        g.beginPath(); g.moveTo(cx + 4, 140); g.quadraticCurveTo(cx + 70, 160, cx + 130, 140);
        g.lineTo(cx + 130, 220); g.quadraticCurveTo(cx + 70, 240, cx + 4, 220); g.closePath(); g.fill();
      } else {                                        /* bình thí nghiệm, kính hiển vi */
        g.beginPath(); g.moveTo(cx - 70, 470); g.lineTo(cx - 20, 320); g.lineTo(cx - 20, 250);
        g.lineTo(cx + 10, 250); g.lineTo(cx + 10, 320); g.lineTo(cx + 60, 470); g.closePath(); g.fill();
        quang(g, cx - 5, 430, 60, 'rgba(255,215,0,.85)');
        g.fillStyle = 'rgba(25,8,0,.9)';
        g.fillRect(cx + 80, 260, 22, 160); g.fillRect(cx + 60, 420, 80, 20);
        g.save(); g.translate(cx + 95, 250); g.rotate(-0.5); g.fillRect(-12, -70, 24, 90); g.restore();
      }
    });
  }

  /* hộp chữ trong sơ đồ */
  function hop(g, x, y, w, h, tieuDe, dong, mau) {
    g.fillStyle = 'rgba(8,20,60,.92)';
    g.beginPath(); g.moveTo(x + 12, y); g.lineTo(x + w - 12, y); g.quadraticCurveTo(x + w, y, x + w, y + 12);
    g.lineTo(x + w, y + h - 12); g.quadraticCurveTo(x + w, y + h, x + w - 12, y + h); g.lineTo(x + 12, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - 12); g.lineTo(x, y + 12); g.quadraticCurveTo(x, y, x + 12, y); g.fill();
    g.strokeStyle = mau; g.lineWidth = 3; g.stroke();
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = mau; g.font = '700 17px "Be Vietnam Pro", sans-serif';
    g.fillText(tieuDe, x + w / 2, y + 20);
    g.fillStyle = '#e8f4ff'; g.font = 'italic 500 17px "Cormorant Garamond", Georgia, serif';
    (dong || []).forEach(function (d, i) { g.fillText(d, x + w / 2, y + 44 + i * 19); });
  }

  function muiTen(g, x1, y1, x2, y2, mau, cong) {
    g.strokeStyle = mau; g.fillStyle = mau; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x1, y1);
    var cx = (x1 + x2) / 2 + (cong ? cong[0] : 0), cy = (y1 + y2) / 2 + (cong ? cong[1] : 0);
    g.quadraticCurveTo(cx, cy, x2, y2); g.stroke();
    var a = Math.atan2(y2 - cy, x2 - cx);
    g.beginPath(); g.moveTo(x2, y2);
    g.lineTo(x2 - 12 * Math.cos(a - 0.45), y2 - 12 * Math.sin(a - 0.45));
    g.lineTo(x2 - 12 * Math.cos(a + 0.45), y2 - 12 * Math.sin(a + 0.45)); g.closePath(); g.fill();
  }

  function taoNho(g, x, y, r, mo) {
    g.save(); g.globalAlpha = mo == null ? 1 : mo;
    var q = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r);
    q.addColorStop(0, '#ff8a7a'); q.addColorStop(1, '#a01020');
    g.fillStyle = q; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#5a3a1a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + 3, y - r - 10); g.stroke();
    g.restore();
  }

  /* 4 · Sơ đồ con đường nhận thức — đúng như trạm III bày ra */
  function nao(g) {
    nen(g, '#030a2a', '#0a0230');
    g.strokeStyle = 'rgba(0,102,255,.12)'; g.lineWidth = 1;
    for (var x = 0; x < W; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
    /* hai tầng */
    g.fillStyle = 'rgba(153,0,255,.10)'; g.fillRect(24, 40, W - 48, 210);
    g.fillStyle = 'rgba(0,140,255,.10)'; g.fillRect(24, 300, W - 48, 236);
    chuThich(g, 'nhận thức lý tính · gián tiếp, trừu tượng, bản chất', 40, 66, '#d6b8ff', 'left');
    chuThich(g, 'nhận thức cảm tính · trực tiếp, sinh động, bề ngoài', 40, 326, '#9fd8ff', 'left');

    /* tầng dưới: quả táo → giác quan → cảm giác → tri giác → biểu tượng */
    taoNho(g, 82, 430, 34);
    var giac = [['mắt', 370], ['tai', 430], ['tay', 490]];
    giac.forEach(function (d) {
      g.fillStyle = '#7fe8ff'; g.beginPath(); g.arc(190, d[1], 15, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#031030'; g.font = '700 13px "Be Vietnam Pro", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(d[0], 190, d[1] + 1);
      muiTen(g, 120, 430, 172, d[1], 'rgba(127,232,255,.7)');
      muiTen(g, 208, d[1], 262, 430, 'rgba(127,232,255,.7)');
    });
    hop(g, 266, 380, 150, 100, 'CẢM GIÁC', ['đỏ · tròn', 'giòn', 'nhẵn · mát'], '#7fe8ff');
    muiTen(g, 418, 430, 452, 430, '#7fe8ff');
    hop(g, 456, 380, 150, 100, 'TRI GIÁC', [], '#7fe8ff');
    taoNho(g, 531, 448, 22);
    muiTen(g, 608, 430, 642, 430, '#7fe8ff');
    hop(g, 646, 380, 150, 100, 'BIỂU TƯỢNG', [], '#7fe8ff');
    g.setLineDash([5, 6]); g.strokeStyle = '#7fe8ff'; g.lineWidth = 2;
    g.beginPath(); g.arc(721, 448, 30, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
    taoNho(g, 721, 448, 20, 0.45);

    /* bước nhảy lên tầng trên */
    muiTen(g, 721, 378, 330, 208, '#ffd27a', [120, -120]);
    chuThich(g, 'bước nhảy', 600, 262, '#ffd27a');

    /* tầng trên: khái niệm → phán đoán → suy luận */
    hop(g, 250, 110, 170, 96, 'KHÁI NIỆM', ['“táo” — quả có', 'vỏ, thịt và hạt'], '#d6b8ff');
    muiTen(g, 422, 158, 462, 158, '#d6b8ff');
    hop(g, 466, 110, 170, 96, 'PHÁN ĐOÁN', ['táo chín thì', 'vỏ đỏ, thịt ngọt'], '#d6b8ff');
    muiTen(g, 638, 158, 678, 158, '#d6b8ff');
    hop(g, 682, 110, 170, 96, 'SUY LUẬN', ['quả này đỏ →', 'quả này đã chín'], '#d6b8ff');

    /* trở về thực tiễn — và vòng lại với sự vật */
    muiTen(g, 852, 158, 930, 400, '#ffb04a', [70, -10]);
    hop(g, 852, 404, 150, 100, 'THỰC TIỄN', ['cắn thử để', 'kiểm tra'], '#ffb04a');
    g.setLineDash([6, 8]);
    muiTen(g, 926, 506, 96, 470, 'rgba(255,176,74,.6)', [0, 70]);
    g.setLineDash([]);

    g.font = 'italic 500 17px "Cormorant Garamond", Georgia, serif'; g.textAlign = 'center'; g.fillStyle = '#ffe2a0';
    g.fillText('“Từ trực quan sinh động đến tư duy trừu tượng, và từ tư duy trừu tượng đến thực tiễn” — Lênin', W / 2, 26, W - 60);
  }

  /* 6 · Hai căn bệnh: kinh nghiệm và giáo điều — và con đường ở giữa */
  function haiBenh(g) {
    nen(g, '#07102e', '#140430');
    /* mặt đất */
    g.fillStyle = '#1a1430'; g.fillRect(0, 440, W, 136);

    /* trái — bệnh kinh nghiệm: ngồi giữa đống "cảm giác", cúi đầu, không ngẩng lên được */
    for (var i = 0; i < 26; i++) {
      var x = 70 + Math.random() * 260, y = 440 - Math.random() * Math.random() * 120;
      g.fillStyle = ['#5ac8ff', '#ff6a7a', '#ffd24a', '#9fe8a0'][i % 4];
      g.globalAlpha = 0.85; g.fillRect(x, y, 22 + Math.random() * 16, 16 + Math.random() * 12); g.globalAlpha = 1;
    }
    g.fillStyle = '#0a0614';
    g.beginPath(); g.arc(200, 368, 18, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(170, 440); g.quadraticCurveTo(168, 392, 196, 382); g.lineTo(214, 384); g.quadraticCurveTo(236, 400, 232, 440); g.closePath(); g.fill();
    chuThich(g, 'bệnh kinh nghiệm', 200, 500, '#9fd8ff');
    chuThich(g, 'gom mãi cảm giác, không chịu khái quát', 200, 526, '#7aa0c8', 'center', 17);

    /* phải — bệnh giáo điều: đứng trên tảng lý luận lơ lửng, xa rời mặt đất */
    g.fillStyle = '#2a1a50';
    g.beginPath(); g.moveTo(700, 210); g.lineTo(940, 210); g.lineTo(900, 250); g.lineTo(740, 250); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(214,184,255,.6)'; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#0a0614';
    g.beginPath(); g.arc(820, 140, 16, 0, Math.PI * 2); g.fill();
    g.fillRect(806, 156, 28, 54);
    g.fillStyle = '#d6b8ff'; g.fillRect(836, 168, 26, 18);              // quyển sách
    g.strokeStyle = 'rgba(214,184,255,.8)'; g.lineWidth = 2;
    [[860, 96, 18], [890, 70, 24], [930, 44, 30]].forEach(function (b) {  // bong bóng ý nghĩ — rỗng
      g.beginPath(); g.arc(b[0], b[1], b[2], 0, Math.PI * 2); g.stroke();
    });
    g.setLineDash([4, 6]); g.strokeStyle = 'rgba(255,138,160,.6)';
    g.beginPath(); g.moveTo(820, 252); g.lineTo(820, 438); g.stroke(); g.setLineDash([]);
    chuThich(g, 'bệnh giáo điều', 820, 500, '#d6b8ff');
    chuThich(g, 'tư duy lơ lửng, xa rời thực tế', 820, 526, '#a08ac8', 'center', 17);

    /* giữa — con đường biện chứng: xoắn đi lên, nối đất với tầng trên */
    g.strokeStyle = '#ffd27a'; g.lineWidth = 5;
    g.beginPath();
    for (var k = 0; k <= 120; k++) {
      var u = k / 120, a = u * Math.PI * 5;
      var px = 512 + Math.cos(a) * (70 - u * 30), py = 440 - u * 300 + Math.sin(a) * 14;
      if (k === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.stroke();
    quang(g, 512, 140, 70, 'rgba(255,220,140,.6)');
    g.fillStyle = '#0a0614';
    g.beginPath(); g.arc(560, 300, 10, 0, Math.PI * 2); g.fill(); g.fillRect(553, 310, 14, 26);
    chuThich(g, 'con đường biện chứng', 512, 500, '#ffd27a');
    chuThich(g, 'cảm tính ⇄ lý tính ⇄ thực tiễn', 512, 526, '#e8c878', 'center', 17);

    g.strokeStyle = 'rgba(190,120,255,.5)'; g.lineWidth = 4; g.strokeRect(14, 14, W - 28, H - 28);
  }

  /* 5 · Thánh đường chân lý */
  function chanLy(g) {
    nen(g, '#fffdf4', '#f1e2b8');
    /* cột cẩm thạch */
    [70, 210, 750, 890].forEach(function (x) {
      var l = g.createLinearGradient(x, 0, x + 64, 0);
      l.addColorStop(0, '#e9e1cf'); l.addColorStop(0.5, '#ffffff'); l.addColorStop(1, '#d8ccb0');
      g.fillStyle = l; g.fillRect(x, 60, 64, 470);
      g.fillStyle = '#c9a24a'; g.fillRect(x - 8, 50, 80, 16); g.fillRect(x - 8, 526, 80, 16);
    });
    /* tia sáng */
    g.save(); g.translate(512, 270);
    for (var i = 0; i < 24; i++) {
      g.rotate(Math.PI / 12);
      g.fillStyle = i % 2 ? 'rgba(255,215,120,.22)' : 'rgba(255,255,255,.5)';
      g.beginPath(); g.moveTo(0, 0); g.lineTo(-16, -420); g.lineTo(16, -420); g.closePath(); g.fill();
    }
    g.restore();
    quang(g, 512, 270, 200, 'rgba(255,240,190,.95)');
    /* viên kim cương */
    g.fillStyle = '#ffffff'; g.strokeStyle = '#c9a24a'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(512, 150); g.lineTo(590, 270); g.lineTo(512, 400); g.lineTo(434, 270); g.closePath();
    g.fill(); g.stroke();
    g.beginPath(); g.moveTo(434, 270); g.lineTo(590, 270); g.moveTo(512, 150); g.lineTo(512, 400); g.stroke();
    g.strokeStyle = '#c9a24a'; g.lineWidth = 6; g.strokeRect(14, 14, W - 28, H - 28);
  }

  return {
    W: W, H: H,
    danhSach: [
      { file: 'tranh-1-hang-dong.jpg',   ve: hangDong },
      { file: 'tranh-2-kant.jpg',        ve: kant },
      { file: 'tranh-3-thuc-tien.jpg',   ve: thucTien },
      { file: 'tranh-4-con-duong.jpg',   ve: nao },
      { file: 'tranh-5-chan-ly.jpg',     ve: chanLy },
      { file: 'tranh-6-hai-benh.jpg',    ve: haiBenh }
    ]
  };
})();
