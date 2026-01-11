import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'

import Clients from './pages/Clients'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'

import Navbar from './components/Navbar'


function App() {
  

  return (
    <>
    
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-gray-70 shadow-md sticky top-0 z-50">
            <Navbar />
          </header>
          <Routes>
            <Route path="/Clients" element={<Clients/>} />
            <Route path="/Dashboard" element={<Dashboard/>} />
            <Route path="/Login" element={<Login/>} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Projects" element={<Projects />} />
          </Routes>
        </div>
      </BrowserRouter>
    
    </>
  )
}

export default App
