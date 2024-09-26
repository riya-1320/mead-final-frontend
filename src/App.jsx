import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MaterialSelection from './page/MaterialSelection';
import FurnitureOrderForm from './page/FurnitureOrderForm';
import { MaterialsProvider } from './Context/furnitureAPI';
import HomePage from './page/HomePage';
import Login from './page/Login';
import { Quotation } from './page/Pdf';
import ParentComponent from './page/MaterialandPdf';
import Dashboard from './Dashboard/Dashboard';
import View from './Dashboard/View';
import ProtectedRoute from './utilities/ProtectedRoute';
import Userquotations from './page/UserQuotations'; 

function App() {
 
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Check if screen width is less than 768px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check screen size on initial render

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSmallScreen) {
    return (
      <div className="mobile-warning">
        Please open this application on a PC or laptop for the only experience.
      </div>
    );
  }

  return (
    <MaterialsProvider> 
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/UserQuotations" element={<ProtectedRoute><Userquotations /></ProtectedRoute>} />
          <Route path="/materialSelection&pdf/:id" element={<ProtectedRoute><ParentComponent /></ProtectedRoute>} />
          <Route path="/furnitureOrderForm/:id" element={<ProtectedRoute><FurnitureOrderForm /></ProtectedRoute>} />
          <Route path="/materialSelection/:id" element={<ProtectedRoute><MaterialSelection /></ProtectedRoute>} />
          <Route path="/Dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/Dashboard/viewQuotation/:id" element={<ProtectedRoute><View /></ProtectedRoute>} />
        </Routes> 
    </MaterialsProvider>
  );
}

export default App;
