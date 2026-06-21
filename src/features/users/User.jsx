import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'

const User = ({ userId }) => {
  const user = useSelector(state => selectUserById(state, userId))
  const navigate = useNavigate()

  const handleEdit = () => navigate(`/dash/users/${userId}`)

  if (!user) return null

  return (
    <li>
      {user.username} - {user.email}
      <button onClick={handleEdit}>Edit</button>
    </li>
  )
}

export default User
