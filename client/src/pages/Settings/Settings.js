import { InsertComment } from "@mui/icons-material"
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react'
import { fetchAllUsers } from '../../redux/slices/users'
import { createChat } from '../../redux/slices/chat'


import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../../components/SideMenu'
import { Navigate } from 'react-router-dom'


import s from "./Settings.module.scss"
import { UserId, logout } from '../../redux/slices/auth'


export const Settings = () => {

  const userId = useSelector(UserId);

  if (!userId) {
    return <Navigate to="/login" />
  }

  return (
    <div className={s.wrapper}>
      <SideMenu></SideMenu>
      <div className={s.content}>
        <div className={s.settings}>
          <div className={s.title}>Настройки</div>
          <div className={s.list}>
            <div className={s.item}></div>
            <div className={s.item}></div>
            <div className={s.item}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

