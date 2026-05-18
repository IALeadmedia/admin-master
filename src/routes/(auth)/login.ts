import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginPage } from '../../pages/login/login';

const fallback = "/app" as const;

export const Route = createFileRoute('/(auth)/login')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(""),
    }),
    beforeLoad: ({ search }) => {
        if (localStorage.getItem("user")) {
            throw redirect({ to: search.redirect || fallback });
        }
    },
    component: LoginPage,
})

