# Haydovchi Test Platform Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Linear and Notion for clean, productivity-focused interfaces with subtle modern touches from educational platforms like Khan Academy.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light mode: 59 91% 15% (deep blue-gray)
- Dark mode: 220 13% 91% (off-white)

**Background Colors:**
- Light mode: 0 0% 98% (warm white)
- Dark mode: 222 84% 5% (deep charcoal)

**Accent Colors:**
- Success: 142 76% 36% (forest green)
- Warning: 45 93% 47% (amber)
- Error: 0 84% 60% (coral red)

### B. Typography
**Primary Font**: Inter via Google Fonts
- Headings: 600-700 weight
- Body text: 400 weight
- UI elements: 500 weight
- Display sizes: text-4xl to text-lg for headings, text-base for body

### C. Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Section margins: mb-8, mt-12
- Grid gaps: gap-4, gap-6

### D. Component Library

**Navigation:**
- Left sidebar (desktop): Fixed position, 240px width
- Mobile drawer: Slide-in overlay with backdrop
- Clean icons with text labels, hover states with subtle background

**Cards & Containers:**
- Rounded corners: rounded-lg (8px)
- Subtle shadows: shadow-sm for elevation
- Border: 1px solid with neutral colors

**Test Interface:**
- Question cards with numbered indicators
- Progress bars with smooth transitions
- Timer display with color transitions (green → amber → red)
- Multiple choice buttons with clear selection states

**Data Visualization:**
- Chart.js integration for test results
- Clean, minimal styling with brand colors
- Interactive tooltips and legends

**Forms & Buttons:**
- Primary buttons: Filled with primary color
- Secondary buttons: Outline style with primary color
- Input fields: Clean borders, focus states with primary color
- Consistent height: h-10 for buttons, h-12 for inputs

### E. Responsive Behavior
- Desktop: Two-column layout (sidebar + main content)
- Tablet: Collapsible sidebar with toggle
- Mobile: Full-width with hamburger menu

### F. Interactive States
- Hover effects: Subtle color shifts and shadows
- Focus states: Clear outlines for accessibility
- Loading states: Skeleton screens and spinners
- Error states: Clear messaging with action buttons

## Key Design Principles
1. **Clarity**: Clean, uncluttered interface focusing on test content
2. **Efficiency**: Quick navigation between test sections and questions
3. **Progress Visibility**: Clear indication of completion status and performance
4. **Mobile-First**: Responsive design optimized for all devices
5. **Accessibility**: High contrast ratios and keyboard navigation support

## Special Considerations
- **Test Timer**: Prominent, non-distracting placement
- **Question Navigation**: Easy jumping between questions
- **Progress Tracking**: Visual indicators for completed/incomplete tests
- **Results Display**: Clear performance metrics with actionable insights