import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import { Loader2, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const profileFormSchema = z.object({
    name: z
        .string('Please enter your name.')
        .min(2, 'Name must be at least 2 characters.')
        .max(50, 'Name must not be longer than 50 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    bio: z
        .string()
        .max(500, 'Bio must not be longer than 500 characters.')
        .optional(),
    socialLinks: z
        .array(
            z.object({
                value: z
                    .string()
                    .url('Please enter a valid URL.')
                    .or(z.literal('')),
            })
        )
        .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

type UserDetails = {
    id: string
    name: string
    createdAt: string
    email: string
    password: string
    bio: string | null
    socialLinks: string[]
    accountStatus: 'REVIEWING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED'
}

type UpdateUserRequest = {
    name: string
    bio?: string
    socialLinks: string[]
}

export default function ProfileForm() {
    const queryClient = useQueryClient()

    const {
        data: userDetails,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['user-details'],
        queryFn: async (): Promise<UserDetails> => {
            const res = await api.get('/user/user-details')
            return res.data
        },
    })

    const updateUserMutation = useMutation({
        mutationFn: async (data: UpdateUserRequest) => {
            const response = await api.put('/user/profile', data)
            return response.data
        },
        onSuccess: () => {
            toast.success('Profile updated successfully!')
            queryClient.invalidateQueries({ queryKey: ['user-details'] })
        },
        onError: (error: any) => {
            toast.error('Failed to update profile', {
                description: error.message || 'Please try again.',
            })
        },
    })

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        values: userDetails
            ? {
                  name: userDetails.name,
                  email: userDetails.email,
                  bio: userDetails.bio || '',
                  socialLinks: userDetails.socialLinks.map((link) => ({
                      value: link,
                  })),
              }
            : undefined,
        mode: 'onChange',
    })

    const { fields, append, remove } = useFieldArray({
        name: 'socialLinks',
        control: form.control,
    })

    const onSubmit = (data: ProfileFormValues) => {
        const updateData: UpdateUserRequest = {
            name: data.name,
            bio: data.bio || undefined,
            socialLinks:
                data.socialLinks?.map((link) => link.value).filter(Boolean) ||
                [],
        }
        updateUserMutation.mutate(updateData)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'REVIEWING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            case 'REJECTED':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center p-8'>
                <Loader2 className='mr-2 h-6 w-6 animate-spin' />
                <span>Loading profile...</span>
            </div>
        )
    }

    if (error || !userDetails) {
        return (
            <div className='p-8 text-center'>
                <p className='text-destructive'>
                    Failed to load profile. Please try again.
                </p>
            </div>
        )
    }

    return (
        <div className='mx-auto max-w-2xl space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                        Account Status
                        <Badge
                            className={getStatusColor(
                                userDetails.accountStatus
                            )}
                        >
                            {userDetails.accountStatus}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground text-sm'>
                        Member since{' '}
                        {new Date(userDetails.createdAt).toLocaleDateString(
                            'en-US',
                            {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            }
                        )}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <div className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter your name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormDescription>
                                            Email cannot be changed. Contact
                                            support if needed.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='bio'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Tell us a little bit about yourself'
                                                className='resize-none'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A brief description about yourself
                                            (optional).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <FormLabel>Social Links</FormLabel>
                                        <FormDescription>
                                            Add links to your website, blog, or
                                            social media profiles.
                                        </FormDescription>
                                    </div>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => append({ value: '' })}
                                    >
                                        <Plus className='mr-1 h-4 w-4' />
                                        Add Link
                                    </Button>
                                </div>

                                {fields.map((field, index) => (
                                    <FormField
                                        control={form.control}
                                        key={field.id}
                                        name={`socialLinks.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='flex gap-2'>
                                                    <FormControl className='flex-1'>
                                                        <Input
                                                            placeholder='https://example.com'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type='button'
                                                        variant='outline'
                                                        size='icon'
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                        className='shrink-0'
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>

                            <div className='flex justify-end pt-4'>
                                <Button
                                    onClick={form.handleSubmit(onSubmit)}
                                    disabled={updateUserMutation.isPending}
                                    className='min-w-[120px]'
                                >
                                    {updateUserMutation.isPending ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
