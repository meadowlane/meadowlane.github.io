let data = [];

async function loadData() {
    const response = await fetch('./events_grouped_by_date.json');
    data = await response.json();
    // Display all data by default
    displayEvents(data);
}

document.getElementById('searchInput').addEventListener('keyup', searchEvents);
document.getElementById('datePicker').addEventListener('change', searchEvents);

function searchEvents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedDate = document.getElementById('datePicker').value;

    let filteredGroups;
    if (searchTerm || selectedDate) {
        filteredGroups = data.filter(group =>
            group["events"].some(event =>
                (!searchTerm || (event["Event Name"] && event["Event Name"].toLowerCase().includes(searchTerm))) &&
                (!selectedDate || group.Date.includes(selectedDate))
            )
        );
    } else {
        filteredGroups = data;
    }

    displayEvents(filteredGroups);
}

function displayEvents(groups) {
    const eventsDiv = document.getElementById('events');
    eventsDiv.innerHTML = '';
    groups.forEach(group => {
        group["events"].forEach(event => {
            eventsDiv.innerHTML += `
                <div class="card mt-2">
                    <div class="card-body">
                        <h5>Event: ${event["Event Name"]}</h5>
                        <h5>Date: ${group["Date"]}</h5>
                        <h6>Dates and Times:</h6>
                        <p>${event["Date and Time"].join('<br>')}</p>
                        <h6>Type:</h6>
                        <p>${event["Type"]}</p>
                        <h6>Located at Camp:</h6>
                        <p>${event["Located at Camp"]}</p>
                        <h6>Description:</h6>
                        <p>${event["Description"]}</p>
                        <a href="${event["Full Details"]}" target="_blank">Full Details</a>
                    </div>
                </div>
            `;
        });
    });
}

// Calling loadData when the script runs to fetch and populate data
loadData();
