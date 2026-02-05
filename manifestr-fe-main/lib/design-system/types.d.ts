/**
 * Manifestr Design System TypeScript Types
 */

export type ColorPath =
  | 'base.background'
  | 'base.foreground'
  | 'base.muted'
  | 'base.muted-foreground'
  | 'base.muted-foreground+'
  | 'base.secondary'
  | 'base.secondary-foreground'
  | 'base.border'
  | 'base.card-foreground'
  | 'base.transparent'
  | 'zinc.200'
  | 'gray.300'
  | 'miscellaneous.floating-tab-text-unselected'
  | 'miscellaneous.keyboard-emoji-mic'

export type SpacingKey = 0 | 1 | 2 | 3 | 4 | 6 | 8

export type BorderRadiusKey = 'md' | 'xl'

export type TypographyVariant =
  | 'body-base'
  | 'body-small'
  | 'l1-semibold'
  | 'l1-medium'
  | 'l2-semibold'
  | 'l2-medium'
  | 'l2-regular'
  | 'b1-semibold'
  | 'b1-medium'
  | 'b2-regular'
  | 'b2-medium'
  | 'c1-medium'
  | 'c1-regular'
  | 't1-semibold'

export interface TypographyStyle {
  size: string
  lineHeight: string
  fontWeight: string
}

export interface DesignTokens {
  colors: {
    base: {
      background: string
      foreground: string
      muted: string
      'muted-foreground': string
      'muted-foreground+': string
      secondary: string
      'secondary-foreground': string
      border: string
      'card-foreground': string
      transparent: string
    }
    zinc: {
      200: string
    }
    gray: {
      300: string
    }
    miscellaneous: {
      'floating-tab-text-unselected': string
      'keyboard-emoji-mic': string
    }
  }
  spacing: Record<SpacingKey, string>
  borderRadius: Record<BorderRadiusKey, string>
  typography: {
    fontFamily: {
      sans: string[]
      title: string[]
    }
    fontSize: Record<TypographyVariant, TypographyStyle>
  }
  breakpoints: {
    xl: string
  }
}

