const API_KEY = '52463e4d63c94087955184413262502'; 
const container = document.getElementById('forecastContainer');

const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
};

async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`);
        const data = await response.json();
        if (data.error) throw new Error("City not found");
        renderWeather(data);
    } catch (err) {
        if (container) {
            container.innerHTML = `<p style="color:#009ad8; width:100%; text-align:center;">City not found. Please try again!</p>`;
        }
    }
}

function renderWeather(data) {
    const days = data.forecast.forecastday;
    container.innerHTML = ''; 

    // Card 1
    let html = `
        <div class="card">
            <div class="day-title">${getDayName(days[0].date)}</div>
            <div class="location-title"><i class="fas fa-location-dot" style="color:white; margin-right:8px;"></i>${data.location.name}</div>
            <div class="temp-large">${Math.round(data.current.temp_c)}°C</div>
            <img src="https:${data.current.condition.icon}" class="weather-icon" width="60">
            <div class="condition">${data.current.condition.text}</div>
            
            <div class="details-row">
                <span><i class="fas fa-wind"></i> ${data.current.wind_kph} km/h</span>
                <span><i class="fas fa-droplet"></i> ${data.current.humidity}%</span>
            </div>
        </div>
    `;

    // Cards 2 & 3
    for (let i = 1; i < days.length; i++) {
        html += `
            <div class="card">
                <div class="day-title">${getDayName(days[i].date)}</div>
                <img src="https:${days[i].day.condition.icon}" class="weather-icon" width="70">
                <div class="temp-med">${Math.round(days[i].day.maxtemp_c)}°C</div>
                <div class="temp-min">${Math.round(days[i].day.mintemp_c)}°C</div>
                <div class="condition">${days[i].day.condition.text}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}


const citySearch = document.getElementById('citySearch');
if (citySearch) {
    citySearch.addEventListener('input', (e) => {
        if (e.target.value.length > 2) getWeatherData(e.target.value);
    });
}

const geoBtn = document.getElementById('geoBtn');
if (geoBtn) {
    geoBtn.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => getWeatherData(`${pos.coords.latitude},${pos.coords.longitude}`),
            () => getWeatherData('Cairo')
        );
    });
}

if (container) {
    window.onload = () => getWeatherData('Cairo');
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

if (navOverlay) {
    navOverlay.addEventListener('click', toggleMenu);
}

if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}
