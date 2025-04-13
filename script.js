let map, marker, engMarker;

// On load will begin to load the map based on user location
window.onload = function () {
  navigator.geolocation.watchPosition(
    function (position) {

      // Variables for user position
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      // Initialize map only once based on user location
      if (!map) {
        map = L.map("map").setView([userLat, userLng], 20);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Custom marker for user
        const customIcon = L.icon({
          iconUrl: "images/marker-icon.png",
          iconSize: [22, 38],
          iconAnchor: [19, 38],
          popupAnchor: [-7, -37],
        });

        // Apply marker to the map
        marker = L.marker([userLat, userLng], { icon: customIcon })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();

        // Setup checkbox logic once the map is ready
        checkBox();
      } else {
        marker.setLatLng([userLat, userLng]);
        map.setView([userLat, userLng]);
      }
    },
    null,
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );
};

function checkBox() {

  // ID "eng-check" tied to our checkbox for Engineering building as reference
  const engCheck = document.getElementById("eng-check");
  engCheck.addEventListener("change", function () {

    // 'this.checked' refers to engCheck returning if it is checked or not to isChecked variable
    const isChecked = this.checked;
    const lat = 33.882358;
    const lng = -117.882983;
    const engineeringIcon = L.icon({
      iconUrl: "images/red.png",
      iconSize: [30, 30],
      iconAnchor: [19, 38],
      popupAnchor: [-4, -37],
    });

    // If condition for marks on map when checkbox is checked
    if (isChecked) {
      engMarker = L.marker([lat, lng], { icon: engineeringIcon })
        .addTo(map)
        .bindPopup("Engineering and Computer Science 📍")
        .openPopup();
    } else {
      if (engMarker) {
        map.removeLayer(engMarker);
        engMarker = null;
      }
    }
  });
}
