export function normalizeModalData(rawDayData) {
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

export function formatCityName(str) {
  if (!str) return;
  return str
    .trim()
    .split(' ')
    .map(word => word.at(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
