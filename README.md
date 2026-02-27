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
- [Mail](#mail)
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

## Mail

### Send Single Mail
- **URL**: `POST /api/mail/send-single`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**:
  - `clientId` (string)
  - `subject` (string)
  - `message` (string)
  - `attachments` (files, optional, up to 5 files)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Mail sent to client@example.com",
    "sender": "admin@example.com (admin)",
    "messageId": "message_id"
  }
  ```

### Send Group Mail
- **URL**: `POST /api/mail/send-group`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**:
  - `clientIds[]` (array of client IDs)
  - `subject` (string)
  - `message` (string)
  - `attachments` (files, optional, up to 5 files)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Group mail sent to 5 clients",
    "emails": ["client1@example.com", "client2@example.com", "..."],
    "sender": "admin@example.com (admin)",
    "messageId": "message_id"
  }
  ```

### Get Sent Mails
- **URL**: `GET /api/mail/`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `senderEmail` (string, optional)
  - `recipientType` (string, optional, "single" or "group")
- **Response**:
  ```json
  {
    "success": true,
    "mails": [
      {
        "_id": "mail_id",
        "messageId": "message_id",
        "senderEmail": "admin@example.com",
        "senderRole": "admin",
        "recipients": ["client@example.com"],
        "recipientType": "single",
        "subject": "Email Subject",
        "sentAt": "2023-01-01T00:00:00.000Z",
        "attachments": [
          {
            "filename": "document.pdf",
            "size": 1024
          }
        ],
        "clientIds": ["client_id"]
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "totalMails": 1
  }
  ```

### Get Sent Mail by ID
- **URL**: `GET /api/mail/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "mail": {
      "_id": "mail_id",
      "messageId": "message_id",
      "senderEmail": "admin@example.com",
      "senderRole": "admin",
      "recipients": ["client@example.com"],
      "recipientType": "single",
      "subject": "Email Subject",
      "sentAt": "2023-01-01T00:00:00.000Z",
      "attachments": [
        {
          "filename": "document.pdf",
          "size": 1024
        }
      ],
      "clientIds": ["client_id"]
    }
  }
  ```

## Student Profiles

### Create Student Profile
- **URL**: `POST /api/student-profiles/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "about": "About me section",
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
    "templateId": "template1"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Student profile created successfully",
    "data": {
      "_id": "profile_id",
      "userId": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "about": "About me section",
      "phone1": "+1234567890",
      "phone2": "+0987654321",
      "location": "New York, USA",
      "dob": "1990-01-01T00:00:00.000Z",
      "socialMedia": {},
      "templateId": "template1",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Upload Student Profile Picture
- **URL**: `POST /api/student-profiles/upload/profile-pic`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `profilePic` (file)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Profile picture uploaded successfully",
    "data": {
      "profilePic": "https://bucket.s3.region.amazonaws.com/elite-cards/studentProfilePic/image.jpg"
    }
  }
  ```

### Upload Student Banner Picture
- **URL**: `POST /api/student-profiles/upload/banner-pic`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `bannerPic` (file)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Banner picture uploaded successfully",
    "data": {
      "bannerPic": "https://bucket.s3.region.amazonaws.com/elite-cards/studentBannerPic/image.jpg"
    }
  }
  ```

### Update Student Profile Picture
- **URL**: `PUT /api/student-profiles/upload/profile-pic`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `profilePic` (file)

### Update Student Banner Picture
- **URL**: `PUT /api/student-profiles/upload/banner-pic`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**: `bannerPic` (file)

### Get My Student Profile
- **URL**: `GET /api/student-profiles/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "profile_id",
      "userId": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "about": "About me section",
      "phone1": "+1234567890",
      "phone2": "+0987654321",
      "location": "New York, USA",
      "dob": "1990-01-01T00:00:00.000Z",
      "socialMedia": {},
      "templateId": "template1",
      "profilePic": "https://bucket.s3.region.amazonaws.com/elite-cards/studentProfilePic/image.jpg",
      "bannerPic": "https://bucket.s3.region.amazonaws.com/elite-cards/studentBannerPic/image.jpg",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Update My Student Profile
- **URL**: `PUT /api/student-profiles/me`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "fullName": "John Doe Updated",
    "email": "john.updated@example.com",
    "about": "Updated about me section",
    "phone1": "+1234567890",
    "phone2": "+0987654321",
    "location": "San Francisco, USA",
    "dob": "1990-01-01",
    "socialMedia": {
      "facebook": "https://facebook.com/johndoe",
      "instagram": "https://instagram.com/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "youtube": "https://youtube.com/johndoe",
      "whatsapp": "+1234567890"
    },
    "templateId": "template2"
  }
  ```

### Delete My Student Profile
- **URL**: `DELETE /api/student-profiles/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Student profile deleted successfully"
  }
  ```

### Get Public Student Profile
- **URL**: `GET /api/student-profiles/public/:userId`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "about": "About me section",
      "phone1": "+1234567890",
      "phone2": "+0987654321",
      "location": "New York, USA",
      "dob": "1990-01-01T00:00:00.000Z",
      "socialMedia": {},
      "templateId": "template1",
      "profilePic": "https://bucket.s3.region.amazonaws.com/elite-cards/studentProfilePic/image.jpg",
      "bannerPic": "https://bucket.s3.region.amazonaws.com/elite-cards/studentBannerPic/image.jpg",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

## Student Achievements

### Create Student Achievement
- **URL**: `POST /api/student-achievements/`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**:
  - `certificateImage` (file, optional)
  - `title` (text)
  - `date` (text)
  - `description` (text)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Achievement record created successfully",
    "data": {
      "_id": "achievement_id",
      "userId": "user_id",
      "title": "Best Student Award",
      "desc": "Outstanding academic performance",
      "date": "2023-06-15",
      "certificateUrl": "https://bucket.s3.region.amazonaws.com/elite-cards/student-achievements/certificate.jpg",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get My Student Achievements
- **URL**: `GET /api/student-achievements/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Student Achievement by ID
- **URL**: `GET /api/student-achievements/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Student Achievement
- **URL**: `PUT /api/student-achievements/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data** (optional image update):
  - `certificateImage` (file, optional)
  - `title` (text)
  - `date` (text)
  - `description` (text)

### Delete Student Achievement
- **URL**: `DELETE /api/student-achievements/:id`
- **Headers**: `Authorization: Bearer <token>`

### Get Public Student Achievements
- **URL**: `GET /api/student-achievements/public/:userId`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "achievement_id",
        "userId": "user_id",
        "title": "Best Student Award",
        "desc": "Outstanding academic performance",
        "date": "2023-06-15",
        "certificateUrl": "https://bucket.s3.region.amazonaws.com/elite-cards/student-achievements/certificate.jpg",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

## Student Education

### Create Student Education
- **URL**: `POST /api/student-educations/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "school": "Stanford University",
    "degree": "Bachelor's Degree",
    "major": "Computer Science",
    "year": "2020-2024",
    "gpa": "3.8"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Education record created successfully",
    "data": {
      "_id": "education_id",
      "userId": "user_id",
      "school": "Stanford University",
      "degree": "Bachelor's Degree",
      "major": "Computer Science",
      "year": "2020-2024",
      "gpa": "3.8",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get My Student Educations
- **URL**: `GET /api/student-educations/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Student Education by ID
- **URL**: `GET /api/student-educations/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Student Education
- **URL**: `PUT /api/student-educations/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "school": "Stanford University",
    "degree": "Master's Degree",
    "major": "Computer Science",
    "year": "2024-2026",
    "gpa": "3.9"
  }
  ```

### Delete Student Education
- **URL**: `DELETE /api/student-educations/:id`
- **Headers**: `Authorization: Bearer <token>`

### Get Public Student Educations
- **URL**: `GET /api/student-educations/public/:userId`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "education_id",
        "userId": "user_id",
        "school": "Stanford University",
        "degree": "Bachelor's Degree",
        "major": "Computer Science",
        "year": "2020-2024",
        "gpa": "3.8",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

## Student Experience

### Create Student Experience
- **URL**: `POST /api/student-experiences/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "company": "Google Inc.",
    "role": "Software Engineer Intern",
    "startDate": "2023-06-01",
    "endDate": "2023-12-01",
    "desc": "Worked on developing scalable web applications",
    "duration": "6 months"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Experience record created successfully",
    "data": {
      "_id": "experience_id",
      "userId": "user_id",
      "company": "Google Inc.",
      "role": "Software Engineer Intern",
      "startDate": "2023-06-01T00:00:00.000Z",
      "endDate": "2023-12-01T00:00:00.000Z",
      "desc": "Worked on developing scalable web applications",
      "duration": "6 months",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get My Student Experiences
- **URL**: `GET /api/student-experiences/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Student Experience by ID
- **URL**: `GET /api/student-experiences/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Student Experience
- **URL**: `PUT /api/student-experiences/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "company": "Microsoft Corp.",
    "role": "Senior Software Engineer",
    "startDate": "2024-01-15",
    "endDate": "Present",
    "desc": "Leading development of cloud infrastructure",
    "duration": "Ongoing"
  }
  ```

### Delete Student Experience
- **URL**: `DELETE /api/student-experiences/:id`
- **Headers**: `Authorization: Bearer <token>`

### Get Public Student Experiences
- **URL**: `GET /api/student-experiences/public/:userId`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "experience_id",
        "userId": "user_id",
        "company": "Google Inc.",
        "role": "Software Engineer Intern",
        "startDate": "2023-06-01T00:00:00.000Z",
        "endDate": "2023-12-01T00:00:00.000Z",
        "desc": "Worked on developing scalable web applications",
        "duration": "6 months",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

## Student Projects

### Create Student Project
- **URL**: `POST /api/student-projects/`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**:
  - `projectImage` (file, optional)
  - `projectName` (text)
  - `description` (text)
  - `technologies` (text)
  - `projectUrl` (text)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Project record created successfully",
    "data": {
      "_id": "project_id",
      "userId": "user_id",
      "title": "E-commerce Platform",
      "desc": "A full-featured online shopping platform",
      "tech": "React, Node.js, MongoDB",
      "link": "https://github.com/user/project",
      "category": "student-project",
      "imageUrl": "https://bucket.s3.region.amazonaws.com/elite-cards/student-projects/project-image.jpg",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get My Student Projects
- **URL**: `GET /api/student-projects/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Student Project by ID
- **URL**: `GET /api/student-projects/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Student Project
- **URL**: `PUT /api/student-projects/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Form Data** (optional image update):
  - `projectImage` (file, optional)
  - `projectName` (text)
  - `description` (text)
  - `technologies` (text)
  - `projectUrl` (text)

### Delete Student Project
- **URL**: `DELETE /api/student-projects/:id`
- **Headers**: `Authorization: Bearer <token>`

### Get Public Student Projects
- **URL**: `GET /api/student-projects/public/:userId`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "project_id",
        "userId": "user_id",
        "title": "E-commerce Platform",
        "desc": "A full-featured online shopping platform",
        "tech": "React, Node.js, MongoDB",
        "link": "https://github.com/user/project",
        "category": "student-project",
        "imageUrl": "https://bucket.s3.region.amazonaws.com/elite-cards/student-projects/project-image.jpg",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

## Student Skills

### Create Student Skill
- **URL**: `POST /api/student-skills/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "JavaScript",
    "level": "Advanced"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Skill created successfully",
    "data": {
      "_id": "skill_id",
      "userId": "user_id",
      "name": "JavaScript",
      "level": "Advanced",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get My Student Skills
- **URL**: `GET /api/student-skills/my`
- **Headers**: `Authorization: Bearer <token>`

### Get Student Skill by ID
- **URL**: `GET /api/student-skills/:id`
- **Headers**: `Authorization: Bearer <token>`

### Update Student Skill
- **URL**: `PUT /api/student-skills/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "JavaScript",
    "level": "Expert"
  }
  ```

### Delete Student Skill
- **URL**: `DELETE /api/student-skills/:id`
- **Headers**: `Authorization: Bearer <token>`

### Get Public Student Skills
- **URL**: `GET /api/student-skills/public/:userId`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "skill_id",
        "userId": "user_id",
        "name": "JavaScript",
        "level": "Advanced",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

## Inquiries

### Submit Inquiry
- **URL**: `POST /api/inquiries/`
- **Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "message": "I'm interested in your services."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Inquiry submitted successfully",
    "data": {
      "_id": "inquiry_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "message": "I'm interested in your services.",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get All Inquiries
- **URL**: `GET /api/inquiries/`
- **Headers**: `Authorization: Bearer <token>` (Admin only)

### Get Inquiry by ID
- **URL**: `GET /api/inquiries/:id`
- **Headers**: `Authorization: Bearer <token>` (Admin only)

### Delete Inquiry
- **URL**: `DELETE /api/inquiries/:id`
- **Headers**: `Authorization: Bearer <token>` (Admin only)

## Admin Features

Admin users can access all client data and perform administrative operations:

- **Services**: `GET /api/services/`, `GET /api/services/:id/admin`, `PUT /api/services/:id/admin`, `DELETE /api/services/:id/admin`
- **Gallery**: `GET /api/gallery/`, `GET /api/gallery/:id/admin`, `PUT /api/gallery/:id/admin`, `DELETE /api/gallery/:id/admin`
- **Products**: `GET /api/products/`, `GET /api/products/:id/admin`, `PUT /api/products/:id/admin`, `DELETE /api/products/:id/admin`
- **Testimonials**: `GET /api/testimonials/`, `GET /api/testimonials/:id/admin`, `PUT /api/testimonials/:id/admin`, `DELETE /api/testimonials/:id/admin`
- **Appointments**: `GET /api/appointments/`, `GET /api/appointments/:id/admin`, `PUT /api/appointments/:id/admin`, `DELETE /api/appointments/:id/admin`
- **Profiles**: `GET /api/profile/`, `GET /api/profile/:id`, `PUT /api/profile/:id`, `DELETE /api/profile/:id`
- **Student Profiles**: `GET /api/student-profiles/`, `GET /api/student-profiles/:id`, `PUT /api/student-profiles/:id`, `DELETE /api/student-profiles/:id`
- **Student Achievements**: `GET /api/student-achievements/`, `GET /api/student-achievements/:id/admin`, `PUT /api/student-achievements/:id/admin`, `DELETE /api/student-achievements/:id/admin`
- **Student Educations**: `GET /api/student-educations/`, `GET /api/student-educations/:id/admin`, `PUT /api/student-educations/:id/admin`, `DELETE /api/student-educations/:id/admin`
- **Student Experiences**: `GET /api/student-experiences/`, `GET /api/student-experiences/:id/admin`, `PUT /api/student-experiences/:id/admin`, `DELETE /api/student-experiences/:id/admin`
- **Student Projects**: `GET /api/student-projects/`, `GET /api/student-projects/:id/admin`, `PUT /api/student-projects/:id/admin`, `DELETE /api/student-projects/:id/admin`
- **Student Skills**: `GET /api/student-skills/`, `GET /api/student-skills/:id/admin`, `PUT /api/student-skills/:id/admin`, `DELETE /api/student-skills/:id/admin`
- **Inquiries**: `GET /api/inquiries/`, `GET /api/inquiries/:id`, `DELETE /api/inquiries/:id`
- **Mail**: `POST /api/mail/send-single`, `POST /api/mail/send-group`, `GET /api/mail/`, `GET /api/mail/:id`

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