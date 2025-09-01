import { createFileRoute } from '@tanstack/react-router'
import UserAssistants from '@/features/myAssistants/UserAssistants'

export const Route = createFileRoute('/_authenticated/my-assistants/')({
    component: UserAssistants,
})
