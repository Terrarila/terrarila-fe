import type { Metadata } from "next";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/landing-sections";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import styles from "@/components/shared/public-forms.module.css";
export const metadata: Metadata = { title: "Góp ý website · Petite Terre", description: "Chia sẻ ý kiến để Petite Terre cải thiện website và trải nghiệm của bạn." };
export default function FeedbackPage() {
  return <><SiteHeader /><main className={styles.page}><div className={styles.content}>
    <p className={styles.eyebrow}>LẮNG NGHE BẠN</p><h1>Một góp ý nhỏ,<br />một trải nghiệm tốt hơn.</h1>
    <p className={styles.intro}>Có điều gì chưa thuận tiện khi xem bể hoặc tạo thiết kế? Hãy chia sẻ để chúng mình chăm chút website tốt hơn.</p>
    <FeedbackForm />
  </div></main><SiteFooter /></>;
}
