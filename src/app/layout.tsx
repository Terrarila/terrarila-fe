import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  src: [{ path: "./fonts/be-vietnam-pro-400.ttf", weight: "400" }, { path: "./fonts/be-vietnam-pro-500.ttf", weight: "500" }],
  variable: "--font-sans", display: "swap",
});
const serif = localFont({
  src: [{ path: "./fonts/lora-400.ttf", weight: "400" }, { path: "./fonts/lora-500.ttf", weight: "500" }],
  variable: "--font-serif", display: "swap",
});

export const metadata: Metadata = {
  title: "Terralá · Một khu rừng thành hình",
  description: "Từng lớp sỏi, đất, rêu và lá hồng tạo nên một góc rừng nhỏ trong bể kính terralá.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
