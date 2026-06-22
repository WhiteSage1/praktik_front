import { Routes, Route } from 'react-router-dom'
import Layout from './componenets/Layout'
import DashLayout from './componenets/DashLayaut'
import Public from './pages/Public'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Main from './features/auth/Main'
import UsersList from './features/users/UsersList'
import PostsList from './features/posts/PostsList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditPost from './features/posts/EditPost'
import NewPost from './features/posts/NewPost'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import AdminPanel from './pages/AdminPanel'
import '../src/css/index.css'
import NotFound from './pages/404'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              
              <Route index element={<Main />} />

              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path=":id" element={<EditUser />} />
                <Route path="new" element={<NewUserForm />} />
              </Route>
              
              <Route path="posts">
                <Route index element={<PostsList />} />
                <Route path=":id" element={<EditPost />} />
                <Route path="new" element={<NewPost />} />
              </Route>

              <Route path="admin" element={<AdminPanel />}/>
                {/* <Route index element={<AdminPanel />} /> */}
              {/* </Route> */}

            </Route>
          </Route>
        </Route>

      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
