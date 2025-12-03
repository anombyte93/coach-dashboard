#!/bin/bash
# Coach Dashboard Weekly Reminder Script
# Schedule with cron:
# Sunday 6pm:  0 18 * * 0 /path/to/weekly-reminder.sh sunday
# Monday 9am:  0 9 * * 1 /path/to/weekly-reminder.sh monday

# Configuration
NTFY_TOPIC="${NTFY_TOPIC:-coach-dashboard}"
NTFY_SERVER="${NTFY_SERVER:-http://localhost:8889}"

case "$1" in
  sunday)
    TITLE="Export Data Reminder"
    MESSAGE="Don't forget to export your WHOOP and MacroFactor data for this week's check-in!"
    PRIORITY="3"
    ;;
  monday)
    TITLE="Weekly Check-In"
    MESSAGE="Time to update your Coach Dashboard before your coaching call!"
    PRIORITY="4"
    ;;
  *)
    echo "Usage: $0 {sunday|monday}"
    exit 1
    ;;
esac

# Send notification
curl -s -m 5 \
  -H "Title: $TITLE" \
  -H "Priority: $PRIORITY" \
  -H "Tags: clipboard,chart_with_upwards_trend" \
  -d "$MESSAGE" \
  "$NTFY_SERVER/$NTFY_TOPIC" &>/dev/null

echo "Sent: $TITLE"
