import baseConfig from '@repo/tailwind-config/tailwindConfig';

const config = {
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        'primary':'#319535',
        'secondary': '#3b82f6',
        'danger':'#ef4444',
        'primary-bg': '#01020a',
        'secondary-bg': '#040a14',
        'primary-btn': '#f97316',
        'primary-border': '#44403c',
        'primary-text': '#ffffff',
        'secondary-text': '#d1d5db',
        'tertiary-bg': '#0c0e18',
      },
    },
  },
};

export default config;
