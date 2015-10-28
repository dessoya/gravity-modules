'use strict'

var Control		= require('ui/control')

var Edit = Control.inherit({

    noWrap: true,
	params: 'width,password'.split(','),

	onInit: function() {
		this.type = 'text'
		this.width = 100

		Object.defineProperty(this, 'value', {
			// writable: true,
			enumerable: true,
			configurable: true,
  			get: this.get_value.bind(this),
  			set: this.set_value.bind(this)
		})
	},

	get_value: function() {
		var ph = this.getPlaceHolderElement()
		if(ph) {
			return ph.querySelector('.ctrl-edit').value
		}
		return null
	},

	set_value: function(value) {
		var ph = this.getPlaceHolderElement()
		if(ph) {
			ph.querySelector('.ctrl-edit').value = value
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
		return require('Edit.html')({ width: this.width, id: this.id, type: this.getHTMLType() })
	},

	onKeypress: function(element, event) {
	},

	onKeyup: function(element, event) {
	},

	focus: function() {
		var ph = this.getPlaceHolderElement()
		if(ph) {
			setTimeout(function() {
				ph.querySelector('.ctrl-edit').focus();
			}, 1);
		}
	}

})

module.exports = Edit