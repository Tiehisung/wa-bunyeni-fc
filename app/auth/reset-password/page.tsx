import { Suspense } from "react";
import PasswordResetClient from "./Client";
import Loader from "@/components/loaders/Loader";

export default function PasswordResetPage() {
  return (
    <div className="flex items-center justify-center min-h-screen pt-20">
      <Suspense fallback={<Loader />}>
        <PasswordResetClient />
      </Suspense>
    </div>
  );
}
