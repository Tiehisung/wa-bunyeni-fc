const PageLoader = ({
  showAvatar,
  className,
}: {
  showAvatar?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`container mx-auto col-span-2 w-full rounded-md bg-accent p-6 animate-pulse min-h-[70vh] ${className}`}
    >
      {/* Profile Image Placeholder */}
      {showAvatar && <div className="w-24 h-24 bg-card rounded-full mb-6" />}
      {/* Name Placeholder */}
      <div className="w-1/3 h-6 bg-card rounded mb-4" />
      {/* Headline Placeholder */}
      <div className="w-1/2 h-4 bg-card rounded mb-8" />
      {/* Section Title Placeholder */}
      <div className="w-1/4 h-5 bg-gray-300 rounded mb-4" />
      {/* Experience/Description Lines */}
      <div className="space-y-3 mb-8">
        <div className="w-full h-4 bg-card rounded" />
        <div className="w-full h-4 bg-card rounded ml-auto" />
        <div className="w-3/4 h-4 bg-card rounded" />
      </div>
      {/* Section Title Placeholder */}
      <div className="w-1/4 h-5 bg-gray-300 rounded mb-4" />
      {/* Education/Description Lines */}
      <div className="space-y-3 mb-8">
        <div className="w-full h-4 bg-card rounded" />
        <div className="w-3/4 h-4 bg-card rounded" />
      </div>
      {/* Section Title Placeholder */}
      <div className="w-1/4 h-5 bg-gray-300 rounded mb-4" />
      {/* Skills Placeholder */}
      <div className="space-y-3">
        <div className="w-full h-4 bg-card rounded ml-auto" />
        <div className="w-2/3 h-4 bg-card rounded" />
        <div className="w-3/4 h-4 bg-card rounded ml-auto" />
      </div>
    </div>
  );
};

export default PageLoader;
