import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContactAction, ModalAction } from "./landing-actions";
import styles from "./landing-sections.module.css";

// All section content stays on the server. Only dialog triggers need client JS.
const contacts = {
  Messenger: process.env.TERRALA_MESSENGER_URL,
  Zalo: process.env.TERRALA_ZALO_URL,
};
const collectionImage = "/assets/products/attempt-1.jpg";
const storyImage = "/assets/landing/botanical-story.png";
const storyText = "Terralá bắt đầu từ mong muốn mang một khoảng thiên nhiên vào những không gian thường ngày. Mỗi bể là một lần sắp đặt, quan sát và chăm chút — từ lớp đất đầu tiên đến chiếc lá nhỏ nhất.";

type TerrariumItem = { name: string; description: string; column: 0 | 1 | 2; price?: string };
const portfolio: TerrariumItem[] = [
  { name: "Rừng sau mưa", description: "RÊU · ĐÁ TỰ NHIÊN", column: 0 },
  { name: "Một khoảng xanh", description: "DƯƠNG XỈ · BỂ TRỤ", column: 1 },
  { name: "Triền đá yên", description: "BỐ CỤC ĐÁ · BỂ ĐA GIÁC", column: 2 },
];
const products: TerrariumItem[] = [
  { name: "Rêu nhỏ", description: "Bể tròn · Rêu & đá", price: "690.000đ", column: 0 },
  { name: "Rừng đứng", description: "Bể trụ · Dương xỉ", price: "890.000đ", column: 1 },
  { name: "Vườn lục giác", description: "Bể đa giác · Rêu & đá", price: "1.290.000đ", column: 2 },
];
const customSteps = [
  { title: "Chọn bể kính", description: "Kích thước và dáng bể bạn thích." },
  { title: "Thêm nét riêng", description: "Phong cách, cây và phụ kiện." },
  { title: "Xem giá & gửi đơn", description: "Điền thông tin, địa chỉ tại TP.HCM." },
  { title: "Xác nhận & cọc 50%", description: "Trao đổi với shop trước khi bắt đầu làm." },
];

function SectionHeading({ id, eyebrow, title, description, split = false }: {
  id: string; eyebrow: string; title: ReactNode; description?: ReactNode; split?: boolean;
}) {
  return <header className={styles.sectionHeading}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <div className={split ? styles.splitHeading : styles.stackedHeading}>
      <h2 id={id} className={styles.heading}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  </header>;
}

function ContactActions({ light = false, product }: { light?: boolean; product?: string }) {
  return <div className={styles.contactActions}>
    {(["Messenger", "Zalo"] as const).map((channel) => <ContactAction key={channel} channel={channel} href={contacts[channel]} product={product} variant={light ? "light" : channel === "Messenger" ? "forest" : "outline"} />)}
  </div>;
}

function TerrariumCard({ item }: { item: TerrariumItem }) {
  return <article className={`${styles.card} ${item.price ? styles.productCard : styles.portfolioCard}`}>
    <div className={styles.cardImage}>
      <Image
        src={collectionImage}
        loading="lazy"
        alt={`${item.name} — ${item.description.toLocaleLowerCase("vi")}`}
        width={1920}
        height={2560}
        className={styles.baseImage}
      />
      <Image
        src="/assets/products/attempt-1-highlight.png"
        loading="lazy"
        alt=""
        className={`${styles.hoverImage}`}
        sizes="(max-width: 760px) 80vw, 20vw"
        fill
      />
    </div>
    <div className={styles.cardTitle}>
      <h3>{item.name}</h3>
      {item.price ? <span className={styles.price}>{item.price}</span> : null}
    </div>
    <p className={styles.cardDescription}>{item.description}</p>
    {item.price ? <ContactActions product={item.name} /> : null}
  </article>;
}

function TerrariumGrid({ items, gallery = false }: { items: TerrariumItem[]; gallery?: boolean }) {
  return <div className={`${styles.cardGrid} ${gallery ? styles.gallery : ""}`}>
    {items.map((item) => <TerrariumCard key={item.name} item={item} />)}
  </div>;
}

function BotanicalStoryImage({ expanded = false }: { expanded?: boolean }) {
  return <div className={styles.storyImage}>
    <Image src={storyImage} alt="Bể kính với rêu xanh, dương xỉ và đá tự nhiên dưới ánh nắng" fill sizes={expanded ? "(max-width: 760px) 90vw, 1000px" : "(max-width: 760px) calc(100vw - 48px), 40vw"} />
  </div>;
}

export function PortfolioSection() {
  return <section id="portfolio" className={`${styles.section} ${styles.portfolio}`} aria-labelledby="portfolio-title">
    <div className={`container ${styles.sectionContent}`}>
      <SectionHeading id="portfolio-title" eyebrow="NHỮNG BỂ ĐÃ LÀM" title={<>Mỗi bể,<br />một thế giới riêng.</>} description="Từ một góc rừng phủ rêu đến một triền đá nhỏ — xem những bố cục đã được Terralá chăm chút." split />
      <TerrariumGrid items={portfolio} />
      <ModalAction label="Xem tất cả bể đã làm →" title="Những bể đã làm">
        <TerrariumGrid items={portfolio} gallery />
      </ModalAction>
    </div>
  </section>;
}

export function AvailableTerrariumsSection() {
  return <section id="collection" className={`${styles.section} ${styles.collection}`} aria-labelledby="collection-title">
    <div className={`container ${styles.sectionContent}`}>
      <SectionHeading id="collection-title" eyebrow="BỂ CÓ SẴN" title={<>Chọn một góc xanh<br />để mang về.</>} description="Thích một bể? Nhắn shop qua Messenger hoặc Zalo để đặt mua." />
      <TerrariumGrid items={products} />
      <ModalAction label="Xem bộ sưu tập có sẵn →" title="Bộ sưu tập có sẵn" variant="forest">
        <TerrariumGrid items={products} gallery />
      </ModalAction>
    </div>
  </section>;
}

export function CustomTerrariumSection() {
  return <section id="custom" className={`${styles.section} ${styles.custom}`} aria-labelledby="custom-title">
    <div className={`container ${styles.sectionContent}`}>
      <SectionHeading id="custom-title" eyebrow="THIẾT KẾ THEO Ý BẠN" title={<>Bể của bạn.<br />Câu chuyện của bạn.</>} description={<>Chọn bể, phong cách và những chi tiết bạn thích.<br />Xem giá bể trước khi gửi thông tin đặt hàng.</>} />
      <ol className={styles.customSteps}>
        {customSteps.map((step, index) => <li key={step.title}>
          <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>)}
      </ol>
      <Link className={`${styles.action} ${styles.clay}`} href="/lam-theo-yeu-cau">Bắt đầu tạo bể riêng →</Link>
    </div>
  </section>;
}

export function AboutTerralaSection() {
  return <section id="story" className={`${styles.section} ${styles.story}`} aria-labelledby="story-title">
    <div className={`container ${styles.sectionContent} ${styles.storyLayout}`}>
      <BotanicalStoryImage />
      <div className={styles.storyContent}>
        <SectionHeading id="story-title" eyebrow="MỘT DỰ ÁN NHỎ, TỪ TÌNH YÊU CÂY CỎ" title={<>Chậm một chút.<br />Xanh thêm một chút.</>} />
        <p className={styles.storyText}>{storyText}</p>
        <ModalAction label="Câu chuyện của Terralá →" title="Chậm một chút. Xanh thêm một chút.">
          <BotanicalStoryImage expanded />
          <p className={styles.dialogText}>{storyText}</p>
        </ModalAction>
      </div>
    </div>
  </section>;
}

export function SiteFooter() {
  return <footer id="contact" className={styles.footer}>
    <div className={`container ${styles.sectionContent}`}>
      <div className={styles.footerMain}>
        <div className={styles.footerBrand}>
          <a href="#top" aria-label="terralá — về đầu trang">
            <span className={styles.brandLeaf}>
              {/* SVG root dimensions are preserved; only its wrapper is rotated. */}
              <Image src="/assets/landing/brand-leaf.svg" alt="" width={14} height={23} />
            </span>
            <span>terralá</span>
          </a>
          <p>Một chiếc lá. Một thế giới nhỏ.</p>
        </div>
        <div className={styles.footerContact}>
          <h2>Cùng tìm một góc xanh cho bạn.</h2>
          <ContactActions light />
          <p>Hiện nhận giao trong TP. Hồ Chí Minh.</p>
        </div>
      </div>
      <p className={styles.copyright}>© Terralá&nbsp;&nbsp; · &nbsp;&nbsp;Terrarium thủ công&nbsp;&nbsp; · &nbsp;&nbsp;Chăm sóc &amp; hướng dẫn</p>
    </div>
  </footer>;
}
