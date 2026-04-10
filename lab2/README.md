# Lab 3 & 4: MongoDB Relationships, Filtering, Sorting & Pagination

## Project Overview

This project demonstrates a RESTful API with MongoDB database integration, user authentication using JWT (JSON Web Tokens), Role-Based Access Control (RBAC), MongoDB relationships, filtering, sorting, pagination, and a comment system.

## Project Structure

```
lab3-auth-db/
├── app.js              # Express application setup
├── server.js           # Server entry point with MongoDB connection
├── config.env          # Environment variables
├── package.json
├── models/
│   ├── userModel.js    # User schema with password hashing
│   ├── videoModel.js   # Video schema (references User)
│   └── commentModel.js # Comment schema (references Video & User)
├── controllers/
│   ├── authController.js    # Authentication (signup/login)
│   ├── usersController.js   # User CRUD operations
│   ├── videoController.js   # Video CRUD with filtering/sorting/pagination
│   └── commentController.js # Comment CRUD operations
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── users.js        # User routes
│   ├── videos.js       # Video routes
│   └── comments.js     # Comment routes (nested under videos)
└── middleware/
    ├── protect.js      # JWT verification middleware
    ├── restrictTo.js   # Role-based access control
    └── logger.js       # Request logger
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB:**
   Make sure MongoDB is running on `mongodb://127.0.0.1:27017`

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Server will run on:** `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Public |
| GET | `/api/users/:id` | Get user by ID | Public |
| POST | `/api/users` | Create user | Protected |
| DELETE | `/api/users/:id` | Delete user | Admin Only |

### Videos
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/videos` | Get all videos | Public |
| GET | `/api/videos/:id` | Get video by ID | Public |
| POST | `/api/videos` | Create video | Protected |
| PUT | `/api/videos/:id` | Update video | Owner/Admin |
| DELETE | `/api/videos/:id` | Delete video | Owner/Admin |

### Comments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/videos/:videoId/comments` | Get all comments for a video | Public |
| POST | `/api/videos/:videoId/comments` | Create comment | Protected |
| PUT | `/api/videos/:videoId/comments/:commentId` | Update comment | Owner |
| DELETE | `/api/videos/:videoId/comments/:commentId` | Delete comment | Owner/Admin |

## Query Parameters (Videos)

### Filtering
Filter videos by any field:
```
GET /api/videos?title=MyVideo
GET /api/videos?user=userId
```

Advanced filtering with operators:
```
GET /api/videos?createdAt[gte]=2024-01-01
GET /api/videos?createdAt[lt]=2024-12-31
```

### Sorting
Sort by one or multiple fields (prefix with `-` for descending):
```
GET /api/videos?sort=createdAt         # Oldest first
GET /api/videos?sort=-createdAt        # Newest first (default)
GET /api/videos?sort=-createdAt,title  # Multiple fields
```

### Pagination
Control page number and results per page:
```
GET /api/videos?page=1&limit=10
GET /api/videos?page=2&limit=5
```

### Field Selection
Select specific fields to return:
```
GET /api/videos?fields=title,description
```

### Combined Example
```
GET /api/videos?sort=-createdAt&page=1&limit=5&fields=title,description,user
```

## Testing with Postman

### 1. Signup
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
    "name": "shadow",
    "email": "shadow@mail.com",
    "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
    "email": "shadow@mail.com",
    "password": "password123"
}
```

### 3. Access Protected Route
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_token_here>
```

### 4. Create Video (Protected)
```
POST http://localhost:5000/api/videos
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
    "title": "My First Video",
    "description": "This is a test video"
}
```

### 5. Get Videos with Filtering, Sorting & Pagination
```
GET http://localhost:5000/api/videos?sort=-createdAt&page=1&limit=5
```

### 6. Create Comment (Protected)
```
POST http://localhost:5000/api/videos/<video_id>/comments
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
    "text": "Great video!"
}
```

### 7. Get Comments for a Video
```
GET http://localhost:5000/api/videos/<video_id>/comments
```

---

## Conceptual Questions

### 1. Authentication vs Authorization

**Authentication** is the process of verifying **who** a user is. It confirms the identity of a user through credentials like username/password, tokens, or biometrics.
- Example: Logging in with email and password to prove you are who you claim to be.

**Authorization** is the process of determining **what** a user is allowed to do. It happens after authentication and controls access to resources based on permissions.
- Example: An authenticated user can view their own profile, but only admins can delete other users.

**In this project:**
- Authentication: JWT tokens verify user identity (`protect.js` middleware)
- Authorization: Role checks determine access (`restrictTo.js` middleware)

### 2. Why Password is Hashed

Passwords are hashed for **security** reasons:

1. **Protection against data breaches:** If the database is compromised, attackers cannot see actual passwords since hashes are one-way functions.

2. **Irreversibility:** Hashing is a one-way operation. You cannot convert a hash back to the original password.

3. **Salt protection:** Using bcrypt with salt prevents rainbow table attacks where pre-computed hash tables could be used to reverse common passwords.

4. **Legal compliance:** Many regulations (GDPR, PCI-DSS) require storing passwords securely.

**In this project:**
```javascript
// Pre-save hook hashes password before storing
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
```

### 3. Meaning of Stateless

**Stateless** means the server does not store any information about the client's state between requests. Each request must contain all the information needed to process it.

**JWT is stateless because:**
- The server doesn't store session data in memory or database
- All user information is encoded within the token itself
- Each request carries the JWT, and the server verifies it independently
- No server-side session storage is required

**Benefits of stateless architecture:**
1. **Scalability:** Any server can handle any request (no session affinity needed)
2. **Performance:** No database lookups for session validation
3. **Simplicity:** No session management infrastructure
4. **RESTful:** Follows REST architectural constraints

**In this project:** The JWT contains the user ID, and the server verifies the token signature without storing any session state.

### 4. What is RBAC (Role-Based Access Control)

**RBAC** is a security approach that restricts system access based on the roles of individual users within an organization.

**Key concepts:**
- **Role:** A defined set of permissions (e.g., 'admin', 'user', 'editor')
- **Permission:** Authorization to perform specific operations
- **User:** An individual assigned one or more roles

**How RBAC works:**
1. Define roles in the system
2. Assign permissions to each role
3. Assign users to appropriate roles
4. Check user's role before allowing actions

**In this project:**
```javascript
// User model has role field
role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
}

// restrictTo middleware checks roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

// Usage: Only admins can delete users
router.delete('/:id', protect, restrictTo('admin'), deleteUser);
```

**Benefits of RBAC:**
1. **Simplified management:** Permissions managed at role level, not individual level
2. **Principle of least privilege:** Users get only necessary permissions
3. **Security:** Centralized access control
4. **Audit trail:** Easy to track who has access to what

---

## Environment Variables (config.env)

```
PORT=5000
DATABASE=mongodb://127.0.0.1:27017/lab3db
JWT_SECRET=mySuperSecretKey
JWT_EXPIRES_IN=1d
```

## Author

Student - SWAPD 352 Web Development Lab 3
