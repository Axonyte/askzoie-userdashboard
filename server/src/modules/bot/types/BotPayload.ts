import { ResponseLength } from "generated/prisma";
import { JwtPayload } from "jsonwebtoken";

export interface TBotPayload extends JwtPayload {
    userId: string; // owner of the bot
    personaId: string; // base persona id
    profileId: string; // bot instance/profile id

    // Identity
    name?: string;
    avatarUrl?: string;

    // Greetings & fallback
    customGreeting?: string;
    customFallback?: string;

    // Style
    tone?: string; // override tone
    responseLength?: ResponseLength;
    primaryLanguage?: string;

    // Knowledge & topics
    allowedTopics?: string[];
    blockedTopics?: string[];
    knowledgeSources?: Record<string, any>;
}
