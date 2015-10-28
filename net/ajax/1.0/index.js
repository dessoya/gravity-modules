'use strict'

var Class			= require('class')

var JSONParser = Class.inherit({
	on200: function(ajax, o) {
		if(o.headers['Content-Type'] && o.headers['Content-Type'].indexOf('application/json') !== -1) {
			var p = null
			try {
				p = JSON.parse(o.answer)
			}
			catch(e) {
				p = null
				o.error = true
			}
			o.answer = p
		}
	}
})

var ParseResponseHeaders = Class.inherit({
	on200: function(ajax, o) {
		var h = ajax.req.getAllResponseHeaders().split(/\r\n/)
		var headers = ajax.headers = o.headers = { }, line, pos
		for(var i = 0, c = h, l = c.length; i < l; i++) {
			line = h[i]			
			if(line.length < 1) continue
			if( (pos = line.indexOf(':')) !== -1) {
				var name = line.substr(0, pos)
				headers[name] = line.substr(pos + 2)
			}
		}
	}
})

var AJAX = Class.inherit({

	onCreate: function(prop, callback) {

	    this.callback	= callback;
	    this.prop		= prop;

		var req = this.req = new XMLHttpRequest();
		req.onreadystatechange = this.onRequest.bind(this);

		var params = {
			url:		prop.url,
			method:		prop.get ? 'GET' : 'POST',
			post:		null
		}

		fireEvent('beforeRequest', this, params, prop)

		req.open(params.method, params.url, true);
    	req.send(params.post);
	},

	onRequest: function() {

	    var req = this.req, callback = this.callback ? this.callback : function(){}
        if (req.readyState == 4) {
			if(req.status == 200) {
				var o = { answer: req.responseText };
				fireEvent('on200', this, o)

				if(o.skip_callback) {
					return
				}

				if(o.error) {
        			callback(o.error, null)
				}
				else {
	        		callback(null, o)
				}
        	}
        	else if(req.status == 0) {
        		callback(this, null)
        	}
		}       	
    }

})

AJAX.plugins = [ ]

AJAX.addPlugin = function(plugin) {
	AJAX.plugins.push(plugin)
}

AJAX.Plugins = {
	ParseResponseHeaders: ParseResponseHeaders.create(),
	JSONParser: JSONParser.create(),
}

function fireEvent(event, a1, a2, a3) {
	for(var i = 0, c = AJAX.plugins, l = c.length; i < l; i++) {
		var p = c[i]
		if(event in p) {
			p[event](a1, a2, a3)
		}
	}
}

module.exports = AJAX

/*

AJAX.addPlugin(require('p').create())

AJAX.create({
	url: asasdasd,
	get: {
		a:1,
		b:2
	}
}, function(err, result) {

})

*/