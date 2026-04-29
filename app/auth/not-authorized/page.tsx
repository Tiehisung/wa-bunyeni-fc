// app/not-authorized/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Optional: using shadcn/ui
import { ShieldOff, Home, AlertTriangle } from "lucide-react";
import { LoginBtn } from "@/components/auth/Auth";

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldOff className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          You don&apos;t have permission to access this page.
        </p>

        {/* Error Details (can be dynamic) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                Authorization Required
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                This resource requires specific permissions or authentication.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>

          <LoginBtn
            className="grow w-full"
            text="Sign In with Different Account"
            variant={"outline"}
          />

          {/* Support Link */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Need help accessing this resource?
            </p>
            <Link
              href="tel:+233559708485"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Error Code: <span className="font-mono">403</span> • Unauthorized
          Access
        </p>
      </div>
    </div>
  );
}
