// settings-usage.tsx
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/config/apiClient'
import { queryClient } from '@/main'
import { Gift, Zap, Calendar, TrendingUp, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import ContentSection from '../components/content-section'

// API functions (remove these since we're using inline functions)
interface UsageResponse {
    monthlyQuota: number
    usedQuota: number
    resetDate: string // ISO 8601 date string or undefined
    newAccount: boolean
}

interface ClaimFreePromptsResponse {
    id: string
    userId: string
    monthlyQuota: number
    usedQuota: number
    resetDate: string // ISO 8601 date string
    lastUpdated: string // ISO 8601 date string
}

export default function SettingsUsage() {
    // Fetch usage data
    const {
        data: usageData,
        isLoading: isLoadingUsage,
        error: usageError,
        refetch: refetchUsage,
    } = useQuery({
        queryKey: ['usage'],
        queryFn: async (): Promise<UsageResponse> => {
            const response = await api.get('/subscription/usage')

            if (response.status !== 200) {
                throw new Error('Failed to fetch usage data')
            }

            return response.data
        },
        refetchInterval: 60000, // Refetch every minute
    })

    // Claim free prompts mutation
    const claimPromptsMutation = useMutation({
        mutationFn: async (): Promise<ClaimFreePromptsResponse> => {
            const response = await api.post('/subscription/claim-free-prompts')

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to claim free prompts')
            }

            return response.data
        },
        onSuccess: (data) => {
            // Update the cache with new data
            queryClient.setQueryData(['usage'], {
                monthlyQuota: data.monthlyQuota,
                usedQuota: data.usedQuota,
                resetDate: data.resetDate,
            })

            toast.success(
                'Success! 1000 free prompts have been added to your account.'
            )
        },
        onError: (error) => {
            toast.error(
                error.message ||
                    'Failed to claim free prompts. Please try again.'
            )
        },
    })

    // Determine if free prompts are available (simple logic - you might want to enhance this)
    const freePromptsAvailable =
        usageData?.newAccount ||
        (usageData?.monthlyQuota === 0 &&
            new Date(usageData.resetDate as string) < new Date())

    // Handle loading state
    if (isLoadingUsage) {
        return (
            <ContentSection
                title='Usage'
                desc='Track usage of your favorite subscription'
            >
                <div className='flex items-center justify-center py-8'>
                    <Loader2 className='h-8 w-8 animate-spin' />
                    <span className='ml-2'>Loading usage data...</span>
                </div>
            </ContentSection>
        )
    }

    // Handle error state
    if (usageError || !usageData) {
        return (
            <ContentSection
                title='Usage'
                desc='Track usage of your favorite subscription'
            >
                <Card>
                    <CardContent className='pt-6'>
                        <div className='py-8 text-center'>
                            <p className='text-muted-foreground mb-4'>
                                Failed to load usage data
                            </p>
                            <Button
                                onClick={() => refetchUsage()}
                                variant='outline'
                            >
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </ContentSection>
        )
    }

    const usagePercentage =
        usageData.monthlyQuota === 0
            ? 0
            : (usageData.usedQuota / usageData.monthlyQuota) * 100

    const remainingPrompts = usageData.monthlyQuota - usageData.usedQuota

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set'
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-500'
        if (percentage >= 75) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const handleClaimFreePrompts = async () => {
        claimPromptsMutation.mutate()
    }

    return (
        <ContentSection
            title='Usage'
            desc='Track usage of your favorite subscription'
        >
            <div className='space-y-6'>
                {/* Usage Overview Card */}
                <Card>
                    <CardHeader className='pb-3'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <CardTitle className='flex items-center gap-2'>
                                    <TrendingUp className='h-5 w-5' />
                                    Monthly Usage
                                </CardTitle>
                                <CardDescription>
                                    Your current plan usage for this billing
                                    period
                                </CardDescription>
                            </div>
                            {/* Remove plan badge since it's not in the API response */}
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Progress Bar */}
                        <div className='space-y-3'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    {usageData.usedQuota.toLocaleString()} of{' '}
                                    {usageData.monthlyQuota.toLocaleString()}{' '}
                                    prompts used
                                </span>
                                <span className='font-medium'>
                                    {usagePercentage.toFixed(1)}%
                                </span>
                            </div>

                            <Progress
                                value={usagePercentage}
                                className={`h-3 ${getProgressColor(
                                    usagePercentage
                                )}`}
                            />

                            <div className='text-muted-foreground flex justify-between text-xs'>
                                <span>
                                    {remainingPrompts.toLocaleString()}{' '}
                                    remaining
                                </span>
                                {usageData.resetDate && (
                                    <span className='flex items-center gap-1'>
                                        <Calendar className='h-3 w-3' />
                                        Resets {formatDate(usageData.resetDate)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Usage Stats */}
                        <div className='grid grid-cols-2 gap-4 border-t pt-4'>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-green-600'>
                                    {remainingPrompts.toLocaleString()}
                                </div>
                                <div className='text-muted-foreground text-sm'>
                                    Remaining
                                </div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-blue-600'>
                                    {usageData.usedQuota.toLocaleString()}
                                </div>
                                <div className='text-muted-foreground text-sm'>
                                    Used
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Free Prompts Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Gift className='h-5 w-5 text-purple-500' />
                            Free Prompts
                        </CardTitle>
                        <CardDescription>
                            Claim additional prompts at no extra cost
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex items-center justify-between'>
                            <div className='space-y-1'>
                                <p className='text-sm font-medium'>
                                    Get 1000 bonus prompts
                                </p>
                                <p className='text-muted-foreground text-xs'>
                                    {freePromptsAvailable
                                        ? 'Available to claim once per month'
                                        : 'Not available at this time'}
                                </p>
                            </div>

                            <Button
                                onClick={handleClaimFreePrompts}
                                disabled={
                                    !freePromptsAvailable ||
                                    claimPromptsMutation.isPending
                                }
                                className='flex items-center gap-2'
                                variant={
                                    freePromptsAvailable
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {claimPromptsMutation.isPending ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                    <Zap className='h-4 w-4' />
                                )}
                                {claimPromptsMutation.isPending
                                    ? 'Claiming...'
                                    : freePromptsAvailable
                                      ? 'Claim Free Prompts'
                                      : 'Not Available'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Tips */}
                <Card>
                    <CardHeader>
                        <CardTitle className='text-sm'>💡 Usage Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className='text-muted-foreground space-y-2 text-sm'>
                            <li>
                                • Be specific in your prompts to get better
                                results with fewer iterations
                            </li>
                            <li>
                                • Use follow-up questions in the same
                                conversation to save prompts
                            </li>
                            <li>
                                • Consider upgrading your plan if you frequently
                                hit usage limits
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </ContentSection>
    )
}
