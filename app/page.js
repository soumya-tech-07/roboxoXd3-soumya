import Image from "next/image";
import Footer from "./components/Footer";
import ScrollingBanner from "./components/ScrollingBanner";
import ProductGrid from "./components/ProductCollection";
import LatestDrop from "./components/LatestDrop";
import AutoplayVideo from "./components/AutoplayVideo";
import Navbar from "./components/NavbarWithCustomGif";
import NavbarWithCustomGif from "./components/NavbarWithCustomGif";
import HomeBackgroundVideo from "./components/HomeBackgroundVideo";
import SplitHeroSection from "./components/SplitHeroSection";
import MensSection from "./components/MensSection";
import WomensSection from "./components/WomensSection";
import CurtainIntro from "./components/CurtainIntro";

// CRITICAL: Force dynamic rendering to prevent production caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <>
    <CurtainIntro />
    <HomeBackgroundVideo/>
    <div className="relative z-10">
      <LatestDrop/>
      {/* <SplitHeroSection/> */}
      <WomensSection/>
      <MensSection/>
      <AutoplayVideo/>
      {/* <ProductGrid/> */}
      {/* <ScrollingBanner/> */}
    </div>
    </>
  );
}
