 

interface CardLoaderProps {
  className?: string;
  message?: string;
}

/**
 * Responsive loader skeleton that shows an appropriate number
 * of boxes per screen size breakpoint.
 */
const CardLoader = ({ className, message }: CardLoaderProps) => {
  return (
    <div className="w-full _page">
      {message && <p className="font-light my-2">{message}</p>}
      <div className="flex flex-wrap gap-4 w-full justify-center py-4">
        {/* xs (mobile) - 2 loaders */}
        <div className="flex sm:hidden gap-3 w-full justify-center">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className={`w-36 h-5 bg-card rounded animate-pulse ${className}`}
            />
          ))}
        </div>

        {/* sm (tablet) - 4 loaders */}
        <div className="hidden sm:flex md:hidden gap-3 w-full justify-center">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-40 h-5 bg-card rounded animate-pulse ${className}`}
            />
          ))}
        </div>

        {/* md (small desktop) - 6 loaders */}
        <div className="hidden md:flex lg:hidden gap-3 w-full justify-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`w-44 h-5 bg-card rounded animate-pulse ${className}`}
            />
          ))}
        </div>

        {/* lg (large desktop) - 8 loaders */}
        <div className="hidden lg:flex xl:hidden gap-3 w-full justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`w-48 h-5 bg-card rounded animate-pulse ${className}`}
            />
          ))}
        </div>

        {/* xl+ (ultra-wide screens) - 10 loaders */}
        <div className="hidden xl:flex gap-3 w-full justify-center">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-52 h-5 bg-card rounded animate-pulse ${className}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardLoader;
