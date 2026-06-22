import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'
import '../../css/Users.css'

const User = ({ userId }) => {
  const user = useSelector(state => selectUserById(state, userId))
  const navigate = useNavigate()

  const handleEdit = () => navigate(`/dash/users/${userId}`)

  if (!user) return null

  return (
    <li className='user-card'>
      <div className="user-body">
        {user.username} - {user.email}
        <button className="user-edit-btn" onClick={handleEdit}>Edit</button>
      </div>
    </li>
  )
}

export default User
