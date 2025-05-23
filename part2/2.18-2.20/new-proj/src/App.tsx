import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryDetails from './components/CountryDetails';
import { Country, Weather } from './types';

const COUNTRY_API = import.meta.env.VITE_COUNTRY_API;
const WEATHER_API = import.meta.env.VITE_WEATHER_API;
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    axios.get<Country[]>(COUNTRY_API).then((response) => setCountries(response.data));
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedCountry.capital) {
      axios
        .get<Weather>(`${WEATHER_API}?q=${selectedCountry.capital[0]}&appid=${API_KEY}&units=metric`)
        .then((response) => setWeather(response.data))
        .catch((error) => console.error("Error fetching weather data:", error));
    }
  }, [selectedCountry]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleSelect = (country: Country) => setSelectedCountry(country);

  const filteredCountries = search
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div>
      <h1>Country Information</h1>
      <input type="text" value={search} onChange={handleSearch} placeholder="Search countries..." />
      {filteredCountries.length > 10 && <p>Too many matches, refine your search.</p>}
      {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common} <button onClick={() => handleSelect(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}
      {filteredCountries.length === 1 && !selectedCountry ? (
        <CountryDetails country={filteredCountries[0]} weather={weather} />
      ) : null}

      {selectedCountry && <CountryDetails country={selectedCountry} weather={weather} />}
    </div>
  );
};

export default App;
