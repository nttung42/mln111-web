/* ═══════════════════════════════════════════════════════════════════
   TOÀN BỘ CHỮ TIẾNG VIỆT CỦA GAME
   ───────────────────────────────────────────────────────────────────
   CHỮ TIẾNG VIỆT DÙNG CHUNG — giao diện chung và sảnh
   ───────────────────────────────────────────────────────────────────
   File này dành cho người phụ trách NỘI DUNG TRIẾT HỌC.

   Chữ của TỪNG PHÒNG nằm ở content/phong/<id-phòng>.js, mỗi phòng một
   file, để nhiều người (hoặc nhiều phiên làm việc) sửa song song mà
   không đụng nhau.

   Quy tắc:
   - Mọi trích dẫn phải ghi rõ nguồn ở trường `nguon`.
   - Giữ câu ngắn. Thẻ nội dung không được dài quá một màn hình.

   THÊM PHÒNG MỚI: chép một file trong content/phong/, đổi id, rồi thêm
   một dòng <script> cho nó trong index.html (ngay sau content/vi.js).
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.VI = {

  /* ---------- Chung ---------- */
  game: {
    ten: 'Tháp Xoắn Ốc',
    phu: 'Sản phẩm học tập môn MLN111 · Triết học Mác – Lênin',
    vaoPhong: 'Bước vào phòng',
    troLai: 'Trở lại phòng',
    veSanh: 'Về sảnh',
    roiPhong: {
      tieuDe: 'Rời phòng, về sảnh?',
      than: 'Những gì bạn đang làm dở trong phòng này sẽ không được giữ lại. Lần sau vào, phòng bắt đầu lại từ đầu.',
      o: 'Ở lại'
    },
    tiepTuc: 'Tiếp tục',
    soTay: 'Sổ tay biện chứng',
    soTayTrong: 'Chưa có mục nào. Hoàn thành một phòng để ghi vào đây.',
    chuGiai: {
      lam: 'Bạn vừa thấy',
      nghia: 'Điều đó nghĩa là',
      viSao: 'Vì sao thiết kế như vậy',
      lyThuyet: 'Lý thuyết',
      chan: 'Nhìn vào đạo cụ khác để đọc tiếp · <kbd>G</kbd> tắt chú giải',
      daTat: 'Đã tắt chú giải · ấn <kbd>G</kbd> để bật lại',
      daBat: 'Đã bật chú giải · nhìn vào đạo cụ để đọc',
      soKhamPha: 'Đã khám phá ở trạm này',
      khoa: 'Chưa khám phá',
      khoaMo: 'Nhìn vào các đạo cụ trong trạm để mở mục này.'
    },
    dieuKhien: {
      khoa: 'Giữ <kbd>Chuột trái</kbd> · Giữ <kbd>Chuột phải</kbd>',
      duPhong: 'Giữ <kbd>F</kbd> · Giữ <kbd>R</kbd> · <kbd>Kéo chuột</kbd> để nhìn quanh'
    }
  },

  sanh: {
    tieuDe: 'Tháp Xoắn Ốc',
    dan: 'Triết học Mác – Lênin nói về <em>quan hệ</em> và <em>quá trình</em>. ' +
         'Chữ viết chỉ mô tả được trạng thái tĩnh của những thứ vốn dĩ là vận động. ' +
         'Ở đây bạn sẽ tự tay vận hành chúng.',
    dan2: 'Trước mặt bạn là một cầu thang xoắn đi lên. Dọc đường có những cánh cửa sáng, ' +
          'mỗi cửa mang tên một khái niệm. Cứ leo, và mở cửa nào bạn muốn.',
    batDau: 'Bắt đầu leo',
    ghiChu: 'Không có thắng thua, không đếm giờ. Cứ nghịch thử.',

    leoLen:   'Leo lên và tìm một cánh cửa sáng',
    vaoCua:   'Giữ <kbd>F</kbd> để bước vào, hoặc bấm chuột vào cánh cửa',
    bamCua:   'Bấm chuột để bước vào cánh cửa này',
    dinhThap: 'Đỉnh tháp còn đang xây — những phòng tiếp theo sẽ mở ở đây'
  }
};
