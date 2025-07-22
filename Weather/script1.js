const apiKey = '#'; // Replace with your OpenWeatherMap API key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationEl = document.getElementById('location');
const descriptionEl = document.getElementById('description');
const temperatureEl = document.getElementById('temperature');
const detailsEl = document.getElementById('details');
const iconEl = document.getElementById('weather-icon');
const errorMessage = document.getElementById('error-message');

function setBackground(condition, isNight = false) {
    
    document.body.className = '';
    if (isNight) {
        document.body.classList.add('night');
        return;
    }
    switch (condition) {
        case 'Clear':
            document.body.classList.add('sunny');
            break;
        case 'Clouds':
            document.body.classList.add('clouds');
            break;
        case 'Rain':
        case 'Drizzle':
            document.body.classList.add('rain');
            break;
        case 'Thunderstorm':
            document.body.classList.add('thunderstorm');
            break;
        case 'Snow':
            document.body.classList.add('snow');
            break;
        case 'Mist':
        case 'Haze':
        case 'Fog':
            document.body.classList.add('mist');
            break;
        default:
            document.body.classList.add('clear');
    }
}

async function getWeather(city) {
    errorMessage.style.display = 'none';
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        
        // Weather info
        locationEl.textContent = `${data.name}, ${data.sys.country}`;
        descriptionEl.textContent = data.weather[0].description;
        temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
        detailsEl.textContent = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s`;

        // Weather icon
        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        iconEl.alt = data.weather[0].main;

        // Decide if it's night
        const now = Math.floor(Date.now()/1000);
        const isNight = now < data.sys.sunrise || now > data.sys.sunset;
        setBackground(data.weather[0].main, isNight);
    } catch (err) {
        errorMessage.textContent = 'Not able to find weather for this location!';
        errorMessage.style.display = 'block';
        locationEl.textContent = '';
        descriptionEl.textContent = '';
        temperatureEl.textContent = '';
        detailsEl.textContent = '';
        iconEl.src = '';
    }
}

// Search event
searchBtn.onclick = () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
};
cityInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') getWeather(cityInput.value.trim());
});
// Fetch weather for default location
// getWeather('Delhi');
