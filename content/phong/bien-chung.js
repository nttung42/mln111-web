/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Biện chứng và Siêu hình   (id: bien-chung)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['bien-chung'] = {
  tang: 'Tháp Triết Học · Tầng I — Sương Mù',
  ten: 'Phòng — Hai cách nhìn',
  chuong: 'MLN111 · Chương 1 — Khái luận về triết học',

  moDau: {
    tieuDe: 'Một phòng, hai thế giới',
    than: 'Một đường ranh giới chia căn phòng làm đôi. Bên trái, mỗi vật đứng yên trên bệ ' +
          'của riêng nó. Bên phải, mọi vật đang biến đổi và nối vào nhau. ' +
          'Ngay trên ranh giới có một quả cầu và một cái cây — hãy nhìn chúng từ <em>cả hai phía</em>, ' +
          'rồi đi tới cánh cửa cuối phòng.'
  },

  ben: {
    TRAI: 'SIÊU HÌNH',
    PHAI: 'BIỆN CHỨNG',
    GIUA: 'RANH GIỚI'
  },

  nhan: {
    cachNhin: 'Bạn đang nhìn theo',
    daNhin: 'Đã nhìn cái cây từ',
    thanhTrai: 'SIÊU HÌNH',
    thanhPhai: 'BIỆN CHỨNG',
    buocNhay: 'Hợp nhất'
  },

  /* biển lớn trên tường hai bên */
  tuong: {
    trai: ['SIÊU HÌNH', 'tĩnh · tách rời · cố định'],
    phai: ['BIỆN CHỨNG', 'động · liên hệ · biến đổi']
  },

  /* nhãn hiện vật trên bệ bên siêu hình — thứ tự khớp với rooms/bien-chung.js */
  hienVat: [
    ['MẶT TRỜI',  'hiện vật số 01'],
    ['NƯỚC',      'hiện vật số 02'],
    ['ĐẤT',       'hiện vật số 03'],
    ['BÁNH RĂNG', 'hiện vật số 04']
  ],

  cua: {
    hoi: 'Sự vật là gì?',
    trai: ['SIÊU HÌNH', '“Nó là chính nó.”'],
    phai: ['BIỆN CHỨNG', '“Nó là chính nó trong những mối liên hệ', 'và quá trình vận động.”']
  },

  goiY: {
    trai:     'Bên <b>Siêu hình</b> — mỗi vật đứng riêng trên bệ, không gì chuyển động',
    phai:     'Bên <b>Biện chứng</b> — không vật nào thực sự đứng một mình',
    giua:     'Bạn đang đứng trên ranh giới — bước sang một bên để đổi cách nhìn',
    cayTrai:  'Từ phía này, cái cây chỉ là <b>một bức tượng</b>. Thử bước sang phía bên kia',
    cayPhai:  'Từ phía này, cái cây là <b>một quá trình</b>. Thử bước sang phía bên kia',
    cuaThieu: 'Hãy nhìn cái cây từ phía <b>%s</b> trước đã',
    cuaMo:    'Giữ <kbd>Chuột trái</kbd> để mở cửa',
    cuaMoDP:  'Giữ <kbd>F</kbd> để mở cửa',
    hopNhat:  'Ranh giới tan đi…'
  },

  /* chú giải khi nhìn vào đạo cụ — xem TX.hud.nhinChuGiai */
  chuGiai: {
    be: {
      nhan: 'SIÊU HÌNH · HIỆN VẬT',
      tieuDe: 'Mỗi vật một bệ, một khoảng cách cố định',
      lyThuyet: 'Phương pháp siêu hình nhận thức đối tượng ở trạng thái <b>cô lập, tách rời</b> ' +
                'khỏi các sự vật khác. Mặt trời, nước, đất được đo đạc chính xác — nhưng từng thứ một, ' +
                'như những hiện vật không liên quan gì đến nhau.'
    },
    lienHe: {
      nhan: 'BIỆN CHỨNG · LIÊN HỆ',
      tieuDe: 'Cùng những vật ấy, nhưng nối vào nhau',
      lyThuyet: 'Nắng xuống mầm, nước thấm vào đất, bánh răng này kéo bánh răng kia. ' +
                'Phương pháp biện chứng nhận thức đối tượng trong <b>các mối liên hệ</b> — ' +
                'chúng ảnh hưởng, ràng buộc và quy định lẫn nhau.'
    },
    cauTrai: {
      nhan: 'QUẢ CẦU · NHÌN TỪ PHÍA SIÊU HÌNH',
      tieuDe: 'Một trạng thái, được giữ đứng yên',
      lyThuyet: 'Ánh sáng cố định, quả cầu bất động. Siêu hình nhìn sự vật ở <b>trạng thái tĩnh</b>; ' +
                'nếu có biến đổi thì chỉ là tăng giảm về lượng, do nguyên nhân bên ngoài.'
    },
    cauPhai: {
      nhan: 'QUẢ CẦU · NHÌN TỪ PHÍA BIỆN CHỨNG',
      tieuDe: 'Vẫn quả cầu ấy, nhưng đang biến đổi',
      lyThuyet: 'Tối dần, sáng dần, bừng lên rồi trở lại. Biện chứng nhìn sự vật trong ' +
                '<b>vận động và phát triển</b> — một quá trình, chứ không phải một lát cắt.'
    },
    cayTrai: {
      nhan: 'CÁI CÂY · NHÌN TỪ PHÍA SIÊU HÌNH',
      tieuDe: 'Một bức tượng cây',
      lyThuyet: 'Hình dạng cố định, không gió, không đất, không nắng. Đúng là cái cây — ' +
                'nhưng chỉ là một trạng thái của nó, bị cắt khỏi mọi thứ làm nên nó.'
    },
    cayPhai: {
      nhan: 'CÁI CÂY · NHÌN TỪ PHÍA BIỆN CHỨNG',
      tieuDe: 'Mầm → cây non → cây lớn → lá rụng',
      lyThuyet: 'Rễ hút nước, lá đón nắng, cây sinh ra, lớn lên rồi tàn đi để mầm khác mọc. ' +
                'Cái cây là <b>chính nó trong những mối liên hệ và quá trình vận động</b>.'
    },
    cua: {
      nhan: 'CÁNH CỬA',
      tieuDe: 'Sự vật là gì?',
      lyThuyet: 'Hai câu trả lời không loại trừ nhau hoàn toàn: sự vật đúng là “chính nó” — ' +
                'nhưng chỉ hiểu được trọn vẹn khi đặt nó trong liên hệ và trong vận động.'
    }
  },

  baiHoc: {
    nhan: 'Một phòng — hai thế giới — cùng một sự vật',
    tieuDe: 'Hai phương pháp nhận thức',
    dan: 'Cùng một quả cầu, cùng một cái cây, cùng mặt trời, nước, đất. Đứng bên trái, bạn thấy ' +
         'chúng đứng yên và tách rời. Đứng bên phải, bạn thấy chúng biến đổi và nối vào nhau. ' +
         'Sự vật không đổi — <em>cách nhìn</em> đổi.',
    dinhNghia: [
      ['Phương pháp siêu hình', 'Nhận thức đối tượng ở trạng thái cô lập, tách rời, giữa các mặt đối lập có một ranh giới tuyệt đối; ở trạng thái tĩnh — nếu có biến đổi thì chỉ là biến đổi về lượng, do nguyên nhân bên ngoài.'],
      ['Phương pháp biện chứng', 'Nhận thức đối tượng trong các mối liên hệ, ảnh hưởng, ràng buộc lẫn nhau; ở trạng thái vận động, biến đổi, nằm trong khuynh hướng chung là phát triển.'],
      ['Không phải vô dụng', 'Trong một phạm vi nhất định, cần tạm tách sự vật ra và giữ nó đứng yên để đo đạc, phân loại. Sai lầm chỉ xuất hiện khi lấy đó làm cách nhìn duy nhất.']
    ],
    trichDan: '“…chỉ nhìn thấy những sự vật riêng biệt mà không nhìn thấy mối liên hệ qua lại giữa những sự vật ấy, ' +
              'chỉ nhìn thấy trạng thái tĩnh của những sự vật ấy mà quên mất sự vận động của những sự vật ấy, ' +
              'chỉ nhìn thấy cây mà không thấy rừng.”',
    nguon: 'Ph. Ăngghen, Chống Đuyrinh — C. Mác và Ph. Ăngghen: Toàn tập, t.20, tr.37; dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    phuongPhapLuan: [
      ['Liên hệ', 'Xem xét sự vật trong mối liên hệ với những sự vật khác, không tách nó khỏi môi trường của nó.'],
      ['Vận động', 'Xem xét sự vật trong quá trình sinh ra, phát triển và mất đi, không chụp lấy một lát cắt đứng yên.'],
      ['Ranh giới', 'Ngay cả đường kẻ chia đôi căn phòng cũng là một hình ảnh siêu hình: một ranh giới tuyệt đối. Khi bạn bước qua cửa, nó tan đi.']
    ],
    lienHe: {
      tieuDe: 'Thử tự trả lời',
      than: 'Khi đánh giá một người bạn, bạn chụp lấy một lỗi họ vừa mắc, hay nhìn họ ' +
            'trong cả quá trình và trong hoàn cảnh của họ? Hai cách ấy cho ra hai kết luận khác nhau đến mức nào?'
    }
  },

  soTay: {
    ten: 'Biện chứng và Siêu hình',
    tom: 'Siêu hình nhìn sự vật cô lập và tĩnh tại; biện chứng nhìn sự vật trong liên hệ phổ biến và trong sự vận động, phát triển.'
  }
};
