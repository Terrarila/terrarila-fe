import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/landing-sections";
import { RequestTracker } from "@/components/requests/request-tracker";
import styles from "@/components/shared/public-forms.module.css";
export const metadata: Metadata = { title: "Tra cứu yêu cầu · Petite Terre", robots: { index: false, follow: false }, referrer: "same-origin" };
export default async function TrackingPage({ searchParams }: { searchParams: Promise<{ ma?: string | string[] }> }) {
  const { ma } = await searchParams;
  const initialCode = typeof ma === "string" && ma.length <= 45 ? ma : "";
  return <><SiteHeader /><main className={styles.page}><div className={styles.content}>
    <p className={styles.eyebrow}>YÊU CẦU CỦA BẠN</p><h1>Theo dõi một góc xanh.</h1>
    <p className={styles.intro}>Nhập mã để xem trạng thái tiếp nhận và bể kính, vật liệu đã chọn. Trang tra cứu không hiển thị thông tin liên hệ cá nhân.</p>
    <RequestTracker initialCode={initialCode} /><div className={styles.links}><Link href="/lam-theo-yeu-cau">Tạo thiết kế mới →</Link><Link href="/gop-y">Góp ý trải nghiệm</Link></div>
  </div></main><SiteFooter /></>;
}
