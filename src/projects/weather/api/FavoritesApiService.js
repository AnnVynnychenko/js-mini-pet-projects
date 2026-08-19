export class FavoritesApiService {
  #MOCK_API_URL = 'https://6a7f1b5f3183f5fd884ae2ce.mockapi.io/api/w';

  async getFavoritesCities() {
    const response = await fetch(`${this.#MOCK_API_URL}/favoriteCityName`);
    if (!response.ok)
      throw new Error(
        'Failed to load favorite cities. Please try again later.'
      );
    return await response.json();
  }

  async addFavoritesCity(targetCity) {
    const dataToSend = {
      cityName: targetCity,
    };

    const favoritesCities = await this.getFavoritesCities();

    if (!favoritesCities) {
      throw new Error('Failed to load favorite cities list.');
    }

    const hasCity = favoritesCities.some(
      city => city.cityName.toLowerCase() === dataToSend.cityName.toLowerCase()
    );

    if (hasCity) {
      throw new Error('This city is already in your favorites!');
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(
      `${this.#MOCK_API_URL}/favoriteCityName`,
      options
    );
    if (!response.ok)
      throw new Error(
        'Network error. Unable to add city to favorites right now.'
      );
    return await response.json();
  }

  async deleteFavoriteCity(id) {
    const options = {
      method: 'DELETE',
    };

    const response = await fetch(
      `${this.#MOCK_API_URL}/favoriteCityName/${id}`,
      options
    );

    if (!response.ok)
      throw new Error('Network error. Unable to delete city right now.');
    return response;
  }
}
