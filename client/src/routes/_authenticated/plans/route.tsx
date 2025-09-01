import { createFileRoute } from '@tanstack/react-router'
import SubscriptionsLayout from '@/features/SubscriptionPlans'

export const Route = createFileRoute('/_authenticated/plans')({
    component: SubscriptionsLayout,
})
