const express = require('express')
const app = express()
const User = require('./models/User')
const mongoose = require('mongoose');

const port = 3000
app.use(express.json())
mongoose.connect('mongodb+srv://admin1:admin@cluster0.rp9lz.mongodb.net/test')
	.then(() => console.log(`DB has been connected`))
	.catch(e => console.log(`DB error: ${e}`))

app.get('/', (req, res) => {
	res.send('hello world')
})
app.get('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = new User({ email, password })
		
		const data = await User.findOne({email})

		const isPasswordValid = password === data.password


		data && isPasswordValid

		? res.status(400).json({
			message: `Пользователь найден`
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

app.get('/chat/:id', async (req, res) => {
	try {
		
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка при поиске пользователя: ${e}` })
	}
})


app.listen(port, () => {
	console.log('Server has been started');
})