import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard.jsx'

const getRole = () => localStorage.getItem('role')

const Protected = ({role, children}) => {
  const r = getRole()
  if (!localStorage.getItem('token')) return <Navigate to="/login" />
  if (role && r !== role) return <Navigate to="/login" />
  return children
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboard/></Protected>} />
      <Route path="/student/dashboard" element={<Protected role="student"><StudentDashboard/></Protected>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}
