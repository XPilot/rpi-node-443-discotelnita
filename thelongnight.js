#!/usr/bin/env node
const rpi433 = require('rpi-433');
require('dotenv').config();


const LIGHT_CODES = require('./codes.json');

// Env variables
const {
	RECEIVE_PIN: RECEIVE_PIN_STRING = 0, // pin 17
	SEND_PIN: SEND_PIN_STRING = 0, // pin 18
	TRANSMITTER_DEBOUNCE: TRANSMITTER_DEBOUNCE_STRING = 150,
} = process.env;

const SEND_PIN = parseInt(SEND_PIN_STRING, 10); // pin 18

// Emitter config
const rfEmitter = rpi433.emitter({
	pin: SEND_PIN,
});

let i = 0;
const lights = Object.keys(LIGHT_CODES);

const darknessFalls = () => {
	if (i >= lights.length) {
		i = 0;
	}

	const {
		off,
		pulseLength,
	} = LIGHT_CODES[lights[i]];

	if (!off) {
		return null;
	}

	rfEmitter.sendCode(off, { pulseLength }, (error, stdout) => {
		i += 1;

		setTimeout(() => darknessFalls(), 200);

  	if (error) {
			console.error(`Sent error occurred: \n ${error}`)
			return void(0);
		}
	});
};

darknessFalls();


// while (true === true ) {};
