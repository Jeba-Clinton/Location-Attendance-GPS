

// document.getElementById("attendanceForm").addEventListener("submit", function(e) {
//     e.preventDefault();
//     getLocation();
// });

// async function getLocation() {

//     const empId = document.getElementById("empId").value;
//     const name = document.getElementById("name").value;
//     const status = document.getElementById("status").value;

//     if (!empId || !name || !status) {
//         alert("Please fill all fields");
//         return;
//     }

//     if (!navigator.geolocation) {
//         alert("Geolocation not supported");
//         return;
//     }

//     navigator.geolocation.getCurrentPosition(async function(position) {

//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;

//         try {

//             // PUT YOUR GOOGLE API KEY HERE
//             const apiKey = "AIzaSyB1gNkyUqbL9rVLUyAys45xKKaPcqwUfhM";

//             const response = await fetch(
//                 `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
//             );

//             const data = await response.json();
//             console.log(data);

//             if (data.status === "OK") {

//                 const address = data.results[0].formatted_address;

//                 document.getElementById("locationDisplay").innerText =
//                     "Your Location: " + address;

//             } else {
//                 document.getElementById("locationDisplay").innerText =
//                     "Location not found";
//             }

//         } catch (error) {
//             console.error(error);
//             alert("Error getting location");
//         }

//     }, function() {
//         alert("Location permission denied");
//     });
// }




// free

// document.getElementById("attendanceForm").addEventListener("submit", function(e) {
//     e.preventDefault();
//     getLocation();
// });

// async function getLocation() {

//     const empId = document.getElementById("empId").value;
//     const name = document.getElementById("name").value;
//     const status = document.getElementById("status").value;

//     if (!empId || !name || !status) {
//         alert("Please fill all fields");
//         return;
//     }

//     if (!navigator.geolocation) {
//         alert("Geolocation not supported");
//         return;
//     }

//     navigator.geolocation.getCurrentPosition(async function(position) {

//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;

//         console.log("Accuracy :"+ position.coords.accuracy);

//         try {

//             // FREE OpenStreetMap Reverse Geocoding
//             const response = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//             );

//             const data = await response.json();
//             console.log(data);

//             if (data && data.display_name) {

//                 const address = data.display_name;

//                 document.getElementById("locationDisplay").innerText =
//                     "Your Location: " + address;

//             } else {
//                 document.getElementById("locationDisplay").innerText =
//                     "Location not found";
//             }

//         } catch (error) {
//             console.error(error);
//             alert("Error getting location");
//         }

//     }, function() {
//         alert("Location permission denied");
//     });
// }
document.getElementById("attendanceForm").addEventListener("submit", function(e) {
    e.preventDefault();
    getLocation();
});

async function getLocation() {

    const empId = document.getElementById("empId").value.trim();
    const name = document.getElementById("name").value.trim();
    const status = document.getElementById("status").value;
    const locationDisplay = document.getElementById("locationDisplay");

    // ✅ Validate inputs
    if (!empId || !name || !status) {
        alert("Please fill all fields");
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation not supported by this browser");
        return;
    }

    locationDisplay.innerText = "Getting accurate location... ⏳";

    const options = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            console.log("Accuracy:", accuracy);

            // 🔥 Reject if accuracy too low
            if (accuracy > 100) {
                locationDisplay.innerText =
                    `Low GPS Accuracy (${Math.round(accuracy)} meters).
                     Please move to open area and try again.`;
                return;
            }

            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=19&addressdetails=1`,
                    {
                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Network response failed");
                }

                const data = await response.json();

                if (data && data.address) {

                    const a = data.address;

                    // 🔥 Only Village, City, State
                    const village =
                        a.village ||
                        a.suburb ||
                        a.neighbourhood ||
                        "";

                    const city =
                        a.city ||
                        a.town ||
                        a.municipality ||
                        a.county ||
                        "";

                    const state = a.state || "";

                    const cleanAddress = `${village}, ${city}, ${state}`;

                    locationDisplay.innerHTML = `
                        ✅ Attendance Marked<br><br>
                        👤 Name: ${name}<br>
                        🆔 Employee ID: ${empId}<br>
                        📍 Location: ${cleanAddress}<br>
                        🎯 Accuracy: ${Math.round(accuracy)} meters
                    `;

                } else {
                    locationDisplay.innerText = "Location not found";
                }

            } catch (error) {
                console.error(error);
                locationDisplay.innerText =
                    "Error fetching address. Check internet connection.";
            }

        },

        function(error) {

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    locationDisplay.innerText = "Location permission denied.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    locationDisplay.innerText = "Location unavailable.";
                    break;
                case error.TIMEOUT:
                    locationDisplay.innerText = "Location request timed out.";
                    break;
                default:
                    locationDisplay.innerText = "Unknown error occurred.";
            }

        },

        options
    );
}