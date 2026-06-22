import React from 'react'
import { useSelector } from 'react-redux'
import { useGetUsersQuery, selectAllUsers } from './usersApiSlice'
import User from './User'

const UsersList = () => {

    const {
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const users = useSelector(selectAllUsers)

    let content

    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess) {
        content = (
            <ul className="user-list">
                {users?.length ? users.map(user => (
                    <User key={user.id} userId={user.id} />
                )) : <p>No users found.</p>}
            </ul>
        )
    } else if (isError) {
        content = <p>{error?.data?.message || error?.message}</p>
    }

  return content
}

export default UsersList
