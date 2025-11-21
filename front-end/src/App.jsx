import React from 'react'
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import Forgetpass from './components/Forgetpass'
import ResetPass from './components/ResetPass'
import VerifyOtp from './components/VerifyOtp'
import Layout from './pages/Layout'
import Profile from './pages/Profile'
import Setting from './pages/Setting'
import ProfileModal from './pages/ProfileModal'
function App() {

  return (
 
     <Router>
      <Routes>
        {/* <Route path="/" element={ <Register /> } /> */}
        <Route path='/login' element={<Login />} />
        <Route index path="/register" element={ <Register /> } />
        
        <Route path='/' element={<Layout />} >
        <Route path='profile' element={<Profile/>} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path='setting' element={<Setting/>} />
        </Route>
        <Route path='/profilemodal' element={<ProfileModal />} />
        <Route path="/forgetpassword" element={<Forgetpass />} /> 
        <Route path="/resetPassword" element={<ResetPass />} /> 
        <Route path="/verifyOtp" element={<VerifyOtp/>} />
      </Routes>
     </Router>
  
  )
}

export default App;
