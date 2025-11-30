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

export default function Home() {
  return (
    <>
    <HomeBackgroundVideo/>
    <div className="relative z-10">
      <LatestDrop/>
      {/* <SplitHeroSection/> */}
      <MensSection/>
      <WomensSection/>
      <AutoplayVideo/>
      <ProductGrid/>
      <ScrollingBanner/>
    </div>
    </>
  );
}

// updated for pushing