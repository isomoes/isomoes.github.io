'use client'

import { useEffect, useId, useState } from 'react'
import { useTheme } from 'next-themes'

type MermaidProps = {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState('')
  const [hasError, setHasError] = useState(false)
  const id = useId().replace(/:/g, '')
  const { resolvedTheme } = useTheme()
  const mermaidTheme = resolvedTheme === 'dark' ? 'dark' : 'default'

  useEffect(() => {
    let isMounted = true

    async function renderChart() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: mermaidTheme,
          themeVariables: {
            background: 'transparent',
          },
        })

        const { svg } = await mermaid.render(`mermaid-${id}`, chart)

        if (isMounted) {
          setSvg(svg)
          setHasError(false)
        }
      } catch {
        if (isMounted) {
          setHasError(true)
        }
      }
    }

    renderChart()

    return () => {
      isMounted = false
    }
  }, [chart, id, mermaidTheme])

  if (hasError) {
    return (
      <pre className="not-prose my-6 overflow-x-auto rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {chart}
      </pre>
    )
  }

  if (!svg) {
    return (
      <div className="not-prose my-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        Rendering Mermaid diagram...
      </div>
    )
  }

  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div
        className="flex justify-center [&_svg]:block"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
