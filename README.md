# Intentionally Vulnerable API

An intentionally vulnerable API built with Node.js, Express, and TypeScript for practicing secure coding, vulnerability detection, and defensive engineering.

> **Warning**
>
> This project contains known security vulnerabilities and should **not** be deployed in production or exposed publicly.

## Table of Contents

* [Purpose](#purpose)
* [Tech Stack](#tech-stack)
* [Security Features](#security-features-baseline-hardening)
* [Project Structure](#project-structure)
* [Vulnerabilities](#vulnerabilities)
* [Documentation](#documentation)

## Purpose

This project is intended for:

* Practicing identification of common web application vulnerabilities
* Learning secure coding patterns in Express/TypeScript applications
* Security testing in a controlled environment
* Teaching and training purposes

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
* Husky (Git hooks)

## Security Features (Baseline Hardening)

The project includes baseline security practices alongside intentional flaws:

* Strict TypeScript typing
* Request validation using Zod
* Authentication and authorization test coverage
* Rate limiting
* Security headers via Helmet
* Linting and formatting enforcement
* Pre-commit hooks via Husky

## Project Structure

```text
├── src
│   ├── config
│   ├── controllers
│   ├── db
│   ├── errors
│   ├── middlewares
│   ├── models
│   ├── repositories
│   ├── routes
│   ├── schemas
│   ├── services
│   ├── types
│   └── utils
└── tests
    ├── helpers
    ├── it
    └── unit
```

## Vulnerabilities

TBD

## Documentation

* [Threat Model](docs/threatmodel.md)
* [API Spec](docs/swagger.yml)
