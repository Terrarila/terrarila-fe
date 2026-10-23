# Luồng yêu cầu thiết kế — 21/10/2026

## Đã tích hợp

- `/lam-theo-yeu-cau`: giữ builder/ảnh hiện có; Redux Toolkit + Redux Persist là nguồn duy nhất cho lựa chọn và ghi chú. Lưu dưới `persist:terrala-design`, schema version 1. State được kiểm tra/sanitize khi khôi phục; chỉ lưu ID vật liệu, ghi chú, khóa gửi lại và SHA-256 nhận diện cùng nội dung gửi. Không lưu dữ liệu liên hệ, Google token, giá hoặc trạng thái API vào Redux Persist.
- Provider chỉ nằm trong trang builder, store tạo riêng cho mỗi lần mount/request, không có singleton phía server. Chờ hydrate trước khi cho sửa; lỗi localStorage không làm crash. Nút Bắt đầu lại xóa draft bằng reducer, Persist cập nhật dữ liệu lưu.
- Danh mục/rule/giá lấy từ BE; ảnh trình bày dùng assets đã có, nối theo category + legacyId. Chưa cấu hình giá/đơn vị hoặc quantity mode thì hiện “Shop xác nhận báo giá”. Không tự đặt giá. Giá dự kiến không phải báo giá đã chốt.
- Khách gửi tên, điện thoại/Zalo, khu vực TP.HCM, ngày mong muốn tùy chọn. Không cần đăng nhập. Hiện chưa nhận upload ảnh tham khảo; khách có thể trao đổi ảnh qua kênh shop sau khi nhận mã yêu cầu.
- Next BFF thiết lập cookie khách HttpOnly trước khi gửi API. Khóa idempotency giữ khi retry cùng nội dung; API xác nhận đã lưu xong mới đưa sang trang kết quả.
- `/yeu-cau/[id]`: mã yêu cầu và lựa chọn được BE lưu snapshot, trạng thái pending/contacted/closed; chỉ phiên khách sở hữu yêu cầu xem được, không công khai thông tin liên hệ. Xem lại trên cùng trình duyệt với cookie còn hạn 90 ngày; không phải liên kết chia sẻ liên thiết bị.
- `/quan-tri/yeu-cau`: Google login qua BFF, cookie admin HttpOnly; chỉ admin BE được xem liên hệ, phân trang và cập nhật tiếp nhận với revision/audit. Không giả lập tài khoản quản trị.

## Cấu hình chạy thật

Trong FE `.env.local`, tham khảo `.env.example`:

```
TERRALA_API_URL=http://127.0.0.1:4000
TERRALA_GOOGLE_CLIENT_ID=<cùng Web client ID với backend>
TERRALA_ZALO_URL=<link HTTPS của shop>
TERRALA_MESSENGER_URL=<link HTTPS của shop>
TERRALA_SITE_ORIGIN=<origin chính xác của FE khi deploy>
```

Backend cần DATABASE_URL hoạt động và migration `007_design_requests.sql` (chạy `npm run db:migrate` theo quy trình hiện có). Không sửa migration cũ. Google Console cần origin FE được cho phép; admin được cấp bằng script `admin:grant` hiện có. Không đổi quyền tài khoản từ FE.

Khởi động lại FE sau khi đổi environment. Không để API fixture cổng 4100 làm backend nhận đơn thật.

## Phạm vi nghiệp vụ

Đây là luồng yêu cầu tư vấn trước báo giá, phù hợp option 1 đã chốt. Shop tư vấn, gửi giá cuối cùng/phiếu xác nhận/cọc qua kênh liên hệ thủ công. Không đưa yêu cầu chưa có giá vào bảng orders, không nhân đôi payment ledger, không tự tạo quote/invoice hoặc đánh dấu đã nhận tiền. Checkout, phiếu đơn và thanh toán đã có API riêng nhưng chưa nối vào guest inquiry: cần chốt luồng chuyển yêu cầu sang đơn chính thức trước khi thêm màn hình này.

Chưa có email/Zalo tự động; shop xem danh sách yêu cầu trong quản trị. Link Zalo/Messenger chỉ hiện khi có cấu hình. Giá dự kiến chỉ tính khi policy là per_selection và tất cả lựa chọn có giá/đơn vị available. Không suy đoán định mức gram, kích thước bể hay phí giao.

## Kiểm chứng

- FE: typecheck, production build, lint không có lỗi mới; còn một cảnh báo có sẵn `complete` ở hero fallback.
- 6 FE tests: GLB/timeline có sẵn, persistence qua tạo lại store, reset, sanitize dữ liệu cũ/hỏng và giá chưa cấu hình.
- 18 BE API tests trên PGlite riêng, gồm guest request, replay/concurrent idempotency, input/rule, owner isolation, admin role/revision/audit, pagination/rate limit.
- Browser thật local: chọn ba rêu, chặn loại thứ tư; reload giữ lựa chọn/ghi chú; đóng tab và mở lại vẫn khôi phục; gửi form qua Next BFF tới API kiểm thử, nhận receipt thật từ DB tạm; cập nhật trạng thái; xem màn hình 390px.
- Next MCP: không có lỗi compilation/runtime ở lượt kiểm tra.
- Chưa xác minh Google browser login với client ID thật hoặc database PostgreSQL TCP/TLS thật. Chưa deploy, chưa chạy migration vào DB thật.

API test fixture `TERRALA_EPHEMERAL_UI=true node_modules/.bin/tsx test/ui-server.ts` ở BE dùng PGlite trong bộ nhớ, bỏ .env và biến mất khi dừng; không dành cho production. Production cần rate limit/WAF ở tầng triển khai: giới hạn 5 yêu cầu/giờ theo phiên tại API chỉ là một lớp tiếp nhận cơ bản.
