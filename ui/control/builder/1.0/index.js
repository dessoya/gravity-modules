'use strict'

var Controls = { }

Controls.edit = require('ui/control/edit')
Controls.button = require('ui/control/button')
Controls.grid = require('ui/control/grid')

function readControlParams(element, paramNames) {
	var params = { }

	for(var i = 0, l = paramNames.length; i < l; i ++) {
		var name = paramNames[i]
		if(element.hasAttribute(name) ) {
			params[name] = element.getAttribute(name)
			element.removeAttribute(name)
		}
	}

	return params
}

function build(owner, element) {

    var c = element.querySelectorAll("*")
    for(var i = 0, l = c.length; i < l; i++) {
    	var item = c[i]
		if( item.hasAttribute("control") ) {

			var controlClass = item.getAttribute("control")
			item.removeAttribute("control")

			var controlName= item.getAttribute("name")
			item.removeAttribute("name")

			if(controlClass in Controls) {
				var cc = Controls[controlClass]
				var control = cc.create(readControlParams(item, cc.prototype.params))
				// control.init()
				// control.name = controlName
				owner[controlName] = control
				if(control.events) {
					for(var i1 = 0, c1 = control.events, l1 = c1.length; i1 < l1; i1++) {
						var event = c1[i1]
						var method = 'on_' + controlName + '_' + event
						if(method in owner) {
							control.on(event, owner[method].bind(owner))
						}
					}
				}

				control.place(item)
			}
		}
    }


}

module.exports = {
	build: build
}