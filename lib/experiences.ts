import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const rootDirectory = path.join(process.cwd(), 'content', 'experiences')

export type Experience = {
  metadata: ExperienceMetadata
  content: string
}

export type ExperienceMetadata = {
  title?: string
  summary?: string
  image?: string
  author?: string
  publishedAt?: string
  slug: string
}

/**
 * Retrieves a single Experience by its slug.
 * @param slug - The slug of the Experience to retrieve.
 * @returns A promise that resolves to the Experience object, or null if not found.
 */
export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
   try {
     const filePath = path.join(rootDirectory, `${slug}.mdx`)
     const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
     const { data, content } = matter(fileContent)
     return { metadata: { ...data, slug }, content }
   } catch {
     return null
   }
 }

/**
 * Retrieves a list of all Experiences, sorted by publication date.
 * @param limit - The maximum number of Experiences to return.
 * @returns A promise that resolves to an array of Experience metadata.
 */
export async function getExperiences(limit?: number): Promise<ExperienceMetadata[]> {
  const files = fs.readdirSync(rootDirectory)

  const Experiences = files
    .map(file => getExperienceMetadata(file))
    .sort((a, b) => {
      if (new Date(a.publishedAt ?? '') < new Date(b.publishedAt ?? '')) {
        return 1
      } else {
        return -1
      }
    })

  if (limit) {
    return Experiences.slice(0, limit)
  }

  return Experiences
}

/**
 * Extracts metadata from a Experience file.
 * @param filepath - The path to the Experience file.
 * @returns The Experience metadata.
 */
export function getExperienceMetadata(filepath: string): ExperienceMetadata {
  const slug = filepath.replace(/\.mdx$/, '')
  const filePath = path.join(rootDirectory, filepath)
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
  const { data } = matter(fileContent)
  return { ...data, slug }
}
