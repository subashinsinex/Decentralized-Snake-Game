
# Decentralized Snake Game - MERN Stack

## Table of Contents
- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)

## Introduction
This project is a **decentralized Snake Game** built using the MERN stack. The game communicates with multiple servers using REST APIs and `axios`. One server shares its IP with another server, which in turn checks if the server IP is already present. Based on that, it adds the server's IP and port to the database and returns the high scores back to the server.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Decentralization**: REST API + Axios

## Features
- Decentralized server communication for high score sharing.
- RESTful API integration for server IP registration and data exchange.
- Scalable, decentralized architecture.
- Real-time high score updates from connected servers.

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB
- A modern web browser

### Steps to Run the Application

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/subashinsinex/Decentralized-Snake-Game.git
   cd Decentralized-Snake-Game
   ```

2. **Install Dependencies:**

   For the **Frontend**:
   ```bash
   cd frontend
   npm install
   ```

   For the **Backend**:
   ```bash
   cd ../backend
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `backend` folder with the following environment variables:

   ```plaintext
   MONGODB_URI=your_mongo_db_connection_string
   PORT=your_preferred_port
   ```

4. **Run the Backend Server:**
   ```bash
   cd backend
   npm start
   ```

5. **Run the Frontend:**
   In another terminal, run:
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application:**
   Open your browser and go to `http://localhost:3000` to access the frontend. The backend will be running on the port specified in the `.env` file.

## How It Works

1. **Decentralized Communication**: 
   The backend uses REST APIs to communicate between different servers. A server sends its IP and port to another server through an API call. The receiving server checks if the IP is already present in its database.

2. **IP & High Score Registration**:
   - If the IP and port are not already in the database, they are added.
   - The server then returns its current high scores back to the sending server.

3. **Data Flow**:
   - **Frontend**: Handles the gameplay and displays the high scores.
   - **Backend**: Manages server communication, high score data, and the decentralized logic.
   - **Database**: MongoDB stores server IPs, ports, and high scores.

## API Endpoints
  
- **POST `/api/updateHighScores`**  
  Sends IP and port & retrieves the current high scores.

  **Request Body:**
  ```json
  {
    "addresses": "addresses_json"
  }
  ```

  **Response:**
  ```json
  {
    "highscores": [
      {
        "player": "player_name",
        "score": "high_score_value"
      }
    ]
  }
  ```
