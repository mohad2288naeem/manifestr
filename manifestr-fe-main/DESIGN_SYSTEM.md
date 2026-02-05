# Manifestr Design System Setup

## ✅ Complete Design System Implementation

This document outlines the complete design system setup extracted from the Figma Manifestr project.

## 📁 Project Structure

```
manifestr-fe/
├── lib/
│   └── design-system/
│       ├── constants.js      # Design tokens (colors, spacing, typography)
│       ├── utils.js          # Utility functions
│       ├── types.d.ts        # TypeScript type definitions
│       ├── index.js          # Central export
│       └── README.md          # Detailed documentation
├── components/
│   └── ui/
│       ├── Button.jsx        # Example Button component
│       └── Card.jsx           # Example Card component
├── styles/
│   └── global.css             # CSS variables and utility classes
└── tailwind.config.js         # Tailwind configuration with design tokens
```

## 🎨 Design Tokens Extracted

### Colors
- **Base Colors**: background, foreground, muted, border, card-foreground
- **Semantic Colors**: secondary, muted-foreground variants
- **Utility Colors**: zinc, gray, miscellaneous

### Typography
- **Font Family**: Inter (primary), Roboto (titles)
- **Scale**: Labels (L1, L2), Body (B1, B2), Captions (C1), Titles (T1)
- **Weights**: Regular (400), Medium (500), Semibold (600)

### Spacing
- Scale: 0, 4px, 8px, 12px, 16px, 24px, 32px

### Border Radius
- Medium: 6px
- Extra Large: 12px

## 🚀 Usage Examples

### Using Tailwind Classes

```jsx
// Colors
<div className="bg-base-background text-base-foreground">
  Content
</div>

// Typography
<h1 className="text-t1-semibold">Title</h1>
<p className="text-body-base">Body text</p>

// Spacing & Layout
<div className="p-4 gap-6 flex flex-col">
  <div className="rounded-xl border border-base-border">
    Card content
  </div>
</div>
```

### Using CSS Variables

```css
.custom-component {
  background: var(--base-background);
  color: var(--base-foreground);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
}
```

### Using JavaScript Constants

```js
import { colors, spacing } from '../../../lib/design-system'

const style = {
  backgroundColor: colors.base.background,
  padding: spacing[4],
}
```

## 📦 Components

Example components are provided in `components/ui/`:
- **Button**: Primary, secondary, and ghost variants
- **Card**: Standard card component with design system styling

## ✨ Features

1. **Fully Integrated**: Works seamlessly with Tailwind CSS
2. **Type-Safe**: TypeScript definitions included
3. **CSS Variables**: Available globally for dynamic styling
4. **Utility Functions**: Helper functions for programmatic access
5. **Documentation**: Comprehensive README in design-system folder
6. **Next.js Optimized**: Follows Next.js best practices

## 🎯 Next Steps

1. Start using the design system classes in your components
2. Create additional UI components following the examples
3. Reference `lib/design-system/README.md` for detailed usage
4. All design tokens match the Figma design exactly

## 📝 Notes

- All colors, spacing, and typography values are extracted directly from Figma
- The design system is production-ready and follows Next.js conventions
- CSS variables are available globally for maximum flexibility
- Tailwind classes are configured and ready to use

---

**Design System Version**: 1.0.0  
**Last Updated**: Based on Figma Manifestr project  
**Status**: ✅ Complete and Ready to Use

