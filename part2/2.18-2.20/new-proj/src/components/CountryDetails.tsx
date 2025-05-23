import React from 'react';
import { Country, Weather } from '../types';

interface CountryDetailsProps {
  country: Country;
  weather: Weather | null;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ country, weather }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      {weather && (
        <div>
          <h3>Weather in {country.capital?.[0]}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};

export default CountryDetails;
