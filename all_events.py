import json

def extract_events_from_data(data):
    events = []
    for camp in data:
        for event in camp["Events"]:
            # Replace the event location with the camp's location
            event["Location"] = camp["Location"]
            event["Camp Name"] = camp["Camp Name"]
            events.append(event)
    return events

with open("data/updated_camp_details.json", "r") as input_file:
    data = json.load(input_file)

    # Extract all events
all_events = extract_events_from_data(data)

    # Export the list of all events to a new file
with open("data/all_events.json", "w") as output_file:
    json.dump(all_events, output_file, indent=4)
