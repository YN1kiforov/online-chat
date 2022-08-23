import { FaceSharp, PermIdentitySharp, InsertComment, PeopleAlt, Settings, AccountCircle, Telegram } from "@mui/icons-material"
import { Tooltip, IconButton, MenuItem, Menu } from "@mui/material"

import { io } from "socket.io-client";
import { useState, useEffect } from 'react'
import { UserId, logout } from '../../redux/slices/auth'
import { fetchFindAllUserChat, fetchFindMessages } from '../../redux/slices/chat'
import { sendMessage } from '../../redux/slices/message'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { SideMenu } from '../../components/SideMenu'


import s from "./MainPage.module.scss"

const socket = io(":3001");

function Main() {

  const [currentChatId, setCurrentChatId] = useState(null);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState(null);
  const [chats, setChats] = useState(null);
  const userId = useSelector(UserId);
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchFindAllUserChat(userId))
      setChats(data?.payload?.data)
    })()
  }, []);
  if (!userId) {
    return <Navigate to="/login" />
  }
  const changeChat = async (ChatId) => {
    const data = await dispatch(fetchFindMessages(ChatId))
    setMessages(data?.payload?.messages)
    setCurrentChatId(ChatId);
  }
  socket.on('chat message', () => {
    changeChat(currentChatId)
  })

  const submitMessage = async () => {
    await dispatch(sendMessage({ userId, value, currentChatId }))
    setValue("")
    socket.emit('chat message', { value, chatId: currentChatId, userId, });
  }
  return (
    <div className={s.wrapper}>
      <SideMenu></SideMenu>
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
              <FaceSharp sx={{ fontSize: '35px', color: '#a6b0cf' }} />
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
          <input value={value} onKeyDown={(e) => { if (e.code === "Enter") { submitMessage() } }} onChange={(e) => { setValue(e.target.value) }} className={s.chat__input} placeholder="Отправить сообщение" />
          <button onClick={submitMessage} className={s.chat__send}>
            <Telegram sx={{ color: "white" }} />
          </button>
        </div>
      </div>
    </div>)
}

export default Main;
