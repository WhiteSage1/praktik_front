import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAddNewPostMutation } from './postsApiSlice'
import { selectCurrentUser } from '../auth/authSlice'
import '../../css/PostForm.css'

const CATEGORY_OPTIONS = [
  'Electronics',
  'Cars',
  'Clothing',
  'Furniture',
  'Real Estate',
  'Books',
  'Sports',
  'Toys',
  'Other',
]

const CONDITION_OPTIONS = ['New', 'Used', 'Refurbished']
const COMMON_CURRENCIES = ['EUR', 'USD', 'GBP', 'CAD', 'AUD', 'JPY']

const toArray = value =>
  value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)

const NewPostForm = ({ users = [] }) => {
  const navigate = useNavigate()
  const [addNewPost, { isLoading, error }] = useAddNewPostMutation()

  const username = useSelector(selectCurrentUser)
  const [sellerId, setSellerId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('Used')
  const [images, setImages] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [tags, setTags] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  const parsedPrice = Number(price)
  const countryTrim = country.trim()
  const cityTrim = city.trim()
  const locationValid =
    (countryTrim === '' && cityTrim === '') ||
    (countryTrim !== '' && cityTrim !== '')

  const countryInvalid = countryTrim === '' && cityTrim !== ''
  const cityInvalid = cityTrim === '' && countryTrim !== ''

  const canSave =
    sellerId.trim() !== '' &&
    title.trim().length >= 3 &&
    description.trim().length >= 0 &&
    price.trim() !== '' &&
    !Number.isNaN(parsedPrice) &&
    parsedPrice >= 0 &&
    locationValid &&
    !isLoading

  useEffect(() => {
    if (username && users.length > 0) {
      const logged = users.find(u => u.username === username)
      if (logged) setSellerId(logged.id)
    }
  }, [users, username])

  const loggedUser = users?.length ? users.find(u => String(u.id) === String(sellerId)) : null

//   useEffect(() => {
//     // Debug output to help diagnose why the Create button may be disabled
//     console.log('NewPostForm debug:', {
//       usersLength: users.length,
//       sellerId,
//       canSave,
//     })
//   }, [users, sellerId, canSave])

  const onSavePostClicked = async event => {
    event.preventDefault()

    if (!canSave) return

    const payload = {
      sellerId: sellerId.trim(),
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      currency: currency.trim().toUpperCase() || 'EUR',
      images: toArray(images),
      tags: toArray(tags),
      contactPhone: contactPhone.trim(),
    }

    // console.log('NewPostForm submit payload:', payload)

    if (category.trim()) {
      payload.category = category.trim()
    }

    if (condition.trim()) {
      payload.condition = condition.trim()
    }

    if (countryTrim || cityTrim) {
      payload.location = {
        country: countryTrim,
        city: cityTrim,
      }
    }

    try {
      await addNewPost(payload).unwrap()
      navigate('/dash')
    } catch {
      return
    }
  }

  const errContent = error?.data?.message ?? error?.message ?? ''

  return (
    <section className="post-form">
      <p className={errContent ? 'errmsg post-form__error' : 'offscreen'}>{errContent}</p>

      <form className="post-form__card" onSubmit={onSavePostClicked}>
        <div className="post-form__header">
          <div>
            <p className="post-form__eyebrow">Post details</p>
            <h1 className="post-form__title">New Post</h1>
            <p className="post-form__subtitle">
              Create a listing using the required post fields from the schema. Seller, title, description and price are mandatory.
            </p>
          </div>

          <div className="post-form__actions post-form__actions--top">
            <button
              type="button"
              className="post-form__btn post-form__btn--ghost"
              onClick={() => navigate('/dash')}
            >
              Cancel
            </button>
            <button type="submit" className="post-form__btn post-form__btn--primary" disabled={!canSave}>
              Create post
            </button>
          </div>
        </div>

        <div className="post-form__grid">
          <label className="post-form__field post-form__field--full">
            <span>Seller</span>
            <input
              className="post-form__input"
              type="text"
              value={loggedUser ? `${loggedUser.username} (${loggedUser.email})` : username || ''}
              readOnly
            />
            <small className="post-form__hint">Posts will be created as the currently logged-in user.</small>
          </label>

          <label className="post-form__field post-form__field--full">
            <span>Title</span>
            <input
              className="post-form__input"
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Listing title"
              required
            />
          </label>

          <label className="post-form__field post-form__field--full">
            <span>Description</span>
            <textarea
              className="post-form__input post-form__textarea"
              rows="6"
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="Write a detailed description of the item"
              required
            />
          </label>

          <label className="post-form__field">
            <span>Price</span>
            <input
              className="post-form__input"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={event => setPrice(event.target.value)}
              placeholder="0.00"
              required
            />
          </label>

          <label className="post-form__field">
            <span>Currency</span>
            <input
              className="post-form__input"
              type="text"
              list="currency-options"
              value={currency}
              onChange={event => setCurrency(event.target.value)}
              placeholder="EUR"
            />
            <datalist id="currency-options">
              {COMMON_CURRENCIES.map(code => (
                <option key={code} value={code} />
              ))}
            </datalist>
          </label>

          <label className="post-form__field">
            <span>Category</span>
            <select className="post-form__input" value={category} onChange={event => setCategory(event.target.value)}>
              <option value="">Choose a category</option>
              {CATEGORY_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="post-form__field">
            <span>Condition</span>
            <select className="post-form__input" value={condition} onChange={event => setCondition(event.target.value)}>
              {CONDITION_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="post-form__field post-form__field--full">
            <span>Images</span>
            <textarea
              className="post-form__input post-form__textarea"
              rows="4"
              value={images}
              onChange={event => setImages(event.target.value)}
              placeholder="Paste image URLs, one per line or separated by commas"
            />
            <small className="post-form__hint">Saved as string URLs in the images array.</small>
          </label>

          <label className="post-form__field">
            <span>Country</span>
            <input
              className={`post-form__input${countryInvalid ? ' post-form__input--invalid' : ''}`}
              type="text"
              value={country}
              onChange={event => setCountry(event.target.value)}
              placeholder="Country"
            />
          </label>

          <label className="post-form__field">
            <span>City</span>
            <input
              className={`post-form__input${cityInvalid ? ' post-form__input--invalid' : ''}`}
              type="text"
              value={city}
              onChange={event => setCity(event.target.value)}
              placeholder="City"
            />
            <small className="post-form__hint">Fill both location fields or leave both empty.</small>
          </label>

          <label className="post-form__field post-form__field--full">
            <span>Tags</span>
            <input
              className="post-form__input"
              type="text"
              value={tags}
              onChange={event => setTags(event.target.value)}
              placeholder="tag-one, tag-two, tag-three"
            />
            <small className="post-form__hint">Use commas to separate tags.</small>
          </label>

          <label className="post-form__field">
            <span>Contact phone</span>
            <input
              className="post-form__input"
              type="tel"
              value={contactPhone}
              onChange={event => setContactPhone(event.target.value)}
              placeholder="Contact phone"
            />
          </label>
        </div>
      </form>
    </section>
  )
}

export default NewPostForm
