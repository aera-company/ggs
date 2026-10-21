import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RefreshOnLoad } from "@/components/motion/RefreshOnLoad";
import { ColdOpen } from "@/components/scenes/ColdOpen";
import { Opportunity } from "@/components/scenes/Opportunity";
import { BusinessModel } from "@/components/scenes/BusinessModel";
import { Advantage } from "@/components/scenes/Advantage";
import { Scale } from "@/components/scenes/Scale";
import { Platform } from "@/components/scenes/Platform";
import { WhyClients } from "@/components/scenes/WhyClients";
import { GoToMarket } from "@/components/scenes/GoToMarket";
import { Pilot } from "@/components/scenes/Pilot";
import { Epilogue } from "@/components/scenes/Epilogue";

export default function Home() {
  return (
    <SmoothScroll>
      <RefreshOnLoad />
      <a href="#platform" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-paper focus:px-4 focus:py-2 focus:text-navy">
        Ir para a demonstração do portal
      </a>
      <Header />
      <main>
        <ColdOpen />
        <Opportunity />
        <BusinessModel />
        <Advantage />
        <Scale />
        <Platform />
        <WhyClients />
        <GoToMarket />
        <Pilot />
        <Epilogue />
      </main>
    </SmoothScroll>
  );
}
