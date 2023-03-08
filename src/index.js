// Display the current date and time
function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[dayIndex];
  return `${day}, ${hours}:${minutes}`;
}

let dateElement = document.getElementById("date");
let now = new Date();
let dateString = formatDate(now);
dateElement.textContent = dateString;

//Search engine displaying current temperature, country & city
function showTemperature(response) {
  document.querySelector(
    "#city"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  let celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature-now").innerHTML = Math.round(
    celsiusTemperature
  );

  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;

  //Description
  let description = response.data.weather[0].description;
  let words = description.split(" ");
  let capitalizedWords = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  let capitalizedDescription = capitalizedWords.join(" ");
  let descript = document.querySelector("#description");
  descript.innerHTML = capitalizedDescription;

  // wind
  let windSpeed = Math.round(response.data.wind.speed);
  let wind = document.querySelector("#wind");
  wind.innerHTML = `${windSpeed} km/h`;

  // Convert temperature to Fahrenheit
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  document.querySelector("#temperature-now").innerHTML = Math.round(
    fahrenheitTemperature
  );

  let countryCode = response.data.sys.country;
  let countryApiUrl = `https://restcountries.com/v2/alpha/${countryCode}`;
  axios.get(countryApiUrl).then(function (countryResponse) {
    let countryName = countryResponse.data.name;
    document.querySelector(
      "#city"
    ).innerHTML = `${response.data.name}, ${countryName}`;
  });
}

function searchCity(city) {
  let apiKey = "b95f179627c8dd37f41e1be6e3250e19";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "b95f179627c8dd37f41e1be6e3250e19";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let form = document.querySelector("#form-control");
form.addEventListener("submit", handleSubmit);

let currentLocationBtn = document.querySelector("#current-location-btn");
currentLocationBtn.addEventListener("click", getCurrentLocation);
