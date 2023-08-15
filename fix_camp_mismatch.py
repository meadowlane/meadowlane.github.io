import json


def correct_events(camps_data):
    # This will store all the events indexed by their name for fast lookup.
    events_index = {}

    # First pass: index all events.
    for camp in camps_data:
        for event in camp["Events"]:
            events_index[event["Event Name"]] = event

    # Second pass: Fixing the events.
    for camp in camps_data:
        events_to_remove = []
        for i, event in enumerate(camp["Events"]):
            if event["Located at Camp"] != camp["Camp Name"]:
                # The event is in the wrong camp. Remove it from this camp's list.
                events_to_remove.append(i)

                # Search for the correct camp and add the event there (if not present).
                for target_camp in camps_data:
                    if target_camp["Camp Name"] == event["Located at Camp"]:
                        # Check if the event is not already in this camp.
                        if not any(e["Event Name"] == event["Event Name"] for e in target_camp["Events"]):
                            target_camp["Events"].append(event)
                        break

        # Actually removing the events from the list.
        for index in reversed(events_to_remove):
            del camp["Events"][index]

    return camps_data


# Importing data from the file
with open("data/updated_camp_details.json", "r") as file:
    data = json.load(file)

corrected_data = correct_events(data)

# If you want to save the corrected data back to a file:
with open("data/corrected_camp_detail.json", "w") as file:
    json.dump(corrected_data, file, indent=4)

print("Correction completed!")
