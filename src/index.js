let apiKey = "cc994936908b08281fdf1a93f075f62a"

//FORMATTING
function updateTime(now) {  //updates the current time to todays weather

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
function formatWeekday(timestamp) { // formats a timestap to show a short weekday
let date = new Date(timestamp)
let days = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",]
  let day = days[date.getDay()]
  return day
}

let now = new Date();
updateTime(now)



//MAKE UPDATES
function showWeatherToday(response) { //makes the updates to todays weather
  let today = response.data.current
  celciusTemp = Math.round(today.temp)
  document.querySelector(".city").innerHTML = city
  document.querySelector("h2").innerHTML = today.weather[0].main;
  document.querySelector(".temp-today").innerHTML = `${Math.round(today.temp)}°`;
  let currentLow = Math.round(response.data.daily[0].temp.min);
  let currentHigh = Math.round(response.data.daily[0].temp.max);
  document.querySelector(".temp-high-low-today").innerHTML = `${currentLow}° / ${currentHigh}°`;
  document.querySelector("#feels").innerHTML = `${Math.round(today.feels_like)}°`;
  document.querySelector("#humidity").innerHTML = `${Math.round(today.humidity)}%`;
  document.querySelector("#wind") .innerHTML= `${Math.round(today.wind_speed)}`;
  document.querySelector("#image").setAttribute("src",`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`);
  document.querySelector("#image").setAttribute("alt",today.weather[0].description);
  
}

function showWeeklyForecast(response) { // updates the daily forecast elements
  let forecastElement = document.querySelector("#forecast")
  forecastElement.innerHTML = null
  let forecast = null
  for (let index = 1; index < 7; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `<div class="col-2 forecast-day">
    <p>${formatWeekday(forecast.dt * 1000)}</p>
    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="">
    <p>${Math.round(forecast.temp.min)}° / ${Math.round(forecast.temp.max)}°</p>
    </div>`
  }
}



// GET COORDINATES
function getCoords(response) { // get coordinaties from search input
  let lat = response.data.coord.lat
  let lon = response.data.coord.lon
  updateLocationTemp(lat, lon)
}
function extractCoords(position) { //get coordinates from current position
  lat = position.coords.latitude
  lon = position.coords.longitude
updateLocationTemp(lat, lon)
}
function getCity(response) {
  city = response.data.name
  return city
}


//API REQUESTS
function updateLocationTemp(latitude, longitude) {  // takes current position and searches for it in API
  let lat = latitude
  let lon = longitude
  apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
  axios.get(apiURL).then(getCity)
  apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=${unit}`
  axios.get(apiURL).then(showWeatherToday)
  axios.get(apiURL).then(showWeeklyForecast)
}

function search(city) { // searches for a city in the weather API 
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiURL).then(getCoords)
}

//HANDLE BUTTONS
function getSeachTerm(click) { // gets search input
  click.preventDefault();
  let cityInput = (document.querySelector("#city-input")).value;
  search(cityInput)
}
function getPosition(click) { // gets current position
  click.preventDefault();
  navigator.geolocation.getCurrentPosition(extractCoords)
}



//CONVERSION

function showCelcius(click) { //turns current temp into celcius
  click.preventDefault()
  celcius.classList.add("active")
  fahrenheit.classList.remove("active")
  unit = "metric"
  let windUnit =document.querySelector("#wind-units")
  windUnit.innerHTML = "m/s"
  search(city)
}

function showFahrenheit(click) { // turns current temp into fahrenheit
  click.preventDefault()
  celcius.classList.remove("active")
  fahrenheit.classList.add("active")
  unit = "imperial"
  let windUnit =document.querySelector("#wind-units")
  windUnit.innerHTML = "mph"
  search(city)
}




//EVENT LISTENERS
let city = null
let celciusTemp = null
let unit = "metric"
let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", showCelcius);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheit);

let searchButton = document.querySelector("form");
searchButton.addEventListener("submit", getSeachTerm);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getPosition);



search("london")
