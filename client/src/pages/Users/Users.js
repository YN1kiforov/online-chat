import { InsertComment } from "@mui/icons-material"

import { useState, useEffect } from 'react'
import { fetchAllUsers } from '../../redux/slices/users'


import { useDispatch } from 'react-redux';
import { SideMenu } from '../../components/SideMenu'


import s from "./Users.module.scss"


export const Users = () => {
  const [userList, setUserList] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchAllUsers())
      setUserList(data?.payload?.users)
    })()
  }, []);


  return (
    <div className={s.wrapper}>
      <SideMenu></SideMenu>
      <div className={s.content}>
        {userList
          ? userList.map((user) => {
            return <div className={s.user}>
              <div className={s.name}>{user.name}</div>
              <div className={s.button}>
                <InsertComment sx={{ color: '#a6b0cf' }}></InsertComment>
              </div>
            </div>
          })
          : <div> Не удалось найти пользователей(</div>}
      </div>
    </div>
  )
}

