import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { setCreadentials } from './authSlice'
import { useRegisterMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import '../../css/Register.css'

const USER_REGEX = /^.{5,30}$/

const Register = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [register, { isLoading }] = useRegisterMutation()

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!USER_REGEX.test(username)) {
      setErrMsg('Username should be between 5 and 30 symbols long.')
      errRef.current?.focus()
      return
    }

    try {
      const { accessToken, username: registeredUsername } = await register({ username, email, password }).unwrap()
      dispatch(setCreadentials({ accessToken, username: registeredUsername }))
      setUsername('')
      setEmail('')
      setPassword('')
      navigate('/dash')
    } catch (err) {
      if (!err?.status) {
        setErrMsg('No Server Response')
      } else if (err.status === 400) {
        setErrMsg(err.data?.message || 'Username, email and password are required.')
      } else if (err.status === 409) {
        setErrMsg(err.data?.message || 'Username or email already exists')
      } else {
        setErrMsg(err.data?.message || 'Registration Failed')
      }
      errRef.current?.focus()
    }
  }

  const handleToggle = () => setPersist(prev => !prev)

  const canRegister = validUsername && !!email.trim() && !!password.trim() && !isLoading
  const usernameClass = username && !validUsername ? 'register__input--invalid' : ''

  if (isLoading) return <p>Loading...</p>

  return (
    <main className="register">
      <div className="register__card">
        <h1 className="register__title">Create your account</h1>

        <p
          ref={errRef}
          className={errMsg ? 'register__error' : 'offscreen'}
          aria-live="assertive"
        >
          {errMsg}
        </p>

        <form className="register__form" onSubmit={handleSubmit}>
          <label className="register__label">
            Username
            <input
              ref={userRef}
              type="text"
              name="username"
              required
              placeholder="Your username"
              value={username}
              minLength={5}
              maxLength={30}
              title="Username should be between 5 and 30 symbols long"
              onChange={(e) => {
                setUsername(e.target.value)
                setErrMsg('')
              }}
              autoComplete="username"
              className={`register__input ${usernameClass}`}
            />
          </label>

          <label className="register__label">
            Email
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrMsg('')
              }}
              autoComplete="email"
              className="register__input"
            />
          </label>

          <label className="register__label">
            Password
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrMsg('')
              }}
              autoComplete="new-password"
              className="register__input"
            />
          </label>

          <div className="register__actions">
            <button type="submit" className="register__btn register__btn--primary" disabled={!canRegister}>Register</button>
          </div>

          <div className="register__persist">
            <label className="register__label register__label--inline">
              <input
                type="checkbox"
                checked={persist}
                onChange={handleToggle}
                className="register__checkbox"
              />
              Trust this device
            </label>
          </div>

          <div className="register__footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Register
