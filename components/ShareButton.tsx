// client/components/ShareButton.tsx
import { useState } from "react";
import { Share2, Check,   } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  shareUrl: string;
  title: string;
  text?: string;
}

export function ShareButton({ shareUrl, title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || `Check out this ${title} on Bunyeni FC!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied! Share it anywhere for a beautiful preview.");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
