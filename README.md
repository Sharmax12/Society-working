# Hall Way Loop

A web application for managing residential society / community operations — members, notices, complaints, and day‑to‑day admin — built with **Next.js**, **Prisma**, and **PostgreSQL**.

> This README was generated from the repository's structure and `package.json`. Update the sections marked below with project-specific details (exact features, screenshots, deployed URL, etc.).

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) with React 19
- **Auth:** [NextAuth.js v5](https://authjs.dev) with the Prisma adapter
- **Database / ORM:** PostgreSQL via [Prisma ORM](https://www.prisma.io) (`@prisma/client`, `@prisma/adapter-pg`)
- **UI:** [Radix UI](https://www.radix-ui.com) primitives + [shadcn/ui](https://ui.shadcn.com), styled with [Tailwind CSS 4](https://tailwindcss.com)
- **Forms & data:** `react-hook-form`, `date-fns`, `recharts` for charts
- **Tooling:** TypeScript, ESLint, `babel-plugin-react-compiler`

## Project Structure

```
app/            # Next.js App Router routes, layouts, and pages
components/     # Shared/reusable UI components
hooks/          # Custom React hooks
lib/            # Utilities, config, and shared logic
modules/        # Feature/domain modules
prisma/         # Prisma schema and migrations
public/         # Static assets
auth.ts / auth.config.ts   # NextAuth configuration
middleware.tsx  # Route middleware (e.g. auth guarding)
routes.ts       # Route definitions/constants
```

## Prerequisites

- Node.js 18+ (or a recent LTS)
- A PostgreSQL database (local or hosted)
- A package manager: `npm`, `yarn`, `pnpm`, or `bun`

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sharmax12/Society-working.git
   cd Society-working
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root with at least:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   AUTH_SECRET="a-random-secret-string"
   # Add any provider-specific NextAuth variables here, e.g.:
   # AUTH_GOOGLE_ID=...
   # AUTH_GOOGLE_SECRET=...
   ```

   > Check `auth.config.ts` / `auth.ts` for the exact environment variables your configured providers require.

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

   (Prisma client generation also runs automatically on `npm install` via the `postinstall` script.)

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the app for production         |
| `npm run start`   | Start the production server          |
| `npm run lint`    | Run ESLint                           |

## Deployment

The app is a standard Next.js project and can be deployed on [Vercel](https://vercel.com/new) or any Node.js hosting provider that supports Next.js. Make sure to configure `DATABASE_URL`, `AUTH_SECRET`, and any auth provider credentials in your hosting environment, and run `prisma migrate deploy` against your production database.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or file an issue.

## License

No license has been specified for this repository yet. Add a `LICENSE` file to clarify usage terms.