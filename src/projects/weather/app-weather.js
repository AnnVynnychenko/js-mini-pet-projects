const BASE_URL = 'https://api.weatherapi.com/v1';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

let currentWeatherData = {};

const searchForm = document.querySelector('.js-search-form');
const forecastDaysContainer = document.querySelector(
  '.js-forecast-days-container'
);
const cityForecastContainer = document.querySelector(
  '.js-city-forecast-container'
);
const weatherTodayContainer = document.querySelector(
  '.js-weather-today-container'
);
const weatherForecastSection = document.querySelector(
  '.js-weather-forecast-section'
);
const modalBackdrop = document.querySelector('.js-modal-backdrop');
const modalContent = document.querySelector('.js-modal-content');

function templateMarkupForecast(
  icon,
  text,
  date,
  temperature,
  humidity,
  dateUnixTime
) {
  return `<img src="${icon}" alt="${text}" />
      <p>${text}</p>
      <h3>${date}</h3>
      <h4>Average temperature</h4>
      <p>${temperature}°C</p>
      <h4>Average humidity</h4>
      <p>${humidity}%</p>
      <button type="button" class='js-btn-more-info' data-id=${dateUnixTime}>More information</button>`;
}

function createMarkupCurrentCity(
  { name },
  {
    condition: { icon, text },
    last_updated,
    temp_c,
    humidity,
    last_updated_epoch,
  }
) {
  return `<h2>${name}</h2>
  <button type="button">Add to favorites</button>
  ${templateMarkupForecast(icon, text, last_updated, temp_c, humidity, last_updated_epoch)}
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
        date_epoch,
      }) => {
        return `<li>${templateMarkupForecast(icon, text, date, avgtemp_c, avghumidity, date_epoch)}</li>`;
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

function normalizeModalData(rawDayData) {
  if (rawDayData.hasOwnProperty('last_updated_epoch')) {
    const { last_updated, wind_kph, precip_mm, chance_of_rain, vis_km, uv } =
      rawDayData;
    return {
      date: last_updated,
      wind: wind_kph,
      precipitation: precip_mm,
      chanceOfRain: chance_of_rain,
      visibility: vis_km,
      uvIndex: uv,
    };
  }
  if (rawDayData.hasOwnProperty('date_epoch')) {
    const {
      date,
      day: { maxwind_kph, totalprecip_mm, daily_chance_of_rain, avgvis_km, uv },
    } = rawDayData;
    return {
      date: date,
      wind: maxwind_kph,
      precipitation: totalprecip_mm,
      chanceOfRain: daily_chance_of_rain,
      visibility: avgvis_km,
      uvIndex: uv,
    };
  }
}

function createModalMarkup(data) {
  const { date, wind, precipitation, chanceOfRain, visibility, uvIndex } =
    normalizeModalData(data);
  return `<h2>Detailed forecast for ${date}</h2>
  <div class="modal-detail-info">
    <p>Date: ${date}</p>
    <p>Wind: ${wind} kph</p>
    <p>Precipitation: ${precipitation} mm</p>
    <p>Chance of rain: ${chanceOfRain}%</p>
    <p>Visibility: ${visibility} km</p>
    <p>UV Index: ${uvIndex}</p>
  </div>`;
}

createMarkupDays();

function findSelectedDay(selectedDayId) {
  const { current, forecast } = currentWeatherData;
  if (current.last_updated_epoch === selectedDayId) {
    return current;
  } else {
    return forecast.forecastday.find(item => item.date_epoch === selectedDayId);
  }
}

function handleEscKeyPress(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}

function closeModal() {
  modalBackdrop.classList.add('is-hidden');
  window.removeEventListener('keydown', handleEscKeyPress);
}

function onWeatherInfoClick(event) {
  const { target } = event;
  if (!target.classList.contains('js-btn-more-info')) return;
  const btnMoreInfoId = Number(target.dataset.id);
  const selectedDayData = findSelectedDay(btnMoreInfoId);
  modalContent.innerHTML = createModalMarkup(selectedDayData);
  modalBackdrop.classList.remove('is-hidden');
  window.addEventListener('keydown', handleEscKeyPress);
}

function handleModalClose(event) {
  const { target } = event;
  if (
    target.classList.contains('js-modal-close-btn') ||
    target.classList.contains('js-modal-backdrop')
  ) {
    closeModal();
  }
}

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
    currentWeatherData = data;

    weatherTodayContainer.innerHTML = createMarkupCurrentCity(
      data.location,
      data.current
    );
    cityForecastContainer.innerHTML = createMarkupCurrentCityForecast(
      data.forecast.forecastday
    );
  } catch (err) {
    console.log(err.message);
  }
}

searchForm.addEventListener('submit', handleSearch);
weatherForecastSection.addEventListener('click', onWeatherInfoClick);
modalBackdrop.addEventListener('click', handleModalClose);
