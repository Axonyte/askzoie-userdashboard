import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    Loader2,
    Bot,
    Palette,
    Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface BotData {
    name: 'ZOIE' | 'JARVIS' | 'OPTIMUS'
    displayName: string
    description: string
    avatar: string
    color: string
    features: string[]
}

interface SaveBotRequest {
    name: 'ZOIE' | 'JARVIS' | 'OPTIMUS'
    theme: 'DARK' | 'LIGHT'
}

interface SaveBotResponse {
    botConfig: {
        id: string
        name: string
        theme: string
        description?: string
    }
    refreshToken: string
}

const botsData: BotData[] = [
    {
        name: 'ZOIE',
        displayName: 'Zoie',
        description:
            'Your creative AI companion. Perfect for content creation, brainstorming, and artistic projects.',
        avatar: '🎨',
        color: 'from-purple-500 to-pink-500',
        features: ['Creative Writing', 'Art Direction', 'Brainstorming'],
    },
    {
        name: 'JARVIS',
        displayName: 'Jarvis',
        description:
            'Your intelligent assistant. Ideal for productivity, analysis, and technical problem-solving.',
        avatar: '🤖',
        color: 'from-blue-500 to-cyan-500',
        features: ['Data Analysis', 'Code Review', 'Task Management'],
    },
    {
        name: 'OPTIMUS',
        displayName: 'Optimus',
        description:
            'Your optimization expert. Specialized in efficiency, automation, and strategic planning.',
        avatar: '⚡',
        color: 'from-orange-500 to-red-500',
        features: ['Process Optimization', 'Strategy Planning', 'Automation'],
    },
]

export default function BotsPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedThemes, setSelectedThemes] = useState<
        Record<string, 'DARK' | 'LIGHT'>
    >({
        ZOIE: 'DARK',
        JARVIS: 'DARK',
        OPTIMUS: 'DARK',
    })

    const currentBot = botsData[currentIndex]

    const saveBotMutation = useMutation({
        mutationFn: async (data: SaveBotRequest): Promise<SaveBotResponse> => {
            const response = await api.post('/bot/save', data)

            return response.data
        },
        onSuccess: (data, variables) => {
            // Copy refresh token to clipboard
            navigator.clipboard
                .writeText(data.refreshToken)
                .then(() => {
                    toast.success(
                        `${variables.name} token copied to clipboard!`,
                        {
                            description:
                                'You can now use this token to access your bot.',
                        }
                    )
                })
                .catch(() => {
                    // Fallback if clipboard API fails
                    toast.success(`${variables.name} configuration saved!`, {
                        description: `Token: ${data.refreshToken.substring(0, 20)}...`,
                    })
                })
        },
        onError: (error) => {
            toast.error('Failed to save bot configuration', {
                description: error.message || 'Please try again.',
            })
        },
    })

    const nextBot = () => {
        setCurrentIndex((prev) => (prev + 1) % botsData.length)
    }

    const prevBot = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + botsData.length) % botsData.length
        )
    }

    const handleCopyToken = () => {
        const data: SaveBotRequest = {
            name: currentBot.name,
            theme: selectedThemes[currentBot.name],
        }
        saveBotMutation.mutate(data)
    }

    const handleThemeChange = (theme: 'DARK' | 'LIGHT') => {
        setSelectedThemes((prev) => ({
            ...prev,
            [currentBot.name]: theme,
        }))
    }

    return (
        <div className='h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800'>
            <div className='mx-auto max-w-4xl'>
                {/* Header */}
                <div className='mb-8 text-center'>
                    <h1 className='mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-4xl font-bold text-transparent dark:from-slate-100 dark:to-slate-300'>
                        Choose Your AI Bot
                    </h1>
                    <p className='text-muted-foreground text-lg'>
                        Select and configure your perfect AI companion
                    </p>
                </div>

                {/* Carousel Container */}
                <div className='relative'>
                    {/* Navigation Buttons */}
                    <Button
                        variant='outline'
                        size='icon'
                        className='absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full shadow-lg'
                        onClick={prevBot}
                        disabled={saveBotMutation.isPending}
                    >
                        <ChevronLeft className='h-4 w-4' />
                    </Button>

                    <Button
                        variant='outline'
                        size='icon'
                        className='absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full shadow-lg'
                        onClick={nextBot}
                        disabled={saveBotMutation.isPending}
                    >
                        <ChevronRight className='h-4 w-4' />
                    </Button>

                    {/* Main Bot Card */}
                    <div className='mx-16'>
                        <Card className='mx-auto w-full max-w-2xl overflow-hidden border-0 shadow-2xl'>
                            {/* Bot Avatar & Header */}
                            <div
                                className={`h-32 bg-gradient-to-r ${currentBot.color} relative`}
                            >
                                <div className='absolute inset-0 bg-black/10' />
                                <div className='absolute bottom-4 left-6 flex items-end gap-4'>
                                    <div className='rounded-2xl bg-white/90 p-3 text-6xl shadow-lg'>
                                        {currentBot.avatar}
                                    </div>
                                    <div className='mb-2 text-white'>
                                        <h2 className='text-2xl font-bold'>
                                            {currentBot.displayName}
                                        </h2>
                                        <Badge
                                            variant='secondary'
                                            className='mt-1'
                                        >
                                            AI Assistant
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <CardHeader className='pb-4'>
                                <div className='flex h-16 items-center'>
                                    <CardDescription className='line-clamp-3 text-base leading-relaxed'>
                                        {currentBot.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className='min-h-[300px] space-y-6'>
                                {/* Features */}
                                <div>
                                    <h3 className='mb-3 flex items-center gap-2 font-semibold'>
                                        <Sparkles className='h-4 w-4' />
                                        Key Features
                                    </h3>
                                    <div className='flex h-16 flex-wrap content-start gap-2 w-[300px]'>
                                        {currentBot.features.map((feature) => (
                                            <Badge
                                                key={feature}
                                                variant='outline'
                                                className='h-fit text-sm'
                                            >
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Theme Selection */}
                                <div>
                                    <h3 className='mb-3 flex items-center gap-2 font-semibold'>
                                        <Palette className='h-4 w-4' />
                                        Theme Preference
                                    </h3>
                                    <Select
                                        value={selectedThemes[currentBot.name]}
                                        onValueChange={handleThemeChange}
                                        disabled={saveBotMutation.isPending}
                                    >
                                        <SelectTrigger className='w-48'>
                                            <SelectValue placeholder='Select theme' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='DARK'>
                                                🌙 Dark Theme
                                            </SelectItem>
                                            <SelectItem value='LIGHT'>
                                                ☀️ Light Theme
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Copy Token Button */}
                                <div className='border-t pt-4'>
                                    <Button
                                        onClick={handleCopyToken}
                                        disabled={saveBotMutation.isPending}
                                        className='h-12 w-full text-lg font-semibold'
                                        size='lg'
                                    >
                                        {saveBotMutation.isPending ? (
                                            <>
                                                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                                Generating Token...
                                            </>
                                        ) : (
                                            <>
                                                <Copy className='mr-2 h-5 w-5' />
                                                Copy Token
                                            </>
                                        )}
                                    </Button>
                                    <p className='text-muted-foreground mt-2 text-center text-xs'>
                                        This will generate and copy your bot
                                        access token
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Carousel Indicators */}
                    <div className='mt-6 flex justify-center gap-2'>
                        {botsData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                disabled={saveBotMutation.isPending}
                                className={`h-3 w-3 rounded-full transition-all ${
                                    index === currentIndex
                                        ? 'bg-primary scale-110'
                                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Bot Navigation Pills */}
                <div className='mt-8 flex justify-center gap-4'>
                    {botsData.map((bot, index) => (
                        <Button
                            key={bot.name}
                            variant={
                                index === currentIndex ? 'default' : 'outline'
                            }
                            onClick={() => setCurrentIndex(index)}
                            disabled={saveBotMutation.isPending}
                            className='flex items-center gap-2'
                        >
                            <span className='text-lg'>{bot.avatar}</span>
                            {bot.displayName}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}
