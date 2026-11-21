# Project 06: Build Functional Web Apps Using External APIs

**Program:** WSJP-131 | Full Stack Mentorship Program with DSA & GenAI
**Milestone 02:** Core Frontend Dev | **Module 06:** DOMinate with JavaScript
**Submitted by:** _(your name here)_

## About the Project

Three small web apps that fetch live data from public APIs using `fetch()` and `async/await`, and show it on the page by updating the DOM. Built with only **HTML, CSS and vanilla JavaScript** (no frameworks or libraries).

| App | API used | Input | Output |
|---|---|---|---|
| Movie Search | OMDb API | Movie name | Poster, title, year, genre, short plot |
| Weather Showcasing | OpenWeatherMap API | City name | Temperature, humidity, condition, icon |
| Text Translator | LibreTranslate API (with MyMemory as free fallback) | Text + target language | Translated text |

## Folder Structure

```
Project-06-External-APIs/
├── index.html              (home page linking to all 3 apps)
├── README.md
├── movie-search-app/       index.html, style.css, script.js
├── weather-app/            index.html, style.css, script.js
└── text-translator-app/    index.html, style.css, script.js
```

## How to Run

1. Get the free API keys (see below) and paste them at the top of the `script.js` files.
2. Open `index.html` in any browser (or open an app's own `index.html` directly). An internet connection is needed.

### API keys

| App | Where to get the key | Where to paste it |
|---|---|---|
| Movie Search | https://www.omdbapi.com/apikey.aspx (free, key comes by email, click the activation link) | `movie-search-app/script.js` → `API_KEY` |
| Weather | https://home.openweathermap.org/users/sign_up (free, new keys can take 1-2 hours to activate) | `weather-app/script.js` → `API_KEY` |
| Translator | Not required. Optional LibreTranslate key from https://portal.libretranslate.com | `text-translator-app/script.js` → `LIBRE_API_KEY` |

If a key is missing, the app shows a clear message instead of crashing.

## API Documentation Links

- OMDb API: https://www.omdbapi.com/
- OpenWeatherMap Current Weather API: https://openweathermap.org/current
- LibreTranslate: https://docs.libretranslate.com/
- MyMemory Translation API: https://mymemory.translated.net/doc/spec.php

## Key Implementation Details

- **fetch() + async/await:** every app sends the request, waits for the response and reads it with `response.json()` inside a `try / catch / finally` block.
- **URL building:** user input is passed through `encodeURIComponent()` so spaces and special characters do not break the request.
- **Loading state:** a spinner message is shown while waiting and the button is disabled, so the user cannot send many requests at once. It is enabled again in `finally`.
- **Error handling:** separate friendly messages for empty input, invalid input, movie/city not found, wrong API key, request limit reached, server errors, slow requests (10-15 second timeout using `AbortController`) and no internet.
- **Safe DOM updates:** results are created with `createElement` and `textContent` (not `innerHTML` with user data), so typed text can never run as code.
- **Movie app:** the Genre string is split into chips; if the poster is "N/A" or fails to load, a placeholder picture is shown; fields with "N/A" are handled.
- **Weather app:** city names are validated with a regex that allows letters from any language (e.g. São Paulo), spaces, dots, hyphens and apostrophes; temperature is rounded and wind speed is converted from m/s to km/h.
- **Translator app:** language dropdowns are filled from a JavaScript array, there is an auto-detect option, a swap button, a 500-character counter, and a copy button. It checks that both languages are different. LibreTranslate is used when `LIBRE_API_KEY` is set; otherwise the free MyMemory API is used, so the app works without any key.
- **Responsive layout:** Flexbox and CSS Grid with media queries; tested down to 360px wide mobile screens.

## Screenshots (optional)

_Add screenshots of the three apps here, for example:_

`![Movie Search](screenshots/movie.png)`

## Note

API keys placed in front-end JavaScript are visible to anyone who opens the page. This is fine for a learning project, but do not push your real keys to a public GitHub repository.
