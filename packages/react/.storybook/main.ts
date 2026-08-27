import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

// Storybook loads this config as ESM: derive __dirname via import.meta.url.
const storybookDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|tsx|ts)',
    '../../react-app/src/**/*.stories.@(js|jsx|mjs|tsx|ts)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen',
  },
  viteFinal: async (config, { configType }) => {
    // This Storybook composes both packages: @kala-ui/react (this package)
    // and @kala-ui/react-app (sibling stories pulled in via the glob above).
    // Always resolve @kala-ui/react subpath imports to core SOURCE so dev
    // HMR works and static builds never depend on a stale dist.
    const coreSrc = resolve(join(storybookDir, '../src'));
    return mergeConfig(config, {
      resolve: {
        alias: [
          {
            find: /^@kala-ui\/react$/,
            replacement: join(coreSrc, 'index.ts'),
          },
          {
            find: /^@kala-ui\/react\/lib\/utils$/,
            replacement: join(coreSrc, 'lib/utils.ts'),
          },
          {
            find: /^@kala-ui\/react\/(.+)$/,
            replacement: join(coreSrc, 'components/$1'),
          },
        ],
      },
      server: {
        fs: {
          allow: [resolve(join(storybookDir, '../..'))],
        },
      },
    });
  },
};

export default config;
