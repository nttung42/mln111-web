/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Lý luận nhận thức   (id: nhan-thuc)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['nhan-thuc'] = {
  tang: 'Tháp Triết Học · Tầng II — Cổng Dị Giới',
  ten: 'Phòng — Lý luận nhận thức',
  chuong: 'MLN111 · Chương 2 — Chủ nghĩa duy vật biện chứng · Mục 2.3',

  moDau: {
    tieuDe: 'Con người nhận thức thế giới bằng cách nào?',
    than: 'Bạn vừa bước qua cổng vào một hành lang bốn trạm, đi từ bóng tối ra ánh sáng. ' +
          'Ở lối vào mỗi trạm có một đài hướng dẫn: lại gần là chữ hiện lên trước mặt — cách chơi và ' +
          'ý nghĩa của trạm; ấn <kbd>E</kbd> cạnh đài để đọc đầy đủ. Cửa sang trạm sau chỉ mở khi ' +
          'bạn đã đi hết trạm trước.<br>' +
          'Nhìn thẳng vào một đạo cụ hay bức tranh, thẻ chú giải sẽ hiện ngay bên phải. ' +
          'Ấn <kbd>G</kbd> để tắt hoặc bật chú giải.'
  },

  /* tên bốn trạm, khắc trên vòm cửa */
  tram: [
    ['TRẠM I',   'Lịch sử nhận thức luận'],
    ['TRẠM II',  'Xưởng thực tiễn'],
    ['TRẠM III', 'Con đường nhận thức'],
    ['TRẠM IV',  'Thánh đường chân lý']
  ],

  /* nội dung bia — ấn E để đọc. Theo kịch bản popup trong tài liệu thiết kế. */
  bia: [
    {
      nhan: 'Trạm I · Mục 2.3.1',
      tieuDe: 'Lịch sử nhận thức luận',
      dong: [
        ['Chủ nghĩa duy tâm', 'Coi nhận thức là sản phẩm của thần linh, hoặc của cảm giác chủ quan.'],
        ['Thuyết bất khả tri (Kant)', 'Cho rằng con người chỉ thấy hiện tượng bên ngoài, không thể nhận thức được bản chất thực sự — cái “vật tự nó”.'],
        ['CNDV trước Mác', 'Coi nhận thức như tấm gương soi thụ động, thiếu vắng vai trò của THỰC TIỄN.']
      ],
      ketLuan: 'Ba đạo cụ trong trạm này là ba lối đi cũ. Hãy thử lần lượt từng cái.'
    },
    {
      nhan: 'Trạm II · Mục 2.3.2 – 2.3.3',
      tieuDe: 'Thực tiễn và vai trò nền tảng',
      dong: [
        ['Thực tiễn', 'Toàn bộ hoạt động vật chất có mục đích, mang tính lịch sử – xã hội của con người, nhằm cải biến tự nhiên và xã hội.'],
        ['Ba hình thức', 'Sản xuất vật chất (cơ bản nhất), hoạt động chính trị – xã hội, thực nghiệm khoa học.'],
        ['Vai trò', 'Thực tiễn là CƠ SỞ, ĐỘNG LỰC, MỤC ĐÍCH của nhận thức và là TIÊU CHUẨN KIỂM TRA CHÂN LÝ.']
      ],
      ketLuan: 'Kéo cần gạt và xem xưởng làm được điều mà ba lối đi cũ không làm được.'
    },
    {
      nhan: 'Trạm III · Mục 2.3.4',
      tieuDe: 'Con đường biện chứng của nhận thức',
      dong: [
        ['Nhận thức cảm tính', 'Cảm giác → Tri giác → Biểu tượng. Trực tiếp, sinh động, nhưng mới là cái bề ngoài.'],
        ['Nhận thức lý tính', 'Khái niệm → Phán đoán → Suy luận. Gián tiếp, trừu tượng, phản ánh bản chất và quy luật.'],
        ['Trở về thực tiễn', 'Lý luận phải quay trở lại, ứng dụng vào THỰC TIỄN.']
      ],
      trichDan: '“Từ trực quan sinh động đến tư duy trừu tượng, và từ tư duy trừu tượng đến thực tiễn — ' +
                'đó là con đường biện chứng của sự nhận thức chân lý, của sự nhận thức thực tại khách quan.”',
      nguon: 'V. I. Lênin, Bút ký triết học — Toàn tập, t.29, NXB Tiến bộ, M., 1981, tr.179'
    },
    {
      nhan: 'Trạm IV · Mục 2.3.5',
      tieuDe: 'Đích đến: chân lý',
      dong: [
        ['Chân lý', 'Tri thức phản ánh đúng đắn thế giới khách quan và được thực tiễn kiểm nghiệm.'],
        ['Tính khách quan', 'Nội dung của chân lý không phụ thuộc vào ý muốn chủ quan của con người.'],
        ['Tính tuyệt đối và tương đối', 'Chân lý phản ánh đúng hiện thực, nhưng luôn còn được bổ sung, phát triển tiếp.'],
        ['Tính cụ thể', 'Chân lý gắn liền với những điều kiện lịch sử – cụ thể xác định.']
      ],
      ketLuan: 'Đưa từng mệnh đề vào luồng sáng thực tiễn. Cái gì qua được mới thành chân lý.'
    }
  ],

  /* đài hướng dẫn ở lối vào mỗi trạm — chữ hiện ra và bay lên trước mặt
     người chơi. Giữ ngắn: một dòng tên, ba dòng cách chơi, một đoạn ý nghĩa. */
  huongDan: {
    nhanCachChoi: 'CÁCH CHƠI',
    nhanYNghia: 'Ý NGHĨA',
    chan: '[E] đọc đầy đủ   ·   [G] bật / tắt chú giải',
    tram: [
      {
        tieuDe: 'Trạm I · Lịch sử nhận thức luận',
        cachChoi: [
          'Lại gần từng đạo cụ: ngọn nến, chiếc rương, tấm gương.',
          'Giữ chuột trái (hoặc F) để tác động, rồi quan sát điều xảy ra.',
          'Thử đủ cả ba thì cửa sang trạm II mới mở.'
        ],
        yNghia: 'Ba đạo cụ là ba lối nhận thức trước Mác — duy tâm, bất khả tri, duy vật trực quan. Cả ba đều dẫn tới bế tắc, vì cùng thiếu một thứ.'
      },
      {
        tieuDe: 'Trạm II · Xưởng thực tiễn',
        cachChoi: [
          'Giữ cần gạt giữa xưởng để nạp đầy năng lượng.',
          'Đầy năng lượng, camera sẽ dẫn bạn đi qua lần lượt ba hình thức thực tiễn.',
          'Xem bốn vai trò của thực tiễn sáng dần trên cửa sang trạm III.'
        ],
        yNghia: 'Thực tiễn là hoạt động vật chất có mục đích — cơ sở, động lực, mục đích của nhận thức và tiêu chuẩn của chân lý. Hãy để ý chiếc rương ở trạm I.'
      },
      {
        tieuDe: 'Trạm III · Con đường nhận thức',
        cachChoi: [
          'Đứng cạnh mắt, tai, tay và giữ chuột để cảm nhận quả táo.',
          'Đủ ba giác quan, bước lên bệ nhảy để sang tầng trên.',
          'Giữ chuột ở bộ não để tư duy: khái niệm → phán đoán → suy luận.'
        ],
        yNghia: '“Từ trực quan sinh động đến tư duy trừu tượng, và từ tư duy trừu tượng đến thực tiễn.” Thử nhảy lên trước khi cảm nhận — bạn sẽ thấy tư duy rỗng.'
      },
      {
        tieuDe: 'Trạm IV · Thánh đường chân lý',
        cachChoi: [
          'Đứng cạnh từng tinh thể, giữ chuột để kiểm nghiệm bằng luồng sáng thực tiễn.',
          'Cái sai vỡ tan, cái đúng nhập vào viên kim cương.',
          'Kiểm nghiệm đủ ba mệnh đề, rồi nhặt viên kim cương để mở cổng ra.'
        ],
        yNghia: 'Chân lý là tri thức phù hợp với hiện thực khách quan và được thực tiễn kiểm nghiệm — có tính khách quan, cụ thể, vừa tuyệt đối vừa tương đối.'
      }
    ]
  },

  chung: {
    docBia: 'Ấn <kbd>E</kbd> để đọc đầy đủ',
    cuaKhoa: 'Cửa còn khoá — đi hết trạm này trước',
    giu: 'Giữ <kbd>Chuột trái</kbd> để',
    giuDP: 'Giữ <kbd>F</kbd> để'
  },

  /* gợi ý khi không đứng cạnh thứ gì — theo trạm đang đứng */
  goiYVung: [
    'Thử lần lượt cả ba đạo cụ của trạm I',
    'Lại gần cần gạt giữa xưởng',
    'Lại gần một trong ba giác quan — mắt, tai, tay',
    'Lại gần một tinh thể mệnh đề để kiểm nghiệm'
  ],
  goiYXong: [
    'Trạm I đã xong — đi tiếp sang xưởng thực tiễn',
    'Xưởng đã chạy — đi tiếp sang trạm III',
    'Đi qua bệ lý tính, sang trạm IV',
    'Bước qua cổng sáng để hoàn thành phòng'
  ],

  /* ---------- chú giải: hiện bên phải màn hình ngay sau mỗi khoảnh
     khắc chính, và gom lại trong bia của từng trạm.
     tram: 0–3 · khaiNiem: khái niệm được minh hoạ · lam: điều người
     chơi vừa thấy · nghia: lý thuyết · viSao: lý do thiết kế ·
     lapLuan: lập luận nối điều người chơi thấy với lý thuyết — đây là
     chữ hiện trên thẻ khi nhìn vào vật, được dùng <b> và <em> ---------- */
  /* chú giải cho bốn cột ở trạm I — không tính vào sổ khám phá */
  chuGiaiCot: [
    {
      tieuDe: 'Cột Platon', khaiNiem: 'Duy tâm khách quan',
      lapLuan: 'Platon (427–347 TCN): thế giới thật là thế giới <b>ý niệm</b>; nhận thức là linh hồn <em>hồi tưởng</em> lại những gì nó đã biết trước khi nhập vào thể xác. Cột vẫn đứng, nhưng đã nứt từ bên trong.'
    },
    {
      tieuDe: 'Cột Berkeley', khaiNiem: 'Duy tâm chủ quan',
      lapLuan: 'Berkeley (1685–1753): “tồn tại là được tri giác” — sự vật chỉ là <b>phức hợp các cảm giác</b> của chủ thể. Không có người cảm giác thì không có sự vật; cột nứt, đá vỡ rơi quanh chân.'
    },
    {
      tieuDe: 'Cột Hume · Kant', khaiNiem: 'Thuyết bất khả tri',
      lapLuan: 'Hume nghi ngờ mọi tri thức vượt ra ngoài cảm giác; Kant khẳng định ta chỉ biết <b>hiện tượng</b>, còn “vật tự nó” thì không. Khi thực tiễn mở được chiếc rương, vết nứt trên cột này sẽ <em>loé sáng</em>.'
    },
    {
      tieuDe: 'Cột Feuerbach', khaiNiem: 'Duy vật trực quan',
      lapLuan: 'Feuerbach (1804–1872) thừa nhận thế giới vật chất và khả năng nhận thức nó, nhưng coi nhận thức là sự <b>phản ánh trực quan</b>, thụ động. Mác phê phán đúng điểm này trong <em>Luận cương về Feuerbach</em> (1845): thiếu hoạt động thực tiễn.'
    }
  ],

  /* chú giải cho năm bức tranh — không tính vào sổ khám phá của trạm */
  chuGiaiTranh: [
    {
      tieuDe: 'Hang động của Platon', khaiNiem: 'Duy tâm khách quan',
      lapLuan: 'Ngụ ngôn đi theo bốn bậc: <b>bóng</b> trên vách → <b>vật</b> khiêng sau bức tường thấp → <b>ngọn lửa</b> → <b>mặt trời</b> ngoài cửa hang. Với Platon, nhận thức là quay lưng khỏi bóng để đi lên thế giới ý niệm — bằng <em>lý trí thuần tuý</em>, không cần đến thực tiễn.',
      lam: 'Những người bị xích quay lưng về phía lửa, chỉ thấy bóng in trên vách đá và tưởng đó là sự vật thật.',
      nghia: 'Platon cho rằng thế giới cảm tính chỉ là cái bóng của thế giới ý niệm; nhận thức là “hồi tưởng” lại ý niệm.',
      viSao: 'Treo cạnh ngọn nến: những ý niệm bạn thắp lên cũng in bóng lên chính vách đá ngay bên cạnh bức tranh này.'
    },
    {
      tieuDe: 'Kant trước bức tường sương', khaiNiem: 'Thuyết bất khả tri',
      lapLuan: 'Bên trái là thế giới <b>hiện tượng</b> — sáng, rõ, nhưng nhìn qua cặp kính của chính chủ thể. Bên phải là cùng những sự vật ấy sau bức tường sương: <b>“vật tự nó”</b>, mãi không thể biết. Vạch vàng dưới chân là giới hạn Kant vạch ra cho nhận thức — như mức 92% ở chiếc rương.',
      lam: 'Một người đứng trước bức tường sương dày, không thể nhìn xuyên qua.',
      nghia: 'Kant: con người chỉ biết được hiện tượng; “vật tự nó” nằm sau màn sương, mãi không thể biết.',
      viSao: 'Bức tường sương là hình ảnh của giới hạn 92% ở chiếc rương cùng trạm — đến rất gần mà không chạm được.'
    },
    {
      tieuDe: 'Ba mặt của thực tiễn', khaiNiem: 'Ba hình thức thực tiễn',
      lapLuan: 'Ba khung tranh là ba hình thức thực tiễn: <b>sản xuất vật chất, chính trị – xã hội, thực nghiệm khoa học</b> — đúng ba cỗ máy bạn vận hành trong xưởng.',
      lam: 'Ba khung tranh: nhà máy với bánh răng, đoàn người giương cờ, phòng thí nghiệm.',
      nghia: 'Sản xuất vật chất, hoạt động chính trị – xã hội, thực nghiệm khoa học.',
      viSao: 'Ba khung tranh lặp lại đúng ba cỗ máy trong xưởng — điều bạn vận hành bằng tay cũng là điều loài người đã làm suốt lịch sử.'
    },
    {
      tieuDe: 'Sơ đồ con đường nhận thức', khaiNiem: 'Con đường nhận thức',
      lapLuan: 'Tầng dưới: quả táo → mắt, tai, tay → <b>cảm giác</b> → <b>tri giác</b> → <b>biểu tượng</b>. Một <b>bước nhảy</b> lên tầng trên: <b>khái niệm → phán đoán → suy luận</b>, rồi mũi tên quay về <em>thực tiễn</em> — đúng con đường bạn đang đi trong trạm này.',
      lam: 'Dữ liệu từ ba giác quan chảy vào bộ não, rồi thành sơ đồ khái niệm → phán đoán → suy luận.',
      nghia: 'Nhận thức cảm tính cung cấp tài liệu; nhận thức lý tính chế biến tài liệu ấy thành tri thức về bản chất.',
      viSao: 'Bức tranh là bản đồ thu nhỏ của chính trạm này: tầng dưới là giác quan, tầng trên là bộ não.'
    },
    {
      tieuDe: 'Thánh đường chân lý', khaiNiem: 'Chân lý',
      lapLuan: 'Chân lý là đích đến của nhận thức nhưng <em>không phải điểm dừng</em>: nó còn tiếp tục được bổ sung, phát triển — như viên kim cương bạn sắp nhặt vẫn xoay mãi.',
      lam: 'Một viên kim cương toả sáng giữa những hàng cột cẩm thạch.',
      nghia: 'Chân lý là đích đến của nhận thức, nhưng không phải điểm dừng: nó còn tiếp tục được bổ sung, phát triển.',
      viSao: 'Ánh sáng toả ra từ một vật đã thành hình — tri thức chỉ “sáng” khi đã qua kiểm nghiệm, như viên kim cương bạn sắp nhặt.'
    },
    {
      tieuDe: 'Hai căn bệnh', khaiNiem: 'Kinh nghiệm · giáo điều',
      lapLuan: 'Bên trái: người chỉ gom cảm giác mà không chịu khái quát — <b>bệnh kinh nghiệm</b>. Bên phải: người đứng trên tầng lý luận lơ lửng, xa rời mặt đất — <b>bệnh giáo điều</b>. Ở giữa là con đường <em>thống nhất</em> cảm tính với lý tính, và cả hai với thực tiễn.',
      lam: 'Hai người lạc đường, và một con đường xoắn đi lên ở giữa.',
      nghia: 'Tuyệt đối hoá kinh nghiệm hay tuyệt đối hoá lý luận đều sai.',
      viSao: 'Treo đối diện sơ đồ con đường nhận thức, ngay trong trạm có bẫy “tư duy rỗng”.'
    }
  ],

  chuGiai: {
    /* Trạm I */
    den: {
      tram: 0, tieuDe: 'Ngọn nến duy tâm', khaiNiem: 'Chủ nghĩa duy tâm',
      lapLuan: 'Tri thức theo duy tâm chỉ tồn tại <em>trong đầu chủ thể</em>: ngừng nghĩ là nó mất. Nó không bám vào thứ gì có thật bên ngoài.',
      lam: 'Khói nến kết thành con ngựa, cái cây, ngôi nhà… và in bóng lên vách; buông tay là tất cả tan thành khói.',
      nghia: 'Với chủ nghĩa duy tâm, tri thức sinh ra từ ý thức, từ “ý niệm”, không bắt nguồn từ thế giới vật chất. Platon coi sự vật cảm tính chỉ là cái bóng của ý niệm.',
      viSao: 'Các hình chỉ tồn tại khi bạn còn giữ chuột và không giống thứ gì có thật trong phòng — “tri thức” ấy phụ thuộc hoàn toàn vào người nghĩ ra nó. Bóng in lên vách gợi lại hang động Platon trên bức tranh bên cạnh.'
    },
    ruong: {
      tram: 0, tieuDe: 'Rương “vật tự nó”', khaiNiem: 'Thuyết bất khả tri',
      lapLuan: 'Đây là đúng lập luận của Kant: ta tiến sát tới sự vật, thấy được lớp hiện tượng bên ngoài, nhưng phần bản chất thì mãi không chạm tới. Con số 92% để bạn <em>cảm thấy</em> sự bế tắc.',
      lam: 'Bạn cố nhìn thấu chiếc rương, nhưng thanh đo kẹt lại ở 92%.',
      nghia: 'Kant cho rằng con người chỉ biết được hiện tượng; bản chất — “vật tự nó” — mãi nằm ngoài tầm với.',
      viSao: 'Con số 92% để bạn đến rất gần mà vẫn không chạm được — đúng cảm giác bế tắc của lập luận bất khả tri. Hãy nhớ chiếc rương này: nó sẽ mở ở trạm sau.'
    },
    guong: {
      tram: 0, tieuDe: 'Tấm gương siêu hình', khaiNiem: 'Duy vật trước Mác',
      lapLuan: 'Phản ánh của chủ nghĩa duy vật cũ là thật, nhưng <em>thụ động</em>: gương không tác động gì vào sự vật, nên cũng không tự sửa được hình ảnh méo.',
      lam: 'Gương soi quả táo, bóng trong gương méo đi, còn quả táo thật không hề thay đổi.',
      nghia: 'Chủ nghĩa duy vật cũ coi nhận thức là sự phản ánh trực quan, thụ động — như gương soi.',
      viSao: 'Gương phản ánh có thật, nhưng không tác động gì vào sự vật, nên cũng không tự sửa được hình ảnh méo. Thứ nó thiếu là hoạt động thực tiễn.'
    },
    xong1: {
      tram: 0, tieuDe: 'Ba lối đi, một bế tắc', khaiNiem: 'Nhận thức luận trước Mác',
      lapLuan: 'Duy tâm, bất khả tri và duy vật cũ dừng ở <b>cùng một chỗ</b>, vì cùng thiếu một thứ: vai trò của <b>thực tiễn</b>. Cửa trạm II chỉ mở khi bạn đã tự trải qua cả ba bế tắc.',
      lam: 'Cả ba đạo cụ đều không dẫn tới đâu.',
      nghia: 'Duy tâm, bất khả tri và duy vật cũ có chung một thiếu sót: không thấy vai trò của thực tiễn.',
      viSao: 'Cửa trạm II chỉ mở khi bạn đã thử đủ ba lối, để thực tiễn xuất hiện như lời giải cho một bế tắc chính bạn vừa trải qua.'
    },

    /* Trạm II */
    may: {
      tram: 1, tieuDe: 'Ba cỗ máy của xưởng', khaiNiem: 'Ba hình thức thực tiễn',
      lapLuan: 'Thực tiễn có ba hình thức: sản xuất vật chất, thực nghiệm khoa học, chính trị – xã hội. Bánh răng sản xuất <b>to nhất và chạy đầu tiên</b>, vì sản xuất vật chất là hình thức <b>cơ bản nhất</b>, làm nền cho hai hình thức kia.',
      lam: 'Cần gạt khởi động bánh răng trước, rồi bàn thí nghiệm, rồi lá cờ.',
      nghia: 'Thực tiễn có ba hình thức: sản xuất vật chất, thực nghiệm khoa học, hoạt động chính trị – xã hội.',
      viSao: 'Bánh răng sản xuất to nhất và chạy đầu tiên, vì sản xuất vật chất là hình thức cơ bản nhất, làm nền cho hai hình thức kia.'
    },
    xong2: {
      tram: 1, tieuDe: 'Bốn vai trò của thực tiễn', khaiNiem: 'Thực tiễn và nhận thức',
      lapLuan: 'Ở trạm I bạn chỉ <em>quan sát</em>; ở đây lần đầu bạn phải <em>tác động</em>. Thực tiễn là <b>cơ sở, động lực, mục đích</b> của nhận thức và là <b>tiêu chuẩn kiểm tra chân lý</b> — bốn vai trò sáng lần lượt khi xưởng chạy.',
      lam: 'Bạn phải tự tay tác động: bốn vai trò lần lượt sáng lên, sương tan đi.',
      nghia: 'Thực tiễn là cơ sở, động lực, mục đích của nhận thức và là tiêu chuẩn kiểm tra chân lý.',
      viSao: 'Ở trạm I bạn chỉ quan sát; ở đây lần đầu bạn phải làm. Khác biệt giữa hai trạm chính là bước ngoặt chủ nghĩa duy vật biện chứng đưa vào lý luận nhận thức.'
    },
    ruongMo: {
      tram: 1, tieuDe: 'Chiếc rương đã mở', khaiNiem: '“Vật tự nó” → “vật cho ta”',
      lapLuan: 'Thứ mà ba học thuyết cũ không mở được, thực tiễn mở được: <b>không có gì là không thể biết, chỉ có cái chưa biết</b>. Ăngghen từng bác bỏ “vật tự nó” bằng việc hoá học tự tổng hợp được chất nhuộm alizarin — “vật tự nó” thành <em>“vật cho ta”</em>.',
      lam: 'Năng lượng thực tiễn mở được chiếc rương mà ba lối đi cũ đành bó tay.',
      nghia: 'Không có gì là không thể biết, chỉ có cái chưa biết. Ăngghen từng bác bỏ Kant bằng việc hoá học tổng hợp được chất nhuộm alizarin.',
      viSao: 'Rương mở ở trạm trước, từ xa — để bạn thấy thực tiễn giải quyết đúng câu hỏi mà lịch sử triết học từng bế tắc.'
    },

    /* Trạm III */
    camGiac: {
      tram: 2, tieuDe: 'Cảm giác', khaiNiem: 'Nhận thức cảm tính',
      lapLuan: 'Mỗi cảm giác chỉ phản ánh <b>một thuộc tính riêng lẻ</b> của sự vật, nên mỗi giác quan chỉ cho một mảnh thông tin.',
      lam: 'Mỗi giác quan chỉ cho bạn một thuộc tính: màu, âm thanh, hay bề mặt.',
      nghia: 'Cảm giác phản ánh từng thuộc tính riêng lẻ của sự vật khi nó tác động trực tiếp vào giác quan.',
      viSao: 'Ba giác quan được tách rời nhau để bạn thấy: một cảm giác đơn lẻ chưa nói được sự vật là gì.'
    },
    triGiac: {
      tram: 2, tieuDe: 'Tri giác', khaiNiem: 'Nhận thức cảm tính',
      lapLuan: 'Tri giác là <b>tổng hợp</b> các cảm giác thành hình ảnh tương đối đầy đủ về sự vật.',
      lam: 'Đủ ba cảm giác, hình ảnh trọn vẹn của quả táo hiện ra.',
      nghia: 'Tri giác tổng hợp nhiều cảm giác thành hình ảnh tương đối đầy đủ về sự vật.',
      viSao: 'Hình ảnh chỉ xuất hiện khi có đủ cả ba — tri giác là sự tổng hợp, không phải một giác quan nào mạnh hơn.'
    },
    bieuTuong: {
      tram: 2, tieuDe: 'Biểu tượng', khaiNiem: 'Nhận thức cảm tính',
      lapLuan: 'Biểu tượng là hình ảnh <b>được lưu giữ</b> khi sự vật không còn trực tiếp tác động vào giác quan. Đây là cầu nối sang tư duy.',
      lam: 'Quả táo thật mờ đi, nhưng hình ảnh của nó vẫn ở lại.',
      nghia: 'Biểu tượng là hình ảnh được lưu giữ khi sự vật không còn trực tiếp tác động vào giác quan.',
      viSao: 'Hình ảnh còn lại ấy là thứ bạn mang lên tầng trên — cầu nối giữa cảm tính và tư duy.'
    },
    nhay: {
      tram: 2, tieuDe: 'Bệ nhảy', khaiNiem: 'Từ cảm tính lên lý tính',
      lapLuan: 'Chuyển từ cảm tính lên lý tính là một <b>bước nhảy về chất</b>, không phải đi dần từng bậc. Tầng trên cao hơn vì nó phản ánh sâu hơn, nhưng vẫn đứng trên cùng một nền.',
      lam: 'Không có cầu thang: muốn lên tầng trên phải nhảy.',
      nghia: 'Chuyển từ nhận thức cảm tính lên nhận thức lý tính là một bước nhảy về chất.',
      viSao: 'Tầng trên cao hơn vì phản ánh sâu hơn, nhưng vẫn đứng trên cùng một nền — lý tính dựa trên cảm tính.'
    },
    rong: {
      tram: 2, tieuDe: 'Tư duy rỗng', khaiNiem: 'Bệnh giáo điều',
      lapLuan: 'Lý tính tách khỏi cảm tính thì <b>không có nội dung</b>: nhảy thẳng lên tư duy khi chưa cảm nhận gì, các khối chỉ là vỏ rỗng. Tuyệt đối hoá lý luận, xa rời thực tế chính là <b>bệnh giáo điều</b>.',
      lam: 'Bạn tư duy khi chưa có dữ liệu cảm tính — các khối nhấp nháy đỏ, trống rỗng.',
      nghia: 'Lý tính tách khỏi cảm tính thì không có nội dung. Tuyệt đối hoá lý luận, xa rời thực tế là bệnh giáo điều.',
      viSao: 'Bẫy này cố ý để mở và không bị phạt: bạn tự thấy vì sao không thể bỏ qua tầng dưới.'
    },
    ly: {
      tram: 2, tieuDe: 'Khái niệm → Phán đoán → Suy luận', khaiNiem: 'Nhận thức lý tính',
      lapLuan: 'Ba hình thức của tư duy trừu tượng. Ví dụ đi từ khái niệm chung đến một kết luận <em>mới</em> về quả táo cụ thể, tức là suy luận tạo ra tri thức mới.',
      lam: 'Từ khái niệm “táo”, đến phán đoán “táo chín thì đỏ”, đến suy luận “quả này đã chín”.',
      nghia: 'Ba hình thức của tư duy trừu tượng: gián tiếp, khái quát, nắm được bản chất và quy luật.',
      viSao: 'Ví dụ đi từ cái chung đến một kết luận mới về chính quả táo này — suy luận cho ra tri thức mà giác quan không cho được.'
    },
    veThucTien: {
      tram: 2, tieuDe: 'Tia sáng trở về', khaiNiem: 'Từ tư duy đến thực tiễn',
      lapLuan: 'Đây là vế thứ hai của câu Lênin, phần hay bị quên nhất. Kết luận “quả này đã chín” chỉ có giá trị khi được đem ra kiểm tra, và điều đó dẫn sang trạm IV.',
      lam: 'Một tia sáng bắn từ bộ não ngược về xưởng thực tiễn.',
      nghia: 'Nhận thức không dừng ở lý luận: lý luận phải quay về thực tiễn.',
      viSao: 'Đây là vế hay bị quên trong câu của Lênin. Kết luận “quả đã chín” chỉ có giá trị khi được kiểm tra — việc của trạm IV.'
    },

    /* Trạm IV */
    gt0: {
      tram: 3, tieuDe: 'Mệnh đề bị bác bỏ', khaiNiem: 'Tính khách quan',
      lapLuan: '<b>Tính khách quan:</b> đúng hay sai không phụ thuộc vào số người tin hay vào ý muốn. Dòng chữ nhỏ “từng được tin suốt hơn một nghìn năm” được đặt vào chính để nhấn điểm này.',
      lam: 'Mệnh đề từng được tin hơn một nghìn năm vẫn vỡ tan trước luồng sáng thực tiễn.',
      nghia: 'Đúng hay sai không phụ thuộc vào ý muốn, hay vào số đông người tin.',
      viSao: 'Dòng chữ “từng được tin suốt hơn một nghìn năm” được đặt vào để nhấn mạnh: niềm tin không làm nên chân lý.'
    },
    gt1: {
      tram: 3, tieuDe: 'Đúng — có điều kiện', khaiNiem: 'Tính cụ thể',
      lapLuan: '<b>Tính cụ thể:</b> chân lý luôn gắn với điều kiện xác định. Ví dụ này cũng nối với phòng Lượng – Chất, nơi bạn đã đun nước.',
      lam: '“Nước sôi ở 100 °C” chỉ đúng ở áp suất 1 atm.',
      nghia: 'Chân lý luôn gắn với những điều kiện lịch sử – cụ thể xác định.',
      viSao: 'Ví dụ nối với phòng Lượng – Chất, nơi bạn đã đun nước: cùng một hiện tượng, đổi điều kiện là đổi kết luận.'
    },
    gt2: {
      tram: 3, tieuDe: 'Đúng — trong phạm vi', khaiNiem: 'Tuyệt đối và tương đối',
      lapLuan: '<b>Tính tuyệt đối và tương đối:</b> tri thức đúng trong phạm vi của nó, nhưng vẫn được bổ sung và phát triển tiếp.',
      lam: 'Cơ học Newton đúng với vật chuyển động chậm, và được thuyết tương đối mở rộng.',
      nghia: 'Tri thức đúng trong phạm vi của nó, nhưng luôn còn được bổ sung, phát triển tiếp.',
      viSao: 'Tinh thể không vỡ mà nhập vào viên kim cương: cái đúng được kế thừa, không bị xoá bỏ.'
    },
    kc: {
      tram: 3, tieuDe: 'Viên kim cương chân lý', khaiNiem: 'Chân lý',
      lapLuan: 'Chân lý là tri thức <b>phù hợp với hiện thực khách quan</b> và <b>được thực tiễn kiểm nghiệm</b>. Kim cương chỉ lớn lên từ những mệnh đề đã qua luồng sáng thực tiễn, và nó xoay mãi, không “hoàn tất”: chân lý là <em>một quá trình</em>.',
      lam: 'Bạn nhặt được viên kim cương sau khi kiểm nghiệm cả ba mệnh đề.',
      nghia: 'Chân lý là tri thức phù hợp với hiện thực khách quan và được thực tiễn kiểm nghiệm.',
      viSao: 'Kim cương chỉ lớn lên từ những gì đã qua luồng sáng thực tiễn — vai trò thứ tư bạn thắp ở trạm II nay được dùng thật. Nó xoay mãi, không “hoàn tất”: chân lý là một quá trình.'
    }
  },

  /* ----- Trạm I ----- */
  t1: {
    den:   { ten: 'NGỌN NẾN DUY TÂM',     mo: 'Tri thức sinh ra từ trong đầu',   goiY: '<b>thắp nến, để ý niệm hiện ra</b>' },
    yNiemNhan: 'Ý NIỆM',
    bucNen: ['ΙΔΕΑ', 'ý niệm · Platon'],
    guongBien: ['TABULA RASA', 'tấm bảng trắng · Locke'],
    /* chồng sách dưới chiếc rương, từ dưới lên — các tác phẩm chính của Kant */
    sach: [
      ['PHÊ PHÁN NĂNG LỰC PHÁN ĐOÁN', '1790'],
      ['PHÊ PHÁN LÝ TÍNH THỰC HÀNH', '1788'],
      ['PROLEGOMENA', '1783'],
      ['PHÊ PHÁN LÝ TÍNH THUẦN TUÝ', '1781']
    ],
    /* bốn cột chống nhà — bốn trụ cột của nhận thức luận trước Mác */
    cot: [
      ['PLATON', '427–347 TCN · duy tâm khách quan'],
      ['BERKELEY', '1685–1753 · duy tâm chủ quan'],
      ['HUME · KANT', 'thế kỷ XVIII · bất khả tri'],
      ['FEUERBACH', '1804–1872 · duy vật trực quan']
    ],
    yNiem: ['CON NGỰA', 'CÁI CÂY', 'NGÔI NHÀ', 'CÁNH CHIM', 'HÌNH TRÒN HOÀN HẢO'],
    ruong: { ten: 'RƯƠNG “VẬT TỰ NÓ”',    mo: 'Kant: bản chất không thể biết',  goiY: '<b>cố nhìn thấu chiếc rương</b>' },
    guong: { ten: 'TẤM GƯƠNG SIÊU HÌNH',  mo: 'Nhận thức là soi chiếu thụ động', goiY: '<b>soi quả táo vào gương</b>' },
    ketQua: {
      den:   'Khói nến hoá thành con ngựa, cái cây, ngôi nhà… rồi tan ngay khi bạn buông tay — chúng chỉ có trong đầu. Tri thức không sinh ra từ cái đầu khép kín.',
      ruong: 'Bạn chỉ thấy được lớp vỏ hiện tượng, cố mấy cũng dừng trước bản chất — đúng như Kant nói. Hay là vì còn thiếu một thứ?',
      guong: 'Gương phản ánh, nhưng méo mó và bất động: nó không hề tác động vào quả táo mà nó soi.'
    },
    xong: 'Cả ba lối đi cũ đều dừng ở cùng một chỗ. Thứ còn thiếu ở trạm II — cửa đã mở.',
    buocNhay: ['Bế tắc', 'THIẾU VẮNG THỰC TIỄN'],
    ruongMo: 'ĐÃ MỞ — “VẬT CHO TA”'
  },

  /* ----- Trạm II ----- */
  t2: {
    can: { ten: 'CẦN GẠT THỰC TIỄN', mo: 'Hoạt động vật chất có mục đích', goiY: '<b>nạp năng lượng cho xưởng</b>' },
    may: [
      ['1 · SẢN XUẤT VẬT CHẤT',  'hình thức cơ bản nhất'],
      ['2 · THỰC NGHIỆM KHOA HỌC', 'kiểm chứng giả thuyết'],
      ['3 · CHÍNH TRỊ – XÃ HỘI',  'cải biến quan hệ xã hội']
    ],
    sanPham: ['LƯƠNG THỰC', 'CÔNG CỤ', 'VẢI VÓC', 'NHÀ Ở', 'MÁY MÓC'],
    quyTrinh: ['GIẢ THUYẾT', 'THÍ NGHIỆM', 'KẾT LUẬN'],
    bangRon: 'CẢI BIẾN XÃ HỘI',
    dangNap: 'ĐANG NẠP NĂNG LƯỢNG',
    dayNap: 'XƯỞNG ĐANG CHẠY',
    /* cảnh phim sau khi nạp đầy: camera ghé lần lượt từng nơi */
    phim: [
      { k: 'Bước 1 / 4 · Sản xuất vật chất', t: 'Thực tiễn là cơ sở của nhận thức',
        p: 'Sản xuất ra của cải là hình thức thực tiễn <b>cơ bản nhất</b>. Nó cung cấp tài liệu, công cụ, và cả những câu hỏi đầu tiên cho nhận thức.' },
      { k: 'Bước 2 / 4 · Thực nghiệm khoa học', t: 'Thực tiễn là động lực của nhận thức',
        p: 'Giả thuyết → thí nghiệm → kết luận. Mỗi thí nghiệm lại đặt ra câu hỏi mới, <b>buộc nhận thức phải tiến lên</b>.' },
      { k: 'Bước 3 / 4 · Chính trị – xã hội', t: 'Thực tiễn là mục đích của nhận thức',
        p: 'Con người nhận thức thế giới <b>để cải biến nó</b> — cải biến cả tự nhiên lẫn quan hệ xã hội.' },
      { k: 'Bước 4 / 4 · Bốn vai trò', t: 'Thực tiễn là tiêu chuẩn kiểm tra chân lý',
        p: 'Chỉ thực tiễn mới cho biết tri thức nào đúng, tri thức nào sai. <b>Cửa sang trạm III đã mở.</b>' }
    ],
    vaiTro: ['CƠ SỞ', 'ĐỘNG LỰC', 'MỤC ĐÍCH', 'TIÊU CHUẨN CHÂN LÝ'],
    vaiTroGiai: [
      '<b>Cơ sở</b> — thực tiễn cung cấp tài liệu, chất liệu cho nhận thức',
      '<b>Động lực</b> — thực tiễn đặt ra nhu cầu, buộc nhận thức phải tiến lên',
      '<b>Mục đích</b> — nhận thức để quay lại cải biến thực tiễn',
      '<b>Tiêu chuẩn</b> — thực tiễn kiểm tra tri thức nào là chân lý'
    ],
    buocNhay: ['Bước ngoặt', 'THỰC TIỄN'],
    ruongMo: 'Ở trạm I, chiếc rương “vật tự nó” vừa bật mở. Không có gì là không thể biết — chỉ có cái chưa biết.'
  },

  /* ----- Trạm III ----- */
  t3: {
    giac: {
      mat: { ten: 'MẮT', thay: 'ĐỎ · TRÒN',    nhan: 'Cảm giác từ mắt: <b>màu đỏ, hình tròn</b>' },
      tai: { ten: 'TAI', thay: 'TIẾNG GIÒN',   nhan: 'Cảm giác từ tai: <b>tiếng giòn khi cắn</b>' },
      tay: { ten: 'TAY', thay: 'NHẴN · MÁT',   nhan: 'Cảm giác từ tay: <b>vỏ nhẵn, mát, chắc</b>' }
    },
    /* điều mỗi giác quan thu được — hiện dần trên thẻ nổi phía trên cột:
       [biểu tượng, thuộc tính, giá trị] */
    chiTiet: {
      mat: [['mau', 'MÀU SẮC', 'đỏ thẫm, ánh vàng'], ['hinh', 'HÌNH DẠNG', 'tròn, hơi dẹt'], ['co', 'KÍCH THƯỚC', 'vừa lòng bàn tay']],
      tai: [['go', 'KHI GÕ', 'tiếng đục, chắc'], ['song', 'KHI CẮN', 'giòn, rộp'], ['vang', 'ĐỘ VANG', 'ngắn, tắt ngay']],
      tay: [['mat', 'BỀ MẶT', 'nhẵn, hơi sáp'], ['nhiet', 'NHIỆT ĐỘ', 'mát, khoảng 18 °C'], ['cung', 'ĐỘ CỨNG', 'chắc, ấn không lún']]
    },
    theTriGiac: ['TRI GIÁC', 'một quả táo: đỏ, tròn, giòn, nhẵn, mát'],
    theBieuTuong: ['BIỂU TƯỢNG', 'hình ảnh quả táo còn lại trong trí nhớ'],
    theLy: [
      ['KHÁI NIỆM', '“Táo” — quả của cây táo, có vỏ, thịt và hạt'],
      ['PHÁN ĐOÁN', '“Táo chín thì vỏ đỏ, thịt ngọt”'],
      ['SUY LUẬN', '“Quả này đỏ — vậy quả này đã chín”']
    ],
    theRong: ['?', 'chưa có dữ liệu cảm tính'],
    /* cấu trúc tri thức quanh bộ não */
    knNhan: 'TÁO',
    khaiQuat: ['đỏ', 'tròn', 'giòn', 'nhẵn', 'mát'],
    pdNut: ['táo chín', 'vỏ đỏ, thịt ngọt'],
    slDong: ['Táo chín thì vỏ đỏ', 'Quả này vỏ đỏ', '⇒ Quả này đã chín'],
    goiYGiac: '<b>cảm nhận quả táo</b>',
    goiYNao: '<b>tư duy</b>',
    camTinh: ['NHẬN THỨC CẢM TÍNH', 'trực tiếp · sinh động · bề ngoài'],
    lyTinh:  ['NHẬN THỨC LÝ TÍNH',  'gián tiếp · trừu tượng · bản chất'],
    triGiac: '<b>Tri giác</b> — ba cảm giác hợp lại thành một hình ảnh trọn vẹn: một quả táo.',
    bieuTuong: '<b>Biểu tượng</b> — quả táo thật đã khuất, nhưng hình ảnh của nó vẫn ở lại. Lên bệ nhảy để sang tầng lý tính.',
    duCamTinh: 'Cảm tính chỉ cho bạn cái bề ngoài. Lên tầng trên để thấy bản chất.',
    rong: 'Tư duy mà không có dữ liệu cảm tính thì rỗng. Xuống dưới, cảm nhận sự vật trước đã.',
    ly: ['KHÁI NIỆM', 'PHÁN ĐOÁN', 'SUY LUẬN'],
    lyNoi: [
      '<b>Khái niệm</b> — “táo”: loại quả của cây táo, có vỏ, thịt và hạt',
      '<b>Phán đoán</b> — “táo chín thì vỏ đỏ, thịt ngọt”',
      '<b>Suy luận</b> — “quả này đỏ, vậy quả này đã chín”'
    ],
    buocNhay: ['Trở về thực tiễn', 'LÝ LUẬN → THỰC TIỄN'],
    xong: 'Kết luận phải đem trở lại thực tiễn để kiểm tra. Cửa trạm IV đã mở.',
    buoc: ['CẢM GIÁC', 'TRI GIÁC', 'BIỂU TƯỢNG']
  },

  /* ----- Trạm IV ----- */
  t4: {
    gt: [
      {
        menh: 'Trái Đất đứng yên ở trung tâm vũ trụ',
        ghi: 'từng được tin suốt hơn một nghìn năm',
        ket: 'SAI — BỊ THỰC TIỄN BÁC BỎ',
        giai: '<b>Tính khách quan</b> — bao nhiêu người từng tin cũng không làm nó thành đúng. Quan sát thực tiễn đã bác bỏ nó.'
      },
      {
        menh: 'Nước sôi ở 100 °C',
        ghi: 'ai cũng từng học',
        ket: 'ĐÚNG — Ở ÁP SUẤT 1 ATM',
        giai: '<b>Tính cụ thể</b> — trên đỉnh Everest, nước sôi ở khoảng 70 °C. Chân lý gắn với điều kiện cụ thể.'
      },
      {
        menh: 'Cơ học Newton mô tả đúng chuyển động',
        ghi: 'nền móng vật lý cổ điển',
        ket: 'ĐÚNG — KHI VẬT CHẬM HƠN NHIỀU SO VỚI ÁNH SÁNG',
        giai: '<b>Tuyệt đối và tương đối</b> — thuyết tương đối mở rộng cơ học Newton chứ không xoá bỏ nó.'
      }
    ],
    /* mô hình minh hoạ cho từng mệnh đề */
    moHinh: ['MÔ HÌNH ĐỊA TÂM · Ptôlêmê', 'ĐUN NƯỚC Ở HAI ĐỘ CAO', 'CON LẮC NEWTON'],
    nhatTam: 'MÔ HÌNH NHẬT TÂM · Côpécních',
    apSuat: ['mực nước biển · 1 atm', 'đỉnh Everest · ~0,34 atm'],
    tuongDoi: 'thuyết tương đối · v ≈ c',
    goiYGt: '<b>kiểm nghiệm bằng thực tiễn</b>',
    kimCuong: ['VIÊN KIM CƯƠNG CHÂN LÝ', 'tri thức đã qua kiểm nghiệm'],
    goiYNhat: '<b>nhặt viên kim cương</b>',
    sanSang: 'Viên kim cương đã thành hình. Lại gần để nhặt.',
    buocNhay: ['Chân lý', 'ĐÃ ĐƯỢC THỰC TIỄN KIỂM NGHIỆM'],
    cuaRa: 'Cửa ra đã mở — bước qua cổng sáng để hoàn thành phòng'
  },

  /* nhãn trên bảng chỉ số */
  panel: {
    den: 'Ý niệm tự sinh',     denDang: 'ĐANG TƯỞNG TƯỢNG',    denXong: 'CHỈ LÀ ẢO ẢNH',  yNiem: 'Ý NIỆM',
    ruong: 'Nhìn thấu “vật tự nó”', ruongDang: 'ĐANG XEM HIỆN TƯỢNG', ruongKet: 'KHÔNG CHẠM TỚI BẢN CHẤT', banChat: 'BẢN CHẤT',
    guong: 'Phản ánh của gương', guongDang: 'ĐANG SOI',      guongXong: 'PHẢN ÁNH THỤ ĐỘNG',
    can: 'Năng lượng thực tiễn', canChua: 'XƯỞNG ĐANG NGỪNG',
    giac: 'Nhận thức cảm tính',
    nao: 'Nhận thức lý tính',  naoRong: 'RỖNG — THIẾU DỮ LIỆU', naoCho: 'SẴN SÀNG TƯ DUY',
    gt: 'Kiểm nghiệm thực tiễn', gtDang: 'ĐANG KIỂM NGHIỆM',
    kc: 'Chân lý', kcDang: 'ĐANG NHẶT'
  },

  baiHoc: {
    nhan: 'Bạn đã đi hết con đường nhận thức',
    tieuDe: 'Thực tiễn — cơ sở và tiêu chuẩn của nhận thức',
    dan: 'Ba lối đi cũ đều dừng trước chiếc rương “vật tự nó”. Chỉ khi xưởng thực tiễn chạy, ' +
         'rương mới mở. Từ đó bạn đi từ cảm giác lên suy luận, rồi đem kết luận trở lại thực tiễn ' +
         'để kiểm nghiệm — và chỉ những gì qua được thử thách ấy mới thành chân lý.',
    dinhNghia: [
      ['Nhận thức', 'Quá trình phản ánh tích cực, tự giác và sáng tạo thế giới khách quan vào bộ óc con người, trên cơ sở thực tiễn.'],
      ['Thực tiễn', 'Hoạt động vật chất có mục đích, mang tính lịch sử – xã hội; là cơ sở, động lực, mục đích của nhận thức và tiêu chuẩn kiểm tra chân lý.'],
      ['Cảm tính và lý tính', 'Hai giai đoạn của một quá trình thống nhất: cảm tính cho cái trực tiếp, bề ngoài; lý tính cho cái gián tiếp, bản chất.'],
      ['Chân lý', 'Tri thức phù hợp với hiện thực khách quan và được thực tiễn kiểm nghiệm; có tính khách quan, tuyệt đối – tương đối và cụ thể.']
    ],
    trichDan: '“Từ trực quan sinh động đến tư duy trừu tượng, và từ tư duy trừu tượng đến thực tiễn — ' +
              'đó là con đường biện chứng của sự nhận thức chân lý, của sự nhận thức thực tại khách quan.”',
    nguon: 'V. I. Lênin, Bút ký triết học — Toàn tập, t.29, NXB Tiến bộ, M., 1981, tr.179; dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    phuongPhapLuan: [
      ['Quan điểm thực tiễn', 'Nhận thức phải xuất phát từ thực tiễn, dựa trên thực tiễn, và quay về phục vụ thực tiễn.'],
      ['Chống bệnh kinh nghiệm', 'Dừng lại ở tầng cảm tính, tuyệt đối hoá kinh nghiệm, coi nhẹ lý luận.'],
      ['Chống bệnh giáo điều', 'Nhảy thẳng lên tầng lý tính, tuyệt đối hoá lý luận, xa rời thực tiễn.']
    ],
    lienHe: {
      tieuDe: 'Thử tự trả lời',
      than: 'Một kiến thức bạn học thuộc để thi nhưng chưa bao giờ dùng đến — bạn có chắc nó đúng không? ' +
            'Bạn sẽ kiểm nghiệm nó bằng cách nào?'
    },
    nhacRong: 'Bạn đã thử tư duy khi chưa có dữ liệu cảm tính %n lần — đó chính là con đường của bệnh giáo điều.'
  },

  soTay: {
    ten: 'Lý luận nhận thức',
    tom: 'Thực tiễn là cơ sở, động lực, mục đích của nhận thức và là tiêu chuẩn kiểm tra chân lý. ' +
         'Nhận thức đi từ trực quan sinh động đến tư duy trừu tượng, rồi trở về thực tiễn.'
  }
};
