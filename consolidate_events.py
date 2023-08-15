import json
import re
from datetime import datetime

# Parsing function for 'Dates'
def parse_date(date_str):
    # Using regex to extract month, day, and year
    match = re.search(r'(\w+) (\d+)(?:st|nd|rd|th)?,? (\d+)', date_str)
    if match:
        month, day, year = match.groups()
        return datetime.strptime(f"{month} {day} {year}", '%B %d %Y')
    else:
        raise ValueError(f"Cannot parse date string: {date_str}")

# Parsing function for 'Date and Time'
# Parsing function for 'Date and Time'
def parse_datetime(date_time_str):
    # Using regex to extract date, hour, minute (if present), and period (AM/PM)
    match = re.search(r'(\w+) (\d+)(?:st|nd|rd|th)?,? (\d+), (\d+)(?::(\d+))? ?(AM|PM)', date_time_str)
    if match:
        month, day, year, hour, minute, period = match.groups()
        minute = minute or "00"  # If minute is None, default to "00"
        return datetime.strptime(f"{month} {day} {year} {hour}:{minute} {period}", '%B %d %Y %I:%M %p')
    else:
        raise ValueError(f"Cannot parse datetime string: {date_time_str}")


# Rest of the code remains the same ...



# Load JSON data from file
with open('data/updated_camp_details.json', 'r') as f:
    data = json.load(f)

# Process each camp's events
for camp in data:
    event_map = {}
    for event in camp['Events']:
        event_name = event['Event Name']

        # If event name is not in the map, simply add the event
        if event_name not in event_map:
            event_map[event_name] = event
        else:
            # If event name is in the map, merge the 'Date and Time' and 'Dates'
            # Be careful of duplicates
            existing_event = event_map[event_name]
            existing_event['Date and Time'] = list(set(existing_event['Date and Time']) | set(event['Date and Time']))
            existing_event['Dates'] = list(set(existing_event['Dates']) | set(event['Dates']))

            # Sort 'Date and Time' and 'Dates'
            existing_event['Dates'].sort(key=parse_date)
            existing_event['Date and Time'].sort(key=parse_datetime)

    # Reassign the cleaned events to the camp
    camp['Events'] = list(event_map.values())

# Save the cleaned data back to the file
with open('data/updated_camp_details_consolidated.json', 'w') as f:
    json.dump(data, f, indent=4)

print("Events merged and sorted successfully!")
