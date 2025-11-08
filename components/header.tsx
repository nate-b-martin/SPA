import Link from 'next/link'
import ThemeToggle from '@/components/theme-toggle';

export default function Header() {
  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-background/75 py-6 backdrop-blur-sm'>
      <nav className='container flex max-w-3xl items-center justify-between'>
        <div>
          <Link href='/' className='font-serif text-2xl font-bold rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'>
            NM
          </Link>
        </div>

        <ul className='flex items-center gap-6 text-sm font-light text-muted-foreground sm:gap-10'>
          <li className='rounded-sm transition-colors hover:text-foreground focus-within:text-foreground focus-within:ring-1 focus-within:ring-ring'>
            <Link className='outline-none' href='/posts'>
              Posts
            </Link>
          </li>
          <li className='rounded-sm transition-colors hover:text-foreground focus-within:text-foreground focus-within:ring-1 focus-within:ring-ring'>
            <Link className='outline-none' href='/experiences'>
              Experiences
            </Link>
          </li>
          <li className='rounded-sm transition-colors hover:text-foreground focus-within:text-foreground focus-within:ring-1 focus-within:ring-ring'>
            <Link className='outline-none' href='/contact'>
              Contact
            </Link>
          </li>
        </ul>

        <div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
