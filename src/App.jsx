import { Routes, Route } from 'react-router-dom'
import Layout from './componenets/Layout'
import Public from './pages/Public'
import Login from './pages/Login'
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  )
}

export default App
