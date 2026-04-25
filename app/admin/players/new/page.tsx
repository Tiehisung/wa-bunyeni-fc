import { H } from "@/components/Element";
import PlayerProfileForm from "./NewSigningForms";
import { TEAM } from "@/data/team";

export default function AdminPlayerSignupPage() {
  return (
    <div className="">
      <div className="flex max-md:flex-wrap gap-2 md:gap-5 items-center p-4 capitalize">
        <H>{TEAM.name} player signing</H>
      </div>

      <PlayerProfileForm />
    </div>
  );
}
