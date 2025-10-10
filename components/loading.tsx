import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
      role='status'
      aria-label='Loading'
    >
      <span className='sr-only'>Loading...</span>
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}

export function PostsLoadingSkeleton() {
  return (
    <div className='flex flex-col gap-8'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className='flex flex-col justify-between gap-x-4 gap-y-1 sm:flex-row'>
          <div className='max-w-lg'>
            <LoadingSkeleton className='h-6 w-3/4 mb-2' />
            <LoadingSkeleton className='h-4 w-full' />
            <LoadingSkeleton className='h-4 w-2/3 mt-1' />
          </div>
          <LoadingSkeleton className='h-4 w-20 mt-1' />
        </div>
      ))}
    </div>
  )
}

export function ProjectsLoadingSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className='group relative'>
          <LoadingSkeleton className='h-72 w-full sm:h-60 rounded-lg' />
        </div>
      ))}
    </div>
  )
}
