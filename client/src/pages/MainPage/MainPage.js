import { Telegram } from "@mui/icons-material"
import Skeleton from '@mui/material/Skeleton';
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from 'react'
import { UserId } from '../../redux/slices/auth'
import { fetchFindAllUserChat, fetchFindMessages, deleteDialog, changeChatName, addCompanion } from '../../redux/slices/chat'
import { sendMessage } from '../../redux/slices/message'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { SideMenu } from '../../components/SideMenu'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

import Modal from '@mui/material/Modal';
import s from "./MainPage.module.scss"

const socket = io("https://online-chat-mern.herokuapp.com");

function Main() {
  const scrollRef = useRef();
  const [currentChat, setCurrentChat] = useState(null);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatName, setChatName] = useState("")

  const userId = useSelector(UserId);
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const open = Boolean(anchorEl);
  const changeChat = async (Chat) => {
    const data = await dispatch(fetchFindMessages(Chat._id))
    setMessages(data?.payload?.messages)
    setCurrentChat(Chat);
  }

  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchFindAllUserChat(userId))
      setIsLoading(false)
      setChats(data?.payload?.data)
    })()

  }, []);
  useEffect(() => {
    setChatName(currentChat?.name)
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handelerChangeChatName = () => {
    dispatch(changeChatName({ chatId: currentChat._id, name: chatName }))
    currentChat.name = chatName;
    setIsModalOpen(false)
  };
  const handelerDeleteDialog = () => {
    dispatch(deleteDialog({chatId: currentChat._id}))
    setChats((prev)=> prev.filter((chat)=> currentChat._id !== chat._id))
    setCurrentChat(null)
  };
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
          {isLoading
            ? [1, 2, 3, 4, 5, 6, 7, 8].map(() => { return <Skeleton className={s.side_bar__chat} variant="rectangular" width={384} height={60} /> })
            : chats ? chats.map((item) => {
              const companion = (item?.usersId[0]._id == userId) ? item?.usersId[1] : item?.usersId[0]
              const name = item?.name || companion?.name
              const imageURL = companion?.avatarURL || '/uploads/incognito.png'
              return <div onClick={() => { changeChat(item) }} className={s.side_bar__chat}>
                <img src={`https://online-chat-mern.herokuapp.com${imageURL}`} />
                <div className={s.side_bar__chat_name}>{name}</div>
              </div>
            }) : <div className=''>Не найдено чата</div>
          }
        </ul>
      </div>




      <div className={s.chat}>
        {currentChat
          ? <>
            <div className={s.chat__top}>
              {(() => {
                const companion = (currentChat?.usersId[0]._id == userId) ? currentChat?.usersId[1] : currentChat?.usersId[0]
                const name = currentChat?.name || ((currentChat?.usersId[0]._id == userId) ? currentChat?.usersId[1].name : currentChat?.usersId[0].name)
                const imageURL = companion?.avatarURL || '/uploads/incognito.png'
                return <>
                  <div className={s.chat__user}>
                    <div className={s.chat__img}>
                      <img src={`https://online-chat-mern.herokuapp.com${imageURL}`} />
                    </div>
                    <div className={s.chat__name}>{name}</div>

                  </div>
                  <div onClick={handleClick} className={s.chat__options}>
                    <span></span>
                  </div>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >

                    {currentChat?.isDialog
                      ? <>
                        <Link style={{ textDecoration: 'none' }} to={`/profile/${companion._id}`}>
                          <MenuItem sx={{ color: "black" }}>Посмотреть профиль</MenuItem>
                        </Link>
                        <MenuItem onClick={() => { handleClose() }}>Поиск сообщений*</MenuItem>
                        <MenuItem sx={{ color: "red" }} onClick={handelerDeleteDialog}>Удалить диалог</MenuItem>
                      </>
                      : <>
                        <MenuItem onClick={() => { handleClose(); setIsModalOpen(true) }}>Поменять название</MenuItem>
                        <MenuItem onClick={() => { handleClose() }}>Добавить собеседника</MenuItem>
                        <MenuItem onClick={() => { handleClose() }}>Изменить аватарку чата</MenuItem>
                        <MenuItem onClick={() => { handleClose() }}>Посмотреть список участников</MenuItem>
                        <MenuItem sx={{ color: "red" }} onClick={() => { handleClose() }}>Выйти из чата</MenuItem>
                      </>
                    }
                  </Menu>
                </>

              })()}
            </div>
            <div className={s.chat__content} >
              <ul className={s.chat__messages}>
                {messages.length !== 0 ? messages.map((message) => {
                  return <div ref={scrollRef} className={message.userId == userId ? s.chat__message + ` ${s.owner}` : s.chat__message}><p>{message.content}</p></div>
                }) : <div className={s.helper}>Начните диалог</div>}
              </ul>
            </div>
            <div className={s.chat__bot}>
              <input value={value} onKeyDown={(e) => { if (e.code === "Enter") { submitMessage() } }} onChange={(e) => { setValue(e.target.value) }} className={s.chat__input} placeholder="Отправить сообщение" />
              <button onClick={submitMessage} className={s.chat__send}>
                <Telegram sx={{ color: "white" }} />
              </button>
            </div>
          </>
          : <div className={s.helper}>Выберите чат</div>
        }

      </div>
      <Modal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={s.modal}>
          <div className={s.title}>Введите новое название чата </div>
          <input value={chatName} onChange={(e) => { setChatName(e.target.value) }}></input>
          <button onClick={handelerChangeChatName}>Изменить</button>
        </div>
      </Modal>
    </div>)
}

export default Main;
