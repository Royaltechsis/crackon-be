# Crackon Backend API

A Node.js backend API built with TypeScript, Express, MongoDB, and bcrypt for secure authentication.

## Features

- **TypeScript** - Type-safe development
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **bcrypt** - Password hashing for security
- **CORS** - Cross-Origin Resource Sharing enabled
- **Environment Variables** - Configuration with dotenv
- **Hot Reload** - Development with nodemon

## Project Structure

```
crackon-be/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection setup
│   ├── controllers/
│   │   └── userController.ts # User business logic
│   ├── middleware/
│   │   └── errorHandler.ts   # Error handling middleware
│   ├── models/
│   │   └── User.ts           # User model with bcrypt
│   ├── routes/
│   │   └── userRoutes.ts     # User API routes
│   └── index.ts              # Application entry point
├── dist/                      # Compiled JavaScript (generated)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── nodemon.json              # Nodemon configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crackon-be
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crackon-be
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
```

## Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run start:dev`** - Start development server with ts-node
- **`npm run build`** - Compile TypeScript to JavaScript
- **`npm start`** - Run production server (requires build first)
- **`npm run clean`** - Remove dist folder

## Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Health Check
- **GET** `/health` - Check server status

### Users
- **POST** `/api/users` - Create a new user
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID

## User Model

The User model includes:
- `username` - Unique username (min 3 characters)
- `email` - Unique email address
- `password` - Hashed password using bcrypt (min 6 characters)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

Passwords are automatically hashed before saving using bcrypt with a salt factor of 10.

## Production Build

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/crackon-be |
| NODE_ENV | Environment mode | development |
| JWT_SECRET | Secret key for JWT | - |

## Technologies Used

- **Node.js** - JavaScript runtime
- **TypeScript** - JavaScript with types
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cors** - CORS middleware
- **nodemon** - Development auto-reload
- **ts-node** - TypeScript execution

## License

ISC

## Contributing

Feel free to submit issues and pull requests.
