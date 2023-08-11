$(document).ready(function() {
    // Load JSON file
    $.getJSON('all_events.json', function(data) {

        // Setup Fuse.js for fuzzy searching
        const options = {
            keys: ['Event Name'],
            threshold: 0.4,  // Adjust for desired strictness (0 is strict, 1 is loose)
            includeScore: true  // Useful for filtering results later if needed
        };
        const fuse = new Fuse(data, options);

        // Setup autocomplete with Fuse.js
        $('#search').autocomplete({
            source: function(request, response) {
                let results = fuse.search(request.term);
                // Convert the mapped results into a set to ensure uniqueness
                let uniqueResults = [...new Set(results.map(item => item.item['Event Name']))];
                response(uniqueResults);
            },
            select: function(event, ui) {
                displayEventDetails(ui.item.value, data);

                // Scroll to event details
                $('html, body').animate({
                    scrollTop: $("#eventDetails").offset().top - 20  // The '-20' provides a little margin
                }, 300);
            },
            open: function() {
                const dropdownTop = $(this).offset().top;
                const dropdownHeight = $(this).autocomplete("widget").height();
                const windowHeight = $(window).height();
                const scrollTo = dropdownTop + dropdownHeight/2 - windowHeight/2;

                $('html, body').animate({
                    scrollTop: scrollTo
                }, 300);
            }

        });
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
            <p>Dates and Times: ${event['Date and Time'].join(', ')}</p>
            </br>
            <a href="${event['Full Details']}" target="_blank">Full Details</a>
        `);
    }
}
