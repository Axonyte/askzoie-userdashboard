import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { AssistantForm } from '@/features/bots/components/AssistantConfigForm'

// This matches the UserBot type from your AssistantDetails component
type UserBot = {
    id: string
    userId: string
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
    knowledgeSources: any
    createdAt: string
    updatedAt: string
    persona: {
        id: string
        name: string
        description: string
        gender: string
        systemPrompt: string
        defaultTone: string
        defaultDomain: string
        defaultGreeting: string
        defaultFallback: string
        avatarUrl: string
        language: string
        createdAt: string
        updatedAt: string
        userId: string | null
    }
}

interface BotConfigModalProps {
    open: boolean
    onClose: () => void
    bot: UserBot | null
}

export function EditAssistantModal({
    open,
    onClose,
    bot,
}: BotConfigModalProps) {
    if (!bot) return null

    const defaultValues = {
        id: bot.id,
        personaId: bot.personaId,
        userId: bot.userId,
        name: bot.name,
        tone: bot.tone,
        primaryLanguage: bot.primaryLanguage,
        allowedTopics: bot.allowedTopics.join(', '), // Convert array to comma-separated string
        blockedTopics: bot.blockedTopics.join(', '), // Convert array to comma-separated string
        responseLength: bot.responseLength,
        knowledgeSources: bot.knowledgeSources || {},
        customGreeting: bot.customGreeting,
        customFallback: bot.customFallback,
        avatarUrl: bot.avatarUrl,
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Configure {bot.name}</DialogTitle>
                </DialogHeader>
                <AssistantForm
                    botId={bot.id}
                    botName={bot.name}
                    onClose={onClose}
                    defaultValues={{ ...defaultValues, profileId: bot.id }}
                />
            </DialogContent>
        </Dialog>
    )
}
