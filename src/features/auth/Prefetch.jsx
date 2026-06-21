import {store} from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice'
import { postsApiSlice } from '../posts/postsApiSlice'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        console.log('Prefetching data... subscribing to users and posts')
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        const posts = store.dispatch(postsApiSlice.endpoints.getPosts.initiate())

        return () => {
            console.log('unsubscribing from users and posts')
            users.unsubscribe()
            posts.unsubscribe()
        }
    }, [])

    return <Outlet />
}

export default Prefetch
