let data = [];

async function loadData() {
    const response = await fetch('/data/updated_camp_details.json');
    data = await response.json();
    populateDropdowns();
}

function populateDropdowns() {
    let uniqueCampNames = [...new Set(data.map(item => item["Camp Name"]))];
    let uniqueLocations = [...new Set(data.map(item => item["Location"]))];

    uniqueLocations = uniqueLocations.sort((a, b) => {
        const timeA = a.split(' and ')[0];
        const timeB = b.split(' and ')[0];
        return timeA.localeCompare(timeB, undefined, {numeric: true, hour12: false});
    });

    $("#campNameSelect").select2({
        theme: 'bootstrap',
        allowClear: true,
        placeholder: 'Select or type a camp name',
        data: uniqueCampNames
    }).on('select2:select', function () {
        const selectedLocation = data.find(camp => camp["Camp Name"] === $(this).val())["Location"];
        $("#locationSelect").val(selectedLocation).trigger('change');
        searchEvents();
    }).on('select2:unselect', function () {
        $("#campNameSelect").val(null).trigger('change');
        searchEvents();
    });

    $("#locationSelect").select2({
        theme: 'bootstrap',
        allowClear: true,
        placeholder: 'Select or type a location',
        data: uniqueLocations
    }).on('select2:select', function () {
        const campsAtLocation = data.filter(camp => camp["Location"] === $(this).val()).map(camp => camp["Camp Name"]);
        $("#campNameSelect").empty().select2({
            theme: 'bootstrap',
            data: campsAtLocation
        });
        searchEvents();
    }).on('select2:unselect', function () {
        $("#campNameSelect").empty().select2({
            theme: 'bootstrap',
            placeholder: 'Select or type a camp name',
            data: uniqueCampNames
        }).val(null).trigger('change');
        $("#locationSelect").val(null).trigger('change');
    });

    $("#campNameSelect").val(null).trigger('change');
    $("#locationSelect").val(null).trigger('change');
}

function searchEvents() {
    const selectedCamp = $("#campNameSelect").val();
    const selectedLocation = $("#locationSelect").val();

    let filteredEvents = data.filter(camp =>
        (!selectedCamp || camp["Camp Name"] === selectedCamp) &&
        (!selectedLocation || camp["Location"] === selectedLocation)
    );

    displayEvents(filteredEvents);

    if (filteredEvents.length > 0) {
        $('html, body').animate({
            scrollTop: $("#events").offset().top
        }, 500);
    }
}

function displayEvents(camps) {
    const eventsDiv = document.getElementById('events');
    eventsDiv.innerHTML = '';
    camps.forEach(camp => {
        camp["Events"].forEach(event => {
            eventsDiv.innerHTML += `
                <div class="card mt-2">
                    <div class="card-body">
                        <h5>Event: ${event["Event Name"]}</h5>
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
                </div>
            `;
        });
    });
}

$(document).ready(function () {
    loadData();
});
