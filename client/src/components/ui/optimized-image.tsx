interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

// Utility function to get WebP source if available
const getWebPSource = (originalSrc: string): string | null => {
  // Convert PNG/JPG to WebP path
  if (originalSrc.match(/\.(png|jpe?g)$/i)) {
    return originalSrc.replace(/\.(png|jpe?g)$/i, '.webp');
  }
  return null;
};

export default function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  onLoad,
  onError
}: OptimizedImageProps) {
  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  // Check if browser supports WebP
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  const webpSrc = getWebPSource(src);
  const useWebP = webpSrc && supportsWebP();

  // If WebP is available and supported, use picture element with fallback
  if (useWebP) {
    return (
      <picture className={className}>
        <source 
          srcSet={webpSrc} 
          type="image/webp"
        />
        <img
          src={src}
          alt={alt}
          loading={loading}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          data-testid="img-optimized"
        />
      </picture>
    );
  }

  // Fallback to regular img tag
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      data-testid="img-optimized"
    />
  );
}