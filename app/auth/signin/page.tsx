import { GoogleLoginBtn } from "@/components/auth/GoogleLoginBtn";
import { CredentialsLoginForm } from "../../../components/auth/LoginCredentials";
import Divider from "@/components/Divider";

const SigninPage = () => {
  return (
    <div>
      <GoogleLoginBtn className="w-full" />
      <Divider className="px-4 my-4" />
      <CredentialsLoginForm />
    </div>
  );
};

export default SigninPage;
