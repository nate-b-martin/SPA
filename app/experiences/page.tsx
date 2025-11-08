import Experiences from '@/components/experiences';
import { getExperiences } from '@/lib/experiences';
import { Suspense } from 'react';
import { ExperiencesLoadingSkeleton } from '@/components/loading';

export default async function ExperiencesPage() {
  const experiences = await getExperiences()

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-12'>Experiences</h1>

        <Suspense fallback={<ExperiencesLoadingSkeleton/>}>
          <Experiences experiences={experiences} />
        </Suspense>
      </div>
    </section>
  )
}
