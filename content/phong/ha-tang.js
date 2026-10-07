/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Cơ sở hạ tầng và Kiến trúc thượng tầng
   — "Thành phố trên nền móng"   (id: ha-tang)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['ha-tang'] = {
  tang: 'Tháp Triết Học · Tầng III — Thành phố',
  ten: 'Phòng III — Cơ sở hạ tầng và Kiến trúc thượng tầng',
  chuong: 'MLN111 · Chương 3 — Chủ nghĩa duy vật lịch sử',

  moDau: {
    tieuDe: 'Thành phố trên nền móng',
    than: 'Giữa phòng là sa bàn một thành phố nhỏ: trên mặt đất có tòa thị chính, tòa án, trường học, nhà hát. ' +
          'Mặt đất của sa bàn mở ra được. Bên dưới là phần nuôi sống cả thành phố. ' +
          'Bạn có bốn nút ở bàn điều khiển: <em>Sản xuất</em>, <em>Giao thông</em>, <em>Năng lượng</em> và <em>Chính sách</em>. ' +
          'Mỗi lượt bấm một nút, rồi xem thành phố phản ứng. Có bốn nhiệm vụ, xem ở góc trái trên.'
  },

  /* ---------- ô nhiệm vụ góc trái trên ---------- */
  nhiemVu: {
    tieuDe: 'Nhiệm vụ',
    nv1: { ten: 'Mở mặt đất',          mo: 'Lại gần sa bàn, kéo cần <b>MỞ MẶT ĐẤT</b> ở mép trước.' },
    nv2: { ten: 'Xây nền móng',        mo: 'Xây hạ tầng %n lần. Để ý xem phía trên mặt đất thay đổi ra sao.' },
    nv3: { ten: 'Ban hành chính sách', mo: 'Bấm nút <b>CHÍNH SÁCH</b> để ban hành Luật môi trường.' },
    nv4: { ten: 'Thành phố phát triển', mo: 'Đưa điểm phát triển lên %n. Phải xây cả hai tầng.' },
    phim: 'Đang quan sát…',
    khung: 'Thành phố đang gặp vấn đề'
  },

  /* ---------- bàn điều khiển ---------- */
  nut: {
    sx: { ten: 'SẢN XUẤT',   mo: 'thêm nhà máy · thêm của cải' },
    gt: { ten: 'GIAO THÔNG', mo: 'thêm tàu, thêm xe · hết ùn tắc' },
    nl: { ten: 'NĂNG LƯỢNG', mo: 'thêm điện cho nhà máy và thành phố' },
    cs: { ten: 'CHÍNH SÁCH', mo: 'chuột phải: đổi chính sách' }
  },
  nlSach: 'NĂNG LƯỢNG SẠCH',

  /* chính sách: ban hành ở tầng trên, rồi tác động xuống tầng dưới */
  chinhSach: {
    mt: { ten: 'Luật môi trường',         tang: 'Nhà nước – Pháp luật' },
    gd: { ten: 'Đầu tư giáo dục',         tang: 'Giáo dục' },
    vh: { ten: 'Văn hóa – Truyền thông',  tang: 'Văn hóa – Truyền thông' }
  },

  can: 'MỞ MẶT ĐẤT',
  tangTren: 'KIẾN TRÚC THƯỢNG TẦNG',
  tangDuoi: 'CƠ SỞ HẠ TẦNG',

  /* ---------- bảng chỉ số ---------- */
  nhan: {
    diem: 'Điểm phát triển',
    trangThai: 'Trạng thái',
    luot: 'Lượt',
    haTang: 'Hạ tầng',
    thuongTang: 'Thượng tầng',
    sx: 'Sản xuất',
    gt: 'Giao thông',
    nl: 'Năng lượng',
    kt: 'Kinh tế',
    tc: 'Nhà nước – Pháp luật',
    gd: 'Giáo dục',
    vh: 'Văn hóa – Truyền thông',
    tt: 'Thượng tầng',
    on: 'Ô nhiễm',
    luotTruoc: 'Lượt vừa rồi',
    buocNhay: 'Thành phố phát triển'
  },

  trangThai: {
    NHO:   'THÀNH PHỐ NHỎ',
    LON:   'ĐANG LỚN LÊN',
    CAN:   'CÂN ĐỐI',
    VAN_DE: 'CÓ VẤN ĐỀ',
    XONG:  'PHÁT TRIỂN'
  },

  /* Các vấn đề của thành phố — mỗi cái là một kiểu mất cân đối */
  vanDe: {
    UN_TAC:     { bien: 'ÙN TẮC',          mo: 'Sản xuất vượt xa giao thông: hàng không chở kịp, kinh tế chững lại.' },
    THIEU_DIEN: { bien: 'THIẾU ĐIỆN',      mo: 'Sản xuất vượt xa năng lượng: nhà máy chạy không đủ công suất.' },
    O_NHIEM:    { bien: 'Ô NHIỄM',         mo: 'Khói nhà máy phủ kín thành phố, người dân bất mãn.' },
    TUT_HAU:    { bien: 'THIẾU TRƯỜNG HỌC', mo: 'Kinh tế lớn nhanh mà thượng tầng không theo kịp: thiếu trường, thiếu luật, quản lý rối.' },
    QUA_TAI:    { bien: 'KHÔNG ĐỦ NGUỒN LỰC', mo: 'Thượng tầng xây vượt quá sức của nền kinh tế: không có gì để duy trì nó.' }
  },

  /* ---------- chuỗi phản ứng sau mỗi lượt ---------- */
  chuoi: {
    sx: 'Xây nhà máy',
    gt: 'Mở tuyến giao thông',
    nl: 'Xây nhà máy điện',
    nlSach: 'Xây điện sạch',
    mt: 'Ban hành Luật môi trường',
    gd: 'Đầu tư giáo dục',
    vh: 'Đầu tư văn hóa – truyền thông',
    ktLen: 'kinh tế ↑',
    ktXuong: 'kinh tế ↓',
    ttLen: 'thượng tầng lớn lên theo',
    ttXuong: 'thượng tầng teo lại vì thiếu nguồn lực',
    sxXuong: 'nhà máy giảm sản lượng',
    sxLen: 'lao động lành nghề hơn, sản xuất ↑',
    onLen: 'khói ↑',
    onXuong: 'khói ↓',
    unTac: 'ùn tắc',
    thieuDien: 'thiếu điện'
  },

  /* ---------- dòng gợi ý ---------- */
  goiY: {
    xa: 'Lại gần bàn điều khiển, nhìn vào một nút',
    nv1: 'Lại gần sa bàn, nhìn vào cần <b>MỞ MẶT ĐẤT</b> ở mép trước',
    can: 'Bấm <kbd>Chuột trái</kbd> để <b>mở mặt đất</b>',
    canDP: 'Bấm <kbd>F</kbd> để <b>mở mặt đất</b>',
    nv2: 'Xây hạ tầng: nhìn vào <b>Sản xuất</b>, <b>Giao thông</b> hoặc <b>Năng lượng</b>',
    nv3: 'Nhìn vào nút <b>CHÍNH SÁCH</b> và ban hành <b>Luật môi trường</b>',
    nv4: 'Mỗi lượt bấm một nút. Xây cả hai tầng để đạt 80 điểm',
    nut: 'Bấm <kbd>Chuột trái</kbd>: <b>%s</b>',
    nutDP: 'Bấm <kbd>F</kbd>: <b>%s</b>',
    nutCS: 'Bấm <kbd>Chuột trái</kbd>: ban hành <b>%s</b> · <kbd>Chuột phải</kbd> đổi chính sách',
    nutCSDP: 'Bấm <kbd>F</kbd>: ban hành <b>%s</b> · <kbd>R</kbd> đổi chính sách',
    khoa: 'Nút này chưa mở ở nhiệm vụ hiện tại',
    khoaCS: 'Nhiệm vụ này chỉ ban hành <b>Luật môi trường</b>',
    dangLuot: 'Thành phố đang phản ứng…',
    ket: 'Hạ tầng tạo nền cho thượng tầng; thượng tầng tác động trở lại hạ tầng.'
  },

  /* ---------- cảnh phim ---------- */
  phim1: [
    { k: 'Mặt đất mở ra', t: 'Bên dưới thành phố', p: 'Thứ nuôi sống cả thành phố nằm dưới mặt đất. Nhìn kỹ: không có gì đứng yên.' },
    { k: 'Sản xuất', t: 'Nhà máy và người lao động', p: 'Nhà máy chạy, công nhân làm việc, của cải được tạo ra ở đây.' },
    { k: 'Năng lượng', t: 'Điện chạy trong dây', p: 'Mỗi xung sáng là điện đi lên nhà máy, trường học, tòa thị chính.' },
    { k: 'Giao thông', t: 'Tàu chở hàng', p: 'Hàng hoá đi từ nơi làm ra đến nơi cần dùng.' },
    { k: 'Trên mặt đất', t: 'Những gì dựng trên nền ấy', p: 'Nhà nước, pháp luật, trường học, văn hóa, truyền thông. Chúng lấy sức từ đâu?' }
  ],
  phim2: [
    { k: 'Dưới mặt đất', t: 'Nền kinh tế mạnh lên', p: 'Thêm nhà máy, thêm điện, thêm tàu. Của cải theo trục giữa đi lên.' },
    { k: 'Trên mặt đất', t: 'Thượng tầng lớn lên theo', p: 'Bạn không bấm nút nào ở tầng trên, vậy mà trường học, tòa thị chính, nhà hát đều cao thêm.' }
  ],
  phim3: [
    { k: 'Tầng trên', t: 'Luật môi trường được ban hành', p: 'Nhà nước ra luật: giảm khói, giảm ô nhiễm.' },
    { k: 'Tác động ngược', t: 'Luật đi xuống tận nhà máy', p: 'Nhà máy phải giảm sản lượng, khói tan bớt, nhưng kinh tế cũng tụt xuống.' },
    { k: 'Nhiệm vụ 4', t: 'Tìm lại đà phát triển', p: 'Từ giờ mọi nút đều mở. Sau luật mới, nhà máy điện xây thêm sẽ là điện sạch. Đưa thành phố lên 80 điểm.' }
  ],
  phim4: [
    { k: 'Thành phố phát triển', t: 'Hai tầng, một thành phố', p: '“Cơ sở hạ tầng là nền tảng hiện thực của đời sống xã hội; kiến trúc thượng tầng được hình thành trên cơ sở đó và tác động trở lại cơ sở hạ tầng.”' }
  ],

  /* ---------- chú giải khi nhìn vào vật ---------- */
  chuGiai: {
    thiChinh: {
      nhan: 'THƯỢNG TẦNG · NHÀ NƯỚC',
      tieuDe: 'Tòa thị chính',
      lyThuyet: 'Nhà nước là thiết chế quan trọng nhất của kiến trúc thượng tầng. ' +
                'Nhà nước không có sẵn từ đầu: nó ra đời khi xã hội có tư hữu và giai cấp, tức là khi nền kinh tế đã đổi khác.'
    },
    toaAn: {
      nhan: 'THƯỢNG TẦNG · PHÁP LUẬT',
      tieuDe: 'Tòa án',
      lyThuyet: 'Pháp luật quy định ai sở hữu gì, mua bán ra sao, tranh chấp xử thế nào. ' +
                'Nó ghi lại những quan hệ kinh tế đang có, rồi quay lại bảo vệ hoặc thay đổi chúng.'
    },
    truong: {
      nhan: 'THƯỢNG TẦNG · GIÁO DỤC',
      tieuDe: 'Trường học',
      lyThuyet: 'Nền kinh tế càng lớn càng cần nhiều người được đào tạo. ' +
                'Ngược lại, đầu tư giáo dục làm người lao động lành nghề hơn, và sản xuất tăng theo. Đó là một chiều tác động trở lại.'
    },
    nhaHat: {
      nhan: 'THƯỢNG TẦNG · VĂN HÓA',
      tieuDe: 'Nhà hát',
      lyThuyet: 'Nghệ thuật, đạo đức, lối sống là những hình thái ý thức xã hội. ' +
                'Chúng có nhịp riêng, có lúc đi trước, có lúc đi sau kinh tế. Đó là tính độc lập tương đối.'
    },
    thapTH: {
      nhan: 'THƯỢNG TẦNG · TRUYỀN THÔNG',
      tieuDe: 'Tháp truyền hình',
      lyThuyet: 'Báo chí, truyền thông lan truyền quan điểm, tư tưởng trong xã hội. ' +
                'Tháp chỉ cao được khi có điện, có tiền nuôi nó, tức là khi có nền kinh tế đỡ bên dưới.'
    },
    nhaO: {
      nhan: 'ĐỜI SỐNG KINH TẾ',
      tieuDe: 'Khu dân cư',
      lyThuyet: 'Nhà ở mọc lên theo việc làm và thu nhập. Đây không phải thượng tầng: nó là đời sống vật chất, lớn theo kinh tế.'
    },
    vanPhong: {
      nhan: 'ĐỜI SỐNG KINH TẾ',
      tieuDe: 'Doanh nghiệp, cửa hàng',
      lyThuyet: 'Nơi người ta thuê mướn, mua bán, chia lợi nhuận. Những quan hệ ấy thuộc về <b>cơ sở hạ tầng</b>, dù toà nhà đứng trên mặt đất.'
    },
    nhaMay: {
      nhan: 'HẠ TẦNG · SẢN XUẤT',
      tieuDe: 'Nhà máy',
      lyThuyet: 'Theo nghĩa triết học, cái nền không phải bản thân cái máy, mà là <b>quan hệ sản xuất</b>: ai sở hữu nhà máy, ai làm việc trong đó, sản phẩm chia thế nào.'
    },
    dien: {
      nhan: 'HẠ TẦNG · NĂNG LƯỢNG',
      tieuDe: 'Nhà máy điện',
      lyThuyet: 'Điện đi lên mọi toà nhà phía trên. Thiếu điện thì cửa sổ tối, nhà máy chạy không đủ công suất, thành phố chững lại.'
    },
    duongRay: {
      nhan: 'HẠ TẦNG · GIAO THÔNG',
      tieuDe: 'Đường ray',
      lyThuyet: 'Sản xuất nhiều mà không chở đi được thì hàng ùn lại. Các bộ phận của nền kinh tế phải đi cùng nhau.'
    },
    ongNuoc: {
      nhan: 'HẠ TẦNG',
      tieuDe: 'Đường ống',
      lyThuyet: 'Nước chảy liên tục bên dưới. Phần nền không bao giờ đứng yên, kể cả khi trên mặt đất trông yên ả.'
    },
    truc: {
      nhan: 'HAI TẦNG GẶP NHAU',
      tieuDe: 'Trục của cải',
      lyThuyet: 'Hạt vàng đi lên là của cải từ sản xuất nuôi tầng trên. Hạt tím đi xuống là chính sách từ tầng trên tác động trở lại tầng dưới.'
    },
    matCat: {
      nhan: 'MẶT CẮT',
      tieuDe: 'Ranh giới hai tầng',
      lyThuyet: 'Dải đất này chia thành phố làm hai tầng. Hai tầng nhìn khác nhau, nhưng bị nối liền bởi điện, của cải và luật lệ đi xuyên qua nó.'
    }
  },

  /* ---------- thẻ sau nhiệm vụ 2 ---------- */
  canh1: {
    nhan: 'Nhiệm vụ 2 · Xây nền móng',
    tieuDe: 'Nền móng nào thì tầng trên ấy',
    dan: 'Bạn chỉ xây ở dưới mặt đất. Vậy mà phía trên, trường học, tòa thị chính, nhà hát đều cao thêm. ' +
         'Tầng trên không tự mọc lên từ hư không: nó được dựng và nuôi bằng nền kinh tế bên dưới.',
    dinhNghia: [
      ['Cơ sở hạ tầng', 'Toàn bộ những quan hệ sản xuất hợp thành cơ cấu kinh tế của một xã hội nhất định.'],
      ['Kiến trúc thượng tầng', 'Toàn bộ những quan điểm chính trị, pháp quyền, đạo đức, tôn giáo, nghệ thuật, triết học… cùng những thiết chế tương ứng như nhà nước, đảng phái, giáo hội, đoàn thể.'],
      ['Cơ sở hạ tầng quyết định', 'Cơ sở hạ tầng nào thì sinh ra kiến trúc thượng tầng ấy. Cơ sở hạ tầng thay đổi thì sớm muộn kiến trúc thượng tầng cũng thay đổi theo.']
    ],
    luuY: 'Lưu ý: trong triết học, “cơ sở hạ tầng” <em>không phải</em> đường sá, điện nước (hạ tầng kỹ thuật). ' +
          'Đó là các <em>quan hệ sản xuất</em>: quan hệ sở hữu, quan hệ tổ chức quản lý, quan hệ phân phối. ' +
          'Nhà máy, đường ray, nhà máy điện trong sa bàn chỉ là hình ảnh của đời sống kinh tế đó.',
    nhiemVu3: {
      tieuDe: 'Nhiệm vụ 3 · Ban hành chính sách',
      than: 'Thành phố bắt đầu ám khói. Hãy dùng tầng trên: bấm nút <b>CHÍNH SÁCH</b> để ban hành <b>Luật môi trường</b>, rồi xem chuyện gì xảy ra ở dưới mặt đất.'
    },
    nut: 'Bắt đầu nhiệm vụ 3'
  },

  /* ---------- thẻ cuối ---------- */
  baiHoc: {
    nhan: 'Thành phố đạt 80 điểm',
    tieuDe: 'Thượng tầng tác động trở lại hạ tầng',
    dan: 'Chỉ xây hạ tầng thì thành phố giàu mà rối: thiếu trường, thiếu luật, ô nhiễm. ' +
         'Chỉ xây thượng tầng thì nó teo lại, vì không có gì nuôi. ' +
         'Bạn phải để tầng dưới làm nền, rồi dùng tầng trên quay lại thúc đẩy tầng dưới.',
    dinhNghia: [
      ['Tác động trở lại', 'Kiến trúc thượng tầng thúc đẩy cơ sở hạ tầng nếu phù hợp với nó, kìm hãm nếu không phù hợp. Luật môi trường làm sản xuất chậm lại; giáo dục làm sản xuất nhanh lên.'],
      ['Độc lập tương đối', 'Mỗi bộ phận của thượng tầng có nhịp riêng, có thể đi trước hoặc đi sau kinh tế.'],
      ['Nhưng không thay được vai trò quyết định', 'Thượng tầng xây vượt quá sức nền kinh tế thì không duy trì được. Rốt cuộc nền kinh tế vẫn quyết định.']
    ],
    trichDan: '“Toàn bộ những quan hệ sản xuất ấy hợp thành cơ cấu kinh tế của xã hội, ' +
              'tức là cái cơ sở hiện thực trên đó dựng lên một kiến trúc thượng tầng pháp lý ' +
              'và chính trị và tương ứng với cơ sở thực tại đó thì có những hình thái ý thức xã hội nhất định.”',
    nguon: 'C. Mác, Góp phần phê phán khoa kinh tế chính trị — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    phuongPhapLuan: [
      ['Tìm gốc ở kinh tế', 'Muốn hiểu một hiện tượng chính trị, pháp luật hay tư tưởng, phải tìm về những quan hệ kinh tế đã sinh ra nó.'],
      ['Không xem nhẹ tầng trên', 'Tác động trở lại của chính sách, pháp luật, giáo dục là có thật và rất mạnh. Xem nhẹ nó là rơi vào duy kinh tế.'],
      ['Không đảo ngược', 'Nhưng cũng không được lấy tác động trở lại ấy thay cho vai trò quyết định của cơ sở hạ tầng.']
    ],
    lienHe: {
      tieuDe: 'Thử tự trả lời',
      than: 'Một quy định mới ở trường bạn. Nó ra đời vì điều gì đang thay đổi bên dưới? ' +
            'Nó sẽ thúc đẩy hay kìm hãm điều đó?'
    },
    nhacLuot: 'Bạn đạt 80 điểm sau %n lượt. Thành phố gặp vấn đề ở %k lượt trong số đó.',
    nhacKhong: 'Bạn đạt 80 điểm sau %n lượt mà thành phố không gặp vấn đề nào.'
  },

  soTay: {
    ten: 'Hạ tầng – Thượng tầng',
    tom: 'Cơ sở hạ tầng (toàn bộ quan hệ sản xuất) quyết định kiến trúc thượng tầng. Kiến trúc thượng tầng có tính độc lập tương đối ' +
         'và tác động trở lại, thúc đẩy hoặc kìm hãm, nhưng không thay được vai trò quyết định ấy.'
  }
};
