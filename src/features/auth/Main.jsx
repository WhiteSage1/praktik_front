import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from './authSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import { selectAllPosts, useGetPostsQuery } from '../posts/postsApiSlice'
import Post from '../posts/Post'
import '../../css/Main.css'

const Main = () => {
  const username = useSelector(selectCurrentUser)
  const users = useSelector(selectAllUsers)
  const posts = useSelector(selectAllPosts)

  // ensure posts are requested (Prefetch usually handles this)
  useGetPostsQuery('postsList')

  const user = users?.length ? users.find(u => u.username === username) : null
  const userPosts = user && posts?.length ? posts.filter(p => String(p.seller) === String(user.id)) : []

  return (
    <div className="dash-container">
      <div className="dashboard-header">
        <div className="user-card">
          <div className="user-avatar">{username ? username.charAt(0) : '?'}</div>
          <div className="user-info">
            <div className="user-name">{username || 'Guest'}</div>
            <div className="user-meta">{user?.email || ''}</div>
          </div>
        </div>

        {user && (
          <div className="user-actions">
            <Link to={`/dash/users/${user.id}`}>
              <button className="btn-primary">Edit Profile</button>
            </Link>
            <Link to="/dash/posts/new">
              <button className="btn-success">New Post</button>
            </Link>
          </div>
        )}
      </div>

      <div className="dashboard-body">
        

        <div className="posts-column">
          <h3 className="section-title">Your posts</h3>
          {userPosts?.length ? (
            <ul className="posts-list">
              {userPosts.map(post => (
                <Post key={post.id} postId={post.id} />
              ))}
            </ul>
          ) : (
            <p className="no-posts">You have no posts yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Main
