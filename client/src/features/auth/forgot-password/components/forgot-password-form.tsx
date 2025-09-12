// forgot-password-form.tsx
import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@/config/apiClient'
import { Loader2, Mail, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type ForgotFormProps = HTMLAttributes<HTMLFormElement>

// Step 1: Email form schema
const emailSchema = z.object({
    email: z.email('Please enter a valid email address'),
})

// Step 2: OTP and password form schema
const resetSchema = z
    .object({
        otp: z
            .string()
            .min(6, 'OTP must be 6 characters')
            .max(6, 'OTP must be 6 characters'),
        newPassword: z
            .string()
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type EmailFormData = z.infer<typeof emailSchema>
type ResetFormData = z.infer<typeof resetSchema>

export function ForgotPasswordForm({ className, ...props }: ForgotFormProps) {
    const [step, setStep] = useState<'email' | 'reset' | 'success'>('email')
    const [userEmail, setUserEmail] = useState('')

    const navigate = useNavigate()

    // Email form
    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: '' },
    })

    // Reset password form
    const resetForm = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            otp: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    // Send OTP mutation
    const sendOtpMutation = useMutation({
        mutationFn: async (email: string) => {
            const response = await api.post('/auth/forgot-password', { email })

            return response.data
        },
        onSuccess: (data, email) => {
            setUserEmail(email)
            setStep('reset')
            toast.success('OTP sent to your email successfully!')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to send OTP. Please try again.'
            )
        },
    })

    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: async (data: {
            email: string
            otp: string
            newPassword: string
        }) => {
            const response = await api.post('/auth/reset-password', data)

            return response.data
        },
        onSuccess: () => {
            setStep('success')
            toast.success('Password reset successfully!')
        },
        onError: (error) => {
            toast.error(
                error.message || 'Failed to reset password. Please try again.'
            )
        },
    })

    function onEmailSubmit(data: EmailFormData) {
        sendOtpMutation.mutate(data.email)
    }

    function onResetSubmit(data: ResetFormData) {
        resetPasswordMutation.mutate({
            email: userEmail,
            otp: data.otp,
            newPassword: data.newPassword,
        })
    }

    function handleBackToEmail() {
        setStep('email')
        setUserEmail('')
        emailForm.reset()
        resetForm.reset()
    }

    // Email step
    if (step === 'email') {
        return (
            <Form {...emailForm}>
                <form
                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    className={cn('grid gap-4', className)}
                    {...props}
                >
                    <FormField
                        control={emailForm.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='name@example.com'
                                        {...field}
                                        disabled={sendOtpMutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className='mt-2'
                        disabled={sendOtpMutation.isPending}
                        type='submit'
                    >
                        {sendOtpMutation.isPending && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
                    </Button>
                </form>
            </Form>
        )
    }

    // Reset password step
    if (step === 'reset') {
        return (
            <div className={cn('grid gap-4', className)}>
                <div className='text-muted-foreground mb-2 flex items-center gap-2 text-sm'>
                    <Mail className='h-4 w-4' />
                    OTP sent to {userEmail}
                </div>

                <Form {...resetForm}>
                    <form
                        onSubmit={resetForm.handleSubmit(onResetSubmit)}
                        className='grid gap-4'
                        {...props}
                    >
                        <FormField
                            control={resetForm.control}
                            name='otp'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Enter OTP</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter 6-digit OTP'
                                            {...field}
                                            disabled={
                                                resetPasswordMutation.isPending
                                            }
                                            maxLength={6}
                                            className='text-center text-lg tracking-widest'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={resetForm.control}
                            name='newPassword'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Enter new password'
                                            {...field}
                                            disabled={
                                                resetPasswordMutation.isPending
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={resetForm.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Confirm new password'
                                            {...field}
                                            disabled={
                                                resetPasswordMutation.isPending
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='mt-2 flex gap-2'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleBackToEmail}
                                disabled={resetPasswordMutation.isPending}
                                className='flex-1'
                            >
                                Back
                            </Button>
                            <Button
                                type='submit'
                                disabled={resetPasswordMutation.isPending}
                                className='flex-1'
                            >
                                {resetPasswordMutation.isPending && (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                )}
                                {resetPasswordMutation.isPending
                                    ? 'Resetting...'
                                    : 'Reset Password'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        )
    }

    // Success step
    return (
        <div className={cn('grid gap-4 text-center', className)}>
            <div className='flex justify-center'>
                <CheckCircle className='h-12 w-12 text-green-500' />
            </div>
            <div>
                <h3 className='text-lg font-semibold'>
                    Password Reset Successfully!
                </h3>
                <p className='text-muted-foreground mt-1 text-sm'>
                    Your password has been reset. You can now sign in with your
                    new password.
                </p>
            </div>
            <Button
                onClick={() => navigate({ to: '/sign-in-2' })}
                className='mt-2'
            >
                Go to Sign In
            </Button>
        </div>
    )
}
