# Elite Digital Cards Backend API

A comprehensive backend API for digital business cards with authentication, profile management, and business features.

## Table of Contents
- [Authentication](#authentication)
- [Profile Management](#profile-management)
- [Services](#services)
- [Gallery](#gallery)
- [Products](#products)
- [Testimonials](#testimonials)
- [Appointments](#appointments)
- [Password Reset](#password-reset)
- [Admin Features](#admin-features)
- [Error Handling](#error-handling)

## Authentication

### Signup (Client only)
- **URL**: `POST /api/auth/signup`
- **Body**:
  ```json
  {
    "email": "client@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user_id",
        "email": "client@example.com",
        "role": "client"
      },
      "token": "jwt_token"
    }
  }
  ```

### Login (Client & Admin)
- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "client@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user_id",
        "email": "client@example.com",
        "role": "client"
      },
      "token": "jwt_token"
    }
  }
  ```
## Password Reset

### Forgot Password
- **URL**: `POST /api/password/forgot-password`
- **Body**:
  ```json
  {
    "email": "client@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP sent to your email address"
  }
  ```

### Verify OTP
- **URL**: `POST /api/password/verify-otp`
- **Body**:
  ```json
  {
    "email": "client@example.com",
    "otp": "123456"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully"
  }
  ```

### Reset Password
- **URL**: `POST /api/password/reset-password`
- **Body**:
  ```json
  {
    "email": "client@example.com",
    "otp": "123456",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successfully"
  }
  ```

### Resend OTP
- **URL**: `POST /api/password/resend-otp`
- **Body**:
  ```json
  {
    "email": "client@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP resent to your email address"
  }
  ```

### Get Current User
- **URL**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "email": "client@example.com",
        "role": "client",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
  }
  ```

## Profile Management

### Create Profile
- **URL**: `POST /api/profile/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "profession": "Software Engineer",
    "about": "Experienced developer",
    "phone1": "+1234567890",
    "phone2": "+0987654321",
    "location": "New York, USA",
    "dob": "1990-01-01",
    "socialMedia": {
      "facebook": "https://facebook.com/johndoe",
      "instagram": "https://instagram.com/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "youtube": "https://youtube.com/johndoe",
      "whatsapp": "+1234567890"
    },
    "websiteLink": "https://johndoe.com",
    "appLink": "https://app.johndoe.com",
    "templateId": "template1"
  }
  ```

### Upload Profile Image
- **URL**: `POST /api/profile/upload/profile-image`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `profileImg` (file)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Profile image uploaded successfully",
    "data": {
      "profileImg": "https://bucket.s3.region.amazonaws.com/elite-cards/profileImg/image.jpg"
    }
  }
  ```

### Upload Banner Image
- **URL**: `POST /api/profile/upload/banner-image`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `bannerImg` (file)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Banner image uploaded successfully",
    "data": {
      "bannerImg": "https://bucket.s3.region.amazonaws.com/elite-cards/bannerImg/image.jpg"
    }
  }
  ```

### Get My Profile
- **URL**: `GET /api/profile/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "userId": "user_id",
      "name": "John Doe",
      "profession": "Software Engineer",
      "about": "Experienced developer",
      "phone1": "+1234567890",
      "phone2": "+0987654321",
      "location": "New York, USA",
      "dob": "1990-01-01T00:00:00.000Z",
      "socialMedia": {
        "facebook": "https://facebook.com/johndoe",
        "instagram": "https://instagram.com/johndoe",
        "twitter": "https://twitter.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "youtube": "https://youtube.com/johndoe",
        "whatsapp": "+1234567890"
      },
      "websiteLink": "https://johndoe.com",
      "appLink": "https://app.johndoe.com",
      "templateId": "template1",
      "profileImg": "https://bucket.s3.region.amazonaws.com/elite-cards/profileImg/image.jpg",
      "bannerImg": "https://bucket.s3.region.amazonaws.com/elite-cards/bannerImg/image.jpg",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Update Profile
- **URL**: `PUT /api/profile/me`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "profession": "Software Engineer",
    "about": "Passionate developer with 5+ years of experience",
    "phone1": "+1234567890",
    "phone2": "+0987654321",
    "location": "New York, USA",
    "dob": "1990-05-15",
    "socialMedia": {
      "facebook": "https://facebook.com/johndoe",
      "instagram": "https://instagram.com/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "youtube": "https://youtube.com/johndoe",
      "whatsapp": "+1234567890"
    },
    "websiteLink": "https://johndoe.com",
    "appLink": "https://app.johndoe.com",
    "templateId": "template3"
  }
  ```

### Update Profile Image
- **URL**: `PUT /api/profile/upload/profile-image`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `profileImg` (file)

### Update Banner Image
- **URL**: `PUT /api/profile/upload/banner-image`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `bannerImg` (file)

### Delete Profile
- **URL**: `DELETE /api/profile/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Profile deleted successfully"
  }
  ```

## Services

### Create Service
- **URL**: `POST /api/services/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Web Development",
    "description": "Professional web development services"
  }
  ```

### Get My Services
- **URL**: `GET /api/services/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Service by ID
- **URL**: `GET /api/services/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Service
- **URL**: `PUT /api/services/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Updated Service",
    "description": "Updated description"
  }
  ```

### Delete Service
- **URL**: `DELETE /api/services/:id`
- **Headers**: `Authorization: Bearer <token>`

## Gallery

### Upload Gallery Image
- **URL**: `POST /api/gallery/upload`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: 
  - `image` (file)
  - `caption` (text)

### Get My Gallery
- **URL**: `GET /api/gallery/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Gallery Item by ID
- **URL**: `GET /api/gallery/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Gallery Item
- **URL**: `PUT /api/gallery/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "caption": "Updated caption"
  }
  ```

### Delete Gallery Item
- **URL**: `DELETE /api/gallery/:id`
- **Headers**: `Authorization: Bearer <token>`

## Products

### Create Product
- **URL**: `POST /api/products/upload`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**:
  - `productPhoto` (file)
  - `productName` (text)
  - `price` (number)
  - `details` (text)

### Get My Products
- **URL**: `GET /api/products/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Product by ID
- **URL**: `GET /api/products/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Product
- **URL**: `PUT /api/products/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data** (optional photo update):
  - `productPhoto` (file, optional)
  - `productName` (text)
  - `price` (number)
  - `details` (text)

### Delete Product
- **URL**: `DELETE /api/products/:id`
- **Headers**: `Authorization: Bearer <token>`

## Testimonials

### Create Testimonial
- **URL**: `POST /api/testimonials/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "testimonialName": "Jane Smith",
    "feedback": "Great service and professional work"
  }
  ```

### Get My Testimonials
- **URL**: `GET /api/testimonials/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Testimonial by ID
- **URL**: `GET /api/testimonials/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Testimonial
- **URL**: `PUT /api/testimonials/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "testimonialName": "Updated Name",
    "feedback": "Updated feedback"
  }
  ```

### Delete Testimonial
- **URL**: `DELETE /api/testimonials/:id`
- **Headers**: `Authorization: Bearer <token>`

## Appointments

### Create Appointment
- **URL**: `POST /api/appointments/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "clientName": "Jane Smith",
    "phone": "+1234567890",
    "appointmentDate": "2023-12-01T10:00:00.000Z",
    "notes": "Meeting to discuss project requirements"
  }
  ```

### Get My Appointments
- **URL**: `GET /api/appointments/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Appointment by ID
- **URL**: `GET /api/appointments/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Appointment
- **URL**: `PUT /api/appointments/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "clientName": "Updated Name",
    "phone": "+0987654321",
    "appointmentDate": "2023-12-02T11:00:00.000Z",
    "notes": "Updated notes"
  }
  ```

### Delete Appointment
- **URL**: `DELETE /api/appointments/:id`
- **Headers**: `Authorization: Bearer <token>`



## Admin Features

Admin users can access all client data and perform administrative operations:

- **Services**: `GET /api/services/`, `GET /api/services/:id/admin`, `PUT /api/services/:id/admin`, `DELETE /api/services/:id/admin`
- **Gallery**: `GET /api/gallery/`, `GET /api/gallery/:id/admin`, `PUT /api/gallery/:id/admin`, `DELETE /api/gallery/:id/admin`
- **Products**: `GET /api/products/`, `GET /api/products/:id/admin`, `PUT /api/products/:id/admin`, `DELETE /api/products/:id/admin`
- **Testimonials**: `GET /api/testimonials/`, `GET /api/testimonials/:id/admin`, `PUT /api/testimonials/:id/admin`, `DELETE /api/testimonials/:id/admin`
- **Appointments**: `GET /api/appointments/`, `GET /api/appointments/:id/admin`, `PUT /api/appointments/:id/admin`, `DELETE /api/appointments/:id/admin`
- **Profiles**: `GET /api/profile/`, `GET /api/profile/:id`, `PUT /api/profile/:id`, `DELETE /api/profile/:id`

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode only)"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Authentication Headers

All protected routes require the following header:
```
Authorization: Bearer <jwt_token>
```

## Environment Variables

The application requires the following environment variables in a `.env` file:

```
PORT=3000
JWT_SECRET="your_jwt_secret"
MONGO_URI="mongodb_connection_string"
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="your_aws_region"
AWS_BUCKET_NAME="your_s3_bucket_name"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin_password"
RESEND_API_KEY="your_resend_api_key"
```