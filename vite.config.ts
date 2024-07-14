import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    cache: false,
    coverage: {
      provider: 'v8',
      exclude: ['**/main/**', '**/prisma/**']
    }
  }
})
