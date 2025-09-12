import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@/config/apiClient'
import {
    Bot,
    Calendar,
    MessageSquare,
    Globe,
    FileText,
    Settings,
    Plus,
    Loader2,
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
import ImageSignedUrlInjector from '@/components/signed-url-injector'
import { BotConfigModal } from '../bots/components/BotConfigModal'
import { BotPersona } from '../bots/types/botPersona'

type UserBot = {
    id: string
    name: string | null
    customGreeting: string | null
    customFallback: string | null
    tone: string | null
    avatarUrl: string | null
    primaryLanguage: string | null
    allowedTopics: string[]
    blockedTopics: string[]
    responseLength: 'SHORT' | 'MEDIUM' | 'DETAILED'
    knowledgeSources: any
    createdAt: string
    updatedAt: string
    userId: string
    personaId: string
    persona: BotPersona
}

function UserAssistants() {
    const [selectedBot, setSelectedBot] = useState<BotPersona | null>(null)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const {
        data: assistants,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['user-assistants'],
        queryFn: async (): Promise<UserBot[]> => {
            const res = await api.get('/bot/user-bots')
            return res.data
        },
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const getResponseLengthColor = (length: string) => {
        switch (length) {
            case 'SHORT':
                return 'bg-green-100 text-green-800'
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800'
            case 'DETAILED':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center p-8'>
                <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
                <span className='text-muted-foreground ml-2'>
                    Loading assistants...
                </span>
            </div>
        )
    }

    if (error) {
        return (
            <div className='p-8 text-center'>
                <p className='text-destructive'>
                    Failed to load assistants. Please try again.
                </p>
            </div>
        )
    }

    if (!assistants || assistants.length === 0) {
        return (
            <div className='p-8 text-center'>
                <Bot className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
                <h3 className='mb-2 text-lg font-medium'>
                    No AI Assistants Yet
                </h3>
                <p className='text-muted-foreground mb-4'>
                    Create your first AI assistant to get started
                </p>
                <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Create Assistant
                </Button>
            </div>
        )
    }

    const prefillConfigureModal = (assistant: UserBot) => {
        setSelectedBot({
            avatarUrl: assistant.avatarUrl ?? assistant.persona.avatarUrl,
            description: assistant.persona.description,
            defaultDomain: assistant.persona.defaultDomain,
            defaultTone: assistant.persona.defaultTone,
            defaultFallback:
                assistant.customFallback ?? assistant.persona.defaultFallback,
            defaultGreeting:
                assistant.customGreeting ?? assistant.persona.defaultGreeting,
            gender: assistant.persona.gender,
            language: assistant.primaryLanguage ?? assistant.persona.language,
            name: assistant.name ?? assistant.persona.name,
            id: assistant.persona.id,
        })
    }
    const handleConfigure = (assistant: UserBot) => {
        navigate({ to: `/my-assistant/${assistant.id}` })
        // prefillConfigureModal(assistant)
        // setOpen(true)
    }

    return (
        <>
            <div className='mx-auto w-full max-w-[1200px]'>
                <div className='mb-6 flex items-center justify-between'>
                    <div>
                        <h2 className='mb-2 text-3xl font-bold'>
                            Your AI Assistants
                        </h2>
                        <p className='text-muted-foreground'>
                            Manage and configure your personalized AI assistants
                        </p>
                    </div>
                    <Button>
                        <Plus className='mr-2 h-4 w-4' />
                        New Assistant
                    </Button>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {assistants.map((assistant) => (
                        <Card
                            key={assistant.id}
                            className='transition-shadow duration-300 hover:shadow-lg'
                        >
                            <CardHeader className='pb-4'>
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-center space-x-3'>
                                        {assistant.avatarUrl ? (
                                            <ImageSignedUrlInjector
                                                fileUrl={assistant.avatarUrl}
                                            >
                                                <img
                                                    src=''
                                                    alt={
                                                        assistant.name ||
                                                        'Assistant'
                                                    }
                                                    className='h-10 w-10 rounded-full object-cover'
                                                />
                                            </ImageSignedUrlInjector>
                                        ) : (
                                            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                                                <Bot className='text-primary h-5 w-5' />
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle className='text-lg'>
                                                {assistant.name ||
                                                    'Unnamed Assistant'}
                                            </CardTitle>
                                            <CardDescription className='text-sm'>
                                                Created{' '}
                                                {formatDate(
                                                    assistant.createdAt
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button variant='ghost' size='icon'>
                                        <Settings className='h-4 w-4' />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className='space-y-4'>
                                {assistant.customGreeting && (
                                    <div className='space-y-1'>
                                        <div className='text-muted-foreground flex items-center text-sm'>
                                            <MessageSquare className='mr-1 h-3 w-3' />
                                            Custom Greeting
                                        </div>
                                        <p className='bg-muted text-muted-foreground truncate rounded p-2 text-sm'>
                                            "{assistant.customGreeting}"
                                        </p>
                                    </div>
                                )}

                                <div className='flex flex-wrap gap-2'>
                                    <Badge
                                        variant='outline'
                                        className={getResponseLengthColor(
                                            assistant.responseLength
                                        )}
                                    >
                                        {assistant.responseLength.toLowerCase()}
                                    </Badge>

                                    {assistant.tone && (
                                        <Badge variant='outline'>
                                            {assistant.tone}
                                        </Badge>
                                    )}

                                    {assistant.primaryLanguage && (
                                        <Badge variant='outline'>
                                            <Globe className='mr-1 h-3 w-3' />
                                            {assistant.primaryLanguage}
                                        </Badge>
                                    )}
                                </div>

                                {assistant.allowedTopics.length > 0 && (
                                    <div className='space-y-1'>
                                        <div className='text-muted-foreground flex items-center text-sm'>
                                            <FileText className='mr-1 h-3 w-3' />
                                            Allowed Topics (
                                            {assistant.allowedTopics.length})
                                        </div>
                                        <div className='flex flex-wrap gap-1'>
                                            {assistant.allowedTopics
                                                .slice(0, 3)
                                                .map((topic, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant='secondary'
                                                        className='text-xs'
                                                    >
                                                        {topic}
                                                    </Badge>
                                                ))}
                                            {assistant.allowedTopics.length >
                                                3 && (
                                                <Badge
                                                    variant='secondary'
                                                    className='text-xs'
                                                >
                                                    +
                                                    {assistant.allowedTopics
                                                        .length - 3}{' '}
                                                    more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {assistant.blockedTopics.length > 0 && (
                                    <div className='space-y-1'>
                                        <div className='text-muted-foreground flex items-center text-sm'>
                                            <FileText className='mr-1 h-3 w-3' />
                                            Blocked Topics (
                                            {assistant.blockedTopics.length})
                                        </div>
                                        <div className='flex flex-wrap gap-1'>
                                            {assistant.blockedTopics
                                                .slice(0, 3)
                                                .map((topic, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant='destructive'
                                                        className='text-xs'
                                                    >
                                                        {topic}
                                                    </Badge>
                                                ))}
                                            {assistant.blockedTopics.length >
                                                3 && (
                                                <Badge
                                                    variant='destructive'
                                                    className='text-xs'
                                                >
                                                    +
                                                    {assistant.blockedTopics
                                                        .length - 3}{' '}
                                                    more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className='flex items-center justify-between border-t pt-2'>
                                    <div className='text-muted-foreground flex items-center text-xs'>
                                        <Calendar className='mr-1 h-3 w-3' />
                                        Updated{' '}
                                        {formatDate(assistant.updatedAt)}
                                    </div>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() =>
                                            handleConfigure(assistant)
                                        }
                                    >
                                        Configure
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <BotConfigModal
                open={open}
                onClose={() => setOpen(false)}
                bot={selectedBot}
            />
        </>
    )
}

export default UserAssistants
