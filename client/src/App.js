import './App.scss';
import { useTheme } from "./hooks/use-theme"
import { Routes, Route } from "react-router-dom";
import { Login } from './pages/Login/Login';
import { Registration } from './pages/Registration/Registration';
import { Users } from './pages/Users/Users';
import { Profile } from './pages/Profile/Profile';
import { Settings } from './pages/Settings/Settings';



import Main from './pages/MainPage/MainPage';


function App() {
  const { theme, setTheme } = useTheme()
  return (
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/registration' element={<Registration />}></Route>
      <Route path='/' element={<Main />}></Route>
      <Route path='/users' element={<Users />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/settings' element={<Settings />}></Route>
    </Routes>
  )
}

export default App;
