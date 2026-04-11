import { OverlayLoader } from "@/components/loaders/OverlayLoader";

const LoadingPage = () => {
  return (
    <div className="min-h-[50vh] w-full">
      <OverlayLoader />
    </div>
  );
};

export default LoadingPage;
