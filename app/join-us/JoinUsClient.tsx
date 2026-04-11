"use client";

import { icons } from "@/assets/icons/icons";
import { Button } from "@/components/buttons/Button";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
 

const JoinUs = () => {
  return (
    <div className="relative grow w-full -mt-40">
      <div
        className={`mx-auto w-fit form-control justify-center items-center  `}
      >
        <h2 className=""> Let&apos;s get you started.</h2>

        <p className="_small">
          Tell us how you would want to use our platform.
        </p>

        <div className="space-y-4 mt-10">
          {cards.map((card, i) => (
            <JoinUsRoleCard {...card} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

const cards: ICard[] = [
  {
    title: "I want to join as player",
    role: "player",
    icon: <icons.user size={24} />,
  },
  {
    title: "I want to join as fan",
    role: "fan",
    icon: <icons.smile size={24} />,
  },
];

export default JoinUs;

interface ICard {
  title: string;
  role: "player" | "fan";
  icon: ReactNode;
}

export const JoinUsRoleCard = ({ role, title, icon }: ICard) => {
  const router = useRouter();

  const className = ` ${role == "player" ? "bg-primary/15" : "bg-background"}`;

  const handleNavigate = () => {
    if (role == "fan") router.push("/fan");
    else if (role == "player") router.push("/player-signup");
  };

  return (
    <Button
      onClick={handleNavigate}
      className={`group flex gap-4 max-w-sm  pl-6 outline-2 outline-transparent focus:outline-primary hover:outline-primary select-none w-full ${className}`}
    >
      {icon}

      <div className="grow text-left">
        <h1 className="_subtitle">{title}</h1>
      </div>

      <icons.chevron
        size={40}
        className="text-primary backdrop-blur group-focus:bg-modalTransparent  p-2 rounded-full min-w-10 h-10 "
      />
    </Button>
  );
};
