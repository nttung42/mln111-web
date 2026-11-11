/* ═══════════════════════════════════════════════════════════════════
   ÂM THANH — TRẠM I, PHÒNG LÝ LUẬN NHẬN THỨC

   Tổng hợp hoàn toàn bằng WebAudio như phần còn lại của game: không
   file, không bản quyền. Mọi nguồn âm đặt đúng chỗ trong không gian
   (PannerNode HRTF) nên lại gần vật nào thì nghe vật đó, quay đầu thì
   tiếng đổi tai.

     Không khí  tiếng trầm u ám, gió hang, giọt nước rơi có vọng —
                hang động Platon, sự mò mẫm trong bóng tối.
     Ngọn nến   lửa lách tách. Giữ: hợp âm lung linh dâng lên, mỗi lần
                ý niệm đổi hình có tiếng "vút" và một tiếng chuông.
                Buông tay: âm tan như khói — ý niệm chỉ sống trong đầu.
     Rương      lồng năng lượng ù ù. Giữ: âm căng dần rồi KẸT ở 92%,
                kèm tiếng "cộc" chạm trần, càng giữ càng gằn — bế tắc.
                Khi thực tiễn mở rương: chuỗi chuông đi lên.
     Gương      âm thuỷ tinh, giữ lâu càng rung lệch. Xong: tiếng "ping"
                và tiếng vọng trả về thấp hơn, méo đi — phản ánh thụ động.
     Xong trạm  hợp âm thứ trầm, nghịch tai — "bế tắc".
     Mở cửa     màn năng lượng tan, lấp lánh.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.amNhanThuc = (function () {
  'use strict';

  /* ---------- nguyên liệu ---------- */

  function taoNhieu(a, giay, nau) {
    var n = Math.floor(a.sampleRate * giay);
    var b = a.createBuffer(1, n, a.sampleRate);
    var d = b.getChannelData(0), cuoi = 0;
    for (var i = 0; i < n; i++) {
      var trang = Math.random() * 2 - 1;
      if (nau) {
        cuoi = (cuoi + 0.02 * trang) / 1.02;      // nhiễu nâu: trầm, như gió
        d[i] = cuoi * 3.5;
      } else {
        d[i] = trang;
      }
    }
    return b;
  }

  /* tiếng vọng hang đá: nhiễu tắt dần theo hàm mũ */
  function xungVang(a, giay, suy) {
    var n = Math.floor(a.sampleRate * giay);
    var b = a.createBuffer(2, n, a.sampleRate);
    for (var k = 0; k < 2; k++) {
      var d = b.getChannelData(k);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, suy);
    }
    return b;
  }

  function datViTri(nut, p) {
    if (nut.positionX) {
      nut.positionX.value = p[0]; nut.positionY.value = p[1]; nut.positionZ.value = p[2];
    } else {
      nut.setPosition(p[0], p[1], p[2]);
    }
  }

  /* đường bao: lên nhanh, tắt dần — cho các tiếng ngắn */
  function bao(a, g, t, dinh, len, tat) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(dinh, t + len);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len + tat);
  }

  /* ═══════════ dựng ═══════════
     vt: toạ độ các nguồn âm { nen, ruong, guong, cua, tram: [zTu, zDen] } */

  function tao(a, vt) {
    var nguon = [];
    var t0 = a.currentTime;

    var ra = a.createGain();
    ra.gain.setValueAtTime(0, t0);
    ra.gain.setTargetAtTime(0.9, t0, 0.8);          // vào phòng: âm dâng lên từ từ
    ra.connect(a.destination);

    var vang = a.createConvolver();
    vang.buffer = xungVang(a, 2.8, 2.4);
    var guiVang = a.createGain();
    guiVang.gain.value = 0.5;
    guiVang.connect(vang);
    vang.connect(ra);

    var trang = taoNhieu(a, 3, false), nau = taoNhieu(a, 4, true);

    function osc(kieu, f) {
      var o = a.createOscillator();
      o.type = kieu;
      o.frequency.value = f;
      o.start();
      nguon.push(o);
      return o;
    }
    function nhieuLap(buf) {
      var s = a.createBufferSource();
      s.buffer = buf;
      s.loop = true;
      s.start(0, Math.random() * buf.duration);
      nguon.push(s);
      return s;
    }
    function gain(v, den) {
      var g = a.createGain();
      g.gain.value = v;
      if (den) g.connect(den);
      return g;
    }
    function loc(kieu, f, q, den) {
      var b = a.createBiquadFilter();
      b.type = kieu;
      b.frequency.value = f;
      if (q != null) b.Q.value = q;
      if (den) b.connect(den);
      return b;
    }
    /* một điểm phát âm trong không gian, có gửi sang tiếng vọng */
    function diem(p, guiVangMuc, bus) {
      var pn = a.createPanner();
      pn.panningModel = 'HRTF';
      pn.distanceModel = 'inverse';
      /* máy lớn trong xưởng (có bus riêng) vang xa hơn đạo cụ nhỏ ở trạm I */
      pn.refDistance = bus ? 2.5 : 1.2;
      pn.rolloffFactor = bus ? 0.7 : 1.3;
      pn.maxDistance = 40;
      datViTri(pn, p);
      pn.connect(bus || ra);
      if (guiVangMuc) pn.connect(gain(guiVangMuc, guiVang));
      return pn;
    }

    /* ---------- không khí trạm I ---------- */
    var khi = gain(0, ra);
    khi.connect(gain(0.45, guiVang));

    var tram = gain(0.04, khi);
    var locTram = loc('lowpass', 420, 0.5, tram);
    [[55, 'sine', 0.6], [82.41, 'sine', 0.5], [110.6, 'triangle', 0.3]].forEach(function (c) {
      osc(c[1], c[0]).connect(gain(c[2], locTram));
    });
    osc('sine', 0.07).connect(gain(0.02, tram.gain));          // thở chậm

    var gio = gain(0.06, khi);
    var locGio = loc('bandpass', 320, 0.8, gio);
    nhieuLap(nau).connect(locGio);
    osc('sine', 0.045).connect(gain(180, locGio.frequency));   // gió lúc to lúc nhỏ

    /* ---------- ngọn nến ---------- */
    var pNen = diem(vt.nen, 0.3);
    var thoLua = gain(0.035, pNen);
    nhieuLap(nau).connect(loc('lowpass', 380, 0.7, thoLua));

    var moNen = gain(0, pNen);
    var locMo = loc('lowpass', 2600, 0.3, moNen);
    [440, 523.25, 659.25, 987.77].forEach(function (f) {
      [-4, 4].forEach(function (c) {
        var o = osc('sine', f);
        o.detune.value = c;                              // hai giọng lệch nhau một chút: lung linh
        o.connect(gain(0.1, locMo));
      });
    });

    /* ---------- rương bản chất ---------- */
    var pRuong = diem(vt.ruong, 0.35);
    var long = gain(0.012, pRuong);
    osc('sine', 220).connect(long);
    osc('sine', 221.7).connect(long);                   // hai tần số sát nhau: tiếng ù đập nhịp

    var cang = gain(0, pRuong);
    var locCang = loc('lowpass', 300, 4, cang);
    var oCang = osc('sawtooth', 110);
    oCang.connect(locCang);

    var amMo = gain(0, pRuong);
    osc('sine', 261.63).connect(gain(0.5, amMo));
    osc('sine', 392.0).connect(gain(0.35, amMo));

    /* ---------- tấm gương ---------- */
    var pGuong = diem(vt.guong, 0.4);
    var kinh = gain(0, pGuong);
    var k1 = osc('sine', 660), k2 = osc('sine', 990);
    k1.connect(kinh);
    k2.connect(gain(0.6, kinh));
    var run = osc('sine', 5.5);
    var sauRun1 = gain(0, k1.frequency), sauRun2 = gain(0, k2.frequency);
    run.connect(sauRun1);
    run.connect(sauRun2);

    /* ═══════════ tiếng ngắn ═══════════ */

    function nhieuNgan(den, t, dai, kieu, f, q, dinh) {
      var s = a.createBufferSource();
      s.buffer = trang;
      var g = gain(0, den);
      var b = loc(kieu, f, q, g);
      s.connect(b);
      bao(a, g, t, dinh, 0.002, dai);
      s.start(t, Math.random() * 2, dai + 0.05);
      return b;
    }

    function chuong(den, t, f, dinh, tat) {
      var o = a.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      var o2 = a.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = f * 2.76;                    // bội âm không hoà: giống chuông kim loại
      var g = gain(0, den), g2 = gain(0, den);
      o.connect(g);
      o2.connect(g2);
      bao(a, g, t, dinh, 0.004, tat);
      bao(a, g2, t, dinh * 0.3, 0.003, tat * 0.4);
      o.start(t); o.stop(t + tat + 0.1);
      o2.start(t); o2.stop(t + tat + 0.1);
    }

    /* "vút": nhiễu quét qua bộ lọc */
    function vut(den, t, tu, toi, dai, dinh) {
      var b = nhieuNgan(den, t, dai, 'bandpass', tu, 2.5, dinh);
      b.frequency.setValueAtTime(tu, t);
      b.frequency.exponentialRampToValueAtTime(toi, t + dai);
    }

    function giotNuoc() {
      var t = a.currentTime;
      var p = [vt.tram.x[0] + Math.random() * (vt.tram.x[1] - vt.tram.x[0]), 3 + Math.random() * 2,
               vt.tram.z[0] + Math.random() * (vt.tram.z[1] - vt.tram.z[0])];
      var pn = diem(p, 0.9);
      var o = a.createOscillator();
      var f = 1200 + Math.random() * 1400;
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.55, t + 0.06);
      var g = gain(0, pn);
      o.connect(g);
      bao(a, g, t, 0.05, 0.002, 0.22);
      o.start(t);
      o.stop(t + 0.3);
      setTimeout(function () { try { pn.disconnect(); } catch (e) {} }, 3500);   // hết vọng thì gỡ
    }

    function lachTach() {
      var t = a.currentTime;
      nhieuNgan(pNen, t, 0.008 + Math.random() * 0.02, 'highpass', 1800 + Math.random() * 2000, 0.7,
                0.03 + Math.random() * 0.07);
    }

    function doiHinh() {
      var t = a.currentTime;
      vut(pNen, t, 400, 2600, 0.9, 0.05);
      var ngu = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
      chuong(pNen, t + 0.25, ngu[Math.random() * ngu.length | 0], 0.035, 2.2);
    }

    function tanBien() {
      vut(pNen, a.currentTime, 2400, 180, 1.3, 0.045);
    }

    function chamTran() {
      var t = a.currentTime;
      var o = a.createOscillator();
      o.frequency.setValueAtTime(90, t);
      o.frequency.exponentialRampToValueAtTime(38, t + 0.25);
      var g = gain(0, pRuong);
      o.connect(g);
      bao(a, g, t, 0.22, 0.004, 0.35);
      o.start(t); o.stop(t + 0.45);
      var k = a.createOscillator();
      k.type = 'triangle';
      k.frequency.value = 1750;
      var gk = gain(0, pRuong);
      k.connect(gk);
      bao(a, gk, t, 0.05, 0.002, 0.08);
      k.start(t); k.stop(t + 0.15);
    }

    function moRuong() {
      var t = a.currentTime;
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
        chuong(pRuong, t + i * 0.11, f, 0.06, 2.6);
      });
      vut(pRuong, t, 300, 3200, 1.4, 0.05);
    }

    function pingGuong() {
      var t = a.currentTime;
      chuong(pGuong, t, 330, 0.07, 1.6);
      chuong(pGuong, t + 0.38, 311.1, 0.035, 1.8);          // tiếng vọng thấp hơn, lệch đi
    }

    function beTac() {
      var t = a.currentTime;
      var g = gain(0, khi);
      g.connect(gain(0.6, guiVang));
      var l = loc('lowpass', 900, 0.5, g);
      [110, 130.81, 164.81, 155.56].forEach(function (f, i) {   // La thứ, rồi Mi giáng chen vào
        var o = a.createOscillator();
        o.type = 'triangle';
        o.frequency.value = f;
        var gi = gain(i === 3 ? 0 : 0.3, l);
        if (i === 3) gi.gain.setValueAtTime(0.0001, t).exponentialRampToValueAtTime(0.25, t + 1.2);
        o.connect(gi);
        o.start(t); o.stop(t + 4.2);
      });
      bao(a, g, t, 0.08, 0.3, 3.6);
    }

    /* ═══════════ TIẾNG MỞ CỬA — chung cho ba cửa và cổng ra ═══════════
       Tiếng nổ trầm, màn năng lượng rã ra lách tách, rồi một hợp âm dâng
       lên mang màu của trạm phía bên kia cửa:
         cửa I → II   Rê trưởng ấm      — bước vào xưởng thực tiễn
         cửa II → III Mi thứ thêm 9, sắc — không gian cyber của tư duy
         cửa III → IV Đô trưởng trong   — thánh đường chân lý
         cổng ra      cả hợp âm sáng lẫn chuỗi chuông đi lên           */

    var HOP_AM_CUA = [
      { not: [146.83, 220, 293.66, 369.99, 440], kieu: 'sawtooth', loc: 1400 },
      { not: [164.81, 246.94, 329.63, 392, 739.99], kieu: 'square', loc: 1800 },
      { not: [261.63, 392, 523.25, 659.25, 783.99, 1046.5], kieu: 'triangle', loc: 3200 },
      { not: [261.63, 392, 523.25, 659.25, 783.99, 1046.5, 1318.5], kieu: 'triangle', loc: 4200 }
    ];

    function cuaMo(i, viTri) {
      var t = a.currentTime;
      var pn = diem(viTri, 0.8, ra);                  // vang xa: đứng cách vài mét vẫn nghe rõ cửa mở
      /* tiếng nổ trầm: màn chắn vỡ */
      var o = a.createOscillator();
      o.frequency.setValueAtTime(70, t);
      o.frequency.exponentialRampToValueAtTime(30, t + 1.2);
      var go = gain(0, pn);
      o.connect(go);
      bao(a, go, t, 0.22, 0.01, 1.3);
      o.start(t); o.stop(t + 1.5);
      /* màn năng lượng rã ra: nhiễu quét xuống, lấm tấm tia lửa */
      vut(pn, t, 3200, 260, 1.6, 0.06);
      for (var k = 0; k < 12; k++) {
        chuong(pn, t + 0.1 + Math.random() * 1.3, 2000 + Math.random() * 3000, 0.012 + Math.random() * 0.012, 0.35);
      }
      /* hợp âm của trạm phía bên kia, dâng chậm rồi lắng */
      var H = HOP_AM_CUA[i];
      var gh = gain(0, pn);
      var lh = loc('lowpass', 300, 0.7, gh);
      lh.frequency.setValueAtTime(300, t + 0.3);
      lh.frequency.exponentialRampToValueAtTime(H.loc, t + 2.2);
      H.not.forEach(function (f, j) {
        var on = a.createOscillator();
        on.type = H.kieu;
        on.frequency.value = f;
        on.detune.value = (j % 2 ? 5 : -5);
        on.connect(gain(0.12, lh));
        on.start(t + 0.3); on.stop(t + 5.2);
      });
      gh.gain.setValueAtTime(0.0001, t + 0.3);
      gh.gain.exponentialRampToValueAtTime(0.07, t + 1.8);
      gh.gain.exponentialRampToValueAtTime(0.0001, t + 5.0);
      /* cổng ra: thêm chuỗi chuông đi lên */
      if (i === 3) {
        [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568, 2093].forEach(function (f, j) {
          chuong(pn, t + 0.6 + j * 0.13, f, 0.05, 2.4);
        });
      }
    }

    /* ═══════════ TRẠM II — XƯỞNG THỰC TIỄN ═══════════
       Không khí:  tiếng ù của nhà xưởng, điện lưới rì rì, thỉnh thoảng
                   tiếng kim loại va nhau và hơi nước xì.
       Cần gạt:    nạp năng lượng = điện rít lên dần, lách tách tia lửa;
                   đầy thì "cạch" khoá cần và máy gầm lên khởi động.
       Cảnh phim:  mỗi bước có tiếng camera lướt; xung năng lượng kêu "xèo"
                   chạy theo ống và "bụp" khi tới nơi; mỗi vai trò sáng lên
                   một nốt chuông — bốn nốt thành hợp âm Đô trưởng.
       Sản xuất:   động cơ, bánh răng lách cách theo nhịp, băng chuyền
                   lạch cạch, lò nung gầm, búa gõ đều — nhịp lao động.
       Thí nghiệm: bình sủi bọt lục bục, đèn cồn xì, nguyên tử ngân nhẹ;
                   mỗi ô quy trình sáng một tiếng "tách".
       Xã hội:     đám đông rì rầm rồi hô vang, trống nhịp tuần hành, cờ bay. */

    var bus2 = gain(0, ra);                          // cả trạm II nhỏ đi khi người chơi ở trạm khác
    var V2 = vt.tram2;

    var khi2 = gain(0, bus2);
    khi2.connect(gain(0.35, guiVang));
    nhieuLap(nau).connect(loc('lowpass', 140, 0.7, gain(0.07, khi2)));
    var dien = gain(0.008, khi2);
    osc('sine', 50).connect(dien);
    osc('sine', 100).connect(gain(0.5, dien));

    /* cần gạt: điện rít lên khi nạp */
    var pCan = diem(V2.can, 0.2, bus2);
    var nap = gain(0, pCan);
    var locNap = loc('lowpass', 300, 3, nap);
    var oNap = osc('sawtooth', 55); oNap.connect(locNap);
    var oNap2 = osc('sawtooth', 55.6); oNap2.connect(locNap);

    /* xung năng lượng chạy trong ống — vị trí cập nhật theo hình */
    var pXung = diem(V2.can, 0.2, bus2);
    var xung = gain(0, pXung);
    var locXung = loc('bandpass', 900, 2, xung);
    osc('sawtooth', 180).connect(locXung);
    osc('sawtooth', 183).connect(locXung);
    nhieuLap(trang).connect(loc('bandpass', 2400, 3, gain(0.4, locXung)));

    /* 1 · sản xuất */
    var pRang = diem(V2.rang, 0.3, bus2);
    var dongCo = gain(0, pRang);
    var locDC = loc('lowpass', 220, 0.8, dongCo);
    osc('sawtooth', 46).connect(locDC);
    osc('sawtooth', 92.5).connect(gain(0.5, locDC));
    var pLo = diem(V2.lo, 0.3, bus2);
    var lo = gain(0, pLo);
    nhieuLap(nau).connect(loc('bandpass', 180, 0.6, lo));
    var pBang = diem(V2.bang, 0.2, bus2);
    var lachCach = gain(0, pBang);
    var locBang = loc('bandpass', 650, 1.5, lachCach);
    nhieuLap(trang).connect(locBang);
    var amBang = gain(0, lachCach.gain);             // rung theo nhịp con lăn
    osc('square', 9).connect(amBang);

    /* 2 · thí nghiệm */
    var pBinh = diem(V2.binh, 0.35, bus2);
    var xiDen = gain(0, pBinh);
    nhieuLap(trang).connect(loc('highpass', 2600, 0.7, xiDen));
    var pNguyenTu = diem(V2.nguyenTu, 0.5, bus2);
    var ngan = gain(0, pNguyenTu);
    [880, 1318.5, 1760].forEach(function (f, k) {
      var on = osc('sine', f);
      on.connect(gain(0.3, ngan));
      osc('sine', 4 + k).connect(gain(f * 0.004, on.frequency));   // ngân rung nhẹ
    });

    /* 3 · xã hội */
    var pDam = diem(V2.damDong, 0.5, bus2);
    var riRam = gain(0, pDam);
    var l1 = loc('bandpass', 480, 1.4, riRam), l2 = loc('bandpass', 1050, 1.8, riRam);
    nhieuLap(nau).connect(l1);
    nhieuLap(trang).connect(gain(0.15, l2));
    osc('sine', 0.7).connect(gain(120, l1.frequency));
    osc('sine', 0.43).connect(gain(260, l2.frequency));
    var pCo = diem(V2.co, 0.2, bus2);
    var phanPhat = gain(0, pCo);
    nhieuLap(trang).connect(loc('bandpass', 420, 1, phanPhat));
    var amCo = gain(0, phanPhat.gain);
    osc('sine', 4.5).connect(amCo);

    function vaChamKimLoai(den, t, f, dinh) {
      [1, 2.51, 4.23].forEach(function (k, j) {
        var on = a.createOscillator();
        on.frequency.value = f * k;
        var g = gain(0, den);
        on.connect(g);
        bao(a, g, t, dinh / (j + 1), 0.002, 0.5 / (j + 1));
        on.start(t); on.stop(t + 0.6);
      });
      nhieuNgan(den, t, 0.03, 'highpass', 3000, 0.7, dinh * 0.6);
    }

    function trong(den, t, dinh) {
      var on = a.createOscillator();
      on.frequency.setValueAtTime(110, t);
      on.frequency.exponentialRampToValueAtTime(45, t + 0.18);
      var g = gain(0, den);
      on.connect(g);
      bao(a, g, t, dinh, 0.004, 0.3);
      on.start(t); on.stop(t + 0.4);
    }

    function khoaCan() {
      var t = a.currentTime;
      trong(pCan, t, 0.25);
      nhieuNgan(pCan, t, 0.12, 'lowpass', 700, 0.7, 0.12);
      /* máy gầm lên khởi động */
      var on = a.createOscillator();
      on.type = 'sawtooth';
      on.frequency.setValueAtTime(70, t + 0.1);
      on.frequency.exponentialRampToValueAtTime(420, t + 1.3);
      var g = gain(0, pCan);
      var l = loc('lowpass', 300, 2, g);
      l.frequency.setValueAtTime(300, t + 0.1);
      l.frequency.exponentialRampToValueAtTime(2800, t + 1.3);
      on.connect(l);
      bao(a, g, t + 0.1, 0.06, 0.8, 0.9);
      on.start(t + 0.1); on.stop(t + 2.1);
    }

    function luotCamera() { vut(ra, a.currentTime, 260, 1300, 1.1, 0.025); }

    function toiNoi(viTri) {
      var t = a.currentTime;
      var pn = diem(viTri, 0.5, bus2);
      trong(pn, t, 0.12);
      for (var k = 0; k < 5; k++) chuong(pn, t + k * 0.04, 1800 + Math.random() * 2200, 0.015, 0.3);
      setTimeout(function () { try { pn.disconnect(); } catch (e) {} }, 3000);
    }

    var NOT_VAI_TRO = [523.25, 659.25, 783.99, 1046.5];      // bốn vai trò → hợp âm Đô trưởng

    function hoHet() {
      var t = a.currentTime;
      var g = gain(0, pDam);
      nhieuLap(trang).connect(loc('bandpass', 1400, 0.9, g));
      bao(a, g, t, 0.15, 0.5, 2.2);
      setTimeout(function () { try { g.disconnect(); } catch (e) {} }, 3200);
    }

    /* ═══════════ mỗi khung hình ═══════════ */

    var truoc = { hien: -1, den: 0, ruongKet: false, ruongMo: false, guong: false, xong1: false, moKhoa: 1,
                  daNhat: false, phim: false, buoc: -1, xung: 0, vaiTro: 0, quyTrinh: 0, ho: false,
                  camTinh: 0, nhay: false, daRong: false, lyBuoc: 0, xong3: false };
    var hen = { giot: 2, lua: 0, cong2: 3, hoi: 6, bua: 0, banhRang: 0, bot: 0, trong: 0 };
    var nhin = new THREE.Vector3();
    var L = a.listener;

    function capNhat(dt, cam, S, hien, t2) {
      var t = a.currentTime;

      /* tai người nghe theo camera */
      cam.getWorldDirection(nhin);
      if (L.positionX) {
        L.positionX.setTargetAtTime(cam.position.x, t, 0.03);
        L.positionY.setTargetAtTime(cam.position.y, t, 0.03);
        L.positionZ.setTargetAtTime(cam.position.z, t, 0.03);
        L.forwardX.setTargetAtTime(nhin.x, t, 0.03);
        L.forwardY.setTargetAtTime(nhin.y, t, 0.03);
        L.forwardZ.setTargetAtTime(nhin.z, t, 0.03);
        L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0;
      } else {
        L.setPosition(cam.position.x, cam.position.y, cam.position.z);
        L.setOrientation(nhin.x, nhin.y, nhin.z, 0, 1, 0);
      }

      /* không khí trạm I: chỉ khi đang đứng trong trạm, tắt dần khi qua cửa */
      var z = cam.position.z;
      var w = Math.max(0, Math.min(1, (z - vt.tram.z[0] + 1.5) / 3));
      khi.gain.setTargetAtTime(w, t, 0.4);

      hen.giot -= dt;
      if (hen.giot <= 0) {
        hen.giot = 2 + Math.random() * 4;
        if (w > 0.2) giotNuoc();
      }

      /* ngọn nến */
      var den = S.den;
      var giuNen = S.giu === 'den';
      if (Math.random() < (5 + den * 10) * dt) lachTach();
      moNen.gain.setTargetAtTime(den * 0.09, t, 0.15);
      locMo.frequency.setTargetAtTime(1200 + den * 3000, t, 0.2);
      if (hien !== truoc.hien) {
        if (truoc.hien >= 0 && den > 0.5) doiHinh();
        truoc.hien = hien;
      }
      if (!giuNen && truoc.den > 0.6 && den < truoc.den && !truoc.daTan) { tanBien(); truoc.daTan = true; }
      if (den < 0.05) truoc.daTan = false;
      truoc.den = den;

      /* rương: căng dần, kẹt ở trần, gằn lên nếu cứ cố */
      var mo = S.ruongMo;
      long.gain.setTargetAtTime(0.012 * (1 - mo), t, 0.3);
      var giuRuong = S.giu === 'ruong';
      var r = S.ruong;
      var ket = S.ruongKetT > 0;
      cang.gain.setTargetAtTime(giuRuong ? 0.02 + r * 0.035 : 0, t, giuRuong ? 0.08 : 0.25);
      locCang.frequency.setTargetAtTime(300 + r * 2000, t, 0.1);
      var fCang = 110 * Math.pow(2, r * 1.6);
      if (ket) fCang *= 1 + Math.sin(t * 15) * 0.015 * Math.min(1, S.ruongKetT * 2);
      oCang.frequency.setTargetAtTime(fCang, t, 0.05);
      if (ket && !truoc.ruongKet) chamTran();
      truoc.ruongKet = ket;
      if (mo > 0 && !truoc.ruongMo) { moRuong(); truoc.ruongMo = true; }
      amMo.gain.setTargetAtTime(mo * 0.025, t, 0.6);

      /* gương: càng soi càng rung lệch */
      var gg = S.guong;
      kinh.gain.setTargetAtTime(gg * 0.065, t, 0.15);
      sauRun1.gain.setTargetAtTime(gg * 22, t, 0.2);
      sauRun2.gain.setTargetAtTime(gg * 40, t, 0.2);
      if (S.thu.guong && !truoc.guong) { pingGuong(); truoc.guong = true; }

      /* xong trạm, mở cửa */
      if (S.xong1 && !truoc.xong1) { beTac(); truoc.xong1 = true; }

      /* cửa giữa các trạm, và cổng ra */
      for (var c = truoc.moKhoa; c < S.moKhoa; c++) cuaMo(c - 1, vt.cuaDs[c - 1]);
      truoc.moKhoa = S.moKhoa;
      if (S.daNhat && !truoc.daNhat) { truoc.daNhat = true; setTimeout(function () { cuaMo(3, vt.cuaRa); }, 1200); }

      capNhat2(dt, t, z, S, t2);
      capNhat3(dt, t, z, S);
    }

    function capNhat2(dt, t, z, S, t2) {
      /* cả trạm II: rõ khi đứng trong trạm, nhỏ hẳn khi ở trạm khác */
      var w2 = Math.max(0, Math.min(1, Math.min((z - V2.z[0] + 1.5) / 3, (V2.z[1] + 1.5 - z) / 3)));
      bus2.gain.setTargetAtTime(0.12 + 0.88 * w2, t, 0.4);
      khi2.gain.setTargetAtTime(w2, t, 0.4);

      var m0 = S.may[0], m1 = S.may[1], m2 = S.may[2];

      /* tiếng va kim loại, hơi nước — chỉ khi đứng trong trạm */
      hen.cong2 -= dt;
      if (hen.cong2 <= 0) {
        hen.cong2 = 3 + Math.random() * 4;
        if (w2 > 0.3) {
          var pn = diem([(Math.random() < 0.5 ? -1 : 1) * 5, 3 + Math.random() * 2, V2.z[0] + 1 + Math.random() * 9], 0.9, bus2);
          vaChamKimLoai(pn, t, 300 + Math.random() * 400, 0.025);
          setTimeout(function () { try { pn.disconnect(); } catch (e) {} }, 3000);
        }
      }
      hen.hoi -= dt;
      if (hen.hoi <= 0) {
        hen.hoi = 6 + Math.random() * 6;
        if (w2 > 0.3) nhieuNgan(pLo, t, 0.8, 'highpass', 3000, 0.7, 0.025 + m0 * 0.03);
      }

      /* cần gạt: điện rít lên theo năng lượng */
      var dangNap = S.giu === 'can' && !S.phim && !S.xong2;
      nap.gain.setTargetAtTime(dangNap ? 0.03 + S.nang * 0.05 : 0, t, dangNap ? 0.08 : 0.3);
      var fNap = 55 * Math.pow(2, S.nang * 2);
      oNap.frequency.setTargetAtTime(fNap, t, 0.05);
      oNap2.frequency.setTargetAtTime(fNap * 1.01, t, 0.05);
      locNap.frequency.setTargetAtTime(300 + S.nang * 2600, t, 0.05);
      if (dangNap && Math.random() < S.nang * 14 * dt) nhieuNgan(pCan, t, 0.01 + Math.random() * 0.02, 'highpass', 2500, 0.7, 0.04);
      if (S.phim && !truoc.phim) khoaCan();
      truoc.phim = !!S.phim;

      /* cảnh phim: camera lướt sang chỗ mới */
      var buoc = S.phim ? S.phim.buoc : -1;
      if (buoc !== truoc.buoc) { if (buoc >= 0) luotCamera(); truoc.buoc = buoc; }

      /* xung năng lượng: kêu theo đường đi, "bụp" khi tới nơi */
      var dx = t2.xung.material.opacity;
      if (dx > 0) datViTri(pXung, [t2.xung.position.x, 0.4, t2.xung.position.z]);
      xung.gain.setTargetAtTime(dx > 0 ? 0.09 : 0, t, 0.03);
      if (truoc.xung > 0 && dx === 0 && S.phim) toiNoi([t2.xung.position.x, 0.6, t2.xung.position.z]);
      truoc.xung = dx;

      /* vai trò sáng: mỗi vai trò một nốt chuông */
      if (S.vaiTro > truoc.vaiTro) {
        for (var k = truoc.vaiTro; k < S.vaiTro; k++) {
          chuong(diem(V2.vaiTro[k], 0.8, bus2), t + (k - truoc.vaiTro) * 0.15, NOT_VAI_TRO[k], 0.07, 2.6);
        }
        truoc.vaiTro = S.vaiTro;
      }

      /* 1 · sản xuất: động cơ, bánh răng theo nhịp, băng chuyền, lò, búa */
      dongCo.gain.setTargetAtTime(m0 * 0.12, t, 0.3);
      lo.gain.setTargetAtTime(m0 * 0.16, t, 0.4);
      amBang.gain.setTargetAtTime(m0 * 0.03, t, 0.3);
      lachCach.gain.setTargetAtTime(m0 * 0.03, t, 0.3);
      if (m0 > 0.05) {
        hen.banhRang -= dt * (2 + m0 * 5);
        if (hen.banhRang <= 0) {
          hen.banhRang += 1;
          truoc.tic = !truoc.tic;
          nhieuNgan(pRang, t, 0.015, 'bandpass', truoc.tic ? 2600 : 1900, 3, m0 * 0.1);
        }
        hen.bua -= dt;
        if (hen.bua <= 0 && m0 > 0.5) { hen.bua = 1.6; vaChamKimLoai(pLo, t, 220, 0.1); }
      }

      /* 2 · thí nghiệm: sủi bọt, đèn cồn, nguyên tử ngân, ô quy trình "tách" */
      xiDen.gain.setTargetAtTime(m1 * 0.035, t, 0.3);
      ngan.gain.setTargetAtTime(m1 * 0.04, t, 0.6);
      if (m1 > 0.1 && Math.random() < m1 * 12 * dt) {
        var on = a.createOscillator();
        var f = 300 + Math.random() * 400;
        on.frequency.setValueAtTime(f, t);
        on.frequency.exponentialRampToValueAtTime(f * 1.8, t + 0.04);
        var gb = gain(0, pBinh);
        on.connect(gb);
        bao(a, gb, t, 0.04 + Math.random() * 0.03, 0.003, 0.06);
        on.start(t); on.stop(t + 0.1);
      }
      var qt = m1 >= 0.95 ? 3 : m1 > 0.55 ? 2 : m1 > 0.25 ? 1 : 0;
      for (var q = truoc.quyTrinh; q < qt; q++) chuong(pBinh, t + (q - truoc.quyTrinh) * 0.1, 1568, 0.03, 0.4);
      truoc.quyTrinh = Math.max(truoc.quyTrinh, qt);

      /* 3 · xã hội: rì rầm, hô vang, trống tuần hành, cờ bay */
      riRam.gain.setTargetAtTime(m2 * 0.12, t, 0.5);
      phanPhat.gain.setTargetAtTime(m2 * 0.03, t, 0.4);
      amCo.gain.setTargetAtTime(m2 * 0.03, t, 0.4);
      if (m2 > 0.3 && !truoc.ho) { truoc.ho = true; hoHet(); }
      if (m2 > 0.5) {
        hen.trong -= dt;
        if (hen.trong <= 0) { hen.trong = 0.62; trong(pDam, t, 0.1); }
      }
    }

    /* ═══════════ TRẠM III — CON ĐƯỜNG NHẬN THỨC ═══════════
       Không khí:  mạng dữ liệu rì rì, tiếng "bíp" kỹ thuật số lấp lánh.
       Mắt:        tiếng quét lướt lên xuống như máy quét.
       Tai:        tiếng gõ "cốc cốc" lên quả táo (tiếng "rộp" do phòng phát).
       Tay:        tiếng chạm sột soạt trên vỏ, và một luồng hơi mát.
       Tri giác:   các mảnh âm ghép lại thành hợp âm.
       Biểu tượng: tiếng ngân dâng chậm rồi đọng lại — như ký ức.
       Bệ nhảy:    vút lên, rồi đáp xuống.
       Tư duy:     nơron lách tách; mỗi bước khái niệm / phán đoán / suy
                   luận một nốt — ba nốt chồng thành hợp âm Rê trưởng.
       Tư duy rỗng: tiếng ù lỗi chói tai, nghịch.
       Trở về thực tiễn: một đường quét dài theo tia sáng về xưởng.        */

    var V3 = vt.tram3;
    var bus3 = gain(0, ra);

    var khi3 = gain(0, bus3);
    khi3.connect(gain(0.4, guiVang));
    var ri = gain(0.012, khi3);
    osc('sine', 220).connect(ri);
    osc('sine', 221.3).connect(ri);
    osc('sine', 330.5).connect(gain(0.4, ri));
    nhieuLap(trang).connect(loc('bandpass', 3200, 8, gain(0.05, khi3)));

    /* mắt: tiếng quét */
    var pMat = diem(V3.mat, 0.3, bus3);
    var quet = gain(0, pMat);
    var oQuet = osc('sine', 1200);
    oQuet.connect(loc('bandpass', 1300, 2, quet));
    osc('sine', 1.6).connect(gain(380, oQuet.frequency));

    /* tay: tiếng chạm sột soạt và hơi mát */
    var pTay = diem(V3.tay, 0.3, bus3);
    var cham = gain(0, pTay);
    nhieuLap(trang).connect(loc('bandpass', 2200, 1.2, cham));
    var amCham = gain(0, cham.gain);
    osc('sine', 6).connect(amCham);
    var hoiMat = gain(0, pTay);
    nhieuLap(nau).connect(loc('highpass', 900, 0.5, hoiMat));

    var pTao = diem(V3.tao, 0.4, bus3);
    var pNao = diem(V3.nao, 0.6, bus3);

    /* tư duy: tiếng ù nhẹ dâng theo tiến độ */
    var u = gain(0, pNao);
    var locU = loc('lowpass', 400, 1, u);
    osc('triangle', 146.83).connect(locU);
    osc('triangle', 147.6).connect(locU);

    /* tư duy rỗng: tiếng ù lỗi nghịch tai */
    var loi = gain(0, pNao);
    var locLoi = loc('lowpass', 900, 1, loi);
    osc('square', 110).connect(locLoi);
    osc('square', 116.5).connect(locLoi);

    function bip(den, t, f, dinh) {
      var on = a.createOscillator();
      on.type = 'square';
      on.frequency.value = f;
      var gb = gain(0, den);
      on.connect(loc('lowpass', 3000, 0.7, gb));
      bao(a, gb, t, dinh, 0.002, 0.06);
      on.start(t); on.stop(t + 0.1);
    }

    function goCoc(t) {
      var on = a.createOscillator();
      on.frequency.setValueAtTime(240, t);
      on.frequency.exponentialRampToValueAtTime(150, t + 0.08);
      var gb = gain(0, pTao);
      on.connect(gb);
      bao(a, gb, t, 0.12, 0.002, 0.12);
      on.start(t); on.stop(t + 0.2);
      nhieuNgan(pTao, t, 0.03, 'bandpass', 900, 2, 0.08);
    }

    function hopAmGhep() {                             // tri giác: các mảnh ghép lại
      var t = a.currentTime;
      [523.25, 659.25, 783.99].forEach(function (f, k) { chuong(pTao, t + k * 0.12, f, 0.05, 1.8); });
      for (var k = 0; k < 6; k++) chuong(pTao, t + 0.4 + Math.random() * 0.4, 2000 + Math.random() * 2000, 0.012, 0.3);
    }

    function nganDong() {                              // biểu tượng: dâng chậm rồi đọng lại
      var t = a.currentTime;
      [523.25, 1046.5].forEach(function (f, k) {
        var on = a.createOscillator();
        on.frequency.value = f;
        var gb = gain(0, pTao);
        on.connect(gb);
        gb.gain.setValueAtTime(0.0001, t);
        gb.gain.exponentialRampToValueAtTime(k ? 0.04 : 0.08, t + 1.2);
        gb.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
        on.start(t); on.stop(t + 4.3);
      });
    }

    function nhayLen() { vut(diem(V3.bat, 0.4, bus3), a.currentTime, 300, 2600, 0.8, 0.06); }
    function dapXuong() { trong(diem(V3.nao, 0.4, bus3), a.currentTime, 0.14); }

    var NOT_LY = [293.66, 369.99, 440];               // Rê – Fa thăng – La: Rê trưởng
    function notLy(k) {
      var t = a.currentTime;
      chuong(pNao, t, NOT_LY[k], 0.07, 2.4);
      chuong(pNao, t + 0.05, NOT_LY[k] * 2, 0.03, 1.6);
      if (k === 2) NOT_LY.forEach(function (f, j) { chuong(pNao, t + 0.5 + j * 0.06, f * 2, 0.04, 2.8); });
    }

    function baoLoi() {
      var t = a.currentTime;
      [880, 440].forEach(function (f, k) {
        var on = a.createOscillator(); on.type = 'square'; on.frequency.value = f;
        var gb = gain(0, pNao); on.connect(loc('lowpass', 2000, 0.7, gb));
        bao(a, gb, t + k * 0.14, 0.05, 0.005, 0.12);
        on.start(t + k * 0.14); on.stop(t + k * 0.14 + 0.2);
      });
    }

    function veThucTien() {
      var t = a.currentTime;
      var on = a.createOscillator(); on.type = 'sawtooth';
      on.frequency.setValueAtTime(200, t);
      on.frequency.exponentialRampToValueAtTime(820, t + 1.6);
      var gb = gain(0, pNao);
      var l = loc('lowpass', 400, 2, gb);
      l.frequency.setValueAtTime(400, t);
      l.frequency.exponentialRampToValueAtTime(3200, t + 1.6);
      on.connect(l);
      bao(a, gb, t, 0.06, 0.4, 1.6);
      on.start(t); on.stop(t + 2.2);
      chuong(pNao, t + 1.5, 880, 0.05, 2.2);
    }

    function capNhat3(dt, t, z, S) {
      var w3 = Math.max(0, Math.min(1, Math.min((z - V3.z[0] + 1.5) / 3, (V3.z[1] + 1.5 - z) / 3)));
      bus3.gain.setTargetAtTime(0.1 + 0.9 * w3, t, 0.4);
      khi3.gain.setTargetAtTime(w3, t, 0.4);

      hen.bip3 = (hen.bip3 || 1) - dt;
      if (hen.bip3 <= 0) {
        hen.bip3 = 0.8 + Math.random() * 1.6;
        if (w3 > 0.3) {
          var pn = diem([(Math.random() < 0.5 ? -1 : 1) * 5.5, 0.9 + Math.random() * 3.7, V3.z[0] + 1 + Math.random() * 9], 0.7, bus3);
          bip(pn, t, 1200 + Math.random() * 1400, 0.02);
          setTimeout(function () { try { pn.disconnect(); } catch (e) {} }, 2500);
        }
      }

      var g = S.giu, coTao = S.camTinh < 2;
      quet.gain.setTargetAtTime(g === 'mat' && coTao ? 0.07 : 0, t, 0.1);
      cham.gain.setTargetAtTime(g === 'tay' && coTao ? 0.045 : 0, t, 0.1);
      amCham.gain.setTargetAtTime(g === 'tay' && coTao ? 0.045 : 0, t, 0.1);
      hoiMat.gain.setTargetAtTime(g === 'tay' && coTao ? 0.06 : 0, t, 0.3);
      if (g === 'tai' && coTao) {
        hen.coc = (hen.coc || 0) - dt;
        if (hen.coc <= 0) { hen.coc = 0.5; goCoc(t); }
      }

      if (S.camTinh >= 1 && truoc.camTinh < 1) hopAmGhep();
      if (S.camTinh >= 2 && truoc.camTinh < 2) nganDong();
      truoc.camTinh = S.camTinh;

      if (S.nhay && !truoc.nhay) nhayLen();
      if (!S.nhay && truoc.nhay) dapXuong();
      truoc.nhay = !!S.nhay;

      var nghi = g === 'nao' && !S.xong3;
      u.gain.setTargetAtTime(nghi && S.camTinh >= 2 ? 0.02 + S.ly * 0.04 : 0, t, 0.2);
      locU.frequency.setTargetAtTime(400 + S.ly * 1800, t, 0.2);
      if (nghi && Math.random() < (S.camTinh >= 2 ? 25 : 40) * dt) {
        nhieuNgan(pNao, t, 0.006, 'highpass', 3500 + Math.random() * 3000, 0.7, S.camTinh >= 2 ? 0.03 : 0.05);
      }
      loi.gain.setTargetAtTime(nghi && S.camTinh < 2 ? 0.03 * Math.min(1, S.rong * 1.5) : 0, t, 0.08);
      if (S.daRong && !truoc.daRong) baoLoi();
      truoc.daRong = S.daRong;
      for (var k = truoc.lyBuoc; k < S.lyBuoc; k++) notLy(k);
      truoc.lyBuoc = Math.max(truoc.lyBuoc, S.lyBuoc);
      if (S.xong3 && !truoc.xong3) { truoc.xong3 = true; veThucTien(); }
    }

    /* để kiểm tra: đo độ lớn tín hiệu đang phát ra */
    var doMuc = a.createAnalyser();
    doMuc.fftSize = 2048;
    ra.connect(doMuc);
    var mau = new Float32Array(doMuc.fftSize);
    function mucAm() {
      doMuc.getFloatTimeDomainData(mau);
      var tong = 0;
      for (var i = 0; i < mau.length; i++) tong += mau[i] * mau[i];
      return Math.sqrt(tong / mau.length);
    }

    function huy() {
      var t = a.currentTime;
      ra.gain.cancelScheduledValues(t);
      ra.gain.setTargetAtTime(0, t, 0.12);
      setTimeout(function () {
        nguon.forEach(function (n) { try { n.stop(); } catch (e) {} });
        try { ra.disconnect(); } catch (e) {}
      }, 700);
    }

    return { capNhat: capNhat, huy: huy, mucAm: mucAm };
  }

  return { tao: tao };
})();
