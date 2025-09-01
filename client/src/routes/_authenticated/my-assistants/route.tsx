import { createFileRoute } from '@tanstack/react-router'
import MyAssistantsLayout from '@/features/myAssistants'

export const Route = createFileRoute('/_authenticated/my-assistants')({
    component: MyAssistantsLayout,
})
