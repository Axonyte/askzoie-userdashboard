import { TBotPayload } from "src/modules/bot/types/BotPayload";
import { TUserPayload } from "src/modules/user/types/UserPayload";

declare global {
  namespace Express {
    interface Request {
      user?: TUserPayload;
      botProfile?: TBotPayload;
    }
  }
}

export {}; 