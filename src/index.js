
let apiKey = "cc994936908b08281fdf1a93f075f62a"


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

let now = new Date();
updateTime(now)


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

function makeUpdates(response) { //makes the updates to todays weather
  celciusTemp = Math.round(response.data.main.temp)
  document.querySelector(".city").innerHTML = response.data.name;
  document.querySelector("h2").innerHTML = response.data.weather[0].main;
  document.querySelector(".temp-today").innerHTML = `${Math.round(response.data.main.temp)}°`;
  let currentLow = Math.round(response.data.main.temp_min);
  let currentHigh = Math.round(response.data.main.temp_max);
  document.querySelector(".temp-high-low-today").innerHTML = `${currentLow}° / ${currentHigh}°`;
  document.querySelector("#feels").innerHTML = `${Math.round(response.data.main.feels_like)}°`;
  document.querySelector("#humidity").innerHTML = `${Math.round(response.data.main.humidity)}%`;
  document.querySelector("#wind") .innerHTML= `${Math.round(response.data.wind.speed)} m/s`;
  document.querySelector("#image").setAttribute("src",`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#image").setAttribute("alt",response.data.weather[0].description);
  
}

function updateSearchTemp(event) { // takes the input from the search bar
  event.preventDefault();
  let cityInput = (document.querySelector("#city-input")).value;
  search(cityInput)
}

function search(city) { // searches for a city in the API
  let apiStart ="https://api.openweathermap.org/data/2.5/weather";
  let unit = "metric";
  let apiURL = `${apiStart}?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiURL).then(makeUpdates)
}

function showWeeklyForecast(response) { // updates the daily forecast elements
  let forecastElement = document.querySelector("#forecast")
  forecastElement.innerHTML = null
  let forecast = null
  console.log(response)
  for (let index = 0; index < 6; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `<div class="col-2 forecast-day">
    <p>${formatWeekday(forecast.dt * 1000)}</p>
    <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="">
    <p>${Math.round(forecast.temp.min)}° / ${Math.round(forecast.temp.max)}°</p>
    </div>`
  }
}

function updateLocationTemp(position) {  // takes current position and searches for it in API
  console.log(position)
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiStart ="https://api.openweathermap.org/data/2.5/weather";
  let unit = "metric";
  let apiURL = `${apiStart}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiURL).then(makeUpdates)
  console.log(lat, lon)
  apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`
  console.log(apiURL)
  axios.get(apiURL).then(showWeeklyForecast)
}

function getPosition(event) { // gets current position as coors
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(updateLocationTemp)
}

function showCelcius(event) { //turns current temp into celcius
  event.preventDefault()
  celcius.classList.add("active")
  fahrenheit.classList.remove("active")
  let tempElement = document.querySelector(".temp-today");
  tempElement.innerHTML = `${celciusTemp}°`
}

function showFahrenheit(event) { // turns current temp into fahrenheit
  event.preventDefault()
  celcius.classList.remove("active")
  fahrenheit.classList.add("active")
  let tempElement = document.querySelector(".temp-today");
  let fahrenheitTemp = connvertToFahrenheit(celciusTemp)
  tempElement.innerHTML = `${Math.round(fahrenheitTemp)}°`
}

function connvertToFahrenheit(celciusTemp) { // converts a number from celcius to fahrenheit
  let fahrenheitTemp = (celciusTemp*9)/5+32;
  return fahrenheitTemp
}

let celciusTemp = null
let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", showCelcius);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheit);

let searchButton = document.querySelector("form");
searchButton.addEventListener("submit", updateSearchTemp);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getPosition);



search("london")
