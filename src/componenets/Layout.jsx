import { Outlet } from 'react-router-dom'
import Navigation from '../componenets/Navigation'

const Layout = () => {
    return (
        <div className="app">
            <Navigation />
            <main>
                <Outlet />
            </main>
        </div>
        
    )
}

export default Layout
