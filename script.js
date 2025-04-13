let map, marker, engMarker;

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

// Empty object to place our markers in when we have multiple check boxes
const markers = {};

function checkBox() {

  // Select all with college-check class
  const checkboxes = document.querySelectorAll(".college-check");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {

      // Returns true if its checked or false if its not
      const isChecked = this.checked;

      // Assign variables to our data we assigned in html
      const name = this.dataset.name;
      const building = this.dataset.pic
      const planet = this.dataset.planet;
      const lat = parseFloat(this.dataset.lat);
      const lng = parseFloat(this.dataset.lng);

      // Fill in iconUrl with the given planet.png format and building.jpg format
      const iconUrl = `images/${planet}.png`;
      const popupImageUrl = `images/${building}.jpg`;

      // Preset icon dimensions 
      const icon = L.icon({
        iconUrl: iconUrl,
        iconSize: [30, 30],
        iconAnchor: [19, 38],
        popupAnchor: [-4, -37],
      });

      // We create a marker using the data provided for each section based on if it is checked
      if (isChecked) {
        const marker = L.marker([lat, lng], { icon: icon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align:center;">
              <h3>${name} 📍</h3>
              <img src="${popupImageUrl}" style="width:150px; height:auto; margin: 10px 0;" />
              <p>This is the ${name}. Look here for more!</p>
            </div>
          `)
          .openPopup();

        // Set our view to center
        map.setView([lat, lng], 18);
        // Store our marker object inside the markers object with our planet name
        markers[planet] = marker;

      } else {

        // Removes the marker from the object when the planet is unchecked
        if (markers[planet]) {
          map.removeLayer(markers[planet]);
          delete markers[planet];

        }
      }
    });
  });
}

// On load will begin to load the map based on user location
function opening() {

  // Opening is called
  openScreen = document.getElementById("openScreen");
  console.log(openScreen);
  openScreen.style.opacity = 0;

  // console.log to check
  console.log("this works");

  // Add fade-out class to start transition
  openScreen.classList.add("fade-out");

  // After the transition ends, remove it completely to allow interaction with main page
  setTimeout(() => {
    openScreen.remove();
  }, 2800); // Roughly our CSS transition duration
}

