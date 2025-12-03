# Clean Code Rules for Codename Waddle

This directory contains comprehensive clean code conventions and best practices for the Codename Waddle project. These rules are designed to ensure high-quality, maintainable, and scalable code across all technology stacks used in the project.

## Cursor AlwaysApply Configuration

All rule files are configured with `alwaysApply: true` and appropriate `applyWhen` conditions to automatically surface relevant coding standards in Cursor's AI suggestions and code assistance.

- **General rules** apply to all file types (`*`)
- **React/TypeScript rules** apply to `.tsx`, `.ts`, `.jsx`, `.js` files
- **Laravel rules** apply to `.php` files
- **Database rules** apply to migration files, model files, and PHP files
- **TailwindCSS rules** apply to styling files (`.css`, `.scss`, `.sass`) and component files

## Technology Stack Coverage

### Core Technologies
- **Frontend**: React with TypeScript
- **Backend**: Laravel (PHP framework)
- **Database**: MySQL
- **Styling**: TailwindCSS
- **Authentication**: Laravel Sanctum
- **Video Conferencing**: Zoom Video SDK APIs

## Rule Files

### `react-typescript-clean-code.md`
Comprehensive rules for React and TypeScript development including:
- Component architecture and patterns
- TypeScript best practices
- State management strategies
- Performance optimization
- Testing standards
- Accessibility requirements
- Error handling patterns

### `laravel-clean-code.md`
Backend development standards for Laravel including:
- MVC pattern implementation
- Model and controller best practices
- Service layer architecture
- Database design and migrations
- API development standards
- Authentication and security
- Testing strategies
- Performance optimization

### `database-mysql-clean-code.md`
Database design and MySQL-specific rules including:
- Normalization and schema design
- Naming conventions and standards
- Indexing strategies
- Query optimization
- Migration best practices
- Security and data integrity
- Performance monitoring
- Backup and recovery

### `tailwindcss-clean-code.md`
CSS and styling conventions for TailwindCSS including:
- Utility-first approach standards
- Responsive design patterns
- Component architecture
- Theme and design system
- Performance optimization
- Accessibility standards
- Typography and layout patterns

### `general-clean-code.md`
Overarching principles and project-specific rules including:
- Project architecture principles
- Authentication and security (Laravel Sanctum)
- Video conferencing integration (Zoom SDK)
- API design standards
- Error handling and logging
- Testing strategy
- Performance optimization
- Code quality assurance
- Documentation standards

## How to Use These Rules

### During Development
1. **Review relevant rules** before starting new features or components
2. **Follow naming conventions** consistently across the codebase
3. **Implement proper architecture** patterns for scalability
4. **Write tests** according to the specified testing strategies
5. **Optimize performance** using the provided guidelines

### Code Reviews
1. **Check adherence** to the relevant technology rules
2. **Verify architectural patterns** are properly implemented
3. **Ensure security best practices** are followed
4. **Validate performance optimizations** are in place
5. **Confirm proper documentation** and comments

### Quality Assurance
1. **Run automated checks** for code quality and style
2. **Perform security audits** using the security guidelines
3. **Test accessibility** according to WCAG standards
4. **Validate performance** against the specified metrics
5. **Review documentation** for completeness and accuracy

## Implementation Priority

### High Priority (Must Implement)
- Security best practices and authentication
- Data validation and sanitization
- Error handling and logging
- Core architectural patterns
- Database design standards
- API design principles

### Medium Priority (Should Implement)
- Performance optimization guidelines
- Testing strategies and coverage
- Code documentation standards
- Accessibility requirements
- Responsive design patterns

### Low Priority (Good to Have)
- Advanced optimization techniques
- Extended monitoring and observability
- Internationalization support
- Advanced deployment strategies

## Maintenance

### Updating Rules
1. **Review periodically** for relevance and completeness
2. **Update with new learnings** from development experience
3. **Incorporate team feedback** and improvement suggestions
4. **Keep synchronized** with technology updates and best practices
5. **Document changes** and rationale for updates

### Adding New Rules
1. **Identify gaps** in existing coverage
2. **Research best practices** for new technologies or patterns
3. **Follow existing format** and structure
4. **Get team consensus** before adding new requirements
5. **Update this README** to reflect new rule files

## Compliance & Enforcement

### Automated Checks
- Implement ESLint rules for React/TypeScript
- Use PHPStan for Laravel code analysis
- Implement pre-commit hooks for quality checks
- Use CI/CD pipelines for automated validation
- Monitor code quality metrics continuously

### Manual Reviews
- Conduct regular code reviews with rule checklists
- Perform security audits and penetration testing
- Conduct accessibility audits and testing
- Review performance metrics and optimization
- Validate compliance with business requirements

## Contact & Support

For questions about these rules or suggestions for improvements:
1. **Review existing documentation** first
2. **Consult team leads** for clarification
3. **Propose changes** through proper channels
4. **Document new patterns** discovered during development
5. **Share learnings** with the development team

---

*These rules are living documents that evolve with the project. Regular review and updates ensure they remain relevant and effective for maintaining high-quality code standards.*
