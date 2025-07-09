# URL Shortener Service

A full-stack URL shortener application with a NestJS backend and a Next.js frontend.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
  - [Using Docker Compose (Recommended)](#using-docker-compose-recommended)
  - [Running Backend Separately](#running-backend-separately)
  - [Running Frontend Separately](#running-frontend-separately)
- [Subproject Documentation](#subproject-documentation)

---

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/) installed
- [Node.js](https://nodejs.org/) (v20+) and [Yarn](https://yarnpkg.com/) (if running locally without Docker)
- **JWT Keys for Auth**

```bash
# Generate Private Key and place in backend folder
openssl genpkey -algorithm RSA -out ./backend/jwt-private.key -pkeyopt rsa_keygen_bits:2048

# Extract Public Key and place in backend folder
openssl rsa -pubout -in ./backend/jwt-private.key -out ./backend/jwt-public.key
```

---

## Project Structure

- `backend/` – NestJS API, Prisma ORM, PostgreSQL
- `frontend/` – Next.js app, Tailwind CSS

---

## Running the Project

### Using Docker Compose (Recommended)

This will start the backend, frontend, and a Postgres database:

```bash
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Postgres: [localhost:5432](localhost:5432)

> **Note:** Ensure you have a `.env` file in `backend/` with the required environment variables (see [backend/README.md](./backend/README.md)).

---

### Running Backend Separately

See [backend/README.md](./backend/README.md) for details on running the backend with or without Docker.

---

### Running Frontend Separately

See [frontend/README.md](./frontend/README.md) for details on running the frontend with or without Docker.

---

## Subproject Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)