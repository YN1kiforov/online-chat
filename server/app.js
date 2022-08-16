const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')

const User = require('./models/User')
const Chat = require('./models/Chat')
const Message = require('./models/Message')

const port = 3001

app.use(cors())
app.use(express.json())
mongoose.connect('mongodb+srv://admin1:admin@cluster0.rp9lz.mongodb.net/test')
	.then(() => console.log(`DB has been connected`))
	.catch(e => console.log(`DB error: ${e}`))


app.post('/createMessage', async (req, res) => {
	try {
		const { name, usersId } = req.body
		const message = await new Message({ name, usersId })

		await message.save()
		message ? res.status(200).json({
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
app.post('/findAllUserChat', async (req, res) => {
	try {
		const { userId } = req.body

		const data = await Chat.find({ usersId: userId });

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
app.post('/createChat', async (req, res) => {
	try {
		const { name, usersId } = req.body
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

app.listen(port, () => {
	console.log('Server has been started');
})