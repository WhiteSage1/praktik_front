import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserQuery } from './usersApiSlice'
import EditUserForm from './EditUserForm'

const EditUser = () => {
  const { id } = useParams()

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
  } = useGetUserQuery(id)

  if (isLoading || isFetching) {
    return <p>Loading...</p>
  }

  if (isError || !user) {
    return <p>Loading...</p>
  }

  const content = <EditUserForm user={user} />

  return content
}

export default EditUser
