import './App.scss';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';
import Main from './pages/MainPage/MainPage';
function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/' element={<Main />}></Route>
    </Routes>
  )


  // let map = 'content'
  // return (
  //   <div className="wrapper">
  //     <div className='navbar'>
  //       <div className='navbar__logo'></div>
  //       <div className='navbar__center'>
  //         <ul className='navbar__links'>
  //           {map}
  //         </ul>
  //       </div>
  //       <div className='navbar__bottom'></div>
  //     </div>




  //     <div className='chat-sidebar'></div>
  //     <div className='user-chat'></div>
  //   </div>
  // );
}

export default App;
