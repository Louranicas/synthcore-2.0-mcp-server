# API Documentation

This document provides details about the API endpoints for the Item Management application.

## Base URL

All API endpoints are relative to the following base URL:

*   **Development/Local**: `http://localhost:5001` (or as configured)
*   **Production**: (To be specified based on deployment)

## Authentication

1.  **Register**: Use the `POST /register` endpoint to create a new user account.
2.  **Login**: Use the `POST /login` endpoint with your username and password.
    *   On successful login, the API returns a message (currently "Login successful").
    *   **Note**: The current backend implementation does not return a JWT token upon login. For frontend development, a simulated token was used. A production-ready API should return a JWT token here.
3.  **Authorization**: For protected endpoints (not yet fully implemented in the current version, but planned), include the obtained token in the `Authorization` header of your requests:
    `Authorization: Bearer <YOUR_JWT_TOKEN>`

## Endpoints

### Users

#### 1. Register User
*   **Endpoint**: `POST /register`
*   **Purpose**: Creates a new user account.
*   **Request Format**:
    *   `Content-Type: application/json`
    *   Payload:
        ```json
        {
          "username": "yourusername",
          "password": "yourpassword"
        }
        ```
*   **Response Format**:
    *   **Success (201 Created)**:
        ```json
        {
          "message": "User registered successfully"
        }
        ```
    *   **Failure (400 Bad Request)**: If username/password missing, or user already exists.
        ```json
        {
          "message": "Username and password are required" 
        }
        ```
        ```json
        {
          "message": "User already exists"
        }
        ```

#### 2. Login User
*   **Endpoint**: `POST /login`
*   **Purpose**: Authenticates an existing user.
*   **Request Format**:
    *   `Content-Type: application/json`
    *   Payload:
        ```json
        {
          "username": "yourusername",
          "password": "yourpassword"
        }
        ```
*   **Response Format**:
    *   **Success (200 OK)**:
        ```json
        {
          "message": "Login successful" 
          // "token": "your_jwt_token_here" // Expected in a full implementation
        }
        ```
    *   **Failure (401 Unauthorized)**: If invalid credentials.
        ```json
        {
          "message": "Invalid username or password"
        }
        ```
    *   **Failure (400 Bad Request)**: If username/password missing.
        ```json
        {
          "message": "Username and password are required"
        }
        ```

### Items

**Note**: Most item endpoints should ideally be protected and require authentication. The current implementation might not enforce this strictly for all methods and relies on `user_id` in the payload or a default user for creation.

#### 1. Create Item
*   **Endpoint**: `POST /items`
*   **Purpose**: Creates a new item.
*   **Request Format**:
    *   `Content-Type: application/json`
    *   Payload:
        ```json
        {
          "name": "Item Name",
          "description": "Optional item description",
          "user_id": 1 // ID of the user creating the item (ideally inferred from auth token)
        }
        ```
        *(Note: If `user_id` is not provided, the backend currently has a fallback to a default user or the first available user. This should be refined with proper authentication.)*
*   **Response Format**:
    *   **Success (201 Created)**:
        ```json
        {
          "id": 123,
          "name": "Item Name",
          "description": "Optional item description",
          "user_id": 1
        }
        ```
    *   **Failure (400 Bad Request)**: If `name` is missing.
        ```json
        {
          "message": "Item name is required"
        }
        ```

#### 2. Get All Items
*   **Endpoint**: `GET /items`
*   **Purpose**: Retrieves a list of all items.
*   **Request Format**: None
*   **Response Format**:
    *   **Success (200 OK)**:
        ```json
        [
          {
            "id": 123,
            "name": "Item Name 1",
            "description": "Description 1",
            "user_id": 1
          },
          {
            "id": 124,
            "name": "Item Name 2",
            "description": "Description 2",
            "user_id": 2
          }
        ]
        ```

#### 3. Get Specific Item
*   **Endpoint**: `GET /items/{item_id}`
*   **Purpose**: Retrieves details of a specific item by its ID.
*   **Request Format**: None (item ID is in the URL path)
*   **Response Format**:
    *   **Success (200 OK)**:
        ```json
        {
          "id": 123,
          "name": "Item Name 1",
          "description": "Description 1",
          "user_id": 1
        }
        ```
    *   **Failure (404 Not Found)**: If item with the given ID does not exist.

#### 4. Update Item
*   **Endpoint**: `PUT /items/{item_id}`
*   **Purpose**: Updates an existing item.
*   **Request Format**:
    *   `Content-Type: application/json`
    *   Payload (include fields to update):
        ```json
        {
          "name": "Updated Item Name",
          "description": "Updated description"
        }
        ```
*   **Response Format**:
    *   **Success (200 OK)**:
        ```json
        {
          "id": 123,
          "name": "Updated Item Name",
          "description": "Updated description",
          "user_id": 1
        }
        ```
    *   **Failure (404 Not Found)**: If item with the given ID does not exist.

#### 5. Delete Item
*   **Endpoint**: `DELETE /items/{item_id}`
*   **Purpose**: Deletes a specific item by its ID.
*   **Request Format**: None
*   **Response Format**:
    *   **Success (200 OK)**:
        ```json
        {
          "message": "Item deleted"
        }
        ```
    *   **Failure (404 Not Found)**: If item with the given ID does not exist.
