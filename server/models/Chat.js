const { Schema, model } = require('mongoose')

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	usersId:{
		type: [Schema.Types.ObjectId],
		required: true,
	}
})

module.exports = model('chat', schema)