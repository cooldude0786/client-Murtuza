import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react"; // <-- Import ThemeProvider
import { BrowserRouter } from 'react-router-dom'; // 1. Import BrowserRouter
import { CartProvider } from './context/CartContext';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> 
      <BrowserRouter> 
        <CartProvider>{ /* this is context api for managing the cart details*/}
          <App />
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
