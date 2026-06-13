'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (!res.ok) {
        throw new Error('Failed to send')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-12'>Contact</h1>

        <div className='prose dark:prose-invert max-w-none'>
          <p className='text-lg text-muted-foreground mb-8'>
            I&apos;m always interested in hearing about new opportunities and projects.
            Feel free to reach out if you&apos;d like to collaborate or just say hello!
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          <div>
            <h2 className='text-xl font-semibold mb-4'>Get in Touch</h2>
            <div className='space-y-4'>
              <div>
                <h3 className='font-medium text-sm text-muted-foreground'>Email</h3>
                <p className='text-sm'>nate.martinb@gmail.com</p>
              </div>
              <div>
                <h3 className='font-medium text-sm text-muted-foreground'>Location</h3>
                <p className='text-sm'>Minneapolis, Minnesota</p>
              </div>
              <div>
                <h3 className='font-medium text-sm text-muted-foreground'>Availability</h3>
                <p className='text-sm'>Open to new opportunities</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-4'>Send a Message</h2>
            <form className='space-y-4' onSubmit={handleSubmit}>
              <div>
                <label htmlFor='name' className='block text-sm font-medium mb-2'>
                  Name
                </label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  placeholder='Your name'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor='email' className='block text-sm font-medium mb-2'>
                  Email
                </label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='your.email@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor='message' className='block text-sm font-medium mb-2'>
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={4}
                  className='flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                  placeholder='Your message...'
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type='submit' className='w-full' disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </Button>
              {status === 'success' && (
                <p className='text-sm text-green-600 dark:text-green-400'>
                  Message sent successfully! I&apos;ll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className='text-sm text-red-600 dark:text-red-400'>
                  Failed to send message. Please try again or email me directly.
                </p>
              )}
            </form>
            <p className='text-sm text-muted-foreground mt-4'>
              If the form doesn&apos;t work,{' '}
              <a
                href='mailto:nate.martinb@gmail.com'
                className='text-primary hover:underline'
              >
                email me directly
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
