import Link from 'next/link'
import Image from 'next/image'

import { formatDate } from '@/lib/utils'
import MDXContent from '@/components/mdx-content'
import MDXImage from '@/components/mdx-image'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { getExperienceBySlug, getExperiences} from '@/lib/experiences'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const experience = await getExperiences()
  const slugs = experience.map(experience => ({ slug: experience.slug }))

  return slugs
}

const components = {
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!props.src || !props.alt) {
      return null
    }
    return <MDXImage src={props.src} alt={props.alt} />
  }
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getExperienceBySlug(slug)

  if (!project) {
    notFound()
  }

  const { metadata, content } = project
  const { title, image, author, publishedAt } = metadata

  return (
    <section className='pb-24 pt-32'>
      <div className='container max-w-3xl'>
        <Link
          href='/experiences'
          className='mb-8 inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeftIcon className='h-5 w-5' />
          <span>Back to projects</span>
        </Link>

        {image && (
          <div className='relative mb-6 h-96 w-full overflow-hidden rounded-lg'>
            <Image
              src={image}
              alt={title || ''}
              className='object-cover'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
              priority
            />
          </div>
        )}

        <header>
          <h1 className='title'>{title}</h1>
          <p className='mt-3 text-xs text-muted-foreground'>
            {author} / {formatDate(publishedAt ?? '')}
          </p>
        </header>

        <main className='prose mt-16 dark:prose-invert'>
          <MDXContent source={content} components={components} />
        </main>
      </div>
    </section>
  )
}
