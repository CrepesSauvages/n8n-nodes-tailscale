import { config } from '@n8n/node-cli/eslint';

export default [
    ...config,
    {
        files: ['tests/**/*.ts', 'vitest.config.ts'],
        rules: {
            '@n8n/community-nodes/no-restricted-imports': 'off',
        },
    },
];
