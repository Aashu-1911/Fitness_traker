# FitLife – Personalized Health & Fitness Tracker

A full-stack web application for tracking health and fitness goals with personalized insights.

## 🚀 Tech Stack

### Frontend
- **React** with **Vite**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**

## 📁 Project Structure

```
Health_fitness/
├── client/          # React frontend application
├── server/          # Express backend API
├── .gitignore
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB URI

5. Run the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🎯 Features (Coming Soon)

- User authentication and profiles
- Workout tracking and planning
- Nutrition logging
- Progress visualization
- Goal setting and tracking
- Personalized recommendations

## 📝 License

MIT
