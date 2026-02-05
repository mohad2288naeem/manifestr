/**
 * Manifestr Design System Constants
 * Extracted from Figma design tokens
 */

export const colors = {
  base: {
    background: '#ffffff',
    foreground: '#18181b',
    muted: '#f4f4f5',
    'muted-foreground': '#71717a',
    'muted-foreground+': '#52525b',
    secondary: '#18181b',
    'secondary-foreground': '#ffffff',
    border: '#e4e4e7',
    'card-foreground': '#09090b',
    transparent: 'rgba(255, 255, 255, 0)',
  },
  zinc: {
    200: '#e4e4e7',
  },
  gray: {
    300: '#d1d5db',
  },
  miscellaneous: {
    'floating-tab-text-unselected': '#090909',
    'keyboard-emoji-mic': 'rgba(27, 31, 38, 0.72)',
  },
}

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
}

export const borderRadius = {
  md: '6px',
  xl: '12px',
}

export const typography = {
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ],
    title: ['Roboto', 'sans-serif'],
    'castoro-titling': ['Castoro Titling', 'serif'],
    'monte-carlo': ['MonteCarlo', 'cursive'],
  },
  fontSize: {
    'body-base': { size: '16px', lineHeight: '1.4', fontWeight: '400' },
    'body-small': { size: '14px', lineHeight: '1.4', fontWeight: '400' },
    'l1-semibold': { size: '16px', lineHeight: '24px', fontWeight: '600' },
    'l1-medium': { size: '16px', lineHeight: '24px', fontWeight: '500' },
    'l2-semibold': { size: '14px', lineHeight: '20px', fontWeight: '600' },
    'l2-medium': { size: '14px', lineHeight: '20px', fontWeight: '500' },
    'l2-regular': { size: '14px', lineHeight: '20px', fontWeight: '400' },
    'b1-semibold': { size: '18px', lineHeight: '28px', fontWeight: '600' },
    'b1-medium': { size: '18px', lineHeight: '28px', fontWeight: '500' },
    'b2-regular': { size: '16px', lineHeight: '24px', fontWeight: '400' },
    'b2-medium': { size: '16px', lineHeight: '24px', fontWeight: '500' },
    'c1-medium': { size: '12px', lineHeight: '18px', fontWeight: '500' },
    'c1-regular': { size: '12px', lineHeight: '18px', fontWeight: '400' },
    't1-semibold': { size: '20px', lineHeight: '30px', fontWeight: '600' },
  },
}

export const breakpoints = {
  xl: '1280px',
}

// Design system tokens for easy access
export const tokens = {
  colors,
  spacing,
  borderRadius,
  typography,
  breakpoints,
}

