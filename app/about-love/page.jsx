"use client";

import Image from "next/image";

export default function AboutLovePage() {
  return (
    <div className="min-h-screen text-black pt-32 sm:pt-44 lg:pt-60 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header with line */}
        <div className="flex items-center gap-8 mb-12 sm:mb-16">
          <h3 className="text-xs sm:text-sm tracking-[0.3em] font-light whitespace-nowrap">
            2 0 2 6 E d i t i o n
          </h3>
          <div className="flex-1 h-px bg-black"></div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif mb-12 sm:mb-16 tracking-tight">
          About Louve.
        </h1>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Text Content */}
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-justify">
            <p>
              Retro Louve was born from a feeling, a quiet ache shared by so
              many of us. The longing for clothing that speaks to the soul, that
              mirrors the beauty we see on curated boards and distant runways
              yet remains just out of reach. For years, we watched the world
              dress with freedom and finesse, while here, those very pieces
              stayed confined to screens, suitcases, and imagination.
            </p>
            <p>So we created Retro Louve to rewrite that story.</p>
            <p>
              If you&apos;ve ever scrolled through Pinterest, travelled outside
              of India, or seen a stranger dressed in something so effortlessly
              chic that it made you stop and think, &quot;why can&apos;t I find
              this in India?&quot; Retro Louve is the answer you&apos;ve been
              searching for.
            </p>
            <p>
              Our purpose is rooted in a simple belief that clothing should feel
              luxurious the moment it touches your skin. Every piece we create
              is designed to evoke that quiet sense of indulgence, that gentle
              confidence that comes from wearing something so thoughtfully made.
              Quality and uniqueness lies at the core of our identity. To
              preserve rarity of each design, every garment is produced in
              limited quantities, ensuring that what you own feels personal,
              intimate, and truly yours.
            </p>
            <p>
              At Retro Louve, fabrics are chosen only after exploring hundreds
              of options. We pay attention not just to how a material looks, but
              to how it drapes, how it moves, how it reacts to your body and
              your environment. It matters to us how a fabric feels on the skin,
              how a seam lies against the waist, how a silhouette shapes itself
              around your form. Each thread, stitch, button, panel, and texture
              carries intention.
            </p>
            <p>
              Retro Louve is our love letter to those who crave beauty,
              intention, and individuality. A bridge between aspiration and
              reality. A place where your dream wardrobe can finally take shape
              — poetic, personal, and profoundly you.
            </p>

            <p className="font-light">
                Welcome to the world we built for you.
                <br/>
                Where fashion doesn&apos;t follow, it finds you.
              </p>
            

            {/* Bottom Text with line */}
            <div className="pt-8 space-y-2">
              <div className="w-full h-px bg-black mb-6"></div>
            
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative aspect-[3/4] lg:aspect-auto lg:min-h-[800px]">
            <Image
              src="/images/Aboutlouve.JPG"
              alt="Fashion runway"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
