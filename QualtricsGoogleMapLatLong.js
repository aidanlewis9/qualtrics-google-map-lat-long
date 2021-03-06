/*
 * Qualtrics Google Map Lat/Long Collector
 *
 * Written by George Walker <george@georgewwalker.com>
 *
 * Last changed March 6, 2017.
 *
 * This javascript allows a Qualtrics user to collect a lat/long from a
 * Google Map in a survey. To use it, create a new "Text Entry" question,
 * then add this JavaScript to the question. You can set variables below.
 * These include the lattitude and longitude to center the map at, the
 * zoom level of the map, and the text to display when hovering over the
 * map's pin. It also includes the width and height of the map.
 */

// Enter your Google Map API key in this variable:
var googleMapAPIKey = "Your Key";


// Load the Google Maps API if it is not already loaded.
try {
    if (typeof googleMapJS == 'undefined') {
        var googleMapJS;
        if (googleMapJS == null) {
            googleMapJS = document.createElement('script');
            if (googleMapAPIKey == "Your Key" || googleMapAPIKey == null) {
                googleMapJS.src = 'https://maps.googleapis.com/maps/api/js';
            } else {
                googleMapJS.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapAPIKey;
            }
            document.head.appendChild(googleMapJS);
        }
    } else {
        console.log("Map already loaded.");
    }
} catch (err) {
    console.log("Unable to load Google Maps API. Details: " + err);
    alert("Unable to load Google Maps API.");
}

Qualtrics.SurveyEngine.addOnload(function() {
    // Variables:
    var mapCenterLat = 39.1836;
    var mapCenterLng = -96.5717;
    var mapZoom = 16; // See https://developers.google.com/maps/documentation/javascript/tutorial#zoom-levels for help.
    var pinTitle = "Move pin to correct location"; // This is displayed when hovering over the pin on the map.


    var mapWidth = "100%";
    var mapHeight = "300px";


    // Get the data entry box and store it in a variable
    var dataBox = document.getElementById("QR~" + this.questionId);

    // Get the question container and store it in a variable.
    var questionContainer = this.getQuestionContainer();

    try {
        // Create a map object and append it to the question container.
        var mapObject = document.createElement('div');
        mapObject.setAttribute("id", this.questionId + "-map");
        mapObject.style.width = mapWidth;
        mapObject.style.height = mapHeight;
        questionContainer.appendChild(mapObject);
        var mapID = this.questionId + "-map";
    } catch (err) {
        console.log("Unable to create map object. Details: " + err);
        alert("An error occurred creating the map.");
    }

    // Hide the data box
    try {
        dataBox.style.display = 'none';
    } catch (err) {
        console.log("Unable to hide data box.");
    }

    // This function calls itself once per second until the Google Maps API is loaded, then it displays the map.
    function displayMap() {
        try {
            var map = new google.maps.Map(document.getElementById(mapID), {
                center: {
                    lat: mapCenterLat,
                    lng: mapCenterLng
                },
                zoom: mapZoom
            });

            // Create a new marker in the center of the map.
            var marker = new google.maps.Marker({
                draggable: true,
                position: {
                    lat: mapCenterLat,
                    lng: mapCenterLng
                },
                map: map,
                title: pinTitle
            });

            // When the pin is clicked, store the lat/lng
            google.maps.event.addListener(marker, 'click', function(event) {
                dataBox.value = '{"lat": "' + this.getPosition().lat() + '", "long": "' + this.getPosition().lng() + '"}';
            });

            // When the pin is dragged, store the lat/lng where it ends
            google.maps.event.addListener(marker, 'dragend', function(event) {
                dataBox.value = '{"lat": "' + this.getPosition().lat() + '", "long": "' + this.getPosition().lng() + '"}';
            });
        } catch (err) {
            setTimeout(displayMap, 1000);
        }
    }
    displayMap();

});
