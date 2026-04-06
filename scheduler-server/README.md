# Scheduler API (Spring Boot)

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

Backend REST API that powers the Task Scheduler. Built with **Java 21** and **Spring Boot**, this service securely manages user authentication, team assignments, and task lifecycles.

## Architecture

This application follows a strict **Layered Architecture** to enforce separation of concerns, making the codebase highly scalable, testable, and maintainable. The data flow follows this best-practice pattern:

**Controller** -> **Service** -> **Repository** -> **Database DTO** <- **Mapper** <- **Entity**

* **Entities:** Map directly to the underlying database tables.
* **DTOs (Data Transfer Objects):** Shape the exact data required for API requests and responses.
* **Mappers:** Cleanly translate between Entities and DTOs, ensuring that internal database structures are never accidentally exposed to the client.

## Key Features

### 1. Aspect-Oriented Action Tracking
To maintain a clean and readable business logic layer, the application leverages **Spring AOP (Aspect-Oriented Programming)** to track user activity, primarily as part of the administrative and auditing functionality.
* Key methods are annotated with a custom `@TrackActionHistory` annotation.
* The `ActionHistoryAspect` intercepts these calls and automatically logs the action (who did what, to which entity, and when) to the database without polluting the core service methods with logging boilerplate.

### 2. JWT Security & Role-Based Authorization
The API is secured using stateless **JSON Web Tokens (JWT)**.
* A custom `JwtRequestFilter` intercepts requests to validate users.
* Strict endpoint authorization logic ensures that users can only interact with tasks, users, and teams they are explicitly permitted to see based on their roles.

## Getting Started

1. **Configure the Database:**
   Ensure PostgreSQL is running and provide your credentials in `src/main/resources/application.properties`.
2. **Run the Application:**
   ```bash
   ./mvnw spring-boot:run
   ```

The API will be available locally at http://localhost:8080