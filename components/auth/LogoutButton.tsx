// import { signIn, signOut } from "next-auth/react";
import { Button } from "../buttons/Button";
import { LogOut } from "lucide-react";
import { TButtonSize, TButtonVariant } from "../ui/button";
import { useAuth } from "@/store/hooks/useAuth";

interface IProps {
  className?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  text?: string;
  children?: React.ReactNode;
  redirectTo?: string;
  stayOnPage?: boolean;
}

export const LogoutBtn = ({
  className,
  size,
  variant = "outline",
  text = "",
  children,
}: IProps) => {
  const { logout, isLoading, user } = useAuth();

  if (!user) return null;

  return (
    <Button
      className={className}
      onClick={logout}
      variant={variant}
      size={size}
      waiting={isLoading}
      primaryText={text}
      waitingText=""
      title="Sign Out"
    >
      {children ?? <LogOut className="w-4 h-4 " />}
    </Button>
  );
};
