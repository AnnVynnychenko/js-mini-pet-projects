import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { WeatherApiService } from './api/WeatherApiService';
import { FavoritesApiService } from './api/FavoritesApiService';
import { Modal } from './components/Modal';
import {
  createMarkupCurrentCity,
  createMarkupCurrentCityForecast,
  createMarkupDays,
  createModalMarkup,
  createFavoritesMarkup,
} from './templates/markup';
import { formatCityName } from './helpers/helpers';

class WeatherApp {
  #currentWeatherData = null;

  constructor() {
    this.modal = new Modal('.js-modal-backdrop', '.js-modal-content');
    this.weatherApi = new WeatherApiService();
    this.favoritesApi = new FavoritesApiService();

    this.#initDOMElements();
    this.init();
  }

  #initDOMElements() {
    this.searchForm = document.querySelector('.js-search-form');
    this.forecastDaysContainer = document.querySelector(
      '.js-forecast-days-container'
    );
    this.cityForecastContainer = document.querySelector(
      '.js-city-forecast-container'
    );
    this.weatherTodayContainer = document.querySelector(
      '.js-weather-today-container'
    );
    this.weatherForecastSection = document.querySelector(
      '.js-weather-forecast-section'
    );

    this.favoritesCityCards = document.querySelector(
      '.js-favorites-city-cards'
    );
    this.favoritesCitiesDaysContainer = document.querySelector(
      '.js-favorites-cities-days-container'
    );
    this.favoritesCitiesContainer = document.querySelector(
      '.js-favorites-cities'
    );
    this.favoritesDaysWrapper = document.querySelector(
      '.js-favorites-days-wrapper'
    );
  }

  init() {
    this.forecastDaysContainer.innerHTML = createMarkupDays();
    this.favoritesCitiesDaysContainer.innerHTML = createMarkupDays();

    this.searchForm.addEventListener('submit', this.handleSearch.bind(this));
    this.weatherForecastSection.addEventListener(
      'click',
      this.onWeatherInfoClick.bind(this)
    );
    this.weatherTodayContainer.addEventListener(
      'click',
      this.handleAddToFavoritesCity.bind(this)
    );
    this.favoritesCitiesContainer.addEventListener(
      'click',
      this.handleForecastAndDeleteCityCard.bind(this)
    );

    this.displayFavoritesCitiesMarkup();
  }

  async displayFavoritesCitiesMarkup() {
    try {
      const cities = await this.favoritesApi.getFavoritesCities();
      this.favoritesCityCards.innerHTML = createFavoritesMarkup(
        cities,
        this.favoritesDaysWrapper
      );
    } catch (err) {
      console.error(err.message);
      Notify.failure(err.message);
    }
  }

  async handleSearch(event) {
    event.preventDefault();

    const enteredCity = event.currentTarget.elements.cityName.value
      .trim()
      .toLowerCase();
    const enteredDays =
      Number(event.currentTarget.elements.forecastDays.value.trim()) || 1;

    try {
      await this.getWeather(enteredCity, enteredDays);
    } catch (err) {
      console.error(err.message);
      Notify.failure('Search error: Check city name or internet connection.');
    }
  }

  async getWeather(enteredCity, enteredDays) {
    const data = await this.weatherApi.fetchWeather(enteredCity, enteredDays);
    this.#currentWeatherData = data;

    this.weatherTodayContainer.innerHTML = createMarkupCurrentCity(
      data.location,
      data.current
    );
    this.cityForecastContainer.innerHTML = createMarkupCurrentCityForecast(
      data.forecast.forecastday
    );
  }

  onWeatherInfoClick(event) {
    const { target } = event;
    if (!target.classList.contains('js-btn-more-info')) return;

    const btnMoreInfoId = Number(target.dataset.id);
    const selectedDayData = this.findSelectedDay(btnMoreInfoId);

    if (selectedDayData) {
      this.modal.openModal(createModalMarkup(selectedDayData));
    }
  }

  findSelectedDay(selectedDayId) {
    if (!this.#currentWeatherData) return;

    const { current, forecast } = this.#currentWeatherData;

    if (current.last_updated_epoch === selectedDayId) {
      return current;
    } else {
      return forecast.forecastday.find(
        item => item.date_epoch === selectedDayId
      );
    }
  }

  async handleAddToFavoritesCity(event) {
    const { target } = event;

    if (!target.classList.contains('js-add-favorites-btn')) return;
    const targetCity = this.#currentWeatherData.location.name;

    try {
      await this.favoritesApi.addFavoritesCity(targetCity);
      await this.displayFavoritesCitiesMarkup();
      const capitalizeCityName = formatCityName(targetCity);
      Notify.success(`City ${capitalizeCityName} successfully added!`);
    } catch (err) {
      console.error(err.message);
      Notify.failure(err.message);
    }
  }

  async handleForecastAndDeleteCityCard(event) {
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
    const enteredDays =
      Number(this.favoritesCitiesDaysContainer.value.trim()) || 1;

    if (target.classList.contains('js-city-forecast-btn')) {
      try {
        await this.getWeather(cityName, enteredDays);
      } catch (err) {
        console.error(err.message);
        Notify.failure(
          'Failed to load forecast for this favorite city. Please try again later.'
        );
      }
    }

    try {
      if (target.classList.contains('js-city-delete-btn')) {
        await this.favoritesApi.deleteFavoriteCity(cityId);
        await this.displayFavoritesCitiesMarkup();
        const capitalizeCityName = formatCityName(cityName);
        Notify.success(`City ${capitalizeCityName} successfully deleted!`);
      }
    } catch (err) {
      console.error(err.message);
      Notify.failure(err.message);
    }
  }
}

new WeatherApp();
