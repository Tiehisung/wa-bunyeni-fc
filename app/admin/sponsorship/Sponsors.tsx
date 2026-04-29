 
import { AddNewSponsor } from "./AddSponsor";
import { staticImages } from "@/assets/images";
import { IQueryResponse } from "@/types";
import { shortText } from "@/lib";
import Header from "../../../components/Element";
import { ISponsorProps } from "@/app/sponsorship/page";
import Link from "next/link";
 
 

const AdminSponsors = ({
  sponsors,
}: {
  sponsors?: IQueryResponse<ISponsorProps[]>;
}) => {
  return (
    <div>
      <Header title="Sponsorships" subtitle="Donate to support KonFC" />

      <ul className="grid grid-cols-3 sm:flex flex-wrap max-full my-8">
        {sponsors?.data?.map((sponsor) => (
          <li key={sponsor._id} className="flex">
            <Link
              href={`/admin/sponsorship/${sponsor._id}`}
              className="p-4 w-fit h-fit rounded-2xl hover:bg-slate-400/30 _slowTrans"
            >
              <img
                src={sponsor?.logo ?? staticImages.sponsor}
                alt={shortText(sponsor?.name, 10)}
                className="h-20 w-24 min-w-20 rounded-2xl object-cover bg-secondary"
              />
              <p className="max-w-24 line-clamp-1 _label text-center">
                {sponsor?.businessName}
              </p>
            </Link>
          </li>
        ))}

        <li className="flex _slowTrans">
          <AddNewSponsor sponsors={sponsors?.data} />
        </li>
      </ul>
    </div>
  );
};

export default AdminSponsors;
