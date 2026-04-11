'use client'

import { DIALOG } from "../Dialog";
import { ReactNode } from "react";
import { TButtonVariant } from "../ui/button";
import { CredentialsLoginForm } from "./LoginCredentials";
import Divider from "../Divider";
import { usePathname } from "next/navigation";
 

/**
 * id - login-controller
 * Access modal by programmatically clicking the trigger via id [login-controller]
 * @returns A button to trigger google account selector.
 */
const LoginController = ({
  // text = "Sign In with Google",
  description,
  trigger,
  variant = "ghost",
  redirectTo,
}: {
  className?: string;
  redirectTo?: string;
  text?: string;
  trigger?: ReactNode;
  description?: ReactNode;
  variant?: TButtonVariant;
}) => {
  const  pathname   = usePathname();
  return (
    <DIALOG
      trigger={trigger}
      title={"Sign in to continue"}
      id="login-controller"
      variant={variant}
    >
      {/* <LoginBtn
        text={text}
        variant={"outline"}
        className=" w-full "
        redirectTo={getUrlToShare()}
        size={"lg"}
      >
        <FcGoogle size={24} />
      </LoginBtn> */}

 
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
