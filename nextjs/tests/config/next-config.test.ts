import { afterEach, describe, expect, it, vi } from 'vitest'

const originalEnv = { ...process.env }

async function loadNextConfig() {
  vi.resetModules()
  const module = await import('../../next.config.js')
  return ('default' in module ? module.default : module) as () => Record<string, unknown>
}

afterEach(() => {
  process.env = { ...originalEnv }
})

describe('next.config export settings', () => {
  it('enables trailing slash output for static exports', async () => {
    process.env = { ...originalEnv, EXPORT: '1' }

    const createConfig = await loadNextConfig()

    expect(createConfig().trailingSlash).toBe(true)
  })
})
