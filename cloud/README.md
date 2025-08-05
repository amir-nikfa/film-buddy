# ☁️ Film Buddy Cloud Code

This directory contains the **server-side** code for Film Buddy, powered by Back4App (Parse Server). The Cloud Code here runs **only** on Back4App and is **not** bundled with the front-end.

---

## 📦 Back4App Database Setup

On your Back4App backend, you **must** have a `List` class with the following columns:

| Column Name | Type       | Description                               |
|-------------|-----------|-------------------------------------------|
| `watchlist` | Array     | Stores IDs of movies in the watchlist.    |
| `watched`   | Array     | Stores IDs of movies marked as watched.   |
| `user`      | Pointer<_User> | Links the list to the user who owns it. |

### 🔒 Security Tip
- In your Back4App app settings, you can **restrict creating new classes** to prevent accidental schema changes.
- Ensure proper ACLs are applied: each `List` object should be private to its owner.

---

## ☁️ Cloud Code Overview

* **Location:** `/cloud/main.js`
* **Purpose:** Securely handle:

  * User sign-up validation
  * Movie list operations (watchlist & watched)
  * OMDb API requests (search & lookup)
* **Runtime:** Node.js on Back4App with Parse SDK

---

## 🔒 User Validation Trigger

A `beforeSave` trigger on `Parse.User` enforces custom rules:

* **Username rules:**

  * Must start with a letter
  * Only letters, numbers, and underscores allowed
  * Length between 5 and 20 characters
* **Password rules:**

  * At least 8 characters
  * Contains uppercase, lowercase, number, and special character

Invalid credentials throw a `Parse.Error` with a clear message.

---

## 📦 Movie List Cloud Functions

All functions require an authenticated user (`req.user` exists):

1. **`list_get`**

   * Returns the user’s `watchlist` and `watched` arrays.

2. **`list_add`**

   * Adds one or multiple unique movie IDs to a specified field (`watchlist` or `watched`).

3. **`list_remove`**

   * Removes one or multiple movie IDs from a specified field.

Each `List` object is ACL-restricted to its owner and uses `useMasterKey` for secure operations.

---

## 🎥 OMDb API Cloud Functions

Keep your OMDb API key safe by fetching data server-side:

* **`fetchMoviesFromOMDb`**

  * Searches by title (optional `type`) and returns an array of results.

* **`fetchMovieById`**

  * Fetches full movie details by IMDb ID.

These functions wrap Node’s `https` module and return parsed JSON or throw on errors.

---

## 🚀 Deploying Cloud Code

1. **Install Parse CLI** (if needed):

   ```bash
   npm install -g parse-server parse-dashboard
   ```
2. **Login to Back4App:**

   ```bash
   parse login
   ```
3. **Deploy Cloud Code:**

   ```bash
   cd cloud
   parse deploy
   ```

After deployment, `/cloud/main.js` is active, and your front-end can invoke these functions.

---

## 🔗 Frontend Integration

Ensure you have deployed `/cloud/main.js` before running the front-end.
Use the Parse SDK or your helper `runCloudSafe` in `src/scripts/core/listsApi.js`:

```js
import { runCloudSafe } from "../core/listsApi";

// Get lists
const { data: lists } = await runCloudSafe("list_get");

// Search movies
const { data: movies } = await runCloudSafe("fetchMoviesFromOMDb", { query: "Inception" });
```

---

## 📄 License

MIT © 2025 Amirhosein Nikfallah

GitHub: [amir-nikfa](https://github.com/amir-nikfa)

