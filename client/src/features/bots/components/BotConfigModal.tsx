import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { BotPersona } from '../types/botPersona'
import { BotConfigForm } from './BotConfigForm'

interface BotConfigDialogProps {
    open: boolean
    onClose: () => void
    bot: BotPersona | null
}

export function BotConfigModal({ open, onClose, bot }: BotConfigDialogProps) {
    if (!bot) return null

    const defaultValues = {
        id: bot.id,
        personaId: bot.id,
        userId: '',
        name: bot.name,
        tone: bot.defaultTone,
        primaryLanguage: bot.language ?? 'en',
        allowedTopics: "",
        blockedTopics: "",
        responseLength: 'MEDIUM',
        // knowledgeSources: {}, // default empty
        customGreeting: bot.defaultGreeting,
        customFallback: bot.defaultFallback,
        avatarUrl: bot.avatarUrl ?? '',
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle>Configure {bot.name}</DialogTitle>
                </DialogHeader>
                <BotConfigForm
                    botId={bot.id}
                    botName={bot.name}
                    onClose={onClose}
                    defaultValues={defaultValues}
                />
            </DialogContent>
        </Dialog>
    )
}
