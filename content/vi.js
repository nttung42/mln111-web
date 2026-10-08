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
    ten: 'Tháp Triết Học',
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
    tieuDe: 'Tháp Triết Học',
    dan: 'Triết học Mác – Lênin nói về <em>quan hệ</em> và <em>quá trình</em>. ' +
         'Chữ viết chỉ mô tả được trạng thái tĩnh của những thứ vốn dĩ là vận động. ' +
         'Ở đây bạn sẽ tự tay vận hành chúng.',
    dan2: 'Trước mặt bạn là một cầu thang xoắn đi lên. Dọc đường có những cánh cửa sáng, ' +
          'mỗi cửa mang tên một khái niệm. Cứ leo, và mở cửa nào bạn muốn.',
    batDau: 'Bắt đầu leo',
    ghiChu: 'Không có thắng thua, không đếm giờ. Cứ nghịch thử.',

    leoLen:   'Leo lên và tìm một cánh cửa sáng',
    vaoCua:   'Giữ <kbd>F</kbd> hoặc bấm chuột trái để bước vào',
    bamCua:   'Bấm chuột trái để bước vào cánh cửa này',
    dinhThap: 'Phía trên chìm trong sương — những phòng tiếp theo sắp mở',

    /* bảng giới thiệu gắn ở chân trụ tháp — mỗi dòng phải vừa một hàng trên bảng */
    bang: {
      tieuDe: 'Tháp Triết Học',
      phu: 'một bảo tàng triết học có thể bước vào',
      than: [
        'Mỗi cánh cửa dọc cầu thang mở ra một căn phòng.',
        'Ở đó, một quy luật hay phạm trù của phép biện chứng',
        'duy vật không chỉ được giảng — mà được bạn tự tay vận hành.',
        'Cầu thang xoắn cũng là một bài học: phát triển đi lên',
        'theo đường xoáy ốc, lặp lại cái cũ ở trình độ cao hơn.'
      ],
      trietGia: [
        { file: 'hegel.jpg',  ten: 'G. W. F. Hegel', nam: '1770 – 1831' },
        { file: 'marx.jpg',   ten: 'Karl Marx',      nam: '1818 – 1883' },
        { file: 'engels.jpg', ten: 'Friedrich Engels', nam: '1820 – 1895' },
        { file: 'lenin.jpg',  ten: 'V. I. Lênin',    nam: '1870 – 1924' }
      ],
      /* kí hiệu ở dải dưới cùng, mỗi kí hiệu ứng với một phòng */
      kiHieu: [
        { hinh: 'vong',   chu: 'Biện chứng' },
        { hinh: 'tang',   chu: 'Hạ tầng – Thượng tầng' },
        { hinh: 'buoc',   chu: 'Lượng – Chất' },
        { hinh: 'doiLap', chu: 'Mặt đối lập' },
        { hinh: 'mat',    chu: 'Nhận thức' },
        { hinh: 'xoan',   chu: 'Phủ định của phủ định' }
      ]
    }
  }
};
