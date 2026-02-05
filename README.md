# Imposter Game

A web version of the popular Imposter game: one word, one imposter, find them. Purple theme, preset categories, and custom categories. Sign in to save your own categories and have them ready when you come back.

## Features

- **Preset categories** — Catagories to play if you do not wish to create your own 
- **Custom categories** — Create categories and add your own words (min 4)
- **Imposter sees "Imposter" in red** — The imposter gets the word "Imposter" (styled in red), not a different word; everyone else sees the real category word
- **Auth & saved categories** — Sign in with email/password (Firebase) to save custom categories and load them next time

## Run locally

Open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## Firebase (optional)

To enable sign-in and saved categories:

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Sign-in method → **Email/Password**
3. Create a **Firestore Database** (start in test mode or set rules as below)
4. Copy the config template and add your keys: **`cp config.example.js config.js`**, then edit `config.js` with your project values from Project settings → Your apps. **`config.js` is gitignored** so your API key is never committed.
5. In **Google Cloud Console → APIs & Services → Credentials**, open your API key and add **Application restrictions** (e.g. HTTP referrers for your domain) and **API restrictions** (e.g. restrict to Firebase APIs) to limit abuse.

Firestore rules for user categories (each user can only read/write their own):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/categories/{categoryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

If you don’t set up Firebase, the game still works; the sign-in button and saved categories are hidden.
