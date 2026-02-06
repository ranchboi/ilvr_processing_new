# Visual Turing Test - Radiologist Response System

A modified Visual Turing Test application with database storage and automatic radiologist assignment. Each person who opens the link is assigned the next radiologist ID (A, B, C, ...) and their responses are saved to a database.

## Features

- **Automatic Radiologist Assignment**: Each new visitor gets the next ID (Radiologist A, B, C, ...) - no manual selection
- **Database Storage**: Responses saved to Supabase (PostgreSQL)
- **Vercel-Ready**: Designed for deployment on Vercel
- **Admin Panel**: Password-protected (admin1234) to view all responses
- **Local Fallback**: Works locally without database (saves to responses.json)

## Setup

### 1. Install Dependencies

```bash
cd "visual turing website agransh"
npm install
```

### 2. Database Setup (Supabase) - For Production

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
4. Go to **Settings** → **API** to get your credentials
5. Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: Use the **service_role** key (not anon) for the API routes - it's server-side only and never exposed to the client.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Without database**: The app works in fallback mode - assigns "Local-timestamp" IDs and saves to `responses.json`.

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

## Flow

1. **User opens link** → Sees intro/instructions
2. **Clicks "Proceed"** → Goes to Classify page
3. **First visit to Classify** → API assigns next radiologist ID (A, B, C, ...), stored in sessionStorage
4. **User completes form** → Selects Real/Fake for each scan, marks areas if Fake
5. **Clicks "Submit"** → Responses saved to database, redirects to Thanks page
6. **Next person opens link** → Gets the next radiologist ID (B, C, D, ...)

## Admin Panel

- **URL**: `/admin`
- **Password**: `admin1234`
- View all responses by radiologist
- Export as JSON

## Data Structure

Each submission in the database contains:
- `radiologist_id`: "A", "B", "C", or "Radiologist 27" (for 27+)
- `responses`: Array of scan responses with choice, reason, snippetCoordinates, images
- `final_survey`: Legacy FinalSurvey data
- `knowledge`: Expertise level (if collected)
