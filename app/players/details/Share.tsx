// client/components/SharePlayerButton.tsx

import { getPlayerShareUrl } from "@/lib/seo";
import { Share2 } from "lucide-react";

export function SharePlayerButton({ player }: { player: any }) {
  const shareUrl = getPlayerShareUrl(player._id);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${player.firstName} ${player.lastName}`,
        text: `Check out ${player.firstName} ${player.lastName} from Bunyeni FC!`,
        url: shareUrl, // ← SHARE THIS URL!
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied! Share it anywhere for a beautiful preview.");
    }
  };

  return (
    <button onClick={handleShare} className="flex items-center gap-2">
      <Share2 size={20} />
      Share Player
    </button>
  );
}
