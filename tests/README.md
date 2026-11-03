# FE tests

Run from `terrarila-fe` after `npm ci`:

```sh
npm test                 # Existing logic tests + component tests, runs once
npm run test:unit        # Custom terrarium component tests only
npm run test:watch       # Component tests in watch mode
npm run test:logic       # Existing node:test suite
```

## Custom terrarium page (`/lam-theo-yeu-cau`)

`unit/terrarium-builder.test.tsx` renders the real builder with a real Redux store. It covers shape/size selection, required size before submission, unavailable options, API-driven moss limits, price display, presets, notes, reset, and catalog failure.

`unit/design-request-form.test.tsx` renders the real request form and mocks only the router and HTTP boundary. It covers size UUIDs in the payload, contact normalization, session-before-request ordering, missing size, session failure, HTTP errors, pending state, duplicate submission prevention, timeout retry with the same idempotency key, and a new key after contact changes.

`unit/builder-fixture.tsx` contains isolated API-shaped test data; its prices and rules do not configure the store's catalog. Each test gets a fresh Redux store, DOM and HTTP mock. No running BE or database is needed for the component suite.

Related logic tests remain in `design.test.ts`, `glass-sizes.test.ts`, `presets.test.ts` and `catalog.test.ts`, including Redux Persist restoration and catalog reconciliation. The full logic suite also reads the real GLB from the sibling `terrarila-be` checkout.

Vitest uses jsdom. These tests do not verify browser layout, image loading or the async server page's catalog fetch. Those require runtime/integration checks.


## Chi tiết sản phẩm (`/products/[slug]`)

`unit/product-details.test.tsx` kiểm tra nguồn link portfolio, encode slug, related available/exclude-current, gallery/highlight/ảnh thiếu, null giá và availability, nút liên hệ không nằm trong link card. `unit/product-route.test.tsx` kiểm tra missing product, API outage, metadata, related lỗi/rỗng và retry action. Các test route mock lớp catalog; browser smoke với backend local thật được ghi riêng trong VALIDATION.md.
