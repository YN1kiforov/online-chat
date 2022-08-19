import FaceSharpIcon from '@mui/icons-material/FaceSharp';
import PermIdentitySharpIcon from '@mui/icons-material/PermIdentitySharp';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip'
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import TelegramIcon from '@mui/icons-material/Telegram';
import Menu from "@mui/material/Menu";

import { logout } from '../../redux/slices/auth'
import { useState, useEffect } from 'react'
import { UserId } from '../../redux/slices/auth'
import { fetchFindAllUserChat, fetchFindMessages } from '../../redux/slices/chat'

import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'

import s from "./MainPage.module.scss"
function Main() {
  const [messages, setMessages] = useState(null);
  const [chats, setChats] = useState(null);
  const userId = useSelector(UserId);
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchFindAllUserChat(userId))
      setChats(data?.payload?.data)
    })()
  }, []);

  const changeChat = async (currentChatId) => {
    const data = await dispatch(fetchFindMessages(currentChatId))
    setMessages(data?.payload?.messages)
  }

  if (!userId) {
    return <Navigate to="/login" />
  }


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={s.wrapper}>
      <div className={s.menu}>
        <div className={s.menu__logo}>
          <FaceSharpIcon sx={{ fontSize: '55px', color: '#a6b0cf' }} />
        </div>
        <div className={s.menu__center}>
          <ul className={s.menu__list}>
            <li className={s.menu__item}>
              <Tooltip title="Profile" placement="bottom">
                <IconButton>
                  <PermIdentitySharpIcon sx={{ fontSize: '35px', color: '#a6b0cf' }} />
                </IconButton>
              </Tooltip>
            </li>
            <li className={s.menu__item}>
              <Tooltip title="Chats" placement="bottom">
                <IconButton>
                  <InsertCommentIcon sx={{ fontSize: '35px', color: '#a6b0cf' }} />
                </IconButton>
              </Tooltip>
            </li>
            <li className={s.menu__item}>
              <Tooltip title="Users" placement="bottom">
                <IconButton>
                  <PeopleAltIcon sx={{ fontSize: '35px', color: '#a6b0cf' }} />
                </IconButton>
              </Tooltip>
            </li>
            <li className={s.menu__item}>
              <Tooltip title="Settings" placement="bottom" >
                <IconButton>
                  <SettingsIcon sx={{ fontSize: '35px', color: '#a6b0cf' }} />
                </IconButton>
              </Tooltip>
            </li>
          </ul>
        </div>
        <div className={s.menu__bottom}>
          <div className={s.menu__profile}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle sx={{ fontSize: '35px', color: '#a6b0cf' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem sx={{ color: "red" }} onClick={() => { handleClose(); dispatch(logout()) }}>Log out</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <div className={s.side_bar}>
        <h2 className={s.side_bar__title}>Chats</h2>
        <ul className={s.side_bar__chats}>
          {chats ? chats.map((item) => {
            return <div onClick={(e) => { changeChat(e.target.id) }} className={s.side_bar__chat} id={item._id}>
              <div className={s.side_bar__chat_name}>{item.name}</div>
            </div>
          }) : <div className=''>Не найдено чата</div>}
        </ul>
      </div>
      <div className={s.chat}>
        <div className={s.chat__top}>
          <div className={s.chat__user}>
            <div className={s.chat__img}>
              <FaceSharpIcon sx={{ fontSize: '35px', color: '#a6b0cf' }} />
            </div>
            <div className={s.chat__name}>Name</div>
          </div>
        </div>
        <div className={s.chat__content} >

          <ul className={s.chat__messages}>
            {messages ? messages.map((message) => {
              return <div className={message.userId == userId ? s.chat__message + ` ${s.owner}` : s.chat__message}><p>{message.content}</p></div>
            }) : <div className=''>Выберите чат</div>}
          </ul>
        </div>
        <div className={s.chat__bot}>
          <input className={s.chat__input} placeholder="Отправить сообщение" />
          <button className={s.chat__send}>
            <TelegramIcon sx={{ color: "white" }} />
          </button>
        </div>
      </div>
    </div>)
}

export default Main;
