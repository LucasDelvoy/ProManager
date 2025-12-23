import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Clients from './pages/Clients'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'


function App() {
  

  return (
    <>
    
      <BrowserRouter>
        <Routes>
          <Route path="/Clients" element={<Clients/>} />
          <Route path="/Dashboard" element={<Dashboard/>} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    
    </>
  )
}

export default App
