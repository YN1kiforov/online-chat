import { FaceSharp, PermIdentitySharp, InsertComment, PeopleAlt, Settings, AccountCircle, Telegram } from "@mui/icons-material"
import { Tooltip, IconButton, MenuItem, Menu } from "@mui/material"

import { useState } from 'react'
import { logout } from '../redux/slices/auth'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import s from "../pages/MainPage/MainPage.module.scss"

export const SideMenu = () => {

  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={s.menu}>
      <div className={s.menu__logo}>
        <FaceSharp sx={{ fontSize: '55px', color: '#a6b0cf' }} />
      </div>
      <div className={s.menu__center}>
        <ul className={s.menu__list}>
          <li className={s.menu__item}>
            <Link to="/profile">
              <Tooltip title="Profile" placement="bottom">
                <IconButton>
                  <PermIdentitySharp sx={{ fontSize: '35px', color: '#a6b0cf' }} />
                </IconButton>
              </Tooltip>
            </Link>
          </li>
          <li className={s.menu__item}>
            <Link to="/">
              <Tooltip title="Chats" placement="bottom">
                <IconButton>
                  <InsertComment sx={{ fontSize: '35px', color: '#a6b0cf' }} />
                </IconButton>
              </Tooltip>
            </Link>
          </li>
          <li className={s.menu__item}>
            <Link to="/users">
              <Tooltip title="Users" placement="bottom">
                <IconButton>
                  <PeopleAlt sx={{ fontSize: '35px', color: '#a6b0cf' }} />
                </IconButton>
              </Tooltip>
            </Link>
          </li>
          <li className={s.menu__item}>
            <Link to="/settings">
              <Tooltip title="Settings" placement="bottom" >
                <IconButton>
                  <Settings sx={{ fontSize: '35px', color: '#a6b0cf' }} />
                </IconButton>
              </Tooltip>
            </Link>
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

            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <MenuItem onClick={handleClose} sx={{ color: "black" }}>
                Profile
              </MenuItem>
            </Link>
            <Link to="/settings" style={{ textDecoration: 'none' }}>
              <MenuItem sx={{ color: "black" }} onClick={handleClose}>
                Settings
              </MenuItem>
            </Link>

            <MenuItem sx={{ color: "red" }} onClick={() => { handleClose(); dispatch(logout()) }}>Log out</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  )
}
