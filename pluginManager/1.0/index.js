'use strict'

var Class		= require('class')

var PluginManager = Class.inherit({

	onCreate: function() {
		this.plugins = [ ]
	},

	fireEvent: function() {

		var args = Array.prototype.slice.call(arguments);
		var event = args.shift();
		var method = 'event_' + event;
		var parent = this.getRootPlugin();
		parent._fireEvent(method, args);

	},

	_fireEvent: function(method, args) {

	    if(method in this) {
	    	this[method].apply(this, args)
	    }

		for(var i = 0, c = this.plugins, l = c.length; i < l; i++) {
			var plugin = c[i]
			plugin._fireEvent(method, args)
		}

	},

	getRootPlugin: function() {
		if('_parentPlugin' in this) {
			return this._parentPlugin
		}
		return this
	},

	addPlugin: function(plugin) {
		this.plugins.push(plugin)
		plugin._parentPlugin = this
	},

	removeAllPlugins: function() {

		for(var i = 0, c = this.plugins, l = c.length; i < l; i++) {
			var plugin = c[i]
			delete plugin._parentPlugin
		}

		this.plugins = [ ]
	}

})

module.exports = PluginManager