import PublicPostsList from '../features/posts/PublicPostsList'
import '../css/Posts.css'
import '../css/Public.css'

const Public = () => {
  return (
    <main className="public-page">
      <section className="public-page__hero">
        <h1>Latest Posts</h1>
        <p>Browse the newest listings without logging in.</p>
      </section>

      <PublicPostsList />
    </main>
  )
}

export default Public
