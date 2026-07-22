import { ComponentProps, isValidElement, ReactNode } from 'react'
import BasePre from 'pliny/ui/Pre'
import Mermaid from './Mermaid'

type CodeChildProps = {
  className?: string
  children?: ReactNode
}

function getTextContent(value: ReactNode): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(getTextContent).join('')
  }

  if (isValidElement(value)) {
    return getTextContent((value.props as CodeChildProps).children)
  }

  return ''
}

function getMermaidChart(children: ReactNode): string | null {
  if (!isValidElement(children)) {
    return null
  }

  const { className, children: codeChildren } = children.props as CodeChildProps

  if (!className || !className.split(' ').includes('language-mermaid')) {
    return null
  }

  const chart = getTextContent(codeChildren).trim()
  return chart || null
}

type PreProps = ComponentProps<typeof BasePre>

export default function Pre(props: PreProps) {
  const chart = getMermaidChart(props.children)

  if (chart) {
    return <Mermaid chart={chart} />
  }

  return <BasePre {...props} />
}
