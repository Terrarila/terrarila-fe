import { HeroSection } from "@/components/hero/hero-section";
import { HeroStageContent } from "@/components/hero/hero-stage-content";
import { SiteHeader } from "@/components/landing/site-header";
import { AboutTerralaSection, AvailableTerrariumsSection, CustomTerrariumSection, PortfolioSection, SiteFooter } from "@/components/landing/landing-sections";

// Published products and their images must reflect the current backend catalog.
export const dynamic = "force-dynamic";

export default function Home() {
  return <>
    <SiteHeader />
    <main id="top">
      <HeroSection><HeroStageContent /></HeroSection>
      <PortfolioSection />
      <AvailableTerrariumsSection />
      <CustomTerrariumSection />
      {/* <AboutTerralaSection /> */}
    </main>
    <SiteFooter />
  </>;
}
