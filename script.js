// ============================================
// Weather Showcasing App - uses OpenWeatherMap API
// ============================================

// STEP 1: Create a FREE account at https://home.openweathermap.org/users/sign_up
// STEP 2: Copy your key from "API keys" tab and paste it between the quotes below.
// NOTE: a new key can take up to 1-2 hours to become active.
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ----- Grab the HTML elements we need -----
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const statusBox = document.getElementById("status");
const resultBox = document.getElementById("result");

// ----- Small helper functions -----

// Show a message ("loading" or "error") above the result
function showStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = "status " + type;
  statusBox.hidden = false;
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.hidden = true;
}

// Create an element with a class and text in one line
function createEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

// fetch() with a timeout so the app never waits forever
async function fetchWithTimeout(url, ms = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// City names can have letters (any language), spaces, dots, commas, apostrophes and hyphens.
// Numbers and symbols like @ # $ are not allowed.
function isValidCity(name) {
  return /^[\p{L}\s.,'’-]+$/u.test(name);
}

// One small box in the card, e.g. "Humidity 60%"
function createDetailBox(label, value) {
  const box = createEl("div", "detail-box");
  box.appendChild(createEl("div", "detail-label", label));
  box.appendChild(createEl("div", "detail-value", value));
  return box;
}

// ----- Show the weather on the page -----
function renderWeather(data) {
  resultBox.innerHTML = "";

  // The API gives these inside arrays / objects, so read them carefully
  const weatherInfo = (data.weather && data.weather[0]) || {};
  const main = data.main || {};
  const wind = data.wind || {};
  const country = data.sys && data.sys.country ? ", " + data.sys.country : "";

  const card = createEl("article", "weather-card");

  card.appendChild(createEl("h2", "city-name", data.name + country));

  // Weather icon
  if (weatherInfo.icon) {
    const icon = createEl("img", "weather-icon");
    icon.src = "https://openweathermap.org/img/wn/" + weatherInfo.icon + "@2x.png";
    icon.alt = weatherInfo.description || "Weather icon";
    // If the icon cannot load, just hide it
    icon.onerror = function () {
      icon.style.display = "none";
    };
    card.appendChild(icon);
  }

  card.appendChild(createEl("div", "temperature", Math.round(main.temp) + "°C"));
  card.appendChild(createEl("p", "condition", weatherInfo.description || "No description"));

  // Extra details: humidity, feels like, wind speed
  const grid = createEl("div", "details-grid");
  grid.appendChild(createDetailBox("💧 Humidity", main.humidity + "%"));
  grid.appendChild(createDetailBox("🌡️ Feels like", Math.round(main.feels_like) + "°C"));
  // Wind comes in metres/second, multiply by 3.6 to get km/h
  grid.appendChild(createDetailBox("💨 Wind", Math.round((wind.speed || 0) * 3.6) + " km/h"));
  card.appendChild(grid);

  resultBox.appendChild(card);
}

// ----- Main function: ask the API for the weather -----
async function getWeather(city) {
  // Check that the API key was added
  if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY" || API_KEY.trim() === "") {
    showStatus("API key missing! Open script.js and paste your OpenWeatherMap API key at the top.", "error");
    return;
  }

  resultBox.innerHTML = "";
  showStatus("Fetching weather...", "loading");
  searchBtn.disabled = true;

  try {
    const url =
      BASE_URL +
      "?q=" + encodeURIComponent(city) +
      "&appid=" + encodeURIComponent(API_KEY) +
      "&units=metric";

    const response = await fetchWithTimeout(url);

    // Handle the common problems one by one
    if (response.status === 404) {
      throw new Error('City "' + city + '" was not found. Please check the spelling and try again.');
    }
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check the key in script.js. (New keys can take 1-2 hours to activate.)");
    }
    if (response.status === 429) {
      throw new Error("Too many requests. Please wait a minute and try again.");
    }
    if (!response.ok) {
      throw new Error("Server problem (error " + response.status + "). Please try again later.");
    }

    const data = await response.json();

    clearStatus();
    renderWeather(data);
  } catch (error) {
    if (error.name === "AbortError") {
      showStatus("The request took too long. Please try again.", "error");
    } else if (error instanceof TypeError || error instanceof SyntaxError) {
      // TypeError = no internet / blocked request, SyntaxError = bad JSON
      showStatus("Could not reach the server. Please check your internet connection and try again.", "error");
    } else {
      showStatus(error.message, "error");
    }
  } finally {
    searchBtn.disabled = false;
  }
}

// ----- Handle the form (works for button click AND Enter key) -----
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = cityInput.value.trim();

  // Edge case 1: empty input
  if (city === "") {
    resultBox.innerHTML = "";
    showStatus("Please enter a city name first.", "error");
    cityInput.focus();
    return;
  }

  // Edge case 2: invalid characters (numbers, symbols)
  if (!isValidCity(city)) {
    resultBox.innerHTML = "";
    showStatus("Please enter a valid city name (letters only, no numbers or symbols).", "error");
    cityInput.focus();
    return;
  }

  getWeather(city);
});
