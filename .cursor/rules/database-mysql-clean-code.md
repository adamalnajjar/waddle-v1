---
alwaysApply: true
applyWhen: "filePath:*migration*,filePath:*model*,fileExtension:php"
priority: high
description: "Database design and MySQL clean code standards"
---

# Database & MySQL Clean Code Rules

## Database Design Principles

### Normalization Standards
- Apply 1NF: Eliminate repeating groups, ensure atomic values
- Apply 2NF: Remove partial dependencies on composite keys
- Apply 3NF: Remove transitive dependencies
- Consider BCNF for complex relationships
- Use denormalization strategically for performance

### Naming Conventions
- Use lowercase with underscores: `user_profiles`, `meeting_requests`
- Use singular nouns for table names: `user`, `meeting`, `consultant`
- Use descriptive, meaningful names
- Prefix related tables when necessary: `user_`, `consultant_`
- Use consistent abbreviations: `id`, `created_at`, `updated_at`

## Table Structure Standards

### Primary Keys
- Use auto-incrementing BIGINT for primary keys
- Name primary key columns `id`
- Use UUIDs for distributed systems when necessary
- Implement composite primary keys only when required

### Foreign Keys
- Define foreign key constraints for referential integrity
- Use descriptive names: `user_id`, `meeting_id`
- Implement CASCADE operations appropriately
- Use indexes on foreign key columns

### Column Design
- Choose appropriate data types and sizes
- Use ENUM for restricted value sets
- Implement CHECK constraints for data validation
- Use DEFAULT values appropriately
- Implement NOT NULL constraints for required fields

## Indexing Strategy

### Index Types & Usage
- Create indexes on frequently queried columns
- Use composite indexes for multi-column queries
- Implement unique indexes for uniqueness constraints
- Use full-text indexes for text search
- Monitor index usage and remove unused indexes

### Index Best Practices
- Balance read performance vs write performance
- Use covering indexes when possible
- Avoid over-indexing tables
- Use EXPLAIN to analyze query performance
- Implement index maintenance strategies

## Query Optimization

### SQL Writing Standards
- Use uppercase for SQL keywords
- Format queries for readability
- Use table aliases for complex queries
- Implement proper JOIN syntax
- Use parameterized queries to prevent SQL injection

### Performance Optimization
- Use EXPLAIN ANALYZE to understand query execution
- Implement proper pagination for large result sets
- Use UNION ALL instead of UNION when possible
- Implement query result caching strategies
- Use database-specific optimization features

## Migration Best Practices

### Migration Structure
- Use descriptive migration names
- Implement up/down methods properly
- Use database transactions for complex migrations
- Test migrations on staging environments
- Implement proper rollback strategies

### Migration Content
- Use Laravel migration methods consistently
- Implement proper data type mappings
- Add indexes and constraints appropriately
- Use seeders for initial data setup
- Document complex migration logic

## Data Integrity & Constraints

### Constraint Implementation
- Use NOT NULL for required fields
- Implement CHECK constraints for business rules
- Use UNIQUE constraints for unique business values
- Implement foreign key constraints
- Use triggers for complex business logic (sparingly)

### Data Validation
- Validate data at application level
- Implement database-level constraints
- Use stored procedures for complex validation
- Implement proper error handling for constraint violations
- Log constraint violation attempts

## Stored Procedures & Functions

### When to Use Stored Procedures
- Complex business logic requiring performance
- Data-intensive operations
- Cross-table transactions
- Complex calculations and aggregations
- ETL operations

### Stored Procedure Standards
- Use meaningful names with proper prefixes
- Implement proper error handling
- Use transactions for data consistency
- Document input/output parameters
- Implement proper logging and monitoring

## Database Security

### Access Control
- Implement principle of least privilege
- Use separate database users for different applications
- Encrypt sensitive data at rest
- Implement proper SSL/TLS connections
- Use database firewalls and intrusion detection

### Data Protection
- Encrypt sensitive columns (PII, financial data)
- Implement proper backup and recovery strategies
- Use database auditing for sensitive operations
- Implement data retention policies
- Comply with GDPR and other regulations

## Performance Monitoring

### Monitoring Metrics
- Query execution time and frequency
- Database connection pool usage
- Lock wait times and deadlocks
- Disk I/O and memory usage
- Replication lag (if applicable)

### Performance Tools
- Use MySQL Performance Schema
- Implement slow query log analysis
- Use EXPLAIN for query optimization
- Monitor database growth and usage patterns
- Implement automated alerting for performance issues

## Backup & Recovery

### Backup Strategy
- Implement regular automated backups
- Use incremental and differential backups
- Store backups in multiple locations
- Test backup restoration regularly
- Implement backup encryption

### Recovery Planning
- Document recovery time objectives (RTO)
- Define recovery point objectives (RPO)
- Implement disaster recovery procedures
- Test recovery procedures regularly
- Monitor backup success and integrity

## Database Architecture Patterns

### Read/Write Splitting
- Implement master-slave replication for read scaling
- Route read queries to slave databases
- Handle replication lag appropriately
- Implement connection pooling for multiple databases

### Sharding Strategy
- Plan for horizontal scaling when needed
- Implement proper shard key selection
- Use consistent hashing for even distribution
- Implement cross-shard queries when necessary

## Laravel-Specific Database Patterns

### Eloquent Relationships
- Define proper relationship methods
- Use appropriate relationship types (hasOne, hasMany, belongsTo, etc.)
- Implement eager loading to prevent N+1 queries
- Use relationship constraints appropriately

### Query Builder Usage
- Use Eloquent when possible for maintainability
- Use Query Builder for complex SQL queries
- Implement proper query scoping
- Use database transactions for data consistency

### Migration Organization
- Group related migrations logically
- Implement proper foreign key ordering
- Use seeders for initial application data
- Implement factories for testing data
- Document migration dependencies and order

## Database Testing

### Test Database Setup
- Use separate test databases
- Implement database transactions for test isolation
- Use factories for consistent test data
- Implement proper test cleanup
- Mock external database dependencies when possible

### Database Test Types
- Schema tests for migration integrity
- Data integrity tests for constraints
- Performance tests for query optimization
- Integration tests for database operations
- Load tests for scalability verification

## Documentation Standards

### Database Documentation
- Document table purposes and relationships
- Document column meanings and constraints
- Maintain ER diagrams and schema documentation
- Document stored procedures and functions
- Keep documentation synchronized with schema changes

### Change Management
- Implement proper change request processes
- Document database change impacts
- Implement gradual rollout strategies
- Maintain change history and rollback plans
- Communicate changes to development teams
