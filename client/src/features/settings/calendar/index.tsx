import ContentSection from '../components/content-section'
import CalendarIntegration from './CalendarIntegration'

export default function SettingsCalendar() {
    return (
        <ContentSection
            title='Google Calendar'
            desc='Connect your Google Calendar to sync events'
        >
            <CalendarIntegration />
        </ContentSection>
    )
}
