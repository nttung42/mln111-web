/* ═══════════════════════════════════════════════════════════════════
   ÂM THANH — tổng hợp hoàn toàn bằng WebAudio, không dùng file.
   Lý do: file âm thanh làm nặng bản build và vướng bản quyền khi nộp bài.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.audio = (function () {
  'use strict';

  var ctx = null;

  /* Trình duyệt chỉ cho tạo AudioContext sau một thao tác của người dùng,
     nên mọi hàm đều gọi qua đây và im lặng bỏ qua nếu chưa được phép. */
  function ac() {
    if (ctx) return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
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

  return {

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
