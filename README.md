ReelVault

ReelVault is a project I built from a personal need. Whenever I scroll through Instagram or Facebook, I often find reels or posts that are funny, inspiring, or useful — but I never had a good way to save and organize them. I’d forget, lose them in my likes, or struggle to find them later.

So I asked myself: why not build a system that lets me save, organize, and revisit reels anytime I want? ReelVault is my answer — a web app that makes it easy to collect reels, add notes, group them in collections, and search through them later. It’s not just about storage; it’s about turning my social media discoveries into an organized library I can actually return to.

Project Objectives

Save, organize, and revisit reels quickly

Fast add flow with validation and smart metadata

Clean dashboard with powerful search and filters

Smooth authentication and reliable sync

Design Principles

Minimal and purposeful

Speed and clarity first

Smart defaults to reduce cognitive load

Optimized for both keyboard and mobile users

Features

Add reels with title, tags, notes, and collections

Grid and list views with reel cards

Video embedding via iframe

Edit and delete functionality

Search and filter by title, tags, or collections

Optional stretch features: favorites, auto-metadata, public collections, import/export, dark mode

Technical Stack

Framework: Next.js (App Router)

Styling: Tailwind CSS + shadcn/ui

Auth: NextAuth.js

Database: Supabase or PlanetScale + Prisma ORM

Validation: Zod

Hosting: Vercel

Development Setup

Clone the repository:

git clone https://github.com/your-username/reelvault.git
cd reelvault


Install dependencies:

npm install


Set up environment variables (see .env.example).

Run the development server:

npm run dev

Roadmap

Core setup complete

Authentication connected and stable

Add Reel flow polished

Dashboard usable and responsive

Search and filters fast

Deployment live on Vercel

License

This project is licensed under the MIT License.
