import React, { useEffect, useState } from 'react'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSendLogoutMutation } from '../auth/authApiSlice'
import { logout } from '../auth/authSlice'
import { apiSlice } from '../../app/api/apiSlice'
import '../../css/UserForm.css'

const USER_REGEX = /^.{5,30}$/
const PWD_REGEX = /^.{6,}$/

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const [sendLogout] = useSendLogoutMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [username, setUsername] = useState(user.username ?? '')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [bio, setBio] = useState(user.bio ?? '')
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '')
    const [country, setCountry] = useState(user.location?.country ?? '')
    const [city, setCity] = useState(user.location?.city ?? '')

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setUsername(user.username ?? '')
        setPassword('')
        setBio(user.bio ?? '')
        setPhoneNumber(user.phoneNumber ?? '')
        setCountry(user.location?.country ?? '')
        setCity(user.location?.city ?? '')
    }, [user])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onBioChanged = e => setBio(e.target.value)
    const onPhoneNumberChanged = e => setPhoneNumber(e.target.value)
    const onCountryChanged = e => setCountry(e.target.value)
    const onCityChanged = e => setCity(e.target.value)

    const onSaveUserClicked = async () => {
        const payload = {
            id: user.id,
            username: username.trim(),
            email: user.email,
            bio,
            phoneNumber,
        }

        if (password) {
            payload.password = password
        }

        const trimmedCountry = country.trim()
        const trimmedCity = city.trim()

        if (trimmedCountry && trimmedCity) {
            payload.location = {
                country: trimmedCountry,
                city: trimmedCity
            }
        }

        await updateUser(payload).unwrap()
        navigate('/dash')
    }

    const onDeleteUserClicked = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?')

        if (!confirmDelete) {
            return
        }

        await deleteUser({ id: user.id }).unwrap()

        try {
            await sendLogout().unwrap()
        } catch (err) {
            dispatch(logout())
            dispatch(apiSlice.util.resetApiState())
        }

        navigate('/')
    }

    const canSave = [validUsername, password ? validPassword : true].every(Boolean) && !isLoading

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const usernameClass = !validUsername ? 'user-form__input--invalid' : ''
    const passwordClass = password && !validPassword ? 'user-form__input--invalid' : ''

    const content = (
        <section className="user-form">
            <p className={errContent ? 'errmsg user-form__error' : 'offscreen'}>{errContent}</p>

            <form className="user-form__card" onSubmit={e => { e.preventDefault(); onSaveUserClicked() }}>
                <div className="user-form__header">
                    <div>
                        <p className="user-form__eyebrow">Account details</p>
                        <h1 className="user-form__title">Edit User</h1>
                        <p className="user-form__subtitle">Update the profile fields stored in the user record.</p>
                    </div>

                    <div className="user-form__actions user-form__actions--top">
                        <button type="button" className="user-form__btn user-form__btn--ghost" onClick={() => navigate('/dash')}>
                            Cancel
                        </button>
                        <button type="submit" className="user-form__btn user-form__btn--primary" disabled={!canSave}>
                            Save changes
                        </button>
                    </div>
                </div>

                <div className="user-form__grid">
                    <label className="user-form__field">
                        <span>Username</span>
                        <input
                            className={`user-form__input ${usernameClass}`}
                            type="text"
                            autoComplete="off"
                            value={username}
                            onChange={onUsernameChanged}
                            placeholder="Enter username"
                        />
                    </label>

                    <label className="user-form__field">
                        <span>Password</span>
                        <input
                            className={`user-form__input ${passwordClass}`}
                            type="password"
                            value={password}
                            onChange={onPasswordChanged}
                            placeholder="Leave blank to keep the current password"
                        />
                    </label>

                    <label className="user-form__field user-form__field--full">
                        <span>Bio</span>
                        <textarea
                            className="user-form__input user-form__textarea"
                            rows="4"
                            value={bio}
                            onChange={onBioChanged}
                            placeholder="Short bio or profile description"
                        />
                    </label>

                    <label className="user-form__field">
                        <span>Phone number</span>
                        <input
                            className="user-form__input"
                            type="tel"
                            value={phoneNumber}
                            onChange={onPhoneNumberChanged}
                            placeholder="Phone number"
                        />
                    </label>

                    <label className="user-form__field">
                        <span>Country</span>
                        <input
                            className="user-form__input"
                            type="text"
                            value={country}
                            onChange={onCountryChanged}
                            placeholder="Country"
                        />
                    </label>

                    <label className="user-form__field user-form__field--full">
                        <span>City</span>
                        <input
                            className="user-form__input"
                            type="text"
                            value={city}
                            onChange={onCityChanged}
                            placeholder="City"
                        />
                    </label>
                </div>

                <div className="user-form__actions user-form__actions--bottom">
                    <button type="button" className="user-form__btn user-form__btn--danger" onClick={onDeleteUserClicked}>
                        Delete user
                    </button>
                </div>
            </form>
        </section>
    )

    return content
}

export default EditUserForm
