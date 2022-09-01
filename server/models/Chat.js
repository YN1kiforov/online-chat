const { Schema, model } = require('mongoose')

const schema = new Schema({
	name: {
		type: String,
	},
	usersId:{
		type: [Schema.Types.ObjectId],
		ref: 'User',
		required: true,
	}
})

module.exports = model('chat', schema)