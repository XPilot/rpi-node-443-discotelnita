const fs = require('fs');
const http = require('http')
const util = require('util');

const io = require('socket.io');

const readFile = util.promisify(fs.readFile);

// Env Variables
const {
	PORT: PORT_STRING = 80,
} = process.env;

const PORT = parseInt(PORT_STRING, 10);

const httpHandler = async (req, res) => {
	const { url } = req;

	try {
		let file = null;

		if (url === '/') {
			file = await readFile(`${__dirname}/index.html`, { encoding: 'utf8'});
		} else {
			file = await readFile(`${__dirname}/${url}`, { encoding: 'utf8'});
		}

		res.writeHead(200);
		res.end(file);
	} catch (err) {
		console.log('err', err);
		res.writeHead(404);
		return res.end('Resource not found');
	}
}

const app = http.createServer(httpHandler);
app.listen(PORT);
// Initialize socket server
const ioClient = io(app);

module.exports = { app, ioClient};