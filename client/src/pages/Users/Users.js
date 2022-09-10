import { InsertComment } from "@mui/icons-material"
import Modal from '@mui/material/Modal';

import { useState, useEffect } from 'react'
import { fetchAllUsers } from '../../redux/slices/users'
import { createChat } from '../../redux/slices/chat'
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';

import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../../components/SideMenu'
import { Navigate } from 'react-router-dom'


import s from "./Users.module.scss"
import { UserId } from '../../redux/slices/auth'


export const Users = () => {
  const [value, setValue] = useState("")
  const [userList, setUserList] = useState(null)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  const { enqueueSnackbar } = useSnackbar("This is a success message!", { variant: "error" });

  const [companionId, setCompanionId] = useState(null);
  const handleOpen = (Id) => {
    setCompanionId(Id)
  };
  const handleClose = () => setCompanionId(null);

  const userId = useSelector(UserId);


  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchAllUsers())
      setUserList(data?.payload?.users)
      setIsLoading(false)
    })()
  }, []);
  if (!userId) {
    return <Navigate to="/login" />
  }

  const createNewChat = async () => {
    const res = await dispatch(createChat({ value: "", usersId: [userId, companionId] }))
    if (res?.payload) {
      enqueueSnackbar('Чат успешно создан', { variant: "success", autoHideDuration: 3000 })
      handleClose()
      setValue("");
    } else {
      enqueueSnackbar("Такой чат уже есть", { variant: "error", autoHideDuration: 3000 })
    }
  }

  return (
    <div className={s.wrapper}>

      <SideMenu></SideMenu>
      <div className={s.content}>
        <Modal
          open={companionId}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={s.modal}>
            <div className={s.title}>Введите название чата </div>
            <input value={value} onChange={(e) => { setValue(e.target.value) }}></input>
            <button onClick={createNewChat}>Создать</button>
            <div className={s.tip}>(Если вы не введете название, то будет использоваться имя собеседника)</div>
          </div>
        </Modal>
        {isLoading
          ? <CircularProgress sx={{ color: '#a6b0cf' }} className={s.progress} />
          : userList
            ? userList.map((user) => {
              if (userId !== user._id) {
                return <div className={s.user} >
                  <div className={s.name}>{user.name}</div>
                  <div className={s.button} onClick={() => { handleOpen(user._id) }} >
                    <InsertComment sx={{ color: 'white' }}></InsertComment>
                  </div>
                </div>
              }
            })
            : <div> Не удалось найти пользователей</div>
        }
      </div>
    </div>
  )
}
