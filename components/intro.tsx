import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import authorImage from '@/public/images/authors/nate-profile.webp'

export default function Intro() {
    return (
        <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
            <div className='mt-2 flex-1 md:mt-0'>
                <h1 className='title no-underline'>
                    Hey, I&apos;m Nathan Martin.
                </h1>
                <p className='mt-3 font-light text-muted-foreground'>
                    I turn &quot;works on my machine&quot; into &quot;works
                    everywhere&quot; through strategic test automation. As a
                    Quality Engineer with 9 years of experience, I&apos;ve
                    helped teams reduce regression cycles from days to hours
                    using modern frameworks like Playwright and Cypress.
                </p>
                <p className='mt-3 font-light text-muted-foreground'>
                    Starting with Java and Selenium, I&apos;ve evolved alongside
                    the industry, building testing infrastructure that catches
                    bugs before production and gives developers confidence to
                    move fast. I&apos;m passionate about making quality
                    everyone&apos;s responsibility, not just QA&apos;s job.
                </p>
                <p className='mt-3 font-light text-muted-foreground'>
                    I&apos;m currently looking for my next challenge where I can
                    help scale quality across engineering organizations.
                </p>
            </div>
            <div className='relative flex flex-col items-center'>
                <Image
                    className='flex-1 rounded-lg'
                    src={authorImage}
                    alt='Nathan Martin'
                    style={{ objectFit: 'cover' }}
                    width={200}
                    priority
                />
                <Link
                    href='/posts/resume'
                    className={
                        buttonVariants({ variant: 'default', size: 'sm' }) +
                        ' mt-4 inline-flex items-center gap-2'
                    }
                >
                    View Resume
                    <span aria-hidden='true'>→</span>
                </Link>
            </div>
        </section>
    )
}
