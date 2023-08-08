let data = [];

async function loadData() {
    const response = await fetch('./updated_camp_detail_found.json');
    data = await response.json();
    populateDropdowns();
}

function populateDropdowns() {
    let uniqueCampNames = [...new Set(data.map(item => item["Camp Name"]))];
    let uniqueLocations = [...new Set(data.map(item => item["Location"]))];
    let uniqueDates = [];

    data.forEach(camp => {
        camp["Events"].forEach(event => {
            event["Dates"].forEach(date => {
                if (!uniqueDates.includes(date)) {
                    uniqueDates.push(date);
                }
            });
        });
    });

    uniqueLocations.sort((a, b) => {
        const timeA = a.split(' ')[0];
        const timeB = b.split(' ')[0];
        return timeA.localeCompare(timeB, undefined, { numeric: true, hour12: false });
    });

    uniqueDates.sort((a, b) => {
        return new Date(a.split(' ').slice(-3).join(' ')) - new Date(b.split(' ').slice(-3).join(' '));
    });

    $("#campNameSelect").select2({
        theme: 'bootstrap',
        allowClear: true,
        placeholder: 'Select or type a camp name',
        data: uniqueCampNames
    }).on('select2:select', searchEvents)
      .on('select2:unselect', searchEvents);

    $("#locationSelect").select2({
        theme: 'bootstrap',
        allowClear: true,
        placeholder: 'Select or type a location',
        data: uniqueLocations
    }).on('select2:select', searchEvents)
      .on('select2:unselect', searchEvents);

    $("#dateSelect").select2({
        theme: 'bootstrap',
        allowClear: true,
        placeholder: 'Select or type a date',
        data: uniqueDates
    }).on('select2:select', searchEvents)
      .on('select2:unselect', searchEvents);
}

function searchEvents() {
    const selectedCamp = $("#campNameSelect").val();
    const selectedLocation = $("#locationSelect").val();
    const selectedDate = $("#dateSelect").val();

    let filteredCamps = data.filter(camp => {
        const matchesCamp = !selectedCamp || camp["Camp Name"] === selectedCamp;
        const matchesLocation = !selectedLocation || camp["Location"] === selectedLocation;
        return matchesCamp && matchesLocation;
    });

    let filteredEventsCamps = [];

    filteredCamps.forEach(camp => {
        let eventsOnSelectedDate = camp["Events"].filter(event =>
            !selectedDate || event["Dates"].includes(selectedDate)
        );

        if (eventsOnSelectedDate.length > 0) {
            let campCopy = Object.assign({}, camp);
            campCopy["Events"] = eventsOnSelectedDate;
            filteredEventsCamps.push(campCopy);
        }
    });

    displayEvents(filteredEventsCamps);
}

function displayEvents(camps) {
    const eventsDiv = $("#events");
    eventsDiv.empty();

    if (camps.length === 0) {
        eventsDiv.append('<p>No events match the selected criteria.</p>');
        return;
    }

    camps.forEach(camp => {
        camp["Events"].forEach(event => {
            eventsDiv.append(`
                <div class="card mt-2">
                    <div class="card-body">
                        <h5 class="card-title">${event["Event Name"]}</h5>
                        <p class="card-text">
                            Camp: ${camp["Camp Name"]}<br>
                            Location: ${camp["Location"]}<br>
                            Date and Time: ${event["Date and Time"].join('<br>')}<br>
                            Type: ${event["Type"]}<br>
                            Description: ${event["Description"]}
                        </p>
                        <a href="${event["Full Details"]}" class="btn btn-primary" target="_blank">Full Details</a>
                    </div>
                </div>
            `);
        });
    });
}

$(document).ready(function () {
    loadData();
});
