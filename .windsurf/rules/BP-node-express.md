---
trigger: manual
---

# Node.js & Express.js Best Practices (2024)

A condensed guide to building robust, secure, and maintainable Node.js and Express.js applications.

## Project Structure & Organization

### Modular Architecture

- Use feature-based or layer-based organization (controllers, services, models, routes, middleware)
- Follow separation of concerns principle
- Implement service layer for business logic
- Use configuration files for environment-specific settings

## Security Practices

### Essential Security Measures

- Implement Helmet.js for security headers
- Configure proper CORS policies
- Use rate limiting with express-rate-limit
- Implement input validation with Joi or express-validator
- Sanitize user input to prevent XSS attacks
- Use parameterized queries to prevent SQL injection
- Implement proper authentication with bcrypt for hashing
- Use JWT with secure configuration (httpOnly cookies, short expiration)
- Store secrets in environment variables (never in code)
- Implement CSRF protection for state-changing operations

## Performance Optimization

### Key Performance Strategies

- Use compression middleware for Gzip
- Implement Redis caching for frequent queries
- Use connection pooling for databases
- Optimize asynchronous operations with Promise.all
- Use streams for large data processing
- Implement cluster mode for multi-core systems
- Minimize synchronous operations
- Use efficient logging libraries (Winston/Pino)
- Bundle and minify code for production
- Use CDN for static assets

## Error Handling

### Robust Error Management

- Use custom Error classes for different error types
- Implement global error handling middleware
- Handle uncaught exceptions and unhandled rejections
- Use structured logging with context
- Return appropriate HTTP status codes
- Don't expose stack traces in production
- Implement retry mechanisms for external services
- Use circuit breaker pattern for fault tolerance

## Code Quality & Maintenance

### Development Excellence

- Use TypeScript for type safety
- Implement comprehensive logging
- Use environment variables for configuration
- Follow consistent code style with ESLint/Prettier
- Write unit and integration tests
- Use process managers (PM2) in production
- Implement health check endpoints
- Use dependency injection for testability
- Document APIs with OpenAPI/Swagger
- Monitor application metrics and performance

## Database & Data Management

### Data Layer Best Practices

- Use ORM/ODM with proper validation
- Implement database migrations
- Use transactions for atomic operations
- Create proper indexes for frequently queried fields
- Implement data sanitization and validation
- Use connection pooling with proper limits
- Implement database timeouts and retries
- Regular database maintenance and backups

## API Design

### RESTful API Standards

- Follow REST conventions for endpoints
- Use consistent response formats
- Implement proper status codes
- Version your APIs
- Use pagination for large datasets
- Implement filtering, sorting, and searching
- Rate limit API endpoints
- Provide comprehensive API documentation

## Development & Deployment

### Production Readiness

- Use Docker for containerization
- Implement CI/CD pipelines
- Use process managers in production
- Set up monitoring and alerting
- Implement proper logging aggregation
- Use SSL/TLS termination
- Configure proper security headers
- Regular dependency updates
- Performance testing and benchmarking
- Disaster recovery planning

## Key Principles Summary

1. **Security First**: Validate all inputs, secure dependencies, proper authentication
2. **Performance Focus**: Caching, compression, efficient algorithms
3. **Error Resilience**: Comprehensive error handling and logging
4. **Code Quality**: Type safety, testing, consistent standards
5. **Monitoring**: Health checks, metrics, performance monitoring
6. **Scalability**: Stateless design, horizontal scaling readiness

_Keep dependencies updated, follow the principle of least privilege, and implement defense in depth for security._
