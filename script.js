let map, marker, engMarker;


window.onload = function () {
<<<<<<< HEAD
  let map, marker;
=======
  navigator.geolocation.watchPosition(
    function (position) {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
>>>>>>> 3faae17 (Added images)

      // Initialize map only once
      if (!map) {
        map = L.map("map").setView([userLat, userLng], 20);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        const customIcon = L.icon({
          iconUrl: "images/marker-icon.png",
          iconSize: [22, 38],
          iconAnchor: [19, 38],
          popupAnchor: [-7, -37],
        });

        marker = L.marker([userLat, userLng], { icon: customIcon })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();

        // ✅ Setup checkbox logic once the map is ready
        checkBox();
      } else {
        marker.setLatLng([userLat, userLng]);
        map.setView([userLat, userLng]);
      }
<<<<<<< HEAD
=======
    },
    null,
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
>>>>>>> 3faae17 (Added images)
  );
};

function checkBox() {
  const engCheck = document.getElementById("eng-check");
  engCheck.addEventListener("change", function () {
    const isChecked = this.checked;
    const lat = 33.882358;
    const lng = -117.882983;
    const engineeringIcon = L.icon({
        iconUrl: "images/red.png",
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [-4, -37],
      });

<<<<<<< HEAD
}
=======
    if (isChecked) {
      engMarker = L.marker([lat, lng], {icon: engineeringIcon})
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
>>>>>>> 3faae17 (Added images)
