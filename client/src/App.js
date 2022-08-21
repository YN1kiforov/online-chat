import './App.scss';

import { Routes, Route } from "react-router-dom";
import { Login } from './pages/Login/Login';
import { Registration } from './pages/Registration/Registration';


import Main from './pages/MainPage/MainPage';


function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/registration' element={<Registration />}></Route>
      <Route path='/' element={<Main />}></Route>
    </Routes>
  )
}

export default App;
