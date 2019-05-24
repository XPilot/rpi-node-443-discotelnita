// Init sockets
var ioClient = io();

const lsIndicator1 = document.getElementById('ls1');
const lsIndicator2 = document.getElementById('ls2');
const lsIndicator3 = document.getElementById('ls3');

// Emitter function
var emitCommand = function(eventType, group) {
	console.log('emitting to server');
	ioClient.emit(eventType, { group });
}

// Sender function
var sendLightCode = function(code, eventType) {
	var lg1val = document.getElementById('lg1-val').value;
	var lg2val = document.getElementById('lg2-val').value;
	var lg3val = document.getElementById('lg3-val').value;

	switch (code) {
		case 65:
			emitCommand(eventType, lg1val);

			if (eventType === 'keydown') {
				lsIndicator1.classList.add('active');
				return void (0);
			}

			lsIndicator1.classList.remove('active');
			return void(0);
		case 83:
			emitCommand(eventType, lg2val);

			if (eventType === 'keydown') {
				lsIndicator2.classList.add('active');
				return void (0);
			}

			lsIndicator2.classList.remove('active');
			return void(0);
		case 68:
			emitCommand(eventType, lg3val);

			if (eventType === 'keydown') {
				lsIndicator3.classList.add('active');
				return void (0);
			}

			lsIndicator3.classList.remove('active');
			return void(0);
		default:
			return void (0);
	}
};



window.addEventListener('keydown', function(ev) {
	const code = ev.which;

	sendLightCode(code, 'keydown');
});

window.addEventListener('keyup', function(ev) {
	const code = ev.which;

	sendLightCode(code, 'keyup');
});
