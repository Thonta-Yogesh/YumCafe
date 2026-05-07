import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import axios from 'axios';

export default function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [search, setSearch] = useState('');
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // Veg or Non-Veg
  const [priceSort, setPriceSort] = useState('None'); // Low to High vs High to Low

  // Keep track of which categories have "View More" expanded
  const [expandedCategories, setExpandedCategories] = useState({});

  const loadData = async () => {
    try {
      // Automatically trigger seeding first to populate memory DB
      await axios.get('http://localhost:5001/api/food/seed').catch(() => console.log('Seeding failed'));
      
      const response = await axios.get('http://localhost:5001/api/food/all');
      const items = response.data;
      setFoodItems(items);
      
      // Extract unique categories dynamically
      const uniqueCategories = [...new Set(items.map(item => item.category))];
      setFoodCategories(uniqueCategories);

    } catch (error) {
      console.log('Error fetching food items');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleViewMore = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Filter Logic Handler
  const getFilteredItems = (category) => {
    let filtered = foodItems.filter((item) => {
      const matchCategory = item.category === category;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchFilterCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchType = selectedType === 'All' || item.type === selectedType;

      return matchCategory && matchSearch && matchFilterCategory && matchType;
    });

    if (priceSort === 'Low to High') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'High to Low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  return (
    <div>
      {/* Slide Bar / Carousel Header */}
      {/* Added data-bs-interval="3000" and data-bs-ride="carousel" for automatic sliding every 3s */}
      <div id="carouselExampleControls" className="carousel slide position-relative" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-caption-centered">
          <div className="d-flex justify-content-center">
            <input 
              className="form-control me-2 search-bar-classy w-75" 
              type="search" 
              placeholder="Search for your favorite cafe dishes..." 
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="3000">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" className="d-block w-100 carousel-img" alt="Delicious Food 1" />
          </div>
          <div className="carousel-item" data-bs-interval="3000">
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop" className="d-block w-100 carousel-img" alt="Delicious Food 2" />
          </div>
          <div className="carousel-item" data-bs-interval="3000">
            <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2070&auto=format&fit=crop" className="d-block w-100 carousel-img" alt="Delicious Food 3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container mt-4 mb-5">
        
        {/* Filter Toolbar */}
        <div className="card shadow-sm p-4 mb-5 border-0 rounded-4" style={{ backgroundColor: 'white' }}>
          <div className="row g-3 d-flex align-items-center justify-content-between">
            <div className="col-12 col-md-3">
              <label className="fw-bold mb-2">Category</label>
              <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="All">All Categories</option>
                {foodCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="fw-bold mb-2">Type of Food</label>
              <select className="form-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="All">All Types (Veg & Non-Veg)</option>
                <option value="Veg">Vegetarian 🟢</option>
                <option value="Non-Veg">Non-Vegetarian 🔴</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="fw-bold mb-2">Price Sorting</label>
              <select className="form-select" value={priceSort} onChange={(e) => setPriceSort(e.target.value)}>
                <option value="None">Default</option>
                <option value="Low to High">Price: Low to High</option>
                <option value="High to Low">Price: High to Low</option>
              </select>
            </div>
            <div className="col-12 col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-outline-danger w-100 mt-4" 
                onClick={() => { setSelectedCategory('All'); setSelectedType('All'); setPriceSort('None'); setSearch(''); }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Render */}
        {
          foodCategories.length !== 0 ? foodCategories.map((category) => {
            const displayItems = getFilteredItems(category);
            
            // Only render category if there are items that match BOTH search & filters
            if (displayItems.length === 0) return null;

            // Determine if the category is fully expanded or just showing top 4 preview
            const isExpanded = expandedCategories[category];
            const visibleItems = isExpanded ? displayItems : displayItems.slice(0, 4);

            return (
              <div key={category} className="mb-5">
                <h2 className="category-title">{category}</h2>
                <hr className="mb-4" />
                <div className="row">
                  {visibleItems.map(filteredItem => (
                      <div key={filteredItem._id} className="col-12 col-md-6 col-lg-3 mb-4 d-flex justify-content-center">
                        <Card foodItem={filteredItem} />
                      </div>
                  ))}
                </div>
                
                {/* View More Logic */}
                {displayItems.length > 4 && (
                  <div className="d-flex justify-content-center mt-3 mb-5">
                    <button 
                      className="btn btn-outline-danger px-4 py-2 fs-5" 
                      style={{ borderRadius: '50px', borderWidth: '2px', fontWeight: '600' }}
                      onClick={() => toggleViewMore(category)}
                    >
                      {isExpanded ? 'Show Less' : `View All ${displayItems.length} Options`}
                    </button>
                  </div>
                )}
              </div>
            )
          })
          : <div className="text-center mt-5"><h3>Loading Menu from Secure API...</h3></div>
        }
        
      </div>
    </div>
  );
}
