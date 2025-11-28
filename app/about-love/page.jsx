'use client';

import Image from 'next/image';

export default function AboutLovePage() {
  return (
    <div className="min-h-screen bg-white pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-6 tracking-wide">
            ABOUT LOVE
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 tracking-wide max-w-3xl mx-auto leading-relaxed">
            At Retro Louve, we believe fashion is more than just clothing—it's a form of self-expression, 
            a celebration of individuality, and a way to share love with the world.
          </p>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-64 sm:h-96 md:h-[500px] mb-12 sm:mb-16 overflow-hidden">
          <Image
            src="/images/new.webp"
            alt="About Retro Louve"
            fill
            className="object-cover"
          />
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 tracking-wide">
              OUR STORY
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
              <p>
                Retro Louve was born from a simple yet powerful idea: fashion should be accessible, 
                sustainable, and above all, a celebration of who you are. Founded with a passion for 
                creating timeless pieces that speak to the modern individual, we've grown into a brand 
                that values quality, authenticity, and the stories our customers tell through their style.
              </p>
              <p>
                Every piece in our collection is carefully curated to reflect our commitment to excellence. 
                We work with skilled artisans and use premium materials to ensure that each garment not only 
                looks great but feels great too. Our designs blend classic aesthetics with contemporary 
                sensibilities, creating a unique style that stands the test of time.
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 tracking-wide">
              OUR MISSION
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
              <p>
                Our mission is to empower individuals to express themselves authentically through fashion. 
                We believe that what you wear is a reflection of your inner self, and we're here to provide 
                you with pieces that help you shine.
              </p>
              <p>
                We're committed to sustainable practices, ethical manufacturing, and creating a positive 
                impact on both our community and the environment. Every decision we make is guided by our 
                core values: integrity, creativity, and love for what we do.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 tracking-wide">
              OUR VALUES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-brand"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 tracking-wide">LOVE</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We infuse love into every design, every stitch, and every interaction with our community.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-brand"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 tracking-wide">QUALITY</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We never compromise on quality, ensuring every piece meets our high standards of excellence.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-brand"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 tracking-wide">SUSTAINABILITY</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We're committed to sustainable practices that protect our planet for future generations.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center pt-8 sm:pt-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 tracking-wide">
              JOIN OUR JOURNEY
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Be part of a community that celebrates individuality, embraces sustainability, 
              and spreads love through fashion. Follow us on social media and stay connected 
              with our latest collections and stories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://instagram.com"
                className="px-6 py-3 text-brand border-2 border-brand text-xs sm:text-sm tracking-wider font-medium hover:bg-brand hover:text-white transition-colors duration-300"
              >
                FOLLOW US
              </a>
              <a
                href="/contact"
                className="px-6 py-3 bg-brand text-white text-xs sm:text-sm tracking-wider font-medium hover:bg-brand/90 transition-colors duration-300"
              >
                GET IN TOUCH
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

