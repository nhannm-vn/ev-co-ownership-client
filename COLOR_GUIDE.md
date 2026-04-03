# EVShare Color System Guide

## 🎨 Color Philosophy

EVShare uses a **modern, tech-forward color palette** inspired by electric vehicles and clean energy:
- **Primary**: Emerald/Teal greens (representing sustainability and EV technology)
- **Secondary**: Cyan/Blue (representing innovation and technology)
- **Accent**: Indigo (adding depth and sophistication)

## 📋 Color Palette

### Primary Brand Colors
- **Brand-500** (`#1CC29F`): Main brand color, used for logos and key elements
- **Brand-600** (`#17a984`): Used for buttons and interactive elements
- **Brand-400** (`#34d399`): Used in gradients and highlights

### Gradient Combinations

#### Standard Gradients
```css
/* Primary gradient (most common) */
bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600

/* Secondary gradient (alternative) */
bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-600

/* Button gradient */
bg-gradient-to-r from-emerald-400 to-cyan-500
```

## 🎯 Usage Guidelines

### 1. Backgrounds
- **Page backgrounds**: Use primary gradient (`from-emerald-400 via-cyan-500 to-indigo-600`)
- **Card backgrounds**: Use `bg-white/10 backdrop-blur-xl` for glassmorphism effect
- **Modal backgrounds**: Use `bg-white` with shadow

### 2. Buttons
- **Primary buttons**: `bg-gradient-to-r from-emerald-400 to-cyan-500`
- **Hover state**: `hover:from-emerald-300 hover:to-cyan-400`
- **Secondary buttons**: `bg-gradient-to-r from-cyan-400 to-sky-500`

### 3. Text Colors
- **Primary text**: `text-gray-900` (on light backgrounds)
- **Secondary text**: `text-gray-700`
- **Muted text**: `text-gray-500`
- **Inverse text**: `text-white` (on dark/gradient backgrounds)
- **Brand text**: `text-brand-600` or `text-emerald-600`

### 4. Borders
- **Default**: `border-gray-200`
- **Brand**: `border-emerald-400` or `border-brand-500`
- **Glassmorphism**: `border-white/40`

### 5. Shadows
- **Cards**: `shadow-xl` or `shadow-[0_8px_24px_rgba(0,0,0,0.25)]`
- **Buttons**: `shadow-lg` with colored shadow for brand buttons
- **Glow effects**: `shadow-[0_0_20px_rgba(6,182,212,0.6)]`

## 🔍 Contrast & Accessibility

### Text Contrast Ratios
- **Primary text on white**: ✅ WCAG AAA (21:1)
- **Primary text on gradient**: ⚠️ May need adjustment - use `text-white` or `text-gray-900` with backdrop
- **Brand text on white**: ✅ WCAG AA (4.5:1)

### Recommendations
1. Always use `text-white` on gradient backgrounds
2. Use `backdrop-blur` for better text readability
3. Test contrast with tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## 🚀 Migration Guide

### Replacing Hardcoded Colors

**Before:**
```tsx
className="bg-[#17a984]"
```

**After:**
```tsx
className="bg-brand-600"
// or
className="bg-emerald-600"
```

**Before:**
```tsx
className="bg-gradient-to-r from-ev to-cyan-500"
```

**After:**
```tsx
className="bg-gradient-to-r from-brand-400 to-cyan-500"
// or use the gradient constant
import { getGradient } from '@/constants/colors'
className={getGradient('button')}
```

## 📦 Import Colors

```typescript
import { colors, componentColors, getGradient } from '@/constants/colors'

// Use predefined colors
<div className={`bg-${colors.primary[500]}`}>

// Use component colors
<button className={componentColors.button.primary}>

// Use gradients
<div className={getGradient('primary')}>
```

## 🎨 Design Tokens

All colors are available as Tailwind classes:
- `bg-brand-500`, `text-brand-600`, `border-brand-400`
- `bg-success-DEFAULT`, `text-error-dark`
- Standard Tailwind colors: `emerald-*`, `cyan-*`, `indigo-*`, etc.

## ✅ Best Practices

1. **Consistency**: Always use the defined color system
2. **Semantic naming**: Use semantic colors (success, error, warning) for status
3. **Gradients**: Stick to predefined gradient combinations
4. **Contrast**: Ensure WCAG AA compliance (4.5:1 for normal text)
5. **Dark mode**: Consider future dark mode support (colors are ready)

## 🔄 Future Enhancements

- [ ] Dark mode color variants
- [ ] Animation color transitions
- [ ] Theme customization
- [ ] Color accessibility testing automation

