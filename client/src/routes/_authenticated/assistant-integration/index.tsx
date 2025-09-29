import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export const Route = createFileRoute('/_authenticated/assistant-integration/')({
    component: RouteComponent,
})

const snippets: Record<string, string> = {
    html: `<script>
  window.onload = () => {
    const askBot = new AskBot();
    askBot.createBot({
      token: "",
    });
  };
</script>
<script type="module" src="//sdk//cdn//"></script>`,
    react: `import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const askBot = new AskBot();
    askBot.createBot({
      token: "",
    });
  }, []);

  return <div id="askbot-widget"></div>;
}`,
    nextjs: `"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const askBot = new AskBot();
    askBot.createBot({
      token: "",
    });
  }, []);

  return <div id="askbot-widget"></div>;
}`,
}

function RouteComponent() {
    const [selected, setSelected] = useState<string>('html')

    return (
        <>
            <Header>
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <div className='mt-4 mr-4 flex justify-end'>
                <Select value={selected} onValueChange={setSelected}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select a framework' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='html'>HTML</SelectItem>
                            <SelectItem value='react'>React</SelectItem>
                            <SelectItem value='nextjs'>Next.js</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Card className='mx-4 mt-3'>
                <CardContent>
                    <pre className='bg-muted rounded-md p-4 text-sm whitespace-pre-wrap'>
                        <code>{snippets[selected]}</code>
                    </pre>
                </CardContent>
            </Card>
        </>
    )
}
