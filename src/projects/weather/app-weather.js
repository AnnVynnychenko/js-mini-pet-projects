const BASE_URL = 'https://api.weatherapi.com/v1';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const searchForm = document.querySelector('.js-search-form');
const forecastDaysContainer = document.querySelector(
  '.js-forecast-days-container'
);

function createMarkupForecastDays() {
  let markup = '';
  for (let i = 1; i <= 14; i += 1) {
    markup += `<option data-id="${i}">${i}</option>`;
  }
  forecastDaysContainer.innerHTML = markup;
}

createMarkupForecastDays();

function handleSubmit(event) {
  event.preventDefault();
  const enteredCity = event.target.elements.cityName.value.trim().toLowerCase();
  const enteredDays = event.target.elements.forecastDays.value.trim();
  getWeather(enteredCity, enteredDays);
}

async function getWeather(enteredCity, enteredDays) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${enteredCity}&days=${enteredDays}`
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err.message);
  }
}

searchForm.addEventListener('submit', handleSubmit);
