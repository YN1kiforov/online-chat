const {Router} = require('express')
const router = Router()
const User = require('../models/User')
router.post('/login', async (req, res) => {
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
router.post('/registration', async (req, res) => {
	try {
		const { name, email, password } = req.body
		const user = await new User({ name, email, password })
		await user.save()
		res.status(200).json({
			message: "Пользователь создан",
		})
	}
	catch (e) {
		res.status(400).json({ message: `ошибка при создании пользователя: ${e}` })
	}
})
module.exports = router