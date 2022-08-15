import FaceSharpIcon from '@mui/icons-material/FaceSharp';
import PermIdentitySharpIcon from '@mui/icons-material/PermIdentitySharp';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip'
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import { logout } from '../../redux/slices/auth'
import { useState } from 'react'
import { userId } from '../../redux/slices/auth'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'


import s from "./MainPage.module.scss"
function Main() {
  const UserId = useSelector(userId);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch()

  if (!UserId) {
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
              <Tooltip title="Users" placement="bottom" sx={{ cursor: 'pointer' }}>
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
              <MenuItem onClick={() => { handleClose(); dispatch(logout()) }}>Log out</MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <div className={s.side_bar}>
        <h2 className={s.side_bar__title}></h2>
        <ul className={s.side_bar__chats}>
          <li className={s.side_bar__item}>
            <div className={s.item__img}>
              <img src=''></img>
            </div>
            <div className={s.item__info}>
              <div className={s.item__name}></div>
              <div className={s.item__text}></div>
            </div>
          </li>
        </ul>
      </div>

      <div className={s.chat}>
        <div className={s.chat__top}>
          <div className={s.chat__user}>
            <div className={s.user__img}></div>
            <div className={s.user__name}></div>

          </div>
        </div>
        <div className={s.chat__content}>
          <div className={s.chat__message}></div>
        </div>
        <div className={s.chat__bot}>
          <input className={s.chat__bot} value="dsa" />
          <button className={s.chat__send}>dsdsa</button>

        </div>

      </div>

    </div>)
}

export default Main;
