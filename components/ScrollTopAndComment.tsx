'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)
  const sentinelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    // Show the controls once the top of the page is scrolled out of view,
    // without a per-frame scroll listener.
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), {
      rootMargin: '-50px 0px 0px 0px',
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }
  const handleScrollToComment = () => {
    document.getElementById('comment')?.scrollIntoView()
  }

  return (
    <>
      <span ref={sentinelRef} aria-hidden="true" className="block" />
      <div className={`fixed bottom-8 right-8 ${show ? 'flex' : 'hidden'} flex-col gap-3`}>
        {siteMetadata.comments?.provider && (
          <button
            aria-label="Scroll To Comment"
            onClick={handleScrollToComment}
            className="rounded-full bg-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
          </button>
        )}
        <button
          aria-label="Scroll To Top"
          onClick={handleScrollTop}
          className="rounded-full bg-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  )
}

export default ScrollTopAndComment
