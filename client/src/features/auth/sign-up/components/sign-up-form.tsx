import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandGoogle,
} from '@tabler/icons-react'
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
import { PasswordInput } from '@/components/password-input'
import { authService } from '../../services/AuthService'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
    .object({
        name: z.string().min(1, 'Please enter your name'),
        email: z.email({
            error: (iss) =>
                iss.input === '' ? 'Please enter your email' : undefined,
        }),
        password: z
            .string()
            .min(1, 'Please enter your password')
            .min(7, 'Password must be at least 7 characters long'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'],
    })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
    const localRegisterMutation = authService.registerLocal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        const { confirmPassword, ...registerationDto } = data
        localRegisterMutation.mutate(registerationDto)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('grid gap-3', className)}
                {...props}
            >
                {/* ✅ New Name field */}
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='John Doe' {...field} />
                            </FormControl>
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
                                <Input
                                    placeholder='name@example.com'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder='********'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder='********'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className='mt-2'
                    disabled={localRegisterMutation.isPending}
                >
                    {localRegisterMutation.isPending
                        ? 'Creating...'
                        : 'Create Account'}
                </Button>

                <div className=''>
                    <Button
                        variant='outline'
                        className='w-full'
                        type='button'
                        onClick={() => {
                            window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
                        }}
                        disabled={localRegisterMutation.isPending}
                    >
                        <IconBrandGoogle className='h-4 w-4' /> Google
                    </Button>
                </div>
            </form>
        </Form>
    )
}
