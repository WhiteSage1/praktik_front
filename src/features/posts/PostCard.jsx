import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/Posts.css'

const PostCard = ({ post, showEdit = true }) => {
    const navigate = useNavigate()

    const handleEdit = () => navigate(`/dash/posts/${post.id}`)

    const imageSrc = post.images && post.images.length ? post.images[0] : null

    return (
        <li className="post-card">
            <div className="post-image-wrapper">
                {imageSrc ? (
                    <img className="post-image" src={imageSrc} alt={post.title} />
                ) : (
                    <div className="post-image-placeholder">No image</div>
                )}
            </div>

            <div className="post-body">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description">{post.description ? post.description.substring(0, 150) : ''}</p>
                <p className="post-price">Price: {post.currency ? `${post.currency} ` : '$'}{Number(post.price).toFixed(2)}</p>
                {showEdit && (
                    <button className="post-edit-btn" onClick={handleEdit}>Edit</button>
                )}
            </div>
        </li>
    )
}

export default PostCard