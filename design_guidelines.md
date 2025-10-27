# Fit with LaMaria - Design Guidelines

## Brand Identity

### About the Founder
**LaMaria Wall** (@lamaria_wall / @yogic_yogi) is a dedicated yoga and fitness instructor who created this app to help active seniors (65+) maintain both physical fitness and mental sharpness through daily movement and brain games.

### Brand Mission
Fit with LaMaria combines gentle, effective workouts with cognitive puzzles to help you nourish your body and mind every day. Complete your workout to unlock today's brain game.

### Brand Personality
- **Sophisticated but approachable** - Elegant design that never feels intimidating
- **Encouraging without patronizing** - Respectful tone that celebrates your capabilities
- **Wellness-focused** - Holistic approach to health, mind and body
- **Consistency-oriented** - Emphasizes daily practice and sustainable habits
- **Achievement-celebrating** - Honors small wins and progress milestones

### Brand Voice & Messaging

#### Tone Principles
- **Warm and supportive**: "You've got this" energy
- **Respectful and mature**: Never condescending or childish
- **Health-focused**: "Nourish your body and mind"
- **Achievement-oriented**: "Today's win starts now"
- **Professional**: Proper grammar, clear communication

#### Sample Copy Patterns
- ✅ "Wonderful work! You're building strength every day."
- ✅ "Your daily practice nourishes both body and mind."
- ✅ "You've earned today's brain game. Ready to play?"
- ❌ "Great job kiddo!" (too patronizing)
- ❌ "You did it! 🎉🎉🎉" (excessive, childish)

---

## Color Palette (Wellness-Inspired)

### Primary Colors (Vibrant Gradients)

#### Teal/Turquoise Gradient
- **Color**: HSL(174, 62%, 47%) → HSL(154, 50%, 50%)
- **Gradient**: `linear-gradient(135deg, teal to green)`
- **Usage**: Primary buttons, workout states, main CTAs
- **Represents**: Energy, vitality, wellness, fresh start
- **Applications**: "Begin Movement" button, workout cards, primary actions

#### Purple/Lavender Gradient  
- **Color**: HSL(267, 70%, 65%) → HSL(290, 65%, 60%)
- **Gradient**: `linear-gradient(135deg, purple to lavender)`
- **Usage**: Secondary buttons, puzzle elements, brain health
- **Represents**: Mental clarity, focus, wisdom
- **Applications**: "Play Brain Game" button, puzzle UI, secondary actions

#### Pink/Coral Gradient
- **Color**: HSL(340, 82%, 62%) → HSL(14, 78%, 65%)
- **Gradient**: `linear-gradient(135deg, pink to coral)`
- **Usage**: Accent elements, celebrations, achievements
- **Represents**: Joy, accomplishment, celebration
- **Applications**: Achievement badges, completion messages, special highlights

#### Gold/Orange Gradient
- **Color**: HSL(38, 92%, 50%) → HSL(30, 85%, 55%)
- **Gradient**: `linear-gradient(135deg, gold to orange)`
- **Usage**: Points, streaks, rewards
- **Represents**: Rewards, brain health, daily wins
- **Applications**: Points display, streak counters, bonus indicators

**Design Philosophy**: Inspired by modern, vibrant web aesthetics (Base44-style). Uses bright, optimistic gradients that energize without overwhelming. All gradients flow at 135deg (diagonal) for dynamic movement.

### Neutral Palette

#### Cream `#F8F4F0`
- **Usage**: Page backgrounds (light mode)
- **Warm, calming base**

#### Warm White `#FFFFFF`
- **Usage**: Card backgrounds, elevated surfaces
- **Clean, spacious feel**

#### Charcoal `#2B2D42`
- **Usage**: Primary text, dark mode backgrounds
- **Strong, readable contrast**

#### Light Gray `#E5E5E5`
- **Usage**: Borders, dividers, locked states
- **Subtle separation**

### Color Usage Guidelines

**Workouts**: Sage Green (#6B9080) for workout-related elements  
**Puzzles**: Deep Plum (#5D576B) for brain game elements  
**Success**: Warm Coral (#E76F51) for completion states  
**Achievements**: Soft Gold (#F4A261) for streaks and points  
**Locked**: Light Gray (#E5E5E5) for disabled states

### Accessibility Requirements
All interactive elements prioritize **readability and large touch targets**:
- **Text on Gradients**: White text (100% opacity) on vibrant gradients ensures high contrast
- **Button Accessibility**: All buttons use gradient backgrounds with white text
- **Touch Targets**: Minimum 56px height for all interactive elements (64px for primary CTAs)
- **Font Sizes**: Minimum 18px body text, 24px+ for interactive elements
- **Gradients**: Diagonal gradients (135deg) avoid vertical/horizontal reading barriers
- **Icons**: Always paired with text labels for clarity

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

### Size Guidelines (Senior-Friendly)

**Minimum Sizes for Accessibility:**
- Body text: **24px (1.5rem)** minimum
- Secondary text: **20px (1.25rem)** minimum
- Headings: **32px (2rem)** minimum
- Large headings: **48px (3rem)** for hero sections
- Touch targets: **56×56px** minimum

### Font Hierarchy

#### Display (Hero Text)
- Size: 48-60px
- Weight: 600-700 (Semi-bold to Bold)
- Line height: 1.1
- Use for: Welcome messages, page heroes

#### Heading 1
- Size: 40px
- Weight: 700 (Bold)
- Line height: 1.2
- Use for: Page titles

#### Heading 2
- Size: 32px
- Weight: 600 (Semi-bold)
- Line height: 1.3
- Use for: Section titles

#### Heading 3
- Size: 28px
- Weight: 600 (Semi-bold)
- Use for: Card headings

#### Body Large
- Size: 24px
- Weight: 400 (Regular)
- Line height: 1.5
- Use for: Primary content, interactive elements

#### Body Medium
- Size: 20px
- Weight: 400 (Regular)
- Use for: Metadata, descriptions

---

## Layout System

### Spacing (8px Grid)
- Micro: 8px (0.5rem)
- Small: 16px (1rem)
- Medium: 24px (1.5rem)
- Large: 32px (2rem)
- XL: 48px (3rem)
- XXL: 64px (4rem)

### Touch Targets
- **Minimum**: 56px × 56px for all interactive elements
- **Primary buttons**: 64px height minimum
- **Icon buttons**: 64px × 64px

### Grid System
- Dashboard: 1 column mobile, 2 columns tablet+
- Workouts: 1 column mobile, 2 tablet, 3 desktop
- Max width: `max-w-7xl` centered

---

## Visual Style

### Design Aesthetics
- **Clean and uncluttered**: Generous white space
- **Elegant simplicity**: Refined without complexity
- **Calming presence**: Soft shadows, gentle transitions
- **Yoga/wellness inspired**: Balanced, harmonious

### Shadows & Depth
```css
/* Subtle elevation (cards) */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

/* Moderate elevation (modals) */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

/* Strong elevation (overlays) */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
```

### Border Radius
- Cards: 12px (`rounded-xl`)
- Buttons: 8px (`rounded-lg`)
- Inputs: 8px (`rounded-lg`)
- Images: 8px (`rounded-lg`)

---

## Component Guidelines

### Buttons

#### Primary (Sage Green)
- Background: `#6B9080`
- Text: White
- Height: 56px minimum
- Padding: 16px 32px
- Font: 24px, Semi-bold
- Use: Main actions (Mark Complete, Submit)

#### Secondary (Deep Plum)
- Background: `#5D576B`
- Text: White
- Height: 56px minimum
- Use: Navigation, secondary actions

#### Accent (Warm Coral)
- Background: `#E76F51`
- Text: White
- Use: Celebrations, special achievements

### Cards

#### Workout Cards
- Background: White
- Border: 2px Sage Green
- Shadow: Subtle
- Hover: Lift with shadow increase

#### Puzzle Cards
- Background: White
- Border: 2px Deep Plum
- Locked: Light Gray border

#### Stats/Achievement Cards
- Background: White
- Accent: Soft Gold highlights
- Icon: 64px
- Generous padding: p-8

### Status Indicators

#### Completed
- Color: Sage Green
- Icon: CheckCircle
- Message: Warm, affirming

#### Locked
- Color: Light Gray
- Icon: Lock
- Message: Clear unlock instruction

#### Streak/Points
- Color: Soft Gold
- Large, prominent display
- Celebratory tone

### Success Messages

**Use warm, encouraging language:**
- "Wonderful work! You earned **100 points**"
- "Beautiful! You've unlocked today's brain game"
- "Excellent focus! **+50 points** for solving the puzzle"
- "You're on a **3-day streak**—your consistency is inspiring!"

**Avoid:**
- Childish language or excessive emojis
- Patronizing tone
- Generic "Good job!"

---

## Layout Patterns

### Top Bar
- Background: Deep Plum or White
- Height: 64px
- Left: "Fit with LaMaria" branding
- Right: Points display (Soft Gold icon + number)

### Dashboard Hero
```
[Greeting - 48px]
"Good morning!"

[Tagline - 24px, supportive]
"Your daily practice nourishes body and mind"

[Status Cards Grid]
```

### Bottom Navigation
- 3 tabs: Home, Workouts, Progress
- Icons + labels (always visible)
- Height: 72px
- Active: Filled icon with indicator

### Puzzle Grid
- 6 rows × 5 columns
- Box size: 64px × 64px
- Gap: 8px
- Border: 3px solid
- Letter: 40px, bold, centered
- Colors: Green (correct), Yellow (wrong position), Gray (absent)

### Calendar
- 7-column grid (Sun-Sat)
- Cell size: 56px × 56px
- Completed: Sage Green fill
- Today: Warm Coral outline

---

## Accessibility Checklist

✅ **Text**: 24px minimum for body  
✅ **Contrast**: 7:1 ratio (WCAG AAA)  
✅ **Touch targets**: 56×56px minimum  
✅ **Color independence**: Never color alone  
✅ **Labels**: Descriptive, helpful  
✅ **Errors**: Gentle, solution-oriented  
✅ **Loading**: Clear indicators  
✅ **Focus**: Visible keyboard navigation  
✅ **Zoom**: Support 200% text scaling  

---

## Animation & Motion

### Transitions
- Duration: 200-300ms
- Easing: `ease-in-out`
- **Respect `prefers-reduced-motion`**

### Hover States
- Subtle lift (2-4px)
- Shadow increase
- Smooth color transitions

### Success Celebrations
- Gentle fade-in
- Avoid excessive motion
- Focus on clarity

---

## Dark Mode

When implementing:
- Background: Charcoal (#2B2D42)
- Text: Warm White
- Maintain 7:1+ contrast
- Adjust accent colors for dark backgrounds
- Keep calming aesthetic

---

## Testing Standards

### Visual
- Test with 200% zoom
- Test on mobile, tablet, desktop
- Verify contrast with tools
- Test with screen readers

### User Experience
- Can seniors navigate easily?
- Is tone warm and encouraging?
- Are touch targets large enough?
- Is feedback clear and affirming?

---

**Remember**: Every design decision honors LaMaria's mission—helping active seniors stay physically fit and mentally sharp with warmth, respect, and elegance.
