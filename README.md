# HallWayLoop

**Discover. Belong. Connect.**

HallWayLoop is a campus social platform that brings college societies, clubs, and events into one place. Students can discover communities that match their interests, submit applications to join them, and keep up with what's happening across campus — all from a single, modern web app.

Live demo: [campuscircle-seven.vercel.app](https://campuscircle-seven.vercel.app/)

Built with **Next.js 16** and a modern React stack, using **Prisma ORM** on top of PostgreSQL for data access and **Auth.js (NextAuth v5)** for authentication.

## Features

- **Discover societies** — Browse all active campus societies and clubs (`/societies`), grouped by category (Technical, Cultural, Social Service, Entrepreneurship & Finance, Dramatics, and more), with a quick command-palette search (`⌘K`).
- **Society profiles** — Each society has its own page describing what it does, whether it's currently open for applications, and the application deadline.
- **Apply to join** — A short, guided application flow (`/apply/[societyId]`) lets students apply to a society directly from its profile page.
- **Campus events** — An events hub (`/events`) showing upcoming events to attend and a look back at past ones, each linked to the hosting society, with its own detail page (`/events/[eventId]`).
- **Admin panel** — An admin area (`/admin`) for managing societies, applications, and events.
- **Authentication** — Sign-in flow powered by Auth.js, with route protection via middleware.
- **Society chat (coming soon)** — In-app chat for society members to coordinate, planned as a future feature.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) with React 19 and TypeScript
- **Styling / UI:** Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com), Radix UI primitives, `lucide-react` icons
- **Auth:** [NextAuth.js v5 (Auth.js)](https://authjs.dev) with the Prisma adapter
- **Database / ORM:** [Prisma](https://www.prisma.io) 6 with the PostgreSQL driver adapter (`@prisma/adapter-pg`) and Prisma Accelerate extension
- **Forms & Data:** `react-hook-form`, `date-fns`, `recharts` for charts
- **Other UI utilities:** `embla-carousel-react`, `cmdk`, `sonner` (toasts), `vaul` (drawers), `react-resizable-panels`

## Project Structure

```
.
├── app/            # Next.js App Router routes, layouts, and pages
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Shared utilities, helpers, and clients
├── modules/        # Feature-specific modules/domain logic
├── prisma/         # Prisma schema and migrations
├── public/         # Static assets
├── auth.ts               # Auth.js configuration/handlers
├── auth.config.ts        # Auth.js providers/config
├── middleware.tsx         # Route middleware (e.g. auth-protected routes)
├── next-auth.d.ts         # NextAuth type augmentations
├── prisma.config.ts       # Prisma configuration
└── routes.ts              # App route definitions
```

## Getting Started

### Prerequisites

- Node.js 18.18+ (or a version compatible with Next.js 16)
- A PostgreSQL database
- npm, yarn, pnpm, or bun

### 1. Clone the repository

```
git clone https://github.com/Sharmax12/Society-working.git
cd Society-working
```

### 2. Install dependencies

```
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

The `postinstall` script automatically runs `prisma generate`.

### 3. Configure environment variables

Create a `.env` file in the project root with at least:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Auth.js
AUTH_SECRET="generate-a-random-secret"
# Add any OAuth provider credentials your auth.config.ts requires
```

> Tip: You can generate an `AUTH_SECRET` with `npx auth secret`.

### 4. Set up the database

Apply the Prisma schema to your database:

```
npx prisma migrate dev
```

(Or `npx prisma db push` if you're not using migrations.)

### 5. Run the development server

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open <http://localhost:3000> with your browser to see the result.

## Available Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the Next.js development server |
| `npm run build` | Build the app for production         |
| `npm run start` | Start the production server          |
| `npm run lint`  | Run ESLint                           |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
