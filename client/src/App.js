import './App.scss';
import sound from './assets/notification.mp3'
import { useTheme } from "./hooks/use-theme"
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from './pages/Login/Login';
import { Registration } from './pages/Registration/Registration';
import { Users } from './pages/Users/Users';
import { Profile } from './pages/Profile/Profile';
import { Settings } from './pages/Settings/Settings';
import { useSelector } from 'react-redux';
import { UserId } from './redux/slices/auth'
import socket from './socket'
import { useEffect } from 'react'

import Main from './pages/MainPage/MainPage';


function App() {
  const { theme, setTheme } = useTheme()
  const userId = useSelector(UserId);
  const audioNotification = new Audio(sound);

  audioNotification.volume = 0.35;
  useEffect(() => {
    if (userId) {
      socket.connect()
      socket.on('notification', () => {
        audioNotification.play()
      })
      return () => {
        socket.disconnect()
      };
    }
  }, [userId])
  return (
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/registration' element={<Registration />}></Route>
      <Route path='/' element={<Main />}></Route>
      <Route path='/users' element={<Users />}></Route>
      <Route path='/profile/:profileUserId' element={<Profile />}></Route>
      <Route path='/profile' element={<Navigate to={`./${userId}`} />} />
      <Route path='/settings' element={<Settings />}></Route>
    </Routes>
  )
}

export default App;