import Image from "next/image";
import { staticImages } from "../../assets/images";
const AppLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-card flex flex-col items-center justify-center ">
      <Image
        src={staticImages.ballOnGrass}
        alt="logo"
        className="h-12 sm:h-16 animate-pulse"
        width={200}
        height={200}
      />
    </div>
  );
};

export default AppLoader;
