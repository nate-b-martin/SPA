import { JSX } from "react"
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc"
import Counter from "@/components/counter"
import DOMPurify from 'isomorphic-dompurify'

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['span', 'code'],
    ALLOWED_ATTR: ['class'],
  })
}

function Code(props: React.HTMLAttributes<HTMLElement>) {
  const { children, ...restProps } = props
  const codeHTML = highlight(String(children))
  const sanitizedHTML = sanitizeHTML(codeHTML)
  return <code dangerouslySetInnerHTML={{ __html: sanitizedHTML }} {...restProps} />
}

const components = {
  code: Code,
  Counter
}

export default function MDXContent(props: JSX.IntrinsicAttributes & MDXRemoteProps) {
  return (
    <MDXRemote 
      {...props} 
      components={{ ...components, ...(props.components || {}) }} 
    />
  )
}