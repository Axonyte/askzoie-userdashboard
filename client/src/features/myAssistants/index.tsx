import { Outlet } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function MyAssistantsLayout() {
    return (
        <>
            <Header>
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <Outlet />
            </Main>
        </>
    )
}
