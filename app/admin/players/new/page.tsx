import { H } from "@/components/Element";
import PlayerProfileForm from "./NewSigningForms";

export default function AdminPlayerSignupPage() {
  return (
    <div className="">
      <div className="flex max-md:flex-wrap gap-2 md:gap-5 items-center p-4">
        <H>KonjiehiFC player signing</H>
      </div>

      <PlayerProfileForm />
    </div>
  );
}
