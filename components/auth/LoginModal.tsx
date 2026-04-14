"use client";

import { DIALOG } from "../Dialog";
import { ReactNode } from "react";
import { TButtonVariant } from "../ui/button";
import { CredentialsLoginForm } from "./LoginCredentials";
import Divider from "../Divider";
import { usePathname } from "next/navigation";
import { GoogleLoginBtn } from "./GoogleLoginBtn";

interface Props {
  className?: string;
  redirectTo?: string;
  trigger?: ReactNode;
  description?: ReactNode;
  variant?: TButtonVariant;
}

/**
 * id - login-controller
 * Access modal by programmatically clicking the trigger via id [login-controller]
 * @returns A button to trigger google account selector.
 */
const LoginController = ({
  description,
  trigger,
  variant = "ghost",
  redirectTo,
}: Props) => {
  const pathname = usePathname();
  return (
    <DIALOG
      trigger={trigger}
      title={"Sign in to continue"}
      id="login-controller"
      variant={variant}
    >
      <GoogleLoginBtn className="w-full" />

      <Divider className="px-4 my-4" />

      <CredentialsLoginForm
        redirectTo={redirectTo || (pathname !== "/" ? pathname : "")}
      />

      {description && (
        <div>
          <Divider content=">>" className="px-4 my-4" />

          <div>{description}</div>
        </div>
      )}
    </DIALOG>
  );
};

export default LoginController;
