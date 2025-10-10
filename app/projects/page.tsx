import Projects from '@/components/projects'
import { getProjects } from '@/lib/projects'
import { Suspense } from 'react'
import { ProjectsLoadingSkeleton } from '@/components/loading'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-12'>Projects</h1>

        <Suspense fallback={<ProjectsLoadingSkeleton />}>
          <Projects projects={projects} />
        </Suspense>
      </div>
    </section>
  )
}