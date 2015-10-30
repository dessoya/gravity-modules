'use strict'

var Class			= require('class')
  , Builder			= require('ui/control/builder')
  , PluginManager	= require('pluginManager')

var Dialog = PluginManager.inherit({

    onCreate: function() {
    	PluginManager.prototype.onCreate.apply(this, [])
    },

	open: function() {
		
		var el = this.el = document.createElement('div')
		el.className = 'ctrl-dialog'
		el.innerHTML = require('Dialog.html')()
		document.querySelector('body').appendChild(el)

		var inner = this.inner = el.querySelector('.inner')
		this.installElements(inner)

		// spawn controls
		Builder.build(this, inner)


		inner.style.width = inner.childNodes[0].offsetWidth + 'px'
		inner.style.margin = ((el.offsetHeight - inner.childNodes[0].offsetHeight - 20) / 2) + 'px auto'

		inner.style.visibility = 'visible'	
	},

	installElements: function(el) {

	},

	close: function() {
		document.querySelector('body').removeChild(this.el)
	}

})

module.exports = Dialog