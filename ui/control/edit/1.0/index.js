'use strict'

var Control		= require('ui/control')

var Edit = Control.inherit({

    // noWrap: true,
	params: 'width,password'.split(','),

	onInit: function(params) {
		this.type = 'text'
		this.width = 100

		for(var name in params) {
			this[name] = params[name]
		}

		Object.defineProperty(this, 'value', {
			// writable: true,
			enumerable: true,
			configurable: true,
  			get: this.get_value.bind(this),
  			set: this.set_value.bind(this)
		})
	},

	get_value: function() {
		var ph = this.el
		if(ph) {
			return ph.value
		}
		return null
	},

	set_value: function(value) {
		var ph = this.el
		if(ph) {
			ph.value = value
		}
	},

	getHTMLType: function() {
		var type = this.type
		if(this.password === true || this.password === 'true') {
			type = 'password'
		}
		return type
	},

	render: function() {
		return require('Edit.html')({ id: this.elemId, width: this.width, type: this.getHTMLType() })
	},

	onKeypress: function(element, event) {
	},

	onKeyup: function(element, event) {
	},

	focus: function() {
		var ph = this.el
		if(ph) {
			setTimeout(function() {
				ph.focus();
			}, 1);
		}
	}

})

module.exports = Edit