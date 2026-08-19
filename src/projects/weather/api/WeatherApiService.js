export class WeatherApiService {
  #API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  #BASE_URL = 'https://api.weatherapi.com/v1';

  async fetchWeather(enteredCity, enteredDays) {
    const response = await fetch(
      `${this.#BASE_URL}/forecast.json?key=${this.#API_KEY}&q=${enteredCity}&days=${enteredDays}`
    );
    if (!response.ok)
      throw new Error(
        'Unable to load data. Please check the city name or your connection and try again later.'
      );
    return await response.json();
  }
}
