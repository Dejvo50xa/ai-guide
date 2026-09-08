import { StudioProvider } from "./Studio.jsx";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudioProvider><App /></StudioProvider>
  </StrictMode>,
)
