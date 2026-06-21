import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddNewUserMutation } from './usersApiSlice'
import { ROLES } from '../../config/roles'
import '../../css/UserForm.css'

const USER_REGEX = /^[A-Za-z0-9!@#$%]{5,30}$/
const EMAIL_REGEX = /^\S+@\S+\.\S+$/
const PWD_REGEX = /^[A-Za-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
  const [addNewUser, { isSuccess, isError, error }] = useAddNewUserMutation()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState([ROLES.User])

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email))
  }, [email])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess) {
      setUsername('')
      setEmail('')
      setPassword('')
      setRoles([])
      navigate('/dash')
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onEmailChanged = e => setEmail(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)
  const onRolesChanged = e => setRoles(e.target.value ? [e.target.value] : [])

  const canSave = [validUsername, validEmail, validPassword].every(Boolean)

  const onSaveUserClicked = async () => {
    if (canSave) {
      await addNewUser({ username, email, password, roles })
    }
  }

  const errClass = isError ? 'errmsg user-form__error' : 'offscreen'
  const validUserClass = !validUsername ? 'user-form__input--invalid' : ''
  const validEmailClass = !validEmail ? 'user-form__input--invalid' : ''
  const validPwdClass = !validPassword ? 'user-form__input--invalid' : ''

  return (
    <section className="user-form">
      <p className={errClass} role="alert" aria-live="polite">
        {error?.data?.message}
      </p>

      <form
        className="user-form__card"
        onSubmit={e => {
          e.preventDefault()
          onSaveUserClicked()
        }}
      >
        <div className="user-form__header">
          <div>
            <p className="user-form__eyebrow">Account details</p>
            <h1 className="user-form__title">Create New User</h1>
            <p className="user-form__subtitle">Create the account record and assign the initial access level.</p>
          </div>

          <div className="user-form__actions user-form__actions--top">
            <button
              type="submit"
              className="user-form__btn user-form__btn--primary"
              disabled={!canSave}
            >
              Save user
            </button>
          </div>
        </div>

        <div className="user-form__grid">
          <label className="user-form__field">
            <span>Username</span>
            <input
              className={`user-form__input ${validUserClass}`}
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={onUsernameChanged}
              placeholder="Enter username"
              required
            />
          </label>

          <label className="user-form__field">
            <span>Email</span>
            <input
              className={`user-form__input ${validEmailClass}`}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={onEmailChanged}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="user-form__field">
            <span>Password</span>
            <input
              className={`user-form__input ${validPwdClass}`}
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onPasswordChanged}
              placeholder="Create a password"
              required
            />
          </label>

          <label className="user-form__field user-form__field--full">
            <span>Assigned Role</span>
            <select
              id="roles"
              name="roles"
              className="user-form__input"
              value={roles[0] || ''}
              onChange={onRolesChanged}
            >
              <option value="">Select a role</option>
              <option value={ROLES.User}>User</option>
              <option value={ROLES.Admin}>Admin</option>
            </select>
          </label>
        </div>
      </form>
    </section>
  )
}

export default NewUserForm
