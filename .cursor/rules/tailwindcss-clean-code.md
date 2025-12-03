---
alwaysApply: true
applyWhen: "fileExtension:css,scss,sass,tsx,jsx,html,php"
priority: medium
description: "TailwindCSS styling and design system standards"
---

# TailwindCSS Clean Code Rules

## Utility-First Approach

### Class Organization
- Use Tailwind's utility classes consistently
- Combine related utilities logically
- Avoid arbitrary values unless necessary
- Use semantic class names for component styling
- Implement responsive design with breakpoint prefixes

### Class Ordering
- Group classes by category: layout, spacing, typography, colors, etc.
- Use consistent ordering within categories
- Implement alphabetical ordering within groups
- Use multi-line format for complex class combinations

## Responsive Design Standards

### Breakpoint Usage
- Use Tailwind's default breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Implement mobile-first responsive design
- Avoid excessive breakpoint usage
- Use responsive utilities consistently across components
- Test designs across all breakpoint ranges

### Responsive Patterns
- Use responsive flexbox/grid layouts
- Implement responsive typography scaling
- Use responsive spacing utilities
- Implement responsive component variants
- Test touch targets on mobile devices

## Component Architecture

### Component Class Structure
- Use `@apply` directive for component-specific styles
- Create reusable component classes
- Implement component variants with modifiers
- Use CSS custom properties for dynamic values
- Maintain component style isolation

### CSS Organization
- Use Tailwind's layer system: `@base`, `@components`, `@utilities`
- Implement proper CSS cascade management
- Use CSS custom properties for theme values
- Maintain consistent naming conventions
- Document component style APIs

## Theme & Design System

### Design Token Implementation
- Define design tokens in `tailwind.config.js`
- Use consistent color palettes and scales
- Implement typography scales and spacing scales
- Define component-specific design tokens
- Maintain design token documentation

### Theme Customization
- Extend Tailwind's default theme appropriately
- Use CSS custom properties for dynamic theming
- Implement dark mode support with proper tokens
- Maintain theme consistency across components
- Use theme validation and type safety

## Performance Optimization

### CSS Optimization
- Use Tailwind's purging for production builds
- Implement proper CSS ordering for optimal cascade
- Minimize CSS custom properties usage
- Use CSS-in-JS sparingly and strategically
- Implement critical CSS for above-the-fold content

### Bundle Size Management
- Use `@apply` for repeated utility combinations
- Implement component extraction for reusable styles
- Use Tailwind's `important` modifier judiciously
- Monitor CSS bundle size and optimize accordingly
- Use dynamic imports for conditionally loaded styles

## Accessibility Standards

### Color Contrast
- Ensure proper color contrast ratios (WCAG 2.1 AA standard)
- Implement focus indicators with visible contrast
- Use semantic color utilities appropriately
- Test color combinations for accessibility
- Provide alternative color schemes for color-blind users

### Focus Management
- Implement visible focus indicators (`focus:` utilities)
- Use proper focus order and tab sequences
- Implement focus trapping for modals and overlays
- Use `sr-only` for screen reader only content
- Test keyboard navigation thoroughly

## Typography Best Practices

### Font Scale Implementation
- Use Tailwind's typography scale consistently
- Implement responsive typography scaling
- Maintain proper line heights and letter spacing
- Use semantic text utilities (`text-`, `font-`, `leading-`)
- Implement proper text hierarchy

### Text Styling Standards
- Use consistent font families and weights
- Implement proper text color hierarchies
- Use appropriate text sizes for different contexts
- Implement proper text alignment and spacing
- Use text utilities for emphasis and decoration

## Layout & Spacing

### Spacing Scale Usage
- Use Tailwind's spacing scale consistently
- Implement proper margin and padding patterns
- Use logical spacing utilities (`space-`, `gap-`)
- Maintain consistent spacing rhythms
- Implement responsive spacing adjustments

### Layout Patterns
- Use Flexbox utilities for flexible layouts
- Use Grid utilities for complex layouts
- Implement proper container and wrapper patterns
- Use positioning utilities appropriately
- Maintain consistent layout patterns across components

## Component Styling Patterns

### Button Components
- Use consistent button sizing and spacing
- Implement proper button states (hover, focus, disabled)
- Use semantic color schemes for button variants
- Implement accessible button styling
- Maintain consistent button interaction patterns

### Form Components
- Implement consistent form field styling
- Use proper form validation state styling
- Implement accessible form field focus states
- Use consistent form spacing and alignment
- Implement proper form field sizing

### Card Components
- Use consistent card padding and spacing
- Implement proper card shadow and border patterns
- Use semantic card color schemes
- Implement responsive card layouts
- Maintain consistent card interaction patterns

## Animation & Interaction

### Transition Implementation
- Use Tailwind's transition utilities consistently
- Implement proper transition durations and easing
- Use transition groups for coordinated animations
- Implement reduced motion preferences
- Test animations for performance impact

### Interactive States
- Implement proper hover, focus, and active states
- Use consistent state styling patterns
- Implement disabled state styling
- Use appropriate cursor utilities
- Test interactive states across all components

## CSS Custom Properties

### Variable Organization
- Use CSS custom properties for theme values
- Implement proper variable naming conventions
- Use fallback values for custom properties
- Maintain variable documentation
- Implement proper variable scoping

### Dynamic Theming
- Use CSS custom properties for runtime theming
- Implement theme switching mechanisms
- Use proper variable inheritance
- Maintain theme consistency
- Test theme switching across components

## Code Quality Standards

### Class Naming Conventions
- Use kebab-case for custom class names
- Implement BEM methodology for complex components
- Use descriptive, semantic class names
- Avoid generic class names (`btn`, `card`)
- Maintain consistent naming patterns

### Code Organization
- Use consistent indentation and formatting
- Implement proper comment usage
- Maintain CSS file organization
- Use CSS preprocessors appropriately
- Implement proper version control practices

## Testing & Maintenance

### Visual Testing
- Implement visual regression testing
- Test component styling across browsers
- Implement responsive design testing
- Test accessibility compliance
- Maintain visual test baselines

### Style Guide Maintenance
- Document component styling patterns
- Maintain design system documentation
- Implement style guide automation
- Update documentation with design changes
- Communicate style changes to team members

## Integration with Frameworks

### React Integration
- Use className props appropriately
- Implement conditional styling patterns
- Use CSS modules or styled-components when needed
- Maintain component style isolation
- Implement proper style prop handling

### Laravel Integration
- Use consistent Blade template styling
- Implement proper asset compilation
- Use Laravel Mix for CSS processing
- Maintain consistent styling across PHP templates
- Implement proper CSS caching strategies

## Performance Monitoring

### CSS Performance Metrics
- Monitor CSS bundle size and loading performance
- Track unused CSS with coverage tools
- Implement CSS performance budgets
- Monitor runtime style recalculation
- Optimize CSS delivery and caching

### User Experience Metrics
- Track Cumulative Layout Shift (CLS)
- Monitor First Contentful Paint (FCP)
- Implement proper loading states
- Optimize font loading strategies
- Maintain visual stability during loading
