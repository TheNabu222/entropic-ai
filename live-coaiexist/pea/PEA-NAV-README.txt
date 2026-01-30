# PEA PRINCESS PARABLE NAVIGATION SYSTEM

## Quick Start

Add these two lines to the <head> section of EVERY page:

```html
<link rel="stylesheet" href="https://coaiexist.wtf/pea/pea-nav.css">
<script src="https://coaiexist.wtf/pea/pea-nav.js"></script>
```

That's it! The navigation will automatically appear at the top of every page.

## Adding New Pages

1. Open `pea-nav.js`
2. Add your new page to the `pages` array:

```javascript
{
    title: '🎮 Your Page Title',
    url: 'your-page.html',
    category: 'interactive'  // options: story, interactive, news, fun, community
}
```

3. For new Pips, add to the `pips` array:

```javascript
{
    title: '🐸 Pip #3',
    url: 'pips/pip_3'
}
```

4. Save the file - ALL pages will now have the new link!

## Categories

- `story` - Main story pages
- `interactive` - Forms, quizzes, tools
- `news` - News networks and broadcasts
- `fun` - Animations and decorative stuff
- `community` - Forums and social

## Customization

Edit `pea-nav.css` to change colors, fonts, or layout!

## File Locations

- Navigation Script: `https://coaiexist.wtf/pea/pea-nav.js`
- Navigation Styles: `https://coaiexist.wtf/pea/pea-nav.css`
- Add these to EVERY HTML page in the <head> section

---

Now you only need to edit ONE file to update navigation across ALL pages! 🫛✨