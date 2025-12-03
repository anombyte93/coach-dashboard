# Coach Dashboard - Week 2 Enhanced Edition

A single-file fitness dashboard optimized for **coaching insights**. Designed to give your coach exactly what they need to help you reach your goals faster.

**Status:** Production Ready
**Architecture:** Single HTML File + CLI Ingestor
**Ship Time:** Ready now
**Cost:** $0/month (GitHub Pages)

---

## Quick Start

```bash
# Open dashboard in browser
open index.html

# Or serve locally
python3 -m http.server 8080
```

## CLI Data Ingestor

Interactive command-line tool for logging fitness data with rich terminal UI.

### Installation

The CLI is already set up! Just run:

```bash
# From project directory
./scripts/coach-ingest

# Or if symlinked to ~/bin
coach-ingest
```

### Commands

| Command | Purpose | Time |
|---------|---------|------|
| `coach-ingest checkin` | Daily mood, energy, habits, blockers | 60 seconds |
| `coach-ingest weekly` | Weekly measurements, training notes, wins | 5 minutes |
| `coach-ingest whoop` | Import WHOOP metrics (HRV, sleep, recovery) | 3 minutes |
| `coach-ingest nutrition` | Import MacroFactor data (calories, macros) | 3 minutes |
| `coach-ingest prep` | Generate coach session prep summary | Instant |
| `coach-ingest status` | Show current week's data entry status | Instant |
| `coach-ingest export` | Export week to JSON for dashboard | Instant |

### Fast Mode (Scripting)

For power users, log via command line arguments:

```bash
coach-ingest fast --mood 4 --energy 3 --workout yes --steps 8000 --win "Hit protein target"
```

### Daily Workflow

1. **Morning (60 seconds):**
   ```bash
   coach-ingest checkin
   ```

2. **Sunday evening (10 minutes):**
   ```bash
   coach-ingest whoop      # After exporting from WHOOP app
   coach-ingest nutrition  # After reviewing MacroFactor
   coach-ingest weekly     # Measurements and notes
   ```

3. **Before coaching call:**
   ```bash
   coach-ingest prep       # See session summary
   coach-ingest export     # Update dashboard
   git add . && git commit -m "Update week data" && git push
   ```

---

## Dashboard Features

### Coach Session Prep (NEW)

At-a-glance overview designed for coaching conversations:

- **Client Readiness**: On Track / At Risk / Off Track status
- **Velocity Metrics**: Mood, energy, sleep, weight trends
- **Top Blockers**: What's getting in the way this week
- **Suggested Topics**: AI-generated discussion points
- **Wins to Celebrate**: Highlights for positive reinforcement
- **Session Focus**: Priority area for the coaching call

### Core Metrics

- **Recovery Score**: WHOOP recovery percentage with color coding
- **HRV Trends**: Heart rate variability for stress/recovery assessment
- **Sleep Analysis**: Duration vs target, deficit tracking
- **Nutrition**: Calories, macros, protein adherence
- **Training Notes**: Subjective performance feedback
- **Wellbeing Check**: Pain, appetite, stress, mood assessment

---

## Data Flow

```
Daily Check-ins → CLI (coach-ingest) → JSON files → Dashboard (index.html)
                           ↓
                   Weekly Aggregation
                           ↓
                   Coach Session Prep
```

## File Structure

```
Coach_Dashboard_Week_2/
├── index.html              # Main dashboard (single file)
├── scripts/
│   └── coach-ingest        # CLI data ingestor (Python)
├── data/
│   ├── weeks/              # Weekly JSON data files
│   │   └── 2025-11-16.json
│   └── daily/              # Daily check-in files
├── v2/                     # Extended version with auth
├── PRD.md                  # Product requirements
└── README.md               # This file
```

---

## Best Practices for Coach Visibility

1. **Log daily check-ins** - Mood and energy patterns reveal hidden blockers
2. **Track blockers honestly** - Helps coach address root causes
3. **Note wins** - Positive reinforcement accelerates progress
4. **Weekly measurements** - Trends matter more than daily fluctuations
5. **Ask questions** - Use the coach_questions field

---

## Deployment

Deploy to GitHub Pages for free:

```bash
git remote add origin https://github.com/YOUR_USERNAME/coach-dashboard.git
git push -u origin main
# Enable GitHub Pages in repo settings
```

---

## Philosophy

**"What insights does my coach need to help me succeed?"**

This dashboard answers that question by surfacing:
- **Patterns** (sleep, recovery, nutrition trends)
- **Blockers** (what's getting in the way)
- **Progress** (velocity and wins)
- **Focus areas** (highest priority issues)

---

## The Elegant Solution

```
Original proposal: Node.js + Express + React + Railway = 2-4 weeks, $15/month
Elegant solution:  HTML + Chart.js + CLI + GitHub Pages = 2-4 hours, $0/month
```

Built with WWSJD philosophy: ruthlessly simple, zero dependencies, ready to ship.
