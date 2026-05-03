# SanPay - Offline UPI Mesh System

SanPay is a full-stack proof-of-concept for an **Offline UPI Mesh** payment system. It simulates how devices without internet connectivity can route encrypted payment packets peer-to-peer (via Bluetooth/WiFi Direct) until they reach a "bridge" device with internet access, which then settles the transaction with the banking server.

## Repository Structure

This repository is organized as a monorepo containing both the backend and frontend:

- `/backend`: A Spring Boot application representing the central bank server and mesh simulator.
- `/frontend`: A React (Vite) application built with Tailwind CSS and Framer Motion, representing the end-user's premium mobile banking application.

---

## 🏗 Backend Architecture (Spring Boot)

The backend handles the actual settlement of transactions, idempotency (preventing duplicate processing of the same packet), and provides endpoints to simulate the mesh network.

### Prerequisites
- Java 17+
- Maven

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
3. The server will start on `http://localhost:8080`.

### Key Endpoints
- `POST /api/demo/send`: Injects a transaction into the mesh network.
- `GET /api/mesh/state`: Retrieves the current state of devices and packets holding in the mesh.
- `POST /api/mesh/gossip`: Simulates P2P transfer of packets between nearby devices.
- `POST /api/mesh/flush`: Simulates internet-connected devices settling their held packets with the server.
- `GET /api/transactions`: Lists settled transactions.

---

## 🎨 Frontend Architecture (React + Vite)

The frontend is a beautifully designed, mobile-first web app that connects directly to the Spring Boot backend. It includes features like sending money, viewing transaction history, and an interactive React Flow graph to visualize the live mesh network routing.

### Prerequisites
- Node.js 18+
- npm

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173` (or the port specified in your terminal).

> **Note**: The frontend is configured to automatically point to `http://localhost:8080/api`. Ensure the Spring Boot backend is running concurrently to use the app properly.

---

## 🚀 How to Test the Full Flow

1. Start **both** the backend and frontend servers.
2. Open the frontend in your browser.
3. Click **"Send Money"**, enter a recipient (e.g., `bob@upi`) and an amount. Ensure **"Offline Mesh Mode"** is toggled on.
4. Hit **Send**. You will be redirected to the status page. It will stay in "PENDING" or "Routing" state.
5. In a real scenario, the app would gossip. You can trigger this programmatically on the backend by sending a POST request to `http://localhost:8080/api/mesh/gossip`.
6. To settle the transaction, simulate a bridge node getting internet by calling `POST http://localhost:8080/api/mesh/flush`.
7. Your frontend status will update to **SUCCESS**
