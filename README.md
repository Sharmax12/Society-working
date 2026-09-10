# Hall Way Loop
 
A web application for managing residential/housing society operations, built with **Next.js 16** and a modern React stack. It uses **Prisma ORM** on top of PostgreSQL for data access and **Auth.js (NextAuth v5)** for authentication.
 
 
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
├── auth.ts             # Auth.js configuration/handlers
├── auth.config.ts       # Auth.js providers/config
├── middleware.tsx        # Route middleware (e.g. auth-protected routes)
├── next-auth.d.ts        # NextAuth type augmentations
├── prisma.config.ts       # Prisma configuration
└── routes.ts             # App route definitions
```
 
## Getting Started
 
### Prerequisites
 
- Node.js 18.18+ (or a version compatible with Next.js 16)
- A PostgreSQL database
- npm, yarn, pnpm, or bun

### 1. Clone the repository
 
```bash
git clone https://github.com/Sharmax12/Society-working.git
cd Society-working
```
 
### 2. Install dependencies
 
```bash
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
 
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
 
# Auth.js
AUTH_SECRET="generate-a-random-secret"
# Add any OAuth provider credentials your auth.config.ts requires
```
 
> Tip: You can generate an `AUTH_SECRET` with `npx auth secret`.
 
### 4. Set up the database
 
Apply the Prisma schema to your database:
 
```bash
npx prisma migrate dev
```
 
(Or `npx prisma db push` if you're not using migrations.)
 
### 5. Run the development server
 
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
 
 
## Available Scripts
 
| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
 
 
## Contributing
 
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request
## License
 
No license has been specified yet for this repository. Consider adding a `LICENSE` file to clarify how others can use this project.
 

