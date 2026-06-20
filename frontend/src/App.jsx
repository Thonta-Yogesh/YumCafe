import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import MyOrders from './screens/MyOrders';
import Cart from './screens/Cart';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import MenuPage from './screens/MenuPage';
import OrderTracking from './screens/OrderTracking';
import Reservations from './screens/Reservations';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './components/ContextReducer';
import GradualBlur from './components/GradualBlur';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          {/* Using the ReactBits.dev GradualBlur component with animation enabled */}
          <GradualBlur 
            target="page" 
            position="bottom" 
            strength={1.5}
            height="4rem"
            animated={true} 
            duration="1.5s" 
            zIndex={9000} 
          />
          
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/myorders" element={<MyOrders />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/reset-password" element={<ResetPassword />} />
            <Route exact path="/menu" element={<MenuPage />} />
            <Route exact path="/tracking" element={<OrderTracking />} />
            <Route exact path="/reservations" element={<Reservations />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
