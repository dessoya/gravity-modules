
var Class = require('class');

function makeEventFunction(event, event2) {
	if(event2) {
		return function(item, value, control) {
			item.addEventListener(event, function(e) {
				control.execute(value, this, e);
			});
			item.addEventListener(event2, function(e) {
				control.execute(value, this, e);
			});
		}
	}

	return function(item, value, control) {
		item.addEventListener(event, function(e) {
			control.execute(value, this, e);
		});
	}
}

function mkel(props) {

	var el = document.createElement( props.tag );
	if(props['class']) el.className = props['class'];
	if(props.id) el.id = props.id;

	return el;
}

var Control = Class.EventEmmiter.inherit({

    controlId: function() {
    	return this.controllName + '-' + this.id;
    },

	defineProps: function(propsList) {
		propsList = propsList.split(',');
		var props = {}, i = propsList.length; while(i--) {
/*
			var propParams = propsList[i].split(':'), prop = propParams[0];
			for(var j = 1, k = propParams.length; j < k; j++)
				this['propMaker_'+propParams[j]](prop);
*/

			var prop = propsList[i];

			props[prop] = {
				get: this['get_' + prop],
				set: this['set_' + prop]
			}
		}		
		Object.defineProperties(this, props);
	},

	global: {
		idIterator: 1,
		plugins: {}
	},

	globalInterface: {
		addPlugin: function(type, plugin) {
			if(!(this.global.plugins[type])) this.global.plugins[type] = [];
			this.global.plugins[type].push(plugin);
		}
	},

	getProps: function(default_, props) {
		for(var name in default_) {
			if(name in props) continue
			this[name] = default_[name]
		}
		for(var name in props) {
			this[name] = props[name]
		}
	},

	onCreate: function() {
		Class.EventEmmiter.prototype.onCreate.apply(this, [])
		this.id = Control.prototype.global.idIterator ++;
		this.elemId = 'ctrl-' + this.id;
		this.placeHolderElement = null;
		if(this.onInit) {
			this.onInit.apply(this, arguments)
		}
	},

	init: function(params) {
		for(var key in params) {
			this[key] = params[key]
		}
	},

	render: function() {
		return '';
	},

	getPlaceHolderElement: function() {
		return this.placeHolderElement;
	},

	remove: function() {

		if(this.appendedToDocument) {
			this.placeHolderElement.parentNode.removeChild(this.placeHolderElement)
			return
		}

		var ph = this.getPlaceHolderElement();
		if(null === ph) return;

		// ph.parentNode.removeChild(ph);
		if(this.noWrap) {
		}
		else {
			this.placeHolderElement.removeChild(document.getElementById(this.elemId));
		}

		this.placeHolderElement = null;
	},

	bind: function(selector) {
		if('string' === typeof selector) this.selector = selector;
		var el = 'string' === typeof selector ? document.querySelector(selector) : selector;
		this.placeHolderElement = el;
	},

	appendToDocument: function() {
		this.appendedToDocument = true;
		this.placeHolderElement = document.createElement('div')
		document.querySelector('body').appendChild(this.placeHolderElement)
	},

	appendToElement: function(element) {
		this.appendedToDocument = true;
		this.placeHolderElement = document.createElement('div')
		element.appendChild(this.placeHolderElement)
	},

	hide: function() {
	    // console.log('hide')
		if(this.placeHolderElement) {
			this.placeHolderElement.style.display = 'none'
		}
	},

	show: function() {
	    // console.log('show')
		if(this.placeHolderElement) {
			this.placeHolderElement.style.display = 'block'
		}
	},

	place: function(selector, inThisSelector) {
		this.bind(selector);
		var body = this.render();

		if(inThisSelector) {
			this.placeHolderElement.setAttribute('id', this.elemId);
			if(this.controlName) {
				this.placeHolderElement.classList.add('ctrl-' + this.controlName)
			}
			this.placeHolderElement.innerHTML = body;
		}
		else {
			this.placeHolderElement.innerHTML = this.noWrap ? body : '<div id="'+this.elemId+'"'+(this.controlName ? ' class="ctrl-'+this.controlName+'"' : '')+'>' + body + '</div>';
		}

		this.processMarks(this.placeHolderElement.querySelectorAll("*"));
		this.afterPlace(this.placeHolderElement);
	},

	rePlace: function(force) {
		// console.log('rePlace ' + this.controllName)
		if(force && this.selector) this.bind(this.selector)
		if(null === this.placeHolderElement) return;
		this.place(this.placeHolderElement);
	},

	afterPlace: function() {},

	marks: [
		{ name: 'click',
		  process: makeEventFunction('click')
		},
		{ name: 'mouseover',
		  process: makeEventFunction('mouseover')
		},
		{ name: 'mousedown',
		  process: makeEventFunction('mousedown')
		},
		{ name: 'mouseout',
		  process: makeEventFunction('mouseout')
		},
		{ name: 'mousemove',
		  process: makeEventFunction('mousemove')
		},
		{ name: 'keyup',
		  process: makeEventFunction('keyup')
		},
		{ name: 'keypress',
		  process: makeEventFunction('keypress')
		},
		{ name: 'change',
		  process: makeEventFunction('change')
		},
		{ name: 'scroll',
		  process: makeEventFunction('scroll')
		},
		{ name: 'contextmenu',
		  process: makeEventFunction('contextmenu')
		},
		{ name: 'after-place',
		  process: function(item, value, control) {
			control.execute(value, item);
		  }
		},
		{ name: 'mousewheel',
		  process: makeEventFunction('mousewheel', 'DOMMouseScroll')
		},
		{ name: 'hover',
		  process: function(item, value, control) {
			item.addEventListener('mouseover', function(e) {
				this.classList.add('hover')
			})
			item.addEventListener('mouseout', function(e) {
				this.classList.remove('hover')
			})
		  } 
		}
	],

	processMarks: function(items) {
		var p = Control.prototype.global.plugins.DOMScanner ? Control.prototype.global.plugins.DOMScanner : [];
		for(var i = 0, l = items.length; i < l; i++) {
			var item = items[i];
			for(var j = 0, k = this.marks.length; j < k; j++) {
				var mark = this.marks[j];
				var attr = 'mark-' + mark.name, value;
				// if( (value = item.getAttribute(attr)) !== undefined ) {
				if( item.hasAttribute(attr) ) {
					value = item.getAttribute(attr)
					item.removeAttribute(attr);
					mark.process(item, value, this);
				}
				var u = p.length; while(u--) {
					p[u].process(item);
				}
			}
		}
	},

	execute: function(code, element, arg1) {
		var index = 0, args = [], text = '';
		for(var name in this) {
			if(name === 'super') continue;
			var item = this[name];
			if('function' === typeof item) item = item.bind(this);
			args.push(item);
			text += 'var ' + name + '=_a[' + index++ + '];';		
		}
		var func = '_q = function(_a,_c,element,arg1){' + text + 'return eval(_c);}';
		// console.log(func);
		return eval(func)(args, code, element, arg1);
	},

	destroy: function() {
	}

});

module.exports = Control;
