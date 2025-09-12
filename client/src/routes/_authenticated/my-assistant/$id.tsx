import { createFileRoute } from '@tanstack/react-router'
import AssistantDetails from '@/features/myAssistants/AssistantDetails'

export const Route = createFileRoute('/_authenticated/my-assistant/$id')({
    component: () => {
        const { id } = Route.useParams()
        return <AssistantDetails botId={id} />
    },
})
