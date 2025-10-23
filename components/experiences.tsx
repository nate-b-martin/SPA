import Image from 'next/image'
import Link from 'next/link'

import { ExperienceMetadata } from '@/lib/experiences'
import { formatDate } from '@/lib/utils'

export default function Experiences({
  experiences
}: {
  experiences: ExperienceMetadata[]
}) {
  return (
    <ul className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
      {experiences.map((experience, index) => (
        <li key={experience.slug} className='group relative'>
          <Link href={`/experiences/${experience.slug}`}>
            {experience.image && (
              <div className='h-72 w-full overflow-hidden bg-muted sm:h-60'>
                <Image
                  src={experience.image}
                  alt={experience.title ? `${experience.title} experience screenshot` : 'experience screenshot'}
                  fill
                  className='rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-105'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  priority={index === 0}
                />
              </div>
            )}

            <div className='absolute inset-[1px] rounded-lg bg-background/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

            <div className='absolute inset-x-0 bottom-0 translate-y-2 px-6 py-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
              <h2 className='title line-clamp-1 text-xl no-underline'>
                {experience.title}
              </h2>
              <p className='line-clamp-1 text-sm text-muted-foreground'>
                {experience.summary}
              </p>
              <p className='text-xs font-light text-muted-foreground'>
                {formatDate(experience.publishedAt ?? '')}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
