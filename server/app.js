const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')

const User = require('./models/User')

const port = 3001

app.use(cors())
app.use(express.json())
mongoose.connect('mongodb+srv://admin1:admin@cluster0.rp9lz.mongodb.net/test')
	.then(() => console.log(`DB has been connected`))
	.catch(e => console.log(`DB error: ${e}`))

app.get('/', (req, res) => {
	res.json({})
})
app.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const data = await User.findOne({email})

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

app.post('/register', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = new User({ email, password })
		await user.save()
		res.json({
			message: "user has been created"
		})
	}
	catch (e) {
		res.status(400).json({ message: `ошибка при создании пользователя: ${e}` })
	}
})

app.listen(port, () => {
	console.log('Server has been started');
})