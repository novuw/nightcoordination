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
    console.log(position.coords.latitude + "/" + position.coords.latitude);
    $('#lat').val(position.coords.latitude);
    $('#long').val(position.coords.longitude);
}
getLocation();
