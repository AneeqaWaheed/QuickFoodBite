import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Helper: always use ONE ID
  const getId = (item) => item._id || item.id;

  // ✅ Load cart once (and normalize old data)
  useEffect(() => {
    const existingCart = localStorage.getItem("cart");

    if (existingCart) {
      const parsed = JSON.parse(existingCart);

      const normalized = parsed.map((item) => ({
        ...item,
        _id: item._id || item.id, // 🔥 normalize
      }));

      setCart(normalized);
    }
  }, []);

  // ✅ Sync helper (single source of truth)
  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ ADD TO CART (no duplicates)
  const addToCart = (product) => {
    const id = getId(product);

    const exists = cart.find((item) => getId(item) === id);

    let updatedCart;

    if (exists) {
      updatedCart = cart.map((item) =>
        getId(item) === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          _id: id, // 🔥 enforce single ID
          quantity: 1,
        },
      ];
    }

    syncCart(updatedCart);
  };

  // ✅ INCREASE QTY
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      getId(item) === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    syncCart(updated);
  };

  // ✅ DECREASE QTY
  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        getId(item) === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    syncCart(updated);
  };

  // ✅ REMOVE ITEM
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => getId(item) !== id);
    syncCart(updated);
  };

  // ✅ CLEAR CART (use this after order / logout)
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };