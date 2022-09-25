import { Telegram } from "@mui/icons-material"
import Skeleton from '@mui/material/Skeleton';
import socket from "../../socket";
import { useState, useEffect, useRef } from 'react'
import { UserId } from '../../redux/slices/auth'
import { fetchFindAllUserChat, fetchFindMessages, deleteDialog, changeChatName, LastChatsVisit, setLastChatsVisit } from '../../redux/slices/chat'
import { sendMessage } from '../../redux/slices/message'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { SideMenu } from '../../components/SideMenu/SideMenu'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import incognito from "../../assets/incognito.png"
import Modal from '@mui/material/Modal';
import s from "./MainPage.module.scss"

function Main() {
  const scrollRef = useRef();
  const [currentChat, setCurrentChat] = useState(null);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatName, setChatName] = useState("")

  const userId = useSelector(UserId);
  const lastChatsVisit = useSelector(LastChatsVisit);
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const open = Boolean(anchorEl);


  useEffect(() => {
    (async () => {
      const data = await dispatch(fetchFindAllUserChat(userId))
      setIsLoading(false)
      setChats(data?.payload?.data)
    })()

  }, []);
  useEffect(() => {
    setChatName(currentChat?.name)
    dispatch(setLastChatsVisit(currentChat?._id))
    socket.on('chat message', async (msg) => {
      if (Array.isArray(messages) && msg.chatId === currentChat?._id) setMessages((prev) => [...prev, msg]);

      let UpdatedChat;
      const chatsList = chats.filter((chat) => {
        const isUpdatedChat = chat._id === msg.chatId
        if (isUpdatedChat) UpdatedChat = chat
        return !isUpdatedChat
      })
      if (UpdatedChat?._id !== currentChat?._id) {
        UpdatedChat.updatedAt = new Date()
      }
      if (UpdatedChat) setChats([UpdatedChat, ...chatsList])
    })
    return () => {
      socket.off('chat message');
      dispatch(setLastChatsVisit(currentChat?._id))
    };
  }, [currentChat, chats])
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (!userId) {
    return <Navigate to="/login" />
  }


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handelerChangeChatName = () => {
    dispatch(changeChatName({ chatId: currentChat?._id, name: chatName }))
    currentChat.name = chatName;
    setIsModalOpen(false)
  };
  const handelerDeleteDialog = () => {
    dispatch(deleteDialog({ chatId: currentChat._id }))
    setChats((prev) => prev.filter((chat) => currentChat._id !== chat._id))
    setCurrentChat(null)
  };
  const submitMessage = async () => {
    if (value.length === 0){
      return
    }
    await dispatch(sendMessage({ userId, value, currentChatId: currentChat._id }))
    setValue("")
    socket.emit('chat message', { content: value, chatId: currentChat._id, userId, });
    socket.emit('notification', {});
  }
  const changeChat = async (Chat) => {
    const data = await dispatch(fetchFindMessages(Chat._id))
    setMessages(data?.payload?.messages)
    setCurrentChat(Chat);
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
              const imageURL = companion?.avatarURL ? `https://online-chat-mern.herokuapp.com${companion?.avatarURL}` : incognito 
              console.log(`LastChatsVisit: ${lastChatsVisit[item._id]} \nitem: ${Date.parse(item.updatedAt)}   \nisRead: ${lastChatsVisit[item._id] > Date.parse(item.updatedAt)}`)
              const isRead = lastChatsVisit[item._id] > Date.parse(item.updatedAt)

              return <div onClick={() => { changeChat(item) }} className={isRead ? `${s.side_bar__chat} ` : `${s.side_bar__chat} ${s.unread}`}>
                <img src={imageURL} />
                <div className={s.side_bar__chat_name}>{name}</div>
              </div>
            }) : <div className=''>Не найдено чата</div>
          }
        </ul>
      </div>
      <form onSubmit={submitMessage} className={s.chat}>
        {currentChat
          ? <>
            <div className={s.chat__top}>
              {(() => {
                const companion = (currentChat?.usersId[0]._id == userId) ? currentChat?.usersId[1] : currentChat?.usersId[0]
                const name = currentChat?.name || ((currentChat?.usersId[0]._id == userId) ? currentChat?.usersId[1].name : currentChat?.usersId[0].name)
                const imageURL = companion?.avatarURL ? `https://online-chat-mern.herokuapp.com${companion?.avatarURL}` : incognito 
                return <>
                  <div className={s.chat__user}>
                    <div className={s.chat__img}>
                      <img src={imageURL} />
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
                        <MenuItem onClick={() => { handleClose() }}>Добавить собеседника*</MenuItem>
                        <MenuItem onClick={() => { handleClose() }}>Изменить аватарку чата*</MenuItem>
                        <MenuItem onClick={() => { handleClose() }}>Посмотреть список участников*</MenuItem>
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
              <button type="submit" disabled={value.length === 0} className={s.chat__send}>
                <Telegram sx={{ color: "white" }} />
              </button>
            </div>
          </>
          : <div className={s.helper}>Выберите чат</div>
        }

      </form>
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
