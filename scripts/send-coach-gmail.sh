#!/usr/bin/env bash
# Send coach response via Gmail MCP
# Usage: ./send-coach-gmail.sh "subject" "body"

SUBJECT="${1:-Coach Response}"
BODY="${2:-New coach response received}"
EMAIL_TO="rhys@ironbark.ai"

# Find Claude session
CLAUDE_SESSION=$(tmux list-sessions -F '#{session_name}' 2>/dev/null | grep -E '^(claude|den|main)' | head -1)

if [[ -z "$CLAUDE_SESSION" ]]; then
  echo "❌ No Claude session found"
  exit 1
fi

CLAUDE_PANE="${CLAUDE_SESSION}:0.0"

echo "📨 Sending Gmail via Claude in $CLAUDE_PANE..."

# Clear any pending input and send the email command
tmux send-keys -t "$CLAUDE_PANE" C-u
sleep 0.2

# Use the Gmail MCP tool directly
tmux send-keys -t "$CLAUDE_PANE" "Use mcp__gmail__send_email to send an email to $EMAIL_TO with subject \"$SUBJECT\" and body \"$BODY\"" Enter

echo "✅ Gmail command sent to Claude"
