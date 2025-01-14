import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearItems: () => void;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (itemId: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemId);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentItems, { id: itemId, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return currentItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return currentItems.filter((item) => item.id !== itemId);
    });
  };

  const clearItems = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const getCartItemsCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearItems, getCartItemsCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
