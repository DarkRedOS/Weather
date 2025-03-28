const API_KEY = 'aa34ef6f983b57c4496f0cf5ce180f11'; // OpenWeatherMap API key

// Theme toggle elements and logic
const themeToggle = document.querySelector('.theme-toggle');
const htmlEl = document.documentElement;

function toggleTheme() {
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';
    htmlEl.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Initialize theme
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeToggle.addEventListener('click', toggleTheme);
}

// DOM elements
const searchBar = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
const weatherCard = document.querySelector('.weather-card');
const locationElement = document.querySelector('.location');
const tempElement = document.querySelector('.temp');
const conditionElement = document.querySelector('.condition');
const detailElements = {
    humidity: document.querySelector('.humidity'),
    wind: document.querySelector('.wind'),
    feelsLike: document.querySelector('.feels-like'),
    pressure: document.querySelector('.pressure'),
    visibility: document.querySelector('.visibility')
};

// Geolocation handling
navigator.geolocation.getCurrentPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherData(`lat=${latitude}&lon=${longitude}`);
    },
    (error) => {
        console.error('Geolocation error:', error);
        getWeatherData('q=London'); // Default to London
    }
);

// Search functionality
searchBtn.addEventListener('click', () => {
    const location = searchBar.value.trim();
    if (location) {
        getWeatherData(`q=${location}`);
    }
});

// Weather data fetching
async function getWeatherData(query) {
    try {
        weatherCard.style.display = 'none'; // Hide during loading
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.cod === 200) {
            updateWeatherUI(data);
            searchBar.value = ''; // Clear input after success
        } else {
            alert(`Error: ${data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert(`Failed to get weather data: ${error.message}`);
    }
}

// Update UI with weather data
function updateWeatherUI(data) {
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    conditionElement.textContent = data.weather[0].description;
    
    detailElements.humidity.textContent = `${data.main.humidity}%`;
    detailElements.wind.textContent = `${data.wind.speed} m/s`;
    detailElements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    detailElements.pressure.textContent = `${data.main.pressure} hPa`;
    detailElements.visibility.textContent = `${data.visibility/1000} km`;

    weatherCard.style.display = 'block';
    setTimeout(() => weatherCard.style.opacity = 1, 10);
}
