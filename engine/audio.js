/* ═══════════════════════════════════════════════════════════════════
   ÂM THANH — hiệu ứng tổng hợp hoàn toàn bằng WebAudio, không dùng file
   (nhẹ bản build, không vướng bản quyền). Riêng nhạc nền dùng file mp3.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.audio = (function () {
  'use strict';

  var ctx = null, tong = null;

  /* Tắt tiếng — nhớ qua các lần mở trang. */
  var tat = false;
  try { tat = localStorage.getItem('tx-tat-tieng') === '1'; } catch (e) {}

  /* Trình duyệt chỉ cho tạo AudioContext sau một thao tác của người dùng,
     nên mọi hàm đều gọi qua đây và im lặng bỏ qua nếu chưa được phép.
     Các phòng tự nối thẳng vào a.destination, nên ta che destination bằng
     một nút gain tổng — tắt tiếng một chỗ là im cả game. */
  function ac() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      tong = ctx.createGain();
      tong.gain.value = tat ? 0 : 1;
      tong.connect(ctx.destination);
      Object.defineProperty(ctx, 'destination', { value: tong });
    } catch (e) {
      ctx = null;
    }
    return ctx;
  }

  function env(node, t0, peak, attack, decay) {
    var g = ac().createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    node.connect(g);
    g.connect(ac().destination);
    return g;
  }

  /* Nhạc nền — ngoại lệ duy nhất dùng file. Dùng thẻ <audio> thay vì giải mã
     cả file vào WebAudio: phát dạng luồng, nhẹ bộ nhớ. Mỗi bài giữ vị trí
     riêng, quay lại thì phát tiếp. */
  var BAI = {
    sanh:  'assets/audio/main-lobby-loop-578505.mp3',
    phong: 'assets/audio/the_mountain-retro-game-593063.mp3'
  };
  var AM_LUONG_NHAC = 0.22;
  var nhac = {}, baiHienTai = null;

  function layBai(ten) {
    if (!nhac[ten]) {
      var el = new Audio(BAI[ten]);
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0;
      el.muted = tat;
      nhac[ten] = { el: el, mo: null };
    }
    return nhac[ten];
  }

  function moDan(b, dich) {
    clearInterval(b.mo);
    b.mo = setInterval(function () {
      var v = b.el.volume + (dich > b.el.volume ? 0.02 : -0.02);
      if (Math.abs(dich - b.el.volume) <= 0.02) {
        v = dich;
        clearInterval(b.mo);
        if (dich === 0) b.el.pause();
      }
      b.el.volume = Math.max(0, Math.min(1, v));
    }, 50);
  }

  /* Chưa có thao tác người dùng thì play() bị chặn — chờ lần chạm/phím kế tiếp. */
  function chay(ten) {
    var p = nhac[ten].el.play();
    if (p && p.catch) p.catch(function () {
      function thu() {
        removeEventListener('pointerdown', thu);
        removeEventListener('keydown', thu);
        if (baiHienTai === ten) chay(ten);
      }
      addEventListener('pointerdown', thu);
      addEventListener('keydown', thu);
    });
  }

  return {

    /* Chuyển nhạc nền: 'sanh', 'phong', hoặc null để tắt. Bài cũ mờ dần,
       bài mới rõ dần. */
    nhacNen: function (ten) {
      if (!BAI[ten]) ten = null;
      if (ten === baiHienTai) return;
      if (baiHienTai) moDan(nhac[baiHienTai], 0);
      baiHienTai = ten;
      if (!ten) return;
      var b = layBai(ten);
      chay(ten);
      moDan(b, AM_LUONG_NHAC);
    },

    /* Tắt/bật toàn bộ âm thanh: nhạc nền và mọi tiếng WebAudio. */
    tatTieng: function (v) {
      tat = !!v;
      try { localStorage.setItem('tx-tat-tieng', tat ? '1' : '0'); } catch (e) {}
      if (tong) tong.gain.setTargetAtTime(tat ? 0 : 1, ctx.currentTime, 0.05);
      for (var k in nhac) nhac[k].el.muted = tat;
      return tat;
    },
    dangTat: function () { return tat; },

    /* AudioContext dùng chung, cho phòng nào muốn tự dựng âm thanh riêng.
       null nếu trình duyệt không cho; tự đánh thức nếu đang bị treo. */
    ngu: function () {
      var a = ac();
      if (a && a.state === 'suspended' && a.resume) a.resume();
      return a;
    },

    /* Tiếng trầm cho bước nhảy — đứt đoạn, dứt khoát. */
    buocNhay: function () {
      var a = ac(); if (!a) return;
      var t = a.currentTime;

      var o = a.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(190, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.5);
      env(o, t, 0.30, 0.008, 0.62);
      o.start(t); o.stop(t + 0.7);

      /* một lớp nhiễu ngắn cho có "sức nổ" */
      var len = Math.floor(a.sampleRate * 0.25);
      var buf = a.createBuffer(1, len, a.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      var src = a.createBufferSource(); src.buffer = buf;
      var flt = a.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 900;
      src.connect(flt);
      env(flt, t, 0.16, 0.006, 0.26);
      src.start(t);
    },

    /* Tiếng "tách" nhẹ khi chạm điểm nút — báo hiệu sắp có chuyện. */
    diemNut: function () {
      var a = ac(); if (!a) return;
      var t = a.currentTime;
      var o = a.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(880, t);
      o.frequency.exponentialRampToValueAtTime(560, t + 0.12);
      env(o, t, 0.10, 0.004, 0.16);
      o.start(t); o.stop(t + 0.2);
    },

    /* Tiếng lách cách khi mở thẻ nội dung. */
    the: function () {
      var a = ac(); if (!a) return;
      var t = a.currentTime;
      var o = a.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(520, t);
      env(o, t, 0.05, 0.004, 0.10);
      o.start(t); o.stop(t + 0.14);
    },

    /* Nền rì rì, dùng cho phòng Mâu thuẫn khi hai cực đang căng.
       Trả về một hàm để tắt và một hàm để chỉnh độ căng 0..1. */
    canhNen: function () {
      var a = ac();
      if (!a) return { set: function () {}, stop: function () {} };

      var o = a.createOscillator();
      var g = a.createGain();
      var f = a.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.value = 55;
      f.type = 'lowpass';
      f.frequency.value = 200;
      g.gain.value = 0.0001;
      o.connect(f); f.connect(g); g.connect(a.destination);
      o.start();

      return {
        set: function (v) {
          v = Math.max(0, Math.min(1, v));
          var t = a.currentTime;
          g.gain.setTargetAtTime(0.0001 + v * 0.07, t, 0.1);
          f.frequency.setTargetAtTime(200 + v * 900, t, 0.1);
          o.frequency.setTargetAtTime(55 + v * 30, t, 0.2);
        },
        stop: function () {
          try { o.stop(a.currentTime + 0.05); } catch (e) {}
        }
      };
    }
  };
})();
