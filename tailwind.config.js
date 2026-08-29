/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#f8fafc',
          dim: '#f1f5f9',
          bright: '#ffffff',
          container: {
            lowest: '#ffffff',
            low: '#f8fafc',
            DEFAULT: '#f1f5f9',
            high: '#e2e8f0',
            highest: '#cbd5e1',
          }
        },
        'on-surface': {
          DEFAULT: '#0f172a',
          variant: '#475569',
          muted: '#94a3b8',
        },
        primary: {
          DEFAULT: '#2563eb',
          container: '#eff6ff',
          hover: '#1d4ed8',
          'on-container': '#1d4ed8',
        },
        accent: {
          success: {
            DEFAULT: '#10b981',
            container: '#ecfdf5',
            on: '#047857',
          },
          warning: {
            DEFAULT: '#f59e0b',
            container: '#fffbeb',
            on: '#b45309',
          },
          error: {
            DEFAULT: '#ef4444',
            container: '#fef2f2',
            on: '#b91c1c',
          },
        },
        outline: {
          DEFAULT: '#e2e8f0',
          variant: '#cbd5e1',
          focus: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'level-1': '0px 1px 3px rgba(15, 23, 42, 0.04), 0px 1px 2px rgba(15, 23, 42, 0.02)',
        'level-2': '0px 12px 24px -4px rgba(15, 23, 42, 0.08), 0px 4px 6px -2px rgba(15, 23, 42, 0.03)',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}