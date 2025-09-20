# ReelVault

ReelVault is a project I built from a personal need.  
While scrolling through Instagram or Facebook, I often find reels or posts that are funny, inspiring, or useful. I usually want to save them to revisit later — but the built-in save features feel messy and unorganized and i cant search.

So I thought: _why not build my own system?_

ReelVault lets me:

- Save reels I enjoy or want to return to
- Organize them into collections
- Add notes and tags for context
- Search and filter to find them quickly
- Auth system because why not
- It's scalable so i can always update and upgrade it

---

## Tech Stack

- Next.js (App Router)
- Tailwind CSS + shadcn/ui
- NextAuth.js
- Prisma
- MySql
- Vercel (deployment)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ReelVault.git
cd ReelVault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

- `DATABASE_URL`: Your MySQL database connection string
- `JWT_SECRET`: A secure random string for JWT token signing

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Vercel Deployment

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository

2. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the repository and click "Import"

3. **Environment Variables**: Add these in Vercel dashboard → Settings → Environment Variables:

   ```
   DATABASE_URL=your_mysql_connection_string
   JWT_SECRET=your_secure_random_string
   ```

4. **Deploy**: Click "Deploy" - Vercel will automatically:
   - Install dependencies
   - Generate Prisma client
   - Build the application
   - Deploy to production

**Important**: Make sure your MySQL database is accessible from Vercel (use services like PlanetScale, Railway, or Supabase for production).

---

## Features

- **Facebook Video Downloads**: Download Facebook videos directly
- **Instagram & Facebook Thumbnails**: Preview videos with thumbnails
- **User Authentication**: Secure login/register system
- **Reel Management**: Save, categorize, and search your saved reels
- **Responsive Design**: Works on desktop and mobile

---

## License

MIT License
