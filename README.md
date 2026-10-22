# HallWayLoop

**Discover. Belong. Connect.**

HallWayLoop is a campus platform for finding societies, keeping up with events, and handling society applications without jumping between notice boards, group chats, and separate forms.

Live demo: [campuscircle-seven.vercel.app](https://campuscircle-seven.vercel.app/)

## What the app does

A student can:

- browse verified societies and filter them by interest
- open a society page and see its application deadline
- apply once and track the application from the dashboard
- browse upcoming and past campus events

Society admins can:

- create societies and application questions
- review applications and change their status
- invite applicants to interviews
- create and remove society admins
- publish events for the societies they manage

The public directory and event pages only expose verified societies. Admin access is also scoped so a society admin only manages the societies they have been assigned to.

## Authentication

HallWayLoop uses Auth.js / NextAuth with a shared JWT session for Google and local email/password sign-in.

- Local registration creates a user with a salted scrypt password hash and requires email verification before password sign-in; plaintext passwords are never stored.
- Local sign-in uses the Auth.js Credentials provider and the same session callbacks as OAuth sign-in.
- An email already registered with Google or GitHub cannot be claimed by creating a second local account.
- The college-domain allowlist restricts which addresses can register; it is not proof of enrollment or a college endorsement.
- Auth flows include single-use email verification and password-reset links; configure a verified email sender and production app URL, then test delivery/expiry/replay before launch. Shared database-backed rate limits require the migrations to be applied.

## Why the project is structured this way

The main idea is to keep the student experience simple while keeping the rules on the server.

The database contains the campus relationships: users, societies, admins, applications, questions, answers, and events. Server actions handle changes to that data, while the App Router pages focus on showing the current state.

Authentication is handled by Auth.js with Google and Credentials sign-in. Prisma is used for PostgreSQL access.

## Stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix UI
- Auth.js / NextAuth
- Prisma with PostgreSQL
- Recharts, Sonner, cmdk, and a few small UI utilities

## Project layout

```
app/          Next.js routes and pages
components/   Shared UI pieces
hooks/        Reusable React hooks
lib/          Database, email, SEO, and utility code
modules/      Feature-specific queries, actions, and components
prisma/       Schema and migrations
public/       Static assets
```

## Run it locally

You need Node.js 20.19+ and a PostgreSQL database.

```bash
git clone https://github.com/Sharmax12/Society-working.git
cd Society-working
npm install
```

Create a `.env` file with the database and Auth.js values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

AUTH_SECRET="your-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Optional email notifications
RESEND_API_KEY=""
EMAIL_FROM="Society <onboarding@resend.dev>"
```

Then:

```bash
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## A few implementation notes

- Applications are unique per student and society.
- A society has a primary owner plus optional scoped admins.
- Unverified societies are hidden from the public society and event pages.
- Application and interview emails are best-effort; an email provider failure does not undo the database change.
- Connect supports connection requests and direct messaging between accepted connections.
- Existing password accounts without a verification timestamp must re-verify their email before credentials sign-in; plan this migration carefully and verify email/password reset delivery before opening registration to the public.

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## License

GNU General Public License. See [LICENSE](LICENSE).
