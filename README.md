# JS Mini-Projects Suite

A modular collection of pure JavaScript (Vanilla JS), HTML, and CSS
mini-applications built with Vite.

## 🚀 Technologies

- **Language & Core:** JavaScript (ES6+), HTML5, CSS3
- **Build Tool:** Vite (Dev Server & Bundler)
- **APIs & Data:**
  - WeatherAPI (Real-time & Multi-day forecast data)
  - MockAPI (RESTful backend service for favorite cities CRUD)
- **Web APIs / Storage:** Fetch API, Async/Await, `localStorage`.

## 📂 Project Structure

- `src/index.html` — Main dashboard / Navigation hub.
- `src/projects/weather/` — Dynamic weather forecast app integrated with
  WeatherAPI and MockAPI for managing favorite cities, custom forecast duration,
  and detailed daily modal views.
- `src/projects/ttt-game/` — Tic-Tac-Toe web game with match history saved and
  restored via `localStorage`.
- `src/projects/filter/` — Data filtering, sorting, and JSON parsing.
- `src/projects/converter/` — Distance Converter (Metric/Imperial via JSON
  configuration).

## 🛠️ Getting Started

### Installation

```bash
npm install
```

### Set up Environment Variables:

Create a `.env` file in the root directory of the project and add your API key:

`VITE_WEATHER_API_KEY=your_weather_api_key_here`

### Start the development server:

```Bash
npm run dev
```
