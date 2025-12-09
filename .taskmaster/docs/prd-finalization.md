# Coach Dashboard Finalization PRD

**Version**: 1.1
**Date**: 2025-12-03
**Focus**: Display both Week 16 and Week 23 correctly for coach review

---

## Executive Summary

**Problem**: Coach cannot properly review client data because:
1. ~~Week 23 JSON had restrictive permissions (FIXED)~~
2. Dashboard has null handling issues for missing measurements
3. No visual indicator when data is incomplete
4. Embedded fallback data only covers Week 16

**Solution**: 5 targeted improvements to ensure proper data display

---

## Research Findings

### Industry Best Practices (Perplexity 2024-2025)

1. **Week-over-week comparison**: Small-multiple charts with previous week lightly overlaid
2. **Recovery visualization**: Single readiness tile with green/yellow/red status
3. **Null handling**: Show "Not recorded" with visual indicator, not blank
4. **Mobile-first**: Bottom tab bar, card-based layout, progressive disclosure

### Current State

| Week | Data Status | Display Status |
|------|-------------|----------------|
| Nov 16 | Complete | Works correctly |
| Nov 23 | Complete (missing measurements) | Now loads (permission fixed) |

### Week 23 Data Gaps

```json
"measurements": {
  "weight": null,
  "waist": null,
  "chest": null,
  "middle": null,
  "butt": null,
  "leg": null,
  "steps": 65874  // Only steps available
}
```

---

## Required Changes (Priority Order)

### Task 1: Handle null measurements gracefully

**Current behavior**: Shows "null kg" in measurements table
**Expected behavior**: Show "–" or "Not recorded" with visual styling

```javascript
// Current (broken)
{ label: 'Weight', value: `${data.measurements.weight} kg` }

// Fixed
{ label: 'Weight', value: data.measurements.weight ? `${data.measurements.weight} kg` : '–' }
```

**Files**: `index.html` lines 1143-1150
**Complexity**: 2/10

### Task 2: Update embedded fallback data to cover both weeks

**Current**: Only Nov 16 embedded in HTML
**Improvement**: Keep Nov 16 as fallback, but add proper error messaging when fetch fails

**Files**: `index.html` lines 750-836
**Complexity**: 2/10

### Task 3: Add data completeness indicator

**Location**: Week tabs and measurements card
**Implementation**: Add visual badge when `_meta.data_completeness.measurements === false`

```css
.week-tab.partial::after {
  content: '⚠';
  margin-left: 4px;
  color: var(--yellow);
}
```

**Files**: `index.html` CSS and renderWeekTabs()
**Complexity**: 3/10

### Task 4: Fix Daily Steps calculation for Nov 23

**Current issue**: `avgSteps = data.measurements.steps / 7`
**Week 23 data**: Has per-day steps in nutrition.daily array

```javascript
// Week 23 structure
nutrition.daily[i].steps = [6149, 8063, 4656, 10330, 7448, 17662, 11566]

// Should calculate from daily data if available
const avgSteps = data.nutrition?.daily?.[0]?.steps !== undefined
  ? Math.round(data.nutrition.daily.reduce((sum, d) => sum + (d.steps || 0), 0) / 7)
  : Math.round((data.measurements.steps || 0) / 7);
```

**Files**: `index.html` line 1091
**Complexity**: 3/10

### Task 5: Ensure chart day labels match data

**Current**: `days = data.whoop.daily.map(d => d.day)`
**Week 23 issue**: WHOOP data only has 5 days (missing Tue, Thu)

```json
// Week 23 WHOOP daily (only 5 entries)
["Sun", "Mon", "Wed", "Fri", "Sat"]

// But nutrition has all 7 days
["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
```

**Solution**: Use nutrition days as source of truth, fill missing WHOOP data

**Files**: `index.html` loadWeek() and renderDashboard()
**Complexity**: 4/10

---

## Acceptance Criteria

- [ ] AC1: Week 23 displays without errors in measurements table
- [ ] AC2: Null values show "–" not "null"
- [ ] AC3: Week 23 tab shows partial data indicator
- [ ] AC4: Daily steps shows correct average (9,411 for Week 23)
- [ ] AC5: All 7 charts render for both weeks (with gaps marked for missing days)

---

## Implementation Order

1. **Task 1** (null handling) - Immediate visual fix
2. **Task 4** (steps calculation) - Data accuracy
3. **Task 5** (day alignment) - Chart consistency
4. **Task 3** (completeness indicator) - UX clarity
5. **Task 2** (fallback improvement) - Resilience

**Estimated effort**: 1-2 hours total

---

## Testing

```bash
# Start local server
python3 -m http.server 8767

# Test endpoints
curl http://localhost:8767/data/weeks/2025-11-16.json | jq '.measurements'
curl http://localhost:8767/data/weeks/2025-11-23.json | jq '.measurements'

# Playwright tests
npm test
```

---

*Generated from research analysis - Focus: Quick fixes to unblock coach review*
