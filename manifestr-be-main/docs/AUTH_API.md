# Authentication API Documentation

Base URL: `/auth`

This API handles user registration, session management, and access/refresh token rotation using `HttpOnly` cookies for maximum security.

---

## 1. Sign Up
**Endpoint**: `POST /auth/signup`

Register a new user account.

### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "dob": "1990-01-01",
  "country": "USA",
  "gender": "male",
  "promotional_emails": true
}
```

### Success Response (201 Created)
```json
{
  "status": "success",
  "message": "User created successfully",
  "details": {
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "dob": "1990-01-01",
      "country": "USA",
      "gender": "male",
      "tier": "free",
      "wins_balance": 100,
      "created_at": "2024-..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```
*Note: The `refreshToken` is also set as an HttpOnly cookie.*

### Error Responses
- **400 Bad Request**: "Missing required fields"
- **409 Conflict**: "User already exists"

---

## 2. Login
**Endpoint**: `POST /auth/login`

Authenticate user and create a new device session.

### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Success Response (200 OK)
Returns the same structure as Sign Up (User object + tokens).
```json
{
  "status": "success",
  "message": "Login successful",
  "details": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Error Responses
- **401 Unauthorized**: "Invalid credentials"

---

## 3. Refresh Token
**Endpoint**: `POST /auth/refresh-token`

Get a new Access Token using a valid Refresh Token. Implements **Rotational Security** (old token is revoked, new one issued).

### Request
- **Headers**: None required.
- **Cookies**: Requires `refreshToken` cookie (automatically sent by browser).
- **Body** (Optional fallback): `{ "refreshToken": "..." }` if not using cookies.

### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Token refreshed",
  "details": {
    "accessToken": "new_access_token...",
    "refreshToken": "new_refresh_token..."
  }
}
```

### Error Responses
- **401 Unauthorized**: "No refresh token provided"
- **403 Forbidden**: "Invalid or expired session" (Sign out user immediately)

---

## 4. Get Active Sessions
**Endpoint**: `GET /auth/sessions`

List all active logins for the current user.

### Headers
`Authorization: Bearer <accessToken>`

### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Active sessions retrieved",
  "details": {
    "sessions": [
      {
        "id": 1,
        "device_name": "Macintosh",
        "ip_address": "192.168.1.1",
        "last_active": "2024-...",
        "created_at": "2024-..."
      }
    ]
  }
}
```

---

## 5. Revoke Session
**Endpoint**: `POST /auth/sessions/revoke`

Remote logout a specific device.

### Headers
`Authorization: Bearer <accessToken>`

### Request Body
```json
{
  "sessionId": 1
}
```

### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Session revoked",
  "details": null
}
```

---

## 6. Onboarding
**Endpoint**: `POST /auth/onboarding`

Submit user details after initial signup. This completes the account setup.

### Headers
`Authorization: Bearer <accessToken>`

### Request Body
```json
{
  "expertise": "Software Engineering",
  "job_title": "Senior Frontend Developer",
  "industry": "Technology",
  "goal": "Productivity,Career Growth,Leadership", 
  "work_style": "Team",
  "problems": "Time Management,Burnout"
}
```

### Success Response (200 OK)
Returns updated User object with `onboarding_completed: true`.
```json
{
  "status": "success",
  "message": "Onboarding completed",
  "details": {
    "user": {
      "id": 1,
      "email": "...",
      "onboarding_completed": true,
      "expertise": "Software Engineering",
      ...
    }
  }
}
```

---

## 7. Get Current User
**Endpoint**: `GET /auth/me`

Retrieve full profile details for the currently authenticated user.

### Headers
`Authorization: Bearer <accessToken>`

### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "User profile retrieved",
  "details": {
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "tier": "free",
      "wins_balance": 100,
      "onboarding_completed": true,
      ...
    }
  }
}
```
