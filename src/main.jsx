import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Send from './Send.jsx'
import Come from './Come.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Come />
  </StrictMode>,
)
