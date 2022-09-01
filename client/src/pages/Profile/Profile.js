
import { useState, useEffect } from 'react'
import { getUser } from '../../redux/slices/users'


import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../../components/SideMenu'
import { Navigate } from 'react-router-dom'


import s from "./Profile.module.scss"
import { UserId } from '../../redux/slices/auth'
import { ContactPageSharp } from '@mui/icons-material';
import { Form } from 'formik';
import axios from 'axios';

export const Profile = () => {

  const userId = useSelector(UserId);
  const dispatch = useDispatch()
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    (async () => {
      let user = await dispatch(getUser(userId))
      setUser(user?.payload?.user)
    })()
  }, [])

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0]
      formData.append('image', file);
      const { data } = await axios.post('http://localhost:3001/upload', formData);
      console.log(data)
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };


  if (!userId) {
    return <Navigate to="/login" />
  }


  return (
    <div className={s.wrapper}>
      <SideMenu></SideMenu>
      <div className={s.content}>
        <div className={s.top}>
          <div className={s.avatar}>
            <img src={`http://localhost:3001${imageUrl}`}></img>
          </div>
          <div className={s.name}>{user?.name}</div>
        </div>
        <input onChange={handleChangeFile} type="file" />

        <div className={s.about}>
          <div className={s.list}>
            <div className={s.item}>
            </div>
          </div>
          <div className={s.about}></div>
        </div>
      </div>
    </div>
  )
}

