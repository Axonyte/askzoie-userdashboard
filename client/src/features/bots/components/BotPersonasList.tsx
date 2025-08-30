import { useQuery } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import { BotPersona } from '../types/botPersona'
import { BotCard } from './BotCard'

export function BotPersonasList({ onSelect }: { onSelect: (bot: BotPersona) => void }) {
    const { data, isLoading } = useQuery({
        queryKey: ['available-bots'],
        queryFn: async (): Promise<BotPersona[]> => {
            const res = await api.get('/bot/available-personas')
            return res.data
        },
    })

    if (isLoading) return <p>Loading bots...</p>

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {data?.map((bot) => (
                <BotCard
                    key={bot.id}
                    bot={bot}
                    onConfigure={() => onSelect(bot)}
                />
            ))}
        </div>
    )
}
