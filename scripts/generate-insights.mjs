#!/usr/bin/env node
/**
 * AI-Powered Coaching Insights Generator
 *
 * Uses Vercel AI SDK with Google Gemini to generate expert coaching insights
 * through specialized agentic analysis of weekly fitness data.
 *
 * Usage: node scripts/generate-insights.mjs [week-date]
 * Example: node scripts/generate-insights.mjs 2025-11-25
 */

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Load environment variables
config({ path: join(projectRoot, '.env') });

// Verify API key
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('❌ Error: GEMINI_API_KEY or GOOGLE_API_KEY not found in .env');
  process.exit(1);
}

// Get week date from args or use default
const weekDate = process.argv[2] || '2025-11-25';
const weekFilePath = join(projectRoot, 'data', 'weeks', `${weekDate}.json`);

if (!existsSync(weekFilePath)) {
  console.error(`❌ Error: Week file not found: ${weekFilePath}`);
  process.exit(1);
}

// Load week data
const weekData = JSON.parse(readFileSync(weekFilePath, 'utf-8'));
console.log(`📊 Loaded data for week: ${weekData._meta?.display_label || weekDate}`);

// Load previous week for comparison if available
let previousWeekData = null;
const prevWeekPath = join(projectRoot, 'data', 'weeks', '2025-11-23.json');
if (existsSync(prevWeekPath)) {
  previousWeekData = JSON.parse(readFileSync(prevWeekPath, 'utf-8'));
  console.log(`📈 Loaded previous week for comparison: ${previousWeekData._meta?.display_label || '2025-11-23'}`);
}

// Create the Gemini model
const model = google('gemini-2.0-flash');

/**
 * Expert Agent Definitions
 * Each agent specializes in a specific domain of coaching analysis
 */
const expertAgents = {
  nutritionExpert: {
    name: 'Nutrition Expert',
    emoji: '🥗',
    systemPrompt: `You are an elite sports nutrition coach with 15+ years of experience working with athletes and fitness enthusiasts. Your expertise includes:
- Macronutrient optimization for body composition
- Meal timing and nutrient periodization
- Adherence psychology and sustainable eating habits
- Performance nutrition for strength training

Analyze the nutrition data and provide:
1. Key observations about calorie and protein adherence
2. Specific actionable recommendations
3. One quick win for this week

Be concise but insightful. Use bullet points. Max 150 words.`,
  },

  recoveryExpert: {
    name: 'Recovery & Sleep Expert',
    emoji: '😴',
    systemPrompt: `You are a recovery science specialist with expertise in:
- Sleep optimization for athletes
- HRV-based training readiness
- Stress and recovery balance
- Autonomic nervous system regulation

Analyze the WHOOP/recovery data and provide:
1. Assessment of recovery status and sleep quality
2. Factors potentially affecting recovery
3. One specific recovery protocol to implement

Note: Missing WHOOP days indicate the device wasn't worn. Be concise, max 150 words.`,
  },

  progressExpert: {
    name: 'Progress & Trends Expert',
    emoji: '📈',
    systemPrompt: `You are a body composition and progress tracking specialist with expertise in:
- Body measurement interpretation
- Week-over-week trend analysis
- Goal progress assessment
- Realistic timeline expectations

Analyze the measurements and week-over-week changes to provide:
1. Notable changes from last week (positive and areas to watch)
2. What the trends suggest about current trajectory
3. One adjustment to optimize progress

Be data-driven and encouraging. Max 150 words.`,
  },

  coachingSynthesis: {
    name: 'Head Coach Synthesis',
    emoji: '🎯',
    systemPrompt: `You are an experienced head coach who synthesizes input from specialists to create actionable coaching guidance. Your role is to:
- Prioritize the most impactful recommendations
- Identify connections between nutrition, recovery, and progress
- Create a clear, motivating action plan

Based on the expert analyses, provide:
1. Top 3 priorities for this week (ranked by impact)
2. One mindset cue or motivation point
3. Specific focus for the next coaching session

Be direct, encouraging, and actionable. Max 200 words.`,
  },
};

/**
 * Format week data for AI analysis
 */
function formatDataForAnalysis(data, prevData = null) {
  const nutritionAvg = data.nutrition?.averages || {};
  const nutritionTargets = data.nutrition?.targets || {};
  const whoopAvg = data.whoop?.averages || {};
  const measurements = data.measurements || {};

  let summary = `
## Current Week: ${data._meta?.display_label || data.weekOf}

### Nutrition (Daily Averages)
- Calories: ${nutritionAvg.calories || 'N/A'} / ${nutritionTargets.calories || 'N/A'} target (${nutritionTargets.calories ? Math.round((nutritionAvg.calories / nutritionTargets.calories) * 100) : 'N/A'}%)
- Protein: ${nutritionAvg.protein || 'N/A'}g / ${nutritionTargets.protein || 'N/A'}g target (${nutritionTargets.protein ? Math.round((nutritionAvg.protein / nutritionTargets.protein) * 100) : 'N/A'}%)
- Carbs: ${nutritionAvg.carbs || 'N/A'}g / ${nutritionTargets.carbs || 'N/A'}g target
- Fat: ${nutritionAvg.fat || 'N/A'}g / ${nutritionTargets.fat || 'N/A'}g target

### Daily Nutrition Breakdown
${(data.nutrition?.daily || []).map(d => `- ${d.day}: ${d.calories} cal, ${d.protein}g protein`).join('\n')}

### Recovery Metrics (WHOOP)
- Average Recovery: ${whoopAvg.recovery || 'N/A'}%
- Average HRV: ${whoopAvg.hrv || 'N/A'}ms
- Average RHR: ${whoopAvg.rhr || 'N/A'}bpm
- Average Sleep: ${whoopAvg.sleep || 'N/A'}h
- Average Strain: ${whoopAvg.strain || 'N/A'}
- WHOOP Days Recorded: ${data.whoop?.daily?.length || 0}/7

### Body Measurements
- Weight: ${measurements.weight || 'N/A'} kg
- Waist: ${measurements.waist || 'N/A'} cm
- Chest: ${measurements.chest || 'N/A'} cm
- Hips: ${measurements.hips || measurements.butt || 'N/A'} cm
- Right Thigh: ${measurements.leg || 'N/A'} cm
- Weekly Steps: ${measurements.steps?.toLocaleString() || 'N/A'}

### Training Notes
${data.training?.overall_performance || 'No training notes recorded'}

### Wins This Week
${(data.wins || []).map(w => `- ${w}`).join('\n') || 'No wins recorded'}
`;

  if (prevData) {
    const prevNutrition = prevData.nutrition?.averages || {};
    const prevWhoop = prevData.whoop?.averages || {};
    const prevMeasurements = prevData.measurements || {};

    summary += `
## Previous Week Comparison: ${prevData._meta?.display_label || prevData.weekOf}

### Week-over-Week Changes
- Calories: ${nutritionAvg.calories || 0} vs ${prevNutrition.calories || 0} (${nutritionAvg.calories && prevNutrition.calories ? (nutritionAvg.calories - prevNutrition.calories > 0 ? '+' : '') + (nutritionAvg.calories - prevNutrition.calories) : 'N/A'})
- Protein: ${nutritionAvg.protein || 0}g vs ${prevNutrition.protein || 0}g (${nutritionAvg.protein && prevNutrition.protein ? (nutritionAvg.protein - prevNutrition.protein > 0 ? '+' : '') + (nutritionAvg.protein - prevNutrition.protein) + 'g' : 'N/A'})
- Recovery: ${whoopAvg.recovery || 0}% vs ${prevWhoop.recovery || 0}%
- Sleep: ${whoopAvg.sleep || 0}h vs ${prevWhoop.sleep || 0}h
- HRV: ${whoopAvg.hrv || 0}ms vs ${prevWhoop.hrv || 0}ms
- Weight: ${measurements.weight || 'N/A'} vs ${prevMeasurements.weight || 'N/A'} kg
- Steps: ${measurements.steps?.toLocaleString() || 'N/A'} vs ${prevMeasurements.steps?.toLocaleString() || 'N/A'}
`;
  }

  return summary;
}

/**
 * Run a single expert agent analysis
 */
async function runExpertAgent(agent, dataContext) {
  console.log(`\n${agent.emoji} Running ${agent.name}...`);

  try {
    const { text } = await generateText({
      model,
      system: agent.systemPrompt,
      prompt: `Analyze this fitness data and provide your expert insights:\n\n${dataContext}`,
      maxTokens: 500,
      temperature: 0.7,
    });

    return {
      agent: agent.name,
      emoji: agent.emoji,
      analysis: text.trim(),
    };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return {
      agent: agent.name,
      emoji: agent.emoji,
      analysis: `Analysis unavailable: ${error.message}`,
    };
  }
}

/**
 * Run the synthesis agent with all expert inputs
 */
async function runSynthesisAgent(expertResults, dataContext) {
  console.log(`\n🎯 Running Head Coach Synthesis...`);

  const expertInputs = expertResults
    .map(r => `### ${r.emoji} ${r.agent}\n${r.analysis}`)
    .join('\n\n');

  try {
    const { text } = await generateText({
      model,
      system: expertAgents.coachingSynthesis.systemPrompt,
      prompt: `Based on the following expert analyses and raw data, provide your synthesis:\n\n## Expert Analyses\n${expertInputs}\n\n## Raw Data\n${dataContext}`,
      maxTokens: 600,
      temperature: 0.7,
    });

    return text.trim();
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return `Synthesis unavailable: ${error.message}`;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🤖 AI Coaching Insights Generator');
  console.log('═'.repeat(50));

  const dataContext = formatDataForAnalysis(weekData, previousWeekData);

  // Run expert agents in parallel
  const expertPromises = [
    runExpertAgent(expertAgents.nutritionExpert, dataContext),
    runExpertAgent(expertAgents.recoveryExpert, dataContext),
    runExpertAgent(expertAgents.progressExpert, dataContext),
  ];

  const expertResults = await Promise.all(expertPromises);

  // Run synthesis with all expert inputs
  const synthesis = await runSynthesisAgent(expertResults, dataContext);

  // Build the final AI context
  const aiContext = {
    generated_at: new Date().toISOString(),
    model: 'gemini-1.5-pro',
    expert_insights: {},
    synthesis: synthesis,
  };

  expertResults.forEach(r => {
    const key = r.agent.toLowerCase().replace(/[^a-z]/g, '_');
    aiContext.expert_insights[key] = r.analysis;
  });

  // Update the week data with AI insights
  weekData._ai_context = {
    ...weekData._ai_context,
    ...aiContext,
    summary: synthesis.split('\n')[0] || weekData._ai_context?.summary,
  };

  // Save updated week data
  writeFileSync(weekFilePath, JSON.stringify(weekData, null, 2));
  console.log(`\n✅ Saved insights to ${weekFilePath}`);

  // Print results
  console.log('\n' + '═'.repeat(50));
  console.log('📋 GENERATED INSIGHTS');
  console.log('═'.repeat(50));

  expertResults.forEach(r => {
    console.log(`\n${r.emoji} ${r.agent}`);
    console.log('─'.repeat(40));
    console.log(r.analysis);
  });

  console.log(`\n🎯 Head Coach Synthesis`);
  console.log('─'.repeat(40));
  console.log(synthesis);

  console.log('\n' + '═'.repeat(50));
  console.log('✨ Done! Insights saved to week data file.');
}

main().catch(console.error);
