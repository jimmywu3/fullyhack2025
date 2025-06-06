let map, marker, engMarker;
let userLat = 0;
let userLng = 0;

window.onload = function () {
  // Mouse move will constantly update the location of the astronaut cursor
  document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor");
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Mouse down (when our mouse is clicked) will produce the clicked png
  document.addEventListener("mousedown", () => {
    const cursor = document.getElementById("custom-cursor");
    cursor.style.backgroundImage = 'url("images/astronaut-clicked.png")';
  });

  // Mouse up (when our mouse is released) will reset back to our custom cursor
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

        // Custom marker for user marker
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
  // Select all with college-check class, querySelectorAll stores the elements with ".college-check"
  // Almost like an array but is called a NodeList
  const checkboxes = document.querySelectorAll(".college-check");

  // forEach goes through each node like a loop and checks if the checkboxes been checked
  // And proceeds with assigning variables based on pre-data assignment from the HTML
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

      

      // Our function getDistanceInMiles is located at the bottom and
      // calculates the straight line distance from the user
      const distance = getDistanceInMiles(userLat, userLng, lat, lng);
      const header = document.getElementById("distance-header");
      header.textContent = `Distance till nearest water fountain: ${distance.toFixed(
        2
      )} miles`;

      // Console log to make sure it is reached correctly
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

      // checkedBoxes is a filter to loop through an array-like object
      const checkedBoxes = [...checkboxes].filter(cb => cb.checked);

      // If the array is more than 0 then we will consistently update the minimum distance when a
      // checkbox is marked
      if (checkedBoxes.length > 0) {
        
        // Initialize minDistance to infinity 
        let minDistance = Infinity;
  
        checkedBoxes.forEach(cb => {
          const lat = parseFloat(cb.dataset.lat);
          const lng = parseFloat(cb.dataset.lng);
          const distance = getDistanceInMiles(userLat, userLng, lat, lng);
  
          // Constantly update the minDistance after looping through each checkedBox object
          if (distance < minDistance) {
            minDistance = distance;
          }
        });
  
        header.textContent = `Distance till nearest water fountain: ${minDistance.toFixed(2)} miles`;
      } 

      // Else case if there is nothing checkmarked we will default it to no distance shown
      else
      {
        header.textContent = `Distance till nearest water fountain:`;
      }
    });
  });
}

// On load will begin with the opening screen to start the website
function opening() {
  // Opening is called
  openScreen = document.getElementById("openScreen");
  chiikawa = document.querySelector(".openChiikawa");
  starL = document.querySelector(".starL");
  starR = document.querySelector(".starR");
  console.log(openScreen);
  console.log(chiikawa);
  openScreen.style.opacity = 0;

  // console.log to check
  console.log("this works");

  // Add fade-out class to start transition
  openScreen.classList.add("fade-out");
  chiikawa.classList.add("slide-out-blurred-top");
  starL.classList.add("roll-out-left");
  starR.classList.add("roll-out-right");

  // After the transition ends, remove it completely to allow interaction with main page
  setTimeout(() => {
    openScreen.remove();
  }, 2800); // Roughly our CSS transition duration
}

// Haversine Formula
function getDistanceInMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Radius of Earth in miles
  const toRad = (angle) => angle * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in miles
}
