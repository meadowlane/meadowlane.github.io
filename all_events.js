$(document).ready(function() {
    let initialViewportHeight = window.innerHeight;
    let isKeyboardVisible = false;

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
            },
            select: function(event, ui) {
                displayEventDetails(ui.item.value.split(" (")[0], data);  // Extracting only the Event Name from the string

                $('html, body').animate({
                    scrollTop: $("#eventDetails").offset().top - 20
                }, 300);
            },
            open: function() {
                if ($('#eventDetails').is(':visible')) {
                    return; // Skip adjusting the viewport if event details are being displayed
                }

                const dropdownTop = $(this).offset().top;
                const dropdownHeight = $(this).autocomplete("widget").height();
                const visibleHeight = window.innerHeight; // Current viewport height
                const keyboardHeight = initialViewportHeight - visibleHeight; // Approximate height of OSK
                const scrollTo = dropdownTop + dropdownHeight/2 - (visibleHeight/2) + keyboardHeight/2;

                $('html, body').animate({
                    scrollTop: scrollTo
                }, 300);
            },
            close: function(event) {
                if ($(event.target).is('#search')) {
                    return false; // Prevent closing of autocomplete when input loses focus.
                }
            }
        });

        $('#search').on('focus', function() {
            isKeyboardVisible = true;
        });

        // Listen for window resize events
        $(window).resize(function() {
            if (isKeyboardVisible && window.innerHeight > initialViewportHeight) {
                isKeyboardVisible = false;
                $('#search').blur();
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
