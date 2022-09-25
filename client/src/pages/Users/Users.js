import Modal from '@mui/material/Modal';


import { useState, useEffect } from 'react'
import { fetchAllUsers } from '../../redux/slices/users'
import { createChat, createDialog } from '../../redux/slices/chat'
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { MenuItem, Menu } from "@mui/material"
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';

import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../../components/SideMenu/SideMenu'
import { Navigate } from 'react-router-dom'


import s from "./Users.module.scss"
import { UserId } from '../../redux/slices/auth'

export const Users = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [countPages, setCountPages] = useState(0)
  const [value, setValue] = useState("")
  const [userList, setUserList] = useState(null)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar("This is a success message!", { variant: "error" });

  const [companionId, setCompanionId] = useState(null);

  const handleClose = () => {
    setCompanionId(null)
    setIsModalOpen(false)
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const userId = useSelector(UserId);
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchAllUsers(currentPage))
      setCountPages(data?.payload?.TotalCount)
      setUserList(data?.payload?.users)
      setIsLoading(false)
    })()
  }, [currentPage]);
  if (!userId) {
    return <Navigate to="/login" />
  }

  const createNewChat = async (chatName) => {
    const res = await dispatch(createChat({ value, usersId: [userId, companionId] }))
    if (res?.payload) {
      enqueueSnackbar('Чат успешно создан', { variant: "success", autoHideDuration: 3000 })
      handleClose()
      setValue("");
    } else {
      enqueueSnackbar("Ошибка при создании чата", { variant: "error", autoHideDuration: 3000 })
    }
  }
  const createNewDialog = async () => {
    const res = await dispatch(createDialog({ usersId: [userId, companionId] }))
    if (res?.payload) {
      enqueueSnackbar('Чат успешно создан', { variant: "success", autoHideDuration: 3000 })
      handleClose()
    } else {
      enqueueSnackbar("Не получилось", { variant: "error", autoHideDuration: 3000 })
    }
  }

  return (
    <div className={s.wrapper}>
      <SideMenu></SideMenu>
      <div className={s.content}>
        <Modal
          open={isModalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={s.modal}>
            <div className={s.title}>Введите название чата </div>
            <input value={value} onChange={(e) => { setValue(e.target.value) }}></input>
            <button onClick={createNewChat}>Создать</button>
            <div className={s.tip}>(Нельзя создан чат без названия)</div>
          </div>
        </Modal>

        {isLoading
          ? <CircularProgress sx={{ color: '#a6b0cf' }} className={s.progress} />
          : userList
            ? <>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <Link style={{ textDecoration: 'none' }} to={`/profile/${companionId}`}>
                  <MenuItem sx={{ color: "black" }} onClick={() => { }}>Посмотреть профиль</MenuItem>
                </Link>

                <MenuItem onClick={() => { handleMenuClose(); createNewDialog() }}>Создать диалог</MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); setIsModalOpen(true) }}>Создать чат</MenuItem>
              </Menu>

              <div className={s.list}>
                {userList.map((user) => {
                  if (userId !== user._id) {
                    return <div className={s.user} >
                      <div className={s.name}>{user.name}</div>
                      <button className={s.button} onClick={(e) => { setCompanionId(user._id); handleMenu(e) }}>
                        <AddIcon sx={{ color: "white" }} />
                      </button>
                    </div>
                  }
                })}
              </div>
              <div className={s.bot}>
                <Pagination count={countPages} page={currentPage} onChange={handleChange} />

              </div>
            </>
            : <div> Не удалось найти пользователей</div>
        }
      </div>
    </div>
  )
}
