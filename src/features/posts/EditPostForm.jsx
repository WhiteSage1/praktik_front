import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdatePostMutation, useDeletePostMutation } from './postsApiSlice'
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

const toLineList = value => (Array.isArray(value) ? value.join('\n') : '')
const toCommaList = value => (Array.isArray(value) ? value.join(', ') : '')
const parseList = value =>
  value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)

const EditPostForm = ({ post }) => {
  const navigate = useNavigate()

  const [updatePost, { isLoading, error }] = useUpdatePostMutation()
  const [deletePost, { isLoading: isDeleting, error: deleteError }] = useDeletePostMutation()

  const [title, setTitle] = useState(post.title ?? '')
  const [description, setDescription] = useState(post.description ?? '')
  const [price, setPrice] = useState(post.price?.toString() ?? '')
  const [currency, setCurrency] = useState(post.currency ?? 'EUR')
  const [category, setCategory] = useState(post.category ?? '')
  const [condition, setCondition] = useState(post.condition ?? 'Used')
  const [images, setImages] = useState(toLineList(post.images))
  const [comments, setComments] = useState(toLineList(post.comments))
  const [country, setCountry] = useState(post.location?.country ?? '')
  const [city, setCity] = useState(post.location?.city ?? '')
  const [tags, setTags] = useState(toCommaList(post.tags))
  const [contactPhone, setContactPhone] = useState(post.contactPhone ?? '')
  const [negotiable, setNegotiable] = useState(Boolean(post.negotiable))

  useEffect(() => {
    setTitle(post.title ?? '')
    setDescription(post.description ?? '')
    setPrice(post.price?.toString() ?? '')
    setCurrency(post.currency ?? 'EUR')
    setCategory(post.category ?? '')
    setCondition(post.condition ?? 'Used')
    setImages(toLineList(post.images))
    setComments(toLineList(post.comments))
    setCountry(post.location?.country ?? '')
    setCity(post.location?.city ?? '')
    setTags(toCommaList(post.tags))
    setContactPhone(post.contactPhone ?? '')
    setNegotiable(Boolean(post.negotiable))
  }, [post])

  const parsedPrice = Number(price)
  const countryTrim = country.trim()
  const cityTrim = city.trim()
  const locationValid =
    (countryTrim === '' && cityTrim === '') ||
    (countryTrim !== '' && cityTrim !== '')

  const countryInvalid = countryTrim === '' && cityTrim !== ''
  const cityInvalid = cityTrim === '' && countryTrim !== ''

  const canSave =
    title.trim().length >= 3 &&
    description.trim().length >= 10 &&
    price.trim() !== '' &&
    !Number.isNaN(parsedPrice) &&
    parsedPrice >= 0 &&
    locationValid &&
    !isLoading

  const onSavePostClicked = async () => {
    const countryTrim = country.trim()
    const cityTrim = city.trim()

    const payload = {
      id: post.id,
      title: title.trim(),
      description: description.trim(),
      price: parsedPrice,
      currency: currency.trim().toUpperCase() || 'EUR',
      images: parseList(images),
      comments: parseList(comments),
      tags: parseList(tags),
      contactPhone: contactPhone.trim(),
      negotiable,
    }

    if (category.trim()) {
      payload.category = category.trim()
    }

    if (condition.trim()) {
      payload.condition = condition.trim()
    }

    // Only include location if at least one field is provided; validation
    // ensures both are filled when one is present.
    if (countryTrim || cityTrim) {
      payload.location = {
        country: countryTrim,
        city: cityTrim,
      }
    }

    await updatePost(payload).unwrap()
    navigate('/dash')
  }

  const onDeleteClicked = async () => {
    if (!window.confirm('Delete this post? This action cannot be undone.')) return
    try {
      await deletePost({ id: post.id }).unwrap()
      navigate('/dash')
    } catch (err) {
      // error is surfaced via deleteError
    }
  }

  const errContent = error?.data?.message ?? deleteError?.data?.message ?? ''

  return (
    <section className="post-form">
      <p className={errContent ? 'errmsg post-form__error' : 'offscreen'}>{errContent}</p>

      <form className="post-form__card" onSubmit={event => { event.preventDefault(); onSavePostClicked() }}>
        <div className="post-form__header">
          <div>
            <p className="post-form__eyebrow">Post details</p>
            <h1 className="post-form__title">Edit Post</h1>
            <p className="post-form__subtitle">Update the listing fields stored in the post record.</p>
          </div>

          <div className="post-form__actions post-form__actions--top">
            <button type="button" className="post-form__btn post-form__btn--ghost" onClick={() => navigate('/dash')}>
              Cancel
            </button>
            <button type="submit" className="post-form__btn post-form__btn--primary" disabled={!canSave}>
              Save changes
            </button>
          </div>
        </div>

        <div className="post-form__grid">
          <label className="post-form__field post-form__field--full">
            <span>Title</span>
            <input
              className="post-form__input"
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Listing title"
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

          {/* <label className="post-form__field post-form__field--full">
            <span>Comments</span>
            <textarea
              className="post-form__input post-form__textarea"
              rows="4"
              value={comments}
              onChange={event => setComments(event.target.value)}
              placeholder="Paste comment IDs, one per line or separated by commas"
            />
            <small className="post-form__hint">Stored as ObjectId references to Comment documents.</small>
          </label> */}

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

          <label className="post-form__field post-form__field--switch">
            <span>Negotiable</span>
            <div className="post-form__switch">
              <input
                id="post-negotiable"
                className="post-form__checkbox"
                type="checkbox"
                checked={negotiable}
                onChange={event => setNegotiable(event.target.checked)}
              />
              <label htmlFor="post-negotiable">Allow price negotiation</label>
            </div>
          </label>
        </div>

        <div className="post-form__actions post-form__actions--bottom">
          <button
            type="button"
            className="post-form__btn post-form__btn--danger"
            onClick={onDeleteClicked}
            disabled={isDeleting}
          >
            Delete post
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditPostForm
