import { InsertComment } from "@mui/icons-material"
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react'
import { fetchAllUsers } from '../../redux/slices/users'


import { useDispatch } from 'react-redux';
import { SideMenu } from '../../components/SideMenu'


import s from "./Users.module.scss"


export const Users = () => {
  const [userList, setUserList] = useState(null)
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchAllUsers())
      setUserList(data?.payload?.users)
    })()
  }, []);


  return (
    <div className={s.wrapper}>
      <Modal className={s.modal}
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div >
        </div>
      </Modal>
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

