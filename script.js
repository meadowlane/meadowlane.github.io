let data = [];

async function loadData() {
    const response = await fetch('./updated_camp_detail_found.json');
    data = await response.json();
}

document.getElementById('searchInput').addEventListener('keyup', searchEvents);

function searchEvents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filteredCamps;
    if (searchTerm) {
        filteredCamps = data.filter(camp =>
            camp["Events"] && camp["Events"].some(event =>
                event["Event Name"] && event["Event Name"].toLowerCase().includes(searchTerm))
        );
    } else {
        filteredCamps = data;
    }

    displayEvents(filteredCamps);
}

function displayEvents(camps) {
    const eventsDiv = document.getElementById('events');
    eventsDiv.innerHTML = '';
    camps.forEach(camp => {
        camp["Events"].forEach(event => {
            const card = document.createElement('div');
            card.className = "card mt-2";
            card.innerHTML = `
                    <div class="card-header">
                        <h5>Event: ${event["Event Name"]}</h5>
                    </div>
                    <div class="card-body">
                        <h5>Camp: ${camp["Camp Name"]}</h5>
                        <h5>Location: ${camp["Location"]}</h5>
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
            `;

            card.querySelector('.card-header').addEventListener('click', function() {
                const body = card.querySelector('.card-body');
                if (body.style.display === "none" || body.style.display === "") {
                    body.style.display = "block";
                } else {
                    body.style.display = "none";
                }
            });

            eventsDiv.appendChild(card);
        });
    });
}

// Calling loadData when the script runs to fetch and populate data
loadData();
