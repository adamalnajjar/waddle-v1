---
alwaysApply: true
applyWhen: "fileExtension:tsx,ts,jsx,js"
priority: high
description: "React and TypeScript clean code standards for frontend development"
---

# React & TypeScript Clean Code Rules

## Component Structure & Organization

### File Naming & Structure
- Use PascalCase for component files: `UserProfile.tsx`, `MeetingCard.tsx`
- Use kebab-case for utility files: `api-client.ts`, `validation-utils.ts`
- Group related files in folders with index.ts exports
- Use descriptive, domain-specific names over generic ones

### Component Patterns
- Prefer functional components with hooks over class components
- Use custom hooks for shared logic extraction
- Implement compound components for complex UI patterns
- Use render props sparingly, prefer hooks or compound components

### Props & State Management
- Define strict TypeScript interfaces for all props
- Use `React.FC<Props>` or explicit return types
- Avoid prop drilling - use Context API or state management libraries for deep prop passing
- Implement proper default props with `defaultProps` or default parameters

## TypeScript Best Practices

### Type Definitions
- Define interfaces/types at the top of files or in separate `.types.ts` files
- Use union types for variant props: `size?: 'sm' | 'md' | 'lg'`
- Prefer interfaces over types for object shapes
- Use generics for reusable components: `Component<T>`
- Avoid `any` - use `unknown` or proper type definitions

### Type Safety
- Enable strict mode in tsconfig.json
- Use discriminated unions for complex state management
- Implement proper error boundaries with typed errors
- Validate API responses with runtime type checking

## State Management

### Local State
- Use `useState` for simple component state
- Use `useReducer` for complex state logic with multiple related values
- Prefer controlled components over uncontrolled ones
- Implement optimistic updates with error rollback

### Global State
- Use Context API for theme, user auth, and app-wide settings
- Consider Zustand or Redux Toolkit for complex global state
- Implement proper state normalization for entities
- Use selectors for computed state to avoid unnecessary re-renders

## Performance Optimization

### Rendering Optimization
- Use `React.memo` for expensive components
- Implement proper dependency arrays in `useEffect`, `useCallback`, `useMemo`
- Use `useCallback` for event handlers passed to child components
- Implement virtual scrolling for large lists
- Use `React.lazy` and `Suspense` for code splitting

### Bundle Optimization
- Implement tree shaking by using named exports
- Use dynamic imports for route-based code splitting
- Optimize images and assets with proper formats and sizes
- Implement proper caching strategies for API calls

## Code Quality & Testing

### Testing Strategy
- Write unit tests for utilities and hooks
- Write integration tests for component interactions
- Use React Testing Library over Enzyme
- Mock external dependencies (API calls, contexts)
- Implement visual regression testing for critical UI

### Code Standards
- Use ESLint with React and TypeScript rules
- Implement Prettier for consistent formatting
- Use Husky for pre-commit hooks
- Implement proper commit message conventions
- Use conventional commits: `feat:`, `fix:`, `docs:`, etc.

## Accessibility (a11y)

### ARIA Implementation
- Use semantic HTML elements over divs
- Implement proper ARIA labels and roles
- Support keyboard navigation for all interactive elements
- Use `aria-live` regions for dynamic content updates
- Implement focus management for modals and overlays

### Screen Reader Support
- Provide alt text for all images
- Use proper heading hierarchy (h1-h6)
- Implement skip links for keyboard users
- Test with screen readers (NVDA, JAWS, VoiceOver)

## Error Handling & Resilience

### Error Boundaries
- Implement error boundaries at route/component level
- Provide user-friendly error messages
- Log errors to monitoring services
- Implement graceful degradation for failed features

### API Error Handling
- Implement proper HTTP status code handling
- Use retry logic with exponential backoff
- Provide offline support with service workers
- Implement proper loading states and skeletons

## Security Best Practices

### Input Validation
- Validate all user inputs on client and server
- Sanitize data before rendering (XSS prevention)
- Use Content Security Policy (CSP) headers
- Implement proper authentication checks

### Data Protection
- Never store sensitive data in localStorage
- Use HTTPS for all API communications
- Implement proper token refresh mechanisms
- Clear sensitive data on logout

## Code Organization & Architecture

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   └── domain/         # Domain-specific components
├── hooks/              # Custom React hooks
├── contexts/           # React Context providers
├── services/           # API services and external integrations
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # App constants and configurations
└── styles/             # Global styles and theme
```

### Import Organization
- Group imports: React, third-party libraries, internal modules
- Use absolute imports over relative imports
- Implement path mapping in tsconfig.json
- Avoid circular dependencies

## Performance Monitoring

### Metrics to Track
- Core Web Vitals (LCP, FID, CLS)
- Bundle size and loading performance
- Runtime performance with React DevTools Profiler
- Error rates and user feedback
- API response times and success rates
