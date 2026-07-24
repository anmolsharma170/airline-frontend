# ✈️ AeroMesh - Full-Stack Airline Booking Platform

### A High-Fidelity React 19 Client & Distributed Microservices Ecosystem for Commercial Aviation

<br/>

<div align="center">

#### Frontend Stack
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Three.js r134](https://img.shields.io/badge/Three.js_r134-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vanta.js Clouds](https://img.shields.io/badge/Vanta.js_Clouds-ff3f81?style=for-the-badge)](https://www.vantajs.com/)
[![tsParticles Confetti](https://img.shields.io/badge/tsParticles_Confetti-4cc9f0?style=for-the-badge)](https://particles.js.org/)

#### Backend Stack
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

<br/>

> *AeroMesh is a modern commercial aviation platform featuring a high-fidelity client built with pure Vanilla CSS, interactive 3D WebGL backgrounds, real-time seat reservation countdowns, celebratory confetti animations, and role-based admin panels. The system is backed by a fully distributed, event-driven microservices architecture designed to solve the hardest problems in backend systems: race conditions, transactional consistency, asynchronous decoupling, and centralized security.*

---

## 🏗️ System Architecture Overview

```
                          ┌─────────────────────────────────────┐
                          │     CLIENT (Web / React 19 Client)  │
                          └──────────────────┬──────────────────┘
                                             │ Port 5173
                          ┌──────────────────▼──────────────────┐
                          │         🛡️  API GATEWAY              │
                          │   Rate Limiting → JWT Auth → RBAC   │
                          │      Reverse Proxy & Routing         │
                          └─────┬─────────────────────┬─────────┘
                                │ Port 3000           │ Port 3000
               ┌────────────────▼───┐     ┌───────────▼────────────┐
               │  ✈️  FLIGHT SERVICE │     │ 🎫 BOOKING SERVICE     │
               │  Airplanes, Cities │     │ Tickets, Payments,     │
               │  Airports, Flights │     │ Seat Reservation       │
               │  Seat Inventory    │◄────│ Cron Job Cleanup       │
               └────────────────────┘     └────────────┬───────────┘
                    Port 4000                          │ Port 5000
                                                       │ RabbitMQ
                                         ┌─────────────▼───────────┐
                                         │ 📧 NOTIFICATION SERVICE  │
                                         │ Email Dispatch, Tickets  │
                                         │ Async Queue Consumer     │
                                         └──────────────────────────┘
                                              Port 3004 / Worker
```

---

## 🎨 Design & Aesthetic System

AeroMesh combines deep navy hues, vibrant crimson accents, and warm daytime sky themes to create a sleek aviation interface:

*   **☁️ 3D WebGL Vanta Clouds Hero**: Powered by `Three.js` (r134) and `Vanta.js Clouds` loaded via CDN, rendering interactive, animated daytime skies or midnight skies in real-time on the landing page [Home.jsx](file:///c:/airline-frontend/src/pages/Home.jsx).
*   **🌙 Interactive Night Mode**: Seamless 1-click toggle between Day Mode and Night Mode with persistent state (`localStorage`), persistent CSS variables, and dynamic clouds parameters (`#050510` night sky, indigo clouds, and cyan moonlight aura).
*   **🎉 Celebratory Booking Confetti**: Integrates `@tsparticles/confetti` to launch a multi-color celebratory burst center-screen when a traveler successfully issues their digital boarding pass.
*   **Glassmorphic Cards**: Flight selectors, status popups, and auth screens use frosted glass styling with background blur (`backdrop-filter`) and light borders.
*   **AeroCard Graphic**: Interactive credit card form in checkout that renders inputs live onto a virtual plastic card preview graphic.
*   **Typography**: Styled using Google Fonts (`Outfit` for high-impact headings and `Inter` for crisp body copy) configured in [index.css](file:///c:/airline-frontend/src/index.css).

---

## 🧩 Key Features & Capabilities

### 1. 🔍 Live Autocomplete Flight Search (Frontend)
*   Search departure and arrival hubs via **instant focus and query suggestions**. Matches airport names, IATA 3-letter codes (e.g. `DEL`, `BOM`, `JFK`), or city names in [Home.jsx](file:///c:/airline-frontend/src/pages/Home.jsx).
*   Handles both API-provided airport objects and localized offline datasets seamlessly inside [api.js](file:///c:/airline-frontend/src/services/api.js).

### 2. 🚦 4-Step Interactive Checkout Flow (Frontend)
*   **Passenger Details**: Dynamic passenger form inputs matching selected guest counts in [BookingFlow.jsx](file:///c:/airline-frontend/src/pages/BookingFlow.jsx).
*   **Seat Reservation Window**: Features a **5-minute live countdown timer** reflecting the backend microservice's automated seat-release cron job.
*   **Secure Card Checkout**: Integrated payment form with real-time virtual card rendering.
*   **Boarding Pass & Confetti**: Generates a digital boarding pass ticket with flight number, gate, and barcode, while firing a `@tsparticles/confetti` burst.

### 3. 👤 Traveler Trip Dashboard (Frontend)
*   **Segmented Views**: Filter tickets by status (`All`, `Active`, `Holds/Pending`, `Cancelled`) in [UserDashboard.jsx](file:///c:/airline-frontend/src/pages/UserDashboard.jsx).
*   **Maharaja Rewards**: Gamified flyer loyalty progress bar showing points accumulation.
*   **Inline Boarding Pass**: Expand tickets inline to reveal full digital boarding passes.
*   **Order Cancellation**: Triggers Saga compensating paths to release seat holds and update statuses to `CANCELLED`.

### 4. 🛡️ Admin Management Console (Frontend)
*   **Role-Based Access Control**: Protected routes ensuring only users containing `Admin` or `FlightCompany` roles can enter `/admin`.
*   **Operational Analytics**: Metrics displaying active aircraft count, connected hub nodes, and scheduled routes in [AdminDashboard.jsx](file:///c:/airline-frontend/src/pages/AdminDashboard.jsx).
*   **Fleet Management**: Register new aircraft models, update capacity parameters, or decommission serials.
*   **Flight Scheduler**: Create schedules linking airplanes, origin/destination airports, gates, dates, and prices.

---

## 🚀 Backend Engineering & Distributed Systems Solved

The backend composed of four microservices was engineered to tackle specific, hard engineering problems encountered at scale:

### 1. 🔒 Distributed Race Condition — Preventing Flight Overbooking
Two users trying to book the last available seat simultaneously will cause overbooking in a naive system. The solution implements:
*   An **ACID-compliant database transaction** (via Sequelize) in the Booking Service when initiating a booking.
*   A **synchronous HTTP check and decrement** to the Flight Service seat inventory.
*   If the Flight Service detects seat depletion, the Booking Service immediately **rolls back** its transaction, preventing double booking.

### 2. ⚡ Asynchronous Decoupling via Message Broker (RabbitMQ)
Sending confirmation emails inline with payment API calls introduces latency and couples booking to the SMTP server.
*   The Booking Service publishes a structured JSON payload to a **RabbitMQ** queue (`noti-queue`) immediately upon payment verification.
*   The Notification Service acts as an **asynchronous consumer**, pulling messages from the queue, issuing tickets via **Nodemailer**, and notifying the client.
*   Uses **manual acknowledgments (`channel.ack`)** to ensure no messages are lost if the notification service restarts mid-dispatch.

### 3. 🔄 Automated State Recovery — Cron-Based Garbage Collection
Users abandoning checkout mid-payment lock seat inventory. 
*   A background **Cron Job** (via `node-cron`) executes periodically.
*   It query-scans the DB for bookings stuck in `INITIATED` or `PENDING` states for over 5 minutes.
*   These are batch-updated to `CANCELLED` and a compensating HTTP request is triggered to the Flight Service to release the held seats back into the available pool.

### 4. 🧠 Saga-Like Distributed Transactions
To maintain eventual consistency across Flight and Booking databases without complex 2-Phase Commit locks:
*   On payment failures, the Booking Service executes a **compensating transaction** that calls the Flight Service's seat-release API.
*   The system guarantees that flight capacity and booking states stay synced even during network partitions or mid-flow crashes.

### 5. 🛡️ Centralized Authentication & RBAC at the Edge
Security is centralized at the **API Gateway**:
*   **JWT (JSON Web Tokens)**: Stateless token issuance and validation.
*   **Bcrypt**: Password hashing with custom salt rounds.
*   **RBAC Middleware**: Authorizes HTTP write requests (`POST`, `PUT`, `DELETE`) by checking user role hierarchies before reverse proxying requests downstream.

### 6. 🚦 DDoS Protection & Traffic Control (Rate Limiting)
*   **Rate Limiting**: Configured `express-rate-limit` at the API Gateway level (hard limit of **30 requests per 2 minutes per IP**), terminating malicious traffic before it hits backend application layers.

---

## 🗄️ Relational Database Design & Architecture

The backend utilizes normalized MySQL databases mapped through the Sequelize ORM.
*   **N-Tier Layered Architecture**: All services separate code into `Routes` → `Middlewares` → `Controllers` → `Services` → `Repositories` → `Models`.
*   **Generic `CrudRepository` Pattern**: Uses a base repository class to abstract CRUD operations. Entity repositories inherit basic methods, eliminating duplicate SQL/ORM code.
*   **Database Associations**:
    *   **City ↔ Airport (`1 : N`)**: Cascaded deletes (`ON DELETE CASCADE`) maintain structural integrity.
    *   **Airplane ↔ Seat (`1 : N`)**: Dynamic seat map configurations by class.
    *   **Airport ↔ Flight (`1 : N` aliased twice)**: A Flight links `departureAirportId` and `arrivalAirportId` referencing the Airport model twice.

---

## 👥 Roles & Ports Mapping

| Directory / Service | Port | Layer / Responsibility |
|:---|:---|:---|
| [airline-frontend](file:///c:/airline-frontend) | `5173` | React 19 Client Web Application (Vite 8) |
| [airlineapigateway](file:///C:/airlineapigateway) | `3000` | API Gateway Edge (JWT Auth, RBAC, Rate Limiting, Proxying) |
| [Airlinepro](file:///C:/Airlinepro) | `4000` | Flight Service (Fleets, Airports, Cities, Flight Scheduling) |
| [flightbookingservice](file:///C:/flightbookingservice) | `5000` | Booking Service (Ticketing, Payments, Seat Holds, Cleanup Cron) |
| [airplanenoticeservice](file:///C:/airplanenoticeservice) | `3004` | Notification Service (RabbitMQ consumer, SMTP Dispatcher) |

---

## 📂 Project Directory Structure

```text
c:/ (Workspace Root Directory)
 ├── airline-frontend/               # React 19 Client Web Application
 │    ├── public/                    # Static assets
 │    └── src/
 │         ├── components/           # Navbar, Footer, UI widgets
 │         ├── pages/                # Home, FlightSearch, BookingFlow, Dashboard, etc.
 │         ├── services/             # Axios API client & fallback state handlers
 │         └── index.css             # Main styling system variables & utilities
 ├── airlineapigateway/              # Edge Reverse Proxy
 │    ├── src/config/                # Server & JWT configs
 │    ├── src/middlewares/           # JWT verification & RBAC authorization
 │    └── src/index.js               # Entry point using http-proxy-middleware
 ├── Airlinepro/                     # Flight Service
 │    ├── src/models/                # City, Airport, Airplane, Flight, Seat definitions
 │    ├── src/repositories/          # Base CrudRepository & Flight repo extensions
 │    └── src/index.js               # Service router & server boot
 ├── flightbookingservice/           # Booking Service
 │    ├── src/services/              # Booking checkout operations & RabbitMQ publisher
 │    ├── src/utils/cron-jobs.js     # Scheduled abandoned-seat release cron
 │    └── src/index.js               # Service router & server boot
 └── airplanenoticeservice/          # Notification Service
      ├── src/config/                # Nodemailer SMTP transporter & RabbitMQ settings
      └── src/index.js               # Consumer loop and email dispatcher
```

---

## 🔑 How to Log In as Admin

The authentication system includes automatic role resolution:

1. Navigate to the **Sign In** page (`/login`).
2. Use **any email containing the word `admin`** (e.g., `admin@aeromesh.com` or `admin@gmail.com`).
3. Enter any password (minimum 6 characters, e.g., `123456`).
4. Click **Sign In**.
5. An **Admin Console** link (with a 🛡️ shield icon) will automatically appear in the top navbar, granting access to the route `/admin`.

---

## ⚙️ Local Development & Setup Guide

### Prerequisites
Make sure the following are installed and running locally:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   **MySQL Server** running on `localhost`
*   **RabbitMQ Server** running on port `5672` (or via Docker)

---

### Step 1: Install Dependencies
Open your terminal and install dependencies for the client and all microservices:

```bash
# Install Client
cd c:\airline-frontend && npm install

# Install API Gateway
cd C:\airlineapigateway && npm install

# Install Flight Service
cd C:\Airlinepro && npm install

# Install Booking Service
cd C:\flightbookingservice && npm install

# Install Notification Service
cd C:\airplanenoticeservice && npm install
```

---

### Step 2: Configure Environment Variables
Create a `.env` file in the root of each backend service directory:

#### **API Gateway** (`C:\airlineapigateway\.env`)
```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=1d
FLIGHT_SERVICE=http://localhost:4000
BOOKING_SERVICE=http://localhost:5000
```

#### **Flight Service** (`C:\Airlinepro\.env`)
```env
PORT=4000
```

#### **Booking Service** (`C:\flightbookingservice\.env`)
```env
PORT=5000
FLIGHT_SERVICE_PATH=http://localhost:4000
RABBITMQ_URL=amqp://localhost
```

#### **Notification Service** (`C:\airplanenoticeservice\.env`)
```env
PORT=3004
MAIL_ID=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
```

> **Database Configs**: For each service requiring a database connection, update `src/config/config.json` with your MySQL server credentials (`username`, `password`, `database`, `host`).

---

### Step 3: Initialize Databases
Run Sequelize commands to create databases, run migrations, and populate seeds in the respective directories:

```bash
# Flight Service DB Setup
cd C:\Airlinepro
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all

# Booking Service DB Setup
cd C:\flightbookingservice
npx sequelize db:create
npx sequelize db:migrate

# API Gateway DB Setup
cd C:\airlineapigateway
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

---

### Step 4: Boot the Platform

Open five separate terminal tabs/windows to start the full system:

```bash
# Tab 1: Flight Service
cd C:\Airlinepro && npm run dev

# Tab 2: Booking Service
cd C:\flightbookingservice && npm run dev

# Tab 3: Notification Service
cd C:\airplanenoticeservice && npm run dev

# Tab 4: API Gateway (Start gateway after services are up)
cd C:\airlineapigateway && npm run dev

# Tab 5: Frontend Client Web App
cd c:\airline-frontend && npm run dev
```

The frontend client will run at [http://localhost:5173](http://localhost:5173). All network calls are reverse-proxied to [http://localhost:3000](http://localhost:3000).

---

### Step 5: Verify Connectivity
You can run the end-to-end integration and connection test script in the frontend directory to verify that all microservices are communicating correctly:

```bash
cd c:\airline-frontend
node verify-backend.js
```
The [verify-backend.js](file:///c:/airline-frontend/verify-backend.js) script logs into the API Gateway, queries the Flight Service database, holds a seat reservation, initiates payment, triggers notification events through RabbitMQ, and fetches trip logs.

---

## 🌐 API Reference (Via API Gateway)

All network traffic routes through the API Gateway on port `3000`.

### ✈️ Fleet & Scheduling (Flight Service Proxy)
*   `GET /flightService/api/v1/airplanes` - Retrieve all registered aircraft
*   `POST /flightService/api/v1/airplanes` - Register new aircraft (Admin required)
*   `GET /flightService/api/v1/flights` - Query flights with query filter parameters
*   `POST /flightService/api/v1/flights` - Publish a new flight schedule (FlightCompany role required)
*   `GET /flightService/api/v1/cities` - List configured origin/destination cities
*   `POST /flightService/api/v1/cities` - Insert a new city node (Admin required)

### 🎫 Bookings & Payments (Booking Service Proxy)
*   `POST /bookingService/api/v1/bookings` - Create a booking (Requires `x-access-token` header)
*   `POST /bookingService/api/v1/bookings/payments` - Complete checkout payment (Requires `x-access-token` & unique `x-idempotency-key` headers)
*   `GET /bookingService/api/v1/bookings/user/:id` - Fetch ticket history for traveler

### 👤 Authentication Edge (Gateway Direct)
*   `POST /api/v1/signup` - Register a traveler profile
*   `POST /api/v1/signin` - Authenticate account and resolve JWT auth token
*   `POST /api/v1/roles` - Assign roles to an user (Admin required)

---

## 🧠 Core Architectural Concepts Demonstrated

| Architectural Concept | Implementation Context / Component |
|:---|:---|
| **Microservices Architecture** | Split domains: Edge Proxy, Flight Scheduling, Booking Core, Async Email Workers. |
| **Edge API Gateway Pattern** | Throttling DDoS rates and verifying RBAC credentials in a centralized gateway. |
| **Asynchronous Message Broker** | RabbitMQ broker handles transaction notifications safely decoupled from web requests. |
| **Saga & Compensating Flow** | Booking Service triggers seat increment rollbacks on downstream payment failures. |
| **Cron Garbage Collection** | Automatically releases seats held by abandoned checkouts every 30 minutes. |
| **Database Version Control** | Sequelize CLI migrations track the historical development of database schemas. |
| **Centralized Logging** | Winston configured across all microservices for persistence and monitoring. |
| **Fault-Tolerant Messaging** | Manual amqplib acknowledgments keep tasks in queue until email dispatch is confirmed. |
