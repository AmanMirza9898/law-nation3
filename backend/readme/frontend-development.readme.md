# Law Nation Backend – Frontend Developer Guide

## 1. Purpose of This Document

This README is for **frontend developers** consuming the Law Nation Backend API.
It explains:

* Authentication & token handling
* RBAC permission expectations
* API structure & patterns
* Error response formats
* File upload handling

You **do not need backend knowledge** to use this API effectively.

---

## 2. API Base URL

```
/api
```

Example (local):

```
http://localhost:4000/api
```

---

## 3. Authentication Model

### 3.1 Tokens

* **Access Token**: JWT (short-lived)
* **Refresh Token**: Stored as **HTTP-only cookie**

Frontend stores:

* Access token (memory or secure storage)
* Refresh token is **never accessed directly** (cookie-based)

---

## 4. Login Flow

### Endpoint

```
POST /api/auth/login
```

### Request

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Response

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "...",
    "name": "John",
    "email": "john@example.com",
    "roles": [{ "id": "...", "name": "Admin" }]
  }
}
```

### Frontend Actions

* Save `accessToken`
* Attach token to all requests

```http
Authorization: Bearer <accessToken>
```

---

## 5. Refresh Token Flow

### Endpoint

```
POST /api/auth/refresh
```

* Cookie automatically sent
* Returns new access token

### When to Refresh

* On `401 Unauthorized`
* On app reload

---

## 6. Logout

### Endpoint

```
POST /api/auth/logout
```

* Revokes refresh token
* Clears cookie

---

## 7. Current User

### Endpoint

```
GET /api/auth/me
```

### Response

```json
{
  "user": {
    "id": "...",
    "name": "John",
    "email": "john@example.com",
    "roles": [{ "id": "...", "name": "Admin" }]
  }
}
```

---

## 8. RBAC & Permissions

### 8.1 How Permissions Work

* Users have **roles**
* Roles have **permissions**
* Permissions are strings like:

```
user.read
user.write
role.delete
```

### 8.2 Frontend Responsibility

* Backend enforces permissions
* Frontend should:

  * Hide UI actions user cannot perform
  * Gracefully handle 403 errors

You may request a **permissions list** endpoint in future if needed.

---

## 9. Users API

### List Users

```
GET /api/users
```

### Create User

```
POST /api/users
```

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "roleIds": ["role-id"]
}
```

---

## 10. Roles API

Base:

```
/api/rbac/roles
```

Examples:

* `GET /` – list roles
* `POST /` – create role
* `POST /:id/permissions` – assign permission

---

## 11. Permissions API

Base:

```
/api/rbac/permissions
```

Permission keys are lowercase and normalized.

---

## 12. File Uploads

### Single Image Upload

* Field name: `image`
* Content-Type: `multipart/form-data`

### Multi Image Upload

* Field name: `images`
* Max files: configurable (default 10)

### Response

Uploaded URLs are returned from the backend and should be stored by frontend.

---

## 13. Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "details": {}
}
```

### Common Status Codes

* `400` – validation error
* `401` – not authenticated / token expired
* `403` – permission denied
* `404` – not found
* `500` – server error

---

## 14. CORS & Cookies

* `credentials: true` is required
* Frontend must send cookies:

```js
fetch(url, { credentials: "include" })
```

---

## 15. Recommended Frontend Practices

* Centralize API client
* Intercept 401 → refresh token
* Cache user roles in state
* Feature-flag UI based on roles

---

## 16. Health Check

```
GET /api/health
```

---

## 17. Contact Backend Team

If you need:

* New endpoints
* Permission additions
* API changes

Coordinate with backend maintainers before implementation.

---

Happy building 🎯
