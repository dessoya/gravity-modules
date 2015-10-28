'use strict'

var Control		= require('ui/control')

var Button = Control.inherit({

    noWrap: true,
	params: 'width,caption'.split(','),
	events: 'click'.split(','),

	onInit: function() {
		this.width = 100
	},

	onClick: function() {
		this.emit('click', this)
	},

	render: function() {
		return require('Button.html')({ width: this.width, id: this.id, caption: this.caption })
	}

})

module.exports = Button