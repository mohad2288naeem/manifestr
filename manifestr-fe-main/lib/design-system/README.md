# Manifestr Design System

This design system is extracted from the Figma Manifestr project and provides a consistent foundation for building UI components.

## Overview

The design system includes:
- **Colors**: Base colors, semantic colors, and miscellaneous colors
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale (0, 4px, 8px, 12px, 16px, 24px, 32px)
- **Border Radius**: Standard border radius values (6px, 12px)
- **Breakpoints**: Responsive breakpoints

## Usage

### Tailwind CSS Classes

The design system is integrated with Tailwind CSS. You can use Tailwind classes directly:

```jsx
// Colors
<div className="bg-base-background text-base-foreground border-base-border">
  Content
</div>

// Typography
<p className="text-b1-semibold">Heading</p>
<p className="text-body-base">Body text</p>

// Spacing
<div className="p-4 gap-6">Content</div>

// Border Radius
<div className="rounded-md">Card</div>
<div className="rounded-xl">Large card</div>
```

### CSS Variables

CSS variables are available globally:

```css
.my-component {
  background-color: var(--base-background);
  color: var(--base-foreground);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
}
```

### JavaScript/TypeScript Constants

Import design system constants:

```js
import { colors, spacing, borderRadius, typography } from '../../../lib/design-system'

// Use in inline styles or calculations
const style = {
  backgroundColor: colors.base.background,
  padding: spacing[4],
  borderRadius: borderRadius.md,
}
```

### Utility Functions

Use utility functions for dynamic values:

```js
import { getColor, getSpacing, getBorderRadius } from '../../../lib/design-system/utils'

const color = getColor('base.foreground')
const spacing = getSpacing(4)
const radius = getBorderRadius('md')
```

## Typography Scale

### Labels (L)
- **L1 Semibold**: 16px / 24px / 600
- **L1 Medium**: 16px / 24px / 500
- **L2 Semibold**: 14px / 20px / 600
- **L2 Medium**: 14px / 20px / 500
- **L2 Regular**: 14px / 20px / 400

### Body (B)
- **B1 Semibold**: 18px / 28px / 600
- **B1 Medium**: 18px / 28px / 500
- **B2 Regular**: 16px / 24px / 400
- **B2 Medium**: 16px / 24px / 500
- **Body Base**: 16px / 1.4 / 400
- **Body Small**: 14px / 1.4 / 400

### Captions (C)
- **C1 Medium**: 12px / 18px / 500
- **C1 Regular**: 12px / 18px / 400

### Titles (T)
- **T1 Semibold**: 20px / 30px / 600

## Color Palette

### Base Colors
- `base-background`: #ffffff (White background)
- `base-foreground`: #18181b (Primary text)
- `base-muted`: #f4f4f5 (Muted background)
- `base-muted-foreground`: #71717a (Muted text)
- `base-muted-foreground+`: #52525b (Darker muted text)
- `base-secondary`: #18181b (Secondary background)
- `base-secondary-foreground`: #ffffff (Secondary text)
- `base-border`: #e4e4e7 (Border color)
- `base-card-foreground`: #09090b (Card text)

## Spacing Scale

- `0`: 0px
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px
- `6`: 24px
- `8`: 32px

## Border Radius

- `md`: 6px (Medium)
- `xl`: 12px (Extra large)

## Best Practices

1. **Use Tailwind classes** when possible for better performance and consistency
2. **Use CSS variables** for dynamic styling or when Tailwind doesn't cover your needs
3. **Follow the typography scale** - don't create custom font sizes
4. **Use the spacing scale** - maintain consistent spacing throughout
5. **Stick to the color palette** - use semantic color names (base-foreground, base-muted, etc.)

## Examples

### Button Component

```jsx
<button className="bg-base-secondary text-base-secondary-foreground px-4 py-2 rounded-md text-l2-medium">
  Click me
</button>
```

### Card Component

```jsx
<div className="bg-base-background border border-base-border rounded-xl p-6">
  <h3 className="text-b1-semibold mb-2">Card Title</h3>
  <p className="text-body-base text-base-muted-foreground">Card content</p>
</div>
```

### Typography Example

```jsx
<h1 className="text-t1-semibold">Main Heading</h1>
<h2 className="text-b1-semibold">Section Heading</h2>
<p className="text-body-base">Regular paragraph text</p>
<p className="text-body-small text-base-muted-foreground">Small supporting text</p>
```

