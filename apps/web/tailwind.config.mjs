import baseConfig from '@repo/tailwind-config/tailwindConfig';

const config = {
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        'secondary': '#3b82f6',
        'primary-bg': '#01020a',
        'primary-btn': '#f97316',
        'primary-border': '#44403c',
        'primary-text': '#ffffff',
        'secondary-text': '#d1d5db',
      },
    },
  },
};

export default config;
