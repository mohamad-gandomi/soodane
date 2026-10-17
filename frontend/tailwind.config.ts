import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sn: {
          green: 'var(--sn-green, #17815a)',
          deep: 'var(--sn-deep, #0f6847)',
          pale: 'var(--sn-pale, #eff8f3)',
          text: 'var(--sn-text, #263a30)',
          muted: 'var(--sn-muted, #77867e)',
          line: 'var(--sn-line, #e0e8e3)',
          bg: 'var(--sn-bg, #f4f6f5)',
          danger: 'var(--sn-danger, #bd5a5a)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'var(--sn-green, #17815a)',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'var(--sn-pale, #eff8f3)',
          foreground: 'var(--sn-green, #17815a)',
        },
        destructive: {
          DEFAULT: 'var(--sn-danger, #bd5a5a)',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f4f7f5',
          foreground: 'var(--sn-muted, #77867e)',
        },
        accent: {
          DEFAULT: 'var(--sn-pale, #eff8f3)',
          foreground: 'var(--sn-deep, #0f6847)',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: 'var(--sn-text, #263a30)',
        },
      },
      borderRadius: {
        lg: 'var(--radius, 13px)',
        md: 'calc(var(--radius, 13px) - 2px)',
        sm: 'calc(var(--radius, 13px) - 4px)',
      },
      fontFamily: {
        sans: [
          'IRANSansXFaNum',
          'IRANSansX',
          'IRANSans',
          'Tahoma',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'IRANSansXFaNum',
          'IRANSansX',
          'ui-monospace',
          'monospace',
        ],
        en: [
          'IRANSansX',
          'system-ui',
          'sans-serif',
        ],
      },
      maxWidth: {
        app: '430px',
      },
    },
  },
  plugins: [],
};

export default config;
