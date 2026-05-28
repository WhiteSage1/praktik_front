import { Outlet } from 'react-router-dom'
import Navigation from '../componenets/Navigation'

const Layout = () => {
    return (
        <div style={{ 'background-color': '#b46d6d' }}>
            <Navigation />
            <main>
                <Outlet />
            </main>
        </div>
        
    )
}

export default Layout
