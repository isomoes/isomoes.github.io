'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useEffect, useRef, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || loadComments) return
    // Defer the giscus embed until the reader approaches the comments.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadComments(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadComments])

  if (!siteMetadata.comments?.provider) {
    return null
  }

  return (
    <div ref={ref}>
      {loadComments && <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />}
    </div>
  )
}
