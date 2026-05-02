import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
const [cartOpen, setCartOpen] = useState(false);
  // Load cart once
  useEffect(() => {
    const existingCart = localStorage.getItem("cart");
    if (existingCart) {
      setCart(JSON.parse(existingCart));
    }
  }, []);

  // Save helper
  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ ADD TO CART (with quantity logic)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      let updatedCart;

      if (existing) {
        updatedCart = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prev, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // ✅ INCREASE
  const increaseQty = (id) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ DECREASE
  const decreaseQty = (id) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ REMOVE ITEM
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    syncCart(updated);
  };

  return (
    <CartContext.Provider value={{
  cart,
  setCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  cartOpen,
  setCartOpen
}}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };