import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Body } from './components/body';
import { Header } from './components/header';
import { ProductDetails } from './components/productDetails';
import { CartSummary } from './components/cartSummary';
import { Profile } from './components/profile'; // Importação do histórico
import { ProductPage } from './components/productPage';

interface Product {
  id: number;
  type: string;
  price: string;
  quantity?: number;
}

export function App() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Omit<Product, 'quantity'>) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id === id) {
          if (item.quantity && item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as Product[])
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const finalizePurchase = () => {
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    localStorage.setItem('purchaseHistory', JSON.stringify([...purchaseHistory, cartItems]));
    setCartItems([]);
  };

  return (
    <Router>
      <Header
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        finalizePurchase={finalizePurchase}
      />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/product/:type" element={<ProductDetails addToCart={addToCart} />} />
        <Route path="/product/:type/:id" element={<ProductPage addToCart={(product) => addToCart({ ...product, id: Number(product.id) })} />} />
        <Route path="/cart-summary" element={<CartSummary cartItems={cartItems} removeFromCart={removeFromCart} setCartItems={setCartItems} />} />
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
  );
}


