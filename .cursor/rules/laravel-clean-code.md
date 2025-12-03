---
alwaysApply: true
applyWhen: "fileExtension:php"
priority: high
description: "Laravel PHP backend clean code standards"
---

# Laravel Clean Code Rules

## Application Structure & Architecture

### MVC Pattern Implementation
- Keep controllers thin and focused on HTTP concerns
- Move business logic to service classes or domain objects
- Use repositories for data access abstraction
- Implement proper separation of concerns

### Folder Structure Standards
```
app/
├── Http/
│   ├── Controllers/     # HTTP request handling
│   ├── Middleware/      # Request/response middleware
│   └── Requests/        # Form request validation
├── Models/              # Eloquent models
├── Services/            # Business logic services
├── Repositories/        # Data access layer
├── Events/              # Event classes
├── Listeners/           # Event listeners
├── Jobs/                # Queue jobs
├── Mail/                # Email classes
├── Notifications/       # Notification classes
└── Policies/            # Authorization policies

database/
├── migrations/          # Database migrations
├── seeders/            # Database seeders
└── factories/          # Model factories

tests/                   # Test files
├── Feature/            # Feature tests
├── Unit/               # Unit tests
└── Browser/            # Browser tests (Laravel Dusk)
```

## Model Best Practices

### Eloquent Model Design
- Use meaningful, descriptive model names
- Implement proper relationships with foreign key constraints
- Use accessors and mutators for data transformation
- Implement scopes for common query constraints
- Use soft deletes for data preservation

### Mass Assignment Protection
- Always define `$fillable` or `$guarded` properties
- Use form requests for validation and mass assignment
- Implement authorization checks in policies

## Controller Standards

### RESTful Resource Controllers
- Use resource controllers for CRUD operations
- Implement proper HTTP status codes
- Use form requests for validation
- Return consistent JSON responses for APIs
- Implement proper error handling and responses

### Controller Methods
- Keep methods focused and single-purpose
- Use dependency injection for services
- Implement proper authorization checks
- Use resource classes for API responses

## Service Layer Architecture

### Service Classes
- Create service classes for complex business logic
- Use dependency injection for testability
- Implement interface contracts for services
- Handle transactions for multi-step operations
- Use events for decoupling operations

### Repository Pattern
- Implement repositories for data access abstraction
- Use interfaces for repository contracts
- Implement caching strategies in repositories
- Use eager loading to prevent N+1 queries

## Database Design & Migrations

### Migration Best Practices
- Use descriptive migration names
- Implement proper foreign key constraints
- Use indexes for frequently queried columns
- Implement proper data types and constraints
- Use seeders for initial data setup

### Schema Design
- Normalize data to reduce redundancy
- Use appropriate data types and sizes
- Implement proper indexing strategies
- Use database constraints for data integrity
- Plan for scalability and performance

## API Development Standards

### REST API Design
- Use consistent URL patterns and HTTP methods
- Implement proper status codes and error responses
- Use API versioning (URL or header-based)
- Implement rate limiting and throttling
- Use pagination for large datasets

### API Response Format
- Use consistent JSON response structure
- Include metadata (pagination, links, etc.)
- Implement proper error response format
- Use resource classes for data transformation
- Include API documentation (OpenAPI/Swagger)

## Authentication & Authorization

### Laravel Sanctum Implementation
- Use token-based authentication for APIs
- Implement proper token expiration and refresh
- Use middleware for route protection
- Implement role-based access control (RBAC)
- Use policies for resource authorization

### Security Best Practices
- Implement CSRF protection for web routes
- Use HTTPS for all communications
- Implement proper password hashing
- Use secure random tokens and keys
- Implement audit logging for sensitive operations

## Validation & Error Handling

### Form Request Validation
- Use form request classes for validation logic
- Implement custom validation rules when needed
- Provide meaningful error messages
- Handle file uploads with proper validation
- Implement conditional validation rules

### Error Handling
- Use try-catch blocks for expected exceptions
- Implement global exception handlers
- Log errors appropriately (don't expose sensitive info)
- Return user-friendly error responses
- Implement proper HTTP status codes

## Testing Strategy

### Test Types & Coverage
- Write unit tests for models, services, and utilities
- Write feature tests for HTTP endpoints
- Write browser tests for critical user journeys
- Aim for >80% code coverage
- Use factories and seeders for test data

### Testing Best Practices
- Use descriptive test method names
- Test one thing per test method
- Use assertions appropriately
- Mock external dependencies
- Implement test database for feature tests

## Performance Optimization

### Database Optimization
- Use eager loading to prevent N+1 queries
- Implement proper indexing strategies
- Use database query optimization
- Implement caching for frequently accessed data
- Use pagination for large datasets

### Application Performance
- Implement caching strategies (Redis, file cache)
- Use queue jobs for heavy operations
- Implement proper asset optimization
- Use CDN for static assets
- Monitor performance with Laravel Telescope

## Code Quality Standards

### PHP Standards
- Follow PSR-12 coding standards
- Use meaningful variable and method names
- Implement proper type hinting
- Use PHPDoc for documentation
- Implement proper exception handling

### Code Organization
- Use namespaces properly
- Implement autoloading standards
- Use composer for dependency management
- Implement proper gitignore patterns
- Use environment-specific configurations

## Security Implementation

### Input Validation & Sanitization
- Validate all user inputs
- Sanitize data to prevent XSS attacks
- Use prepared statements for SQL queries
- Implement proper file upload validation
- Use Laravel's built-in security features

### Data Protection
- Encrypt sensitive data at rest
- Implement proper session management
- Use secure cookies and headers
- Implement rate limiting
- Log security events appropriately

## Deployment & DevOps

### Environment Management
- Use environment variables for configuration
- Implement proper logging levels
- Use Laravel Forge/Heroku/Vapor for deployment
- Implement proper backup strategies
- Use monitoring and alerting tools

### CI/CD Pipeline
- Implement automated testing in CI
- Use code quality tools (PHPStan, PHPCS)
- Implement automated deployment
- Use feature flags for gradual rollouts
- Implement proper rollback strategies

## Laravel-Specific Patterns

### Artisan Commands
- Create commands for repetitive tasks
- Use proper command signatures and options
- Implement progress bars for long-running tasks
- Use commands for data migrations and cleanup

### Events & Listeners
- Use events for decoupling application components
- Implement listeners for event handling
- Use queued listeners for performance
- Implement proper event naming conventions

### Blade Templates
- Use consistent naming conventions
- Implement proper escaping
- Use components for reusable UI elements
- Minimize logic in templates
- Use Laravel Mix/Webpack for asset compilation
