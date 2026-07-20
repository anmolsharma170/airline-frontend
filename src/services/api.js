import axios from 'axios';

// API Gateway base URL. All microservices are proxied through port 3000.
const API_BASE_URL = 'http://localhost:3000';

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// REQUEST INTERCEPTOR: Automatically attach the JWT token if the user is logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // In Express microservice projects, tokens are often passed in 'x-access-token'
      config.headers['x-access-token'] = token;
      // Also provide standard Bearer header for flexibility
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Global response and error handler
apiClient.interceptors.response.use(
  (response) => {
    // The backend wraps results in a standard Response structure.
    // We automatically extract the success payload to simplify component usage.
    return response.data;
  },
  (error) => {
    // Standardize backend error messaging
    const errorMessage = 
      error.response?.data?.explanation || 
      error.response?.data?.message || 
      'An unexpected error occurred. Please try again.';
      
    // Handle Session Expiry (401/403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // If we receive an unauthorized status, we clear credentials from storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      originalError: error
    });
  }
);

/* ==========================================
   1. AUTHENTICATION SERVICE (API Gateway Edge)
   ========================================== */
export const authService = {
  // Register a new user account
  register: async (email, password) => {
    try {
      return await apiClient.post('/api/v1/register', { email, password });
    } catch (err) {
      // If there is no response status, it means the server is offline or unreachable
      if (!err.status) {
        console.warn('Backend is offline. Falling back to local offline storage.');
        
        // Retrieve existing offline users
        const offlineUsersRaw = localStorage.getItem('offline_users');
        const offlineUsers = offlineUsersRaw ? JSON.parse(offlineUsersRaw) : [];
        
        // Check if user already exists
        if (offlineUsers.some(u => u.email === email)) {
          throw new Error('This email is already in use (Offline Mode).');
        }
        
        // Save user
        offlineUsers.push({ email, password });
        localStorage.setItem('offline_users', JSON.stringify(offlineUsers));
        
        return {
          success: true,
          message: 'Account created locally (Offline Mode)',
          data: { email }
        };
      }
      throw err;
    }
  },

  // Log in and receive JWT token
  login: async (email, password) => {
    try {
      return await apiClient.post('/api/v1/login', { email, password });
    } catch (err) {
      if (!err.status) {
        console.warn('Backend is offline. Falling back to local offline authentication.');
        
        // Retrieve existing offline users
        const offlineUsersRaw = localStorage.getItem('offline_users');
        const offlineUsers = offlineUsersRaw ? JSON.parse(offlineUsersRaw) : [];
        
        // Find matching user
        const matchedUser = offlineUsers.find(u => u.email === email);
        if (!matchedUser) {
          throw new Error('No account found with this email in offline mode. Please sign up first.');
        }
        
        if (matchedUser.password !== password) {
          throw new Error('Incorrect password (Offline Mode).');
        }
        
        // Determine role: if email includes 'admin', make them Admin
        const role = email.toLowerCase().includes('admin') ? 'Admin' : 'Customer';
        
        return {
          success: true,
          data: {
            token: 'mock-jwt-token-offline-' + Date.now(),
            user: {
              id: 'offline-user-' + email,
              email: email,
              role: role,
              roles: [{ name: role }]
            }
          }
        };
      }
      throw err;
    }
  },

  // Assign user roles (Admin Only)
  assignRole: async (userId, roleName) => {
    try {
      return await apiClient.post('/api/v1/roles', { userId, roleName });
    } catch (err) {
      if (!err.status) {
        console.warn('Backend is offline. Assigning role locally.');
        return {
          success: true,
          message: `Simulated Role Assignment: Assigned ${roleName} to ${userId}`
        };
      }
      throw err;
    }
  }
};

/* ==========================================
   2. FLIGHT SERVICE (Airplanes, Cities, Airports, Flights)
   ========================================== */
export const flightService = {
  // Cities CRUD / Access
  getCities: async () => {
    return apiClient.get('/flightService/api/v1/cities');
  },
  createCity: async (name) => {
    return apiClient.post('/flightService/api/v1/cities', { name });
  },

  // Airports CRUD / Access
  getAirports: async () => {
    return apiClient.get('/flightService/api/v1/airports');
  },
  createAirport: async (airportData) => {
    // Expects: name, code, cityId, address (optional)
    return apiClient.post('/flightService/api/v1/airports', airportData);
  },

  // Airplane Fleet Management (Admin Only)
  getAirplanes: async () => {
    return apiClient.get('/flightService/api/v1/airplanes');
  },
  createAirplane: async (airplaneData) => {
    // Expects: modelNumber, capacity
    return apiClient.post('/flightService/api/v1/airplanes', airplaneData);
  },
  updateAirplane: async (id, airplaneData) => {
    return apiClient.patch(`/flightService/api/v1/airplanes/${id}`, airplaneData);
  },
  deleteAirplane: async (id) => {
    return apiClient.delete(`/flightService/api/v1/airplanes/${id}`);
  },

  // Flight Schedules
  // searchParams can contain: srcAirportId, destAirportId, date, seats
  getFlights: async (searchParams = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        queryParams.append(key, val);
      }
    });
    return apiClient.get(`/flightService/api/v1/flights?${queryParams.toString()}`);
  },
  createFlight: async (flightData) => {
    // Expects: flightNumber, airplaneId, departureAirportId, arrivalAirportId, arrivalTime, departureTime, price, boardingGate
    return apiClient.post('/flightService/api/v1/flights', flightData);
  }
};

/* ==========================================
   3. BOOKING SERVICE (Ticketing, Seat Hold, Payments)
   ========================================== */
export const bookingService = {
  // Step 1: Initiate booking (Holds seats for 5 minutes)
  // Expects: flightId, noOfSeats, passengerDetails (optional/custom)
  createBooking: async (bookingData) => {
    return apiClient.post('/bookingService/api/v1/bookings', bookingData);
  },

  // Step 2: Complete Payment
  // Expects: bookingId, paymentGatewayDetails (simulated transaction)
  completePayment: async (paymentData) => {
    return apiClient.post('/bookingService/api/v1/bookings/payments', paymentData);
  },

  // Fetch Booking History for logged-in user
  // This helps check active, pending, or cancelled bookings
  getUserBookings: async (userId) => {
    // Note: Depends on whether backend endpoint needs userId or extracts it from JWT
    // We support passing it, but also try to get it directly
    return apiClient.get(`/bookingService/api/v1/bookings/user/${userId}`);
  },

  // Cancel booking (Triggers compensation transaction / releases seats)
  cancelBooking: async (bookingId) => {
    return apiClient.post(`/bookingService/api/v1/bookings/${bookingId}/cancel`);
  }
};

export default apiClient;
