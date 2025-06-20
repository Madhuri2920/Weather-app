const apiKey = "fed2331199d100aac0a2751fa9df8859"; // ✅ Your own API key


function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city");
    return;
  }
  fetchWeatherData(city);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      fetchWeatherData(data.name);
    }, () => {
      // Fallback to Delhi if location access denied
      fetchWeatherData("Delhi");
    });
  } else {
    // If browser doesn't support geolocation
    fetchWeatherData("Delhi");
  }
}


async function fetchWeatherData(city) {
  try {
    // Current weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    document.getElementById("city").innerText = weatherData.name;
    document.getElementById("temperature").innerText = `${weatherData.main.temp.toFixed(1)}°C`;
    document.getElementById("feels_like").innerText = `${weatherData.main.feels_like}°C`;
    document.getElementById("humidity").innerText = `${weatherData.main.humidity}%`;
    document.getElementById("wind").innerText = `${weatherData.wind.speed} km/h`;
    document.getElementById("description").innerText = weatherData.weather[0].description;

    // Date & Time
    const now = new Date();
    document.getElementById("time").innerText = now.toLocaleTimeString();
    document.getElementById("date").innerText = now.toLocaleDateString();

    // 5 Day Forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastRes.json();
    renderForecast(forecastData.list);
  } catch (error) {
    alert("Error fetching weather data.");
    console.error(error);
  }
}

function renderForecast(list) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const filtered = list.filter(item => item.dt_txt.includes("12:00:00"));
  filtered.forEach(day => {
    const div = document.createElement("div");
    div.classList.add("forecast-day");
    div.innerHTML = `
      <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
      <p>${day.main.temp.toFixed(1)}°C</p>
      <p>${day.weather[0].main}</p>
    `;
    forecastDiv.appendChild(div);
  });
}

window.onload = () => {
  getLocation(); // Automatically fetch weather using geolocation
};
