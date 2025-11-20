const TOKYO_COORDS = { latitude: 35.6762, longitude: 139.6503 };

async function getForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: 'precipitation_probability',
    forecast_days: '1',
    timezone: 'auto',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error('天気APIの取得に失敗したよ…🥲');
  }
  return response.json();
}

export async function getUmbrellaSuggestion(coords = TOKYO_COORDS) {
  const { latitude, longitude } = coords;
  const forecast = await getForecast(latitude, longitude);
  const probabilities = forecast.hourly?.precipitation_probability ?? [];
  const timestamps = forecast.hourly?.time ?? [];

  if (probabilities.length === 0 || timestamps.length === 0) {
    return { shouldRemind: false, maxProbability: 0 };
  }

  let maxProbability = -1;
  let targetIndex = 0;
  probabilities.forEach((value, idx) => {
    if (value > maxProbability) {
      maxProbability = value;
      targetIndex = idx;
    }
  });

  const targetTime = timestamps[targetIndex];
  const dueDate = new Date(targetTime);

  return {
    shouldRemind: maxProbability >= 40,
    maxProbability,
    dueDate,
    location: { latitude, longitude },
  };
}

