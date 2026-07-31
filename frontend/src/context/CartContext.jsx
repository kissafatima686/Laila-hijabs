import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('laila_hijabs_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const getWishlistKey = () => {
    try {
      const userStr = localStorage.getItem('laila_hijabs_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.email) {
          return `laila_hijabs_wishlist_${user.email}`;
        }
      }
    } catch (e) {}
    return 'laila_hijabs_wishlist';
  };

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem(getWishlistKey());
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  // Re-sync if user logs in/out
  useEffect(() => {
    const handleStorageChange = async () => {
      try {
        const userStr = localStorage.getItem('laila_hijabs_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.id) {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wishlist/${user.id}`);
            if (res.ok) {
              const data = await res.json();
              // Prevent unnecessary re-renders if length is same (simple diff)
              if (data.length !== wishlistItems.length) {
                setWishlistItems(data);
              }
              return;
            }
          }
        }
        // Fallback to local
        const savedWishlist = localStorage.getItem(getWishlistKey());
        const parsed = savedWishlist ? JSON.parse(savedWishlist) : [];
        if (parsed.length !== wishlistItems.length) {
          setWishlistItems(parsed);
        }
      } catch (e) {}
    };
    
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 3000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [wishlistItems.length]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);

  useEffect(() => {
    if (showCartPopup) {
      const timer = setTimeout(() => {
        setShowCartPopup(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showCartPopup]);

  useEffect(() => {
    localStorage.setItem('laila_hijabs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(getWishlistKey(), JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1, size: product.size || "M", color: product.color || "Olive" }];
    });
    setShowCartPopup(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addToWishlist = async (product) => {
    const itemKey = product.id || product.slug;
    setWishlistItems((prevItems) => {
      const exists = prevItems.find(item => (product.id && item.id === product.id) || (product.slug && item.slug === product.slug));
      if (exists) return prevItems;
      return [...prevItems, { ...product, id: itemKey, inStock: true }];
    });
    
    // Sync backend
    const userStr = localStorage.getItem('laila_hijabs_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.id && product.id) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wishlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id, product_id: product.id })
          });
        } catch(e) {}
      }
    }
  };

  const toggleWishlist = async (product) => {
    const itemKey = product.id || product.slug;
    const exists = wishlistItems.find(item => (product.id && item.id === product.id) || (product.slug && item.slug === product.slug) || item.id === itemKey || item.slug === itemKey);
    
    if (exists) {
      removeFromWishlist(product.id || itemKey);
    } else {
      addToWishlist(product);
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems((prevItems) => prevItems.filter(item => item.id !== productId && item.slug !== productId));
    
    // Sync backend
    const userStr = localStorage.getItem('laila_hijabs_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.id) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wishlist/${user.id}/${productId}`, {
            method: 'DELETE'
          });
        } catch(e) {}
      }
    }
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const moveToWishlist = (product) => {
    addToWishlist(product);
    removeFromCart(product.id);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        moveToCart,
        moveToWishlist,
        cartCount,
        cartTotal,
        showCartPopup,
        setShowCartPopup,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
