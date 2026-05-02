import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettierConfig,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        files: [
            'app/**/page.tsx',
            'app/**/layout.tsx',
            'components/**/*.{ts,tsx}',
        ],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@/lib/core/prisma/client',
                            message:
                                'Use provider-backed services from lib/core/services instead of importing Prisma in rendering code.',
                        },
                    ],
                },
            ],
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        'prisma/migrations/**',
    ]),
])

export default eslintConfig
