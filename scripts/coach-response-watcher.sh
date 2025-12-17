#!/usr/bin/env bash
# Coach Response Watcher
# Monitors ntfy topic and sends Gmail notification via Claude MCP
#
# Usage: ./coach-response-watcher.sh
# Run in background: nohup ./coach-response-watcher.sh &

NTFY_TOPIC="http://localhost:8889/coach-responses/json"
LOG_FILE="$HOME/.claude/logs/coach-responses.jsonl"
EMAIL_TO="hayden.bruinsma@gmail.com"

mkdir -p "$(dirname "$LOG_FILE")"

echo "🔍 Watching for coach responses on ntfy..."
echo "📧 Will send Gmail notifications to: $EMAIL_TO"
echo "📝 Logging to: $LOG_FILE"
echo ""

# Subscribe to ntfy topic with SSE
curl -s "$NTFY_TOPIC" | while read -r line; do
  # Skip empty lines
  [[ -z "$line" ]] && continue

  # Parse the JSON message
  title=$(echo "$line" | jq -r '.title // "Coach Response"')
  message=$(echo "$line" | jq -r '.message // ""')
  timestamp=$(date -Iseconds)

  # Skip if no message
  [[ -z "$message" || "$message" == "null" ]] && continue

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 New coach response at $timestamp"
  echo "Title: $title"
  echo "Message: $message"

  # Log to file
  echo "{\"timestamp\":\"$timestamp\",\"title\":\"$title\",\"message\":\"$message\"}" >> "$LOG_FILE"

  # Send Gmail notification via Claude in tmux
  # Find a Claude session and inject the command
  CLAUDE_PANE=$(tmux list-panes -a -F '#{pane_id} #{pane_current_command}' 2>/dev/null | grep -i claude | head -1 | awk '{print $1}')

  if [[ -n "$CLAUDE_PANE" ]]; then
    echo "📨 Sending Gmail via Claude in pane $CLAUDE_PANE..."

    # Escape the message for shell
    escaped_message=$(printf '%s' "$message" | sed 's/"/\\"/g' | tr '\n' ' ')

    # Inject Gmail MCP command into Claude
    tmux send-keys -t "$CLAUDE_PANE" C-c
    sleep 0.5
    tmux send-keys -t "$CLAUDE_PANE" "Send an email to $EMAIL_TO with subject '$title' and body: $escaped_message" Enter

    echo "✅ Gmail command injected"
  else
    echo "⚠️  No Claude session found - logged to file only"
  fi

  echo ""
done
