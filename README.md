Got it — here’s a more concise, cleaner version with minimal styling and no emoji overload.

---

# Intentionally Vulnerable API

An intentionally vulnerable API built with Node.js, Express, and TypeScript for practicing secure coding, vulnerability detection, and defensive engineering.

> **Warning:** This project contains known security vulnerabilities and should not be deployed in production or exposed publicly.

---

## Purpose

This project is intended for:

* Practicing identification of common web application vulnerabilities
* Learning secure coding patterns in Express/TypeScript applications
* Security testing in a controlled environment
* Teaching and training purposes

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Docker
* Zod (validation)
* Helmet (security headers)
* Rate limiting middleware
* ESLint + Prettier
* Husky (git hooks)

---

## Security Features (Baseline Hardening)

The project includes baseline security practices alongside intentional flaws:

* Strict TypeScript typing
* Request validation using Zod
* Authentication and authorization test coverage
* Rate limiting
* Security headers via Helmet
* Linting and formatting enforcement
* Pre-commit hooks via Husky

---

## Project Structure

```bash
├── src
│   ├── config
│   ├── controllers
│   ├── db
│   ├── errors
│   ├── middlewares
│   ├── models
│   ├── repositories
│   ├── routes
│   ├── schemas
│   ├── services
│   ├── types
│   └── utils
└── tests
    ├── helpers
    ├── it
    └── unit
```

---

## Vulnerabilities

TBD

---

## Threat Model

TBD
