"use client";

import { ImWhatsapp } from "react-icons/im";
import { PiTelegramLogoLight } from "react-icons/pi";
import { Button } from "./ui/button";
import { share, ShareOptions } from "@/lib/share";
import { ReactNode } from "react";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { ENV } from "@/lib/env";
import { BsTiktok, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";

interface IProps extends ShareOptions {
  isMini?: boolean;
  className?: string;
  wrapperStyles?: string;
  label?: ReactNode;
  onShare?: () => void;
}

export const SocialShare = ({
  text,
  title,
  url,
  files = [],
  isMini,
  className,
  wrapperStyles,
  label = "Share page",
  onShare,
}: IProps) => {
  return (
    <div className={`grid gap-2 ${wrapperStyles}`}>
      {!isMini && label && <h1 className="font-semibold">{label}</h1>}
      {Object.entries(socialMediaIcons).map(([platform]) => {
        return (
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 grow ${className}`}
            onClick={() => {
              share
                .toSocial(platform as keyof typeof socialMediaIcons, {
                  title,
                  text,
                  url: url,
                  files,
                })
                .then(({ success }) => {
                  if (success) onShare?.();
                });
            }}
            key={platform}
          >
            {socialMediaIcons[platform as keyof typeof socialMediaIcons].icon}
            {isMini ? "" : platform}
          </Button>
        );
      })}
    </div>
  );
};
export default SocialShare;

export const socialMediaIcons = {
  facebook: { icon: <FaFacebook />, alias: "fb" },
  whatsapp: { icon: <ImWhatsapp />, alias: "wa" },
  linkedin: { icon: <LiaLinkedin />, alias: "in" },
  telegram: { icon: <PiTelegramLogoLight />, alias: "tg" },
  twitter: { icon: <BsTwitter />, alias: "x" },
  // instagram: { icon: Instagram, alias: "ig" },
};

export const ResourceShare = ({
  text,
  title,
  url,
  files = [],
  className,
  onShare,
}: IProps) => {
  const socialLinks = [
    {
      platform: "whatsapp",
      icon: <ImWhatsapp />,
      color: "bg-Green",
      url: "",
    },
    {
      platform: "facebook",
      icon: <FaFacebook />,
      color: "bg-[#1877f2]",
      url: "",
    },
    {
      platform: "twitter",
      icon: <FaXTwitter />,
      color: "bg-[#000000]",
      url: "",
    },
    {
      platform: "telegram",
      icon: <PiTelegramLogoLight />,
      color: "bg-[#3390ec]",
      url: "",
    },
  ];
  return (
    <div className="flex gap-4 pt-2">
      {socialLinks.map((sl) => (
        <Button
          size="icon"
          className={cn(`gap-2 text-white ${sl.color} `, className)}
          onClick={() => {
            share
              .toSocial(
                sl.platform as
                  | "facebook"
                  | "whatsapp"
                  | "linkedin"
                  | "telegram"
                  | "twitter",
                {
                  title,
                  text,
                  url: url,
                  files,
                },
              )
              .then(({ success }) => {
                if (success) onShare?.();
              });
          }}
          key={sl.platform}
        >
          {sl.icon}
          {/* {isMini ? "" : sl.platform} */}
        </Button>
      ))}
    </div>
  );
};

export const SocialMediaHandles = ({
  className,
}: {
  url?: string;
  className?: string;
}) => {
  const socialLinks = [
    {
      platform: "whatsapp",
      icon: <ImWhatsapp />,
      color: "bg-Green",
      url: ENV.SOCIAL.WHATSAPP,
    },
    {
      platform: "facebook",
      icon: <FaFacebook />,
      color: "bg-[#1877f2]",
      url: ENV.SOCIAL.FACEBOOK,
    },
    {
      platform: "twitter",
      icon: <FaXTwitter />,
      color: "bg-[#000000]",
      url: ENV.SOCIAL.TWITTER,
    },
    {
      platform: "telegram",
      icon: <PiTelegramLogoLight />,
      color: "bg-[#3390ec]",
      url: ENV.SOCIAL.TELEGRAM,
    },
    {
      platform: "tiktok",
      icon: <BsTiktok />,
      color: "bg-purple-500",
      url: ENV.SOCIAL.TIKTOK,
    },
  ];
  return (
    <div className="flex gap-4 pt-2">
      {socialLinks.map((social) => {
        if (social.url)
          return (
            <a
              key={social.platform}
              href={social.url}
              className={cn(
                `w-10 h-10 text-white/80 rounded-full flex items-center justify-center hover:text-white transition-all ${social.color}`,
                className,
              )}
            >
              {social.icon}
            </a>
          );
      })}
    </div>
  );
};
