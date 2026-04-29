import { Suspense } from "react";
import AuthErrorClient from "./Client";

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorClient />
    </Suspense>
  );
}
