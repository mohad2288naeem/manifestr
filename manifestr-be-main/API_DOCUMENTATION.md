# Fitness App API Documentation

## Table of Contents
1. [Base Information](#base-information)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
6. [Environment Variables](#environment-variables)

---

## Base Information

### Base URL
- **Development**: `http://localhost:31981`
- **Production**: (To be configured)

### Server Port
- Default: `31981`

### API Prefix
All endpoints are prefixed with `/api` except the health check endpoint.

### Content Type
- **Request**: `application/json`
- **Response**: `application/json`

### CORS
- CORS is enabled for configured origins
- Default allowed origin: `http://localhost:5173`
- Credentials are supported
- Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Allowed headers: `Content-Type`, `Authorization`

---

## Authentication

### Authentication Method
**Bearer Token (JWT)**

### How It Works
1. User/Admin logs in via `/api/auth/login` or `/api/admin/login`
2. Server returns a JWT token in the response
3. Client stores the token securely
4. For protected endpoints, include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your_token_here>
   ```

### Token Storage
- Tokens are stored in the database and validated on each request
- If a user is suspended, their token becomes invalid
- Tokens are replaced on each login (single active session per user)

### Token Verification
- Use `/api/auth/verify-token` to check if a token is still valid
- Returns 401 if token is invalid, expired, or user is suspended

---

## Response Format

### Success Response
All successful responses follow this structure:

```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "details": {
    // Response data here
  }
}
```

### Error Response
All error responses follow this structure:

```json
{
  "status": "error",
  "message": "Error description",
  "details": {
    // Additional error details (optional)
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Error Handling

### Common Error Scenarios

1. **Missing Token**
   ```json
   {
     "status": "error",
     "message": "No token provided",
     "details": {
       "error": "Authorization header missing or invalid"
     }
   }
   ```

2. **Invalid Token**
   ```json
   {
     "status": "error",
     "message": "Invalid token",
     "details": {
       "error": "Token verification failed"
     }
   }
   ```

3. **Validation Error**
   ```json
   {
     "status": "error",
     "message": "Validation failed",
     "details": {
       "errors": [
         "Email is required",
         "Password must be at least 8 characters"
       ]
     }
   }
   ```

4. **User Suspended**
   ```json
   {
     "status": "error",
     "message": "Account is suspended",
     "details": {
       "error": "User account has been suspended"
     }
   }
   ```

---

## API Endpoints

### Health Check

#### GET `/health`
Check if the API and database are running.

**No authentication required**

**Response:**
```json
{
  "status": "success",
  "message": "Application is healthy",
  "details": {
    "database": "connected"
  }
}
```

---

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**No authentication required**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, minimum length (check validation schema)

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "details": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `409` - Email already exists

---

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**No authentication required**

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "details": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `401` - Invalid credentials

---

#### GET `/api/auth/verify-token`
Verify if the current JWT token is valid.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Token is valid",
  "details": {
    "valid": true
  }
}
```

**Error Responses:**
- `401` - Token is invalid or missing

---

#### PUT `/api/auth/change-password`
Change user's password.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password changed successfully",
  "details": null
}
```

**Error Responses:**
- `400` - Validation failed
- `401` - Invalid current password or unauthorized

---

### User Endpoints

#### GET `/api/user`
Get current authenticated user's information.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User information retrieved successfully",
  "details": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "trainer": "SOLENE",
      "gender": "Male",
      "age": 25,
      "weight": 75.5,
      "goal": "muscle_gain",
      "experience": "intermediate",
      "current_program_id": 5,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

#### PUT `/api/user/trainer-preference`
Set user's trainer preference (FELIX or SOLENE).

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "trainer": "SOLENE"
}
```

**Validation:**
- `trainer`: Required, must be "FELIX" or "SOLENE"

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Trainer preference updated successfully",
  "details": {
    "user": {
      "id": 1,
      "trainer": "SOLENE"
    }
  }
}
```

---

#### PUT `/api/user/profile`
Set user profile information (gender, age, weight, goal, experience).

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "gender": "Male",
  "age": 25,
  "weight": 75.5,
  "goal": "muscle_gain",
  "experience": "intermediate"
}
```

**Validation:**
- All fields are optional
- `gender`: String
- `age`: Number (positive integer)
- `weight`: Number (positive)
- `goal`: String (enum: weight_loss, muscle_gain, strength, endurance, general_fitness, flexibility)
- `experience`: String

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "details": {
    "user": {
      "id": 1,
      "gender": "Male",
      "age": 25,
      "weight": 75.5,
      "goal": "muscle_gain",
      "experience": "intermediate"
    }
  }
}
```

---

#### PUT `/api/user/current-program`
Set user's current active program.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "program_id": 5
}
```

**Validation:**
- `program_id`: Required, must be a valid program ID

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Current program set successfully",
  "details": {
    "user": {
      "id": 1,
      "current_program_id": 5
    }
  }
}
```

---

#### DELETE `/api/user/current-program`
Clear user's current active program.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Current program cleared successfully",
  "details": null
}
```

---

#### GET `/api/user/current-program/progress`
Get user's progress in their current program.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Program progress retrieved successfully",
  "details": {
    "program": {
      "id": 5,
      "name": "Beginner Strength Program"
    },
    "weeks": [
      {
        "week_number": 1,
        "workouts": [
          {
            "workout_id": 10,
            "status": "completed",
            "completed_at": "2024-01-15T10:00:00.000Z"
          }
        ]
      }
    ]
  }
}
```

---

### Admin Endpoints

#### POST `/api/admin/login`
Admin login (separate from user login).

**No authentication required**

**Request Body:**
```json
{
  "username": "admin",
  "password": "YourPassword123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "details": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "username": "admin"
    }
  }
}
```

---

#### POST `/api/admin/add`
Add a new admin user.

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "username": "newadmin",
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Admin user created successfully",
  "details": {
    "admin": {
      "id": 2,
      "username": "newadmin"
    }
  }
}
```

---

#### GET `/api/admin/stats`
Get admin dashboard statistics.

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Statistics retrieved successfully",
  "details": {
    "users": {
      "total": 150,
      "active": 140,
      "inactive": 10
    },
    "content": {
      "total_programs": 25,
      "total_workouts": 100,
      "total_exercises": 200
    }
  }
}
```

---

#### GET `/api/admin/users`
Get all users with pagination and filters.

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Number of results to skip (default: 0)
- `suspended` (optional): Filter by suspended status (true/false)
- `search` (optional): Search by name or email

**Example:**
```
GET /api/admin/users?limit=10&offset=0&suspended=false&search=john
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "details": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "is_suspended": false,
        "trainer": "SOLENE",
        "current_program_id": 5,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 10,
      "offset": 0
    }
  }
}
```

---

#### PUT `/api/admin/users/:id/suspend`
Suspend a user account.

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**URL Parameters:**
- `id`: User ID (integer)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User suspended successfully",
  "details": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "is_suspended": true
    }
  }
}
```

---

#### PUT `/api/admin/users/:id/unsuspend`
Unsuspend a user account.

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**URL Parameters:**
- `id`: User ID (integer)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User unsuspended successfully",
  "details": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "is_suspended": false
    }
  }
}
```

---

#### GET `/api/admin/admins`
Get all admin users.

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Number of results to skip (default: 0)
- `search` (optional): Search by username

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Admins retrieved successfully",
  "details": {
    "admins": [
      {
        "id": 1,
        "username": "admin",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

#### PUT `/api/admin/admins/:id/password`
Change an admin's password.

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**URL Parameters:**
- `id`: Admin ID (integer)

**Request Body:**
```json
{
  "new_password": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password changed successfully",
  "details": {
    "admin": {
      "id": 1,
      "username": "admin"
    }
  }
}
```

---

#### DELETE `/api/admin/admins/:id`
Delete an admin user (cannot delete yourself).

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**URL Parameters:**
- `id`: Admin ID (integer)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Admin deleted successfully",
  "details": null
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Cannot delete your own account",
  "details": null
}
```

---

### Program Endpoints

#### GET `/api/programs`
Get all available programs.

**No authentication required**

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Programs retrieved successfully",
  "details": {
    "programs": [
      {
        "id": 1,
        "name": "Beginner Strength Program",
        "description": "A 12-week program for beginners",
        "goal": "strength",
        "level": "beginner",
        "weeks": 12,
        "is_enabled": true
      }
    ]
  }
}
```

---

#### GET `/api/programs/:id`
Get a specific program by ID.

**No authentication required**

**URL Parameters:**
- `id`: Program ID (integer)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Program retrieved successfully",
  "details": {
    "program": {
      "id": 1,
      "name": "Beginner Strength Program",
      "description": "A 12-week program for beginners",
      "goal": "strength",
      "level": "beginner",
      "weeks": 12,
      "is_enabled": true,
      "weeks_data": [
        {
          "week_number": 1,
          "workouts": [
            {
              "workout_id": 10,
              "workout": {
                "id": 10,
                "title": "Upper Body Strength"
              }
            }
          ]
        }
      ]
    }
  }
}
```

---

#### POST `/api/programs`
Create a new program (Admin only).

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Advanced Hypertrophy Program",
  "description": "A 16-week advanced program",
  "goal": "muscle_gain",
  "level": "advanced",
  "weeks": 16,
  "is_enabled": true
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Program created successfully",
  "details": {
    "program": {
      "id": 5,
      "name": "Advanced Hypertrophy Program",
      "description": "A 16-week advanced program",
      "goal": "muscle_gain",
      "level": "advanced",
      "weeks": 16,
      "is_enabled": true
    }
  }
}
```

---

### Workout Endpoints

#### GET `/api/workouts`
Get all available workouts.

**No authentication required**

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Workouts retrieved successfully",
  "details": {
    "workouts": [
      {
        "id": 1,
        "title": "Upper Body Strength",
        "description": "Focus on chest, back, and shoulders",
        "duration_minutes": 60,
        "is_enabled": true
      }
    ]
  }
}
```

---

#### GET `/api/workouts/:id`
Get a specific workout by ID.

**No authentication required**

**URL Parameters:**
- `id`: Workout ID (integer)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Workout retrieved successfully",
  "details": {
    "workout": {
      "id": 1,
      "title": "Upper Body Strength",
      "description": "Focus on chest, back, and shoulders",
      "duration_minutes": 60,
      "exercises": [
        {
          "exercise_id": 5,
          "exercise": {
            "id": 5,
            "name": "Bench Press",
            "category": "strength"
          },
          "sets": 3,
          "reps": 8,
          "rest_seconds": 90
        }
      ],
      "is_enabled": true
    }
  }
}
```

---

#### POST `/api/workouts`
Create a new workout (Admin only).

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Full Body Circuit",
  "description": "A complete full body workout",
  "duration_minutes": 45,
  "exercises": [
    {
      "exercise_id": 5,
      "sets": 3,
      "reps": 12,
      "rest_seconds": 60
    }
  ],
  "is_enabled": true
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Workout created successfully",
  "details": {
    "workout": {
      "id": 10,
      "title": "Full Body Circuit",
      "description": "A complete full body workout",
      "duration_minutes": 45,
      "is_enabled": true
    }
  }
}
```

---

### Exercise Endpoints

#### GET `/api/exercises`
Get all available exercises.

**No authentication required**

**Query Parameters:**
- `category` (optional): Filter by exercise category
- `equipment` (optional): Filter by required equipment
- `search` (optional): Search by exercise name

**Example:**
```
GET /api/exercises?category=strength&equipment=barbell&search=press
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Exercises retrieved successfully",
  "details": {
    "exercises": [
      {
        "id": 1,
        "name": "Bench Press",
        "category": "strength",
        "muscle_groups": ["chest", "triceps", "shoulders"],
        "equipment": ["barbell", "bench"],
        "demo_video_url": "https://example.com/video.mp4",
        "tips": "Keep your back flat on the bench",
        "is_enabled": true
      }
    ]
  }
}
```

---

#### GET `/api/exercises/:id`
Get a specific exercise by ID.

**No authentication required**

**URL Parameters:**
- `id`: Exercise ID (integer)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Exercise retrieved successfully",
  "details": {
    "exercise": {
      "id": 1,
      "name": "Bench Press",
      "category": "strength",
      "muscle_groups": ["chest", "triceps", "shoulders"],
      "equipment": ["barbell", "bench"],
      "demo_video_url": "https://example.com/video.mp4",
      "tips": "Keep your back flat on the bench",
      "is_enabled": true
    }
  }
}
```

---

#### POST `/api/exercises`
Create a new exercise (Admin only).

**Admin authentication required**

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Deadlift",
  "category": "strength",
  "muscle_groups": ["back", "legs", "glutes"],
  "equipment": ["barbell"],
  "demo_video_url": "https://example.com/deadlift.mp4",
  "tips": "Keep your back straight throughout the movement",
  "is_enabled": true
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Exercise created successfully",
  "details": {
    "exercise": {
      "id": 50,
      "name": "Deadlift",
      "category": "strength",
      "muscle_groups": ["back", "legs", "glutes"],
      "equipment": ["barbell"],
      "demo_video_url": "https://example.com/deadlift.mp4",
      "tips": "Keep your back straight throughout the movement",
      "is_enabled": true
    }
  }
}
```

---

### Additional Endpoints

The following endpoints are also available but require checking the controller files for exact specifications:
- Equipment endpoints (`/api/equipment`)
- Workout Session endpoints (`/api/workout-sessions`)
- Exercise Journal endpoints (`/api/exercise-journals`)
- Weight tracking endpoints (`/api/weights`)
- Article endpoints (`/api/articles`)

Please refer to the Swagger documentation at `/api/docs` for complete endpoint details.

---

## Environment Variables

### Required Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/fitness_app
# OR use individual variables:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=fitness_app

# JWT Secret (REQUIRED for production)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port (optional, defaults to 31981)
PORT=31981

# CORS Allowed Origins (comma-separated, optional)
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Optional Environment Variables

```env
# Node Environment
NODE_ENV=development

# JWT Expiration (optional, defaults to no expiration)
JWT_EXPIRES_IN=7d
```

---

## Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:31981/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:31981/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Get user info (with token):**
```bash
curl -X GET http://localhost:31981/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Swagger UI

Visit `http://localhost:31981/api/docs` to access the interactive Swagger documentation where you can test all endpoints directly.

---

## Notes for App Engineer

1. **Token Management:**
   - Store the token securely (use secure storage on mobile)
   - Include token in `Authorization` header for all protected endpoints
   - Handle token expiration (401 responses)
   - Implement token refresh if needed

2. **Error Handling:**
   - Always check the `status` field in responses
   - Display user-friendly error messages from the `message` field
   - Handle network errors separately

3. **Pagination:**
   - Admin endpoints support pagination with `limit` and `offset`
   - Always check `pagination.total` to know total count

4. **Validation:**
   - Client-side validation should match server-side rules
   - Server will return validation errors in `details.errors` array

5. **User Suspension:**
   - If user gets 401 with "Account is suspended", log them out
   - Display appropriate message to user

6. **CORS:**
   - Ensure your app's origin is in `CORS_ALLOWED_ORIGINS`
   - For production, update CORS settings accordingly

---

## Support

For questions or issues, please contact the backend team or refer to the Swagger documentation at `/api/docs`.


