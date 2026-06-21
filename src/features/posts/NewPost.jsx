import React from 'react'
import { useSelector } from 'react-redux'
import { useGetUsersQuery, selectAllUsers } from '../users/usersApiSlice'
import NewPostForm from './NewPostForm'

const NewPost = () => {
    const {
        isLoading,
        isError,
        error,
    } = useGetUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

    const users = useSelector(selectAllUsers)

    if (!users?.length) {
        return <p>Not curently available</p>
    }

    const content = isLoading
        ? <p>Loading...</p>
        : isError
            ? <p>{error?.data?.message || error?.message}</p>
            : <NewPostForm users={users} />
    
    return content
}

export default NewPost
