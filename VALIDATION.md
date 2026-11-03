## Giới hạn chọn rêu — 2026-10-19

- Tối đa 3 loại rêu, chặn cả input và cập nhật state. Hiện bộ đếm, làm mờ/khóa rêu chưa chọn khi đủ 3; nút xem ảnh vẫn hoạt động.
- Browser: chọn 3 → khóa 4 loại còn lại; thử bấm loại thứ 4 vẫn giữ 3. Bỏ một loại rồi chọn loại mới thành công. Typecheck/build qua, lint còn warning có sẵn, Next runtime không lỗi.

## Popup ảnh rêu/cây — 2026-10-19

- 14 option rêu/cây có nút phóng to bên phải dấu cộng. Button là sibling của label nên mở ảnh không chọn/bỏ vật liệu.
- Một native dialog dùng chung, chỉ tải ảnh lớn khi mở, có trạng thái tải/lỗi; giữ tỉ lệ ảnh bằng contain. X/Escape/backdrop đóng, khoá cuộn nền khi mở và trả focus về nút preview khi đóng.
- Đã mở ảnh Rêu Cushion khi chưa chọn rêu: checkbox giữ nguyên; đã chọn rêu rồi mở/đóng vẫn giữ lựa chọn. Cẩm nhung mở đúng ảnh mà không chọn cây.
- Desktop 1440×1000 và mobile giả lập 390×844/320×667: popup nằm trong viewport, ảnh lớn tải thành công. Screenshot: `../terrarila-be/reference/fe-docs/material-image-popup-desktop.png`, `../terrarila-be/reference/fe-docs/material-image-popup-mobile.png`.
- Lint/typecheck/build webpack qua; còn warning có sẵn `complete` của hero fallback. Next compilation issues=[], runtime configErrors/sessionErrors=[].

## Danh mục sỏi, đất, rêu và cây — 2026-10-19

- 5 bước: bể, sỏi, đất, rêu, cây. Hai loại sỏi chọn độc lập: soi-den → Sỏi tối màu, soi-trang → Sỏi tự nhiên. Đất trồng/đất kết dính là bước riêng, cho phép chọn cả hai.
- Có 7 loại rêu, 7 loại cây theo ảnh người dùng cung cấp. Tên Poliona dùng ảnh `peliona.png`. Tổng 18 đường dẫn ảnh đã kiểm tra tồn tại; hai loại đất chưa có ảnh, hiển thị placeholder.
- Dùng chung `MaterialThumbnail` cho option và vật liệu đã chọn trong panel 60%. Danh sách cuộn riêng khi dài; ảnh bể không ghép vật liệu vào trong.
- Browser: đã chọn cùng lúc 18 vật liệu (2 sỏi, 2 đất, 7 rêu, 7 cây). Bỏ một rêu còn 6 rêu, không thay đổi 2 sỏi/2 đất. Reset xoá lựa chọn/preview và khoá 4 bước khi chưa chọn bể. Danh sách preview cuộn bằng bàn phím được.
- Desktop 1440×1000 preview sticky top 0; mobile giả lập 390×844 và 320×667 không tràn ngang. Tất cả ảnh vật liệu tải thành công; thumbnail preview dùng currentSrc 48px ở viewport được đo. Ảnh: `../terrarila-be/reference/fe-docs/custom-materials-desktop.png`, `../terrarila-be/reference/fe-docs/custom-materials-mobile.png`.
- Lint/typecheck/build webpack qua, còn warning có sẵn prop `complete` của hero fallback. Next compilation issues=[], configErrors/sessionErrors=[]. Chưa kiểm tra thiết bị mobile thật.

## Preview bằng ảnh bể — 2026-10-19

- Hai lựa chọn: Bể vuông (`cubic-square.png`, 407×406), Bể chữ nhật ngang (`horizontal-retangle.png`, 530×318). Dùng chung ảnh/dữ liệu cho thumbnail và preview bằng next/image, giữ tỉ lệ, có sizes.
- Đã bỏ SVG trên trang custom. Vật liệu chọn nằm thành danh sách dọc bên ngoài ảnh; đổi bể giữ lựa chọn vật liệu, bỏ cây cập nhật danh sách, reset xoá cả preview và vật liệu.
- Đã kiểm tra Chrome desktop 1440×1000, mobile giả lập 390×844 và 320×667; không tràn ngang. Desktop vẫn grid 864/576 và preview sticky. Ảnh kiểm tra: `../terrarila-be/reference/fe-docs/custom-photo-desktop.png`, `../terrarila-be/reference/fe-docs/custom-photo-mobile.png`.
- Typecheck/build webpack thành công; lint còn một warning có sẵn về `complete` trong fallback hero. Next dev compilation issues = [], runtime configErrors/sessionErrors = [].

## Trang thiết kế theo yêu cầu — 2026-10-12

- Route `/lam-theo-yeu-cau`, CTA desktop/mobile và nút Bắt đầu tạo bể riêng đã trỏ tới route. Navigation menu đã được kiểm tra trong production.
- Desktop 1440×1000: grid 864px/576px (60/40), không có `.container`; preview top = 0 sau khi cuộn hơn 1600px tới bước cây. Mobile 390×844 và 320×667 không tràn ngang, preview sticky trên.
- Đã chọn bể lục giác + nền tự nhiên + đá núi + rêu gối + dương xỉ + lá hồng bằng input/bàn phím; preview có đủ 5 lớp. Nút sao chép báo thành công; reset bỏ toàn bộ input/layer và khoá lại 4 bước vật liệu trước khi chọn bể.
- SVG dùng clipPath ID riêng cho mỗi thumbnail/preview. Vật liệu vào bằng opacity/translateY, không animate scale; reduced motion tắt animation.
- Lint 0 lỗi, còn warning có sẵn `complete` trong hero fallback. Typecheck và production build webpack thành công. Next dev compilation issues = [], runtime configErrors/sessionErrors = [].
- Screenshot production: `../terrarila-be/reference/fe-docs/custom-desktop.png`, `../terrarila-be/reference/fe-docs/custom-mobile.png`.
- Giới hạn: minh hoạ SVG, chưa có ảnh vật liệu tách lớp; chưa xác nhận tồn kho/giá, chưa lưu đơn hay lựa chọn qua reload. Mobile mới giả lập trên Chrome desktop, chưa kiểm tra điện thoại thật.

## Menu responsive — 2026-10-09

- Header mới có logo lá màu đất, menu giữa và CTA `#custom`; menu trỏ tới `#collection`, `#portfolio`, `#story`. CSS tách trong `site-header.module.css`; dùng chung container 80%.
- Desktop 1440px: tâm menu đo được 720px. Cuộn xuống 500px → ẩn, cuộn lên 100px → hiện.
- Mobile viewport 390×844: drawer trượt từ phải sang trái, nút X/Escape đóng và trả focus về nút menu; khóa cuộn nền khi mở, khôi phục khi đóng. Click Bể có sẵn → hash `#collection` và đóng drawer. Resize từ mobile sang desktop tự đóng và khôi phục cuộn.
- Native dialog giữ focus trong drawer; CSS tắt transition khi prefers-reduced-motion. Chưa kiểm tra điện thoại thật hay Safari phiên bản cũ.
- Phiên headless của công cụ kiểm tra giữ animation currentTime ở 0; đã đối chiếu lại bằng Chrome có cửa sổ, animation hoàn tất bình thường. React DevTools extension có lỗi sau HMR; kiểm tra cuối qua navigation mới và production.
- Lint: 0 lỗi, 1 warning có sẵn về prop `complete`; typecheck và production build webpack thành công. Next dev compilation không có issues.
- Ảnh: `../terrarila-be/reference/fe-docs/header-desktop.png`, `../terrarila-be/reference/fe-docs/header-mobile-drawer.png`.

## Điều chỉnh container chung — 2026-10-07

- Menu, hero, 4 section và footer dùng cùng class global `.container`, `max-width: 80%`, `margin-inline: auto`. Các khung section/menu/hero không dùng padding ngang.
- Đo trên production: viewport 1440px → container 1152px, lề 144px; 390px → 312px, lề 39px; 320px → 256px, lề 32px. Cả 7 container cùng kích thước. Không tràn ngang ở 320px, 390px, 1024px và 1440px.
- Đã xem desktop portfolio, mobile collection/footer/hero và tablet story/footer. Screenshot: `../terrarila-be/reference/fe-docs/container-80-desktop.jpg`, `../terrarila-be/reference/fe-docs/container-80-mobile.jpg`.
- Lint: 0 lỗi, còn warning có sẵn về prop `complete` không dùng trong fallback hero. Typecheck và production build webpack thành công. Không thay đổi logic animation hay model.

# Kiểm tra bản landing Petite Terre

Ngày kiểm tra: 07/10/2026. Môi trường: macOS, Node 22.18, npm 11.7; Chromium desktop do agent-browser quản lý và browser tích hợp trong Codex.

## Lượt bổ sung section từ Figma — 07/10/2026

- Đối chiếu design context và screenshot của các node `3:72`, `3:92`, `3:132`, `3:159`, `3:167` trong file `3Yrp1XlcEAI8pXRizScYh1`.
- Đúng thứ tự background yêu cầu: forest / ivory / sage / ivory; footer forest theo design. Chữ và outline ở portfolio đổi sang ivory/sage để tương phản với nền forest.
- Ba asset local không rỗng: triptych 2172×724, story 1122×1402, logo SVG root 14×23. Sáu card dùng chung triptych với width 300% và đúng offset; kiểm tra kích thước slot, crop, ảnh tải thành công trên DOM và screenshot. Gallery sản phẩm cũng tải đủ ba ảnh.
- `npm run lint`: 0 lỗi, còn 1 warning có sẵn về prop `complete` chưa sử dụng trong fallback hero; không sửa hero.
- `npm run typecheck`: qua. `TERRALA_BUILD_DIR=.next-build npm run build -- --webpack`: qua, route `/` prerender tĩnh. Production server đã khởi động lại ở port 3001.
- Browser tích hợp: desktop 1440×1000; mobile 390×844 và 320×740. Đã xem portfolio, collection, custom, story, footer; viewport mobile không tràn ngang. Đây là kiểm tra layout trên Mac, không phải kiểm tra thiết bị di động thật.
- Đã mở gallery portfolio/collection, nội dung story, CTA custom và thông báo liên hệ chưa cấu hình; đóng bằng nút × hoặc Escape và kiểm tra focus trở về nút mở. Native dialog được căn giữa và có vùng cuộn khi nội dung dài.
- Checksum của toàn bộ source hero/3D không đổi. So sánh chuỗi CSS cũ với globals + hero.css cho kết quả giống nguyên trạng (ngoại trừ dòng import mới).
- Ảnh mới: `../terrarila-be/reference/fe-docs/landing-portfolio-desktop.jpg`, `../terrarila-be/reference/fe-docs/landing-story-footer-desktop.jpg`, `../terrarila-be/reference/fe-docs/landing-collection-mobile.jpg`, `../terrarila-be/reference/fe-docs/landing-footer-mobile.jpg`.
- Chưa có URL Messenger/Zalo chính thức; Figma không chứa hyperlink/reaction cho các CTA. Nút contact có thông báo chờ cập nhật. Custom mới mở lựa chọn liên hệ, chưa có luồng gửi đơn/cọc; nút xem bộ sưu tập/câu chuyện mở nội dung có sẵn trong dialog.
- Link `#reference` trong header là chi tiết có sẵn từ trước, hiện chưa có section tương ứng; giữ nguyên header/hero theo phạm vi yêu cầu.

Các mục phía dưới ghi lại lượt kiểm tra hero ban đầu, trước các chỉnh sửa UI gần đây; không phải xác nhận lại các control hero hiện tại.

## Source và phiên bản

Folder ban đầu trống. Không tìm thấy AGENTS.md trong folder hoặc các thư mục cha đã kiểm tra. Sau lần chạy đầu, Next.js tự tạo AGENTS.md; đã đọc và đối chiếu tài liệu bundled về Server/Client Components, dynamic import, font và Turbopack root.

Đã đọc index.html, style.css, main.js của trang thử nghiệm trước khi port. File tham khảo và `.blend` không bị chỉnh sửa. SHA-256 của GLB copy bằng đúng file gốc (xem README).

Phiên bản được xác minh qua npm registry trước khi cài: Next 16.4.0, React/React DOM 19.3.0, Fiber 9.8.1, Drei 10.7.9, Three 0.186.1, Tailwind 4.3.3. Peer dependencies phù hợp; không cài canary hoặc thư viện animation riêng. package-lock.json đã lưu bộ dependency thực tế.

## Các check đã chạy

- `npm run lint`: qua, không lỗi/warning ESLint ở source.
- `npm run typecheck`: qua.
- `npm test`: 3 test qua. Có đọc geometry/node/timeline từ GLB thật để kiểm tra fixed scale, translation rơi, visibility, seek ngược và rebind sau Strict Mode cleanup. CPU test bỏ texture để chạy được ở Node; material được kiểm tra riêng trên browser.
- `TERRALA_BUILD_DIR=.next-build npm run build`: qua; `/` được prerender thành static content.
- Production server chạy tại `http://127.0.0.1:3001`; dev tại `http://127.0.0.1:3000`.
- MCP Next.js: `get_compilation_issues` không có issue; `get_errors` không có config/session error sau khi sửa.

## Browser QA

Đã chạy assertion trên cả dev và production:

- Ban đầu tiến trình 0, không có sỏi/đất/rêu/cây/nắp đã lắp.
- Phát tiến tới >12%; tạm dừng giữ nguyên tiến trình qua nhiều frame; tiếp tục playback tới 100% thì dừng.
- Thanh range nhận Home/End; slider, caption, progress bar, stage button và scroll cùng phản ánh một tiến trình. Ngoài ra đã dùng slider native trong browser tích hợp, đưa về 50% và kiểm tra copy/scene đổi sang rêu.
- Nút giai đoạn seek tới vị trí định sẵn; cuộn tiếp không kéo về giá trị scroll cũ.
- Scroll xuống tăng tiến trình, scroll lên giảm tiến trình. Tua ngược sau 100% hoạt động.
- 100% giữ nguyên bể hoàn thiện, không loop.
- Resize desktop/mobile giữ tiến trình và đồng bộ lại scroll extent.
- Desktop 1440×900, mobile emulation 390×844 và 375×667: không tràn ngang. Bản mobile thấp đã sửa để caption và đáy cảnh nằm trong viewport.
- Đã xem riêng các stage sỏi, rêu/đá, cây và nắp. Model hoàn thiện có cụm cây mặt trước và lá hồng. Màu/texture lá vẫn lấy từ GLB, không thay bằng model khác.
- `prefers-reduced-motion`: tiến trình 100%, tắt các controls animation, giảm chiều cao scroll narrative.
- Ra ngoài hero bằng link concept: render mode `never`, playback dừng; quay lại hero trở về `demand`.
- Mất WebGL context thực sự bằng `WEBGL_lose_context`: fallback ảnh/status xuất hiện.
- Chặn request GLB: error boundary hiển thị ảnh/status; bỏ chặn và reload tải model lại bình thường.
- Một đoạn playback sau khi tải xong, không có HMR, không ghi nhận React render trong profiler. Đây là kiểm tra kiến trúc cập nhật, không phải benchmark FPS/GPU.

Ảnh kiểm tra lưu trong `docs/`: desktop hoàn thiện, mobile hoàn thiện, mobile thấp và phần concept. Các ảnh production không có overlay dev.

## Giới hạn thực tế

- Mobile mới được giả lập viewport trên máy Mac; chưa kiểm tra iPhone/Android thật, Safari mobile, thermal throttling, mạng 4G hoặc GPU yếu. Không kết luận performance mobile tốt từ build hoặc browser emulation.
- GLB vẫn ~35.24 MiB, 719 mesh, 464,164 tam giác. Nhiều mesh có thể tạo nhiều draw call; chưa merge/instance/decimate hay nén texture để giữ nguyên model lần này.
- DPR cap 1.5, render on demand và không refraction giúp giảm công việc; chưa đo GPU time, memory hay tải trên mạng chậm.
- Kính dùng transparency/clearcoat thay vì transmission/refraction. Nhìn rõ cây, có environment nhẹ, nhưng không phải render kính vật lý giống Blender.
- Fallback là ảnh concept. Khi model lỗi, người dùng không thể xem chuyển động 3D cho tới khi tải thành công lại.
- Thư viện Fiber hiện vẫn phát cảnh báo deprecation `THREE.Clock` của Three mới. Website không gọi API này trực tiếp; cảnh báo không gây lỗi runtime ở lượt kiểm tra.
- Runtime dependency audit: 0 lỗ hổng. Full audit còn 5 cảnh báo high trong dependency lint; chưa có bản braces latest vá phù hợp trên registry lúc kiểm tra. Không downgrade Next/eslint-config-next hoặc dùng force fix.

## Chạy lại browser QA

CLI `agent-browser` là công cụ ngoài project, đã được cài để kiểm tra; website không phụ thuộc nó.

```bash
python3 scripts/browser-check.py
```

Để kiểm tra production server:

```bash
TERRALA_URL=http://127.0.0.1:3001 python3 scripts/browser-check.py
```

Script lưu screenshot tạm trong `/tmp` và report React render trong `/tmp/terrala-playback-render-report.json`. Test WebGL mất context và lỗi download đã được kiểm tra riêng, không nằm trong script assertion cơ bản.

## About Us · 27/10/2026

- Thêm `/about-us` với title “Petite Terre | Riêng một góc trời.” căn giữa, đúng nội dung người dùng cung cấp. Hai section desktop dùng hai cột bằng nhau và đảo phía vùng ảnh; các vùng ảnh để trống. Mobile 390×844 xếp nội dung trước vùng ảnh trong mỗi section.
- Header “Về chúng tôi” và CTA câu chuyện trên landing nối tới route mới; các link collection/portfolio có tiền tố `/` để quay về đúng anchor trang chủ từ trang con. Logo header trở về `/`.
- `npm run typecheck` PASS. `npm run lint` không có lỗi, còn 3 warnings unused có sẵn ở các file builder/form/fallback.
- Route trả HTTP 200; xác nhận một H1 đúng tiêu đề và hai section. Đã xem Chrome desktop cả hai section, kiểm tra viewport 390×844: tiêu đề căn giữa, đoạn văn không tràn ngang. Chưa kiểm tra trên điện thoại vật lý.
- Dev server Next.js hiện báo cảnh báo bảo mật của phiên bản 16.4.0 và dừng ở lần khởi động đầu; lần chạy lại tiếp tục được. Không đổi dependencies trong phạm vi tạo trang.

## Asset chuyển BE · 28/10/2026

Ảnh/model phục vụ qua Next rewrite /assets đến BE. 11/11 test (đọc GLB thật trong repo BE liền kề), typecheck đạt; lint 0 lỗi và 3 cảnh báo unused có sẵn. Ảnh rock/soi-trang tải qua FE3000 HTTP200, cùng bytes file BE. Manifest chuyển file ở ../terrarila-be/docs/ASSET-MOVE-MANIFEST.json.

Production build riêng `.next-build` đạt sau khi retry thông báo của Next; Next 16.4.0 vẫn báo lỗ hổng phiên bản và khuyến nghị nâng cấp bảo mật. Chưa đổi dependency trong phạm vi chuyển media. `next/image` tối ưu ảnh qua rewrite trả HTTP200; GLB qua FE hỗ trợ Range206.

Chrome xác nhận trang builder mở ảnh Rêu Quyển Bá đầy đủ từ BE; Next diagnostics trả issues=[], configErrors=[], sessionErrors=[] tại thời điểm kiểm tra.

## Ảnh highlight bể bán sẵn · 28/10/2026

Migration 013 đã áp PostgreSQL local. BE 23/23 API tests đạt, kiểm tra tạo/đọc/xóa tham chiếu highlight, URL không hợp lệ và revision. Admin 15/15 tests đạt, gồm upload highlight riêng với gallery và gửi đúng If-Match. FE 11/11 tests đạt; typecheck/build cả ba đạt, lint BE/FE không lỗi (FE còn 3 warning unused cũ). Next 16.4.0 nhắc nâng cấp bảo mật; build hoàn tất sau retry.

Chrome smoke test trên DB demo riêng: chọn PNG highlight bằng file dialog, upload và lưu thành công; public API trả đúng URL; FE hiển thị ảnh chính trước hover và ảnh có chú thích khi hover. FE thật đọc sản phẩm published từ API, không gắn ảnh hover cố định khi highlight null. Không thay ảnh hoặc giá của sản phẩm trong PostgreSQL thật.

## Portfolio tự động từ sản phẩm · 30/10/2026

GET Portfolio kết hợp mục thủ công với bể bán sẵn published bằng truy vấn trực tiếp, không tạo bản sao hay cần migration. BE 24/24 tests đạt: bản nháp không lộ, sửa nguồn cập nhật ảnh/highlight/nội dung, bỏ xuất bản biến mất, xuất bản lại không trùng, phân trang chung và giữ mục thủ công. Admin 17/17 tests đạt, gồm nhãn nguồn/link chỉnh bể gốc, giữ editor của mục thủ công. FE 11/11 tests, typecheck và build đạt; lint FE 0 lỗi/3 warnings unused có sẵn. Next 16.4.0 vẫn nhắc nâng cấp bảo mật; build đạt sau retry.

Đã rebuild/recreate backend Docker, health/ready thành công; API thật trả 1 bể published và 1 mục Portfolio đồng bộ, cùng tên/ảnh/highlight. Chrome xác nhận Khu vườn đứng hiện trong section Portfolio và dialog Xem tất cả, không kèm giá/nút mua. Kiểm thử thay đổi/bỏ xuất bản chạy trong DB test riêng; dữ liệu sản phẩm thật không bị sửa.

## Size bể kính · 30/10/2026

Migration 014 đã áp lên PostgreSQL local, BE Docker đã rebuild/recreate. Public API giữ 3 dáng bể, trả 9 size con với nhãn/giá đúng danh sách: đứng 150k/150k/120k, Cubic 60k/80k/100k/130k, ngang 90k/110k. ID dáng cũ/preset giữ nguyên. Chọn size gửi ID material con; request snapshot lưu size và giá, quote/order/invoice tính từ DB, không nhận giá từ FE. Không tự xác nhận các giá nguyên liệu/tồn kho khác.

BE typecheck/lint/build/format đạt; 26/26 API tests đạt, gồm snapshot yêu cầu, tính quote theo size, invoice, chặn shape-only, ẩn dáng sau quote và seed giữ giá đã sửa. FE typecheck/build đạt, 14/14 tests đạt (thêm 3 test size/persist/preset); lint 0 lỗi/3 warning unused cũ. Build Next vẫn nhắc nâng cấp bảo mật phiên bản 16.4.0 và đạt sau retry.

Chrome trong cửa sổ kiểm thử riêng xác nhận đúng 3/4/2 size từng dáng, chọn đứng 15×15×25–150k rồi reload vẫn giữ, đổi sang Cubic bỏ size cũ/khóa gửi, chọn ngang 20×10×10 hiển thị 110k. Không gửi yêu cầu thật trong browser. Kiểm tra giao diện qua accessibility; screenshot riêng Incognito gặp lỗi công cụ/capture sai cửa sổ, chưa đánh giá bố cục mobile/thiết bị thật.

## Logo và favicon · 30/10/2026

Đã copy ba file người dùng cung cấp vào FE, đối chiếu SHA-256 giữ nguyên dữ liệu. Header dùng SVG mask màu xanh, footer dùng PNG mask màu trắng; hai icon lá cũ được thay. Favicon phục vụ file ICO gốc từ public và metadata icons (bộ đọc ảnh Next không hỗ trợ PNG RGB bên trong ICO này khi đặt ở app/favicon.ico). Hai logo và favicon HTTP200, favicon tải về khớp hash gốc. Chrome desktop xác nhận header/footer và icon tab hiển thị đúng. Có kích thước responsive; chưa kiểm tra visual mobile riêng. Typecheck/lint đạt (lint còn hai cảnh báo unused có sẵn); production build đạt sau retry cảnh báo bảo mật Next 16.4.0.

## Custom terrarium component unit tests — 2026-10-30

- Added Vitest + React Testing Library with an isolated jsdom environment; existing node:test cases remain available through `test:logic`.
- 17 component tests cover the real builder and request form with Redux, shape-specific sizes, API selection limits, presets, reset, normalized request payloads, session errors, HTTP errors, concurrent submission locking and idempotent retries.
- `npm test` runs both suites; `npm run test:unit` runs the component suite. See `tests/README.md` for scope and commands.
- Typecheck passed; lint passed with three existing unused-variable warnings in production files. Tests do not replace browser visual QA or async server-page integration checks.

## Đồng bộ bảng màu FE · 03/11/2026

- Gom màu UI về semantic tokens trong globals.css; đồng bộ hero, header/drawer, landing/footer/dialog, About, builder/receipt/admin request UI. Giữ màu nội dung 3D và các thay đổi có sẵn trong working tree.
- Nền kem thống nhất F7F4EC; chữ phụ 526353; accent 984829; hover accent 7E381E; lỗi/required dùng 873B28. Control borders tách khỏi divider trang trí. Bỏ opacity hover của landing CTA, giữ opacity disabled. Footer dùng focus sáng và dialog sáng bên trong đặt lại focus accent. Paragraph hero không còn đặt màu global cho trang khác.
- Typecheck PASS, lint 0 errors/3 existing unused warnings, 14 logic tests và 17 unit tests PASS. Production build với TERRALA_BUILD_DIR=.next-build PASS; lần chạy sandbox không tiến triển, chạy ngoài sandbox hoàn tất. Next.js 16.4.0 vẫn nhắc cảnh báo bảo mật; không nâng dependency trong thay đổi bảng màu.
- Next MCP: get_compilation_issues không có issues. Chrome 1280x633 và mobile 390x844: kiểm tra trang chủ, CTA đất nung/hover, footer, popup liên hệ/focus bàn phím, About, builder và menu mobile; xác nhận màu computed CSS và ảnh chụp. Kiểm tra chữ có nội dung trên các view đã duyệt không phát hiện cặp tương phản dưới ngưỡng trong phép đo nền phẳng, không phải chứng nhận WCAG toàn site.
- Giới hạn runtime môi trường: danh mục API không tải được; /assets/terrarium-current.glb trả 500 qua proxy, hero dùng ảnh fallback và Next MCP ghi nhận lỗi tải GLB. Vì vậy chưa kiểm chứng trực quan toàn bộ các trạng thái builder với danh mục thật hoặc render 3D. Các tình trạng này nằm ngoài phần màu UI.
- Quy ước/token và tỷ lệ tương phản được ghi tại COLORS.md.

## Trang chi tiết `/products/[slug]` · 03/11/2026

- Chỉ thêm route `/products/[slug]` với layout, page/metadata, loading, not-found và error/retry; không tạo route `/portfolio/[id]` hoặc `/products` index. Đối chiếu trực tiếp public controller/repository BE: detail chỉ đọc published products theo slug; portfolio trả sourceProductId cho sản phẩm đồng bộ.
- Tách contract, server-only catalog/pagination, presentation helpers, gallery client, product info server, related server, card/grid và contact actions dùng chung. Landing giữ các section hiện có và hover ảnh; card nguồn sản phẩm trong Những bể đã làm/popup và Bể có sẵn dẫn tới detail. Portfolio nhập riêng không được gán một URL sản phẩm không tồn tại. Link có #top để tránh Next giữ vị trí cuộn cuối landing khi sang trang mới.
- Detail dùng tên/mô tả/giá/availability/gallery từ API; null giá vẫn yêu cầu shop xác nhận. Highlight được thêm vào gallery nếu chưa có. Không thêm kích thước, trạng thái đã bán, chăm sóc hay chính sách tự suy đoán. Related tối đa 4 bể available, loại chính bể hiện tại; có thông báo riêng khi rỗng/lỗi.
- Typecheck PASS; lint 0 errors/3 existing unused warnings; 14 logic tests và 29 unit tests PASS. Tests mới kiểm tra source links, encode slug, lọc related, gallery/highlight/ảnh thiếu, null giá/availability, nested controls, missing product/API outage, metadata, related lỗi/rỗng và retry. Route tests mock catalog; không thay thế xác minh public API thật.
- Production build tách output .next-build PASS sau retry của security reminder. Route map chỉ bổ sung /products/[slug]. Next.js 16.4.0 vẫn cảnh báo bảo mật; không nâng dependencies trong phạm vi này.
- Chrome desktop 1440×1000 và mobile 390×844 với public API local port 4000 thật: đã bấm card Khu vườn ngang từ section Những bể đã làm, kiểm tra tên/giá/ảnh; đổi ảnh thứ hai và xác nhận ảnh tải thành công; related chỉ có Khu vườn đứng và bấm sang đúng slug. Popup Xem tất cả bể đã làm → Khu vườn đứng đóng dialog, scrollY=0. Mobile không tràn ngang. Slug không tồn tại hiện trang Không tìm thấy; title/robots theo dữ liệu. Next MCP get_compilation_issues=[], get_errors không có config/session errors ở detail vừa kiểm tra. React tree có ProductGallery, ProductInfo, RelatedProducts và TerrariumCard.
- Không sửa dữ liệu shop, không gọi API ghi trong browser smoke. API outage và related rỗng được kiểm tra bằng mocks; không dừng backend thật để giả lập lỗi.


## Dependency patch / Vercel Preview preparation · 03/11/2026

Next.js and eslint-config-next pinned to 16.4.4; Node runtime declared 24.x. Patched zod override removes the reported high advisory. npm audit --omit=dev reports 0 vulnerabilities; full dev audit still reports 16 moderate findings in lint tooling (legacy minimatch chain); no audit fix --force/downgrade was applied. Typecheck, 14 logic + 29 unit tests, lint (0 errors/3 pre-existing unused warnings) and .next-build production build PASS without the previous Next security reminder.

Server-only TERRALA_API_BYPASS_SECRET supports a protected BE Preview, refuses redirects and is not exposed to browser code. Vercel builds require HTTPS API/asset origins instead of quietly falling back to localhost. .env.example and .vercelignore contain no real credentials. Chrome on separate local Next 16.4.4 port 3006 renders product detail/catalog with the existing local API; Next MCP get_compilation_issues=[] and get_errors has no session/config errors. This is not a real Vercel Preview or hosted PostgreSQL test. Account/storage/DB provisioning is pending; source guide: ../terrarila-be/docs/VERCEL-PREVIEW.md.
