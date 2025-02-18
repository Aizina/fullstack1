import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryDetails from './components/CountryDetails';

const COUNTRY_API = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get(COUNTRY_API).then(response => setCountries(response.data));
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedCountry.capital) {
      axios
        .get(`${WEATHER_API}?q=${selectedCountry.capital}&appid=${API_KEY}&units=metric`)
        .then(response => setWeather(response.data))
        .catch(error => console.error("Error fetching weather data:", error));
    }
  }, [selectedCountry]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleSelect = (country) => setSelectedCountry(country);

  const filteredCountries = search
    ? countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div>
      <h1>Country Information</h1>
      <input type="text" value={search} onChange={handleSearch} placeholder="Search countries..." />
      {filteredCountries.length > 10 && <p>Too many matches, refine your search.</p>}
      {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common} <button onClick={() => handleSelect(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}
      {filteredCountries.length === 1 && !selectedCountry && handleSelect(filteredCountries[0])}
      {selectedCountry && <CountryDetails country={selectedCountry} weather={weather} />}
    </div>
  );
};


export default App;