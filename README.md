# CampusCircle

A campus society management platform. Students discover and apply to societies with one click; society admins review applications, ask custom questions, and manage decisions from a single dashboard.

## Features

- **Google & GitHub OAuth** sign-in via Auth.js v5
- **Student dashboard** — browse open societies, apply, and track application status (pending / accepted / rejected)
- **Custom application forms** — each society defines its own set of required/optional questions
- **Admin dashboard** — society admins create societies, review applications, and accept or reject students
- **Role-based access** (`STUDENT` / `ADMIN`) enforced at the route level
- Built on **MongoDB** via Prisma ORM

## Tech stack

| Layer      | Tech                                      |
|------------|--------------------------------------------|
| Framework  | Next.js 16 (App Router, Turbopack)         |
| Auth       | Auth.js v5 (`next-auth`) + Prisma Adapter  |
| Database   | MongoDB                                    |
| ORM        | Prisma ORM 6                               |
| UI         | Tailwind CSS, shadcn/ui, Radix Primitives  |
| Notifications | Sonner (toasts)                         |

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/Sharmax12/Society-working.git
cd Society-working
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>"
AUTH_SECRET="generate-with-npx-auth-secret"

AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"

SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="CampusCircle <no-reply@example.com>"
```

Generate an `AUTH_SECRET` with:

```bash
npx auth secret
```

### 3. Push the Prisma schema to MongoDB

```bash
npx prisma db push
npx prisma generate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  (auth)/(root)/        # Public marketing home page + layout (Header/Footer)
  auth/sign-in/          # Sign-in page
  api/auth/[...nextauth] # Auth.js route handler
  dashboard/              # Student dashboard
  apply/[id]/             # Society application form
  admin/                  # Admin dashboard
  admin/societies/new/    # Create-society form
  admin/societies/[id]/   # Review applications for a society

modules/
  auth/                  # Sign-in/out actions & components
  societies/             # Society queries, admin queries, create-society form
  applications/          # Application submission & review actions/components
  home/                  # Header, Footer

prisma/
  schema.prisma          # User, Account, Society, Question, Application, Answer models
```

## Data model overview

- **User** — student or admin (`role`), linked to OAuth `Account`s
- **Society** — created and managed by an admin, has custom `Question`s and a deadline
- **Application** — a student's submission to a society, one per student per society
- **Answer** — a student's response to a specific `Question` on an `Application`

## Roles

- **STUDENT** (default) — can browse open societies, apply, and track their applications
- **ADMIN** — can create societies, define application questions, and accept/reject applicants for societies they manage

Role changes currently require a direct database update. Sign out and back in after changing a role so the session picks up the new value.

## License

Not yet licensed.
