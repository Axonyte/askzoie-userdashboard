import { createFileRoute } from '@tanstack/react-router'
import SettingsCalendar from '@/features/settings/calendar'

export const Route = createFileRoute('/_authenticated/settings/calendar')({
    component: SettingsCalendar,
})
