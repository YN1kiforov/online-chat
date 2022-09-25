const {Router} = require('express')
const router = Router()
const Chat = require('../models/Chat')
router.post('/findAllUserChat', async (req, res) => {
	try {
		const { userId } = req.body
		const data = await Chat.find({ usersId: userId }).sort({ updatedAt: -1 }).populate({ path: "usersId", model: "User" })
		data ? res.status(200).json({
			message: `Чат найден`,
			data: data || [],
		})
			: res.status(400).json({
				message: "Не получилось создать чат"
			})
	}
	catch (e) {
		console.log(e)
		res.status(400).json({ message: `Ошибка при поиске чата: ${e}` })
	}
})
router.post('/createChat', async (req, res) => {
	try {
		const { name, usersId } = req.body;
		if (name.length === 0) {
			throw Error
		}
		const chat = await new Chat({ name, usersId, isDialog: false, lastActivity: Date.now })

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
router.post('/createDialog', async (req, res) => {
	try {
		const { usersId } = req.body;

		const isDialogExist = Boolean(await Chat.findOne({ usersId }))
		if (isDialogExist) {
			return res.status(400).json({ message: `Такой чат был уже создан` })
		}
		const dialog = await new Chat({ name: "", usersId, isDialog: true, lastActivity: Date.now })
		await dialog.save()
		dialog ? res.status(200).json({
			message: `Чат успешно создан`,
			users: usersId,
			status: 200,
		})
			: res.status(400).json({
				message: "Не получилось создать чат"
			})
	}
	catch (e) {
		console.log(e)
		res.status(400).json({ message: `Ошибка при cоздании чата: ${e}` })
	}
})
router.post('/changeChatName', async (req, res) => {
	try {
		const { chatId, name } = req.body;
		await Chat.updateOne({ _id: chatId }, { $set: { name } })
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})
router.post('/deleteDialog', async (req, res) => {
	try {
		const { chatId } = req.body;
		await Chat.deleteOne({ _id: chatId })
	}
	catch (e) {
		res.status(400).json({ message: `Ошибка: ${e}` })
	}
})
module.exports = router