import { ISponsorProps } from "@/app/sponsorship/page";
import { staticImages } from "@/assets/images";
import { AVATAR } from "@/components/ui/avatar";
 
import { FaPhoneAlt } from "react-icons/fa";
import { MdLabelImportant } from "react-icons/md";

const AdminSponsorOverview = ({ sponsor }: { sponsor: ISponsorProps }) => {
  return (
    <div id="sponsor-info" className="relative w-full">
      <h1 className="_title _gradient text-center">Overview</h1>
      <div className="p-5 flex flex-col justify-center items-center gap-1.5 _card bg-accent/20 backdrop-blur-xs">
        <br />
        <AVATAR
          src={(sponsor?.logo as string) ?? staticImages.sponsor}
          alt={sponsor?.name ?? "sponsor"}
          className="w-40 h-auto m-1"
        />
        <div className="text-center">
          <p className="_heading">{sponsor?.name}</p>
          <p className="_subtitle flex items-center gap-4">
            <MdLabelImportant />
            {sponsor?.businessName}
          </p>
          <p className="_subtitle flex items-center gap-4">
            <FaPhoneAlt />
            {sponsor?.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSponsorOverview;
