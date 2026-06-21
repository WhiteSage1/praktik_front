import React from 'react'
import { useSelector } from 'react-redux'
import { useGetPostsQuery, selectAllPosts } from './postsApiSlice'
import Post from './Post'

const PostsList = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery('postsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const posts = useSelector(selectAllPosts)

  let content

  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess) {
    content = (
      <ul className="posts-list">
        {posts?.length ? posts.map(post => (
          <Post key={post.id} postId={post.id} />
        )) : <p>No posts found.</p>}
      </ul>
    )
  } else if (isError) {
    content = <p>{error?.data?.message || error?.message}</p>
  }

  return content
}

export default PostsList
