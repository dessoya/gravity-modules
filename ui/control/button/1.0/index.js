'use strict'

var Control		= require('ui/control')

var Button = Control.inherit({

	params: 'width,caption,name'.split(','),
	// events: 'click'.split(','),

	onInit: function(params) {
		this.width = 100
		// console.log(params)
		for(var name in params) {
			this[name] = params[name]
		}
	},

	onClick: function() {
		// this.emit('click', this)
		// console.log('on_button_' + this.name + '_click')
		this.fireEvent('on_button_' + this.name + '_click')
	},

	render: function() {
		return require('Button.html')({ width: this.width, id: this.elemId, caption: this.caption })
	}

})

module.exports = Button