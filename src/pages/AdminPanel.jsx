import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '../features/auth/authSlice'
import { selectAllUsers } from '../features/users/usersApiSlice'
import { selectAllPosts, useGetPostsQuery } from '../features/posts/postsApiSlice'
import UsersList from '../features/users/UsersList'
import PostsList from '../features/posts/PostsList'
import Post from '../features/posts/Post'

import '../css/AdminPanel.css'

const AdminPanel = () => {

    const username = useSelector(selectCurrentUser)
      const users = useSelector(selectAllUsers)
      const posts = useSelector(selectAllPosts)
    
      // ensure posts are requested (Prefetch usually handles this)
      useGetPostsQuery('postsList')
    
      const user = users?.length ? users.find(u => u.username === username) : null
      const userPosts = user && posts?.length ? posts.filter(p => String(p.seller) === String(user.id)) : []
    


    return (
        <div className='panel-container'>
            <div className='panel-header'>
                <div className="user-card">
                    <div className="user-avatar">{username ? username.charAt(0) : '?'}</div>
                    <div className="user-info">
                        <div className="user-name">{username || 'Guest'}</div>
                        <div className="user-meta">Your role: {user?.role || ''}</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-body">
                
                <div className='posts-column'>
                    <h3 className="section-title">All users</h3>
                    <UsersList />
                </div>

                <div className="posts-column">
                    <h3 className="section-title">All posts</h3>
                    <PostsList />
                    {/* {userPosts?.length ? (
                        <ul className="posts-list">
                        {userPosts.map(post => (
                            <Post key={post.id} postId={post.id} />
                        ))}
                        </ul>
                    ) : (
                        <p className="no-posts">You have no posts yet.</p>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default AdminPanel