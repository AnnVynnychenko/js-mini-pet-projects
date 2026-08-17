const BASE_URL = 'https://api.weatherapi.com/v1';
const MOCK_API_URL = 'https://6a7f1b5f3183f5fd884ae2ce.mockapi.io/api/w';
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
const favoritesCityCards = document.querySelector('.js-favorites-city-cards');
const favoritesCitiesDaysContainer = document.querySelector(
  '.js-favorites-cities-days-container'
);
const favoritesCitiesContainer = document.querySelector('.js-favorites-cities');
const favoritesDaysWrapper = document.querySelector(
  '.js-favorites-days-wrapper'
);

function templateMarkupForecast(
  icon,
  text,
  date,
  temperature,
  humidity,
  dateUnixTime
) {
  return `<img src="${icon}" alt="${text}" class="weather-img" />
      <p class="weather-img-description">${text}</p>
      <h3 class="forecast-data">${date}</h3>
      <h4 class="forecast-title-temperature">Average temperature</h4>
      <p class="forecast-temperature">${temperature}°C</p>
      <h4 class="forecast-title-humidity">Average humidity</h4>
      <p class="forecast-humidity">${humidity}%</p>
      <button type="button" class='button-general more-info-btn js-btn-more-info' data-id=${dateUnixTime}>More information</button>`;
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
  return `<h2 class='weather-today-title'>${name}</h2>
  <button type="button" class="button-general add-favorites-btn js-add-favorites-btn">Add to favorites</button>
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
        return `<li class="current-city-forecast">${templateMarkupForecast(icon, text, date, avgtemp_c, avghumidity, date_epoch)}</li>`;
      }
    )
    .slice(1)
    .join('');
}

function createMarkupDays() {
  let markup = '';
  for (let i = 1; i <= 3; i += 1) {
    markup += `<option data-id="${i}">${i}</option>`;
  }
  return markup;
}

forecastDaysContainer.innerHTML = createMarkupDays();
favoritesCitiesDaysContainer.innerHTML = createMarkupDays();

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
  return `<h2 class="modal-title">Detailed forecast for ${date}</h2>
  <div class="modal-forecast-detail-info">
    <p>Wind: ${wind} kph</p>
    <p>Precipitation: ${precipitation} mm</p>
    <p>Chance of rain: ${chanceOfRain}%</p>
    <p>Visibility: ${visibility} km</p>
    <p>UV Index: ${uvIndex}</p>
  </div>`;
}

createMarkupDays();

function createFavoritesMarkup(cities) {
  if (!cities || !cities.length) {
    favoritesDaysWrapper.classList.add('is-collapsed');
    return `<p class="empty-msg">You haven't added any favorite cities yet.</p>`;
  } else {
    favoritesDaysWrapper.classList.remove('is-collapsed');
  }
  return cities
    .map(
      ({ id, cityName }) => `
      <div class="favorite-city-card js-city-card" data-id=${id} data-name=${cityName}>
        <h3 class="favorite-city-name">${cityName}</h3>
        <button type="button" class="button-general city-forecast-btn js-city-forecast-btn">Weather forecast</button>
        <button type="button" class="button-general city-delete-btn js-city-delete-btn">Delete city</button>
      </div>
      `
    )
    .join('');
}

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

async function displayFavoritesCitiesMarkup() {
  try {
    const cities = await getFavoritesCities();
    favoritesCityCards.innerHTML = createFavoritesMarkup(cities);
  } catch (err) {
    console.error(err.message);
  }
}

displayFavoritesCitiesMarkup();

async function handleForecastFromCityCard(event) {
  const { target } = event;

  const cityCardsBtnClasses = [
    'js-city-forecast-btn',
    'js-city-delete-btn',
    'js-favorites-cities-days-container',
  ];
  const hasClass = cityCardsBtnClasses.some(element =>
    target.classList.contains(element)
  );
  if (!hasClass) return;

  const cityCard = target.closest('.js-city-card');
  if (!cityCard) return;

  const cityName = cityCard.dataset.name.trim().toLowerCase();
  const cityId = cityCard.dataset.id;

  const enteredDays = Number(favoritesCitiesDaysContainer.value.trim()) || 1;

  if (target.classList.contains('js-city-forecast-btn')) {
    await getWeather(cityName, enteredDays);
  }

  if (target.classList.contains('js-city-delete-btn')) {
    await deleteFavoriteCity(cityId);
  }
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
  const enteredDays =
    Number(event.currentTarget.elements.forecastDays.value.trim()) || 1;
  getWeather(enteredCity, enteredDays);
}

async function handleAddToFavoritesCity(event) {
  const { target } = event;
  if (!target.classList.contains('js-add-favorites-btn')) return;
  const targetCity = currentWeatherData.location.name;
  try {
    await addFavoritesCity(targetCity);
    await displayFavoritesCitiesMarkup();
  } catch (err) {
    console.error(err.message);
  }
}

async function getFavoritesCities() {
  const response = await fetch(`${MOCK_API_URL}/favoriteCityName`);
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
}

async function addFavoritesCity(targetCity) {
  const dataToSend = {
    cityName: targetCity,
  };
  const options = {
    method: 'POST',
    body: JSON.stringify(dataToSend),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(`${MOCK_API_URL}/favoriteCityName`, options);
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
}

async function deleteFavoriteCity(id) {
  try {
    const options = {
      method: 'DELETE',
    };

    const response = await fetch(
      `${MOCK_API_URL}/favoriteCityName/${id}`,
      options
    );

    if (!response.ok) throw new Error(response.statusText);

    await displayFavoritesCitiesMarkup();
  } catch (err) {
    console.error(err.message);
  }
}

async function getWeather(enteredCity, enteredDays) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${enteredCity}&days=${enteredDays}`
    );
    if (!response.ok) throw new Error(response.statusText);

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
    console.error(err.message);
  }
}

searchForm.addEventListener('submit', handleSearch);
weatherForecastSection.addEventListener('click', onWeatherInfoClick);
modalBackdrop.addEventListener('click', handleModalClose);
weatherTodayContainer.addEventListener('click', handleAddToFavoritesCity);
favoritesCitiesContainer.addEventListener('click', handleForecastFromCityCard);
