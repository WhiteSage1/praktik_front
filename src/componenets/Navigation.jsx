import icon_dark from '../images/Icon3.png'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import { selectCurrentUser, logout as logoutAction } from '../features/auth/authSlice'

import '../css/Navigation.css'

const Navigation = () => {
  const navigate = useNavigate()
  const username = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [sendLogout, { isLoading }] = useSendLogoutMutation()

  const handleLogout = async () => {
    // optimistic local logout to update UI immediately
    dispatch(logoutAction())
    try {
      await sendLogout().unwrap()
    } catch (err) {
      console.error('Logout failed', err)
    } finally {
      navigate('/')
    }
  }

  return (
    <div className="nav">
      <Link to="/" className="logo">
        <img src={icon_dark} alt="logo" className="icon" />
        <h2>Selly</h2>
      </Link>

      <ul>
        <li><Link to="/">Home</Link></li>
        {/* <li><Link to="/">Features</Link></li>
        <li><Link to="/">Pricing</Link></li> */}
      </ul>
      <div className="login_register">
        {username ? (
          <div className="nav__user">
            <Link to="/dash" className="nav__username">{username}</Link>
            <button className="nav__logout" onClick={handleLogout} disabled={isLoading}>
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        ) : (
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        )}
        {/* <img src={toggle_light} alt="toggle" className="toggle" /> */}
      </div>
    </div>
  )
}

export default Navigation
