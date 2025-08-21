import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  try {
    // Ensure state.items is always an array
    const currentItems = state.items || [];
    
    switch (action.type) {
      case 'ADD_TO_CART': {
        const existingItem = currentItems.find(item => item?.id === action.payload?.id);
        if (existingItem) {
          return {
            ...state,
            items: currentItems.map(item =>
              item?.id === action.payload?.id
                ? { ...item, quantity: (item.quantity || 0) + 1 }
                : item
            ),
          };
        } else {
          return {
            ...state,
            items: [...currentItems, { ...action.payload, quantity: 1 }],
          };
        }
      }
      case 'REMOVE_FROM_CART':
        return {
          ...state,
          items: currentItems.filter(item => item?.id !== action.payload),
        };
      case 'UPDATE_QUANTITY':
        if (action.payload.quantity <= 0) {
          return {
            ...state,
            items: currentItems.filter(item => item?.id !== action.payload.id),
          };
        }
        return {
          ...state,
          items: currentItems.map(item =>
            item?.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        };
      case 'CLEAR_CART':
        return {
          ...state,
          items: [],
        };
      default:
        return state;
    }
  } catch (error) {
    console.error('Error in cartReducer:', error);
    // Return a safe default state
    return { items: [] };
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  

  
  // Ensure state is always valid
  const safeState = {
    items: state?.items || []
  };

  // Validate that children exist
  if (!children) {
    console.error('CartProvider: No children provided');
    return null;
  }

  const addToCart = (product: Product) => {
    try {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId: number) => {
    try {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    try {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalItems = () => {
    try {
      return state.items?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;
    } catch (error) {
      console.error('Error getting total items:', error);
      return 0;
    }
  };

  const getTotalPrice = () => {
    try {
      return state.items?.reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 0)), 0) || 0;
    } catch (error) {
      console.error('Error getting total price:', error);
      return 0;
    }
  };

  const value: CartContextType = {
    ...safeState,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  };

  // Validate the context value
  if (!value || typeof value.addToCart !== 'function' || typeof value.removeFromCart !== 'function') {
    console.error('CartProvider: Invalid context value created');
    return null;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  // Validate context structure
  if (!context || typeof context.addToCart !== 'function' || typeof context.removeFromCart !== 'function') {
    console.error('useCart: Invalid context structure:', context);
    throw new Error('Cart context is corrupted');
  }
  
  return context;
};