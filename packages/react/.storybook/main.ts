import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join } from 'node:path';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|tsx|ts)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen',
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return mergeConfig(config, {
        resolve: {
          alias: {
            '@': join(dirname(__dirname), '../src'),
          },
        },
      });
    }
    return config;
  },
};

export default config;
