/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Lượng → Chất   (id: luong-chat)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['luong-chat'] = {
  tang: 'Tháp Xoắn Ốc · Tầng II — Lò Luyện',
  ten: 'Phòng I — Lượng đổi dẫn đến Chất đổi',
  chuong: 'MLN111 · Chương 2 — Chủ nghĩa duy vật biện chứng',

  moDau: {
    tieuDe: 'Quy luật chuyển hoá từ những thay đổi về lượng thành những thay đổi về chất',
    than: 'Trước mặt bạn là một bình nước. Đừng đọc gì cả — hãy tự làm nóng nó lên, ' +
          'rồi tự làm lạnh nó xuống. Quan sát xem <em>chất</em> của nó thay đổi vào lúc nào, ' +
          'và bằng cách nào.'
  },

  nhan: {
    chat: 'Chất',
    do: 'ĐỘ — LƯỢNG ĐỔI, CHẤT CHƯA ĐỔI',
    diemNut: 'ĐIỂM NÚT',
    tichLuy: 'Tích luỹ về lượng tại điểm nút',
    buocNhay: 'Bước nhảy'
  },

  trangThai: {
    ICE: 'NƯỚC ĐÁ — THỂ RẮN',
    WATER: 'NƯỚC — THỂ LỎNG',
    STEAM: 'HƠI NƯỚC — THỂ KHÍ'
  },

  nhan_buocNhay: {
    'WATER>STEAM': 'NƯỚC → HƠI',
    'STEAM>WATER': 'HƠI → NƯỚC',
    'WATER>ICE': 'NƯỚC → ĐÁ',
    'ICE>WATER': 'ĐÁ → NƯỚC'
  },

  baiHoc: {
    nhan: 'Bạn vừa tạo ra một BƯỚC NHẢY',
    tieuDe: 'Lượng đổi dần dần, chất đổi đột ngột',
    dan: 'Bạn đã cấp nhiệt từng chút một. Suốt một quãng dài, nước vẫn cứ là nước — chỉ nóng hơn. ' +
         'Rồi tới một điểm, nó ngừng nóng lên, tích luỹ thêm, và <em>nhảy</em> sang một chất khác.',
    dinhNghia: [
      ['Chất', 'Tính quy định vốn có, làm cho sự vật là <em>nó</em> chứ không phải cái khác. Ở đây: rắn — lỏng — khí.'],
      ['Lượng', 'Tính quy định về quy mô, trình độ, tốc độ… mà sự thay đổi của nó <em>chưa</em> làm sự vật thành cái khác. Ở đây: nhiệt độ.'],
      ['Độ', 'Khoảng giới hạn trong đó lượng đã biến đổi nhưng chất vẫn chưa đổi — chính là dải 0&nbsp;°C → 100&nbsp;°C trên thanh đo.'],
      ['Điểm nút', 'Thời điểm mà sự thay đổi về lượng đã đủ để làm chất thay đổi: 0&nbsp;°C và 100&nbsp;°C.'],
      ['Bước nhảy', 'Sự chuyển hoá về chất do những thay đổi về lượng trước đó gây ra. Nó <em>đứt đoạn</em>, không từ từ.']
    ],
    trichDan: '“Những thay đổi đơn thuần về lượng, đến một mức độ nhất định, sẽ chuyển hoá thành những sự khác nhau về chất.”',
    nguon: 'Ph. Ăngghen — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    tiepTheo: {
      tieuDe: 'Chưa xong',
      than: 'Quy luật này đi theo cả hai chiều. Hãy quay lại và thử đi <em>ngược</em>: ' +
             'làm lạnh cho tới khi gặp điểm nút còn lại.'
    }
  },

  ketThuc: {
    nhan: 'Đã tìm ra cả hai điểm nút',
    tieuDe: 'Từ bình nước ra tới đời sống',
    dan: 'Bạn vừa chứng minh hai chiều của quy luật: lượng đổi làm chất đổi, ' +
         'và chất mới lại quy định một lượng mới — nước đá và hơi nước có những giới hạn hoàn toàn khác nhau.',
    phuongPhapLuan: [
      ['Một', 'Muốn có thay đổi về chất thì phải kiên trì tích luỹ về lượng. Nôn nóng, đốt cháy giai đoạn, muốn nhảy khi chưa đủ lượng là <em>tả khuynh</em>.'],
      ['Hai', 'Khi lượng đã tích đủ tại điểm nút thì phải quyết đoán thực hiện bước nhảy. Ngần ngừ, bảo thủ, không dám đổi chất là <em>hữu khuynh</em>.']
    ],
    lienHe: {
      tieuDe: 'Thử tự trả lời',
      than: 'Bạn ôn thi thêm mỗi ngày một chút — đó là <em>lượng</em>. Điểm số nhảy từ trượt sang đạt — đó là <em>chất</em>. ' +
            'Vậy <em>độ</em> của bạn rộng bao nhiêu, và <em>điểm nút</em> của bạn nằm ở đâu?'
    }
  },

  soTay: {
    ten: 'Lượng → Chất',
    tom: 'Những thay đổi dần dần về lượng, khi vượt qua điểm nút, gây ra bước nhảy làm thay đổi chất.'
  }
};
