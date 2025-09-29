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

interface BotConfigFormProps {
    botId: string
    botName: string
    onClose: () => void
    defaultValues?: BotProfileForm
}

interface SaveBotResponse {
    botProfile: any
    refreshToken: string
}

// bot-profile-form.dto.ts
export type BotProfileForm = {
    personaId: string
    name: string
    customGreeting?: string
    customFallback?: string
    tone?: string
    primaryLanguage?: string

    // These will come as comma-separated strings
    allowedTopics?: string
    blockedTopics?: string

    responseLength?: string // because form-data sends everything as string

    // File input
    file?: any
}

export function BotConfigForm({
    botId,
    botName,
    onClose,
    defaultValues,
}: BotConfigFormProps) {
    const { register, handleSubmit, control } = useForm<BotProfileForm>({
        defaultValues: defaultValues || {
            personaId: botId,
            name: botName,
            responseLength: 'MEDIUM',
        },
    })

    const mutation = useMutation({
        mutationFn: async (data: BotProfileForm): Promise<SaveBotResponse> => {
            const formData = new FormData()

            // Append scalar values
            formData.append('personaId', data.personaId)
            if (data.name) formData.append('name', data.name)
            if (data.customGreeting)
                formData.append('customGreeting', data.customGreeting)
            if (data.customFallback)
                formData.append('customFallback', data.customFallback)
            if (data.tone) formData.append('tone', data.tone)
            if (data.primaryLanguage)
                formData.append('primaryLanguage', data.primaryLanguage)
            if (data.responseLength)
                formData.append('responseLength', data.responseLength)

            // Comma separated topics
            if (data.allowedTopics && data.allowedTopics.length > 0) {
                formData.append('allowedTopics', data.allowedTopics)
            }
            if (data.blockedTopics && data.blockedTopics.length > 0) {
                formData.append('blockedTopics', data.blockedTopics)
            }

            // Append file if available
            if ((data as any).file && (data as any).file.length > 0) {
                formData.append('file', (data as any).file[0]) // grab the File from FileList
            }

            const res = await api.post('/bot/save', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            return res.data
        },
        onSuccess: (data, variables) => {
            navigator.clipboard
                .writeText(
                    `
<script>
    window.onload = () => {
        const askBot = new AskBot();
        askBot.createBot({
            token: "${data.refreshToken}",
        });
    };
</script>
<script type="module" src="//sdk//cdn//"></script>`
                )
                .then(() => {
                    toast.success(
                        `${variables.name} token copied to clipboard!`,
                        {
                            description:
                                'You can now use this token to embed your bot.',
                        }
                    )
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
            <Input type='file' accept='image/*' {...register('file')} />{' '}
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
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                    >
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
            <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save & Get Token'}
            </Button>
        </form>
    )
}
