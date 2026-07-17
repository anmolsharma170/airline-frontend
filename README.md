# ✈️ AeroIndia Airlines - Booking Platform Frontend

### A Premium, High-Fidelity, and Responsive React JS Client for Distributed Airline Microservices

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide_React-FF6600?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)

<br/>

> *Designed to deliver a world-class, premium user experience. Built with pure Vanilla CSS for layout flexibility, featuring glassmorphism, responsive dashboard grids, real-time seat timers, and modular API service integrations.*

---

## 🎨 Premium Brand Aesthetics

AeroIndia's visual design is inspired by the premium elements of commercial air travel, combining deep crimson red and warm metallic gold accents against a clean slate/alabaster backdrop.

*   **Dynamic Design**: Subtle fade-in, slide-up, and pulsing animations that make the application feel fluid and responsive.
*   **Modern Typography**: Styled using custom Google Fonts (`Outfit` for high-impact headings and `Inter` for highly legible bodies).
*   **Glassmorphic Widgets**: Flight selectors and checkout sidebars use frosted glass styling with blur backdrops (`backdrop-filter`) and light outlines.
*   **AeroCard Virtual Graphic**: As passengers type in checkout card numbers, their inputs render in real-time onto an animated plastic credit card wrapper.

---

## 🧩 Key Features Implemented

### 1. 🔍 Live Autocomplete Flight Search
*   Select departure and destination hubs via **real-time suggestion inputs** fetching live airport databases from the Flight microservice.
*   Gracefully falls back to localized mock travel hubs if the database connection is offline, maintaining interface usability.

### 2. 🚦 Interactive Multi-Step Checkout Flow
*   **Step 1: Passenger Information**: Dynamic form fields loop matching traveler counts.
*   **Step 2: Seat Reservation Hold Timer**: Renders a **5-minute live checkout countdown**, providing a clear visual representation of the backend's automated seat-release cron job.
*   **Step 3: Secure Card Payment**: Interactive credit card form rendering parameters onto a virtual card graphic.
*   **Step 4: Digital Boarding Pass**: Displays a boarding pass with passenger name, flight number, times, gate location, and a barcode. Highlights the successful publishing of confirmation mail events to the RabbitMQ queue.

### 3. 👤 Traveler Trip Dashboard
*   **Trip Filter Tabs**: Segment trips by status (`All`, `Active`, `Holds/Pending`, `Cancelled`).
*   **AeroMiles Rewards Milestone**: A gamified flyer loyalty widget showing current miles progress towards loyalty tiers.
*   **Expandable Boarding Pass**: confirmed tickets expand inline, revealing the digital boarding pass ticket.
*   **Compensating Cancellations**: Cancelling active bookings triggers Saga compensating paths, reverting seat reserves and changing status to `CANCELLED`.

### 4. 🛡️ Admin Operations Console
*   **Operational Analytics Widgets**: Summary cards displaying active airplanes, connected city hubs, and airport locations.
*   **Live Microservices Monitor**: Pulsing green status dots checking connections to the API Gateway (`3000`), Flight scheduling (`4000`), Booking server (`5000`), and RabbitMQ queues.
*   **Fleet Catalog CRUD**: Register new airplane serials or decommission older aircraft from the fleet.
*   **Schedules Form Builder**: Create new flight schedules by selecting aircraft capacity, linking airport codes, scheduling departure dates, and mapping gates.

---

## 📂 Project Organization

```text
src/
 ├── assets/          # Project images (hero graphic, icons, logos)
 ├── components/      # Reusable layout shell blocks (Navbar, Footer)
 ├── pages/           # Page-level components (Home, FlightSearch, BookingFlow, Dashboards, Auth)
 ├── services/        # Axios API wrapper configs and gateway path mappings
 ├── index.css        # Centralized design system variables, resets, button types, and animations
 └── main.jsx         # React application entry hook
```

---

## ⚡ Local Installation & Run Setup

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v14+) installed.

### Step 1 — Clone and Install

```bash
git clone https://github.com/anmolsharma170/airline-frontend.git
cd airline-frontend
npm install
```

### Step 2 — Configure Service Endpoints

The API integration layer (`src/services/api.js`) points by default to the Edge API Gateway on port `3000`:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```
Ensure your backend microservices are running locally to allow successful gateway queries.

### Step 3 — Boot Development Server

```bash
npm run dev
```
Open `http://localhost:5173` (or the port specified by Vite) in your browser.

### Step 4 — Compile Production Bundle

To build the static production distribution bundles:
```bash
npm run build
```
This generates a highly optimized `/dist` folder containing bundled client files ready to deploy.
