/* ═══════════════════════════════════════════════════════════════════
   CHUYỂN ĐỘNG — hàm dùng chung cho mọi phòng.

   Vì sao cần file này: cách viết quen tay
       x += (dich - x) * Math.min(1, dt * k)
   phụ thuộc vào tốc độ khung hình — máy 144 Hz sẽ chạy nhanh hơn máy
   60 Hz. Dùng damp() ở dưới thì tốc độ như nhau trên mọi máy, và
   chuyển động mượt hơn vì nó là hàm mũ thật chứ không phải xấp xỉ.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.anim = (function () {
  'use strict';

  function damp(hienTai, dich, lambda, dt) {
    return dich + (hienTai - dich) * Math.exp(-lambda * dt);
  }

  return {

    damp: damp,

    dampV3: function (v, dich, lambda, dt) {
      var k = 1 - Math.exp(-lambda * dt);
      v.x += (dich.x - v.x) * k;
      v.y += (dich.y - v.y) * k;
      v.z += (dich.z - v.z) * k;
      return v;
    },

    /* ---------- hàm gia giảm ---------- */

    /* mượt hai đầu — dùng cho hầu hết chuyển động có điểm đầu và điểm cuối */
    muot: function (t) {
      t = Math.max(0, Math.min(1, t));
      return t * t * (3 - 2 * t);
    },

    /* chậm dần về cuối — dùng khi vật tiến tới đích rồi dừng hẳn */
    chamDan: function (t) {
      t = Math.max(0, Math.min(1, t));
      return 1 - Math.pow(1 - t, 3);
    },

    /* vọt qua rồi lùi về — dùng cho vật bật ra, quả chín, khối bung */
    vot: function (t, manh) {
      t = Math.max(0, Math.min(1, t));
      var c = (manh === undefined ? 1.7 : manh);
      var u = t - 1;
      return 1 + (c + 1) * u * u * u + c * u * u;
    },

    /* ---------- tiện ích ---------- */

    /* Lấy phần tiến trình của giai đoạn [tu, den] trong tiến trình tổng t.
       Dùng để các bộ phận mọc so le nhau thay vì mọc cùng một lúc. */
    doan: function (t, tu, den) {
      if (den <= tu) return t >= den ? 1 : 0;
      return Math.max(0, Math.min(1, (t - tu) / (den - tu)));
    },

    /* Gió: ba tần số chồng lên nhau, không bao giờ lặp lại đều đặn
       nên mắt không bắt được chu kỳ. */
    gio: function (t) {
      return Math.sin(t * 0.9) * 0.5 +
             Math.sin(t * 1.7 + 1.3) * 0.3 +
             Math.sin(t * 3.1 + 0.7) * 0.12;
    },

    kep: function (v, a, b) { return v < a ? a : (v > b ? b : v); }
  };
})();
