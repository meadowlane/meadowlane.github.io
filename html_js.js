let jsonData = []; // This will store your JSON data.
const eventsDiv = document.getElementById('eventsDiv');
const dateSelect = document.getElementById('dateSelect');
const paginationDiv = document.getElementById('paginationDiv');
const itemsPerPage = 10; // Or however many you want per page.

// Load the JSON data.
fetch('events_grouped_by_date.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        // Populate the date select options.
        for (const entry of data) {
            const option = document.createElement('option');
            option.value = entry.Date;
            option.textContent = entry.Date;
            dateSelect.appendChild(option);
        }
    });

function loadEventsByDate(page = 1) {
    const selectedDate = dateSelect.value;
    const eventsForDate = jsonData.find(item => item.Date === selectedDate).events;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    eventsDiv.innerHTML = '';
    for (let i = startIndex; i < endIndex && i < eventsForDate.length; i++) {
        const event = eventsForDate[i];
        eventsDiv.innerHTML += `
            <div class="card mt-2">
                <div class="card-body">
                    <h5>Event: ${event["Event Name"]}</h5>
                    <h5>Location: ${event["Location"]}</h5>
                    <br>
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
            </div>`;
    }

    // Handle pagination
    const totalPages = Math.ceil(eventsForDate.length / itemsPerPage);
    paginationDiv.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item ' + (i === page ? 'active' : '');
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = i;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            loadEventsByDate(i);
        });
        li.appendChild(a);
        paginationDiv.appendChild(li);
    }
}
