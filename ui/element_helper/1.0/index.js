'use strict'

var Class = require('class')

var ElementHelper = Class.inherit({

	onCreate: function(selector) {
		this.selector = selector
    	Object.observe(this, this.onPropChange.bind(this))
	},

	bind: function() {
		this._element = document.querySelector(this.selector)
	},

	onPropChange: function(events) {
		// console.log('ElementHelper.onPropChange')
		// console.log(events)
		for(var i = 0, l = events.length; i < l; i++) {
			var e = events[i]
			switch(e.name) {
			case "innerHTML":
				if(!this._element) {
					continue
				}
				switch(e.type) {
				case "add":
				case "update":
					this._element[e.name] = this[e.name]
					// console.log(e.name)
				}
			default:
				if(e.name.length > 'style_'.length && e.name.substr(0, 'style_'.length) === 'style_') {
					this._element.style[e.name.substr('style_'.length)] = this[e.name]
					// console.log(e.name + ' ' + this[e.name])
				}
			}
		}
		if(this.afterPropChanges) {
			this.afterPropChanges()
		}
	},

	waitUpdate: function(callback) {
		this.afterPropChanges = callback
	}
})

module.exports = ElementHelper