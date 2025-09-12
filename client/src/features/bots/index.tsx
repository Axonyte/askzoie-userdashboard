import { useState } from 'react'
import { BotConfigModal } from './components/BotConfigModal'
import { BotPersonasList } from './components/BotPersonasList'
import { BotPersona } from './types/botPersona'

export default function BotsPage() {
    const [selectedBot, setSelectedBot] = useState<BotPersona | null>(null)
    const [open, setOpen] = useState(false)

    return (
        <div className='p-6'>
            <h1 className='mb-4 text-2xl font-bold'>Available Bot Personas</h1>
            <BotPersonasList
                onSelect={(bot) => {
                    setSelectedBot(bot)
                    setOpen(true)
                }}
            />
            <BotConfigModal
                open={open}
                onClose={() => setOpen(false)}
                bot={selectedBot}
            />
        </div>
    )
}
