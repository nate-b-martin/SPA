'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import {Button} from '@/components/ui/button';
import {MoonIcon, SunIcon } from '@radix-ui/react-icons';

export default function ThemeToggle() {
    const {setTheme, resolvedTheme} = useTheme();
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true);
    }, [])

    if(!mounted) {
        return null
    }

    return(
        <Button
        size='sm'
        variant='ghost'
        onClick={() => {
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        }}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
        >
            {resolvedTheme === 'dark' ? (
                <SunIcon className='size-4 text-orange-300'/>
            ): (
                <MoonIcon className='size-4 text-sky-950'/>
            )}
            <span className='sr-only'>Toggle Theme</span>
        </Button>
    )
}