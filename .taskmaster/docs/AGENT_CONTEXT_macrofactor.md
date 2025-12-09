# Agent Context: MacroFactor Measurements Integration

**Created**: 2025-12-03
**Purpose**: Context for parallel agents to implement MacroFactor measurements integration

---

## VERIFIED MacroFactor Export Structure

**File inspected**: `/home/anombyte/Projects/in-progress/genesis-ai/MacroFactor-20251203174819.xlsx`

### Sheets Available

| Sheet | Columns | Rows |
|-------|---------|------|
| Calories & Macros | Date, Calories (kcal), Fat (g), Carbs (g), Protein (g) | 231 |
| Micronutrients | Date, Fiber (g), Sodium (mg), + 50 others | 231 |
| **Scale Weight** | Date, Weight (kg), Fat Percent | 143 |
| **Body Metrics** | Date, Waist (cm), Chest (cm), Hips (cm), Shoulders (cm), + 15 others | 8 |
| Weight Trend | Date, Trend Weight (kg) | 253 |
| Expenditure | Date, Expenditure | 253 |
| Steps | Date, Steps | 271 |

### Key Findings

1. **Weight is in SEPARATE SHEET** (`Scale Weight`), not in Calories & Macros
2. **Body Metrics is SEPARATE SHEET** with waist, chest, etc.
3. Current parser only reads ONE sheet - needs to read multiple
4. Weight column: `Weight (kg)`
5. Waist column: `Waist (cm)`
6. Chest column: `Chest (cm)`
7. Steps is in SEPARATE SHEET too!

### Current Parser Problem (lines 1052-1125)

```python
# CURRENT - Only reads one sheet (implicitly first or named)
df = pd.read_excel(xlsx_path)  # <-- BUG: Doesn't specify sheet!
```

### Required Fix

```python
# Read multiple sheets
xlsx = pd.ExcelFile(xlsx_path)

# Calories & Macros
calories_df = pd.read_excel(xlsx, sheet_name='Calories & Macros')

# Scale Weight (separate sheet)
if 'Scale Weight' in xlsx.sheet_names:
    weight_df = pd.read_excel(xlsx, sheet_name='Scale Weight')
    # Get latest weight for the week

# Body Metrics (separate sheet)
if 'Body Metrics' in xlsx.sheet_names:
    metrics_df = pd.read_excel(xlsx, sheet_name='Body Metrics')
    # Get waist, chest, etc.

# Steps (separate sheet)
if 'Steps' in xlsx.sheet_names:
    steps_df = pd.read_excel(xlsx, sheet_name='Steps')
```

---

## Implementation Tasks

### Task A: Update parse_macrofactor_xlsx to handle multiple sheets
- File: `/home/anombyte/Projects/in-progress/Coach_Dashboard_Week_2/scripts/coach-ingest`
- Lines: 1052-1125
- Changes:
  - Use `pd.ExcelFile()` to read workbook
  - Read 'Calories & Macros' sheet for nutrition
  - Read 'Scale Weight' sheet for weight
  - Read 'Body Metrics' sheet for measurements
  - Read 'Steps' sheet for step count
  - Return new dict with measurements alongside nutrition

### Task B: Update function signature and return value
- Current: `return daily_data, averages`
- New: `return daily_data, averages, measurements`
- Measurements dict: `{ "weight": float, "waist": float, ... }`

### Task C: Update cmd_macrofactor_gmail (lines 1127-1290)
- Call updated parser
- Populate `data["measurements"]` from returned measurements
- Add data notes for missing fields

### Task D: Update cmd_macrofactor_file (lines 1291-1350)
- Same changes as cmd_macrofactor_gmail
- Handle missing measurements gracefully

### Task E: Add admin dashboard flag for missing data
- When measurements missing, set flag in metadata
- Admin dashboard should show prompt to enter manually

---

## Exact Column Names (VERIFIED)

| Field | Sheet | Column Name |
|-------|-------|-------------|
| Weight | Scale Weight | `Weight (kg)` |
| Body Fat | Scale Weight | `Fat Percent` |
| Waist | Body Metrics | `Waist (cm)` |
| Chest | Body Metrics | `Chest (cm)` |
| Hips | Body Metrics | `Hips (cm)` |
| Shoulders | Body Metrics | `Shoulders (cm)` |
| Steps | Steps | `Steps` |
| Calories | Calories & Macros | `Calories (kcal)` |
| Protein | Calories & Macros | `Protein (g)` |

---

## Graceful Degradation Rules

1. If sheet doesn't exist: Log warning, continue with None values
2. If no data for week in sheet: Note in metadata, set to None
3. Never crash on missing data
4. Always explain WHY data is missing in `_meta.data_notes`

---

## User Preferences

- When data missing: **Flag in admin dashboard** to enter manually or provide file
- User tracks: All body metrics (verified by export having 8 Body Metrics entries)

---

## File Reference

Main file to modify:
`/home/anombyte/Projects/in-progress/Coach_Dashboard_Week_2/scripts/coach-ingest`
