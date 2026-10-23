export const STAGES = [
  { progress: 0, button: "01 Kính", title: ["Một khoảng trống.", "Một thế giới mới."], description: "", label: "01 / KÍNH TRỐNG" },
  { progress: 0.24, button: "02 Sỏi", title: ["Bắt đầu từ", "những viên sỏi."], description: "Lớp sỏi đầu tiên nhẹ nhàng rơi xuống đáy bể.", label: "02 / SỎI" },
  { progress: 0.4, button: "03 Đất", title: ["Một lớp đất.", "Một sự sống."], description: "Nền đất tối dần phủ lên lớp sỏi, tạo chiều sâu cho khu rừng nhỏ.", label: "03 / ĐẤT" },
  { progress: 0.61, button: "04 Rêu", title: ["Rêu phủ xanh.", "Rừng dần thành hình."], description: "Những mảng rêu và đá nhỏ trở về vị trí của mình.", label: "04 / RÊU & ĐÁ" },
  { progress: 0.919, button: "05 Cây", title: ["Từng chiếc lá.", "Một nét ửng hồng."], description: "Tán cây xanh phía sau, cụm lá hồng phía trước — lấy cảm hứng từ ảnh mẫu.", label: "05 / CÂY" },
  { progress: 1, button: "06 Nắp", title: ["Khép chiếc nắp.", "Riêng một góc rừng."], description: "Chiếc nắp kính hạ xuống khi bố cục đã hoàn thành.", label: "06 / ĐÓNG NẮP" },
] as const;

export function stageAt(progress: number) {
  return progress < 0.08 ? 0 : progress < 0.27 ? 1 : progress < 0.43 ? 2 : progress < 0.63 ? 3 : progress < 0.92 ? 4 : 5;
}
