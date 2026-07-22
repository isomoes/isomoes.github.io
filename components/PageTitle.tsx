import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl md:text-4xl">
      {children}
    </h1>
  )
}
