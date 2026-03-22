import { describe, expect, it } from 'vitest'
import { getPaginationBasePath } from '@/lib/pagination'

describe('getPaginationBasePath', () => {
  it('removes trailing paginated segments from static export paths', () => {
    expect(getPaginationBasePath('/en/tags/ai/page/2/')).toBe('en/tags/ai')
  })

  it('preserves non-paginated paths while normalizing trailing slashes', () => {
    expect(getPaginationBasePath('/en/tags/ai/')).toBe('en/tags/ai')
    expect(getPaginationBasePath('/en/blog/page/2')).toBe('en/blog')
  })
})
