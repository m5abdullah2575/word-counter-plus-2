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

  // Optimized img tag with proper lazy loading and dimensions
  // Ready for future WebP/srcSet implementation when assets are converted
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

  /* TODO: Enable once .webp assets are available
  const webpSrc = getWebPSource(src);

  return (
    <picture className={className}>
      {webpSrc && (
        <source 
          srcSet={webpSrc} 
          type="image/webp" 
          sizes={sizes}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        data-testid="img-optimized"
      />
    </picture>
  );
  */
}