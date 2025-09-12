import SettingsUsage from '@/features/settings/usage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settings/usage')({
  component: SettingsUsage,
})
