export type BotMessage = {
    id: string
    message: string
    isBot: true
}

export type UserMessage = {
    id: string
    message: string
    isBot: false
}