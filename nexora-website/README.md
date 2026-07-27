# Nexora Spaces LLP - Website

Premium Residential Interior Design & Fit-Out Company Website

## 🚀 Quick Start

This is a **pure static website** - no build tools, no npm, no server required. Just HTML, CSS, and JavaScript.

### Option 1: Direct GitHub Pages (Easiest)

1. Fork or clone this repository to your GitHub account
2. Go to repository **Settings** → **Pages**
3. Set Source to: `Deploy from a branch` → Select `main` or `master` branch
4. Set the folder to `/ (root)` or `/docs`
5. Click **Save**
6. Wait 2-3 minutes for deployment
7. Your site will be live at: `https://yourusername.github.io/repo-name/`

### Option 2: Custom Domain

1. Follow steps above to enable GitHub Pages
2. Edit the `CNAME` file and replace `YourCustomDomain.com` with your actual domain
3. Add a DNS record in your domain registrar:
   - **A Records:**
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - **CNAME:** www → yourusername.github.io

### Option 3: Traditional Hosting

Upload all files to any web hosting service (GoDaddy, Hostinger, Bluehost, etc.) via FTP or File Manager.

---

## 📁 File Structure

```
nexora-website/
├── index.html          # Home page (main entry)
├── residential.html    # Residential interior services
├── commercial.html     # Commercial consultancy services
├── portfolio.html      # Project gallery
├── tools.html          # Interactive calculators & quiz
├── about.html          # About us
├── contact.html        # Contact form & details
├── testimonials.html   # Client reviews (placeholder)
├── blog.html           # Blog listing (placeholder)
├── careers.html        # Careers page (placeholder)
├── privacy.html        # Privacy policy (placeholder)
├── terms.html          # Terms of service (placeholder)
├── style.css           # Complete stylesheet
├── script.js           # All JavaScript functionality
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine directives
├── CNAME               # Custom domain config
└── README.md           # This file
```

---

## ✨ Features

### Working Interactive Elements
- ✅ **Residential Cost Calculator** - Real-time pricing with city/property/package selection
- ✅ **Commercial Fee Estimator** - Advisory-only pricing
- ✅ **Modular Kitchen Configurator** - Layout, finish, and price calculation
- ✅ **EMI Calculator** - With visual breakdown chart
- ✅ **Package Comparison Table** - Essential vs Premium vs Luxury
- ✅ **Design Style Quiz** - 5-question quiz with personalized results
- ✅ **Multi-step Contact Form** - With validation and mailto submission
- ✅ **Portfolio Gallery** - Filterable by property type
- ✅ **Testimonial Carousel** - Auto-scrolling with touch support
- ✅ **FAQ Accordion** - Animated expand/collapse
- ✅ **Animated Statistics** - Count-up numbers on scroll
- ✅ **Lightbox** - Project detail modal
- ✅ **WhatsApp Button** - Floating with pulse animation
- ✅ **Back to Top** - Smooth scroll button

### SEO Features
- ✅ Semantic HTML5 structure
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph & Twitter Card tags
- ✅ JSON-LD structured data (Organization, Service, FAQ)
- ✅ Static sitemap.xml
- ✅ robots.txt
- ✅ Canonical URLs

### Performance
- ✅ Lazy-loaded images
- ✅ Optimized font loading with display:swap
- ✅ Minimal JavaScript (vanilla JS only)
- ✅ CSS custom properties for theming
- ✅ No external dependencies except fonts & icons

---

## 🎨 Design System

### Colors (Bright Premium Theme)
- **Background:** Ivory/Warm White `#FBFAF7`
- **Secondary:** Soft Cream `#F5F1E8`
- **Surface:** Warm Beige `#EFE9DC`
- **Text Primary:** Charcoal `#1E1E1E`
- **Text Muted:** Warm Gray `#6B6B63`
- **Accent Gold:** `#B8860B → #D4AF37 → #F4E5A1`
- **Silver:** `#B8B8B0`

### Typography
- **Display:** Cormorant Garamond
- **Body:** Manrope / Inter

---

## 📝 Customization

### Adding Your Logo
Replace the SVG in the `<Logo />` component with your actual logo image.

### Updating Placeholder Content
Search for `[PLACEHOLDER]` in HTML files and replace with actual content:
- Phone numbers
- Email addresses
- Physical addresses
- CIN/GST numbers
- Team member names
- Award/press mentions
- City-specific details

### Changing Colors
Edit CSS custom properties in `style.css`:
```css
:root {
    --color-gold: #D4AF37;
    --color-gold-dark: #B8860B;
    --color-bg-primary: #FBFAF7;
    /* etc. */
}
```

### Adding More Pages
Simply duplicate an existing HTML file and update the content. Remember to:
1. Add to sitemap.xml
2. Add navigation links in navbar

---

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** Below 768px

---

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## 📄 License

Proprietary - Nexora Spaces LLP. All rights reserved.

---

## 📞 Support

For website-related questions, contact:
- Email: [placeholder]
- Phone: [placeholder]

---

*Built with ❤️ by Nexora Spaces*
