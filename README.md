# HungryApp - Smart Food Delivery Platform 🍕🍔

A fully functional, secure, and modern food delivery app built using the **MERN Stack** (MongoDB, Express, React, Node.js) with Bootstrap v5 styling.

---

## 🏗️ Architecture & Component Breakdown
Below is the explanation of all the tools and their respective roles in this project, separated into Backend and Frontend.

### 🏠 Backend Node.js Environment (`/backend`)
Handles business logic, user authentication, database operations, and external API calls.

1. **`server.js`**
   - **Job**: The entry point for the backend. It connects to the MongoDB database, initializes the Express server, enables Cross-Origin Resource Sharing (CORS), sets up JSON parsing middleware, and registers all the API routes. 
2. **`models/User.js`, `models/Food.js`, `models/Order.js`**
   - **Job**: These define the schemas/structure for storing documents inside MongoDB using `mongoose`.
   - `User.js` handles user details (encrypted password, email, etc.).
   - `Food.js` handles menu items natively.
   - `Order.js` manages relationship logic: A user ID and a list of food IDs, prices, and quantities for cart checkout persistence.
3. **`routes/auth.js`**
   - **Job**: Exposes user registration (`/register`) and login (`/login`) functionality. It uses `bcryptjs` to hash and compare passwords before creating `jsonwebtoken` (JWT) user access tokens.
4. **`routes/food.js`**
   - **Job**: Retrieves all food available on the platform (`/all`). Also contains a useful `/seed` endpoint to populate starting dummy data on the first run.
5. **`routes/order.js`**
   - **Job**: Endpoints for tracking User purchases. `/place` handles posting the completed cart. `/myorders` extracts order history specific to the authenticated User making the request.
6. **`middleware/fetchuser.js`**
   - **Job**: Acts as a gateway function before secure endpoints. It reads the `auth-token` header, validates the JSON Web Token, decodes the User's ID, and appends it to the `req` context for safe database queries.

### 🌐 Frontend Vite + React (`/frontend`)
User interface and global state management layer built using React.

1. **`ContextReducer.jsx` (Smart Cart Management)**
   - **Job**: Implements the globally accessible Context API and useReducer hook. 
   - State includes: `ADD` (new items), `REMOVE` (deleting specific items), `UPDATE` (the **Smart Cart Rule**: seamlessly accumulating the quantity/price of items that share the same food id to prevent clutter), and `DROP` (clearing cart post-checkout).
2. **`App.jsx` & `main.jsx`**
   - **Job**: `main.jsx` initializes React, loading Bootstrap's JS/CSS natively. `App.jsx` handles global `<Router>` navigation across specific screens and wraps everything with the Cart Context Provider.
3. **`components/Navbar.jsx`**
   - **Job**: A responsive dynamic header. Depending on `localStorage` containing an active Authentication token, it intuitively flips between offering *"Login/Signup"* buttons or exposing private routes like *"My Cart"* and *"My Orders"*. It also dynamically prints out a red badge tallying how many total items hover inside the Cart.
4. **`components/Card.jsx`**
   - **Job**: Render logic for individual Food items. Embeds options for setting quantities, tracking price math inline dynamically, and firing payload `ADD/UPDATE` action dispatchers directly to the CartReducer when clicked.
5. **`screens/Home.jsx`**
   - **Job**: Fetches available foods via the backend `/api/food` endpoints. On first boot, triggers the `/seed` auto-generator if the database is newly created.
6. **`screens/Cart.jsx`**
   - **Job**: The checkout table. Maps globally mapped Cart data dynamically into rows allowing the Delete logic ("🗑️ Remove from Cart"). Performs math calculation for Checkout buttons which securely fires API fetches to place orders.
7. **`screens/MyOrders.jsx` (Order History)**
   - **Job**: Fetches JSON payload mapped purely to what the Authenticated user has requested in the past, iterating out dates and items purchased natively.
8. **`screens/Login.jsx` & `screens/Signup.jsx`**
   - **Job**: Standard secure forms passing form contents securely via Axios requests, and saving returned `JWT Token` natively to `localStorage` enabling App usage.

---

## 🚀 How to Run the App Local Environment

**Prerequisites:** 
- Node.js (v16+)
- A local MongoDB instance running on `localhost:27017`

**1. Run Backend server**
Open a new terminal window inside the repository and run:
\`\`\`bash
cd backend
npm start
# OR
node server.js
\`\`\`
Server boots onto port `5001`.

**2. Run Frontend Client**
Open a separate terminal window and run:
\`\`\`bash
cd frontend
npm run dev
\`\`\`
Client boots onto standard Vite port (`http://localhost:3000`).

Happy ordering! 🚀
