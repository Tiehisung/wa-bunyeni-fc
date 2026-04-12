import avatar from "./avatar.png";
import manager from "./manager.jpeg";
import sponsor from "./sponsor.png";
import ronaldo from "./ronaldo.png";
import baloons from "./baloons.png";
import kickball from "./kickball.png";
import goal from "./goal.png";
import injury from "./injury.png";
import redCard from "./redcard.png";
import yellowCard from "./yellowcard.png";
import pitchH from "./pitch-horizontal.png";
import pitchV from "./pitch-vertical.png";
import tackling from "./tackling.png";
import team from "./team.png";
import ballOnGrass from "./ball-on-grass.png";
import ball from "./ball.png";
import cap from "./cap.png";
import cards from "./cards.png";
import goalkeeperGloves from "./goalkeeper-gloves.png";
import blueCurvy from "./bg/blue-curvy-bg.png";
import circleCheckMark from './circle-checkmark.png'
import error from './error.png'
import success from './success.png'
import { ENV } from "@/lib/env";

export const logos = {
  logoWhite:ENV.LOGO_URL,
  logoTrans: ENV.LOGO_NO_BG_URL,
  opponentLogoWhite:ENV.OPPONENT_LOGO_URL,
  opponentLogoTrans: ENV.OPPONENT_LOGO_NO_BG_URL,
}

export const staticImages = {
  error: error,
  success: success,
  circleCheckMark: circleCheckMark,
  blueCurvy: blueCurvy,
  avatar,
  sponsor,
  manager,
  ronaldo: ronaldo,
  baloons: baloons,
  kickball: kickball,
  goal,
  injury,
  redCard,
  yellowCard,
  pitchH,
  pitchV,
  tackling,
  team,
  ballOnGrass,
  cap,
  ball,
  cards,
  goalkeeperGloves,
  ...logos

};

