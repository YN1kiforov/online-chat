import { useState, useEffect } from 'react'
import { getUser } from '../../redux/slices/users'
import { Tooltip, IconButton } from "@mui/material"

import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../../components/SideMenu/SideMenu'
import { Navigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik';
import CircularProgress from '@mui/material/CircularProgress';
import s from "./Profile.module.scss"
import { UserId } from '../../redux/slices/auth'
import axios from '../../axios'
import incognito from "../../assets/incognito.png"

export const Profile = (props) => {
  const userId = useSelector(UserId);
  const { profileUserId } = useParams();
  const dispatch = useDispatch()
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const isYourAccount = profileUserId === userId;
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
      const user = await dispatch(getUser(profileUserId))
      setUser(user?.payload?.user)
      setIsLoading(false)
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
        {isLoading
          ? <CircularProgress sx={{ color: '#a6b0cf' }} className={s.center} />
          : user
            ? <>
              <div className={s.top}>
                <div className={s.avatar}>
                  {isEdit
                    ? <img src={imageUrl ? `https://online-chat-mern.herokuapp.com${imageUrl}` : incognito} />
                    : <img src={user?.avatarURL ? `https://online-chat-mern.herokuapp.com${user?.avatarURL}` : incognito} />
                  }
                </div>
                {isEdit
                  ? <input name="name" value={formik.values.name} onChange={formik.handleChange} />
                  : <div className={s.name}>{user?.name}</div>
                }
                {(!isEdit && isYourAccount)
                  ? <Tooltip title="Редактировать" placement="bottom">
                    <IconButton onClick={() => { setIsEdit(true); formik.values.name = user.name }}>
                      <EditIcon sx={{ fontSize: '30px', color: '#a6b0cf' }} />
                    </IconButton>
                  </Tooltip>
                  : null
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
            </>
            : <div className={s.center}>Не удалось найти пользователя</div>
        }
      </form>
    </div>
  )
}

