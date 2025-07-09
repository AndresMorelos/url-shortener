# Backend – URL Shortener

NestJS API for the URL Shortener project. Handles authentication, URL management, and user management.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Database & Prisma](#database--prisma)
- [JWT Keys](#jwt-keys)
- [Running the Backend](#running-the-backend)
  - [Locally](#locally)
  - [With Docker](#with-docker)
- [Testing](#testing)

---

## Features
- User registration & authentication (JWT)
- URL shortening and redirection
- User-owned URLs
- Soft delete for users and URLs

---

## Tech Stack
- [NestJS](https://nestjs.com/) (TypeScript)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT Auth](https://jwt.io/)

---

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Generate JWT keys (see [JWT Keys](#jwt-keys)).
3. Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables)).

---

## Environment Variables

Create a `.env` file in the `backend/` directory. Example:

```
cp .env.example .env
```

---

## Database & Prisma

- The backend uses PostgreSQL and Prisma ORM.
- To apply migrations and generate the client:
  ```bash
  yarn prisma:migrate dev
  yarn prisma:generate
  ```
- The schema is defined in `prisma/schema.prisma`.

---

## JWT Keys

Generate keys and place them in the `backend/` folder:

```bash
openssl genpkey -algorithm RSA -out ./jwt-private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in ./jwt-private.key -out ./jwt-public.key
```
> These commands need to be executed at backend folder level.

---

## Running the Backend

### Locally

```bash
yarn start:dev
```

### With Docker

Build and run the backend service:

```bash
docker build -f Dockerfile.development -t url-shortener-backend .
docker run --env-file .env -p 3001:3001 url-shortener-backend
```

Or use Docker Compose from the project root (recommended):

```bash
docker compose up --build
```

---

## Testing

- Unit tests:
  ```bash
  yarn test
  ```
- Test coverage:
  ```bash
  yarn test:cov
  ```
