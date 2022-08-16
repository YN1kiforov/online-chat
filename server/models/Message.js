const { Schema, model } = require('mongoose')

const schema = new Schema({
	content: {
		type: String,
	},
	chatId:{
		type: Schema.Types.ObjectId,
		required: true,
	},
	userId:{
		type: Schema.Types.ObjectId,
	}
})

module.exports = model('Message', schema)