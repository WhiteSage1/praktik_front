import React from 'react'
import { Outlet } from 'react-router-dom'
import '../css/Main.css'

const DashLayaut = () => {
  return (
    <div className="dash-layout">
      <div className="dash-top">
        <h2 className="dashboard-title">Dashboard</h2>
      </div>

      <div className="dash-wrap">
        <Outlet />
      </div>
    </div>
  )
}

export default DashLayaut
