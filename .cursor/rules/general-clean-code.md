---
alwaysApply: true
applyWhen: "*"
priority: high
description: "General clean code principles and project-wide standards"
---

# General Clean Code Rules for Codename Waddle

## Project Architecture Principles

### Separation of Concerns
- Keep business logic separate from presentation logic
- Implement proper layering: Presentation → Business → Data
- Use dependency injection for loose coupling
- Implement interface segregation for clean APIs
- Maintain single responsibility principle across all layers

### Code Organization Standards
- Use consistent file and folder naming conventions
- Implement proper namespace usage
- Use meaningful, descriptive names for all entities
- Maintain consistent code formatting and style
- Implement proper documentation and comments

## Authentication & Security (Laravel Sanctum)

### Token Management
- Implement proper token generation and validation
- Use secure token storage mechanisms
- Implement token expiration and refresh strategies
- Use HTTPS for all authentication communications
- Implement proper logout and token revocation

### Security Best Practices
- Validate all user inputs on both client and server
- Implement CSRF protection for web routes
- Use proper password hashing and validation
- Implement rate limiting for authentication endpoints
- Log security events and suspicious activities

### Authorization Implementation
- Use Laravel policies for resource authorization
- Implement role-based access control (RBAC)
- Use middleware for route protection
- Implement proper permission checking
- Maintain audit trails for sensitive operations

## Video Conferencing Integration (Zoom SDK)

### SDK Implementation
- Implement proper SDK initialization and configuration
- Handle SDK errors and connection failures gracefully
- Implement proper cleanup on component unmount
- Use SDK best practices for performance optimization
- Implement proper user permission handling

### Meeting Management
- Implement proper meeting creation and joining flows
- Handle meeting lifecycle events appropriately
- Implement proper participant management
- Use secure meeting URLs and access codes
- Implement proper meeting recording capabilities

### Error Handling & Resilience
- Implement retry logic for SDK operations
- Provide user-friendly error messages for SDK failures
- Handle network connectivity issues gracefully
- Implement offline detection and handling
- Log SDK errors for debugging and monitoring

## API Design & Communication

### REST API Standards
- Use consistent URL patterns and HTTP methods
- Implement proper HTTP status codes
- Use JSON for data exchange
- Implement API versioning strategies
- Use consistent response formats

### API Security
- Implement proper authentication for API endpoints
- Use API rate limiting and throttling
- Validate all API inputs and outputs
- Implement proper error response formats
- Use API documentation standards (OpenAPI/Swagger)

### Data Transfer Objects
- Use DTOs for API data transformation
- Implement proper data validation and sanitization
- Use resource classes for consistent API responses
- Implement proper data serialization
- Maintain API backward compatibility

## Error Handling & Logging

### Error Management
- Implement proper exception handling throughout the application
- Use custom exception classes for domain-specific errors
- Implement error boundaries in React components
- Provide user-friendly error messages
- Log errors appropriately without exposing sensitive information

### Logging Strategy
- Implement structured logging with appropriate levels
- Log security events and authentication attempts
- Include contextual information in log entries
- Implement log aggregation and monitoring
- Maintain log retention policies

## Testing Strategy

### Test Coverage Requirements
- Aim for >80% code coverage across all layers
- Write unit tests for business logic and utilities
- Write integration tests for API endpoints
- Write end-to-end tests for critical user journeys
- Implement proper test data management

### Testing Best Practices
- Use descriptive test names and documentation
- Implement proper test isolation and cleanup
- Mock external dependencies appropriately
- Use test-driven development when possible
- Implement continuous integration testing

## Performance Optimization

### Frontend Performance
- Implement code splitting and lazy loading
- Optimize bundle sizes and loading strategies
- Use proper caching strategies for static assets
- Implement virtual scrolling for large lists
- Monitor and optimize Core Web Vitals

### Backend Performance
- Implement proper database query optimization
- Use caching strategies (Redis, application cache)
- Implement queue systems for heavy operations
- Optimize API response times
- Implement proper resource monitoring

### Database Performance
- Implement proper indexing strategies
- Use query optimization and EXPLAIN analysis
- Implement connection pooling
- Use database caching when appropriate
- Monitor query performance and bottlenecks

## Code Quality Assurance

### Code Review Standards
- Implement mandatory code reviews for all changes
- Use consistent review checklists and criteria
- Focus on code quality, security, and performance
- Provide constructive feedback and mentoring
- Maintain code review completion rates

### Static Analysis
- Use ESLint for JavaScript/TypeScript code
- Use PHPStan or similar for PHP code
- Implement automated code quality checks
- Use pre-commit hooks for quality assurance
- Maintain zero-tolerance for critical issues

## Documentation Standards

### Code Documentation
- Use PHPDoc for PHP code documentation
- Use JSDoc for JavaScript/TypeScript documentation
- Document complex business logic and algorithms
- Maintain up-to-date API documentation
- Use consistent documentation formats

### Project Documentation
- Maintain comprehensive README files
- Document architecture decisions and patterns
- Keep API documentation synchronized
- Document deployment and operational procedures
- Maintain troubleshooting guides and FAQs

## Version Control & Deployment

### Git Standards
- Use conventional commit messages
- Implement proper branching strategies
- Use pull requests for all changes
- Implement proper code review processes
- Maintain clean git history

### Deployment Practices
- Implement automated deployment pipelines
- Use environment-specific configurations
- Implement proper rollback strategies
- Maintain deployment documentation
- Implement proper monitoring and alerting

## Monitoring & Observability

### Application Monitoring
- Implement proper error tracking and reporting
- Monitor application performance metrics
- Track user behavior and usage patterns
- Implement proper logging and log aggregation
- Use monitoring dashboards for key metrics

### Business Metrics
- Track user engagement and retention metrics
- Monitor conversion rates and user flows
- Implement proper analytics integration
- Track performance against business objectives
- Use data-driven decision making

## Accessibility Standards

### WCAG Compliance
- Implement WCAG 2.1 AA standards
- Provide proper semantic HTML structure
- Implement keyboard navigation support
- Use proper ARIA labels and roles
- Test with screen readers and accessibility tools

### Inclusive Design
- Implement proper color contrast ratios
- Provide alternative text for all images
- Implement proper focus management
- Support screen reader compatibility
- Test with diverse user groups and abilities

## Internationalization (i18n)

### Localization Implementation
- Implement proper text localization
- Use locale-specific date and number formatting
- Support right-to-left (RTL) languages
- Implement proper currency handling
- Test localization across all user interfaces

### Content Management
- Implement proper content translation workflows
- Maintain translation consistency
- Use translation management systems
- Implement proper fallback languages
- Test content in all supported languages

## Scalability & Maintainability

### Architectural Scalability
- Design for horizontal scaling when possible
- Implement proper caching strategies
- Use microservices architecture for complex systems
- Implement proper load balancing
- Plan for future feature expansion

### Code Maintainability
- Implement proper abstraction layers
- Use design patterns appropriately
- Maintain consistent coding standards
- Implement proper refactoring practices
- Keep technical debt under control

## Team Collaboration

### Development Workflow
- Use agile development methodologies
- Implement proper project management tools
- Maintain clear communication channels
- Implement proper knowledge sharing
- Foster collaborative development culture

### Knowledge Management
- Maintain comprehensive project documentation
- Implement proper onboarding processes
- Share architectural decisions and rationale
- Maintain code examples and patterns
- Foster continuous learning and improvement
