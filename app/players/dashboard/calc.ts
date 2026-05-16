import { getAgeFromDOB } from "@/lib/timeAndDate";

export const getPlayerAgeCategory = (dob?: string, age?: number) => {
  const calc = (_age: number) => {
    if (_age < 13) return "U13";
    if (_age < 15) return "U15";
    if (_age < 17) return "U17";
    if (_age < 20) return "U20";
    else return "Senior";
  };

  const normalizedAge = age ? age : dob ? getAgeFromDOB(dob) : 15;

  return calc(normalizedAge);
};
