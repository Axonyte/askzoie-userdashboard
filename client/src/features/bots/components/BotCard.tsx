import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BotCardProps {
    bot: {
        id: string
        name: string
        avatarUrl: string | null
        description: string | null
    }
    onConfigure: (botId: string) => void
}

export function BotCard({ bot, onConfigure }: BotCardProps) {
    return (
        <Card className='flex flex-col items-center rounded-2xl p-4 text-center shadow-md'>
            <CardHeader>
                {bot.avatarUrl ? (
                    <img
                        src={bot.avatarUrl}
                        alt={bot.name}
                        className='mx-auto h-16 w-16 rounded-full'
                    />
                ) : (
                    <div className='mx-auto h-16 w-16 rounded-full bg-gray-200' />
                )}
                <CardTitle className='mt-2 text-lg font-semibold'>
                    {bot.name}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-gray-600'>{bot.description}</p>
                <Button
                    className='mt-3 w-full'
                    onClick={() => onConfigure(bot.id)}
                >
                    Configure
                </Button>
            </CardContent>
        </Card>
    )
}
