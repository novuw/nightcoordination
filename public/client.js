// client-side js
// run by the browser each time your view template is loaded
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('#demo').text("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    $('#demo').text("Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude); 
}
