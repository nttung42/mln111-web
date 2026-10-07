/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Mâu thuẫn — "Nhà máy: hai phía của dây chuyền"
   (id: mau-thuan)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['mau-thuan'] = {
  tang: 'Tháp Triết Học · Tầng II — Nhà máy',
  ten: 'Phòng II — Thống nhất và đấu tranh của các mặt đối lập',
  chuong: 'MLN111 · Chương 2 — Chủ nghĩa duy vật biện chứng',

  moDau: {
    tieuDe: 'Nhà máy: hai phía của dây chuyền',
    than: 'Phía dưới là <b>công nhân</b> đứng máy. Trên phòng kính là <b>ban quản lý</b> với bảng chỉ tiêu. ' +
          'Họ vừa cho dây chuyền chạy gần hết công suất. ' +
          'Bạn đứng ở bàn điều khiển giữa hai phía, có ba cần gạt: <em>tốc độ</em>, <em>thời gian nghỉ</em>, <em>tiền lương</em>. ' +
          'Hãy làm cho nhà máy chạy được lâu dài, không để phía nào bị ép đến mức sụp.'
  },

  /* ---------- ba cần gạt ---------- */
  can: {
    toc:   { ten: 'TỐC ĐỘ DÂY CHUYỀN', thap: 'CHẬM', cao: 'NHANH' },
    nghi:  { ten: 'THỜI GIAN NGHỈ',    thap: 'ÍT',   cao: 'NHIỀU' },
    luong: { ten: 'TIỀN LƯƠNG',        thap: 'THẤP', cao: 'CAO' }
  },

  /* ---------- bảng chỉ số ---------- */
  nhan: {
    trangThai: 'Trạng thái nhà máy',
    khungHoang: 'Khủng hoảng',
    benQL: 'Ban quản lý',
    benCN: 'Công nhân',
    sanLuong: 'Sản lượng',
    loiNhuan: 'Lợi nhuận',
    sucKhoe: 'Sức khỏe',
    tinhThan: 'Tinh thần',
    giu: 'Giữ cả bốn chỉ số từ %n trở lên',
    buocNhay: 'Mâu thuẫn → phát triển'
  },

  trangThai: {
    CHAY:    'ĐANG VẬN HÀNH',
    LECH_QL: 'LỆCH VỀ BAN QUẢN LÝ',
    LECH_CN: 'LỆCH VỀ CÔNG NHÂN',
    BAT_ON:  'HỆ THỐNG BẤT ỔN',
    KHUNG:   'KHỦNG HOẢNG',
    ON:      'ỔN ĐỊNH',
    XONG:    'BƯỚC SANG NẤC MỚI'
  },

  /* ---------- dòng gợi ý ---------- */
  goiY: {
    xa: 'Lại gần bàn điều khiển, nhìn vào một cần gạt',
    can: {
      toc:   'Giữ <kbd>Chuột trái</kbd> tăng <b>tốc độ</b> · <kbd>Chuột phải</kbd> giảm',
      nghi:  'Giữ <kbd>Chuột trái</kbd> tăng <b>thời gian nghỉ</b> · <kbd>Chuột phải</kbd> giảm',
      luong: 'Giữ <kbd>Chuột trái</kbd> tăng <b>tiền lương</b> · <kbd>Chuột phải</kbd> giảm'
    },
    canDP: {
      toc:   'Giữ <kbd>F</kbd> tăng <b>tốc độ</b> · <kbd>R</kbd> giảm',
      nghi:  'Giữ <kbd>F</kbd> tăng <b>thời gian nghỉ</b> · <kbd>R</kbd> giảm',
      luong: 'Giữ <kbd>F</kbd> tăng <b>tiền lương</b> · <kbd>R</kbd> giảm'
    },
    batOn: '⚠ Một phía đang bị ép quá mức. Hệ thống sắp mất ổn định',
    khungCN: 'Công nhân kiệt sức và ngừng việc. Mâu thuẫn đã phát triển thành khủng hoảng',
    khungQL: 'Nhà máy thua lỗ, ban quản lý cho dừng dây chuyền. Mâu thuẫn đã phát triển thành khủng hoảng',
    khungSua: 'Kéo lại các cần gạt để dây chuyền chạy lại được',
    chayLai: 'Dây chuyền chạy lại',
    on: 'Đang ổn định. Giữ thêm một chút',
    ket: 'Mâu thuẫn tồn tại trong chính sự vật, giữa các mặt đối lập. ' +
         'Sự tác động và đấu tranh giữa chúng tạo nên vận động và phát triển.'
  },

  /* Hai phía không đứng yên chờ bạn. Phía nào đang chịu thiệt sẽ tự đòi. */
  yeuSach: {
    ql: 'Ban quản lý: <b>tăng tốc dây chuyền</b> để kịp đơn hàng!',
    cnNghi: 'Công nhân: <b>đòi thêm giờ nghỉ</b>!',
    cnLuong: 'Công nhân: <b>đòi tăng lương</b>!'
  },

  /* ---------- chú giải khi nhìn vào vật ---------- */
  chuGiai: {
    congNhan: {
      nhan: 'MẶT ĐỐI LẬP · CÔNG NHÂN',
      tieuDe: 'Phía bán sức lao động',
      lyThuyet: 'Lợi ích của họ là sức khỏe, thời gian nghỉ, tiền lương. ' +
                'Ép họ quá mức thì họ chậm lại, máy hỏng, có người bỏ việc. ' +
                'Không có họ thì dây chuyền không chạy: mặt đối lập này là <b>điều kiện tồn tại</b> của mặt kia.'
    },
    quanLy: {
      nhan: 'MẶT ĐỐI LẬP · BAN QUẢN LÝ',
      tieuDe: 'Phía nắm chỉ tiêu và chi phí',
      lyThuyet: 'Lợi ích của họ là sản lượng và lợi nhuận. Mỗi đồng lương, mỗi phút nghỉ đều là chi phí. ' +
                'Hai phía <b>bài trừ nhau về lợi ích</b>, nhưng không phía nào tồn tại được nếu thiếu phía kia.'
    },
    kpi: {
      nhan: 'BẢNG CHỈ TIÊU',
      tieuDe: 'Bốn con số kéo về hai hướng',
      lyThuyet: 'Hai cột xanh là lợi ích của ban quản lý, hai cột cam là lợi ích của công nhân. ' +
                'Kéo một bên lên quá mức thì bên kia tụt, và về lâu dài kéo luôn bên được ưu tiên xuống theo.'
    },
    dayChuyen: {
      nhan: 'SỰ VẬT · DÂY CHUYỀN',
      tieuDe: 'Nơi hai mặt đối lập gặp nhau',
      lyThuyet: 'Mâu thuẫn không nằm ngoài nhà máy mà ở <b>ngay trong</b> nó. ' +
                'Mỗi thùng hàng chạy ra là kết quả của sự tác động qua lại giữa hai phía.'
    },
    kho: {
      nhan: 'KHO NGUYÊN LIỆU',
      tieuDe: 'Đầu vào của dây chuyền',
      lyThuyet: 'Nguyên liệu chỉ thành hàng hoá khi đi qua tay công nhân và máy móc của nhà máy. ' +
                'Thiếu một trong hai, kho này chỉ là đống phôi nằm yên.'
    },
    thanhPham: {
      nhan: 'THÀNH PHẨM',
      tieuDe: 'Cái mà cả hai phía cùng cần',
      lyThuyet: 'Ban quản lý cần nó để có lợi nhuận, công nhân cần nó để có việc làm và thu nhập. ' +
                'Đây là chỗ hai mặt đối lập <b>thống nhất</b>: cùng nằm trong một quá trình sản xuất.'
    },
    den: {
      nhan: 'ĐÈN BÁO',
      tieuDe: 'Đỏ · vàng · xanh',
      lyThuyet: 'Vàng: một phía đang bị ép. Đỏ: mâu thuẫn đã thành khủng hoảng, cả hệ thống dừng. ' +
                'Xanh: hai phía đang ở thế thống nhất, dù cuộc đấu tranh giữa chúng vẫn tiếp diễn.'
    },
    nghi: {
      nhan: 'GÓC NGHỈ',
      tieuDe: 'Thời gian không sản xuất',
      lyThuyet: 'Với công nhân, đây là thời gian hồi sức. Với ban quản lý, đây là sản lượng bị mất. ' +
                'Cùng một khoảng thời gian, hai phía nhìn theo hai hướng ngược nhau.'
    },
    day2: {
      nhan: 'DÂY CHUYỀN 2',
      tieuDe: 'Chưa vận hành',
      lyThuyet: 'Một nhà máy cứ phải chữa cháy khủng hoảng thì không mở rộng được. ' +
                'Dây chuyền này chờ đến khi hai phía tìm được cách cùng vận động.'
    }
  },

  baiHoc: {
    nhan: 'Nhà máy vừa bước sang nấc mới',
    tieuDe: 'Mâu thuẫn là nguồn gốc của vận động và phát triển',
    dan: 'Bạn không xoá được mâu thuẫn: công nhân vẫn muốn nghỉ nhiều hơn, ban quản lý vẫn muốn chạy nhanh hơn. ' +
         'Chính những lần nhà máy bị đẩy lệch đã buộc cách vận hành phải đổi, và nhờ thế nhà máy mở được dây chuyền thứ hai.',
    dinhNghia: [
      ['Mặt đối lập', 'Những mặt có khuynh hướng biến đổi trái ngược nhau, cùng tồn tại trong một sự vật: công nhân và ban quản lý trong một nhà máy.'],
      ['Thống nhất', 'Các mặt đối lập lấy nhau làm tiền đề tồn tại. Không có công nhân thì không có sản xuất, không có nhà máy thì công nhân không có việc.'],
      ['Đấu tranh', 'Các mặt đối lập tác động qua lại, bài trừ nhau. Ép một phía quá mức thì phía ấy phản ứng, cả hệ thống dừng lại.'],
      ['Chuyển hoá', 'Đấu tranh đến mức nhất định thì mâu thuẫn được giải quyết, sự vật chuyển sang trạng thái mới.']
    ],
    trichDan: '“Sự thống nhất (phù hợp, đồng nhất, tác dụng ngang nhau) của các mặt đối lập là có điều kiện, ' +
              'tạm thời, thoáng qua, tương đối. Sự đấu tranh của các mặt đối lập bài trừ lẫn nhau là tuyệt đối, ' +
              'cũng như sự phát triển, sự vận động là tuyệt đối.”',
    nguon: 'V. I. Lênin — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    phuongPhapLuan: [
      ['Thừa nhận', 'Mâu thuẫn là khách quan, vốn có trong sự vật. Không có nút gạt nào làm nó biến mất.'],
      ['Phân tích cụ thể', 'Xem mặt nào đang bị ép, ép đến đâu, rồi mới chọn cách tác động.'],
      ['Không điều hoà', 'Ổn định không phải là “hoà cả làng”. Thống nhất chỉ là tạm thời, đấu tranh vẫn tiếp tục.']
    ],
    /* mô hình đơn giản hoá — phải nói rõ để không hiểu sai học thuyết */
    luuY: 'Lưu ý: đây là mô hình đơn giản hoá. Với chủ nghĩa Mác – Lênin, mâu thuẫn giữa lao động và tư bản ' +
          'là <em>mâu thuẫn đối kháng</em>; chỉnh tốc độ hay tiền lương không giải quyết được nó tận gốc, ' +
          'muốn vậy phải thay đổi chính quan hệ sản xuất.',
    lienHe: {
      tieuDe: 'Thử tự trả lời',
      than: 'Nhóm đồ án của bạn: người muốn chạy cho kịp hạn, người muốn làm kỹ. Nếu một phía luôn thắng thì sau vài tuần ra sao? ' +
            '<em>Giải quyết</em> một mâu thuẫn khác <em>dập tắt</em> nó ở chỗ nào?'
    },
    nhacKhung: 'Nhà máy đã rơi vào khủng hoảng %n lần trước khi bạn tìm được cách vận hành này.',
    nhacKhong: 'Bạn giữ được nhà máy mà chưa để nó khủng hoảng lần nào. Lần sau, thử ép hẳn một phía xem sao.'
  },

  soTay: {
    ten: 'Mâu thuẫn',
    tom: 'Các mặt đối lập vừa thống nhất (dựa vào nhau để tồn tại) vừa đấu tranh (bài trừ nhau). ' +
         'Thống nhất là tương đối, đấu tranh là tuyệt đối. Mâu thuẫn là nguồn gốc, động lực của vận động và phát triển.'
  }
};
