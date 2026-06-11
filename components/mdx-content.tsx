import { JSX } from 'react'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import Counter from '@/components/counter'

function Code(props: React.HTMLAttributes<HTMLElement>) {
    const { children, ...restProps } = props
    const codeHTML = highlight(String(children))
        .replace(/var\(--sh-identifier\)/g, '#354150')
        .replace(/var\(--sh-keyword\)/g, '#b84343')
        .replace(/var\(--sh-string\)/g, '#007a6e')
        .replace(/var\(--sh-class\)/g, '#5b4fc2')
        .replace(/var\(--sh-property\)/g, '#2563eb')
        .replace(/var\(--sh-entity\)/g, '#0d9488')
        .replace(/var\(--sh-jsxliterals\)/g, '#9333ea')
        .replace(/var\(--sh-sign\)/g, '#4b5563')
        .replace(/var\(--sh-comment\)/g, '#657080')
    return (
        <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...restProps} />
    )
}

const components = {
    code: Code,
    Counter
}

export default function MDXContent(
    props: JSX.IntrinsicAttributes & MDXRemoteProps
) {
    return (
        <MDXRemote
            {...props}
            options={{
                mdxOptions: {
                    remarkPlugins: [remarkGfm]
                }
            }}
            components={{ ...components, ...(props.components || {}) }}
        />
    )
}
