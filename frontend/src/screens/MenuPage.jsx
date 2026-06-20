import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatchCart, useCart } from '../components/ContextReducer';
import './MenuPage.css';

const CATEGORIES = ['All', 'Starters', 'Kebabs', 'Biryanis', 'Curries', 'Frieds', 'Sushi & Rolls', 'Ramen & Bowls', 'Grill & Sides', 'Gourmet Sandwiches', 'Espresso Bar', 'Cold Brew & Iced', 'Mojitos & Mocktails', 'Pastries & Desserts'];

const MENU_ITEMS = [
  // ── HYDERABADI & INDIAN ──
  // Starters
  { _id: 'h1', name: 'Chicken 65', category: 'Starters', price: 320, tag: '🌶️ Spicy', veg: false, imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=600', description: 'Deep-fried spicy chicken tossed with curry leaves and green chilies.' },
  { _id: 'h2', name: 'Paneer Tikka', category: 'Starters', price: 290, tag: '🔥 Tandoori', veg: true, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600', description: 'Marinated paneer chunks grilled in a tandoor with onions and bell peppers.' },
  { _id: 'h3', name: 'Apollo Fish', category: 'Starters', price: 380, tag: '🐟 Crispy', veg: false, imageUrl: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=600', description: 'Hyderabadi style crispy fried boneless fish tossed in yogurt and spice mixture.' },

  // Kebabs
  { _id: 'h4', name: 'Mutton Shikampur', category: 'Kebabs', price: 420, tag: '🍖 Rich', veg: false, imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=600', description: 'Melt-in-mouth minced mutton patties stuffed with hung curd and mint.' },
  { _id: 'h5', name: 'Tangdi Kebab', category: 'Kebabs', price: 360, tag: '🔥 Roasted', veg: false, imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600', description: 'Chicken drumsticks marinated in rich spices and roasted in the tandoor.' },
  { _id: 'h6', name: 'Reshmi Kebab', category: 'Kebabs', price: 340, tag: '✨ Silky', veg: false, imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=600', description: 'Soft and silky chicken skewers marinated with cream, cheese, and mild spices.' },

  // Biryanis
  { _id: 'h7', name: 'Hyderabadi Chicken Dum Biryani', category: 'Biryanis', price: 380, tag: '⭐ Authentic', veg: false, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600', description: 'Classic basmati rice layered with marinated chicken, saffron, and aromatic spices cooked on dum.' },
  { _id: 'h8', name: 'Mutton Biryani', category: 'Biryanis', price: 450, tag: '👑 Premium', veg: false, imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=600', description: 'Tender mutton pieces and basmati rice slow-cooked with authentic Hyderabadi spices.' },
  { _id: 'h9', name: 'Paneer Biryani', category: 'Biryanis', price: 320, tag: '🌿 Veg', veg: true, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600', description: 'Fragrant biryani rice layered with spicy paneer cubes and fried onions.' },

  // Curries
  { _id: 'h10', name: 'Butter Chicken', category: 'Curries', price: 350, tag: '🥘 Creamy', veg: false, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600', description: 'Charcoal-grilled chicken simmered in a velvety tomato-butter gravy.' },
  { _id: 'h11', name: 'Mutton Rogan Josh', category: 'Curries', price: 420, tag: '🌶️ Spicy', veg: false, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600', description: 'A robust mutton curry slow-cooked with Kashmiri chilies and aromatic spices.' },
  { _id: 'h12', name: 'Paneer Butter Masala', category: 'Curries', price: 310, tag: '🥘 Rich', veg: true, imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600', description: 'Soft cottage cheese cubes in a mildly spiced, creamy tomato sauce.' },

  // Frieds
  { _id: 'h13', name: 'Chicken Fried Rice', category: 'Frieds', price: 280, tag: '🍚 Wok', veg: false, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600', description: 'Wok-tossed rice with shredded chicken, egg, and soy sauce.' },
  { _id: 'h14', name: 'Egg Hakka Noodles', category: 'Frieds', price: 240, tag: '🍜 Wok', veg: false, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600', description: 'Stir-fried noodles with egg, julienned vegetables, and Asian sauces.' },
  { _id: 'h15', name: 'Prawns Fried Rice', category: 'Frieds', price: 360, tag: '🦐 Seafood', veg: false, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600', description: 'Premium long-grain rice wok-tossed with juicy prawns and scallions.' },

  // ── ASIAN FUSION ──
  // Sushi & Rolls
  { _id: 'a1', name: 'Spicy Tuna Roll', category: 'Sushi & Rolls', price: 750, tag: '🌶️ Spicy', veg: false, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600', description: 'Fresh tuna with sriracha mayo wrapped in seasoned rice & nori.' },
  { _id: 'a2', name: 'Dragon Roll', category: 'Sushi & Rolls', price: 890, tag: '⭐ Chef Pick', veg: false, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=600', description: 'Shrimp tempura topped with avocado slices and eel sauce.' },
  { _id: 'a3', name: 'Salmon Sashimi', category: 'Sushi & Rolls', price: 980, tag: '🐟 Fresh', veg: false, imageUrl: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=600', description: 'Thick-cut premium Atlantic salmon, served with wasabi & pickled ginger.' },

  // Ramen & Bowls
  { _id: 'a4', name: 'Spicy Beef Ramen', category: 'Ramen & Bowls', price: 850, tag: '🍜 Hearty', veg: false, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600', description: 'Rich tonkotsu broth with tender beef chashu, soft-boiled egg & noodles.' },
  { _id: 'a5', name: "Chef's Ramen", category: 'Ramen & Bowls', price: 960, tag: '⭐ Chef Pick', veg: false, imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=600', description: 'House special broth with black garlic oil, bamboo shoots & corn.' },
  { _id: 'a6', name: 'Garden Bowl', category: 'Ramen & Bowls', price: 620, tag: '🌿 Veg', veg: true, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600', description: 'Brown rice, roasted veggies, avocado & miso-sesame dressing.' },
  { _id: 'a7', name: 'Teriyaki Salmon Bowl', category: 'Ramen & Bowls', price: 1200, tag: '🐟 Premium', veg: false, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600', description: 'Glazed salmon fillet over steamed rice with pickled cucumber & edamame.' },

  // Grill & Sides
  { _id: 'a8', name: 'Chicken Yakitori', category: 'Grill & Sides', price: 620, tag: '🔥 Grilled', veg: false, imageUrl: 'https://images.unsplash.com/photo-1519623286359-e9f3cbef015b?q=80&w=600', description: 'Skewered chicken thigh glazed with house tare sauce, grilled to perfection.' },
  { _id: 'a9', name: 'Beef Yakitori', category: 'Grill & Sides', price: 850, tag: '🔥 Grilled', veg: false, imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=600', description: 'Wagyu beef skewers with spring onion, ponzu dipping sauce.' },
  { _id: 'a10', name: 'Crispy Tempura', category: 'Grill & Sides', price: 690, tag: '✨ Light', veg: false, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600', description: 'Light battered prawns & vegetables fried golden, served with tentsuyu broth.' },
  { _id: 'a11', name: 'Gyoza Dumplings', category: 'Grill & Sides', price: 480, tag: '🥟 Popular', veg: false, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=600', description: 'Pan-fried pork & cabbage dumplings with chilli-soy dipping sauce.' },

  // ── CAFE & DELI ──
  // Gourmet Sandwiches
  { _id: 'c1', name: 'Avocado Sourdough', category: 'Gourmet Sandwiches', price: 450, tag: '🥑 Healthy', veg: true, imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=600', description: 'Smashed avocado on toasted artisanal sourdough, topped with cherry tomatoes and microgreens.' },
  { _id: 'c2', name: 'Truffle Mushroom Panini', category: 'Gourmet Sandwiches', price: 480, tag: '🍄 Rich', veg: true, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600', description: 'Roasted wild mushrooms, gruyere cheese, and truffle aioli pressed in a crisp ciabatta.' },
  { _id: 'c3', name: 'Smoked Salmon Bagel', category: 'Gourmet Sandwiches', price: 550, tag: '🐟 Premium', veg: false, imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=600', description: 'Norwegian smoked salmon, dill cream cheese, capers, and red onion on a toasted everything bagel.' },

  // Espresso Bar
  { _id: 'c4', name: 'Caramel Macchiato', category: 'Espresso Bar', price: 280, tag: '☕ Signature', veg: true, imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600', description: 'Freshly steamed milk with vanilla syrup marked with espresso and caramel drizzle.' },
  { _id: 'c5', name: 'Classic Cappuccino', category: 'Espresso Bar', price: 240, tag: '⭐ Classic', veg: true, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600', description: 'Dark, rich espresso lies under a smoothed layer of thick milk foam.' },
  { _id: 'c6', name: 'Artisan Flat White', category: 'Espresso Bar', price: 260, tag: '✨ Premium', veg: true, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600', description: 'Smooth ristretto shots of espresso combined with perfectly stretched steamed milk.' },

  // Cold Brew & Iced
  { _id: 'c7', name: 'Nitro Cold Brew', category: 'Cold Brew & Iced', price: 320, tag: '❄️ Cold', veg: true, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600', description: 'Our signature cold brew, steeped for 24 hours and infused with nitrogen for a velvety crema.' },
  { _id: 'c8', name: 'Iced Vanilla Latte', category: 'Cold Brew & Iced', price: 270, tag: '🧊 Refresh', veg: true, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600', description: 'Espresso combined with vanilla syrup, milk and ice. A perfect cool-down drink.' },

  // Mojitos & Mocktails
  { _id: 'c9', name: 'Virgin Mint Mojito', category: 'Mojitos & Mocktails', price: 250, tag: '🍃 Fresh', veg: true, imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=600', description: 'A refreshing blend of muddled mint, lime juice, simple syrup, and sparkling soda.' },
  { _id: 'c10', name: 'Watermelon Breeze', category: 'Mojitos & Mocktails', price: 280, tag: '🍉 Summer', veg: true, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600', description: 'Fresh watermelon puree shaken with lime, mint leaves, and a splash of ginger ale.' },

  // Pastries & Desserts
  { _id: 'c11', name: 'Butter Croissant', category: 'Pastries & Desserts', price: 180, tag: '🥐 Flaky', veg: true, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600', description: 'A classic French crescent-shaped pastry made from a flaky, buttery dough.' },
  { _id: 'c12', name: 'Red Velvet Cheesecake', category: 'Pastries & Desserts', price: 350, tag: '🍰 Decadent', veg: true, imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600', description: 'A gorgeous fusion of moist red velvet cake and rich New York style cheesecake.' },
  { _id: 'c13', name: 'Tiramisu Cup', category: 'Pastries & Desserts', price: 320, tag: '✨ Italian', veg: true, imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=600', description: 'Layers of espresso-soaked ladyfingers and sweet mascarpone cream dusted with cocoa.' }
];

export default function MenuPage() {
  const navigate = useNavigate();
  const dispatch = useDispatchCart();
  const cartData = useCart();

  const [activeCategory, setActiveCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState({});

  const filtered = MENU_ITEMS
    .filter(item => activeCategory === 'All' || item.category === activeCategory)
    .filter(item => {
      if (vegOnly) return item.veg;
      if (nonVegOnly) return !item.veg;
      return true;
    })
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const handleAddToCart = (item) => {
    if (!localStorage.getItem('smartCartAuthToken')) {
      navigate('/login');
      return;
    }
    const existing = cartData.find(c => c.id === item._id);
    if (existing) {
      dispatch({ type: 'UPDATE', id: item._id, price: item.price, qty: 1 });
    } else {
      dispatch({ type: 'ADD', id: item._id, name: item.name, price: item.price, qty: 1 });
    }
    setAddedIds(prev => ({ ...prev, [item._id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [item._id]: false })), 1500);
  };

  return (
    <div className="menu-page">
      {/* ── Header ── */}
      <div className="menu-page-header">
        <div className="container">
          <div className="text-center">
            <span className="section-tag">Our Menu</span>
            <h1 className="section-title mt-2">
              Every Craving, <span>Covered</span>
            </h1>
            <p className="text-muted mt-2">Crafted fresh daily · 100+ dishes</p>
          </div>
        </div>
      </div>

      {/* ── Controls bar ── */}
      <div className="menu-controls-bar">
        <div className="container">
          <div className="menu-controls-inner">

            {/* Search */}
            <div className="menu-search-wrap">
              <span className="menu-search-icon">🔍</span>
              <input
                className="menu-search-input"
                placeholder="Search dishes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Veg/Non-Veg Toggles */}
            <div className="d-flex gap-3">
              <label className="veg-toggle">
                <input 
                  type="checkbox" 
                  checked={vegOnly} 
                  onChange={e => {
                    setVegOnly(e.target.checked);
                    if(e.target.checked) setNonVegOnly(false);
                  }} 
                />
                <span className="veg-toggle-pill">🌿 Veg Only</span>
              </label>

              <label className="veg-toggle non-veg">
                <input 
                  type="checkbox" 
                  checked={nonVegOnly} 
                  onChange={e => {
                    setNonVegOnly(e.target.checked);
                    if(e.target.checked) setVegOnly(false);
                  }} 
                />
                <span className="veg-toggle-pill">🍗 Non-Veg Only</span>
              </label>
            </div>

            {/* Sort */}
            <select className="menu-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="menu-tabs-bar">
        <div className="container">
          <div className="menu-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`menu-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Item count ── */}
      <div className="container">
        <p className="menu-item-count">{filtered.length} items</p>
      </div>

      {/* ── Food grid ── */}
      <div className="container pb-5">
        <div className="menu-grid">
          {filtered.map((item, idx) => {
            const inCart = cartData.some(c => c.id === item._id);
            return (
              <div key={item._id} className="menu-card" style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="menu-card-img-wrap">
                  <img src={item.imageUrl} alt={item.name} className="menu-card-img" />
                  <span className="menu-card-tag">{item.tag}</span>
                  {item.veg && <span className="menu-card-veg">🌿</span>}
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-category">{item.category}</div>
                  <h3 className="menu-card-name">{item.name}</h3>
                  <p className="menu-card-desc">{item.description}</p>
                  <div className="menu-card-footer">
                    <span className="menu-card-price">₹{item.price.toLocaleString('en-IN')}</span>
                    <button
                      className={`btn menu-add-btn ${addedIds[item._id] ? 'added' : ''} ${inCart ? 'in-cart' : ''}`}
                      onClick={() => handleAddToCart(item)}
                    >
                      {addedIds[item._id] ? '✓ Added!' : inCart ? '+ Add More' : '+ Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="menu-empty">
            <span>😔</span>
            <p>No dishes found. Try adjusting filters.</p>
          </div>
        )}
      </div>

      {/* ── Floating Cart ── */}
      {cartData.length > 0 && (
        <div className="floating-cart">
          <div className="floating-cart-header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Your Tray ({cartData.reduce((acc, curr) => acc + curr.qty, 0)})</h4>
            <button 
              className="btn btn-sm p-0 border-0" 
              onClick={() => dispatch({ type: "DROP" })}
              style={{ fontSize: '0.85rem', color: '#ffb3a7', textDecoration: 'underline' }}
            >
              Clear
            </button>
          </div>
          <div className="floating-cart-items">
            {cartData.map((food, index) => {
              const unitPrice = food.price / food.qty;
              return (
                <div key={index} className="floating-cart-item">
                  <div className="item-info">
                    <span className="item-name">{food.name}</span>
                    <span className="item-price">₹{unitPrice}</span>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => {
                      if (food.qty > 1) {
                        dispatch({ type: "UPDATE", id: food.id, price: -unitPrice, qty: -1 });
                      } else {
                        dispatch({ type: "REMOVE", index: index });
                      }
                    }}>-</button>
                    <span>{food.qty}</span>
                    <button onClick={() => dispatch({ type: "UPDATE", id: food.id, price: unitPrice, qty: 1 })}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="floating-cart-footer">
            <div className="total">
              <span>Total:</span>
              <span>₹{cartData.reduce((total, food) => total + food.price, 0)}</span>
            </div>
            <button className="btn btn-peach w-100 mt-3 fw-bold" onClick={() => navigate('/cart')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
