import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
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
                <p className='text-sm'>nathan@example.com</p>
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
            <form className='space-y-4'>
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
                />
              </div>
              <Button type='submit' className='w-full'>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
