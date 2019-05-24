#!/usr/bin/env node
const args = require('args');

const rpi433 = require('rpi-433');
require('dotenv').config();

const { ioClient } = require('./http-server');

const LIGHT_CODES = require('./codes.json');

// Env variables
const {
	RECEIVE_PIN: RECEIVE_PIN_STRING = 0, // pin 17
	SEND_PIN: SEND_PIN_STRING = 0, // pin 18
	TRANSMITTER_DEBOUNCE: TRANSMITTER_DEBOUNCE_STRING = 150,
} = process.env;

// Define arguments
args
	.option('dryRun', 'Execute commands without actually sending the signal', false)
	.option('transmitterDebounce', 'Set a timeout in miliseconds on how much time should elapse before the next transmission', parseInt(TRANSMITTER_DEBOUNCE_STRING, 10));
const flags = args.parse(process.argv)


// Receive / send pins
const RECEIVE_PIN = parseInt(RECEIVE_PIN_STRING, 10); // pin 17
const SEND_PIN = parseInt(SEND_PIN_STRING, 10); // pin 18

// Transmitter debounce timeout
TRANSMITTER_DEBOUNCE = flags.transmitterDebounce;
let TD_Timeout = null;

// Receiver config
const rfReceiver = rpi433.sniffer({
	pin: RECEIVE_PIN,
	debounceDelay: 100,
});

// Emitter config
const rfEmitter = rpi433.emitter({
	pin: SEND_PIN,
});


// If transmitter is busy, skip the code
let isTransmitting = false;

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
			state,
			pulseLength,
		} = LIGHT_CODES[group] || {};

		if (!off || !pulseLength) {
			return void (0);
		}

		if (state === 'off') {
			return void (0);
		}

		LIGHT_CODES[group].state = 'off';

		sendSignal(off, pulseLength);
	});

	socket.on('keydown', ({ group = 'unknown' }) => {
		const {
			on,
			state,
			pulseLength,
		} = LIGHT_CODES[group] || {};

		if (!on || !pulseLength) {
			return void (0);
		}

		if (state === 'on') {
			return void (0);
		}

		LIGHT_CODES[group].state = 'on';

		sendSignal(on, pulseLength);
	});
});

const sendSignal = (code, pulseLength) => {
	if (isTransmitting) {
		return void (0);
	}

	isTransmitting = true;

	if(flags.dryRun) {
		clearTimeout(TD_Timeout);
		TD_Timeout = setTimeout(() => { isTransmitting = false }, TRANSMITTER_DEBOUNCE);

		console.log(`[DRY-RUN] - Transmitted code: ${code} @ pL: ${pulseLength}`)
		return void (0);
	}

	rfEmitter.sendCode(code, { pulseLength }, (error, stdout) => {
		clearTimeout(TD_Timeout);
		TD_Timeout = setTimeout(() => { isTransmitting = false }, TRANSMITTER_DEBOUNCE)

  	if (error) {
			console.error(`Sent error occurred: \n ${error}`)
			return void(0);
		}
});
}