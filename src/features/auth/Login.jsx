import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCreadentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'

import usePersist from '../../hooks/usePersist'

import '../../css/Login.css'

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current?.focus()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken, username } = await login({ identifier, password }).unwrap()
            dispatch(setCreadentials({ accessToken, username }))
            setIdentifier('')
            setPassword('')
            navigate('/dash')
        } catch (err) {
            if (!err?.status) {
                setErrMsg('No Server Response')
            } else if (err.status === 400) {
                setErrMsg('Username or email and password are required.')
            } else if (err.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg(err.data?.message || 'Login Failed')
            }
            errRef.current?.focus()
        }
    }

    const handleToggle = () => setPersist(prev => !prev)

    if (isLoading) return <p>Loading...</p>

    return (
        <main className="login">
            <div className="login__card">
                <h1 className="login__title">Welcome Back</h1>

                <p
                    ref={errRef}
                    className={errMsg ? 'login__error' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>

                <form className="login__form" onSubmit={handleSubmit}>
                    <label className="login__label">
                        Username or email
                        <input
                            type="text"
                            name="identifier"
                            placeholder="your username or email"
                            value={identifier}
                            ref={userRef}
                            onChange={(e) => {
                                setIdentifier(e.target.value)
                                setErrMsg('')
                            }}
                            required
                            className="login__input"
                            autoComplete="username"
                        />
                    </label>

                    <label className="login__label">
                        Password
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setErrMsg('')
                            }}
                            required
                            className="login__input"
                            autoComplete="current-password"
                        />
                    </label>

                    <div className="login__actions">
                        <button type="submit" className="login__btn login__btn--primary">Login</button>
                    </div>

                    <div className="login__persist">
                        <label className="login__label">
                            <input
                                type="checkbox"
                                checked={persist}
                                onChange={handleToggle}
                                className="login__checkbox"
                            />{' '}
                            Trust this device
                        </label>
                    </div>

                    <div className="login__footer">
                        <p>
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Login
