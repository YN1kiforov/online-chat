const { Schema, model } = require('mongoose')

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true
	},
	avatarURL: {
		type: String,
	},
	county: {
		type: String,
	},
	city: {
		type: String,
	},
	about: {
		type: String,
	},
	isOnline: {
		type: Boolean ,
	},
})

module.exports = model('User', schema)