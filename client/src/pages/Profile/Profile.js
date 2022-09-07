import { useState, useEffect } from 'react'
import { getUser } from '../../redux/slices/users'
import { Tooltip, IconButton } from "@mui/material"

import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../../components/SideMenu'
import { Navigate } from 'react-router-dom'
import { useFormik } from 'formik';

import s from "./Profile.module.scss"
import { UserId } from '../../redux/slices/auth'
import axios from '../../axios'

export const Profile = () => {

  const userId = useSelector(UserId);
  const dispatch = useDispatch()
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState('/uploads/incognito.png');
  const [isEdit, setIsEdit] = useState(false);


  const formik = useFormik({
    initialValues: {
      name: '',
      county: '',
      city: '',
      about: '',
    },
    onSubmit: async (values) => {
      const { data } = await axios.post('/setUserData', { userId, ...values, imageUrl });
      const { name, county, city, about } = data.data
      setUser((prev) => ({ ...prev, name, county, city, about, avatarURL: imageUrl }))
      setIsEdit(false)
    },
  });
  useEffect(() => {
    (async () => {
      const user = await dispatch(getUser(userId))
      setUser(user?.payload?.user)
      const { name, county, city, about } = user?.payload?.user
      formik.setValues({ name, county, city, about })
      setImageUrl(user?.payload?.user?.avatarURL)
    })()
  }, [])

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0]
      formData.append('image', file);
      formData.append('userId', userId);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url)
    } catch (err) {
      alert('Ошибка при загрузке файла!');
    }
  };

  if (!userId) {
    return <Navigate to="/login" />
  }

  return (
    <div className={s.wrapper}>
      <SideMenu></SideMenu>
      <form className={s.content} onSubmit={formik.handleSubmit}>
        <div className={s.top}>
          <div className={s.avatar}>
            {isEdit
              ? <img src={`https://online-chat-mern.herokuapp.com${imageUrl}`} />
              : <img src={`https://online-chat-mern.herokuapp.com${user?.avatarURL}`} />
            }
          </div>
          {isEdit
            ? <input name="name" value={formik.values.name} onChange={formik.handleChange} />
            : <div className={s.name}>{user?.name}</div>
          }
          {isEdit
            ? null
            : <Tooltip title="Редактировать" placement="bottom">
              <IconButton onClick={() => { setIsEdit(true); formik.values.name = user.name }}>
                <EditIcon sx={{ fontSize: '30px', color: '#a6b0cf' }} />
              </IconButton>
            </Tooltip>
          }
        </div>
        {isEdit
          ? <input onChange={handleChangeFile} type="file" />
          : null
        }
        <div className={s.about}>
          <div className={s.about_title}>О себе</div>
          <div className={s.list}>
            <div className={s.item}>
              <label>Страна:</label>
              {isEdit
                ? <input name='county' value={formik.values.county} onChange={formik.handleChange} />
                : <div>{user?.county}</div>
              }
            </div>
            <div className={s.item}>
              <label>Город проживания:</label>
              {isEdit
                ? <input name='city' value={formik.values.city} onChange={formik.handleChange} />
                : <div>{user?.city}</div>
              }
            </div>
            <div className={s.item}>
              <label>О себе:</label>
              {isEdit
                ? <textarea name='about' value={formik.values.about} onChange={formik.handleChange} />
                : <div>{user?.about}</div>
              }
            </div>
          </div>
        </div>
        {isEdit
          ? <div className={s.bot}>
            <button type="submit" className={s.save_btn}>Сохранить</button>
            <button className={s.cancel_btn} onClick={() => { setIsEdit(false) }}>Отмена</button>
          </div>
          : null
        }
      </form>
    </div>

  )
}

