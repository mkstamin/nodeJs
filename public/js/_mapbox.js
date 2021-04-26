/* eslint-disable*/

export const displayMap = (locations)=>{
        
    mapboxgl.accessToken =
        'pk.eyJ1Ijoic2F2YW5uYWg3ODUiLCJhIjoiY2tud3NzbnVnMGpwMTJ3dGc2Zzc0cjNmZyJ9.mSqPE7jbR6l17mDDAtKrrw';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/savannah785/cknx1fvk428b617qvoiovcnqi',
        scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p> Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
}