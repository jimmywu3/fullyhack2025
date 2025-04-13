let map, marker, engMarker;

// On load will begin to load the map based on user location
// window.onload = function () {
//     // 1. Cover screen setup
//     const startBtn = document.getElementById("startBtn");
//     const openScreen = document.getElementById("openScreen");
//     const mainContent = document.getElementById("mainContent");

//     startBtn.addEventListener("click", function () {
//       openScreen.style.transition = "opacity 1s ease";
//       openScreen.style.opacity = 0;

//       setTimeout(() => {
//         openScreen.style.display = "none";
//         mainContent.style.display = "block";
//       }, 1000); // Match transition duration
//     });

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
          iconUrl: "images/astronaut_icon.png",
          iconSize: [40, 50],
          iconAnchor: [19, 38],
          popupAnchor: [3, -39],
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
        .bindPopup(`
          <div style="text-align:center;">
            <h3>Engineering and Computer Science 📍</h3>
            <img src="images/engineering-building.jpg" style="width:150px; height:auto; margin-bottom: 10px; margin-top: 10px;"/>
            <p>This is the Engineering Building. Look here for more!</p>
          </div>
          `)
        .openPopup();
    } else {
      if (engMarker) {
        map.removeLayer(engMarker);
        engMarker = null;
      }
    }
  });
}
