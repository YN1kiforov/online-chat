const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
const fs = require('fs');
const multer = require('multer');
app.get('/', (req, res) => { res.send('Вроде работает') });
const http = require('http');

const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: '*',
	}
});

const User = require('./models/User')
const Chat = require('./models/Chat')
const Message = require('./models/Message')

const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log(`DB has been connected`))
	.catch(e => console.log(`DB error: ${e}`))


io.on('connection', (socket) => {
	socket.on('chat message', (data) => {
		io.emit('chat message', data)
	})
});
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file?.originalname);
	},
});
const upload = multer({ storage });


app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), async (req, res) => {
	res.json({
		url: `/uploads/${req.file?.originalname}`,
	});
});
app.post('/setUserData', async (req, res) => {
	try {
		console.log(req.body)
		const { userId, name, county, city, about, imageUrl } = req.body;
		await User.updateOne({ _id: userId }, { $set: { name, county, city, about, avatarURL: imageUrl } })

		res.status(200).json({ data: { name, county, city, about } })
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})

app.post('/getMessages', async (req, res) => {
	try {
		const { chatId } = req.body
		const messages = await Message.find({ chatId })

		messages ? res.status(200).json({
			message: `Сообщения успешно получены`,
			messages,
		})
			: res.status(400).json({
				message: "Не получилось"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})

app.post('/getMessage', async (req, res) => {
	try {

		const { userId } = req.body
		const message = await Message.find({ userId }).populate({ path: "userId", model: "User" })

		console.log(message)
		message ? res.status(200).json({
			message: `Сообщения успешно получены`,
			message,
		})
			: res.status(400).json({
				message: "Не получилось"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})

app.post('/deleteAllMessages', async (req, res) => {
	try {
		const messages = await Message.find()
		console.log(messages)
		messages.forEach(el => { el.remove() })
		messages ? res.status(200).json({
			message: `Сообщения успешно получены`,
			messages,
		})
			: res.status(400).json({
				message: "Не получилось"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})



app.post('/getUser', async (req, res) => {
	try {
		const { userId } = req.body
		const user = await User.findOne({ _id: userId })
		res.status(200).json({ user })
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})

app.post('/sendMessage', async (req, res) => {
	try {
		const { content, userId, chatId } = req.body
		const message = await new Message({ content, userId, chatId })

		await message.save()
		message ? res.status(200).json({
			message: `Сообщение успешно создано`,
		})
			: res.status(400).json({
				message: "Не получилось создать чат"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка при cоздании чата: ${e}` })
	}

})
app.post('/findAllUserChat', async (req, res) => {
	try {
		const { userId } = req.body

		const data = await Chat.find({ usersId: userId }).populate({ path: "usersId", model: "User" });

		data ? res.status(200).json({
			message: `Чат найден`,
			data: data,
		})
			: res.status(400).json({
				message: "Не получилось создать чат"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка при поиске чата: ${e}` })
	}
})
app.post('/isChatExist', async (req, res) => {
	try {
		const { name, usersId } = req.body

		chat ? res.status(200).json({
			message: `+`,
			chat
		})
			: res.status(400).json({
				message: "-"
			})
	}
	catch (e) {
		res.status(400).json({ message: "-" })
	}
})
app.post('/createChat', async (req, res) => {
	try {
		const { name, usersId } = req.body

			(async function isChatExist() {
				const chat = await Chat.findOne({ usersId })
				if (!chat) res.status(400).json({ message: `Ошибка при cоздании чата: ${e}` })
			})()

		const chat = await new Chat({ name, usersId })
		await chat.save()
		chat ? res.status(200).json({
			message: `Чат успешно создан`,
			users: usersId,
		})
			: res.status(400).json({
				message: "Не получилось создать чат"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка при cоздании чата: ${e}` })
	}
})

app.get('/allUsers', async (req, res) => {
	try {
		const data = await User.find()
		data ? res.status(200).json({
			message: `Пользователи найдены`,
			users: data,
		})
			: res.status(400).json({
				message: "Пользователи не найдены"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка при поиске пользователя: ${e}` })
	}
})

app.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const data = await User.findOne({ email })

		const isPasswordValid = password === data?.password


		data && isPasswordValid ? res.status(200).json({
			message: `Пользователь найден`,
			userId: data.id,
		})
			: res.status(400).json({
				message: "Пользователь не найден"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка при поиске пользователя: ${e}` })
	}
})

app.post('/registration', async (req, res) => {
	try {
		console.log(req.body)
		const { name, email, password } = req.body
		const user = new User({ name, email, password })
		await user.save()
		res.status(200).json({
			message: "Пользователь создан"
		})
	}
	catch (e) {
		res.status(400).json({ message: `ошибка при создании пользователя: ${e}` })
	}
})

server.listen(port, () => {
	console.log('Server has been started');
})
