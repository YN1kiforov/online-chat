const express = require('express')
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
const fs = require('fs');
const multer = require('multer');
const http = require('http');


const server = http.createServer(app);
app.use(cors())
app.use(express.json())

app.use('', require('./routes/auth.js'))
app.use('', require('./routes/chat.js'))
app.use('', require('./routes/message.js'))
app.use('', require('./routes/user'))

app.get('/', (req, res) => { res.send('Вроде d') });

const io = require("socket.io")(server, {
	cors: {
		origin: '*',
	}
});

const port = process.env.PORT ||  3001

const { MONGO_URI } = process.env
mongoose.connect(MONGO_URI || 'mongodb+srv://admin:admin@cluster0.xvhkn1b.mongodb.net/?retryWrites=true&w=majority')
	.then(() => console.log(`DB has been connected`))
	.catch(e => console.log(`DB error: ${e}`))

io.on('connection', (socket) => {

	console.log(`connect ${socket?.client?.id}`)
	socket.on('chat message', (data) => {
		io.emit('chat message', data)
	})
	socket.on('notification', (data) => {
		console.log("notification")
		socket.broadcast.emit('notification', data)
	})
	socket.on('disconnect', (data) => {
		console.log(`disconnect ${socket?.client?.id}`)
	})
});

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file?.originalname);
	},
});
const upload = multer({ storage });


app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), async (req, res) => {
	res.json({
		url: `/uploads/${req.file?.originalname}`,
	});
});

server.listen(port, () => {
	console.log('Server has been started');
})
