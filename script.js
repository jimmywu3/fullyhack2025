window.onload = function () {
  let map, marker;

    navigator.geolocation.watchPosition(
      function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
  
        // If the map hasn't been created yet, create it
        if (!map) {
          map = L.map("map").setView([userLat, userLng], 20);
  
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(map);
  
          // Custom Marker Icon
          var customIcon = L.icon({
            iconUrl: "images/marker-icon.png",
            iconSize: [22, 38],
            iconAnchor: [19, 38],
            popupAnchor: [-7, -37],
          });
  
          // Create the marker once
          marker = L.marker([userLat, userLng], { icon: customIcon })
            .addTo(map)
            .bindPopup("You are here")
            .openPopup();
        } else {

          // Update marker position as user moves
          marker.setLatLng([userLat, userLng]);
          map.setView([userLat, userLng]);
        }
      },
  
      // Error handling
      function (error) {
        console.error("Location access denied or unavailable:", error.message);
        //alert("Please enable location services to view your current position on the map.");
      },
  
      // Optional settings
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
  );
};

function checkBox() {

}
