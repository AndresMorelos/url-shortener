# Frontend – URL Shortener

Next.js frontend for the URL Shortener project. Provides the user interface for authentication, URL management, and analytics.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Available Scripts](#available-scripts)
- [Running the Frontend](#running-the-frontend)
  - [Locally](#locally)
  - [With Docker](#with-docker)
- [Styling](#styling)

---

## Features
- User registration & login
- URL creation and management
- Admin panel (if authorized)
- Responsive, modern UI

---

## Tech Stack
- [Next.js](https://nextjs.org/) (v15)
- [React](https://react.dev/) (v19)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [React Hook Form](https://react-hook-form.com/)
- [Yup](https://github.com/jquense/yup) (validation)

---

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```
2. (Optional) Create a `.env.local` file for custom environment variables (not required by default).

---

## Available Scripts

- `yarn dev` – Start the development server (http://localhost:3000)
- `yarn build` – Build for production
- `yarn start` – Start the production server
- `yarn lint` – Lint the codebase

---

## Running the Frontend

### Locally

```bash
yarn dev
```

### With Docker

Build and run the frontend service:

```bash
docker build -f Dockerfile.development -t url-shortener-frontend .
docker run -p 3000:3000 url-shortener-frontend
```

Or use Docker Compose from the project root (recommended):

```bash
docker compose up --build
```

---

## Styling

- Uses [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- Custom configuration in `tailwind.config.ts`.

---

## Notes
- The frontend expects the backend API to be running at `http://localhost:3001` by default.
- For more details, see the main [README](../README.md). 