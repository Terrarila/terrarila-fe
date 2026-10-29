import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { backend } from "@/lib/terrala-api";
import { ContactAction, ModalAction } from "./landing-actions";
import styles from "./landing-sections.module.css";

// All section content stays on the server. Only dialog triggers need client JS.
const contacts = {
  Messenger: process.env.TERRALA_MESSENGER_URL,
  Zalo: process.env.TERRALA_ZALO_URL,
};
const collectionImage = "/assets/products/attempt-1.jpg";
const storyImage = "/assets/landing/botanical-story.png";
const storyText = "Petite Terre bắt đầu từ mong muốn mang một khoảng thiên nhiên vào những không gian thường ngày. Mỗi bể là một lần sắp đặt, quan sát và chăm chút — từ lớp đất đầu tiên đến chiếc lá nhỏ nhất.";

type TerrariumItem = { name: string; description: string; column: 0 | 1 | 2; price?: string; imageUrl?: string | null; imageAlt?: string; highlightImageUrl?: string | null };
const portfolio: TerrariumItem[] = [
  { name: "Rừng sau mưa", description: "RÊU · ĐÁ TỰ NHIÊN", column: 0 },
  { name: "Một khoảng xanh", description: "DƯƠNG XỈ · BỂ TRỤ", column: 1 },
  { name: "Triền đá yên", description: "BỐ CỤC ĐÁ · BỂ ĐA GIÁC", column: 2 },
];
type Product = { id: string; name: string; description: string; images: { url: string; alt: string }[]; highlightImageUrl: string | null; priceVnd: number | null };
async function loadProducts() {
  const products: Product[] = [];
  const cursors = new Set<string>();
  let cursor: string | null = null;
  do {
    const page: { items: Product[]; nextCursor: string | null } = await backend(`/v1/products?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
    products.push(...page.items);
    cursor = page.nextCursor;
    if (cursor && cursors.has(cursor)) throw new Error("Repeated product cursor");
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return products.map((product): TerrariumItem => ({
    name: product.name,
    description: product.description,
    column: 0,
    price: product.priceVnd === null ? "Shop xác nhận giá" : `${new Intl.NumberFormat("vi-VN").format(product.priceVnd)} ₫`,
    imageUrl: product.images[0]?.url ?? null,
    imageAlt: product.images[0]?.alt || product.name,
    highlightImageUrl: product.highlightImageUrl ?? null,
  }));
}
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
  const image = item.imageUrl === undefined ? collectionImage : item.imageUrl;
  const highlight = item.highlightImageUrl === undefined ? "/assets/products/attempt-1-highlight.png" : item.highlightImageUrl;
  return <article className={`${styles.card} ${item.price ? styles.productCard : styles.portfolioCard}`}>
    <div className={styles.cardImage}>
      {image ? <Image
        src={image}
        unoptimized={/^https?:\/\//.test(image)}
        loading="lazy"
        alt={item.imageAlt || `${item.name} — ${item.description.toLocaleLowerCase("vi")}`}
        width={1920}
        height={2560}
        className={styles.baseImage}
      /> : <p>Ảnh đang được cập nhật.</p>}
      {image && highlight ? <Image
        src={highlight}
        unoptimized={/^https?:\/\//.test(highlight)}
        loading="lazy"
        alt=""
        className={`${styles.hoverImage}`}
        sizes="(max-width: 760px) 80vw, 20vw"
        fill
      /> : null}
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
      <SectionHeading id="portfolio-title" eyebrow="NHỮNG BỂ ĐÃ LÀM" title={<>Mỗi bể,<br />một thế giới riêng.</>} description="Từ một góc rừng phủ rêu đến một triền đá nhỏ — xem những bố cục đã được Petite Terre chăm chút." split />
      <TerrariumGrid items={portfolio} />
      <ModalAction label="Xem tất cả bể đã làm →" title="Những bể đã làm">
        <TerrariumGrid items={portfolio} gallery />
      </ModalAction>
    </div>
  </section>;
}

export async function AvailableTerrariumsSection() {
  let products: TerrariumItem[] = [];
  let failed = false;
  try { products = await loadProducts(); } catch { failed = true; }
  return <section id="collection" className={`${styles.section} ${styles.collection}`} aria-labelledby="collection-title">
    <div className={`container ${styles.sectionContent}`}>
      <SectionHeading id="collection-title" eyebrow="BỂ CÓ SẴN" title={<>Chọn một góc xanh<br />để mang về.</>} description="Thích một bể? Nhắn shop qua Messenger hoặc Zalo để đặt mua." />
      {products.length ? <TerrariumGrid items={products.slice(0, 4)} /> : <p>{failed ? "Chưa tải được bộ sưu tập. Vui lòng thử lại sau." : "Shop đang cập nhật các bể có sẵn."}</p>}
      {products.length ? <ModalAction label="Xem bộ sưu tập có sẵn →" title="Bộ sưu tập có sẵn" variant="forest">
        <TerrariumGrid items={products} gallery />
      </ModalAction> : null}
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
        <Link className={`${styles.action} ${styles.outline}`} href="/about-us">Câu chuyện của Petite Terre →</Link>
      </div>
    </div>
  </section>;
}

export function SiteFooter() {
  return <footer id="contact" className={styles.footer}>
    <div className={`container ${styles.sectionContent}`}>
      <div className={styles.footerMain}>
        <div className={styles.footerBrand}>
          <a href="#top" aria-label="Petite Terre — về đầu trang">
            <span className={styles.brandLeaf}>
              {/* SVG root dimensions are preserved; only its wrapper is rotated. */}
              <Image src="/assets/landing/brand-leaf.svg" alt="" width={14} height={23} />
            </span>
            <span>Petite Terre</span>
          </a>
          <p>Terrarium Studio</p>
        </div>
        <div className={styles.footerContact}>
          <h2>Cùng tìm một góc xanh cho bạn.</h2>
          <ContactActions light />
          <p>Hiện nhận giao trong TP. Hồ Chí Minh.</p>
        </div>
      </div>
      <p className={styles.copyright}>© Petite Terre&nbsp;&nbsp; · &nbsp;&nbsp;Terrarium thủ công&nbsp;&nbsp; · &nbsp;&nbsp;Chăm sóc &amp; hướng dẫn</p>
    </div>
  </footer>;
}
