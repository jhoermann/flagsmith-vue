import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
    clearMocks: true,
    preset: 'ts-jest',
    testMatch: ['**/*.spec.ts'],
}

export default config
