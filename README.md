# elbill

**elbill** is a live television and cinema streaming platform engineered for every screen format: iPhone, Android smartphones, tablets, laptops, and Smart TVs. Crafted with an iPhone 18 liquid-glass design language, elbill delivers high-definition HLS video playback, worldwide broadcast networks, an interactive electronic program guide (EPG), and instant multi-screen synchronization.

---

## Key Features

- **Liquid Glass Interface**: High-translucency frosted glass surfaces, light refraction borders, smooth iOS-style physics, and dark mode by default with light toggle.
- **Universal Screen Architecture**:
  - **Smartphones**: Floating liquid glass bottom navigation bar, safe-area inset management (`pb-safe`, `pt-safe`), thumb-zone ergonomics.
  - **Tablets & Foldables**: Dual-column layout with a side navigation rail.
  - **Desktop**: Three-zone top navigation bar, widescreen grids, and keyboard accelerators.
  - **Smart TV (10-Foot UI)**: Full D-pad remote navigation with arrow keys, Enter, and Back/Escape, accompanied by luminous cyan focus indicators.
- **Worldwide Broadcast Networks**:
  - Sourced from free verified international networks and iptv-org public data.
  - Multi-tier filtering across continents (Africa, Europe, Asia, North America, South America, Oceania) and individual countries with flags.
  - Category filtering across News, Sports, Movies, Kids, Music, Entertainment, Documentary, and Business.
  - Automatic country detection to show regional broadcasts first.
  - Intelligent stream health verification with automatic failover and countdown skip.
- **Full-Screen HLS Player (`hls.js`)**:
  - Up/Down channel switching via remote controls or hotkeys (`ArrowUp` / `ArrowDown`).
  - Adaptive bitrate stream quality selector (Auto, 1080p, 720p, 480p, 360p).
  - Picture-in-Picture (PiP), WebVTT subtitles, AirPlay, and Chromecast casting support.
- **Cinema & Series Catalog**:
  - Curated films and television series with synopsis, cast, and embedded high-definition trailers.
  - TMDB v3 integration with configurable region and language localization.
- **Centralized Database & Cross-Platform Sync**:
  - Synchronizes watch history, resume bookmarks, and favorite channels across web, mobile, tablet, and TV screens using 6-character pairing tokens.
  - Local JSON backup export and import.
- **Progressive Web App & Android App**:
  - Full PWA compliance with maskable icons and auto-updating service worker.
  - In-app Android WebAPK and application package installer with instant camera QR scanning.

---

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm or yarn

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be served at `http://localhost:3000`.

3. Build for production:
   ```bash
   npm run build
   ```

---

## Configuration

### 1. Adding Channels via `channels.json`

elbill includes a channel override file located at:
```
public/channels.json
```

You can append your own licensed HLS feeds or M3U8 streams directly into this file:

```json
[
  {
    "id": "my-channel-id",
    "name": "My Channel HD",
    "logo": "https://example.com/logo.png",
    "category": "Sports",
    "country": "US",
    "countryName": "United States",
    "continent": "North America",
    "language": "English",
    "url": "https://example.com/live/master.m3u8",
    "nowPlaying": "Championship Live",
    "isFeatured": true
  }
]
```

You can also add custom streams directly inside the application by navigating to **Live TV** &rarr; **Add Custom Stream**.

### 2. Setting Up TMDB API

To load dynamic live movie and series posters, backdrops, and cast metadata:

1. Obtain a free API key from [The Movie Database](https://www.themoviedb.org/).
2. Add your key into `.env`:
   ```env
   VITE_TMDB_API_KEY="your_actual_tmdb_api_key_here"
   ```
3. Alternatively, you can enter your key directly inside the app by going to **Settings** &rarr; **TMDB API & Localization**.

---

## Keyboard & Remote Navigation Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause Stream |
| `ArrowUp` | Previous Channel / Up Navigation |
| `ArrowDown` | Next Channel / Down Navigation |
| `ArrowLeft` / `ArrowRight` | Horizontal Grid Navigation |
| `Enter` | Select / Activate |
| `F` | Toggle Fullscreen |
| `M` | Mute / Unmute Audio |
| `Escape` / `Backspace` | Close Player / Dismiss Modal / Return Home |
