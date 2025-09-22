import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
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

// import { useLogin } from '@/hooks/use-auth'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
    email: z.email({
        error: (iss) =>
            iss.input === '' ? 'Please enter your email' : undefined,
    }),
    password: z
        .string()
        .min(1, 'Please enter your password')
        .min(7, 'Password must be at least 7 characters long'),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const loginMutation = authService.login()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        loginMutation.mutate(data)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('grid gap-3', className)}
                {...props}
            >
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
                        <FormItem className='relative'>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder='********'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            <Link
                                to='/forgot-password'
                                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
                            >
                                Forgot password?
                            </Link>
                        </FormItem>
                    )}
                />
                <Button className='mt-2' disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </Button>

                <div className='grid grid-cols-1 gap-2'>
                    <Button
                        variant='outline'
                        className='w-full'
                        type='button'
                        onClick={() => {
                            window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
                        }}
                        disabled={loginMutation.isPending}
                    >
                        <IconBrandGoogle className='h-4 w-4' /> Google
                    </Button>
                </div>
            </form>
        </Form>
    )
}
