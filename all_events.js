$(document).ready(function() {
    $.getJSON('all_events.json', function(data) {
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

        $('#search').autocomplete({
            source: function(request, response) {
                let results = fuse.search(request.term);
                let uniqueResults = [...new Set(results.map(item => `${item.item['Event Name']} (${item.item['Camp Name']} - ${item.item['Location']})`))];
                response(uniqueResults);
            },
            select: function(event, ui) {
                displayEventDetails(ui.item.value.split(" (")[0], data);
                $('html, body').animate({
                    scrollTop: $("#eventDetails").offset().top - 20
                }, 300);
                $(this).blur();
            }
        });

        $('#search').on('blur', function() {
            $(this).autocomplete('search', $(this).val());
        });

        function displayEventDetails(eventName, data) {
            const event = data.find(e => e['Event Name'] === eventName);
            if (event) {
                $('#eventDetails').css('display', 'block');
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
});
