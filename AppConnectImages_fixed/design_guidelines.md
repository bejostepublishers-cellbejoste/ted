# Creator-Brand Marketplace Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from professional marketplace platforms (Upwork, Fiverr) combined with Linear's clean dashboard aesthetics and Stripe's trustworthy payment flows. This platform connects two distinct user types (creators and brands) and requires clear visual hierarchy to guide different user journeys while building trust.

## Core Design Elements

### A. Typography

**Primary Font**: Inter or DM Sans (Google Fonts)
- Hero Headlines: 48px-64px, font-weight 700
- Section Headers: 32px-40px, font-weight 600
- Card Titles: 20px-24px, font-weight 600
- Body Text: 16px, font-weight 400
- Small Text/Labels: 14px, font-weight 500

**Secondary Font**: System stack for UI elements and data tables

### B. Layout System

**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Container max-width: `max-w-7xl` for main content
- Section padding: `py-16 md:py-24` for major sections
- Card padding: `p-6`
- Component gaps: `gap-6` for grids, `gap-4` for lists

### C. Component Library

**Navigation**
- Fixed header with transparent-to-solid on scroll
- Logo left, primary CTA right ("Sign Up" / "Post Opportunity")
- User role toggle visible after login (Creator/Brand view)

**Hero Section**
- Full-viewport height (min-h-screen) with large background image
- Dual headline approach: "For Creators" / "For Brands" toggle or split
- Primary CTA with blurred background: "Start Creating" / "Find Creators"
- Trust indicators: "10,000+ successful collaborations" with small icons

**Cards**
- Deal/Opportunity Cards: Image thumbnail, title, amount, brand/creator name, "View Details" CTA
- Elevated shadow on hover (shadow-lg)
- Status badges (Pending, Active, Completed) with subtle indicators

**Dashboard Layout**
- Sidebar navigation (fixed left, 240px width on desktop)
- Main content area with breadcrumbs
- Stats overview cards at top (Total Earnings, Active Deals, Messages)
- Tabbed content sections (Active, Pending, Completed)

**Forms**
- Clean, single-column forms with generous spacing
- Floating labels or clear placeholder text
- Validation states with inline feedback
- Submit buttons: full-width on mobile, auto-width on desktop

**Messaging Interface**
- Two-pane layout: conversation list (left), active chat (right)
- Message bubbles: sender right-aligned, recipient left-aligned
- Warning indicator for blocked keywords with educational tooltip

**Payment/Subscription**
- Pricing card design: Feature checklist, prominent price, clear CTA
- Trust badges: "Secure payments via Stripe", "9% platform fee" disclosure
- Progress indicators for multi-step payment flows

### D. Images

**Required Images**:

1. **Hero Background**: Large, high-quality image showing diverse creators (photographers, video creators, influencers) working on content. Slightly darkened overlay (40% opacity) for text readability.

2. **Dashboard Avatar Placeholders**: Generic profile images for users without uploads

3. **Deal/Opportunity Thumbnails**: Product photography, brand logos, or campaign visuals (400x300px aspect ratio)

4. **Trust Section**: Small portrait photos for testimonials (80x80px circular)

5. **Empty States**: Illustration for "No deals yet" states in dashboard

6. **Marketing Sections**: 
   - "How It Works" section: 3-step process with supporting visuals
   - Success stories: Before/after campaign results or creator earnings graphs

**Image Treatment**: All images use `object-cover` with rounded corners (rounded-lg for cards, rounded-xl for larger images)

### E. Interactions

**Minimal Animations**:
- Fade-in on scroll for landing page sections (opacity transition only)
- Card hover lift (translateY(-4px) with shadow increase)
- Button press states (scale 0.98)
- Smooth page transitions (200ms ease)

**No Animations**: Avoid carousel auto-play, parallax effects, or loading spinners beyond simple fade

## Page-Specific Guidelines

### Landing Page (index.html)
- Hero with dual-CTA approach for creators vs brands
- "How It Works" (3 columns: Post → Match → Deliver)
- Featured Opportunities carousel (static, scroll-based)
- Trust section with stats and testimonials (2-column grid)
- Pricing tier comparison table
- Footer with quick links, social proof counters

### Authentication Pages
- Centered card layout (max-w-md)
- Background: Subtle gradient or pattern
- Social login options above email/password
- Role selection (Creator/Brand) with icon toggles on signup

### Dashboard
- Persistent sidebar with role-appropriate navigation
- Metrics dashboard at top (3-4 stat cards in grid)
- Main content area: Deal listings in card grid (2-3 columns on desktop)
- Floating "New Deal" button (bottom-right, fixed position for brands)

### Deal Detail Page
- Split layout: Deal info (left 60%), action panel (right 40%)
- Image gallery if multiple assets
- Milestone tracker for deal progress
- Integrated messaging pane at bottom

### Messages Page
- Full-height interface with conversation list sidebar
- Real-time indicators (online status, typing)
- Warning banner when blocked keywords detected
- File attachment previews (for approved content delivery)

## Accessibility & Quality

- Minimum touch target: 44x44px for all interactive elements
- Form inputs: 48px height with clear focus states
- Contrast ratio: WCAG AA compliant (will be ensured with color selection)
- Keyboard navigation: Full support with visible focus indicators
- Screen reader labels on all icon-only buttons

This design creates a professional, trustworthy marketplace that serves both creators seeking opportunities and brands finding talent, with clear visual separation of user journeys and transparent platform mechanics.