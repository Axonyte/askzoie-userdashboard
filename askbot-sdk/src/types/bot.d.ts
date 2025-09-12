export interface KnowledgeSources {
    docs?: string[];
    links?: string[];
}

// BotPersona Model
export interface BotPersona {
    id: string;
    name: string;
    description?: string | null;
    gender?: string | null; // e.g. "male", "female", "neutral"
    systemPrompt?: string | null;
    defaultTone?: string | null; // "formal", "casual"
    defaultDomain?: string | null; // "Technology", "Education"
    defaultGreeting?: string | null;
    defaultFallback?: string | null;
    avatarUrl?: string | null;
    language: string; // default: "en"
    createdAt: Date;
    updatedAt: Date;

    // Relations
    botProfiles?: BotProfile[];
    userId?: string | null;
}

// BotProfile Model
export interface BotProfile {
    id: string;
    userId: string;
    personaId: string;
    name?: string | null; // user-customized bot name
    customGreeting?: string | null;
    customFallback?: string | null;
    tone?: string | null;
    avatarUrl?: string | null;
    primaryLanguage?: string | null;
    allowedTopics: string[];
    blockedTopics: string[];
    responseLength?: ResponseLength; // default: "MEDIUM"
    knowledgeSources?: KnowledgeSources | null;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    persona?: BotPersona;
    user?: User; // aapko User type bhi define karna hoga
}

// Example User type (simplified)
export interface User {
    id: string;
    email: string;
    name?: string | null;
}
