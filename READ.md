# 📸 Photo Caption Contest API

## 📖 Description
This is a backend API for a photo caption contest platform.  
Users can register, log in, browse images, upload new images, and submit captions for images.

The project demonstrates authentication, database relationships, caching, and API documentation using modern backend technologies.

---

## 🚀 Features
- User registration and login (JWT authentication)
- Image gallery system
- Caption system linked to users and images
- Protected routes (only authenticated users can post captions)
- Caching using node-cache
- Swagger API documentation

---

## 🛠️ Tech Stack
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- Swagger (API Documentation)
- node-cache

---

## 📡 API Endpoints

### Authentication
- POST /register → Register a new user  
- POST /login → Login and receive JWT token  

### Images
- GET /images → Retrieve all images  
- GET /images/:id → Retrieve a single image with captions  
- POST /images → Upload a new image  

### Captions
- POST /images/:id/captions → Add a caption (requires authentication)

---

## ⚙️ How to Run Locally

bash yarn install yarn dev 

Open in browser:
http://localhost:3000

Swagger API Docs:
http://localhost:3000/api-docs

---

## 🔐 Environment Variables

Create a .env file in the root directory:

env JWT_SECRET=your_secret_key 

---

## 🧪 Testing the API

You can test all endpoints using Swagger:
http://localhost:3000/api-docs

Or use tools like Postman.

---

## 👤 Demo Account (Optional)

You may use the following test account:

- Email: peter@example.com  
- Password: 1357

Alternatively, register a new user via /register.

---

## ⚠️ Notes
- Authentication is required to post captions.
- Do not use real personal credentials when testing.

---

## 🚀 Future Improvements
- Caption voting system
- User profiles
- Image upload support (file storage instead of URLs)
- Frontend enhancements

-