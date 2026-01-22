# Teaching Site - Technical Documentation

**Note**: This file is git-ignored and stays local for development reference.

## Overview

This is a static teaching site built with vanilla HTML, CSS, and JavaScript using Web Components for reusability. The site is hosted on GitHub Pages at `merethom.github.io`.

**Design Philosophy**: Early 2000s internet aesthetic with modern web standards.

---

## Architecture

### Core Technologies
- **Web Components**: Custom HTML elements for reusable UI (header, footer, nav, etc.)
- **JSON Data Files**: Course metadata and weekly content stored in `scripts/data/`
- **CSS Variables**: Centralized theming and colors
- **localStorage**: Persisting navigation state across pages

### File Structure

```
teaching-site/
├── index.html                # Homepage
├── 404.html                  # Custom error page
├── deadlines.html            # Deadline policy page
├── courses/                  # Individual course pages
│   ├── behaviours.html
│   ├── special-topics.html
├── css/                      # All site styles
│   └── design.css              # All site styles
├── scripts/                  # All Web Components + utilities
│   ├── components.js           # All Web Components + utilities
│   └── data/
│       └── COURSE-CONTENT-SCHEMA.md  # JSON schema docs
│       ├── behaviours.json           # Course weekly content
│       ├── courses.json              # Course metadata
│       ├── special-topics.json       # Course weekly content
├── img/                      # Images and icons
│   ├── favicon.ico
│   ├── rainbow-flag.svg
│   ├── star.svg
│   ├── t-flag.svg
├── .nojekyll                 # Disables Jekyll on GitHub Pages
```

---

## Web Components System

All components are defined in `scripts/components.js`. The site uses vanilla JavaScript Web Components extending `HTMLElement`.

### Available Components

### Available Components

#### 1. `<site-header>`
**Location**: Lines ~87 in components.js
**Purpose**: Displays course heading, description, and project briefs link
**Usage**: 
```html
<site-header></site-header>                    <!-- For index.html -->
<site-header course-id="specialTopics"></site-header>  <!-- For course pages -->
```
**Data Source**: `scripts/data/courses.json`
**Key Fields**: `courseHeading`, `courseDescription`, `projectBriefsUrl`

#### 2. `<site-footer>`
**Location**: Lines ~153 in components.js
**Purpose**: Static footer with contact info, flags, and pixel stars
**Usage**: `<site-footer></site-footer>`
**Accessibility**: Uses `role="contentinfo"` and `aria-hidden="true"` for decorative elements

#### 3. `<site-nav>`
**Location**: Lines ~175 in components.js
**Purpose**: Main navigation with expandable sections
**Usage**: `<site-nav></site-nav>`
**Features**:
- Dynamically populated course links from `courses.json`
- Persistent state using localStorage (nav sections remember open/closed state)
- Expandable "Classes" and "About" sections using `<details>`
**localStorage Keys**: `nav-classes`, `nav-about`

#### 4. `<course-info>`
**Location**: Lines ~261 in components.js
**Purpose**: Displays course metadata (code, name, term, year)
**Usage**: `<course-info course-id="specialTopics"></course-info>`
**Data Source**: `scripts/data/courses.json`
**Features**: 
- Program mapping (ixd → "Interaction Design")
- Dynamic year display

#### 5. `<course-weekly-content>`
**Location**: Lines ~317 in components.js
**Purpose**: Displays weekly lecture content with Figma embeds and links
**Usage**: `<course-weekly-content course-id="specialTopics"></course-weekly-content>`
**Data Source**: `scripts/data/{course-id}.json` (converted to kebab-case)
**Features**:
- Reverse chronological order (newest week first)
- Most recent week expanded by default
- Figma URL conversion (share URL → embed URL)
- Path-aware (works in subdirectories)

#### 6. `<current-year>`
**Location**: Lines ~440 in components.js
**Purpose**: Displays current year dynamically
**Usage**: `<current-year></current-year>`
---

## JSON Data Structure

### courses.json
**Location**: `scripts/data/courses.json`
**Purpose**: Stores metadata for all courses

**Schema**:
```json
{
  "courses": [
    {
      "id": "specialTopics",              // Used in course-id attributes
      "program": "ixd",                   // Program code
      "fullCourseName": "...",            // Used for page title
      "shortCourseName": "...",           // Short display name
      "navigationName": "...",            // Name in nav menu
      "courseCode": "DESN34655",          // Course code
      "courseHeading": "...",             // H1 heading on course page
      "term": "winter",                   // Current term
      "courseDescription": "...",         // Paragraph description
      "projectBriefsUrl": "https://...",  // Link to Figma slides
      "pageUrl": "/courses/special-topics.html"  // Absolute path
    }
  ]
}
```

### {course-id}.json (Weekly Content)
**Location**: `scripts/data/special-topics.json`, `behaviours.json`, etc.
**Purpose**: Stores weekly lecture content for a specific course

**Schema**: See `scripts/data/COURSE-CONTENT-SCHEMA.md`

**Key Points**:
- `weeks` array sorted by `weekNumber` in reverse chronological order
- `figmaEmbed` can be share URL (auto-converted to embed URL)
- File name is kebab-case version of course ID

---

## Dynamic Features

### 1. Dynamic Page Title
**Function**: `setPageTitle()` (lines ~7-26 in components.js)
**How**: Looks for any element with `course-id` attribute, fetches course data, sets `document.title`
**Runs**: On every page load

### 2. Dynamic Favicon
**Function**: `setFavicon()` (lines ~28-34 in components.js)
**How**: Creates `<link rel="icon">` element pointing to `/img/favicon.ico`
**Runs**: On every page load

### 3. JSON Caching
**Function**: `getCourses()` (lines ~78-104 in components.js)
**Purpose**: Fetches and caches `courses.json` to avoid redundant network requests
**Cache**: `coursesCache` variable (line 3)

### 4. Navigation Persistence
**Location**: Lines ~209-220 in components.js
**How**: Uses localStorage to save/restore `<details>` open/closed state
**Storage Keys**: 
- `nav-classes` (boolean)
- `nav-about` (boolean)

### 5. Path-Aware Loading
Components automatically detect if they're in a subdirectory and adjust paths:
- Root pages: `scripts/data/courses.json`
- Subdirectories: `../scripts/data/courses.json`

---

## Styling System

### CSS Variables
**Location**: Lines 3-24 in `css/design.css`

**Color Variables**:
```css
--dark-mode-bg: #0E0E10;        /* Main background */
--text-color: #DFDFE2;          /* Body text */
--outline-color: #4D4D60;       /* Borders */
--mid-grey: #4D4D60;            /* Mid-tone grey */
--mid-dark: #181818;            /* Dark sections */
--white: #ffffff;               /* White text */

/* Rainbow Gradient Colors */
--rainbow-red: #CC3935;
--rainbow-orange: #F5971C;
--rainbow-yellow: #FCD722;
--rainbow-green: #14E47D;
--rainbow-blue: #1D8BFD;
--rainbow-purple: #776EDC;

--border-width: 2px;            /* Standard border width */
```

### Key CSS Classes

#### `.rainbow-text`
**Purpose**: Gradient text effect for headings
**Usage**: `<h1 class="rainbow-text">Title</h1>`
**Effect**: 45° gradient using rainbow colors

#### `.red`, `.green`, `.yellow`
**Purpose**: Color text with rainbow palette colors
**Usage**: `<summary class="red">Warning</summary>`

#### `.week-item`
**Purpose**: Styles for expandable weekly content sections
**Features**: Custom accordion styling with colored chevrons

### Grid Layout
**Main Layout**: 2-column grid (main content + sidebar nav)
**Mobile**: Stacks into single column at ≤768px
**Grid Areas**: `main`, `site-nav`, `site-footer`

---

## Adding New Content

### Add a New Course

1. **Add course metadata** to `scripts/data/courses.json`:
```json
{
  "id": "newCourse",
  "program": "ixd",
  "fullCourseName": "Full Course Name",
  "shortCourseName": "Short Name",
  "navigationName": "Nav Name",
  "courseCode": "DESN12345",
  "courseHeading": "Course Heading",
  "term": "winter",
  "courseDescription": "Description text...",
  "projectBriefsUrl": "https://figma.com/...",
  "pageUrl": "/courses/new-course.html"
}
```

2. **Create course content file** at `scripts/data/new-course.json`:
- Use kebab-case for filename
- Follow schema in `COURSE-CONTENT-SCHEMA.md`

3. **Create course page** at `courses/new-course.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
    <link rel="stylesheet" href="https://use.typekit.net/yrl7rjf.css">
    <link rel="stylesheet" href="../css/design.css">
    <script src="../scripts/components.js"></script>
</head>
<body>
  <main>
    <course-info course-id="newCourse"></course-info>
    <site-header course-id="newCourse"></site-header>
    <course-weekly-content course-id="newCourse"></course-weekly-content>
  </main>
  <site-nav></site-nav>
  <site-footer></site-footer>
</body>
</html>
```

4. **Push to GitHub** and wait 1-2 minutes for deployment

### Add Weekly Content

Edit the course's JSON file (e.g., `scripts/data/special-topics.json`):

```json
{
  "courseId": "specialTopics",
  "weeks": [
    {
      "weekNumber": 5,
      "date": "Jan 27 – Jan 31",
      "overview": "Week description...",
      "figmaEmbed": "https://www.figma.com/design/...",
      "links": [
        {
          "title": "Link Title",
          "url": "https://example.com"
        }
      ]
    }
  ]
}
```

---

## GitHub Pages Deployment

### Current Setup
- **Repository**: `merethom/merethom.github.io`
- **Branch**: `main`
- **Source**: `/ (root)`
- **URL**: `https://merethom.github.io`

### Deployment Process
1. Push changes to `main` branch
2. GitHub Actions automatically builds and deploys
3. Wait 1-2 minutes for changes to appear live
4. Check Actions tab for build status if issues occur

### Important Files
- **`.nojekyll`**: Tells GitHub Pages not to use Jekyll processing
- **`.github/workflows/static.yml`**: GitHub Actions workflow (if present)

### Path Considerations
- All absolute paths start with `/` (e.g., `/css/design.css`, `/courses/special-topics.html`)
- This ensures paths work correctly at the root domain
- If moving to a subdirectory, paths would need updating

---

## Common Tasks

### Update Site Colors
Edit CSS variables in `css/design.css` (lines 3-24)

### Update Rainbow Gradient
Modify the rainbow color variables and they'll update everywhere:
```css
--rainbow-red: #CC3935;
/* ... etc ... */
```

### Add a Static Page (like deadlines.html)
1. Copy structure from `index.html`
2. Include `<site-header>`, `<site-nav>`, `<site-footer>`
3. Add custom content in `<main>`
4. Push to GitHub

### Debug Component Issues
1. Open browser console (F12)
2. Look for errors in component loading
3. Check that JSON files are accessible
4. Verify `course-id` attributes match JSON `id` fields

---

## Browser Support

- **Modern browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Web Components**: Native support in all modern browsers
- **CSS Variables**: Full support
- **Grid Layout**: Full support
- **localStorage**: Full support

### Fallbacks
- Rainbow text has fallback color: `var(--text-color)`
- Navigation works without JavaScript (no persistence)
- All paths use absolute URLs for reliability

---

## Accessibility Features

- **Semantic HTML**: `<header>`, `<footer>`, `<nav>`, `<main>`, `<details>`
- **ARIA Roles**: `role="banner"`, `role="contentinfo"`
- **ARIA Hidden**: Decorative elements have `aria-hidden="true"`
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Color Contrast**: Text colors meet WCAG AA standards

---

## Performance Optimizations

1. **JSON Caching**: Course data fetched once and cached in memory
2. **Minimal Dependencies**: No frameworks, only vanilla JS
3. **CSS Variables**: Efficient theming without duplication
4. **Web Components**: Reusable without build step
5. **Static Hosting**: Fast GitHub Pages CDN

---

## Known Limitations

1. **No Build Step**: Manual JSON editing required for updates
2. **Client-Side Rendering**: Content loads after JavaScript executes
3. **No Search**: No built-in search functionality
4. **No CMS**: Content management requires git/code editor

---

## Future Enhancements (Ideas)

- [ ] Add search functionality
- [ ] Generate RSS feed for weekly content
- [ ] Add print-friendly styles for course pages
- [ ] Create admin interface for JSON editing
- [ ] Add calendar view of course schedules
- [ ] Implement dark/light mode toggle
- [ ] Add analytics tracking

---

## Troubleshooting

### Component Not Rendering
- Check browser console for errors
- Verify `course-id` matches JSON `id` field
- Ensure JSON files are valid (no trailing commas)
- Check file paths are correct

### Styles Not Applying
- Clear browser cache
- Check CSS file is loading (Network tab)
- Verify CSS variable names are correct
- Check for CSS syntax errors

### Navigation State Not Persisting
- Check localStorage is enabled in browser
- Verify `<details>` elements have correct IDs
- Clear localStorage and refresh to reset

### GitHub Pages Not Updating
- Check Actions tab for build status
- Wait 2-3 minutes (can take time)
- Clear browser cache
- Check commit was pushed successfully

---

## Contact & Maintenance

For questions or issues with the site architecture, refer to this documentation.

**Last Updated**: January 2026
