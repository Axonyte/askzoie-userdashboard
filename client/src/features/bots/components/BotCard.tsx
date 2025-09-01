import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageSignedUrlInjector from '@/components/signed-url-injector'

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
                    <ImageSignedUrlInjector fileUrl={bot.avatarUrl}>
                        <img
                            src=''
                            alt={bot.name}
                            className='mx-auto h-16 w-16 rounded-full'
                        />
                    </ImageSignedUrlInjector>
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
