let data = [];
const formattedDateCache = {};

async function loadData() {
    const response = await fetch('./updated_camp_detail_found.json');
    data = await response.json();
    populateDropdowns();
}

function populateDropdowns() {
    updateDropdownOptions(data);
}

function sortLocations(a, b) {
    const [aNumPart, aStringPart] = a.split('&').map(part => part.trim());
    const [bNumPart, bStringPart] = b.split('&').map(part => part.trim());

    if (aNumPart !== bNumPart) {
        return aNumPart.localeCompare(bNumPart, undefined, { numeric: true });
    }

    return aStringPart.localeCompare(bStringPart);
}

function updateDropdownOptions(filteredCamps) {
    const uniqueCampNames = [...new Set(filteredCamps.map(item => item["Camp Name"]))];
    const uniqueLocations = [...new Set(filteredCamps.map(item => item["Location"]))].sort(sortLocations);

    const uniqueDatesSet = new Set();
    filteredCamps.forEach(camp => {
        camp["Events"].forEach(event => {
            event["Dates"].forEach(date => {
                const formattedDate = formatDate(date);
                uniqueDatesSet.add(formattedDate);
            });
        });
    });

    const uniqueDates = [...uniqueDatesSet];
    uniqueDates.sort((a, b) => new Date(a.split(' ').slice(-3).join(' ')) - new Date(b.split(' ').slice(-3).join(' ')));

    updateSelectOptions("#campNameSelect", uniqueCampNames);
    updateSelectOptions("#locationSelect", uniqueLocations);
    updateSelectOptions("#dateSelect", uniqueDates);
}

function updateSelectOptions(selector, options) {
    const selectElement = $(selector);
    const currentValue = selectElement.val();

    let optionsHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
    selectElement.empty().html(`<option value=""></option>${optionsHTML}`);

    selectElement.val(currentValue).trigger('change.select2');
}

function formatDate(dateString) {
    if (!formattedDateCache[dateString]) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        formattedDateCache[dateString] = new Date(dateString).toLocaleDateString(undefined, options);
    }
    return formattedDateCache[dateString];
}

function searchEvents() {
    const selectedCamp = $("#campNameSelect").val();
    const selectedLocation = $("#locationSelect").val();
    const selectedDate = $("#dateSelect").val();

    let filteredCamps = data;

    // Check if all filters are empty
    if (!selectedCamp && !selectedLocation && !selectedDate) {
        displayNoEvents();
        updateDropdownOptions(data); // reset the dropdowns
        return;
    }

    if (selectedCamp) {
        filteredCamps = filteredCamps.filter(camp => camp["Camp Name"] === selectedCamp);
    }

    if (selectedLocation) {
        filteredCamps = filteredCamps.filter(camp => camp["Location"] === selectedLocation);
    }

    if (selectedDate) {
        filteredCamps = filteredCamps.filter(camp => camp["Events"].some(event => event["Dates"].some(date => formatDate(date) === selectedDate)));
    }

    displayEvents(filteredCamps);
    updateDropdownOptions(filteredCamps);
}

function displayEvents(camps) {
    const eventsDiv = $("#events");

    let htmlContent = '';
    if (!camps.length) {
        htmlContent = '<p>No events match the selected criteria.</p>';
    } else {
        camps.forEach(camp => {
            camp["Events"].forEach(event => {
                htmlContent += `
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
                            <a href="${event["Full Details"]}" class="btn btn-primary" target="_blank">Full Details</a>
                        </div>
                    </div>
                `;
            });
        });
    }

    eventsDiv.html(htmlContent);
}

function displayNoEvents() {
    const eventsDiv = $("#events");
    eventsDiv.html('<p>No events match the selected criteria.</p>');
}

$(document).ready(function () {
    loadData();

    $("#campNameSelect").select2({
        theme: 'bootstrap',
        allowClear: true,
        placeholder: 'Select or type a camp name'
    }).on('change', searchEvents);

    $("#locationSelect").select2({
        theme: 'bootstrap',
        allowClear: true,
        placeholder: 'Select or type a location'
    }).on('change', searchEvents);

    $("#dateSelect").select2({
        theme: 'bootstrap',
        allowClear: true,
        placeholder: 'Select or type a date'
    }).on('change', searchEvents);
});
