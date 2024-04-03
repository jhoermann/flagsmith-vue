import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
    clearMocks: true,
    preset: 'ts-jest',
    testMatch: ['**/*.spec.ts'],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons'],
    },
}

export default config
