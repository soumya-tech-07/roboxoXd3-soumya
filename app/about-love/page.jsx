'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutLovePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Black Background */}
      <div className="bg-black min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh] justify-center flex items-center pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-wide">
              ABOUT LOVE
            </h1>
            <p className="text-base sm:text-lg text-gray-300 tracking-wide leading-relaxed">
              At Retro Louve, we believe fashion is more than just clothing—it&apos;s a form of self-expression, 
              a celebration of individuality, and a way to share love with the world.
            </p>
          </div>
        </div>
      </div>      

      {/* Story Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-wide">
              OUR STORY
            </h2>
            <div className="w-20 h-1 bg-brand mx-auto"></div>
          </div>
          <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            <p className="text-lg sm:text-xl text-gray-900 font-medium">
              Retro Louve was born from a simple yet powerful idea: fashion should be accessible, 
              sustainable, and above all, a celebration of who you are.
            </p>
            <p>
              Founded with a passion for creating timeless pieces that speak to the modern individual, 
              we&apos;ve grown into a brand that values quality, authenticity, and the stories our customers 
              tell through their style. Every piece in our collection is carefully curated to reflect 
              our commitment to excellence.
            </p>
            <p>
              We work with skilled artisans and use premium materials to ensure that each garment not only 
              looks great but feels great too. Our designs blend classic aesthetics with contemporary 
              sensibilities, creating a unique style that stands the test of time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section with Image */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-square overflow-hidden bg-gray-200">
              <Image
                src="/images/new.webp"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-wide">
                OUR MISSION
              </h2>
              <div className="w-20 h-1 bg-brand mb-6"></div>
              <div className="space-y-5 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  Our mission is to empower individuals to express themselves authentically through fashion. 
                  We believe that what you wear is a reflection of your inner self, and we&apos;re here to provide 
                  you with pieces that help you shine.
                </p>
                <p>
                  We&apos;re committed to sustainable practices, ethical manufacturing, and creating a positive 
                  impact on both our community and the environment. Every decision we make is guided by our 
                  core values: integrity, creativity, and love for what we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-wide">
              OUR VALUES
            </h2>
            <div className="w-20 h-1 bg-brand mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Love */}
            <div className="group text-center p-8 bg-gray-50 hover:bg-brand transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300">
                <svg
                  className="w-10 h-10 text-brand group-hover:text-white transition-colors"
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
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 tracking-wide transition-colors">
                LOVE
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors">
                We infuse love into every design, every stitch, and every interaction with our community. 
                It&apos;s the heart of everything we create.
              </p>
            </div>

            {/* Quality */}
            <div className="group text-center p-8 bg-gray-50 hover:bg-brand transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300">
                <svg
                  className="w-10 h-10 text-brand group-hover:text-white transition-colors"
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
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 tracking-wide transition-colors">
                QUALITY
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors">
                We never compromise on quality, ensuring every piece meets our high standards of excellence 
                and durability.
              </p>
            </div>

            {/* Sustainability */}
            <div className="group text-center p-8 bg-gray-50 hover:bg-brand transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300">
                <svg
                  className="w-10 h-10 text-brand group-hover:text-white transition-colors"
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
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 tracking-wide transition-colors">
                SUSTAINABILITY
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors">
                We&apos;re committed to sustainable practices that protect our planet for future generations 
                while maintaining style and quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-wide">
            JOIN OUR JOURNEY
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed">
            Be part of a community that celebrates individuality, embraces sustainability, 
            and spreads love through fashion. Follow us on social media and stay connected 
            with our latest collections and stories.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://instagram.com"
              className="px-8 py-3 text-white border-2 border-white text-sm tracking-wider font-medium hover:bg-white hover:text-black transition-all duration-300"
            >
              FOLLOW US
            </a>
            <Link
              href="/contact"
              className="px-8 py-3 bg-brand text-white text-sm tracking-wider font-medium hover:bg-brand/90 transition-colors duration-300"
            >
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
