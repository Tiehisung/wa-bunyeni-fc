// "use client";

// import { useState } from "react";

// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { IconInputWithLabel } from "@/components/input/Inputs";
// import { Button } from "@/components/buttons/Button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAuth } from "@/store/hooks/useAuth";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { smartToast } from "@/utils/toast";
// import { GoogleLoginBtn } from "./GoogleLoginBtn";
// import Divider from "../Divider";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export function CredentialsLoginForm({
//   redirectTo = "",
// }: {
//   redirectTo?: string;
// }) {
//   const router = useRouter();

//   const { signin, isLoading } = useAuth();
//   const [error, setError] = useState<string | null>(null);

//   const { control, handleSubmit } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginForm) => {
//     setError(null);

//     try {
//       const result = await signin(data);
//       smartToast(result);

//       const dashboardPath =
//         result?.user?.role == "player"
//           ? "/players/dashboard"
//           : result?.user?.role?.includes("admin")
//             ? "/admin"
//             : "";

//       if (result.success) {
//         router.replace(redirectTo || dashboardPath);
//       } else {
//         setError(result?.message as string);
//       }
//     } catch (error) {
//       smartToast({ error });
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-card rounded-lg shadow">
//       <h2 className="text-2xl font-semibold mb-7 text-center ">Sign in</h2>

//       {error && (
//         <Alert variant="destructive" className="mb-6">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       <GoogleLoginBtn className="w-full" />

//       <Divider className="px-4 my-4" />
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//         <Controller
//           control={control}
//           name="email"
//           render={({ field, fieldState }) => (
//             <IconInputWithLabel
//               label="Email"
//               type="email"
//               error={fieldState.error?.message}
//               {...field}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="password"
//           render={({ field, fieldState }) => (
//             <IconInputWithLabel
//               label="Password"
//               type="password"
//               error={fieldState.error?.message}
//               {...field}
//             />
//           )}
//         />

//         <Button
//           type="submit"
//           primaryText="Login"
//           waiting={isLoading}
//           className="w-full"
//         />
//       </form>

//       <p className="mt-4 text-center text-sm">
//         Don't have an account?{" "}
//         <Link href="/auth/register" className="text-primary hover:underline">
//           Register
//         </Link>
//       </p>
//     </div>
//   );
// }
