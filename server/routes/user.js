const {Router} = require('express')
const router = Router()
const User = require('../models/User')

router.post('/setUserData', async (req, res) => {
	try {
		const { userId, name, county, city, about, imageUrl } = req.body;
		await User.updateOne({ _id: userId }, { $set: { name, county, city, about, avatarURL: imageUrl } })
		res.status(200).json({ data: { name, county, city, about } })
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})
router.post('/getUser', async (req, res) => {
	try {
		const { userId } = req.body
		const user = await User.findOne({ _id: userId })
		res.status(200).json({ user })
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})
router.get('/allUsers', async (req, res) => {
	try {
		const { page, limit } = req.query;
		const data = await User.find()
		const startIndex = limit * (page - 1)
		const endIndex = limit * (page)
		const TotalCount = Math.ceil(data.length / limit)
		const users = data.slice(startIndex, endIndex)


		data ? res.status(200).json({
			message: `Пользователи найдены`,
			users,
			TotalCount,
		})
			: res.status(400).json({
				message: "Пользователи не найдены"
			})
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка при поиске пользователя: ${e}` })
	}
})
module.exports = router