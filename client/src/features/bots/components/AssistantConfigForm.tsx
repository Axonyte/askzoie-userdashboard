import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import { queryClient } from '@/main'
import { Bot } from 'lucide-react'
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
import ImageSignedUrlInjector from '@/components/signed-url-injector'
import { BotProfile } from '../types/botProfile'

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

export type BotProfileForm = {
    profileId: string
    name: string
    customGreeting?: string
    customFallback?: string
    tone?: string
    primaryLanguage?: string
    allowedTopics?: string
    blockedTopics?: string
    responseLength?: string
    file?: any
    avatarUrl?: string // comes from backend in edit mode
}

export function AssistantForm({
    botId,
    botName,
    onClose,
    defaultValues,
}: BotConfigFormProps) {
    const { register, handleSubmit, control, setValue } =
        useForm<BotProfileForm>({
            defaultValues: defaultValues || {
                profileId: botId,
                name: botName,
                responseLength: 'MEDIUM',
            },
        })

    const [showFileInput, setShowFileInput] = useState(false)
    const [localPreview, setLocalPreview] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: async (data: BotProfileForm): Promise<SaveBotResponse> => {
            const formData = new FormData()

            formData.append('profileId', data.profileId)
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

            if (data.allowedTopics && data.allowedTopics.length > 0) {
                formData.append('allowedTopics', data.allowedTopics)
            }
            if (data.blockedTopics && data.blockedTopics.length > 0) {
                formData.append('blockedTopics', data.blockedTopics)
            }

            // Only send file if user selected one
            if (data.file && data.file.length > 0) {
                formData.append('file', data.file[0])
            }

            const res = await api.patch('/bot/edit-assistant', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            return res.data
        },
        onSuccess: (data, variables) => {
            navigator.clipboard.writeText(data.refreshToken).then(() => {
                toast.success(`${variables.name} token copied to clipboard!`, {
                    description:
                        'You can now use this token to embed your bot.',
                })
                queryClient.invalidateQueries({
                    queryKey: ['user-bot', defaultValues?.profileId],
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

    const onSubmit = (values: BotProfileForm) => {
        mutation.mutate({
            ...values,
            profileId: defaultValues?.profileId || botId,
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => setLocalPreview(reader.result as string)
            reader.readAsDataURL(file)
        } else {
            setLocalPreview(null)
        }
    }

    const isEdit = !!defaultValues

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

            {/* Avatar section */}
            {isEdit &&
            defaultValues?.avatarUrl &&
            !showFileInput &&
            !localPreview ? (
                <div className='flex items-center gap-4'>
                    <ImageSignedUrlInjector fileUrl={defaultValues.avatarUrl}>
                        <img
                            src=''
                            alt={defaultValues.name || 'Assistant'}
                            className='h-16 w-16 rounded-full object-cover'
                        />
                    </ImageSignedUrlInjector>
                    <div className='flex flex-col gap-2'>
                        <div className='text-muted-foreground text-sm'>
                            Current avatar
                        </div>
                        <Button
                            type='button'
                            onClick={() => setShowFileInput(true)}
                        >
                            Edit DP
                        </Button>
                    </div>
                </div>
            ) : (
                (showFileInput || !isEdit || localPreview) && (
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm'>Avatar (optional)</label>
                        <Input
                            type='file'
                            accept='image/*'
                            {...register('file')}
                            onChange={handleFileChange}
                        />
                        {localPreview && (
                            <div className='mt-2'>
                                <div className='text-muted-foreground mb-1 text-xs'>
                                    Preview
                                </div>
                                <img
                                    src={localPreview}
                                    alt='preview'
                                    className='h-20 w-20 rounded-full object-cover'
                                />
                            </div>
                        )}
                        {isEdit && (
                            <div className='mt-1'>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => {
                                        setValue('file', undefined as any)
                                        setLocalPreview(null)
                                        setShowFileInput(false)
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                )
            )}

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
