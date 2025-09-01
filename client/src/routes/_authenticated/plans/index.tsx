import { createFileRoute } from '@tanstack/react-router'
import SubscriptionPlans from '@/features/SubscriptionPlans'

export const Route = createFileRoute('/_authenticated/plans/')({
    component: SubscriptionPlans,
})
