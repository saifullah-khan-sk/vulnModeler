# Netflix-Style Theme & Alignment Fixes

## Changes Applied

### 1. Color Scheme (Netflix-Style) ✅
- **Background**: Very dark black (#141414 / 0 0% 8%)
- **Cards**: Dark gray (#1f1f1f / 0 0% 12%)
- **Primary/Accent**: Netflix red (#e50914 / 0 90% 48%)
- **Text**: White/light gray for contrast
- **Borders**: Dark gray for subtle separation

### 2. Layout & Alignment Fixes ✅
- Added container with proper padding (`container mx-auto px-6 py-8`)
- Removed `max-w-4xl` constraints from view components
- Content now properly centered and aligned
- Main content area has consistent spacing

### 3. Sidebar Updates ✅
- Logo now uses Netflix red color (#e50914)
- Darker sidebar background matching Netflix theme
- Better contrast for navigation items

### 4. Custom CSS Classes ✅
Added utility classes for:
- `.card` - Dark card styling
- `.card-hover` - Hover effects
- `.btn-primary` - Netflix red buttons
- `.btn-secondary` - Secondary buttons
- `.badge-*` - Severity badges with colors
- Color utilities (`.text-danger`, `.text-warning`, etc.)

## Files Modified

1. `app/globals.css` - Complete color scheme overhaul
2. `app/layout.tsx` - Added `dark` class to html
3. `app/page.tsx` - Added container with padding for proper alignment
4. `components/sidebar.tsx` - Updated logo color to Netflix red
5. `src/views/Scanner.jsx` - Removed width constraint
6. `src/views/Vulnerabilities.jsx` - Removed width constraints
7. `src/views/Reports.jsx` - Removed width constraint

## Result

- ✅ Dark Netflix-style theme with red accents
- ✅ Content properly centered and aligned
- ✅ Consistent spacing and padding throughout
- ✅ Better visual hierarchy and readability

The application now has a professional Netflix-inspired dark theme with proper alignment!

