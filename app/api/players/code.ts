import dbConnect from "@/config/db.config";
import { getInitials } from "@/lib";
import PlayerModel from "@/models/player";

export async function generatePlayerCode(firstName: string, lastName: string) {
  await dbConnect();
  const initials = getInitials(`${firstName} ${lastName}`);

  const lastPlayer = await PlayerModel.findOne({
    code: new RegExp(`^${initials}\\d{3}$`, "i"),
  })
    .sort({ code: -1 })
    .lean();

  let nextNumber = 1;

  if (lastPlayer) {
    const currentNumber = parseInt(lastPlayer.code.slice(2), 10);

    nextNumber = currentNumber + 1;
  }

  return `${initials}${String(nextNumber).padStart(3, "0")}`;
}
