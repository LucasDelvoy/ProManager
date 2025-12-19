import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Dashboard from './pages/Dashboard'

function App() {
  

  return (
    <>
    
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    
    </>
  )
}

export default App
