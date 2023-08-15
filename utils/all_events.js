$(document).ready(function() {
    $.getJSON('data/all_events.json', function(data) {
        const options = {
            keys: [
                { name: 'Event Name', weight: 3 },
                { name: 'Camp Name', weight: 2},
                { name: 'Location', weight: 1},
                { name: 'Description', weight: 1 },
                { name: 'Date and Time', weight: 1},
                { name: 'Type', weight: 1}
            ],
            threshold: 0.25,
            includeScore: true
        };
        const fuse = new Fuse(data, options);

        $('#search').autocomplete({
            source: function(request, response) {
                let results = fuse.search(request.term);
                let uniqueResults = [...new Set(results.map(item => {
                    return {
                        label: `${item.item['Event Name']} (${item.item['Camp Name']} - ${item.item['Location']})`,
                        value: item.item['Event Name']
                    }
                }))];
                response(uniqueResults);
            },
            select: function(event, ui) {
                displayEventDetails(ui.item.value, data);
                $('html, body').animate({
                    scrollTop: $("#eventDetails").offset().top - 20
                }, 300);
                // Blur right away without setTimeout
                $(this).blur();
            }
        });

        $('#search').on('blur', function() {
            $(this).autocomplete('search', $(this).val());
        });

        $('#search').on('input', function() {
            if ($(this).val()) {
                $('#clearSearch').show();
            } else {
                $('#clearSearch').hide();
            }
        });

        $('#clearSearch').click(function() {
            $('#search').val('').trigger('input').focus();
        });

        function displayEventDetails(eventName, data) {
            const event = data.find(e => e['Event Name'] === eventName);
            if (event) {
                $('#eventDetails').html(`
                    <div class="card-body">
                        <h5>Event: ${event['Event Name']}</h5>
                        <h5>Camp: ${event['Camp Name']}</h5>
                        <h5>Location: ${event['Location']}</h5>
                        <br>
                        <h6>Dates and Times:</h6>
                        <p>${event['Date and Time'].join('<br>')}</p>
                        <h6>Type:</h6>
                        <p>${event['Type']}</p>
                        <h6>Located at Camp:</h6>
                        <p>${event["Located at Camp"]}</p>
                        <h6>Description:</h6>
                        <p>${event['Description']}</p>
                        <br>
                        <a href="${event['Full Details']}" target="_blank">Full Details</a>
                    </div>`);
            }
        }
    });
});
