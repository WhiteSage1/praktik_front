import React from 'react'
import '../css/404.css'

function NotFound() {
	return (
		<main className="notfound" role="main">
			<div className="notfound-content">
				<h1 className="nf-code">404</h1>
				<p className="nf-message">Sorry — the page you requested does not exist.</p>
				<a className="nf-home" href="/">Return to homepage</a>
			</div>
		</main>
	)
}

export default NotFound
