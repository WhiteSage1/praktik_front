import React from 'react'
import { useGetPublicPostsQuery } from './postsApiSlice'
import PostCard from './PostCard'

const PublicPostsList = () => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPublicPostsQuery('publicPostsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess) {
    const posts = data?.ids?.map(id => data.entities[id]) ?? []

    content = (
      <ul className="posts-list">
        {posts.length ? posts.map(post => (
          <PostCard key={post.id} post={post} showEdit={false} />
        )) : <p>No posts found.</p>}
      </ul>
    )
  } else if (isError) {
    content = <p>{error?.data?.message || error?.message}</p>
  }

  return content
}

export default PublicPostsList