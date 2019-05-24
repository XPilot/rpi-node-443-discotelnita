const rpi433 = require('rpi-433');
require('dotenv').config();

const { ioClient } = require('./http-server');

const LIGHT_CODES = require('./codes.json');

// Env variables
const {
	RECEIVE_PIN: RECEIVE_PIN_STRING = 0, // pin 17
	SEND_PIN: SEND_PIN_STRING = 0, // pin 18
} = process.env;

// Receive / send pins
const RECEIVE_PIN = parseInt(RECEIVE_PIN_STRING, 10); // pin 17
const SEND_PIN = parseInt(SEND_PIN_STRING, 10); // pin 18

// Receiver config
const rfReceiver = rpi433.sniffer({
	pin: RECEIVE_PIN,
	debounceDelay: 100,
});

// Emitter config
const rfEmitter = rpi433.emitter({
	pin: SEND_PIN,
});


// Listen for incoming signals
rfReceiver.on('data', ({code, pulseLength}) => {
	console.log(`Code received from air: ${code}, pulse length: ${pulseLength}`)
});


// Bind socket listeners to transmitters
ioClient.on('connection', (socket) => {
	socket.emit('connection', { connected: 'true' });

  socket.on('keyup', ({  group = 'unknown' }) => {
		const {
			off,
			pulseLength,
		} = LIGHT_CODES[group] || {};

		if (!off || !pulseLength) {
			return void (0);
		}

		sendSignal(off, pulseLength);
	});

	socket.on('keydown', ({ group = 'unknown' }) => {
		const {
			on,
			pulseLength,
		} = LIGHT_CODES[group] || {};

		if (!on || !pulseLength) {
			return void (0);
		}

		sendSignal(on, pulseLength);
	});
});

const sendSignal = (code, pulseLength) => {
	rfEmitter.sendCode(code, { pulseLength }, (error, stdout) => {
  	if (error) {
			console.error(`Sent error occurred: \n ${error}`)
			return void(0);
		}
});
}