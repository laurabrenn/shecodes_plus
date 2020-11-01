// challenge 1 add current date and time
function updateTime(now) { 

  let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let dateAbbreviation = "";
if (now.getDate() === 1) {
  dateAbbreviation = "st";
} else if (now.getDate() === 2) {
  dateAbbreviation = "nd";
} else if (now.getDate() === 3) {
  dateAbbreviation = "rd";
} else {
  dateAbbreviation = "th";
}

let currentDate = `${days[now.getDay()]} ${months[now.getMonth()]} ${
  now.getDate() + dateAbbreviation
},`;
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let currentTime = `${hours}:${minutes}`;

let date = document.querySelector(".date");
let time = document.querySelector(".time");

date.innerHTML = currentDate;
time.innerHTML = currentTime;
}

let now = new Date();
updateTime(now)

//update text and temps from location entered


function makeUpdates(response) {
  document.querySelector(".city").innerHTML = response.data.name;
  document.querySelector("h2").innerHTML = response.data.weather[0].main;
  document.querySelector(".temp-today").innerHTML = `${Math.round(response.data.main.temp)}°`;
  let currentLow = Math.round(response.data.main.temp_min);
  let currentHigh = Math.round(response.data.main.temp_max);
  document.querySelector(".temp-high-low-today").innerHTML = `${currentLow}° / ${currentHigh}°`;
  document.querySelector("#feels").innerHTML = `${Math.round(response.data.main.feels_like)}°`;
  document.querySelector("#humidity").innerHTML = `${Math.round(response.data.main.humidity)}%`;
  document.querySelector("#wind") .innerHTML= `${Math.round(response.data.wind.speed)} m/s`;
}

function updateInputTemp() { 
  
  let cityInput = (document.querySelector("#city-input")).value;
  search(cityInput)
}

function search(city) {
  let apiStart ="https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "cc994936908b08281fdf1a93f075f62a";
  let unit = "metric";
  let apiURL = `${apiStart}?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiURL).then(makeUpdates)
}

function updateLocationTemp(position) { 
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiStart ="https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "cc994936908b08281fdf1a93f075f62a";
  let unit = "metric";
  let apiURL = `${apiStart}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiURL).then(makeUpdates)
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(updateLocationTemp)
}


let searchButton = document.querySelector("form");
searchButton.addEventListener("submit", updateInputTemp);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getPosition);

search("london")
