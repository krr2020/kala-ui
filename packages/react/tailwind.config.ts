import type { Config } from 'tailwindcss';
import { baseConfig } from './src/config/tailwind-base';

const config: Config = {
  ...baseConfig,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
} as Config;

export default config;
