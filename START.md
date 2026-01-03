# How to Start the Application

This application consists of two parts:
1. **Backend**: Spring Boot REST API (Java)
2. **Frontend**: React application (TypeScript/Vite)

## Prerequisites

- **Java 17+** installed
- **Maven** installed (or use Maven wrapper)
- **Node.js** and **npm** installed

## Starting the Application

### Step 1: Start the Backend (Spring Boot)

Open a terminal in the project root directory and run:

```bash
# Option 1: Using Maven wrapper (if available)
./mvnw spring-boot:run

# Option 2: Using Maven directly
mvn spring-boot:run

# Option 3: Build and run the JAR
mvn clean package
java -jar target/poke-work-backend-1.0.0-SNAPSHOT.jar
```

The backend will start on **http://localhost:8080**

### Step 2: Start the Frontend (React)

Open a **new terminal** in the project root directory and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:5173** (Vite default port)

## Accessing the Application

1. Open your browser and go to **http://localhost:5173**
2. You'll see the registration/login screen
3. Register a new account to get started
4. After registration, you'll be automatically logged in and see your dashboard

## API Endpoints

The backend API is available at:
- **Base URL**: http://localhost:8080/api
- **Register**: POST /api/auth/register
- **Login**: POST /api/auth/login
- **Dashboard**: GET /api/dashboard (requires authentication)
- **Work Sessions**: GET /api/work (requires authentication)
- **Log Work**: POST /api/work (requires authentication)

## Troubleshooting

### Backend Issues
- Make sure Java 17+ is installed: `java -version`
- Make sure Maven is installed: `mvn -version`
- Check if port 8080 is already in use
- The database file `pokework.db` will be created automatically

### Frontend Issues
- Make sure Node.js is installed: `node -version`
- Make sure npm is installed: `npm -version`
- Delete `node_modules` and run `npm install` again if dependencies are corrupted
- Check if port 5173 is already in use

### Database Issues
- The SQLite database (`pokework.db`) is created automatically on first run
- If you need to reset, delete the `pokework.db` file and restart the backend

