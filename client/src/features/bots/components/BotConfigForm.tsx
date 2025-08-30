import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BotProfile } from '../types/botProfile'

interface BotConfigFormProps {
    botId: string
    botName: string
    onClose: () => void
    defaultValues?: Omit<
        BotProfile,
        'createdAt' | 'updatedAt' | 'knowledgeSources'
    >
}

interface SaveBotResponse {
    botProfile: any
    refreshToken: string
}

export function BotConfigForm({
    botId,
    botName,
    onClose,
    defaultValues,
}: BotConfigFormProps) {
    const { register, handleSubmit, control } = useForm<BotProfile>({
        defaultValues: defaultValues || {
            personaId: botId,
            name: botName,
            responseLength: 'MEDIUM',
        },
    })

    const mutation = useMutation({
        mutationFn: async (data: BotProfile): Promise<SaveBotResponse> => {
            const res = await api.post('/bot/save', data)
            return res.data
        },
        onSuccess: (data, variables) => {
            navigator.clipboard.writeText(data.refreshToken).then(() => {
                toast.success(`${variables.name} token copied to clipboard!`, {
                    description:
                        'You can now use this token to access your bot.',
                })
            })
            onClose()
        },
        onError: (err: any) => {
            toast.error('Failed to save bot configuration', {
                description: err.message || 'Please try again.',
            })
        },
    })

    const onSubmit = (values: any) => {
        console.log(values.allowedTopics, typeof values.allowedTopics)
        mutation.mutate({
            ...values,
            personaId: defaultValues?.personaId!,
            allowedTopics: values.allowedTopics.split(','),
            blockedTopics: values.blockedTopics.split(','),
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <Input placeholder='Bot Name' {...register('name')} />
            <Textarea
                placeholder='Custom Greeting'
                {...register('customGreeting')}
            />
            <Textarea
                placeholder='Custom Fallback'
                {...register('customFallback')}
            />
            <Input
                placeholder='Tone (e.g. casual, friendly)'
                {...register('tone')}
            />
            <Input placeholder='Avatar URL' {...register('avatarUrl')} />
            <Input
                placeholder='Primary Language (e.g. en)'
                {...register('primaryLanguage')}
            />
            <Input
                placeholder='Allowed Topics (comma separated)'
                {...register('allowedTopics')}
                onChange={(e) => {
                    const val = e.target.value.split(',').map((s) => s.trim())
                    e.target.value = val.join(',')
                }}
            />
            <Input
                placeholder='Blocked Topics (comma separated)'
                {...register('blockedTopics')}
                onChange={(e) => {
                    const val = e.target.value.split(',').map((s) => s.trim())
                    e.target.value = val.join(',')
                }}
            />
            <Controller
                name='responseLength'
                control={control}
                render={({ field }) => (
                    <Select {...field}>
                        <SelectTrigger>
                            <SelectValue placeholder='Response Length' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='SHORT'>SHORT</SelectItem>
                            <SelectItem value='MEDIUM'>MEDIUM</SelectItem>
                            <SelectItem value='DETAILED'>DETAILED</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
            {/* <Textarea
                placeholder='Knowledge Sources JSON'
                {...register('knowledgeSources')}
                onChange={(e) => {
                    try {
                        const parsed = JSON.parse(e.target.value)
                        e.target.value = JSON.stringify(parsed)
                    } catch {}
                }}
            /> */}
            <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save & Get Token'}
            </Button>
        </form>
    )
}
