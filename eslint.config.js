// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['commitlint.config.js', 'eslint.config.js'],
                    defaultProject: './tsconfig.json',
                },
            },
        },
    },
    {
        files: ['eslint.config.js'],
        rules: {
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
        },
    },
    { ignores: ['coverage', '**/*.json', 'node_modules', 'dist'] }
)
