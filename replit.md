# FitWord - Fitness & Brain Games for Seniors

## Overview
FitWord is a premium fitness and brain health application designed for active seniors (65+). It combines daily workout videos with cognitive puzzles, using a "move to unlock" model where users complete a workout to access a daily word puzzle. The app prioritizes accessibility with large touch targets, high-contrast design, and Material Design 3 principles. Its target audience is women 65+ seeking gentle fitness and mental engagement. The brand personality is vibrant, encouraging, and wellness-focused, featuring a modern gradient-based design.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
**Framework:** React 18 with TypeScript (Vite).
**Routing:** Wouter, managing pages like Dashboard, Workouts, Puzzle, Progress, Community, Premium, and user authentication flows.
**First-Time User Experience:** An onboarding carousel guides new users, configurable via `client/src/config/onboarding.json`.
**State Management:** React hooks with custom hooks for user profiles, daily status, and TanStack Query for API data fetching.
**UI Component System:** Shadcn/ui (Radix UI primitives) and Tailwind CSS with custom gradient utilities. Emphasizes accessibility with large touch targets (min 56x56px), high-contrast design, and a custom typography scale (min 24px for interactive elements).
**Design System:** Uses CSS custom properties for theming, a vibrant gradient color palette (Teal-to-green, Purple-to-lavender, Pink-to-coral), responsive grid, and Google Fonts (Inter/Roboto).

### Backend Architecture
**Server Framework:** Express.js with TypeScript (Node.js).
**API Design:** RESTful endpoints under `/api` for puzzle logic, and Stripe integration.
**Data Storage Strategy:** Currently uses in-memory storage and browser localStorage for client-side persistence, but is configured for PostgreSQL via Drizzle ORM with Neon serverless driver.
**Data Models:** Core Zod-validated schemas for UserProfile, Workout, WorkoutCompletion, PuzzleAttempt, and DailyStatus, supporting a points system.

### Game Logic
**Daily Puzzle Mechanics:** Deterministic 5-letter word selection based on day, standard Wordle rules, locked until daily workout completion.
**Workout System:** YouTube video embeds for exercise content, with completion tracked.
**Streak Tracking:** Calculated by consecutive completion dates with bonus points.

### Community Features (Premium)
**Social Feed System:** Premium-only, real-time activity feed using Firestore, showing recent posts, user achievements, cheers, and comments. Auto-posts user achievements upon workout or puzzle completion for premium users.
**Accessibility:** Ensures large touch targets, text labels with icons, ARIA labels, high-contrast design, and keyboard navigation.

## External Dependencies

### Third-Party Services
**Video Hosting:** YouTube (embedded players).
**Fonts:** Google Fonts CDN (Inter, Roboto Mono).

### Database
**Configured:** PostgreSQL via Neon serverless, using Drizzle ORM. (Currently uses in-memory/localStorage).

### UI Component Libraries
**Radix UI Primitives:** Provides accessible UI components.
**Utility Libraries:** `class-variance-authority`, `clsx`/`tailwind-merge`, `date-fns`, `lucide-react` (icons).

### Development Tools
**Replit-Specific:** `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`.
**Build Tools:** Vite, esbuild, TypeScript, PostCSS with Tailwind.

### Payment Integration
**Stripe Subscription System:** Integrated for premium subscriptions (monthly/yearly with 7-day free trial). Uses Stripe Checkout for secure payments, handles webhooks for subscription events, and manages environment variables via Replit Secrets.