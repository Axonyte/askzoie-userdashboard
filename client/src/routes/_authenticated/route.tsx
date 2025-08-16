import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { authService } from '@/features/auth/services/AuthService'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!authService.isAuthenticated()) {
      throw redirect({
        to: '/sign-in-2',
        replace: true,
      })
    }
  },
  component: AuthenticatedLayout,
})
