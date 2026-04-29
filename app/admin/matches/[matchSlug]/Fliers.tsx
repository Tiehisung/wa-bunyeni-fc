"use client";

import ImageUploader from "@/components/files/ImageUploader";
import { useUpdateMatchMutation } from "@/services/match.endpoints";
import { IMatch } from "@/types/match.interface";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface IProps {
  match?: IMatch;
}

const MatchFliers = ({ match }: IProps) => {
  const [updateMatch] = useUpdateMatchMutation();

  const pathname = usePathname();

  if (!pathname.startsWith("/admin"))
    return (
      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <section>
          <h1 className="text-center">FIXTURE FLIER</h1>

          <div className="h-72 w-80">
            <Image
              width={400}
              height={400}
              src={match?.fixtureFlier as string}
              alt="fix flier"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section>
          <h1 className="text-center">RESULT FLIER</h1>

          <div className="h-72 w-80">
            {match?.resultFlier ? (
              <Image
                width={400}
                height={400}
                src={match?.resultFlier as string}
                alt="result flier"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="p-5 text-center">Not available</p>
            )}
          </div>
        </section>
      </div>
    );

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <ImageUploader
        onUpload={(url) =>
          updateMatch({ _id: match?._id as string, fixtureFlier: url })
        }
        folder="/fliers"
        initialImage={match?.fixtureFlier}
        aspectRatio="square"
        maxSize={5}
        label="FIXTURE FLIER"
      />

      <ImageUploader
        onUpload={(url) =>
          updateMatch({ _id: match?._id as string, resultFlier: url })
        }
        folder="/fliers"
        initialImage={match?.resultFlier}
        aspectRatio="square"
        maxSize={5}
        label="RESULT FLIER"
      />
    </div>
  );
};

export default MatchFliers;
