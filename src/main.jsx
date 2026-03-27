import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL ;
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { CartProvider } from './context/CartContext.jsx';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
      <CartProvider>
        <App />
      </CartProvider>
    </Provider>
  </StrictMode>,
)





