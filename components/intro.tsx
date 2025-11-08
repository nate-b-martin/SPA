import Image from 'next/image';
import authorImage from '@/public/images/authors/nate-profile.webp';

export default function Intro() {
  return (
    <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
      <div className='mt-2 flex-1 md:mt-0'>
        <h1 className='title no-underline'>Hey, I&#39;m Nathan Martin.</h1>
        <p className='mt-3 font-light text-muted-foreground'>
          I&#39;m a Tech Consultant based in Minneapolis, Minnesota. I&#39;m
          passionate about learning new technologies and sharing knowledge with others.
        </p>
        <p className='mt-3 font-light text-muted-foreground'>
         My current specialty is Quality Engineering and have nine years of experience. I first started as Quality Assurance in Automation creating UI tests with Java and Selenium. I now have worked with multiple UI automation frameworks including Cypress, WebdriverIO, and Playwright.
        </p>
      </div>
      <div className='relative'>
        <Image
          className='flex-1 rounded-lg'
          src={authorImage}
          alt='Nathan Martin'
          width={175}
          height={175}
          priority
        />
      </div>
    </section>
  )
}
