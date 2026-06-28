const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const redisClient = require('../redisClient');

// Initialize dummy data (Cafe Menu: Pizza, Burgers, Pasta, Beverages, Desserts, Salads)
router.get('/seed', async (req, res) => {
  const foods = [
    // --- Pizzas ---
    { name: 'Margherita Pizza', category: 'Pizza', type: 'Veg', price: 12, description: 'Classic delight with 100% real mozzarella cheese.', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60' },
    { name: 'Farmhouse Pizza', category: 'Pizza', type: 'Veg', price: 15, description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom.', imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60' },
    { name: 'Pepperoni Pizza', category: 'Pizza', type: 'Non-Veg', price: 18, description: 'Classic pepperoni topped on mozzarella and signature tomato sauce.', imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60' },
    { name: 'BBQ Chicken Pizza', category: 'Pizza', type: 'Non-Veg', price: 19, description: 'Grilled chicken smothered in BBQ sauce with red onions.', imageUrl: 'https://plus.unsplash.com/premium_photo-1675451537771-0dd5b06b3985?w=500&auto=format&fit=crop&q=60' },
    { name: 'Paneer Tikka Pizza', category: 'Pizza', type: 'Veg', price: 16, description: 'Spiced paneer chunks with capsicum and Indian spices.', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60' },

    // --- Burgers ---
    { name: 'Classic Veg Burger', category: 'Burger', type: 'Veg', price: 8, description: 'A crispy veg patty with fresh veggies and special sauce.', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60' },
    { name: 'Chicken Zinger Burger', category: 'Burger', type: 'Non-Veg', price: 10, description: 'Spicy and crispy chicken patty with mayonnaise and lettuce.', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Mushroom Swiss Burger', category: 'Burger', type: 'Veg', price: 9, description: 'Grilled mushrooms, swiss cheese, and caramelized onions.', imageUrl: 'https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?w=500&auto=format&fit=crop&q=60' },
    { name: 'Double Cheese Beef Burger', category: 'Burger', type: 'Non-Veg', price: 14, description: 'Double juicy beef patties packed with melted cheddar cheese.', imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60' },
    { name: 'Spicy Paneer Burger', category: 'Burger', type: 'Veg', price: 9, description: 'Spicy grilled paneer slab with hot garlic sauce.', imageUrl: 'https://images.unsplash.com/photo-1525164155100-346d0a7905d4?w=500&auto=format&fit=crop&q=60' },

    // --- Pasta ---
    { name: 'Penne Alfredo', category: 'Pasta', type: 'Veg', price: 14, description: 'Creamy white sauce pasta with bell peppers and parmesan.', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop&q=60' },
    { name: 'Spaghetti Bolognese', category: 'Pasta', type: 'Non-Veg', price: 16, description: 'Traditional rich meat sauce over perfectly cooked spaghetti.', imageUrl: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=500&auto=format&fit=crop&q=60' },
    { name: 'Arrabbiata Pasta', category: 'Pasta', type: 'Veg', price: 13, description: 'Spicy tomato sauce base with chili flakes and garlic.', imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=60' },
    { name: 'Chicken Pesto Pasta', category: 'Pasta', type: 'Non-Veg', price: 17, description: 'Grilled chicken folded into fresh basil pesto and pine nuts.', imageUrl: 'https://plus.unsplash.com/premium_photo-1678888047971-ce829ea4bb98?w=500&auto=format&fit=crop&q=60' },
    { name: 'Mac & Cheese', category: 'Pasta', type: 'Veg', price: 12, description: 'The classic incredibly cheesy comfort food baked to perfection.', imageUrl: 'https://plus.unsplash.com/premium_photo-1673581335359-8edb37365cbd?w=500&auto=format&fit=crop&q=60' },

    // --- Beverages ---
    { name: 'Cold Brew Coffee', category: 'Beverages', type: 'Veg', price: 5, description: 'Slow-steeped cold brew served over ice.', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=60' },
    { name: 'Iced Matcha Latte', category: 'Beverages', type: 'Veg', price: 6, description: 'Premium Japanese matcha whisked with oat milk.', imageUrl: 'https://images.unsplash.com/photo-1536514072410-5019a3c69182?w=500&auto=format&fit=crop&q=60' },
    { name: 'Strawberry Mojito', category: 'Beverages', type: 'Veg', price: 7, description: 'Refreshing mocktail with fresh strawberries and mint.', imageUrl: 'https://plus.unsplash.com/premium_photo-1680402879257-ddaebfdbbf4b?w=500&auto=format&fit=crop&q=60' },
    { name: 'Classic Lemonade', category: 'Beverages', type: 'Veg', price: 4, description: 'Freshly squeezed lemons with a hint of sweetness.', imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Chocolate Milkshake', category: 'Beverages', type: 'Veg', price: 8, description: 'Thick, creamy blend of rich chocolate ice cream and milk.', imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75bb827?w=500&auto=format&fit=crop&q=60' },

    // --- Desserts ---
    { name: 'Tiramisu', category: 'Desserts', type: 'Veg', price: 9, description: 'Classic Italian dessert with espresso-soaked ladyfingers.', imageUrl: 'https://images.unsplash.com/photo-1571115177098-24deab4c76ca?w=500&auto=format&fit=crop&q=60' },
    { name: 'Cheesecake', category: 'Desserts', type: 'Veg', price: 8, description: 'New York style cheesecake with a graham cracker crust.', imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60' },
    { name: 'Chocolate Lava Cake', category: 'Desserts', type: 'Veg', price: 10, description: 'Warm chocolate cake with a gooey, molten center.', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60' },
    { name: 'Blueberry Muffin', category: 'Desserts', type: 'Veg', price: 4, description: 'Freshly baked muffin bursting with blueberries.', imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=60' },
    { name: 'Vanilla Ice Cream', category: 'Desserts', type: 'Veg', price: 5, description: 'Two scoops of rich vanilla bean ice cream.', imageUrl: 'https://images.unsplash.com/photo-1570197781417-0a5f98eb6c36?w=500&auto=format&fit=crop&q=60' }
  ];

  try {
    await Food.deleteMany(); // Clear existing
    await Food.insertMany(foods);
    res.json({ message: 'Dummy data seeded successfully. Loaded ' + foods.length + ' items.' });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE 1: Get all food items: GET "/api/food/all"
router.get('/all', async (req, res) => {
  try {
    const cacheKey = 'cafe_menu';
    
    // Check if the menu is in Redis Cache
    try {
      const cachedMenu = await redisClient.get(cacheKey);
      if (cachedMenu) {
        console.log('⚡ Fetched menu from Redis Cache');
        return res.json(JSON.parse(cachedMenu));
      }
    } catch (redisErr) {
      console.warn('⚠️ Redis read failed, falling back to MongoDB:', redisErr.message);
    }

    // If not in cache, fetch from MongoDB
    const foods = await Food.find();
    console.log('💽 Fetched menu from MongoDB');
    
    // Save to Redis Cache (expire in 1 hour = 3600 seconds)
    try {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(foods));
    } catch (redisErr) {
      console.warn('⚠️ Redis write failed:', redisErr.message);
    }

    res.json(foods);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
