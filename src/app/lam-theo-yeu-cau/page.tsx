import type { Metadata } from "next";
import { TerrariumBuilder } from "@/components/custom-terrarium/terrarium-builder";
import { DesignProvider } from "@/store/design-provider";
import { loadBuilderCatalog } from "@/lib/builder-catalog";
import { shopContacts } from "@/lib/shop-contacts";
export const metadata: Metadata = { title: "Thiết kế bể theo yêu cầu · Terralá", description: "Chọn bể kính, sỏi, đất, rêu và cây để tạo một khu vườn nhỏ mang dấu ấn của bạn." };
export default async function CustomTerrariumPage() {
  const catalog = await loadBuilderCatalog();
  return <DesignProvider catalog={catalog}><TerrariumBuilder contacts={shopContacts()} catalog={catalog} /></DesignProvider>;
}

// Never freeze an unavailable API response or runtime configuration at build time.
export const dynamic = "force-dynamic";
