import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import {
    Bot,
    Calendar,
    MessageSquare,
    Globe,
    FileText,
    Settings,
    User,
    Zap,
    Shield,
    Clock,
    Loader2,
    Edit,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import ImageSignedUrlInjector from '@/components/signed-url-injector'
import { ThemeSwitch } from '@/components/theme-switch'
import { EditAssistantModal } from './components/EditAssistantModal'

type BotPersona = {
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
    persona: BotPersona
}

interface BotDetailsProps {
    botId: string
}

function AssistantDetails({ botId }: BotDetailsProps) {
    const [open, setOpen] = useState(false)

    const {
        data: bot,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['user-bot', botId],
        queryFn: async (): Promise<UserBot> => {
            const res = await api.get(`/bot/user-bot/${botId}`)
            return res.data
        },
        enabled: !!botId,
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getResponseLengthColor = (length: string) => {
        switch (length) {
            case 'SHORT':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            case 'DETAILED':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center p-12'>
                <Loader2 className='text-muted-foreground mr-3 h-8 w-8 animate-spin' />
                <span className='text-muted-foreground'>
                    Loading bot details...
                </span>
            </div>
        )
    }

    if (error || !bot) {
        return (
            <div className='p-12 text-center'>
                <Bot className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
                <h3 className='mb-2 text-lg font-medium'>Bot Not Found</h3>
                <p className='text-muted-foreground'>
                    Unable to load bot details. Please try again.
                </p>
            </div>
        )
    }
    return (
        <>
            <Header>
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className='mx-auto max-w-4xl space-y-6 p-6'>
                    {/* Header */}
                    <div className='flex items-start justify-between'>
                        <div className='flex items-center space-x-4'>
                            <div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full'>
                                {bot.avatarUrl ? (
                                    <ImageSignedUrlInjector
                                        fileUrl={bot.avatarUrl}
                                    >
                                        <img
                                            src=''
                                            alt={bot.name || 'Assistant'}
                                            className='h-16 w-16 rounded-full object-cover'
                                        />
                                    </ImageSignedUrlInjector>
                                ) : (
                                    <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                                        <Bot className='text-primary h-16 w-16' />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold'>
                                    {bot.name}
                                </h1>
                                <p className='text-muted-foreground'>
                                    Based on {bot.persona.name}
                                </p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)}>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit Bot
                        </Button>
                    </div>

                    {/* Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center'>
                                <Settings className='mr-2 h-5 w-5' />
                                Configuration Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                <div className='space-y-2'>
                                    <div className='text-muted-foreground flex items-center text-sm'>
                                        <Zap className='mr-2 h-4 w-4' />
                                        Response Length
                                    </div>
                                    <Badge
                                        className={getResponseLengthColor(
                                            bot.responseLength
                                        )}
                                    >
                                        {bot.responseLength.toLowerCase()}
                                    </Badge>
                                </div>
                                <div className='space-y-2'>
                                    <div className='text-muted-foreground flex items-center text-sm'>
                                        <User className='mr-2 h-4 w-4' />
                                        Tone
                                    </div>
                                    <Badge variant='outline'>{bot.tone}</Badge>
                                </div>
                                <div className='space-y-2'>
                                    <div className='text-muted-foreground flex items-center text-sm'>
                                        <Globe className='mr-2 h-4 w-4' />
                                        Language
                                    </div>
                                    <Badge variant='outline'>
                                        {bot.primaryLanguage}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Custom Messages */}
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center text-lg'>
                                    <MessageSquare className='mr-2 h-5 w-5' />
                                    Custom Greeting
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='bg-muted rounded-md p-3 text-sm'>
                                    "{bot.customGreeting}"
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center text-lg'>
                                    <Shield className='mr-2 h-5 w-5' />
                                    Custom Fallback
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='bg-muted rounded-md p-3 text-sm'>
                                    "{bot.customFallback}"
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Topics */}
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        {bot.allowedTopics.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center text-lg'>
                                        <FileText className='mr-2 h-5 w-5 text-green-600' />
                                        Allowed Topics
                                    </CardTitle>
                                    <CardDescription>
                                        Topics this bot can discuss
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex flex-wrap gap-2'>
                                        {bot.allowedTopics.map(
                                            (topic, index) => (
                                                <Badge
                                                    key={index}
                                                    variant='secondary'
                                                    className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                >
                                                    {topic}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {bot.blockedTopics.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center text-lg'>
                                        <Shield className='mr-2 h-5 w-5 text-red-600' />
                                        Blocked Topics
                                    </CardTitle>
                                    <CardDescription>
                                        Topics this bot will avoid
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex flex-wrap gap-2'>
                                        {bot.blockedTopics.map(
                                            (topic, index) => (
                                                <Badge
                                                    key={index}
                                                    variant='destructive'
                                                >
                                                    {topic}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Persona Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center'>
                                <Bot className='mr-2 h-5 w-5' />
                                Base Persona: {bot.persona.name}
                            </CardTitle>
                            <CardDescription>
                                {bot.persona.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                                <div>
                                    <h4 className='mb-2 font-medium'>
                                        Default Greeting
                                    </h4>
                                    <p className='text-muted-foreground bg-muted rounded p-2 text-sm'>
                                        "{bot.persona.defaultGreeting}"
                                    </p>
                                </div>
                                <div>
                                    <h4 className='mb-2 font-medium'>
                                        Default Fallback
                                    </h4>
                                    <p className='text-muted-foreground bg-muted rounded p-2 text-sm'>
                                        "{bot.persona.defaultFallback}"
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h4 className='mb-2 font-medium'>
                                    System Prompt
                                </h4>
                                <p className='text-muted-foreground bg-muted rounded p-3 text-sm'>
                                    {bot.persona.systemPrompt}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timestamps */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center'>
                                <Clock className='mr-2 h-5 w-5' />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-4 text-sm lg:grid-cols-2'>
                                <div className='text-muted-foreground flex items-center'>
                                    <Calendar className='mr-2 h-4 w-4' />
                                    <span>
                                        Created: {formatDate(bot.createdAt)}
                                    </span>
                                </div>
                                <div className='text-muted-foreground flex items-center'>
                                    <Calendar className='mr-2 h-4 w-4' />
                                    <span>
                                        Last Updated:{' '}
                                        {formatDate(bot.updatedAt)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Main>
            <EditAssistantModal
                open={open}
                onClose={() => setOpen(false)}
                bot={bot}
            />
        </>
    )
}

export default AssistantDetails
