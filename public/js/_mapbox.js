const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);

mapboxgl.accessToken =
    'pk.eyJ1Ijoic2F2YW5uYWg3ODUiLCJhIjoiY2ttNXc4NHhyMGlmajJwcXJwYmRucDMyNiJ9.C66BpOBO0KmbPCk25XHGFQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
});
