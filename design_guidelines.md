# Design Guidelines: 出張報告書作成アシスタント (Business Trip Report Assistant)

## Design Approach

**Selected Approach**: Design System - Modern Productivity Application
**Primary Inspiration**: Linear (clean productivity), Notion (friendly content creation), Slack (engaging chat)
**Rationale**: This is a utility-focused productivity tool requiring clarity, efficiency, and approachability. The unique character-based dialogue system adds personality while maintaining professional functionality.

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 216 88% 58% (Calm professional blue)
- Primary Hover: 216 88% 48%
- Background: 0 0% 100% (Pure white)
- Surface: 220 14% 96% (Soft gray for cards)
- Border: 220 13% 91%
- Text Primary: 222 47% 11%
- Text Secondary: 215 16% 47%
- Success (for completed): 142 71% 45%
- Warning (for drafts): 38 92% 50%

**Dark Mode**:
- Primary: 216 88% 58%
- Primary Hover: 216 88% 68%
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Border: 217 33% 24%
- Text Primary: 210 40% 98%
- Text Secondary: 215 20% 65%
- Success: 142 71% 45%
- Warning: 38 92% 50%

### B. Typography

**Font Families**:
- Primary: 'Inter', -apple-system, sans-serif (for UI elements)
- Japanese: 'Noto Sans JP', sans-serif (via Google Fonts)
- Monospace: 'JetBrains Mono' (for IDs, codes)

**Scale**:
- Headings: text-2xl to text-4xl, font-semibold
- Body: text-base, font-normal
- Labels: text-sm, font-medium
- Helper text: text-xs, text-muted-foreground
- Character dialogue: text-lg for better readability

### C. Layout System

**Spacing Units**: Consistently use 4, 8, 16, 24, 32 (p-4, gap-8, mt-16, py-24, etc.)

**Container Strategy**:
- Main application: max-w-7xl mx-auto
- Chat interface: max-w-4xl mx-auto
- Form sections: max-w-2xl
- Full-width for dashboard cards grid

**Grid Patterns**:
- Dashboard: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Form layout: Single column on mobile, two columns on desktop for related fields
- Character selection: grid-cols-1 md:grid-cols-3 gap-4

### D. Component Library

**Navigation**:
- Top bar: Fixed header with logo, progress indicator (when in flow), user menu
- Breadcrumbs: For multi-step flow visibility
- Mobile: Hamburger menu with slide-out drawer

**Forms**:
- Input fields: Rounded-lg with subtle border, focus:ring-2 ring-primary
- Labels: Above inputs, font-medium text-sm
- Required indicators: Red asterisk, clearly visible
- Date pickers: Calendar popup with range selection
- Multi-select: Chip-based tags for同行者 (companions)
- Validation: Inline error messages in red below fields

**Chat Interface**:
- Character avatar: Circular, 48px, positioned left of messages
- Message bubbles: 
  - Character: Rounded-2xl, bg-surface, text-left
  - User: Rounded-2xl, bg-primary, text-primary-foreground, text-right
- Input area: Fixed bottom bar with textarea, auto-resize, send button
- Progress indicator: Linear progress bar showing question completion (8/15)
- Quick actions: Floating buttons for skip, save draft, end interview

**Report Display**:
- Section cards: White/surface cards with subtle shadow
- Section headers: Bordered bottom, with edit icons
- Content: Proper spacing between paragraphs and lists
- Checkboxes: For action items with strike-through when completed
- Metadata badges: Rounded pills for status (draft, submitted)

**Buttons**:
- Primary: bg-primary, hover:bg-primary/90, rounded-lg, px-6 py-3
- Secondary: border variant with hover:bg-accent
- Ghost: For tertiary actions
- Icon buttons: Square, rounded-md, 40x40px touch target

**Cards**:
- Border variant for character selection cards
- Shadow-sm for dashboard cards
- Hover: Subtle lift effect (hover:shadow-lg transition)

**Data Display**:
- Tables: For report history, striped rows
- Stats cards: Large numbers with labels and trend indicators
- Timeline: For showing report creation flow/history

### E. Micro-interactions

**Minimal Animations** (use sparingly):
- Button clicks: Scale down slightly (scale-95) on active
- Card hovers: Subtle translate-y-1 lift
- Page transitions: Gentle fade-in (no slide animations)
- Chat messages: Simple fade-in as they appear
- Success states: Green checkmark with brief scale animation
- Form validation: Shake animation for errors

---

## Screen-Specific Guidelines

### Dashboard
- Hero section: Welcome banner with quick stats (total reports, drafts)
- Card grid: Recent reports with preview, status badges
- Quick action: Large "新規報告書作成" (New Report) button, prominent placement
- Sidebar: Navigation and draft reports list

### Basic Information Form
- Single page form with logical grouping
- Progress indicator at top showing "Step 1 of 5"
- Field groups in cards: Personal info, trip details, logistics
- Sticky footer with "保存して次へ" (Save & Continue) button

### Character Selection
- Three character cards side-by-side
- Character illustration/avatar prominent
- Name, role, and sample dialogue preview
- "選択" (Select) button on each card
- Selected state: Border highlight + checkmark

### Chat Interface (Primary Screen)
- Clean, messaging app aesthetic
- Character name and avatar always visible
- Speech bubbles with comfortable padding
- Progress bar: Subtle, top of screen
- Bottom input: Large textarea, voice input icon (future), send button
- Floating action menu: Minimal, right side for save/skip/end

### Report Preview & Edit
- Two-column layout on desktop: Preview left, edit panel right (toggleable)
- Section navigation: Sticky sidebar for quick jumps
- Edit mode: Inline editing with auto-save indicator
- Export options: PDF, Word (future) in header toolbar
- Approval flow: Prominent submit button when ready

---

## Character Visual Identity

**ますお兄さん (Masuo)**:
- Color association: Warm orange/brown tones
- Avatar style: Friendly, mature, approachable

**あやちゃん (Aya)**:
- Color association: Soft pink/coral
- Avatar style: Bright, energetic, young

**けんじ部長 (Kenji)**:
- Color association: Navy blue
- Avatar style: Professional, confident

*Note: Use illustration style consistent with modern productivity apps - simple, friendly, not overly cartoonish*

---

## Accessibility & Localization

- All form labels and instructions in clear Japanese
- High contrast ratios (AA standard minimum)
- Keyboard navigation: Full support with visible focus indicators
- Error states: Icon + color + text (not color alone)
- Loading states: Skeleton screens for content, spinners for actions
- Japanese text: Adequate line-height (1.7-1.8) for readability
- Mobile: Touch targets minimum 44x44px

---

## Key UX Principles

1. **Progressive Disclosure**: Show complexity only when needed
2. **Forgiving Input**: Auto-save, allow easy corrections
3. **Clear Progress**: Always show where user is in the flow
4. **Friendly Tone**: Character dialogue adds warmth without compromising professionalism
5. **Mobile-First**: Critical paths work perfectly on phones
6. **Speed**: Instant feedback, optimistic UI updates