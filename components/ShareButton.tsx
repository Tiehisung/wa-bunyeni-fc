"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { shortenUrlWithBitly } from "@/lib/url";
import { Button } from "./buttons/Button";

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
    <Button
      onClick={handleShare}
      size={'lg'}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}

export default function CopyShortButton({ originalUrl }: { originalUrl: string }) {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    if (shortUrl) {
      // If already shortened, just copy to clipboard
      navigator.clipboard.writeText(shortUrl);
      alert("Link copied to clipboard!");
      return;
    }

    setIsLoading(true);
    const shortened = await shortenUrlWithBitly(originalUrl);
    setShortUrl(shortened);
    setIsLoading(false);

    // Copy the newly created short link
    navigator.clipboard.writeText(shortened);
    alert(`Link shortened and copied: ${shortened}`);
  };

  return (
    <button onClick={handleShare} disabled={isLoading}>
      {isLoading ? "Shortening..." : shortUrl ? "Copy Short Link" : "Share"}
    </button>
  );
}
