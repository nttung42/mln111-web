/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Cơ sở hạ tầng và Kiến trúc thượng tầng   (id: ha-tang)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['ha-tang'] = {
  tang: 'Tháp Triết Học · Tầng III — Thành Phố',
  ten: 'Phòng — Cơ sở hạ tầng và Kiến trúc thượng tầng',
  chuong: 'MLN111 · Chương 3 — Chủ nghĩa duy vật lịch sử',

  moDau: {
    tieuDe: 'Bên nào quyết định bên nào?',
    than: 'Trước mặt bạn là một công trình hai phần: một khối móng, và những khối ' +
          'lơ lửng bên trên. Có hai bàn điều khiển — một cho móng, một cho tầng trên. ' +
          'Hãy thử cả hai, rồi tự kết luận xem bên nào quyết định bên nào.'
  },

  nhan: {
    coSo: 'Cơ sở hạ tầng',
    doPhuHop: 'ĐỘ PHÙ HỢP GIỮA HAI TẦNG',
    tacDongNguoc: 'Tác động ngược từ tầng trên (tối đa 18%)',
    buocNhay: 'Xây lại'
  },

  kieu: [
    { ten: 'CÔNG HỮU NGUYÊN THUỶ', mo: 'Chưa có tư hữu, chưa có giai cấp' },
    { ten: 'TƯ HỮU',               mo: 'Có giai cấp, có đối kháng' },
    { ten: 'CÔNG HỮU TRÌNH ĐỘ CAO', mo: 'Tư hữu bị xoá bỏ' }
  ],

  khoi: ['NHÀ NƯỚC', 'PHÁP LUẬT', 'ĐẠO ĐỨC', 'TÔN GIÁO', 'NGHỆ THUẬT'],

  banDieuKhien: {
    mong: 'BÀN ĐIỀU KHIỂN MÓNG',
    tren: 'BÀN ĐIỀU KHIỂN TẦNG TRÊN'
  },

  goiYMong: 'Giữ để <b>thay cơ sở hạ tầng</b>',
  goiYTren: 'Giữ để <b>tác động vào tầng trên</b>',
  goiYXa:   'Lại gần một trong hai bàn điều khiển',

  dangXay: 'Tầng trên đang xây lại theo móng mới',
  chamTran: 'Tầng trên chỉ nhúc nhích được đến đây, rồi tự trở về theo móng',

  baiHoc: {
    nhan: 'Bạn đã thử cả hai chiều',
    tieuDe: 'Móng đổi thì tầng trên xây lại; tầng trên chỉ làm móng nhúc nhích',
    dan: 'Khi bạn thay cơ sở hạ tầng, toàn bộ tầng trên nứt vỡ và dựng lại — có thiết chế ' +
         'biến mất hẳn, có thiết chế mới xuất hiện. Khi bạn tác động vào tầng trên, móng ' +
         'chỉ dịch được một chút rồi tự trở về. Sự bất đối xứng ấy chính là nội dung của quy luật.',
    dinhNghia: [
      ['Cơ sở hạ tầng', 'Toàn bộ những quan hệ sản xuất hợp thành cơ cấu kinh tế của một xã hội nhất định.'],
      ['Kiến trúc thượng tầng', 'Toàn bộ những quan điểm chính trị, pháp quyền, đạo đức, tôn giáo, nghệ thuật, triết học… cùng những thiết chế xã hội tương ứng như nhà nước, đảng phái, giáo hội, đoàn thể.'],
      ['Cơ sở hạ tầng quyết định', 'Cơ sở hạ tầng nào sinh ra kiến trúc thượng tầng ấy. Cơ sở hạ tầng thay đổi thì sớm muộn kiến trúc thượng tầng cũng thay đổi theo.'],
      ['Độc lập tương đối', 'Kiến trúc thượng tầng tác động trở lại cơ sở hạ tầng — thúc đẩy nếu phù hợp, kìm hãm nếu không — nhưng không thể thay thế vai trò quyết định của cơ sở hạ tầng.']
    ],
    trichDan: '“Toàn bộ những quan hệ sản xuất ấy hợp thành cơ cấu kinh tế của xã hội, ' +
              'tức là cái cơ sở hiện thực trên đó dựng lên một kiến trúc thượng tầng pháp lý ' +
              'và chính trị và tương ứng với cơ sở thực tại đó thì có những hình thái ý thức xã hội nhất định.”',
    nguon: 'C. Mác, Góp phần phê phán khoa kinh tế chính trị — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    phuongPhapLuan: [
      ['Tìm gốc ở kinh tế', 'Muốn hiểu một hiện tượng chính trị, pháp luật hay tư tưởng, phải tìm về những quan hệ kinh tế đã sinh ra nó.'],
      ['Không xem nhẹ tầng trên', 'Tác động trở lại của kiến trúc thượng tầng là có thật và rất mạnh; xem nhẹ nó là rơi vào duy kinh tế tầm thường.'],
      ['Không đảo ngược', 'Nhưng cũng không được lấy tác động trở lại ấy thay cho vai trò quyết định của cơ sở hạ tầng.']
    ],
    lienHe: {
      tieuDe: 'Thử tự trả lời',
      than: 'Một tập quán trong lớp bạn mà ai cũng thấy bất tiện nhưng vẫn tồn tại. ' +
            'Nó đứng vững nhờ điều gì bên dưới? Ra một quy định mới có đủ để xoá nó không, ' +
            'hay phải đổi cái nền đã sinh ra nó?'
    },
    ghiChuNhaNuoc: 'Bạn có để ý không: ở cơ sở hạ tầng công hữu nguyên thuỷ, khối NHÀ NƯỚC ' +
                   'và PHÁP LUẬT hoàn toàn không tồn tại. Nhà nước không có sẵn từ đầu — ' +
                   'nó ra đời cùng với tư hữu và giai cấp.'
  },

  soTay: {
    ten: 'Hạ tầng – Thượng tầng',
    tom: 'Cơ sở hạ tầng quyết định kiến trúc thượng tầng; kiến trúc thượng tầng có tính độc lập tương đối và tác động trở lại, nhưng không thay được vai trò quyết định ấy.'
  }
};
