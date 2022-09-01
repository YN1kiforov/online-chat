import { FaceSharp, Telegram } from "@mui/icons-material"

import { io } from "socket.io-client";
import { useState, useEffect, useRef } from 'react'
import { UserId, } from '../../redux/slices/auth'

import { fetchFindAllUserChat, fetchFindMessages } from '../../redux/slices/chat'
import { sendMessage } from '../../redux/slices/message'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { SideMenu } from '../../components/SideMenu'


import s from "./MainPage.module.scss"

const socket = io(":3001");

function Main() {
  const scrollRef = useRef();
  const [currentChat, setCurrentChat] = useState(null);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState(null);
  const userId = useSelector(UserId);
  const dispatch = useDispatch()

  const changeChat = async (Chat) => {
    const data = await dispatch(fetchFindMessages(Chat._id))
    setMessages(data?.payload?.messages)
    setCurrentChat(Chat);
  }

  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchFindAllUserChat(userId))
      setChats(data?.payload?.data)
    })()
  }, []);
  useEffect(() => {
    socket.on('chat message', async (msg) => {
      if (Array.isArray(messages) && msg.chatId === currentChat?._id) setMessages((prev) => [...prev, msg]);
    })
    return () => {
      socket.off('chat message');
    };
  }, [currentChat])
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (!userId) {
    return <Navigate to="/login" />
  }


  const submitMessage = async () => {
    await dispatch(sendMessage({ userId, value, currentChatId: currentChat._id }))
    setValue("")
    socket.emit('chat message', { content: value, chatId: currentChat._id, userId, });
  }
  return (
    <div className={s.wrapper}>
      <SideMenu></SideMenu>
      <div className={s.side_bar}>
        <h2 className={s.side_bar__title}>Chats</h2>
        <ul className={s.side_bar__chats}>
          {chats ? chats.map((item) => {
            let name = item.name || ((item?.usersId[0]._id == userId) ? item?.usersId[1].name : item?.usersId[0].name)
            return <div onClick={(e) => { changeChat(item) }} className={s.side_bar__chat}>

              <div className={s.side_bar__chat_name}>{name}</div>
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
              return <div ref={scrollRef} className={message.userId == userId ? s.chat__message + ` ${s.owner}` : s.chat__message}><p>{message.content}</p></div>
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
