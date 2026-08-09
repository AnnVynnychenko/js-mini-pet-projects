const BASE_URL = 'http://api.weatherapi.com/v1/';
const API_KEY = '478ea07d54aa4674858141258260908&q';

async function getWeather() {
  fetch(`${BASE_URL}forecast.json?key=${API_KEY}=Paris&days=2`)
    .then(response => response.json())
    .then(weather => console.log(weather))
    .catch(err => console.log(err));
}

getWeather();
