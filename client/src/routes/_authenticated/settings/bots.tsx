import SettingBots from '@/features/settings/bots'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settings/bots')({
  component: SettingBots,
})