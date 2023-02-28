function displayTemperature(response) {
    console.log(response);
    let temperatureElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    temperatureElement.innerHTML = Math.round(response.data.temperature.current);
    cityElement.innerHTML = response.data.city;
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = response.data.temperature.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed);
}

const apiKey = "4904e8e60b2d25ac4bf6450fbbt3bo36";
let city = "Charlotte";
const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

axios(apiUrl).then(displayTemperature);