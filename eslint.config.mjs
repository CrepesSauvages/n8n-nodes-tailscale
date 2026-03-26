import { config } from '@n8n/node-cli/eslint';

export default [
    ...config,
    {
        files: ['tests/**/*.ts', 'vitest.config.ts'],
        rules: {
            '@n8n/community-nodes/no-restricted-imports': 'off',
        },
    },
    {
        // The no-credential-reuse rule has a Windows path-traversal bug that prevents
        // it from finding package.json when the project root is on a drive letter path
        // (e.g. D:/...). The credentials ARE correctly declared in this package.
        files: ['nodes/**/*.ts'],
        rules: {
            '@n8n/community-nodes/no-credential-reuse': 'off',
        },
    },
];
