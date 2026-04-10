# Postman Lab Guide

## Part 1: Postman Environment Switching

### 1. Import environments
1. Import [ClipSphere-Dev.postman_environment.json](ClipSphere-Dev.postman_environment.json).
2. Import [ClipSphere-Prod.postman_environment.json](ClipSphere-Prod.postman_environment.json).

### 2. Verify environment variables
Both environments contain the same key:
- base url

Values:
- Dev: http://localhost:5000
- Prod: https://your-deployed-api.example.com

### 3. Verify collection uses environment variable
The collection [Lab3-Postman-Collection.json](Lab3-Postman-Collection.json) uses:
- {{base url}}/api/...

There are no hardcoded host URLs in requests.

### 4. Test environment switching
1. In Postman, select ClipSphere-Dev and run any request.
2. Switch to ClipSphere-Prod and run the same request.
3. Confirm the request URL changes automatically based on selected environment.

## Part 2: Postman Automated Tests

Automated test scripts are added to:
- POST /videos
- GET /videos

### POST /videos tests include
- Status code is 201.
- Response structure has success, data, and data.video.
- Response time is under 2000ms.
- Saves video id to collection variable videoId.

### GET /videos tests include
- Status code is 200.
- Response structure has success, data, and data.videos (array).
- Response time is under 2000ms.

## Part 3: Collection Runner

The collection has a folder named Collection Runner Flow with requests in this order:
1. Signup
2. Login
3. POST /videos
4. GET /videos
5. POST /videos/:videoId/comments
6. GET /videos/:videoId/comments

### Run in Postman Runner
1. Open Collection Runner.
2. Select ClipSphere API Lab Collection.
3. Choose environment ClipSphere-Dev.
4. Run the folder Collection Runner Flow.
5. Verify all requests pass.

## Part 4: Swagger Documentation

Swagger spec file created:
- [swagger.yaml](swagger.yaml)

It includes:
- API metadata: title and version.
- Documented endpoints:
  - GET /api/videos
  - GET /api/videos/{id}
  - POST /api/videos/{videoId}/comments
- Data model schemas:
  - User
  - Video
  - Comment
  - VideosResponse
  - VideoResponse
  - CommentResponse

## Part 5: Swagger UI Integration

### Installed dependencies
- swagger-ui-express
- yamljs

### Express integration
Swagger is loaded and served in [app.js](app.js):
- Loads YAML from [swagger.yaml](swagger.yaml)
- Serves UI on /api-docs

### Verify in browser
1. Start server:
   npm start
2. Open:
   http://localhost:5000/api-docs
3. Confirm Swagger UI is accessible and shows the documented endpoints.
