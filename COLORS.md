# Bảng màu FE

Nguồn duy nhất cho màu giao diện: `src/app/globals.css`. Hero, header, landing, About, builder và các dialog dùng chung CSS custom properties. Màu ánh sáng/vật liệu 3D được giữ riêng vì đó là nội dung render, không phải màu UI.

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--color-background` | `#F7F4EC` | Nền trang, header và dialog |
| `--color-surface` | `#FCFAF5` | Ô nhập liệu |
| `--color-surface-alt` | `#E8ECDF` | Panel preview, khối thông tin |
| `--color-surface-selected` | `#DDE4D5` | Section sage, lựa chọn/hover |
| `--color-text` | `#203D32` | Chữ chính |
| `--color-text-muted` | `#526353` | Chữ phụ, placeholder |
| `--color-primary` | Alias `--color-text` | Nút chính |
| `--color-primary-hover` | `#152E25` | Hover nút chính |
| `--color-accent` | `#984829` | CTA đất nung, step label, focus trên nền sáng |
| `--color-accent-hover` | `#7E381E` | Hover CTA đất nung |
| `--color-border` | `#CBD3C4` | Đường chia trang trí |
| `--color-border-control` | `#74816F` | Viền nhận diện input, radio, card lựa chọn |
| `--color-error` | `#873B28` | Lỗi và dấu trường bắt buộc |
| `--color-overlay` | `rgb(15 31 24 / 60%)` | Backdrop dialog/drawer |

`--color-text-inverse` và `--color-text-inverse-muted` dùng trên nền tối. `--color-focus` mặc định theo accent; footer chuyển focus sang inverse, dialog sáng bên trong footer đặt lại accent.

## Quy tắc sử dụng

- Dùng token theo vai trò; không thêm mã hex trực tiếp vào CSS module hay inline styles.
- Dùng màu hover riêng, không giảm opacity cả nút đang hoạt động. Opacity cho trạng thái disabled vẫn được giữ.
- Giữ viền trang trí nhẹ; dùng border-control cho các đường viền cần nhận diện thao tác.
- Paragraph mặc định kế thừa màu của vùng chứa. Chỉ đặt text-muted khi nội dung là chữ phụ; CSS hero không áp màu paragraph cho các trang khác.
- Khi thêm nền mới, kiểm tra lại tương phản: chữ thường tối thiểu 4.5:1, chữ lớn 3:1. Các chỉ số dưới đây là cho các cặp màu phẳng, không thay thế kiểm tra toàn bộ nội dung mới.

## Các cặp đã tính

| Cặp màu | Tương phản |
| --- | --- |
| Chữ chính / nền trang | 10.76:1 |
| Chữ phụ / nền sage selected | 4.94:1 |
| Accent / nền sage selected | 4.90:1 |
| Chữ inverse / CTA accent | 5.80:1 |
| Chữ inverse / CTA accent hover | 7.73:1 |
| Border control / nền sage selected | 3.16:1 |
