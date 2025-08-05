# 🎬 Film Buddy

A single-page application built with **JavaScript (ES6 modules)** and **Capacitor.js** for managing your personal movie watchlists. Search movies via the OMDb API and persist your data securely with Back4App Cloud Code.

---

## 🚀 Key Features

* 🔍 **Movie Search** – Search by title (movie, series, episode) using the OMDb API.
* 📖 **Watchlist & Watched** – Add, move, and remove movies between lists.
* 🔐 **User Authentication** – Secure login/signup with tooltip-based form validation and session management.
* ⚡ **Responsive UI** – Mobile-optimized layout, theme toggling (light/dark), and dynamic DOM templating.
* 🔔 **Alerts & Modals** – Inline feedback with spinners and alert modals for all actions.
* 🌐 **Offline Handling** – Detect offline status, show error messages.

---

## 🛠 Tech Stack

* **Capacitor.js** – Package as a native mobile app for Android and iOS.
* **OMDb API** – Public movie database API for search and detailed movie information.
* **Back4App (Parse Server)** – Cloud functions for authentication, data validation, and list management.
* **Vanilla DOM Manipulation** – Lightweight, dependency-free UI updates via template cloning.

---

## 🔗 Frontend ↔ Cloud Integration

This frontend leverages **Back4App Cloud Code** (`/cloud/main.js`) for all server-side logic.
Call cloud functions like `list_get`, `list_add`, `fetchMoviesFromOMDb`, or `fetchMovieById` via the Parse SDK:

```js
import { runCloudSafe } from "../core/listsApi";

// Fetch watchlist
const { data: lists } = await runCloudSafe("list_get");

// Search movies
const { data: movies } = await runCloudSafe("fetchMoviesFromOMDb", { query: "Inception" });
```

Ensure your Cloud Code is deployed on Back4App before running the frontend.

---

## 🚶‍♂️ Installation & Usage

1. **Clone the repository:**

   ```bash
   git clone https://github.com/amir-nikfa/film-buddy.git
   cd film-buddy
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Run development server:**

   ```bash
   npm start
   ```
4. **Build for production:**

   ```bash
   npm run build
   ```
5. **Open android studio:**

   ```bash
   npx cap sync
   npx cap open android # or ios
   ```

---

## 🎓 How It Works

1. **Initialization** (`app.js`): sets theme, restores session, and renders existing lists.
2. **Authentication**: invokes cloud code for secure login/signup, updates UI on success.
3. **Search & Add**: queries OMDb via cloud, normalizes data, and displays results in a modal.
4. **List Management**: uses `list_add` and `list_remove` cloud functions; updates UI and localStorage.
5. **Offline Handling**: shows error modals.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for bug fixes, new features, or improvements.

---

## 📄 License

MIT © 2025 Amirhosein Nikfallah

GitHub: [amir-nikfa](https://github.com/amir-nikfa)
