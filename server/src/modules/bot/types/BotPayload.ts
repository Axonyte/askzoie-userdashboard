import { JwtPayload } from "jsonwebtoken";

export interface TBotPayload extends JwtPayload {
    userId: string;
    bot: string;
    configId: string;
    colorScheme: string;
}
