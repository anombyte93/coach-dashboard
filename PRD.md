# Product Requirements Document (PRD)
# Elegant Coaching Dashboard

**Version:** 1.0
**Date:** November 25, 2025
**Author:** Claude Code (via WWSJD validation)
**Status:** Ready for Implementation

---

## 1. Executive Summary

### The Problem
Hayden needs his fitness coach to view weekly insights from WHOOP, MacroFactor, measurements, and training data. The coach should access this from any device (phone/desktop) and generate weekly PDF reports.

### The Solution
A **single HTML file** (~200 lines) with embedded data and Chart.js visualizations. No backend. No frameworks. No build process. Zero hosting costs.

### Why This Approach?
| Original Proposal | Elegant Solution |
|-------------------|------------------|
| Node.js + Express backend | No backend needed |
| React/Svelte framework | Vanilla JS + Chart.js |
| Railway deployment ($15/mo) | GitHub Pages (free) |
| 2-4 weeks development | 2-4 hours development |
| ~2,500 lines of code | ~200 lines of code |
| Complex auth system | Unguessable URL or StatiCrypt |

**Steve Jobs Verdict:** SHIP IT

---

## 2. Product Vision

### 2.1 Target User
- **Primary:** Hayden's fitness coach
- **Use Case:** Weekly review of client metrics (5-10 minutes)
- **Devices:** Mobile phone (primary), laptop (secondary)
- **Frequency:** Once per week

### 2.2 Success Metrics
| Metric | Target |
|--------|--------|
| Page load time | < 1 second |
| Time to understand weekly status | < 30 seconds |
| Print-to-PDF generation | < 5 seconds |
| Weekly data update time | < 5 minutes |
| Development time | < 4 hours |
| Ongoing cost | $0/month |

---

## 3. Functional Requirements

### 3.1 Data Display (Priority: P0)

**Recovery Metrics (WHOOP):**
| Metric | Visualization | Purpose |
|--------|---------------|---------|
| HRV (7-day) | Line chart with baseline band | Track nervous system recovery |
| RHR (7-day) | Line chart | Detect overtraining signals |
| Sleep Duration (7-day) | Bar chart | Monitor rest patterns |
| Sleep Efficiency | Single value card | Quality indicator |
| Strain (7-day) | Bar chart | Training load assessment |
| Recovery Score | Gauge/number | Daily readiness summary |

**Nutrition Metrics (MacroFactor):**
| Metric | Visualization | Purpose |
|--------|---------------|---------|
| Calories (7-day) | Line chart vs target | Energy balance |
| Protein/Carbs/Fats | Doughnut chart | Macro distribution |
| Daily averages | Text summary | Quick reference |

**Body Measurements:**
| Metric | Display |
|--------|---------|
| Weight | Value + trend indicator |
| Waist | Value |
| Belly button | Value |
| Hips | Value |
| Thigh | Value |
| Daily steps | Value with weekly average |

**Training Summary:**
| Field | Display |
|-------|---------|
| Overall performance | Text summary |
| Completed workouts | Checklist |
| Difficulty notes | Text |
| Recovery assessment | Text |
| Enjoyment rating | Text |

### 3.2 Data Provided (Static JSON - v1)

```json
{
  "weekOf": "2025-11-18",
  "measurements": {
    "weight": 116,
    "waist": 98,
    "belly_button": 101,
    "hips": 112,
    "thigh": 68,
    "steps": 8006
  },
  "training": {
    "overall_performance": "Good energy, strong sessions",
    "completed": "All workouts logged except full body",
    "difficulty": "Squats tight, rest good",
    "recovery": "Good but sore",
    "enjoyment": "Loved the training"
  },
  "nutrition": {
    "daily": [
      { "date": "Mon", "calories": 3200, "protein": 165, "carbs": 340, "fat": 180 },
      { "date": "Tue", "calories": 3500, "protein": 175, "carbs": 370, "fat": 195 },
      { "date": "Wed", "calories": 3400, "protein": 170, "carbs": 355, "fat": 188 },
      { "date": "Thu", "calories": 3600, "protein": 180, "carbs": 380, "fat": 200 },
      { "date": "Fri", "calories": 3300, "protein": 168, "carbs": 345, "fat": 182 },
      { "date": "Sat", "calories": 3550, "protein": 175, "carbs": 375, "fat": 195 },
      { "date": "Sun", "calories": 3580, "protein": 171, "carbs": 355, "fat": 190 }
    ],
    "averages": {
      "calories": 3447,
      "protein": 172,
      "carbs": 360,
      "fat": 190
    },
    "targets": {
      "calories": 2725,
      "protein": 195,
      "carbs": 314,
      "fat": 102
    },
    "notes": "Higher calories due to travel + takeaway; protein improving; hydration low"
  },
  "whoop": {
    "daily": [
      { "date": "Mon", "hrv": 45, "rhr": 74, "sleep": 5.5, "strain": 12.0, "recovery": 52 },
      { "date": "Tue", "hrv": 48, "rhr": 72, "sleep": 6.2, "strain": 14.5, "recovery": 58 },
      { "date": "Wed", "hrv": 42, "rhr": 75, "sleep": 5.0, "strain": 10.2, "recovery": 48 },
      { "date": "Thu", "hrv": 50, "rhr": 71, "sleep": 6.8, "strain": 13.8, "recovery": 62 },
      { "date": "Fri", "hrv": 47, "rhr": 73, "sleep": 5.8, "strain": 11.5, "recovery": 55 },
      { "date": "Sat", "hrv": 49, "rhr": 72, "sleep": 5.3, "strain": 9.8, "recovery": 60 },
      { "date": "Sun", "hrv": 48, "rhr": 73, "sleep": 5.5, "strain": 9.4, "recovery": 64 }
    ],
    "averages": {
      "recovery": 57,
      "rhr": 72.8,
      "hrv": 47,
      "strain": 11.6,
      "sleep_hours": 5.7
    },
    "sleep_metrics": {
      "duration_min": 343,
      "need_min": 531,
      "debt_min": 58,
      "efficiency": 97,
      "consistency": 51
    },
    "interpretation": "Moderate recovery, high strain, sleep deficit, routine disruption"
  }
}
```

### 3.3 Interactive Features (Priority: P1)

| Feature | Implementation |
|---------|----------------|
| Chart tooltips | Built-in Chart.js (hover/tap) |
| Responsive layout | CSS Grid, stacks on mobile |
| Print to PDF | Browser Ctrl+P / Cmd+P |
| Week selector | Future: dropdown to load different JSON |

### 3.4 Non-Features (Explicitly Out of Scope)

| Feature | Reason |
|---------|--------|
| User authentication | Single user, unguessable URL sufficient |
| Real-time updates | Weekly cadence, no need |
| Database | Static JSON is simpler |
| Backend API | No server logic required |
| Build pipeline | Single file, no compilation |
| Dark mode | Light mode only (v1) |
| Multiple clients | Single coach, single athlete |

---

## 4. Technical Architecture

### 4.1 File Structure
```
CoachDashboard/
├── index.html      # Single-file dashboard (all code + data)
├── PRD.md          # This document
├── RESEARCH.md     # Research findings
└── README.md       # Quick start guide
```

### 4.2 HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hayden - Weekly Dashboard</title>
  <style>/* All CSS inline (~80 lines) */</style>
</head>
<body>
  <!-- Header with week info -->
  <header>...</header>

  <!-- Summary cards -->
  <section class="summary-cards">...</section>

  <!-- Chart grid -->
  <section class="charts">
    <div class="chart-container"><canvas id="hrv-chart"></canvas></div>
    <div class="chart-container"><canvas id="rhr-chart"></canvas></div>
    <div class="chart-container"><canvas id="sleep-chart"></canvas></div>
    <div class="chart-container"><canvas id="strain-chart"></canvas></div>
    <div class="chart-container"><canvas id="calories-chart"></canvas></div>
    <div class="chart-container"><canvas id="macros-chart"></canvas></div>
  </section>

  <!-- Text summaries -->
  <section class="notes">...</section>

  <!-- Embedded data -->
  <script type="application/json" id="dashboard-data">
    { /* JSON data here */ }
  </script>

  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>

  <!-- Dashboard logic (~50 lines) -->
  <script>/* Chart initialization */</script>
</body>
</html>
```

### 4.3 Chart Configuration

**Chart Types:**
| Chart | Type | Config |
|-------|------|--------|
| HRV | Line | Blue line, baseline zone (gray band) |
| RHR | Line | Red line, lower is better |
| Sleep | Bar | Purple bars, target line overlay |
| Strain | Bar | Orange bars, cumulative shown |
| Calories | Line | Green line vs red target line |
| Macros | Doughnut | Protein (blue), Carbs (yellow), Fat (red) |

**Global Chart.js Config:**
```javascript
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = true;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.font.family = 'system-ui, sans-serif';
```

### 4.4 CSS Layout

**Mobile-First Grid:**
```css
.charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .charts {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .charts {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Print Styles:**
```css
@media print {
  .no-print { display: none; }
  body { background: white; font-size: 12pt; }
  .charts { grid-template-columns: repeat(2, 1fr); }
  canvas { max-width: 280px; height: auto; }
}
```

---

## 5. User Experience

### 5.1 Information Hierarchy

**Above the fold (what coach sees first):**
1. Week date range header
2. Recovery score (large, color-coded)
3. Key alerts (sleep debt, high strain, etc.)

**Scrolling down:**
4. WHOOP charts (HRV, RHR, Sleep, Strain)
5. Nutrition charts (Calories, Macros)
6. Measurements table
7. Training notes
8. Coach notes section (optional)

### 5.2 Color Palette

| Zone | Color | Usage |
|------|-------|-------|
| Good | `#22c55e` (green) | Recovery >70%, targets met |
| Caution | `#eab308` (yellow) | Recovery 50-70%, slight deficit |
| Concern | `#ef4444` (red) | Recovery <50%, significant issues |
| Neutral | `#3b82f6` (blue) | HRV, informational |
| Sleep | `#8b5cf6` (purple) | Sleep metrics |
| Strain | `#f97316` (orange) | Strain/load |

### 5.3 Mobile Experience

- **Viewport:** 375px minimum (iPhone SE)
- **Touch targets:** 44px minimum (Apple HIG)
- **Charts:** Stack vertically, full width
- **Scrolling:** Smooth, native momentum
- **Print:** Works from mobile browser

---

## 6. Deployment & Hosting

### 6.1 GitHub Pages (Recommended)

**Setup:**
1. Create GitHub repository `CoachDashboard`
2. Push `index.html` to main branch
3. Settings → Pages → Deploy from main
4. Access at: `https://[username].github.io/CoachDashboard/`

**Security:**
- URL is unguessable (not indexed by search engines)
- Coach bookmarks on phone
- If needed: add StatiCrypt encryption layer

### 6.2 Alternative: Local File

**For testing or offline use:**
1. Open `index.html` directly in browser
2. Works 100% offline (Chart.js cached)
3. Print to PDF works identically

### 6.3 Data Update Workflow

**Weekly process (5 minutes):**
1. Export WHOOP data (CSV or manual)
2. Export MacroFactor data (XLSX or manual)
3. Update JSON block in `index.html`
4. Git commit + push (or replace file on hosting)
5. Coach refreshes browser

**Future automation (v2):**
- Google Sheets integration
- WHOOP API direct pull
- MacroFactor export script

---

## 7. Implementation Plan

### Phase 1: Core Structure (30 min)
- [ ] HTML skeleton with semantic structure
- [ ] CSS layout (mobile-first grid)
- [ ] Print styles (@media print)
- [ ] Embedded sample JSON data

### Phase 2: Chart.js Integration (60 min)
- [ ] HRV line chart (7-day trend)
- [ ] RHR line chart (7-day trend)
- [ ] Sleep bar chart (duration)
- [ ] Strain bar chart (daily load)
- [ ] Calories line chart (vs target)
- [ ] Macros doughnut chart

### Phase 3: Summary Cards (30 min)
- [ ] Recovery score card (color-coded)
- [ ] Sleep debt indicator
- [ ] Measurements table
- [ ] Training notes section
- [ ] Nutrition notes section

### Phase 4: Polish & Deploy (30 min)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Print testing (Chrome, Firefox)
- [ ] Deploy to GitHub Pages
- [ ] Test live URL on phone
- [ ] Create data update instructions

**Total: 2.5-3 hours**

---

## 8. Acceptance Criteria

### Must Have (P0)
- [ ] Dashboard loads in < 1 second
- [ ] All 6 charts render correctly
- [ ] Mobile responsive (375px - 1920px)
- [ ] Print-to-PDF produces clean report
- [ ] Single HTML file, no external dependencies except Chart.js CDN

### Should Have (P1)
- [ ] Color-coded recovery zones
- [ ] Target lines on relevant charts
- [ ] Week date prominently displayed
- [ ] Clean, professional appearance

### Nice to Have (P2)
- [ ] Week selector (load different JSON files)
- [ ] Coach notes input field
- [ ] Dark mode toggle

---

## 9. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Chart.js CDN unavailable | Low | Medium | Cache locally or bundle inline |
| Print layout issues | Medium | Low | Test across browsers, optimize for Chrome |
| Coach can't update data | Medium | Medium | Create step-by-step instructions |
| URL discovered publicly | Low | Low | StatiCrypt if truly concerned |

---

## 10. Future Roadmap (v2+)

**If this proves valuable:**

1. **Week Selector** - Dropdown to load historical weeks
2. **Google Sheets Integration** - Coach updates spreadsheet, dashboard auto-refreshes
3. **WHOOP API** - Direct data pull (requires WHOOP developer account)
4. **Coach Annotations** - Add notes that persist (localStorage)
5. **Trend Analysis** - Month-over-month comparisons
6. **Multiple Clients** - If coach has multiple athletes

**Important:** Only build these if v1 is actively used and these features are requested.

---

## 11. Appendix

### A. Sample Weekly JSON Schema

See Section 3.2 for complete data structure.

### B. Chart.js Documentation
- https://www.chartjs.org/docs/latest/

### C. GitHub Pages Setup
- https://pages.github.com/

### D. StatiCrypt (if password needed)
- https://github.com/robinmoisson/staticrypt

---

**Document Status:** Ready for Implementation
**Estimated Build Time:** 2.5-3 hours
**Hosting Cost:** $0/month
**Steve Jobs Approval:** SHIP IT
