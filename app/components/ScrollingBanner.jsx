export default function ScrollingBanner() {
  return (
    <div className="relative overflow-hidden bg-brand text-white py-2">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* First set of text */}
        <div className="flex items-center">
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex items-center">
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
          <span className="text-xs tracking-widest font-light mx-8">SHIPPING WORLDWIDE</span>
        </div>
      </div>
    </div>
  );
}