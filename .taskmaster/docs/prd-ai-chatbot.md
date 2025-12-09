# AI Fitness Coaching Chatbot - Product Requirements Document

## Executive Summary

Add an interactive AI-powered fitness coaching chatbot to the Coach Dashboard that provides real-time, personalized coaching insights based on user's nutrition, WHOOP biometrics, training logs, and wellbeing data.

## Problem Statement

The current dashboard provides static weekly insights via batch-generated AI analysis. Users cannot:
- Ask follow-up questions about their data
- Get real-time coaching advice
- Have interactive conversations about their progress
- Explore specific concerns (e.g., "Why am I tired?", "Am I eating enough protein?")

## Solution Overview

Implement a streaming chat interface that:
1. Connects to the existing Vercel AI SDK (`ai` v5.0.106, `@ai-sdk/google`)
2. Injects current week's data as context for personalized responses
3. Uses motivational interviewing techniques for effective coaching
4. Includes appropriate safety disclaimers (not medical advice)

## Technical Architecture

### Backend Components

#### 1. Chat Server (Express/Node.js)
- **File**: `server.mjs`
- **Endpoint**: `POST /api/chat`
- **Dependencies**: express, cors (already have: ai, @ai-sdk/google, dotenv)
- **Features**:
  - SSE streaming responses
  - Context injection from week data
  - Rate limiting (10 req/min)
  - Health check endpoint

#### 2. System Prompt
- **Role**: Evidence-based fitness coach
- **Boundaries**: NO medical diagnoses, prescriptions, or injury treatment
- **Data access**: Normalized weekly JSON context
- **Techniques**: Motivational interviewing (ask → reflect → suggest)

### Frontend Components

#### 3. Chat Widget UI
- **Location**: Bottom-right floating button → expandable chat panel
- **Features**:
  - Message history display
  - Streaming token rendering
  - Typing indicator
  - Error states
  - Mobile responsive

#### 4. Context Injection
- **Function**: `getCoachingContext()`
- **Data sources**: nutrition averages, WHOOP metrics, measurements, wins
- **Format**: Summarized text injected into each request

## Implementation Tasks

### Phase 1: Core Backend (Priority: Critical)

1. **Add Express dependencies**
   - `npm install express cors`

2. **Create chat server**
   - File: `server.mjs`
   - Health check: `GET /api/health`
   - Chat endpoint: `POST /api/chat`
   - SSE streaming with `streamText()`

3. **Create coaching system prompt**
   - Evidence-based coach persona
   - Data interpretation rules
   - Safety boundaries
   - Disclaimer text

4. **Add npm script**
   - `"chat-server": "node server.mjs"`

### Phase 2: Frontend Integration (Priority: High)

5. **Create chat widget HTML/CSS**
   - Floating toggle button
   - Expandable chat container
   - Message list with styling
   - Input form

6. **Implement chat JavaScript**
   - EventSource/fetch for streaming
   - Message state management
   - DOM rendering
   - Error handling

7. **Add context injection**
   - Read current week data
   - Format for AI context
   - Pass with each request

### Phase 3: Polish & UX (Priority: Medium)

8. **Add loading states**
   - Typing indicator animation
   - Disable input during streaming

9. **Add conversation persistence**
   - localStorage for chat history
   - Clear conversation button

10. **Add safety disclaimer**
    - First-message disclaimer
    - Footer disclaimer link

### Phase 4: Testing (Priority: High)

11. **Unit tests (Vitest)**
    - Context formatting functions
    - Prompt construction
    - Response parsing
    - Utility functions
    - Target: 30-40 tests

12. **Integration tests**
    - API route handling
    - Streaming response format
    - Error scenarios
    - Mock AI responses
    - Target: 15-20 tests

13. **E2E tests (Playwright)**
    - Chat widget open/close
    - Send message flow
    - Streaming display
    - Multi-turn conversation
    - Error recovery
    - Target: 8-12 tests

## Data Context Schema

```json
{
  "week": "Nov 25 - Dec 1, 2025",
  "nutrition": {
    "avgCalories": 2862,
    "avgProtein": 161,
    "calorieTarget": 2725,
    "proteinTarget": 195,
    "adherenceCalories": "105%",
    "adherenceProtein": "83%"
  },
  "recovery": {
    "avgRecovery": "64%",
    "avgHRV": "47ms",
    "avgSleep": "6.0h",
    "avgStrain": "11.1"
  },
  "measurements": {
    "weight": "N/A",
    "steps": 65874
  },
  "wins": ["Squat PR!", "Bench PR!", "Flexibility improvements"],
  "training": "Excellent - hit PRs!"
}
```

## System Prompt Template

```markdown
# Role
You are an evidence-based fitness coach specializing in strength training,
nutrition optimization, and sustainable habit formation.

# Boundaries (CRITICAL)
- NEVER provide: medical diagnoses, medication advice, injury treatment
- ALWAYS recommend professional consultation for: persistent pain,
  concerning symptoms, medical conditions
- SCOPE: General fitness coaching and education only

# User Context
You have access to the user's weekly data including nutrition (macros, calories),
biometrics (HRV, recovery, sleep, strain), and training notes.

# Coaching Style
- Use motivational interviewing: ask > reflect > suggest
- Be concise (2-3 sentences default), offer to elaborate
- Data-driven but encouraging
- Focus on actionable, sustainable recommendations

# Safety Disclaimer (include in first response)
"I'm an AI coach providing general fitness guidance - not medical advice.
Always consult healthcare professionals for health concerns."
```

## Success Criteria

1. **Functional**: Chat sends/receives streaming messages
2. **Contextual**: Responses reference user's actual data
3. **Safe**: Disclaimer shown, no medical advice given
4. **Responsive**: TTFT < 800ms, smooth streaming
5. **Tested**: 60+ tests passing, critical paths covered
6. **Mobile-friendly**: Works on small screens

## Out of Scope (V1)

- Voice input/output
- Multi-week trend analysis in chat
- Goal setting and tracking
- Workout programming
- Meal planning

## Dependencies

- Existing: `ai` v5.0.106, `@ai-sdk/google` v2.0.44, `dotenv`
- To add: `express`, `cors`
- API: `GEMINI_API_KEY` (already configured)

## Estimated Effort

- Backend: 2 hours
- Frontend: 2 hours
- Testing: 3 hours
- Total: ~7 hours via Codex CLI automation

## References

- Vercel AI SDK Docs: https://sdk.vercel.ai/docs
- Project existing insights script: `scripts/generate-insights.mjs`
- Week data format: `v2/data/weeks/*.json`
