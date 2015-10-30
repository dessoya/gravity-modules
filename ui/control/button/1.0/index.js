'use strict'

var Control		= require('ui/control')

var Button = Control.inherit({

	params: 'width,caption'.split(','),
	// events: 'click'.split(','),

	onInit: function(params) {
		this.width = 100
		for(var name in params) {
			this[name] = params[name]
		}
	},

	onClick: function() {
		// this.emit('click', this)
	},

	render: function() {
		return require('Button.html')({ width: this.width, id: this.elemId, caption: this.caption })
	}

})

module.exports = Button