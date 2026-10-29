# Petite Terre · Một khu rừng thành hình

Landing page Next.js chuyển từ bản thử nghiệm `terrarium-motion`. Hero 3D và timeline theo scroll giữ nguyên; các section portfolio, bể có sẵn, custom, câu chuyện và footer triển khai theo file Figma tham chiếu của project. Có thêm trang thiết kế theo yêu cầu `/lam-theo-yeu-cau`, với preview ảnh bể và danh sách vật liệu tương tác. Chưa có checkout, backend hay dashboard.

## Chạy local

```bash
npm ci
npm run dev -- --port 3000
```

Cần chạy BE trước (port 4000) để tải ảnh/model. FE proxy `/assets/*` đến `TERRALA_ASSET_URL`, hoặc `TERRALA_API_URL`, mặc định `http://127.0.0.1:4000`. Đây phải là origin không có path. Đổi cấu hình thì restart Next. Production cũng cần proxy `/assets` hoặc CDN phù hợp. Chi tiết [MEDIA.md](../terrarila-be/docs/MEDIA.md).

Test animation đọc GLB thật trong repo BE ở folder liền kề; clone cả hai repo khi chạy test.

Mở http://127.0.0.1:3000. Node.js 22.18 đã được dùng để kiểm tra; Next.js yêu cầu Node >=20.9.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- --port 3000
```

Nếu muốn build trong khi dev server còn chạy, dùng thư mục output riêng:

```bash
TERRALA_BUILD_DIR=.next-build npm run build
TERRALA_BUILD_DIR=.next-build npm run start -- --port 3001
```

## Cấu trúc và luồng chạy

- `src/app/page.tsx`: Server Component; lắp ráp header, hero, các section nội dung và footer.
- `src/app/layout.tsx`: metadata, tiếng Việt và font Be Vietnam Pro/Lora lưu local.
- `src/app/globals.css`: import Tailwind, reset, palette gốc và class `.container` dùng chung: `max-width: 80%`, căn giữa bằng `margin-inline: auto`. Menu, hero, các section và footer dùng cùng container; section chỉ dùng padding dọc.
- `src/components/hero/hero.css`: CSS riêng của hero, bao gồm breakpoint và reduced motion; chiều ngang dùng container chung.
- `src/components/landing/site-header.tsx` và `site-header.module.css`: menu desktop căn giữa, drawer mobile bằng native dialog, header ẩn khi cuộn xuống/hiện khi cuộn lên. Dùng chung dữ liệu link và container 80%; scroll cập nhật DOM qua requestAnimationFrame, không cập nhật React state mỗi frame.
- `src/components/landing/landing-sections.tsx`: các section tĩnh, dữ liệu card và bước custom; dùng chung heading, card, grid, ảnh story và nhóm liên hệ.
- `src/components/landing/landing-actions.tsx`: Client Components nhỏ cho nút mở native dialog và link Messenger/Zalo; đóng bằng Escape, khôi phục focus về nút mở.
- `src/components/landing/landing-sections.module.css`: CSS riêng của các section mới, có nhóm shared, cards, sections, footer, dialogs và responsive. Palette được scope để không ảnh hưởng hero.
- `src/components/hero/hero-stage-content.tsx`: Tiêu đề và mô tả tiếng Việt theo từng giai đoạn render ở server. Timeline đổi phần đang hiển thị, không tải nội dung từ API.
- `src/components/hero/hero-section.tsx`: Client Component tạo timeline, bọc scene bằng error boundary và `dynamic(..., { ssr: false })`.
- `timeline.ts`: nguồn tiến trình duy nhất từ 0 đến 1. Scroll, thanh kéo, các giai đoạn và playback đều ghi vào đây.
- `use-hero-timeline.ts`: đọc scroll; đồng bộ scroll khi seek/phát; tạm dừng khi người dùng cuộn, tab bị ẩn hoặc hero ra ngoài viewport; giữ tiến trình khi resize.
- `hero-animation-controls.tsx`, `hero-animation-progress.tsx`: cập nhật DOM trực tiếp qua subscription. Không đưa tiến trình mỗi frame vào React state.
- `src/components/terrarium/terrarium-scene.tsx`: Canvas Fiber, camera, ánh sáng, environment Drei và trạng thái tải/WebGL. Chỉ dùng React state khi tải xong, lỗi hoặc đổi visibility.
- `terrarium-model.tsx`: tải GLB, clone node, áp material và sample animation bằng mixer.
- `assembly-animation.ts`: giữ track position/rotation gốc; đổi scale ẩn/hiện thành visibility rời rạc để vật liệu giữ kích thước khi rơi. Cho phép seek ngược sau frame cuối và bind lại sau cleanup của Strict Mode.
- `model-materials.ts`: clone material trước khi chỉnh để không làm thay đổi cache GLB; lá giữ texture/màu hồng, kính dùng MeshPhysicalMaterial nhẹ.
- `../terrarila-be/storage/assets/`: GLB nguyên bản và ảnh website; FE proxy `/assets` sang BE.
- `../terrarila-be/reference/fe-docs/`: ảnh chụp tài liệu/kiểm thử trước đây ở FE docs.
- `tests/`: kiểm tra timeline và animation trên geometry/node/track của GLB thật.
- `scripts/browser-check.py`: kiểm tra tương tác với `agent-browser` đã mở tại local URL; không phải dependency của website.

## Tọa độ, scale và kính

GLTFLoader đã chuyển model từ hệ Z-up của Blender sang Y-up. Node `Terrarium` trong GLB có scale `[0.1, 0.1, 0.1]`. Chỉ wrapper của model có scale `10` để bù đúng một lần. Không rotate thêm trục, không dùng auto-normalization/Bounds scale.

Clip `Terrarium assembly` dài 10 giây; nút phát chạy một lượt 12 giây theo bản thử nghiệm, còn scroll/slider sample trực tiếp toàn clip. Scale xuất từ Blender có nhiều keyframe `.001 → 1`; web dùng scale lớn nhất trên từng trục và gate visibility đúng thời điểm keyframe thay vì làm vật liệu lớn dần. Các hạt đất tạm thời vẫn ẩn trở lại theo track. File GLB không bị sửa.

Kính: metalness 0, roughness .08, opacity .14, clearcoat .35, depthWrite false, transmission 0. Environment được tạo local một lần ở 128px, không tải HDR bên ngoài. Chưa dùng refraction, post-processing hay shadow map. Canvas DPR từ 1 đến tối đa 1.5, render theo demand, chuyển `never` ngoài viewport. Reduced motion luôn hiển thị bể hoàn thiện và tắt điều khiển animation.

## Nguồn asset

Asset landing ở `../terrarila-be/storage/assets/landing/` được tải trực tiếp từ Figma. Một ảnh triptych được dùng chung cho sáu card với width 300% và offset 0%, -100%, -200% theo crop trong thiết kế; không tạo ba bản sao của ảnh. Ảnh story và SVG lá của logo footer cũng giữ nguyên nguồn Figma. Màu nền theo yêu cầu: portfolio forest `#203d32`, collection ivory `#f7f4ec`, custom sage `#dde4d5`, story ivory; footer forest như design.

Figma chưa có URL đích cho các CTA. Nút xem portfolio/collection và câu chuyện mở nội dung trong dialog ngay trên landing; nút custom mở lựa chọn liên hệ, chưa có form đặt hàng hoặc nhận cọc. Gắn địa chỉ shop chính thức qua hai biến môi trường server `TERRALA_MESSENGER_URL` và `TERRALA_ZALO_URL`. Khi chưa cấu hình, nút liên hệ hiển thị thông báo chờ cập nhật, không chuyển đến tài khoản giả. Giá và tên bể hiện là nội dung từ thiết kế, chưa kết nối tồn kho.

Các file tham khảo vẫn giữ nguyên tại:

```text
/Users/hungtran/.codex/.chatgpt-projects/g-p-6ac145a69a248191b198580e75ad32f5/terrarium-motion/
/Users/hungtran/.codex/.chatgpt-projects/g-p-6ac145a69a248191b198580e75ad32f5/blender-terrarium/terrarium-current.blend
```

GLB copy từ `terrarium-motion/assets/terrarium-current.glb`, dung lượng 36,947,092 byte (~35.24 MiB), SHA-256:

```text
ea3f0a68b83a2d9a4edd7a1d0559e058ebfe48f31d0749f319360068e5c02871
```

Không decimate, không export lại `.blend`. Font local kèm license OFL trong `src/app/fonts/`.

## Giới hạn hiện tại

Xem [VALIDATION.md](./VALIDATION.md) để biết các kiểm tra đã chạy. Model có 726 node, 719 mesh và khoảng 464,164 tam giác: tải và render trên điện thoại yếu/mạng chậm vẫn cần kiểm tra bằng thiết bị thật. Kính web ưu tiên thấy rõ cây; không bảo đảm giống render Blender hoặc có khúc xạ vật lý. Fallback dùng ảnh concept, không phải một frame render chính xác của model.

`npm audit --omit=dev` hiện không báo lỗi runtime. Full audit còn 5 cảnh báo high trong chuỗi dependency lint của `eslint-config-next` (braces/micromatch/fast-glob). Registry hiện trả braces 3.0.3 là latest; không chạy `audit fix --force` vì đề xuất downgrade eslint-config-next sang major 14. Đây là dependency dev, không được đưa vào client bundle.

## Thiết kế theo yêu cầu

- `src/app/lam-theo-yeu-cau/page.tsx`: route và metadata ở server; truyền link liên hệ đã cấu hình xuống builder.
- `src/components/custom-terrarium/terrarium-builder.tsx`: lựa chọn, 5 bước bể/sỏi/đất/rêu/cây, ghi chú, tóm tắt và sao chép. Sỏi, đất và cây hỗ trợ chọn nhiều loại; rêu giới hạn tối đa 3 loại. Chưa kết nối tồn kho hay tạo đơn hàng.
- `material-catalog.ts`: nguồn dữ liệu chung cho tên, ảnh và lựa chọn bể/vật liệu.
- `terrarium-illustration.tsx`: ảnh bể vuông/chữ nhật ngang và thumbnail PNG dùng chung cho option/danh sách vật liệu đã chọn. Không vẽ SVG hoặc ghép vật liệu vào ảnh; vật liệu đã chọn hiển thị dọc bên ngoài ảnh trong builder.
- `terrarium-builder.module.css`: desktop full width 60/40, preview sticky 100dvh; mobile preview sticky trên, các bước dưới. Không dùng `.container` và không tải Three.js trên route này.

Vật liệu là danh sách minh hoạ để review trải nghiệm. Cần cập nhật theo tồn kho thực tế trước khi dùng bán hàng. Bản thiết kế hiện ở state của trang, chưa lưu qua reload; nút sao chép giúp gửi nội dung cho shop. Link liên hệ chỉ hiện khi đã có `TERRALA_MESSENGER_URL` / `TERRALA_ZALO_URL`.

Section Bể có sẵn đọc sản phẩm published từ `/v1/products`, có ảnh chính từ `images[0]` và ảnh hover tùy chọn `highlightImageUrl`. Không dùng lại ảnh highlight cố định cho sản phẩm chưa cấu hình; portfolio giữ cách hiển thị hiện tại. Trang chủ render động để không đóng băng danh mục hoặc trạng thái lỗi API khi build.
