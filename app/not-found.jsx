import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <h1 
          className="text-9xl sm:text-[12rem] font-bold text-brand mb-4 sm:mb-6"
          style={{ fontFamily: 'Gliker, sans-serif' }}
        >
          404
        </h1>

        {/* Error Message */}
        <h2 
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 sm:mb-6"
          style={{ fontFamily: 'Gliker, sans-serif' }}
        >
          PAGE NOT FOUND
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 max-w-md mx-auto leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer uppercase"
          >
            GO TO HOME
          </Link>
          
        </div>

        
      </div>
    </div>
  );
}

