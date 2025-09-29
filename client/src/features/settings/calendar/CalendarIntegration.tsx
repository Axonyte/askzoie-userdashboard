import { useState } from 'react'
import { Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

function CalendarIntegration() {
    // Simulated integration status - replace with actual API call
    const [isIntegrated, setIsIntegrated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleConnect = async () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            // Here you would typically redirect to Google OAuth
            // window.location.href = 'your-google-oauth-url'
            console.log('Initiating Google Calendar connection...')
            setIsLoading(false)
        }, 1000)
    }

    const handleDisconnect = async () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsIntegrated(false)
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className='mx-auto w-full max-w-[600px] p-6'>
            <Card className='relative transition-all duration-300 hover:shadow-lg'>
                {isIntegrated && (
                    <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 transform bg-green-600'>
                        Connected
                    </Badge>
                )}

                <CardHeader className='pb-4 text-center'>
                    <div className='mb-2 flex justify-center'>
                        <Calendar className='text-primary h-8 w-8' />
                    </div>
                    <CardTitle className='text-2xl'>Google Calendar</CardTitle>
                    <CardDescription>
                        {isIntegrated
                            ? 'Your account is connected'
                            : 'Connect your Google Calendar account'}
                    </CardDescription>
                </CardHeader>

                <CardContent className='space-y-6'>
                    <div className='rounded-lg border p-4'>
                        <div className='mb-4 flex items-center justify-between'>
                            <span className='font-medium'>Status</span>
                            <div className='flex items-center gap-2'>
                                {isIntegrated ? (
                                    <>
                                        <CheckCircle2 className='h-5 w-5 text-green-500' />
                                        <span className='text-sm text-green-600'>
                                            Connected
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className='h-5 w-5 text-gray-400' />
                                        <span className='text-muted-foreground text-sm'>
                                            Not Connected
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {isIntegrated && (
                            <div className='text-muted-foreground space-y-2 text-sm'>
                                <p>✓ Calendar events synced</p>
                                <p>✓ Automatic event creation enabled</p>
                                <p>✓ Real-time updates active</p>
                            </div>
                        )}

                        {!isIntegrated && (
                            <div className='text-muted-foreground space-y-2 text-sm'>
                                <p>• Sync your calendar events</p>
                                <p>• Create events automatically</p>
                                <p>• Get real-time updates</p>
                            </div>
                        )}
                    </div>

                    {isIntegrated ? (
                        <Button
                            className='w-full'
                            variant='outline'
                            onClick={handleDisconnect}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Disconnecting...'
                                : 'Disconnect Account'}
                        </Button>
                    ) : (
                        <Button
                            className='w-full'
                            onClick={handleConnect}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Connecting...'
                                : 'Connect Google Calendar'}
                        </Button>
                    )}

                    <p className='text-muted-foreground text-center text-xs'>
                        By connecting, you agree to grant access to your
                        calendar data
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default CalendarIntegration
