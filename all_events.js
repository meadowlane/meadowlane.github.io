$(document).ready(function() {
    // Load JSON file
    $.getJSON('all_events.json', function(data) {

        // Setup Fuse.js for fuzzy searching
        const options = {
            keys: [
                { name: 'Event Name', weight: 3 },
                { name: 'Camp Name', weight: 2},
                { name: 'Location', weight: 1},
                { name: 'Description', weight: 1 },
                { name: 'Date and Time', weight: 1}
            ],
            threshold: 0.25,
            includeScore: true
        };
        const fuse = new Fuse(data, options);

        // Setup autocomplete with Fuse.js
        $('#search').autocomplete({
            source: function(request, response) {
                let results = fuse.search(request.term);
                let uniqueResults = [...new Set(results.map(item => `${item.item['Event Name']} (${item.item['Camp Name']} - ${item.item['Location']})`))];
                response(uniqueResults);
                delay: 10000
            },
            select: function(event, ui) {
                displayEventDetails(ui.item.value.split(" (")[0], data);  // Extracting only the Event Name from the string

                $('html, body').animate({
                    scrollTop: $("#eventDetails").offset().top - 20
                }, 300);
            }
        });
    });


    function displayEventDetails(eventName, data) {
        const event = data.find(e => e['Event Name'] === eventName);
        if (event) {
            $('#eventDetails').css('display', 'block');  // Display the details container
            $('#eventDetails').html(`
                <h3>${event['Event Name']}</h3>
                <h5>Location: ${event['Location']}</h5>
                <h5>Camp Name: ${event['Camp Name']}</h5>
                </br>
                <p>Type: ${event['Type']}</p>
                <p>Description: ${event['Description']}</p>
                <p>Dates and Times: <br>${event['Date and Time'].join('<br>')}</p>
                </br>
                <a href="${event['Full Details']}" target="_blank">Full Details</a>
            `);
        }
    }
});
