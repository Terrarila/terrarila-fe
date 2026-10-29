import type { Metadata } from "next";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/landing-sections";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Petite Terre | Riêng một góc trời.",
  description: "Petite Terre bắt đầu từ tình yêu dành cho cây cỏ và mong muốn mang thiên nhiên đến gần hơn với cuộc sống hằng ngày.",
};

export default function AboutUsPage() {
  return <>
    <SiteHeader />
    <main id="top" className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Petite Terre | Terrarium Studio</h1>

        <section className={styles.section} aria-label="Về Petite Terre">
          <div className={styles.copy}>
            <p>Petite Terre bắt đầu từ tình yêu dành cho cây cỏ và mong muốn mang thiên nhiên đến gần hơn với cuộc sống hằng ngày.</p>
            <p>Chúng mình tạo nên những khu vườn thu nhỏ trong kính, để bạn có thể dành một góc cho thiên nhiên ngay trong căn nhà của mình. Đó có thể là trên bàn làm việc, một kệ tủ, hay bất kỳ nơi nào bạn muốn dừng lại một chút và tìm thấy sự bình yên.</p>
            <p>Mỗi chiếc terrarium được chúng mình làm thủ công, từ việc sắp đặt từng viên đá, phủ từng mảng rêu đến lựa chọn những loài cây phù hợp. Chúng mình mong rằng khi đến với bạn, vùng đất nhỏ ấy sẽ tiếp tục lớn lên và trở thành một phần thân thuộc trong không gian sống.</p>
          </div>
          <div className={styles.imageSpace} aria-hidden="true" />
        </section>

        <section className={`${styles.section} ${styles.reverse}`} aria-labelledby="terrarium-title">
          <div className={styles.imageSpace} aria-hidden="true" />
          <div className={styles.copy}>
            <h2 id="terrarium-title" className={styles.sectionTitle}>Terrarium là gì?</h2>
            <p>Terrarium là một khu vườn thực vật thu nhỏ trong vật chứa bằng kính, có thể kín hoặc mở tùy loại cây và cách thiết kế. Với terrarium kín, nước luân chuyển qua quá trình bốc hơi và ngưng tụ, giúp duy trì độ ẩm bên trong và giảm nhu cầu tưới.</p>
            <p>Tên gọi terrarium được ghép từ <em>terra</em> — đất, và hậu tố <em>-arium</em> — nơi chứa.</p>
          </div>
        </section>
      </div>
    </main>
    <SiteFooter />
  </>;
}
