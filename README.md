# SagarFlix

[![CI](https://github.com/sagarbpatel31/SagarFlix/actions/workflows/ci.yml/badge.svg)](https://github.com/sagarbpatel31/SagarFlix/actions/workflows/ci.yml)

SagarFlix is a Netflix-style career operating system for Sagar Patel. The current build includes a polished frontend foundation with authentication, database persistence, and AI-powered blog generation:

- Portfolio projects
- SignalForge and Sagar OS showcase pages
- Blog dashboard and generator UI (with OpenAI integration)
- Job application tracker with Google Sheets CSV import
- **User authentication (NextAuth.js) with GitHub/Google OAuth**
- **PostgreSQL database with Prisma ORM for job persistence**
- Responsive, cinematic dashboard styling

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- NextAuth.js (Authentication)
- Prisma ORM (Database)
- OpenAI API (Blog Generation)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Set up the database:

```bash
npx prisma migrate dev --name init
```

4. Run the app locally:

```bash
npm run dev
```

5. Run the test suite:

```bash
npm test
```

CI mirrors the local validation flow and runs both commands on push and pull request:

- `npm test`
- `npm run build`

6. Open the site:

```text
http://localhost:3000
```

## Routes

- `/` Home dashboard
- `/portfolio` Portfolio projects
- `/projects/[slug]` Project detail pages
- `/blog` Blog dashboard
- `/blog/generate` Blog generator UI (with OpenAI)
- `/blog/drafts` Blog draft library
- `/blog/drafts/[id]` Blog draft detail
- `/jobs` Job application tracker (with auth & persistence)
- `/signalforge` SignalForge showcase
- `/sagar-os` Sagar OS showcase
- `/resume` Resume/contact page
- `/auth/signin` Sign in page

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | App URL (e.g., http://localhost:3000) | Yes |
| `NEXTAUTH_SECRET` | Secret for session encryption (generate with `openssl rand -base64 32`) | Yes |
| `AUTH_TRUST_HOST` | Set to `true` on Vercel / behind a proxy | Recommended |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub OAuth credentials | No |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials | No |
| `OPENAI_API_KEY` | OpenAI API key for blog generation | No |
| `NEXT_PUBLIC_BLOG_PROVIDER` | `mock` or `openai` (default: `mock`) | No |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used for metadata and sitemap generation | Recommended |

## Data Sources

Local mock data still lives in:

- `data/projects.ts`
- `data/jobs.ts`
- `data/blogs.ts`

The jobs portal also imports company names from the public Google Sheets CSV:

- `https://docs.google.com/spreadsheets/d/1QezZa9Y8OK-XImA_wqZg2vNoon5L8e_qv9xKsQ1aKiA/gviz/tq?tqx=out:csv&gid=1942102382`

Supported sheet columns when you add them later:

- `company`
- `careerUrl`
- `roleKeywords`
- `status`
- `priority`
- `notes`
- `tags`
- `location`
- `slug`

If those columns are absent, the importer falls back to the current company-name scan and local metadata heuristics.

## Job Tracker

The jobs portal now supports **authenticated, database-persisted** job tracking:

- Add companies from the Google Sheet to your personal tracker after signing in
- Edit `status`, `priority`, `notes` per application
- Data persists across sessions and devices
- Local browser fallback still works for unauthenticated users
- Filter chips can be combined, and they currently match as an OR across active tags/statuses

The sign-in page only shows OAuth providers that are actually configured in the environment, and the jobs portal shows a `Sign in to add` CTA on sheet cards until a session is available.

Browser-verified flows:

- Sign-in fallback state when no OAuth providers are configured
- Jobs tracker gated add-to-tracker behavior for unauthenticated users
- Jobs tracker sheet cards swap the dead add action for a sign-in CTA when unauthenticated
- Blog generator mock provider updates the preview and saves drafts locally
- Blog draft helpers persist, toggle, and remove saved drafts in browser storage

## Blog Generator

The blog generator uses a provider interface:

- `mock` - Local template-based generator (default, no API key needed)
- `openai` - OpenAI GPT-4o powered generation (requires `OPENAI_API_KEY`)

Set `NEXT_PUBLIC_BLOG_PROVIDER=mock|openai` to choose the active provider.

Generated blog drafts are saved locally in browser storage so you can:
- Reload a saved draft into the editor
- Copy the full draft or social post version
- Clear saved drafts from the UI

Saved drafts can also be selected from the blog dashboard and loaded into `/blog/generate`.

## Database Schema

Run migrations after updating the Prisma schema:

```bash
npx prisma migrate dev --name <migration_name>
```

View the database:

```bash
npx prisma studio
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Set `AUTH_TRUST_HOST=true` and `NEXT_PUBLIC_SITE_URL` to your production domain
5. Run `npx prisma migrate deploy` as a build step or via Vercel CLI

### Database Options

- **Supabase** (PostgreSQL) - Free tier available
- **Neon** (Serverless PostgreSQL) - Free tier available
- **Railway** / **Render** / **PlanetScale**

## Next Steps

- Set up CI/CD pipeline
- Add analytics/error tracking (Sentry, Vercel Analytics)
- Implement resume page with PDF generation
- Add project detail pages with case studies
- Add a real AI provider behind the existing blog generator interface
