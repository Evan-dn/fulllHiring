# Fleet Management

Vehicle fleet parking management — DDD + CQRS, functional programming, TypeScript.

## Architecture

```
src/
├── App/     # Command handlers (curried async functions)
├── Domain/  # Types, pure functions, typed errors
└── Infra/   # Repository implementations
```

- **In-memory** repositories for BDD tests (Step 1)
- **PostgreSQL** repositories for the CLI and `@critical` BDD profile (Step 2)

## Install

```bash
npm install
```

## Database

Start PostgreSQL with Docker (no configuration needed):

```bash
docker-compose up -d
cp .env.example .env
```

The `.env.example` credentials match the `docker-compose.yml`

## Tests

```bash
npm test                # all: unit + BDD in-memory + BDD PostgreSQL
npm run test:unit       # Jest — Domain, App handlers (no DB required)
npm run test:bdd        # Cucumber — all scenarios, in-memory repos
npm run test:bdd:sql    # Cucumber — @critical scenarios, PostgreSQL repos
```

> `test:bdd:sql` requires the database to be running.

## CLI

```bash
./fleet create <userId>
./fleet register-vehicle <fleetId> <vehiclePlateNumber>
./fleet localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]
```

## Code quality

- **TypeScript strict** — already enabled; catches type errors, nullability and implicit `any` at compile time before any test runs
- **Biome** — single tool replacing ESLint + Prettier; faster, zero config conflict between linting and formatting
- **ESLint + Prettier** — more config than Biome but a larger ecosystem and more flexibility
- **Husky + lint-staged** — pre-commit hook runs Biome or ESLint and Prettier only on staged files; keeps feedback short and blocks bad code at commit time

## CI/CD

Implemented as a **GitHub Actions** workflow triggered on push and pull request. On every run:

1. Install dependencies
2. Lint & type-check — fail fast before running any test
3. Run unit tests (`npm run test:unit`) — no infrastructure needed, fast feedback
4. Run BDD in-memory tests (`npm run test:bdd`) — no infrastructure needed
5. Start a docker container with a PostgreSQL DB, then run BDD SQL tests (`npm run test:bdd:sql`) — validates the real persistence of data
