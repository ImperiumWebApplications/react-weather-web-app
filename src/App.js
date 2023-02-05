import React, { useState, useEffect } from "react";
import Skycons, { SkyconsType } from "react-skycons";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    if (city) {
      clearTimeout(typingTimeout);
      setTypingTimeout(
        setTimeout(() => {
          fetch(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
          )
            .then((res) => {
              if (!res.ok) {
                throw new Error();
              }
              return res.json();
            })
            .then((data) => setWeather(data))
            .catch(() => {
              setWeather(null);
              setError("Invalid location name");
            });
        }, 500)
      );
    }
  }, [city]);

  const getBackgroundColor = (temp) => {
    if (temp < 280) {
      return "cold";
    } else if (temp >= 280 && temp < 293) {
      return "mild";
    } else {
      return "hot";
    }
  };

  return (
    <div
      className={`App ${weather ? getBackgroundColor(weather.main.temp) : ""}`}
    >
      <div className="card">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        {weather ? (
          <div className="weather-details">
            <Skycons
              color="white"
              type={
                weather.weather[0].main.toUpperCase() === "CLEAR"
                  ? SkyconsType.CLEAR_DAY
                  : weather.weather[0].main.toUpperCase() === "CLOUDS"
                  ? SkyconsType.CLOUDY
                  : weather.weather[0].main.toUpperCase() === "RAIN"
                  ? SkyconsType.RAIN
                  : weather.weather[0].main.toUpperCase() === "SNOW"
                  ? SkyconsType.SNOW
                  : SkyconsType.CLEAR_DAY
              }
              animate={true}
              size={200}
              resizeClear={true}
            />
            <div className="temperature">
              <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather-icon"
              />
            </div>
          </div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <p className="loading">Enter a city to see the weather.</p>
        )}
      </div>
    </div>
  );
};

export default App;
