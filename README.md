# YumCafe 🍣🥢

![YumCafe Banner](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**YumCafe** is a premium, modern, full-stack food ordering and reservation platform built with the MERN stack (MongoDB, Express, React, Node.js). Designed with a focus on immersive UX/UI, the platform features a highly responsive, glassmorphic design architecture, seamless animations, and a robust backend.

This project demonstrates strong proficiency in both frontend aesthetics and backend architecture, showcasing the ability to build production-ready, scalable web applications.

---

## ✨ Features

### 🎨 Frontend (React + Vite)
- **Immersive Glassmorphic UI:** A visually stunning, modern design utilizing backdrop filters, dynamic gradients, and animated components (Scroll Reveals, Blur Texts, Border Glows).
- **Fully Responsive Design:** A custom mobile-first drawer navigation and perfectly scaled components ensuring a seamless experience across all devices (Desktop, Tablet, Mobile).
- **State Management:** Efficient client-side state management handling complex user interactions like real-time cart updates, authentication status, and active menu filtering.
- **Dynamic Routing:** Utilizes React Router for secure, seamless navigation between Home, Menu, Cart, Orders, and Reservation pages.

### ⚙️ Backend (Node.js + Express)
- **Robust RESTful API:** A well-structured Express.js backend handling CRUD operations for Food Items, User Authentication, Orders, and Reservations.
- **Secure Authentication:** Implements JWT (JSON Web Tokens) and bcrypt for secure user registration, login, and protected route access.
- **Cloud Database Integration:** Fully integrated with **MongoDB Atlas** for scalable, cloud-based data storage.
- **Data Modeling:** Utilizes Mongoose ODM for strict schema validation and relationship mapping (Users -> Orders).

---

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, Bootstrap (Customized), CSS3 (Custom Animations), React Router DOM.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Atlas Cloud), Mongoose ODM.
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js.
- **Deployment:** Ready for deployment on Vercel (Frontend) and Render (Backend).

---

## 🛠️ Installation & Setup (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/YumCafe.git
   cd YumCafe
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file in the backend directory with:
   # PORT=5001
   # MONGO_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret
   node server.js
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3001`

---

## 👨‍💻 About the Developer
Built by a passionate software engineer focusing on delivering high-quality, user-centric web applications. Actively seeking opportunities in Full-Stack and Frontend Development roles.

*If you are a recruiter or hiring manager, please feel free to explore the codebase. I am open to discussing my architectural decisions, the UI/UX design process, and my approach to building this application!*
