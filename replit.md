# FitWord - Fitness & Brain Games for Seniors

## Overview

FitWord is a premium fitness and brain health application designed for active seniors (65+). The app combines daily workout videos with cognitive puzzles, following a "move to unlock" model where users must complete a workout to access the daily word puzzle game. The application emphasizes accessibility, with large touch targets, high-contrast design, and Material Design 3 principles tailored for older users.

**Target Audience:** Women 65+ seeking gentle, effective fitness combined with mental engagement

**Brand Personality:** Vibrant, energetic yet calming, encouraging without patronizing, wellness-focused with emphasis on consistency and celebrating small wins. Modern gradient-based design inspired by contemporary web aesthetics (Base44-style)

**Core Features:**
- Daily workout library (seated, standing, balance exercises)
- Wordle-style daily puzzle unlocked after workout completion
- Streak tracking and points system
- Progress visualization with calendar and statistics
- Leaderboard for community engagement

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript, built using Vite for fast development and optimized production builds

**Routing:** Wouter (lightweight React router) with the following pages:
- Dashboard (/) - Main hub showing daily status
- Workouts (/workouts) - Browse workout library
- WorkoutPlayer (/workout/:id) - Video player for individual workouts
- Puzzle (/puzzle) - Daily word puzzle game
- Progress (/progress) - Stats, calendar, and leaderboard
- Premium (/premium) - Subscription upgrade page with Stripe checkout
- Success (/success) - Payment confirmation page

**State Management:** React hooks with custom hooks for domain logic:
- `useUserProfile` - User data and points management
- `useDailyStatus` - Today's completion status (workout/puzzle)
- TanStack Query for API data fetching (configured but minimal usage)

**UI Component System:**
- Shadcn/ui (Radix UI primitives) for accessible, composable components
- Tailwind CSS with custom gradient utilities and vibrant color palette
- Modern gradient buttons inspired by Base44 design aesthetic
- Custom typography scale (minimum 24px for interactive elements, 18px minimum overall)
- Touch target minimum: 56x56px (64px for primary CTAs)

**Design System:**
- CSS custom properties for theming with gradient support
- Vibrant gradient color palette:
  - Primary: Teal-to-green gradient (HSL 174,62%,47% → 154,50%,50%)
  - Secondary: Purple-to-lavender gradient (HSL 267,70%,65% → 290,65%,60%)
  - Accent: Pink-to-coral gradient (HSL 340,82%,62% → 14,78%,65%)
  - Warning: Gold-to-orange gradient (HSL 38,92%,50% → 30,85%,55%)
- Responsive grid: single column mobile, 2-column tablet, up to 3-column desktop
- Diagonal gradients (135deg) for dynamic visual movement
- Inter/Roboto font families from Google Fonts
- Accessibility-first: white text on gradients, large touch targets, ARIA labels, keyboard navigation

### Backend Architecture

**Server Framework:** Express.js with TypeScript running on Node.js

**API Design:** RESTful endpoints under `/api` prefix:
- `/api/puzzle` - Wordle puzzle game logic and validation
- `/api/wordsearch` - Word search puzzle game logic
- `/api/puzzletype` - Determines puzzle type and difficulty based on index
- `/api/stripe` - Stripe payment integration for premium subscriptions

**Data Storage Strategy:**
- **Current:** In-memory storage using `MemStorage` class implementing `IStorage` interface
- **Configured for:** PostgreSQL via Drizzle ORM with Neon serverless driver
- Database schema defined in `shared/schema.ts` using Zod for validation

**Session Management:** Placeholder for connect-pg-simple session store (PostgreSQL-backed sessions)

**Build Process:**
- Frontend: Vite build → `dist/public`
- Backend: esbuild bundles server to ESM → `dist/index.js`
- Development: Vite dev server with HMR, proxy setup for API routes

### Data Models

**Core Schemas (Zod-validated):**

1. **UserProfile**
   - id, name, age, fitnessLevel
   - totalPoints, currentStreak, lastActiveDate

2. **Workout**
   - id, title, category (seated/standing/balance)
   - duration, difficulty (low/medium)
   - videoUrl (YouTube embeds), thumbnail

3. **WorkoutCompletion**
   - id, userId, workoutId, completedAt, date, pointsEarned

4. **PuzzleAttempt**
   - id, userId, date, word, guesses[], solved, attempts, pointsEarned

5. **DailyStatus**
   - date, workoutCompleted, puzzleUnlocked, puzzleSolved, totalPointsEarned

**Points System:**
- Workout completion: 100 points
- Puzzle solved: 50 points
- Puzzle bonus (≤4 attempts): +25 points
- Daily streak bonus: 10 points per day

### Data Persistence

**Current Implementation:** Browser localStorage for all client-side persistence
- User profiles stored as JSON
- Workout/puzzle completion history
- Daily status tracking
- Streak calculation based on completion dates

**Migration Path:** Schema is defined for PostgreSQL with Drizzle ORM ready for database migration when needed

### Game Logic

**Daily Puzzle Mechanics:**
- Deterministic word selection based on day number (modulo word list)
- 5-letter positive/wellness-themed words
- Standard Wordle rules: correct (green), present (yellow), absent (gray)
- 6 attempts maximum
- Puzzle locked until daily workout completed

**Workout System:**
- YouTube video embeds for exercise content
- Sample workout library (10 min - 20 min durations)
- Categories: seated, standing, balance
- Completion tracked with timestamp

**Streak Tracking:**
- Calculated by consecutive completion dates
- Resets if day missed
- Bonus points awarded for maintaining streaks

## External Dependencies

### Third-Party Services

**Video Hosting:** YouTube (embedded players via iframe)
- No direct API integration
- Sample workout videos from fitness channels
- Future: Could integrate brand-specific LaMaria Wall content

**Fonts:** Google Fonts CDN
- Inter (primary UI)
- Roboto Mono (puzzle letter grids)

### Database

**Configured:** PostgreSQL via Neon serverless
- Connection: `@neondatabase/serverless` driver
- ORM: Drizzle with migrations in `/migrations`
- Schema: `shared/schema.ts`
- Config: `drizzle.config.ts` (requires DATABASE_URL env var)

**Note:** Database is configured but not currently connected; app uses in-memory/localStorage storage

### UI Component Libraries

**Radix UI Primitives:** Comprehensive set of accessible component primitives
- Dialog, Dropdown, Popover, Tabs, Toast, etc.
- All components use Radix for accessibility foundation

**Utility Libraries:**
- `class-variance-authority` - Component variant styling
- `clsx` / `tailwind-merge` - Conditional className management
- `date-fns` - Date formatting and manipulation
- `lucide-react` - Icon system

### Development Tools

**Replit-Specific:**
- `@replit/vite-plugin-runtime-error-modal` - Error overlay
- `@replit/vite-plugin-cartographer` - Dev tooling
- `@replit/vite-plugin-dev-banner` - Environment indicator

**Build Tools:**
- Vite - Frontend bundler and dev server
- esbuild - Backend bundler
- TypeScript - Type checking
- PostCSS with Tailwind

## Payment Integration

**Stripe Subscription System:**
- Integrated via Replit's Stripe blueprint for secure payment processing
- Premium subscription pricing:
  - Monthly: $4.99/month
  - Yearly: $49/year (saves $10.88 vs monthly)
- Stripe Checkout flow for secure card payments
- Environment variables managed via Replit Secrets:
  - `STRIPE_SECRET_KEY` - Server-side secret key
  - `VITE_STRIPE_PUBLIC_KEY` - Client-side publishable key
  - `VITE_STRIPE_MONTHLY_PRICE_ID` - Monthly subscription price ID
  - `VITE_STRIPE_YEARLY_PRICE_ID` - Yearly subscription price ID
  
**Payment Features:**
- Subscription checkout sessions via Stripe hosted pages
- Payment intent API for custom checkout flows
- Success/cancel redirect handling
- Automatic payment confirmation

**Implementation:**
- Backend: `server/routes/stripe.ts` handles payment session creation
- Frontend: Premium page with Stripe Elements integration
- Upgrade CTA displayed on Progress page
- Post-payment redirect to success page

**Note:** Requires Stripe account and Price ID configuration for production use

### Future Integration Opportunities

1. **Real Database:** Migration from localStorage to PostgreSQL already configured
2. **Video CDN:** Custom workout video hosting beyond YouTube
3. **Analytics:** Track user engagement, completion rates
4. **Social Features:** Friend challenges, group leaderboards
5. **Subscription Management:** Webhook handlers for subscription updates, cancellations
6. **User Roles:** Premium vs free tier feature gating