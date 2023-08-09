$(document).ready(function() {
    // Load JSON file
    $.getJSON('all_events.json', function(data) {
        // Extract event names
        let eventNames = data.map(event => event['Event Name']);

        // Setup autocomplete
        $('#search').autocomplete({
            source: function(request, response) {
                let matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                response($.grep(eventNames, function(item) {
                    return matcher.test(item);
                }));
            },
            select: function(event, ui) {
                displayEventDetails(ui.item.value, data);
            }
        });
    });
});

function displayEventDetails(eventName, data) {
    let event = data.find(e => e['Event Name'] === eventName);
    if (event) {
        $('#eventDetails').css('display', 'block');  // Add this line
        $('#eventDetails').html(`
            <h3>${event['Event Name']}</h3>
            <p>Type: ${event['Type']}</p>
            <p>Located at: ${event['Located at Camp']}</p>
            <p>Description: ${event['Description']}</p>
            <p>Dates and Times: ${event['Date and Time'].join(', ')}</p>
            <a href="${event['Full Details']}" target="_blank">Full Details</a>
        `);
    }
}
