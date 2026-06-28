# YumCafe 🍣🥢

![YumCafe Banner](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**YumCafe** is a bespoke, Direct-to-Consumer (D2C) digital solution built specifically for premium restaurants and cafes. 

While aggregator apps like Swiggy and Zomato exist, YumCafe provides individual restaurants with their own branded, highly-immersive platform. It empowers businesses to bypass third-party commissions and offer their customers exclusive coupons, direct food delivery, table reservations, and seamless in-restaurant ordering—all wrapped in a stunning, modern UI.

Built with the MERN stack (MongoDB, Express, React, Node.js), this platform demonstrates how beautiful design and robust backend architecture can elevate a restaurant's digital presence.

---

## ✨ Features

### 🎨 Frontend (React + Vite)
- **Premium Glassmorphic UI:** A visually stunning, modern design utilizing backdrop filters, dynamic gradients, and animated components to match the aesthetic of a high-end cafe.
- **Fully Responsive Design:** A custom mobile-first drawer navigation and perfectly scaled components ensuring a flawless experience for customers on Desktop, Tablet, or Mobile.
- **State Management:** Efficient client-side state handling complex user interactions like real-time cart updates, active menu filtering, and authentication status.
- **Dynamic Routing:** Utilizes React Router for secure, seamless navigation between Home, Menu, Cart, Orders, and Reservation pages.

### ⚙️ Backend (Node.js + Express)
- **Robust RESTful API:** A well-structured Express.js backend handling CRUD operations for Menu Items, User Authentication, Direct Delivery Orders, and Table Reservations.
- **Secure Authentication:** Implements JWT (JSON Web Tokens) and bcrypt for secure user registration, login, and protected route access.
- **Cloud Database Integration:** Fully integrated with **MongoDB Atlas** for scalable, cloud-based data storage, with optimized B-Tree indexing on core fields to ensure high read throughput.
- **In-Memory Caching:** Implements **Redis** caching to serve the cafe menu instantly, heavily reducing database load and latency during peak usage.
- **Data Modeling:** Utilizes Mongoose ODM for strict schema validation and relationship mapping.

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
   # REDIS_URL=your_redis_connection_string
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

## 👨‍💻 About the Project & My Learning Journey
I built YumCafe as a comprehensive, hands-on learning project to deepen my understanding of Full-Stack web development while solving a real-world business problem for the restaurant industry. My primary goal was to gain practical exposure to the MERN stack and learn how to integrate beautiful frontend interfaces with secure backend APIs.

Throughout the development of YumCafe, I actively explored concepts such as:
- Structuring React components and managing application state.
- Designing responsive layouts and modern, immersive UI elements.
- Setting up a RESTful API with Express and Node.js.
- Connecting and managing cloud databases with MongoDB Atlas.

I am highly motivated, constantly learning, and actively seeking entry-level Full-Stack or Frontend Development opportunities where I can continue to grow as an engineer!
