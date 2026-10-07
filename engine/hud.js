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

  /* Trên máy cảm ứng, đổi "Chuột trái", "F"... thành tên nút trên màn hình. */
  var nhan = function (html) { return TX.touch ? TX.touch.doiNhan(html) : html; };

  var el = {};
  var fx = { flash: 0, burst: 0, shake: 0 };

  /* thẻ chú giải: hiện ngay khi người chơi nhìn vào một vật, còn lại
     CG_GIU giây sau khi nhìn đi chỗ khác để kịp đọc nốt; phím G tắt / bật */
  var CG_GIU = 1.2;
  var nghePhimG = null;   // gắn đúng một lần dù init() bị gọi lại
  var cg = { nham: null, hien: null, mat: 0, tat: false, baoT: 0 };
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
    el.cg        = $('chuGiai');

    if (!nghePhimG) addEventListener('keydown', nghePhimG = function (e) {
      if (e.repeat || (e.code !== 'KeyG' && e.key !== 'g' && e.key !== 'G')) return;
      cg.tat = !cg.tat;
      var L = TX.VI.game.chuGiai;
      cg.hien = null;
      el.cg.innerHTML = '<div class="cg-f">' + (cg.tat ? L.daTat : L.daBat) + '</div>';
      el.cg.classList.add('on');
      cg.baoT = 1.6;                   // báo ngắn rồi tự ẩn
    });
  }

  function veCG(d) {
    var L = TX.VI.game.chuGiai;
    cg.hien = d;
    cg.baoT = 0;
    el.cg.innerHTML =
      '<div class="cg-k">' + d.nhan + '</div>' +
      '<div class="cg-t">' + d.tieuDe + '</div>' +
      '<div class="cg-r vs"><b>' + L.lyThuyet + '</b><p>' + d.lyThuyet + '</p></div>' +
      '<div class="cg-f">' + nhan(L.chan) + '</div>';
    el.cg.classList.add('on');
  }

  function anCG() {
    cg.hien = null;
    el.cg.classList.remove('on');
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
    goiY: function (html) {
      if (TX.touch && TX.touch.bat) TX.touch.ghiNhanGoiY(html);
      html = nhan(html) || '';
      if (el.hint.innerHTML !== html) el.hint.innerHTML = html;
    },
    hienGoiY: function (on) { el.hint.classList.toggle('on', !!on); },

    /* ---------- bảng chỉ số, nội dung do từng phòng cung cấp ---------- */
    datPanel: function (html) {
      el.panel.innerHTML = nhan(html) || '';
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

    /* chỉ loé trắng, không chữ, không rung — dùng khi chuyển cảnh */
    loeSang: function () { fx.flash = 1; },

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

      /* chú giải: không đếm giờ khi đang đọc thẻ lớn hay sổ tay */
      if (!H.theDangMo() && !H.soTayDangMo()) {
        if (cg.baoT > 0) {
          cg.baoT -= dt;
          if (cg.baoT <= 0) anCG();
        } else if (cg.nham && !cg.tat) {
          if (cg.hien !== cg.nham) veCG(cg.nham);
          cg.mat = 0;
        } else if (cg.hien) {
          cg.mat += dt;
          if (cg.mat > CG_GIU) anCG();
        }
      }
    },

    /* ---------- cảnh phim: viền điện ảnh và phụ đề ----------
       Dùng khi phòng mượn camera để dẫn người chơi đi xem lần lượt. */
    phim: function (on) {
      $('phim').classList.toggle('on', !!on);
      if (!on) $('phimChu').classList.remove('on');
    },
    phimChu: function (kicker, tieuDe, than) {
      var c = $('phimChu');
      if (!tieuDe) { c.classList.remove('on'); return; }
      c.querySelector('.k').textContent = kicker || '';
      c.querySelector('.t').textContent = tieuDe;
      c.querySelector('p').innerHTML = nhan(than) || '';
      c.classList.add('on');
    },

    /* ---------- thẻ chú giải ----------
       Phòng gọi mỗi khung hình với thứ người chơi đang nhìn vào (hoặc null).
       d: { nhan, tieuDe, lyThuyet } — phần lý thuyết ứng với vật đó. Truyền cùng một object cho
       cùng một vật, để thẻ không vẽ lại liên tục. Không chặn việc chơi. */
    nhinChuGiai: function (d) { cg.nham = d || null; },
    chuGiaiDangTat: function () { return cg.tat; },
    anChuGiai: function () { cg.nham = null; cg.baoT = 0; anCG(); },

    /* ---------- thẻ nội dung toàn màn hình ----------
       Giới hạn ở một màn hình: một đoạn dẫn, bốn đến năm định nghĩa
       ngắn, một trích dẫn. Dài hơn thì không ai đọc. */
    the: function (html, nhanNut, khiDong) {
      /* Nhả khoá con trỏ TRƯỚC khi hiện thẻ. Thiếu dòng này thì chuột vẫn
         bị khoá, người chơi không bấm được nút, thẻ không đóng được — và
         vì thẻ còn mở nên mọi thao tác trong phòng cũng chết theo. */
      if (document.pointerLockElement) document.exitPointerLock();

      el.card.innerHTML = nhan(html) +
        '<button class="go" id="cardGo">' + (nhanNut || TX.VI.game.tiepTuc) + '</button>';
      el.veil.classList.remove('hide');
      dongCard = khiDong || null;
      TX.audio.the();
      $('cardGo').addEventListener('click', function () {
        H.dongThe();
      });
    },

    /* ---------- hộp hỏi hai lựa chọn ----------
       Cùng khung với thẻ nội dung, nên khi đang hỏi thì phòng cũng đứng yên. */
    hoi: function (html, nhanCo, nhanKhong, khiCo, khiKhong) {
      if (document.pointerLockElement) document.exitPointerLock();

      el.card.innerHTML = nhan(html) +
        '<button class="go" id="cardGo">' + nhanCo + '</button>' +
        '<button class="go phu" id="cardKhong">' + nhanKhong + '</button>';
      el.veil.classList.remove('hide');
      dongCard = khiKhong || null;
      TX.audio.the();
      $('cardGo').addEventListener('click', function () {
        dongCard = khiCo || null;
        H.dongThe();
      });
      $('cardKhong').addEventListener('click', function () { H.dongThe(); });
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
