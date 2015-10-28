
var Class		= require('class')

var WebSocket = window['WebSocket'] || window['MozWebSocket'];

var WSConnection = Class.EventEmmiter.inherit({

	onCreate: function(path, protocol) {

		Class.EventEmmiter.prototype.onCreate.apply(this, [])

		// console.log('onCreate')

		this.path		= path;
		this.protocol	= protocol;
		this.connected	= false;
		this.queue		= [];
		// this.nc_callbacks = { };
	},

	close: function() {
		this.ws.close();
	},

	connect: function() {

		// console.log('connect')
		// console.log(this.path, this.protocol)

		if(this.protocol) {
			this.ws				= new WebSocket(this.path, this.protocol);
		}
		else {
			this.ws				= new WebSocket(this.path);
		}
		this.ws.onopen		= this.onConnect_.bind(this);
		this.ws.onclose		= this.onClose.bind(this);
		this.ws.onerror		= this.onError.bind(this);
		this.ws.onmessage	= this.onPacket.bind(this);
	},

	onConnect_: function() {

		console.log('onConnect_')

	    this.commandIdIterator = 1;
	    this.commandFeedBacks = {};

		this.connected = true;
		for(var i = 0, l = this.queue.length; i < l; i++) {
			this.ws.send(this.queue[i]);
		}
		this.queue = [];
		this.onConnect();
	},

	onPacket: function (packet) {
	    // console.log(packet);
		var message;
        try {
			message = JSON.parse(packet.data);
        } catch (e) {
			try {
				message = eval('('+packet.data+')');
	        } catch (e) {
				message = null;
			}
		}
		if('object' === typeof message && 'command' in message || 'command_id' in message) {
			this.emit('#anyCommands', message);
			if(message.command_id) {
				var callback = this.commandFeedBacks[message.command_id];
				delete this.commandFeedBacks[message.command_id];
				callback(null, message);
			}
			else {
				// console.log('emit ' + message.command)
				this.emit(message.command, message);
			}
		}
		else {
			this.emit('#badPacket', message);
		}
	},
	
	send: function(message) {
	    // if(message.command !== 'ping') {
		    // console.log(message);
		// }
		message = JSON.stringify(message);
		if(this.connected) {
			this.ws.send(message);
		}
		else {
			this.queue.push(message);
		}
	},

	onConnect: function() { this.emit('#connect'); },
	onClose: function() { 
			console.log('onClose')

	this.emit('#close'); 
	},
	onError: function (error) { 

		console.log('onError')
		console.log(error)

		this.emit('#error', error);
	},

	sendWithFeedBack: function(command, callback) {
		var command_id = this.commandIdIterator ++;
		this.commandFeedBacks[command_id] = callback;
		command.command_id = command_id;
		this.send(command);
	}
/*
	, subscribeCommand: function(commandName, callback) {
		
		if(!(commandName in this.nc_callbacks)) {
			this.nc_callbacks[commandName] = [ ];
		}

		this.nc_callbacks[commandName].push(callback);
	}
*/
});

module.exports = WSConnection;
