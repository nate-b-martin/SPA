import Image from 'next/image'

export default function MDXImage({
  src,
  alt
}: {
  src: string
  alt: string
}) {
  return (
    <div className='relative my-8 h-96 w-full overflow-hidden rounded-lg'>
      <Image
        src={src}
        alt={alt}
        fill
        className='object-cover'
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
        loading='lazy'
      />
    </div>
  )
}
