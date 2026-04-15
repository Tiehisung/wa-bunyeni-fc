"use client";

import { DIALOG } from "../Dialog";
import { LoginBtn } from "./Auth";
import { FcGoogle } from "react-icons/fc";
import Divider from "../Divider";
import { ReactNode } from "react";
import { TButtonVariant } from "../ui/button";
import { getUrlToShare } from "@/lib";
import { CredentialsLoginForm } from "@/app/auth/signin/Credentials";

/**
 * id - login-controller
 * Access modal by programmatically clicking the trigger via id [login-controller]
 * @returns A button to trigger google account selector.
 */
const LoginController2 = ({
  text = "Sign In with Google",
  description,
  trigger,
  variant = "ghost",
}: {
  className?: string;
  text?: string;
  trigger?: ReactNode;
  description?: ReactNode;
  variant?: TButtonVariant;
}) => {
  return (
    <DIALOG
      trigger={trigger}
      title={"Login to continue"}
      id="login-controller"
      variant={variant}
    >
      <LoginBtn
        text={text}
        variant={"outline"}
        className=" w-full "
        redirectTo={getUrlToShare()}
        size={"lg"}
      >
        <FcGoogle size={24} />
      </LoginBtn>

      <Divider />
      <CredentialsLoginForm />

      {description && (
        <div>
          <Divider  className="px-4 my-10" />

          <div>{description}</div>
        </div>
      )}
    </DIALOG>
  );
};

export default LoginController2;
 
