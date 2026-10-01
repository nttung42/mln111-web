/* ═══════════════════════════════════════════════════════════════════
   HUD — giữ ở mức tối thiểu.

   Mặc định màn hình chỉ có một chấm ngắm. Bảng chỉ số chỉ hiện khi
   người chơi đứng đủ gần vật thể trung tâm, và tắt đi khi họ lùi ra.
   Giao diện phục vụ hành động đang diễn ra, không trang trí liên tục.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.hud = (function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var el = {};
  var fx = { flash: 0, burst: 0, shake: 0 };
  var dongCard = null;

  function init() {
    el.tagKicker = $('tagKicker');
    el.tagTitle  = $('tagTitle');
    el.cross     = $('cross');
    el.hint      = $('hint');
    el.panel     = $('panel');
    el.flash     = $('flash');
    el.burst     = $('burst');
    el.burstK    = $('burstK');
    el.burstT    = $('burstT');
    el.veil      = $('veil');
    el.card      = $('card');
    el.book      = $('book');
    el.bookList  = $('bookList');
  }

  var H = {

    init: init,

    /* ---------- nhãn phòng ---------- */
    nhanPhong: function (kicker, title) {
      el.tagKicker.textContent = kicker || '';
      el.tagTitle.textContent = title || '';
    },

    /* ---------- chấm ngắm ---------- */
    ngam: function (active) {
      el.cross.classList.toggle('hot', !!active);
    },

    /* Ở nơi dùng chuột tự do thì chấm ngắm vô nghĩa — tắt hẳn. */
    ngamTat: function (tat) {
      el.cross.style.display = tat ? 'none' : '';
    },

    /* ---------- dòng hướng dẫn thao tác ---------- */
    goiY: function (html) { el.hint.innerHTML = html || ''; },
    hienGoiY: function (on) { el.hint.classList.toggle('on', !!on); },

    /* ---------- bảng chỉ số, nội dung do từng phòng cung cấp ---------- */
    datPanel: function (html) {
      el.panel.innerHTML = html || '';
      return el.panel;
    },
    hienPanel: function (on) { el.panel.classList.toggle('on', !!on); },

    /* ---------- hiệu ứng khoảnh khắc chính ---------- */
    buocNhay: function (kicker, text) {
      el.burstK.textContent = kicker || '';
      el.burstT.textContent = text || '';
      fx.flash = 1;
      fx.burst = 1.6;
      fx.shake = 1;
    },
    rung: function () { return fx.shake; },

    capNhatFx: function (dt) {
      if (fx.flash > 0) {
        fx.flash = Math.max(0, fx.flash - dt * 2.6);
        el.flash.style.opacity = fx.flash * 0.75;
      }
      if (fx.burst > 0) {
        fx.burst = Math.max(0, fx.burst - dt * 0.75);
        el.burst.style.opacity = Math.min(1, fx.burst);
        el.burst.style.transform =
          'translate(-50%,-50%) scale(' + (1 + (1.6 - fx.burst) * 0.12) + ')';
      }
      if (fx.shake > 0) fx.shake = Math.max(0, fx.shake - dt * 2.2);
    },

    /* ---------- thẻ nội dung toàn màn hình ----------
       Giới hạn ở một màn hình: một đoạn dẫn, bốn đến năm định nghĩa
       ngắn, một trích dẫn. Dài hơn thì không ai đọc. */
    the: function (html, nhan, khiDong) {
      /* Nhả khoá con trỏ TRƯỚC khi hiện thẻ. Thiếu dòng này thì chuột vẫn
         bị khoá, người chơi không bấm được nút, thẻ không đóng được — và
         vì thẻ còn mở nên mọi thao tác trong phòng cũng chết theo. */
      if (document.pointerLockElement) document.exitPointerLock();

      el.card.innerHTML = html +
        '<button class="go" id="cardGo">' + (nhan || TX.VI.game.tiepTuc) + '</button>';
      el.veil.classList.remove('hide');
      dongCard = khiDong || null;
      TX.audio.the();
      $('cardGo').addEventListener('click', function () {
        H.dongThe();
      });
    },

    dongThe: function () {
      el.veil.classList.add('hide');
      var cb = dongCard; dongCard = null;
      if (cb) cb();
    },

    theDangMo: function () {
      return !el.veil.classList.contains('hide');
    },

    /* ---------- sổ tay biện chứng ---------- */
    veSoTay: function (muc) {
      if (!muc.length) {
        el.bookList.innerHTML = '<p class="empty">' + TX.VI.game.soTayTrong + '</p>';
        return;
      }
      el.bookList.innerHTML = muc.map(function (m) {
        return '<article class="entry">' +
                 '<h3>' + m.ten + '</h3>' +
                 '<p>' + m.tom + '</p>' +
                 (m.trichDan
                   ? '<blockquote>' + m.trichDan +
                     (m.nguon ? '<cite>' + m.nguon + '</cite>' : '') + '</blockquote>'
                   : '') +
               '</article>';
      }).join('');
    },

    moSoTay: function (on) { el.book.classList.toggle('on', on); },
    soTayDangMo: function () { return el.book.classList.contains('on'); }
  };

  return H;
})();

/* ═══════════════════════════════════════════════════════════════════
   SỔ TAY — ghi lại khái niệm sau mỗi phòng.
   Phục vụ hai việc: ôn tập sau khi chơi, và chứng minh độ phủ nội dung
   khi báo cáo trước lớp.
   ═══════════════════════════════════════════════════════════════════ */

TX.soTay = (function () {
  'use strict';
  var muc = [];
  return {
    ghi: function (entry) {
      if (muc.some(function (m) { return m.ten === entry.ten; })) return;
      muc.push(entry);
      TX.hud.veSoTay(muc);
    },
    danhSach: function () { return muc; },
    coMuc: function (ten) {
      return muc.some(function (m) { return m.ten === ten; });
    }
  };
})();
