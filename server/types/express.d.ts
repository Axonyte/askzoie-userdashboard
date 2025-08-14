import { TUserPayload } from "src/modules/user/types/UserPayload";

declare global {
  namespace Express {
    interface Request {
      user?: TUserPayload;
    }
  }
}

export {}; 