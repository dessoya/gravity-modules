
var EventEmmiter = require('Class.js').inherit({

	onCreate: function() {
		this.listeners = {};
		this.listenersGen = {};
	},

	on: function(event, listener) {
		if(!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(listener);
	},

	emit: function(event, arg1, arg2, arg3, arg4, arg5, arg6) {
		if(!this.listeners[event]) return;
		var a = this.listeners[event], i = a.length; while(i--)
			a[i](event, arg1, arg2, arg3, arg4, arg5, arg6);
	},

	onGen: function(event, object, method) {
		if(!this.listenersGen[event]) this.listenersGen[event] = [];
		this.listenersGen[event].push(object, method);
	},

	emitGen: function(event) {
		if(!this.listenersGen[event]) return;
		for(var i = 0, c = this.listenersGen[event], l = c.length; i < l; i += 2) {
			var object = c[i], method = c[i + 1];
			object[method](function(err, result) {
				if(err) console.log(err)
			})
		}
	}

});

module.exports = EventEmmiter;