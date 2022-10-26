const {Router} = require('express')
const router = Router()
const Chat = require('../models/Chat')
const Message = require('../models/Message')
router.post('/getMessages', async (req, res) => {
	try {

		const { chatId } = req.body
		const message = await Message.find({ chatId }).populate({ path: "userId", model: "User" })

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
router.post('/getMessages', async (req, res) => {
	try {

		const { userId } = req.body
		const messages = await Message.find({ userId }).populate({ path: "userId", model: "User" })

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
router.post('/sendMessage', async (req, res) => {
	try {
		const { content, userId, chatId } = req.body
		const message = await new Message({ content, userId, chatId })
		await message.save()
		await Chat.updateOne({ _id: chatId }, { $set: {} })

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
module.exports = router