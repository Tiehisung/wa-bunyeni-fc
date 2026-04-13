import { Goal, Footprints, Shield, Award, Users } from "lucide-react";

export const getPositionIcon = (position: string) => {
    switch (position?.toLowerCase()) {
      case "forward":
        return <Goal className="w-4 h-4" />;
      case "midfielder":
        return <Footprints className="w-4 h-4" />;
      case "defender":
        return <Shield className="w-4 h-4" />;
      case "goalkeeper":
        return <Award className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };