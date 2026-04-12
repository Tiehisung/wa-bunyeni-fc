"use client";

import { ImageUploader } from "@/components/files/image-uploader";
import { useUpdateMatchMutation } from "@/services/match.endpoints";
import { IMatch } from "@/types/match.interface";

interface IProps {
  match?: IMatch;
}

const MatchFliers = ({ match }: IProps) => {
  const [updateMatch] = useUpdateMatchMutation();

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
