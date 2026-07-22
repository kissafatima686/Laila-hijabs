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

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('laila_hijabs_wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('laila_hijabs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('laila_hijabs_wishlist', JSON.stringify(wishlistItems));
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

  const addToWishlist = (product) => {
    const itemKey = product.id || product.slug;
    setWishlistItems((prevItems) => {
      const exists = prevItems.find(item => (product.id && item.id === product.id) || (product.slug && item.slug === product.slug));
      if (exists) return prevItems;
      return [...prevItems, { ...product, id: itemKey, inStock: true }];
    });
  };

  const toggleWishlist = (product) => {
    const itemKey = product.id || product.slug;
    setWishlistItems((prevItems) => {
      const exists = prevItems.find(item => (product.id && item.id === product.id) || (product.slug && item.slug === product.slug) || item.id === itemKey || item.slug === itemKey);
      if (exists) {
        return prevItems.filter(item => item.id !== product.id && item.slug !== product.slug && item.id !== itemKey && item.slug !== itemKey);
      }
      return [...prevItems, { ...product, id: itemKey, inStock: true }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter(item => item.id !== productId && item.slug !== productId));
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
