export type BotProfile = {
    id: string
    personaId: string
    name: string
    customGreeting: string
    customFallback: string
    tone: string
    avatarUrl: string
    primaryLanguage: string
    allowedTopics: string[]
    blockedTopics: string[]
    responseLength: 'SHORT' | 'MEDIUM' | 'DETAILED'
    // knowledgeSources: Record<string, any>
    createdAt: Date
    updatedAt: Date
    userId: string
}
