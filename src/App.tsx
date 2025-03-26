import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './lib/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';
import SellNotes from './pages/SellNotes';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0A0A0A]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/create" element={<CreateGroup />} />
            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <SellNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:productId"
              element={
                <ProtectedRoute paymentOnly>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;