const BASE_URL = 'https://api.weatherapi.com/v1';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const searchForm = document.querySelector('.js-search-form');
const forecastDaysContainer = document.querySelector(
  '.js-forecast-days-container'
);
const cityForecast = document.querySelector('.js-city-forecast');
const weatherToday = document.querySelector('.js-weather-today');

function templateMarkupForecast(icon, text, date, temperature, humidity) {
  return `<img src="${icon}" alt="${text}" />
      <p>${text}</p>
      <h3>${date}</h3>
      <h4>Average temperature</h4>
      <p>${temperature}</p>
      <h4>Average humidity</h4>
      <p>${humidity}</p>
      <button type="button">More information</button>`;
}

function createMarkupCurrentCity(
  { name },
  { condition: { icon, text }, last_updated, temp_c, humidity }
) {
  return `<h2>${name}</h2>
  <button type="button">Add to favorites</button>
  ${templateMarkupForecast(icon, text, last_updated, temp_c, humidity)}
  `;
}

function createMarkupCurrentCityForecast(data) {
  return data
    .map(
      ({
        date,
        day: {
          avgtemp_c,
          condition: { text, icon },
          avghumidity,
        },
      }) => {
        return `<li>${templateMarkupForecast(icon, text, date, avgtemp_c, avghumidity)}</li>`;
      }
    )
    .slice(1)
    .join('');
}

function createMarkupDays() {
  let markup = '';
  for (let i = 1; i <= 14; i += 1) {
    markup += `<option data-id="${i}">${i}</option>`;
  }
  forecastDaysContainer.innerHTML = markup;
}

createMarkupDays();

function handleSearch(event) {
  event.preventDefault();
  const enteredCity = event.currentTarget.elements.cityName.value
    .trim()
    .toLowerCase();
  const enteredDays = event.currentTarget.elements.forecastDays.value.trim();
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
    weatherToday.innerHTML = createMarkupCurrentCity(
      data.location,
      data.current
    );
    cityForecast.innerHTML = createMarkupCurrentCityForecast(
      data.forecast.forecastday
    );
  } catch (err) {
    console.log(err.message);
  }
}

searchForm.addEventListener('submit', handleSearch);
