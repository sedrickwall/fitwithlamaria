# FitWord Design Guidelines

## Design Approach
**System:** Material Design 3 with accessibility enhancements
**Rationale:** Provides robust component patterns with strong visual feedback, proven accessibility standards, and clear hierarchy—essential for 65+ users who need consistent, learnable interfaces.

---

## Typography

**Font Family:**
- Primary: Inter or Roboto (Google Fonts CDN)
- Monospace: Roboto Mono (for puzzle letter grids)

**Scale (Desktop):**
- Headings (H1): 48px, Bold
- Headings (H2): 36px, Semibold  
- Headings (H3): 28px, Medium
- Body Large: 24px, Regular (minimum for all interactive elements)
- Body Medium: 20px, Regular
- Caption: 18px, Regular (never smaller)

**Scale (Mobile):**
- Headings (H1): 36px, Bold
- Headings (H2): 28px, Semibold
- Body/Interactive: 22px, Regular (minimum touch target compliance)

**Hierarchy Rules:**
- All buttons, form inputs, and CTAs: Minimum 24px
- Error messages: 20px, Medium weight
- Streak counters and stats: 32-48px, Bold (high visual prominence)

---

## Layout System

**Spacing Primitives:** Tailwind units 4, 6, 8, 12, 16, 24
- Micro spacing (cards, buttons): p-4, gap-4
- Component spacing: p-6, p-8
- Section spacing: py-12, py-16
- Screen margins: px-6 (mobile), px-8 (desktop)

**Grid System:**
- Dashboard cards: Single column mobile, 2-column tablet/desktop (grid-cols-1 md:grid-cols-2)
- Workout library: 1 column mobile, 2 columns tablet, 3 columns desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Max container width: max-w-7xl mx-auto

**Touch Targets:**
- Minimum: 56px × 56px (all interactive elements)
- Primary CTAs: 64px height, full-width on mobile
- Icon buttons: 64px × 64px minimum

---

## Component Library

### Navigation
- **Bottom Navigation Bar** (mobile primary):
  - 3 tabs: Home, Workouts, Progress
  - Icons + labels (always visible, never icon-only)
  - Active state: filled icons with indicator bar
  - Height: 72px (generous tap area)
  
- **Top App Bar:**
  - Fixed position, elevation/shadow for depth
  - Current date (left), user points (right)
  - Height: 64px

### Cards
- **Status Cards** (Dashboard):
  - Elevated surface with 8px rounded corners
  - Icon (64px) + Status text (24px) + Description (20px)
  - Generous padding: p-8
  - Clear visual state: Complete (checkmark icon) vs. Locked (lock icon)

- **Workout Cards:**
  - Thumbnail ratio 16:9
  - Duration badge (top-right overlay with blur backdrop)
  - Title: 24px Semibold
  - Metadata: 20px (duration, difficulty)
  - Tap target: entire card

### Buttons
- **Primary CTA:**
  - Height: 64px
  - Full-width on mobile, max-w-md on desktop
  - Rounded: rounded-xl
  - Text: 24px, Semibold
  - Elevation: shadow-lg
  
- **Secondary Actions:**
  - Height: 56px
  - Outlined style with 2px border
  - Text: 22px, Medium

- **Icon Buttons:**
  - Size: 64px × 64px
  - Icons: 32px (Heroicons via CDN)
  - Circular: rounded-full

### Forms & Inputs
- **Text Inputs:**
  - Height: 64px
  - Font size: 24px
  - Label: floating or always-visible above
  - Border: 2px solid, rounded-lg
  - Focus state: 3px border with glow effect

- **Keyboard (Puzzle):**
  - Letter keys: 56px × 56px minimum
  - QWERTY layout, 3 rows
  - Gap: gap-2 between keys
  - Font: 28px, Semibold, uppercase
  - Rounded: rounded-lg

### Puzzle Grid
- **5×5 Letter Boxes:**
  - Each box: 64px × 64px (mobile), 72px × 72px (tablet+)
  - Border: 3px solid
  - Letter: 40px, Bold, uppercase, centered
  - Spacing: gap-2 between boxes
  - States: empty, filled, correct (green), present (yellow), absent (gray)

### Progress Indicators
- **Streak Display:**
  - Flame icon (48px) + Number (48px Bold) + "days" (24px)
  - Prominent placement, elevated card
  
- **Points Counter:**
  - Coin/star icon (32px) + Number (36px Bold) + "pts" (20px)
  - Top-right position, always visible

- **Calendar View:**
  - Month grid: 7 columns (S-S)
  - Date cells: 56px × 56px
  - Completed days: filled circle indicator
  - Current day: outline ring

### Leaderboard
- **List Items:**
  - Height: 80px per entry
  - Rank badge (left): 48px circle
  - Name: 24px Medium
  - Points: 22px Regular
  - Dividers between items
  - User's own entry: highlighted with subtle elevation

### Video Player
- **Controls:**
  - Play/Pause: 80px circular button (center)
  - Skip buttons: 64px (±15 seconds)
  - Progress bar: 16px height, touch-friendly scrubber
  - Time display: 22px, bottom corners
  - Full-screen toggle: 56px (top-right)

### Modals & Overlays
- **Completion Celebrations:**
  - Full-screen modal with semi-transparent backdrop
  - Large success icon (128px)
  - Congratulations text: 36px Bold
  - Points earned: 48px, animated count-up
  - Confetti animation (subtle, 2s duration)
  - Dismiss button: 64px height

### Share Results
- **Results Grid:**
  - Wordle-style emoji squares (🟩🟨⬜)
  - Preview: 20px squares with 2px gap
  - "Share" button with native share icon
  - Copy-to-clipboard fallback

---

## Accessibility Standards

- **Contrast Ratios:** Minimum 7:1 for all text (AAA level)
- **Focus Indicators:** 4px outline, high contrast, visible on all interactive elements
- **Screen Reader:** ARIA labels on all icons, status announcements for streak updates
- **Motion:** Respect prefers-reduced-motion (disable confetti, smooth transitions only)
- **Font Scaling:** Support up to 200% text scaling without breaking layout

---

## Animations

**Sparingly Used:**
- Page transitions: 200ms fade
- Card elevation on tap: 150ms ease-out
- Puzzle letter flip: 300ms when submitted
- Streak increment: gentle scale pulse (1.05x, 400ms)
- Success confetti: 2s, only on puzzle completion

**Disabled Entirely:**
- Auto-playing carousels
- Background animations
- Parallax scrolling
- Continuous looping effects

---

## Images

**Workout Thumbnails:**
- 16:9 aspect ratio
- Show instructor in action, well-lit, high contrast
- Consistent framing across all videos
- Alt text: "{Workout type} - {Duration} minute {Level} workout"

**Empty States:**
- Friendly illustrations (not photos) showing encouragement
- Example: "No workouts yet today!" with person stretching illustration
- Keep simple, avoid clutter

**No Hero Image:** This is an app dashboard, not a marketing page—lead with functional status cards immediately.