import type { Preview } from '@storybook/react';
import type { StoryContext } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Select a theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'neutral', icon: 'circle', title: 'Neutral' },
          { value: 'accent', icon: 'paintbrush', title: 'Accent' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
          { value: 'high-contrast-light', icon: 'circlehollow', title: 'High Contrast Light' },
          { value: 'high-contrast-dark', icon: 'contrast', title: 'High Contrast Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context: StoryContext) => {
      const { theme } = context.globals;

      const themeConfig: Record<string, { class: string; colorScheme: string }> = {
        light: { class: '', colorScheme: 'light' },
        neutral: { class: 'neutral', colorScheme: 'light' },
        accent: { class: 'accent', colorScheme: 'light' },
        dark: { class: 'dark', colorScheme: 'dark' },
        'high-contrast-light': { class: 'high-contrast-light', colorScheme: 'light' },
        'high-contrast-dark': { class: 'high-contrast-dark', colorScheme: 'dark' },
      };

      const { class: themeClass, colorScheme } = themeConfig[theme] || { class: '', colorScheme: 'light' };

      if (typeof document !== 'undefined') {
        const htmlElement = document.documentElement;

        // Remove all theme classes
        htmlElement.classList.remove('dark', 'neutral', 'accent', 'high-contrast-light', 'high-contrast-dark');

        // Add selected theme class if it exists
        if (themeClass) {
          htmlElement.classList.add(themeClass);
        }

        htmlElement.style.colorScheme = colorScheme;

        // Set background and color on body to ensure they fill the viewport
        document.body.style.backgroundColor = 'hsl(var(--background) / var(--background-alpha, 1))';
        document.body.style.color = 'hsl(var(--foreground))';
        document.body.style.minHeight = '100vh';
      }

      return (
        <div className={themeClass} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '2rem',
          minHeight: '100vh',
          width: '100%'
        }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
