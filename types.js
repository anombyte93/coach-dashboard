/**
 * Coach Dashboard Week Data Type Definitions
 *
 * These JSDoc type definitions provide AI-interpretable metadata structure
 * for week-based coaching data. Use with @type annotations for IDE support.
 */

/**
 * @typedef {Object} WeekInterval
 * @property {string} startDate - ISO 8601 date (YYYY-MM-DD)
 * @property {string} endDate - ISO 8601 date (YYYY-MM-DD)
 */

/**
 * @typedef {Object} CalendarRules
 * @property {'Sunday'|'Monday'} week_starts_on - First day of week
 * @property {'Saturday'|'Sunday'} week_ends_on - Last day of week
 * @property {string} convention - Description (e.g., "US Sunday-start week")
 */

/**
 * @typedef {Object} WeekNavigation
 * @property {string|null} prev_week_id - Previous week's week_id or null if first
 * @property {string|null} next_week_id - Next week's week_id or null if last
 * @property {number} week_number - Week number in program (1-indexed)
 * @property {number|null} total_weeks_in_program - Total weeks or null if ongoing
 */

/**
 * @typedef {Object} DataCompleteness
 * @property {boolean} measurements - Has body measurement data
 * @property {boolean} training - Has training data
 * @property {boolean} nutrition - Has nutrition data
 * @property {boolean} whoop - Has WHOOP data
 * @property {boolean} wellbeing - Has wellbeing data
 */

/**
 * Week Metadata - AI-interpretable temporal context
 * @typedef {Object} WeekMeta
 * @property {string} week_id - Custom week ID with convention suffix (e.g., "2025-W47-SUN")
 * @property {string} iso_week - ISO 8601 week reference (e.g., "2025-W48")
 * @property {WeekInterval} interval - Explicit start/end dates
 * @property {string} display_label - Human-readable label (e.g., "Nov 23–29, 2025")
 * @property {string} temporalCoverage - Schema.org interval string (e.g., "2025-11-23/2025-11-29")
 * @property {CalendarRules} calendar_rules - Week boundary conventions
 * @property {WeekNavigation} navigation - Prev/next pointers for traversal
 * @property {DataCompleteness} data_completeness - Flags for available data sections
 */

/**
 * @typedef {Object} WeekKeyMetrics
 * @property {number|null} weight_kg - Body weight in kilograms
 * @property {number} avg_calories - Average daily calorie intake
 * @property {number} avg_protein_g - Average daily protein in grams
 * @property {number} protein_target_pct - Protein as percentage of target
 * @property {number} avg_sleep_hours - Average sleep duration
 * @property {number} avg_recovery_pct - Average WHOOP recovery percentage
 * @property {number} total_steps - Total weekly steps
 */

/**
 * @typedef {Object} WeekVsPrevious
 * @property {number} calories_delta - Calorie difference from previous week
 * @property {string} recovery_delta - Recovery change (e.g., "+7%")
 * @property {string} sleep_delta - Sleep change (e.g., "+0.3h")
 * @property {number} steps_delta - Steps difference from previous week
 * @property {'improving'|'declining'|'stable'} trend - Overall trend assessment
 */

/**
 * AI Context - Session resumption and LLM interpretation hints
 * @typedef {Object} WeekAIContext
 * @property {string} summary - Natural language week summary for instant LLM comprehension
 * @property {'baseline'|'progressing'|'regressing'|'plateau'|'recovery'} status - Week status
 * @property {WeekKeyMetrics} key_metrics - Pre-extracted key numbers for quick reference
 * @property {string[]} flags - Semantic tags (e.g., "travel_week", "pr_week", "sleep_deficit")
 * @property {string} coach_priority - Current coaching focus for this week
 * @property {WeekVsPrevious} [week_vs_previous] - Delta comparisons (Week 2+)
 */

/**
 * Complete Week Data Structure with AI-interpretable metadata
 * @typedef {Object} WeekData
 * @property {WeekMeta} _meta - Temporal metadata for AI/LLM interpretation
 * @property {WeekAIContext} _ai_context - Session resumption and context hints
 * @property {string} weekOf - Legacy week start date (YYYY-MM-DD)
 * @property {Object} measurements - Body measurements
 * @property {Object} training - Training notes
 * @property {Object} nutrition - Nutrition data and targets
 * @property {Object} whoop - WHOOP recovery data
 * @property {Object} wellbeing - Wellbeing self-assessment
 * @property {string[]} wins - Weekly achievements
 * @property {string} coach_questions - Client questions for coach
 */

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {};
}
