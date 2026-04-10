const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const app = express();

// Middleware
const logger = require('./middleware/logger');

const swaggerDocument = YAML.load('./swagger.yaml');

// Routes
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const videosRouter = require('./routes/videos');

app.use(logger);
app.use(express.json());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ROUTES

app.get('/', (req, res) => {
    res.json({
        message: 'Lab 4 - MongoDB Relationships, Filtering, Sorting & Pagination',
        endpoints: {
            home: 'GET /',
            about: 'GET /about',
            auth: {
                signup: 'POST /api/auth/signup',
                login: 'POST /api/auth/login',
                getMe: 'GET /api/auth/me (protected)'
            },
            users: {
                getAll: 'GET /api/users',
                getById: 'GET /api/users/:id',
                create: 'POST /api/users (protected)',
                delete: 'DELETE /api/users/:id (admin only)'
            },
            videos: {
                getAll: 'GET /api/videos',
                getById: 'GET /api/videos/:id',
                create: 'POST /api/videos (protected)',
                update: 'PUT /api/videos/:id (owner/admin)',
                delete: 'DELETE /api/videos/:id (owner/admin)',
                queryOptions: {
                    filtering: '?title=value&user=userId',
                    sorting: '?sort=createdAt,-title',
                    pagination: '?page=1&limit=10',
                    fields: '?fields=title,description'
                }
            },
            comments: {
                getAll: 'GET /api/videos/:videoId/comments',
                create: 'POST /api/videos/:videoId/comments (protected)',
                update: 'PUT /api/videos/:videoId/comments/:commentId (owner)',
                delete: 'DELETE /api/videos/:videoId/comments/:commentId (owner/admin)'
            }
        }
    });
});

app.get('/about', (req, res) => {
    res.json({
        name: 'Lab 3 API',
        version: '1.0.0',
        description: 'MongoDB, Mongoose & JWT Authentication',
        author: 'Student'
    });
});

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/videos', videosRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;
