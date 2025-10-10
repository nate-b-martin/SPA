import { JSX } from "react"
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc"
import Counter from "@/components/counter"

function Code(props: React.HTMLAttributes<HTMLElement>) {
  const { children, ...restProps } = props
  const codeHTML = highlight(String(children))
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...restProps} />
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