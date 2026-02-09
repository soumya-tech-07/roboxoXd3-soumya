'use client';

import Image from 'next/image';
import { useState } from 'react';

// A warm, neutral gray/stone color (approx #E5E5E5) commonly used in luxury placeholders
const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8/x8AAqMB0Fk+W34AAAAASUVORK5CYII=';

export default function LuxuryImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    fill,
    ...props
}) {
    const [isLoading, setIsLoading] = useState(true);

    // If using fill prop, don't wrap in a div (parent should handle sizing)
    if (fill) {
        return (
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes={sizes}
                className={`
                    object-cover
                    transition-all duration-700 ease-in-out
                    ${isLoading ? 'scale-110 blur-sm grayscale' : 'scale-100 blur-0 grayscale-0'}
                    ${className}
                `}
                onLoad={() => setIsLoading(false)}
                {...props}
            />
        );
    }

    // For width/height props, wrap in container
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes={sizes}
                className={`
                    object-cover w-full h-full
                    transition-all duration-700 ease-in-out
                    ${isLoading ? 'scale-110 blur-sm grayscale' : 'scale-100 blur-0 grayscale-0'}
                `}
                onLoad={() => setIsLoading(false)}
                {...props}
            />
        </div>
    );
}
