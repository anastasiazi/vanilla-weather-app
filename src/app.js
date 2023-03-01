const apiKey = "4904e8e60b2d25ac4bf6450fbbt3bo36";
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let temperatureElement = document.querySelector("#temperature");
let feelsLikeDegreesElement = document.querySelector("#feels-like-degrees");
let feelsLikeUnitsElement = document.querySelector("#feels-like-units");
let cityElement = document.querySelector("#city");
let descriptionElement = document.querySelector("#description");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let dateElement = document.querySelector("#date");
let iconElement = document.querySelector("#icon");
let forecastElement = document.querySelector("#forecast");

let formElement = document.querySelector("#search-form");
formElement.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let celsiusTemperature = null;
let feelsLikeTemperature = null;

function formatDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    let day = date.getDay();
    return `${DAYS[day]}  ${hours}:${minutes}`;
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();

    return DAYS[day].slice(0, 3);
}

function displayTemperature(response) {
    celsiusTemperature = response.data.temperature.current;
    feelsLikeTemperature = response.data.temperature.feels_like;
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
    feelsLikeDegreesElement.innerHTML = Math.round(feelsLikeTemperature);

    cityElement.innerHTML = response.data.city;
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = response.data.temperature.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed);
    dateElement.innerHTML = formatDate(response.data.time * 1000);
    iconElement.setAttribute(
        "src",
        `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`);
    iconElement.setAttribute(
        "alt",
        response.data.condition.description);

    getForecast(response.data.coordinates);
}

function getForecast(coordinates) {
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}`;
    axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
    let forecast = response.data.daily;

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function (forecastDay, index) {
        if (index < 6) {
            forecastHTML += `
              <div class="col-2">
                <div class="weather-forecast-day">${formatDay(forecastDay.time)}</div>
                <img src="${forecastDay.condition.icon_url}" alt="${forecastDay.condition.description}"
                     width="40"/>
                <div class="weather-forecast-temperatures">
                    <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temperature.maximum)}°</span>
                    <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temperature.minimum)}°</span>
                </div>
              </div>
        `;
        }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function search(city) {
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
    if (city) {
        axios(apiUrl).then(displayTemperature);
    }
}

function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
    event.preventDefault();

    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    let fahrenheitTemperature = Math.round((celsiusTemperature * 9 / 5) + 32);
    let fahrenheitFeelsLikeTemperature = Math.round((feelsLikeTemperature * 9 / 5) + 32);
    temperatureElement.innerHTML = fahrenheitTemperature.toString();
    feelsLikeDegreesElement.innerHTML = fahrenheitFeelsLikeTemperature.toString();
    feelsLikeUnitsElement.innerHTML = "°F";
}

function displayCelsiusTemperature(event) {
    event.preventDefault();

    fahrenheitLink.classList.remove("active");
    celsiusLink.classList.add("active");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
    feelsLikeDegreesElement.innerHTML = Math.round(feelsLikeTemperature);
    feelsLikeUnitsElement.innerHTML = "°C";
}

search("Kyiv");