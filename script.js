let map, marker, engMarker;
let userLat = 0;
let userLng = 0;

window.onload = function () {
  
  // Mouse move will constantly update the mouse area due to there being no default cursor shown
  document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor");
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  
  // Mouse down will generate the clicked png 
  document.addEventListener("mousedown", () => {
    const cursor = document.getElementById("custom-cursor");
    cursor.style.backgroundImage = 'url("images/astronaut-clicked.png")';
  });
  
  // Always makes the mouse stay as astronaut
  document.addEventListener("mouseup", () => {
    const cursor = document.getElementById("custom-cursor");
    cursor.style.backgroundImage = 'url("images/astronaut.png")';
  });

  // watchPosition constantly updates the user's location so we use this function
  navigator.geolocation.watchPosition(
    function (position) {
      // Variables for user position
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;

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
      // enableHighAccuracy will update the user's location frequently once allowed 
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
      const building = this.dataset.pic;
      const planet = this.dataset.planet;
      const lat = parseFloat(this.dataset.lat);
      const lng = parseFloat(this.dataset.lng);
      console.log("User:", userLat, userLng);
      console.log("Building:", lat, lng);

      const distance = getDistanceInMiles(userLat, userLng, lat, lng);
      console.log(`${distance.toFixed(2)} miles`);

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
          .bindPopup(
            `
            <div style="text-align:center;">
              <h3>${name} 📍</h3>
              <img src="${popupImageUrl}" style="width:150px; height:auto; margin: 10px 0;" />
              <p>This is the ${name}. Look here for more!</p>
              <p><strong>${distance.toFixed(2)} miles away</strong></p>
            </div>
          `
          )
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
  chiikawa = document.querySelector(".openChiikawa");
  console.log(openScreen);
  console.log(chiikawa);
  openScreen.style.opacity = 0;

  // console.log to check
  console.log("this works");

  // Add fade-out class to start transition
  openScreen.classList.add("fade-out");
  chiikawa.classList.add("slide-out-blurred-top");

  // After the transition ends, remove it completely to allow interaction with main page
  setTimeout(() => {
    openScreen.remove();
  }, 2800); // Roughly our CSS transition duration
}

// Haversine Formula 
function getDistanceInMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Radius of Earth in miles
  const toRad = angle => angle * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in miles
}