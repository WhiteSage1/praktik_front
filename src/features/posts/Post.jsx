import React from 'react'
import { useSelector } from 'react-redux'
import { selectPostById } from './postsApiSlice'
import PostCard from './PostCard'

const Post = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))

    if (!post) return null

    return <PostCard post={post} showEdit />
}

export default Post