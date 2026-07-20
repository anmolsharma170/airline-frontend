# ✈️ AeroIndia Airlines - Booking Platform Frontend

### A High-Fidelity, Feature-Rich React 19 Client for Distributed Airline Microservices

<br/>

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js_r134-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vanta.js](https://img.shields.io/badge/Vanta.js_Clouds-ff3f81?style=for-the-badge)](https://www.vantajs.com/)
[![tsParticles](https://img.shields.io/badge/tsParticles_Confetti-4cc9f0?style=for-the-badge)](https://particles.js.org/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide_React-FF6600?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)

<br/>

> *AeroIndia is a modern commercial aviation web application designed with pure Vanilla CSS, dynamic 3D WebGL background rendering, real-time seat reservation countdown timers, celebratory booking animations, role-based admin consoles, and resilient offline microservice fallbacks.*

---

## 🎨 Design & Aesthetic System

AeroIndia combines deep navy hues, vibrant crimson accents, and warm daytime sky themes to create a sleek aviation interface:

*   **☁️ 3D WebGL Vanta Clouds Hero**: Powered by `Three.js` (r134) and `Vanta.js Clouds`, rendering interactive, animated daytime skies, sun glare, and shifting cloud masses in real-time.
*   **🎉 Celebratory Booking Confetti**: Integrates `@tsparticles/confetti` to launch a multi-color celebratory burst center-screen when a traveler successfully issues their digital boarding pass.
*   **Glassmorphic Cards**: Flight selectors, status popups, and auth screens use frosted glass styling with background blur (`backdrop-filter`) and light borders.
*   **AeroCard Graphic**: Interactive credit card form in checkout that renders inputs live onto a virtual plastic card preview graphic.
*   **Typography**: Styled using Google Fonts (`Outfit` for high-impact headings and `Inter` for crisp body copy).

---

## 🧩 Key Features & Capabilities

### 1. 🔍 Live Autocomplete Flight Search
*   Search departure and arrival hubs via **instant focus and query suggestions**. Matches airport names, IATA 3-letter codes (e.g. `DEL`, `BOM`, `JFK`), or city names.
*   Handles both API-provided airport objects and localized offline datasets seamlessly.

### 2. 🚦 4-Step Interactive Checkout Flow
1.  **Passenger Details**: Dynamic passenger form inputs matching selected guest counts.
2.  **Seat Reservation Window**: Features a **5-minute live countdown timer** reflecting the backend microservice's automated seat-release cron job.
3.  **Secure Card Checkout**: Integrated payment form with real-time virtual card rendering.
4.  **Boarding Pass & Confetti**: Generates a digital boarding pass ticket with flight number, gate, and barcode, while firing a `@tsparticles/confetti` burst (`80` particles, `55°` spread, `#ff577f`, `#ffd166`, `#06d6a0`, `#4cc9f0`).

### 3. 👤 Traveler Trip Dashboard
*   **Segmented Views**: Filter tickets by status (`All`, `Active`, `Holds/Pending`, `Cancelled`).
*   **Maharaja Rewards**: Gamified flyer loyalty progress bar showing points accumulation.
*   **Inline Boarding Pass**: Expand tickets inline to reveal full digital boarding passes.
*   **Order Cancellation**: Triggers Saga compensating paths to release seat holds and update statuses to `CANCELLED`.

### 4. 🛡️ Admin Management Console
*   **Role-Based Access Control**: Protected routes (`AdminProtectedRoute`) ensuring only `Admin` or `FlightCompany` roles can enter `/admin`.
*   **Operational Analytics**: Metrics displaying active aircraft count, connected hub nodes, and scheduled routes.
*   **Fleet Management**: Register new aircraft models, update capacity parameters, or decommission serials.
*   **Flight Scheduler**: Create schedules linking airplanes, origin/destination airports, gates, dates, and prices.

---

## 🔑 How to Log In as Admin

The authentication service includes automatic role resolution:

1. Go to the **Sign In** page (`/login`).
2. Use **any email containing the word `admin`** (e.g., `admin@aeroindia.com` or `admin@gmail.com`).
3. Enter any password (minimum 6 characters, e.g., `123456`).
4. Click **Sign In**.

An **Admin Console** link (with a 🛡️ shield icon) will automatically appear in the top navbar, giving access to `http://localhost:5173/admin`.

---

## 📂 Project Architecture

```text
c:/airline-frontend/
 ├── index.html            # Main HTML shell; loads Three.js & Vanta Clouds CDNs
 ├── package.json          # Dependencies (@tsparticles/confetti, axios, lucide-react, react, react-router-dom)
 ├── vite.config.js        # Vite build tool setup
 └── src/
      ├── assets/          # Brand images, hero banners, and vector assets
      ├── components/      # Reusable UI shells (Navbar, Footer)
      ├── pages/           # Application views
      │    ├── Home.jsx           # Landing page with Vanta Clouds & airport search
      │    ├── FlightSearch.jsx   # Available flight listings & filters
      │    ├── BookingFlow.jsx    # 4-step wizard with seat timer & celebratory confetti
      │    ├── UserDashboard.jsx  # Trip history & digital boarding passes
      │    ├── AdminDashboard.jsx # Fleet catalog & schedule manager
      │    ├── Login.jsx          # Authentication page with Admin detection
      │    └── Register.jsx       # User registration page
      ├── services/
      │    └── api.js             # Axios client, interceptors, API Gateway routes & offline fallbacks
      ├── App.jsx                 # Client router & protected route guards
      ├── index.css               # Design system tokens, variables, utility classes, and media queries
      └── main.jsx                # React root mount script
```

---

## ⚙️ Service Endpoints & Gateway Setup

The client routes all requests through the API Gateway endpoint defined in `src/services/api.js`:

| Service | Port | Endpoint Proxy |
| :--- | :--- | :--- |
| **API Gateway Edge** | `3000` | `http://localhost:3000` |
| **Flight Service** | `4000` | `/flightService/api/v1/*` |
| **Booking Service** | `5000` | `/bookingService/api/v1/*` |
| **Auth Edge Service** | `3000` | `/api/v1/*` |

> *Note: If backend microservices are offline, the frontend automatically falls back to offline state management, allowing full offline exploration of search, booking, and admin features.*

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anmolsharma170/airline-frontend.git
cd airline-frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates a production build in the `/dist` directory.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: React 19, Vite 8
- **Routing**: React Router Dom 7
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Graphics & FX**: Three.js (r134), Vanta.js (Clouds), `@tsparticles/confetti`
- **Styling**: Vanilla CSS3 (Custom Design System with Variables & Grid Layouts)
