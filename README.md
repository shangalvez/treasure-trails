# Treasure Trails

Treasure Trails is a child-friendly treasure hunt maze game built with **React + Vite + TypeScript + Tailwind CSS**, designed to deploy cleanly on **Netlify**.

It includes:

- 10 original cute characters
- 20 static maze levels with increasing difficulty
- keyboard, touch, and swipe movement
- medals and trophy tracking
- local guest save support
- Netlify Identity-ready authentication
- Netlify Functions + Netlify Blobs private per-user save storage
- offline-first local fallback with sync-on-return behavior

## Tech stack

- React 19
- Vite
- TypeScript
- Tailwind CSS 4
- Netlify Identity via `@netlify/identity`
- Netlify Functions
- Netlify Blobs for simple private profile storage

## Folder structure

```text
.
├─ netlify/
│  ├─ functions/
│  │  └─ profile.ts
│  └─ lib/
│     └─ profile-store.ts
├─ src/
│  ├─ components/
│  ├─ context/
│  ├─ data/
│  ├─ pages/
│  ├─ services/
│  └─ utils/
├─ .env.example
├─ index.html
├─ netlify.toml
├─ package.json
└─ vite.config.ts
```

## Install steps

1. Make sure you have **Node.js 20+** installed.
2. Install dependencies:

```bash
npm install
```

## Local development

Run the app with the Vite dev server:

```bash
npm run dev
```

Because this project includes `@netlify/vite-plugin`, local Vite development can emulate Netlify platform primitives for functions, redirects, blobs, and environment handling.

If you prefer Netlify CLI, you can also use:

```bash
netlify dev
```

## Build steps

Create a production build:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

## Netlify deployment steps

1. Push this project to a Git provider.
2. In Netlify, create a new project from that repository.
3. Confirm the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy.

The included `netlify.toml` already defines the build command, publish directory, functions directory, Node version, and SPA fallback redirect.

## How to enable authentication

Netlify’s current Identity docs recommend enabling Identity in the Netlify UI and using the `@netlify/identity` package in your code. Netlify also recommends enabling Identity from **Project configuration > Identity**, and using `handleAuthCallback()` on page load for confirmation, recovery, or OAuth hash callbacks. `getUser()` works in both browser and server contexts, and server-side user checks can run in Netlify Functions.

To enable Identity for this site:

1. In Netlify, open **Project configuration > Identity**.
2. Choose **Enable Identity**.
3. Set registration to **Open** or **Invite only**, depending on your use case.
4. If you want email confirmation, leave it on. If you want immediate access during testing, enable autoconfirm.
5. Redeploy the site if needed.

### Login / signup behavior

- Guest players can still play immediately with local browser saving.
- Logged-in players get a private profile stored in Netlify Blobs via a Netlify Function.
- If Identity is not configured yet, the site still works in guest mode and can use the demo helper.

## How save data works

### Guest mode

Guest saves live in `localStorage` only on that browser:

- player name
- selected character
- unlocked levels
- completed levels
- medals
- settings
- current level

### Logged-in mode

Logged-in players save in two places:

1. **local browser cache** for fast resumes and offline fallback
2. **Netlify Blobs** through `/.netlify/functions/profile`

Each logged-in user’s profile is written to a store key based on their Identity user ID, which keeps saved data private per account. Netlify documents Blobs as a site-wide key/value store suitable for simple app data, and `getStore()` can be used inside Functions for persisted cross-deploy storage. Netlify’s Identity docs show `getUser()` inside Functions for checking the authenticated user and returning a 401 when the request is unauthenticated.

### Offline fallback and sync

When a logged-in player is offline:

- updates are stored locally
- the profile is marked as pending sync
- when the browser comes back online, the app tries to sync the latest merged profile to Netlify automatically

This keeps the game playable even without a live network connection.

## Demo mode

Set this in a `.env` file to show the demo helper banner locally:

```bash
VITE_DEMO_MODE=true
```

That unlocks the “Load demo run” button and helps test the UI before auth is configured.

## Notes about the platform setup

Netlify’s Vite guide says the `@netlify/vite-plugin` provides local emulation of Functions, Blobs, redirects, environment variables, and other platform primitives while running a Vite dev server. Netlify’s Vite docs also note that Vite projects commonly deploy with `npm run build` and `dist` as the publish directory. Tailwind’s docs recommend the streamlined Vite setup for modern projects, and Vite’s guide describes its optimized production build output.

## Accessibility features included

- semantic HTML landmarks
- visible focus states
- high contrast toggle
- reduced motion toggle
- keyboard movement with arrow keys and WASD
- on-screen large touch controls
- swipe movement support
- readable card-based layouts
- clear status messaging
- no color-only state communication

## Character list

1. Pippin the Fox
2. Mochi the Bunny
3. Tiko the Panda
4. Lulu the Cat
5. Bobo the Bear
6. Nini the Chick
7. Pebble the Turtle
8. Zuzu the Deer
9. Coco the Koala
10. Mimi the Mouse
