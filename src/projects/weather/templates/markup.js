import { normalizeModalData } from '../helpers/normalizeModalData';

/* ==========================
Markup Forecast (current, future)
============================= */

export function templateMarkupForecast(
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

export function createMarkupCurrentCity(
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

export function createMarkupCurrentCityForecast(data) {
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

/* ==========================
      Markup Days
============================= */

export function createMarkupDays() {
  let markup = '';
  for (let i = 1; i <= 3; i += 1) {
    markup += `<option data-id="${i}">${i}</option>`;
  }
  return markup;
}

/* ==========================
      Modal Markup
============================= */

export function createModalMarkup(data) {
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

/* ==========================
      Favorites City
============================= */

export function createFavoritesMarkup(cities, favoritesDaysWrapper) {
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
