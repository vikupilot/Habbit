# Backend Structure

The backend has been refactored into a modular structure for better organization and maintainability.

## Directory Structure

```
backend/
├── server.js              # Main server file (entry point)
├── middleware/
│   └── auth.js           # Authentication middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── planner.js        # Planner/Tasks routes
│   └── dashboard.js      # Dashboard/Favorites routes
└── utils/
    ├── fileOperations.js # File I/O operations
    ├── helpers.js        # Helper functions
    └── email.js          # Email configuration and sending
```

## Module Overview

### 1. Authentication Module (`routes/auth.js`)
Handles all user authentication and password management:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### 2. Planner Module (`routes/planner.js`)
Handles task management for the planner:
- `GET /api/tasks` - Get tasks (optionally filtered by date)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:taskId` - Update a task
- `DELETE /api/tasks/:taskId` - Delete a task

### 3. Dashboard Module (`routes/dashboard.js`)
Handles favorite tasks management:
- `GET /api/favorites` - Get all favorite tasks
- `POST /api/favorites` - Create a new favorite
- `DELETE /api/favorites/:favoriteId` - Delete a favorite
- `PUT /api/favorites/reorder` - Reorder favorites

## Shared Utilities

### `utils/fileOperations.js`
Centralized file I/O operations:
- `readUsers()` / `writeUsers()` - User data
- `readTasks()` / `writeTasks()` - Task data
- `readFavorites()` / `writeFavorites()` - Favorite data
- `readResetTokens()` / `writeResetTokens()` - Password reset tokens
- `ensureDataDirectory()` - Create data directory if needed

### `utils/helpers.js`
Reusable helper functions:
- `normalizeEmail(email)` - Normalize email to lowercase and trim
- `getNextTaskId(tasksForDate)` - Generate next sequential task ID

### `utils/email.js`
Email functionality:
- `sendPasswordResetEmail(email, resetToken)` - Send password reset email
- Email transporter configuration

### `middleware/auth.js`
Authentication middleware:
- `authenticateToken(req, res, next)` - Verify JWT tokens
- `JWT_SECRET` - JWT secret key

## Benefits of This Structure

1. **Separation of Concerns** - Each module handles a specific domain
2. **Maintainability** - Easier to find and modify code
3. **Scalability** - Easy to add new routes or modules
4. **Reusability** - Shared utilities can be used across modules
5. **Testability** - Each module can be tested independently

## Adding New Routes

To add a new route module:

1. Create a new file in `routes/` directory
2. Use Express Router: `const router = express.Router()`
3. Define routes on the router
4. Export the router: `module.exports = router`
5. Import and register in `server.js`:
   ```javascript
   const newRoutes = require('./routes/newModule');
   app.use('/api/new', newRoutes);
   ```

