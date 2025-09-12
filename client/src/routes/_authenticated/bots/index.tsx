import BotsPage from '@/features/bots'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/bots/')({
  component: BotsPage,
})
