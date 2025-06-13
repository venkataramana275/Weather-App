

import React, { useState } from "react";
import axios from "axios";
import backgroundGif from "../assets/bg.gif";
import "../App.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [aqi, setAqi] = useState(null);

  const API_KEY = "24327a6b916412ad841f90a38f0d0c26";

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);

    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${API_KEY}`
      );
      setWeather(weatherRes.data);
      setError("");

      const { lat, lon } = weatherRes.data.coord;
      fetchAirQuality(lat, lon);
      fetchForecast(lat, lon);

      if (weatherRes.data.weather && weatherRes.data.weather.length > 0) {
        const weatherCondition = weatherRes.data.weather[0].main;
      } else {
         setError(weatherRes.message || "City not found");
      }
    } catch (error) {
      setError("City not found.");
      setWeather(null);
      setForecast([]);
      setHourlyForecast([]);
      setAqi(null);
      alert("Failed to fetch weather data");
    }
    setLoading(false); 
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      setForecast(forecastRes.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      ));

      setHourlyForecast(forecastRes.data.list.slice(0, 12));
    } catch (error) {
      console.error("Error fetching forecast:", error);
      setForecast([]);
      setHourlyForecast([]);
    }
  };

  const fetchAirQuality = async (lat, lon) => {
    try {
      const aqiRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      setAqi(aqiRes.data.list[0]);
    } catch (error) {
      console.error("Error fetching AQI:", error);
      setAqi(null);
    }
  };


  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const spokenCity = event.results[0][0].transcript;
      setCity(spokenCity);
      fetchWeather(); 
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  return (
    <div  style={{
      backgroundImage: `url(${backgroundGif})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      minHeight: "97vh",
      color: "red",
      padding: "10px",
  }}>
      <h1>INTO-SKY😄</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
        <button onClick={handleVoiceSearch}>🎤 Voice Search</button>
      </div>

      {error && <p className="error">❌ {error}</p>}
      {loading ? (
          <p>Loading...</p>
      ) : (
        <>
          {weather && (
            <div style={{ textAlign: "center", paddingTop: "20px" }}>
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>
              <p>🌡 Temperature: {weather.main.temp}°C</p>
              <p>☁ Weather: {weather.weather[0].description}</p>
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
            </div>
          )}

          {hourlyForecast.length > 0 && (
            <div className="hourly-forecast">
              <h2>Hourly Forecast (Next 12 Hours)</h2>
              <div className="hourly-container">
                {hourlyForecast.map((hour, index) => (
                  <div key={index} className="hour">
                    <p>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    <p>🌡 {hour.main.temp}°C</p>
                    <p>☁ {hour.weather[0].description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {forecast.length > 0 && (
            <div className="forecast-container">
              <h2>5-Day Forecast</h2>
              <div className="forecast">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-day">
                    <p>{new Date(day.dt * 1000).toDateString()}</p>
                    <p>🌡 {day.main.temp}°C</p>
                    <p>☁ {day.weather[0].description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Weather;








