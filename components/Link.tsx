 
import Link from "next/link";
import React from "react";
import { LiaAngleDoubleRightSolid } from "react-icons/lia";

interface PrimLinkProps {
  className?: string;
  text?: string;
  to: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const PrimLink: React.FC<PrimLinkProps> = ({
  className,
  to,
  icon,
  children,
  text,
}) => {
  return (
    <Link href={to} className={`_link flex items-center hover:text-primary w-fit ${className}`}>
      {children ?? text}
      <span>{icon || <LiaAngleDoubleRightSolid />}</span>
    </Link>
  );
};

export default PrimLink;
