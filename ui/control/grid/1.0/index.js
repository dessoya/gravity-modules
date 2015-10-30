'use strict'

var Control		= require('ui/control')

var Grid = Control.inherit({

    controlName: 'grid',
	params: [], // 'width,password'.split(','),

	onInit: function() {
	},

	init: function(params) {

	},

	render: function() {
		return require('Grid.html')({ })
	}
})

module.exports = Grid