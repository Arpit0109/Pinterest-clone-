# 📸 Pintrest clone

A Node.js + Express web application that allows users to register, log in, upload profile/post images, create and manage posts, and search for users using fuzzy matching.

---

## 🚀 Features

- ✅ User registration and login with JWT authentication  
- 🔐 Password encryption using Bcrypt  
- 🖼️ Upload profile pictures and post images via Multer  
- 🧠 Fuzzy user search with Fuse.js  
- 📄 EJS templating for dynamic HTML rendering  
- 🔐 Middleware to protect routes (isLoggedIn)  
- 👤 View and manage personal and public posts  
- 🗑️ Delete posts  
- ✏️ Edit user profiles  

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS (Embedded JavaScript Templates)  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT (JSON Web Token)  
- **Encryption:** Bcrypt  
- **File Uploads:** Multer  
- **Search:** Fuse.js  

---

## 📁 Project Structure

├── router.js # All route definitions
├── user.js # User schema/model
├── postModel.js # Post schema/model
├── multer.js # Multer setup for handling image uploads
├── views/ # EJS templates (index, profile, add, edit, etc.)
├── public/ # Static files (CSS, JS, images)
├── package.json # Project dependencies
└── README.md # Documentation (this file)