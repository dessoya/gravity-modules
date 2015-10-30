
var Class			= require('class')
  , PluginManager	= require('pluginManager')


// NodeList.prototype.unshift = Array.prototype.unshift;

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

var Control = PluginManager.inherit({

	global: {
		idIterator: 1
	},

	onCreate: function() {
		PluginManager.prototype.onCreate.apply(this, [])
		this.elemId = 'ctrl-' + ( Control.prototype.global.idIterator ++ );
		this.el = null;
		if(this.onInit) {
			this.onInit.apply(this, arguments)
		}
	},

	remove: function() {
		if(this.el) {
			this.el.parentNode.removeChild(this.el)
			this.el = null
		}
	},

	hide: function() {
		if(this.el) {
			this.el.style.display = 'none'
		}
	},

	show: function() {
		if(this.el) {
			this.el.style.display = 'block'
		}
	},

	place: function(selector) {
		if('string' === typeof selector) {
			selector = document.querySelector(selector)
		}		
		this.parentElement = selector		
		selector.innerHTML = this.render()

		this._afterPlace()
	},

	append: function(element) {
		this.parentElement = element
		this.parentElement.innerHTML = this.parentElement.innerHTML + this.render()

		this._afterPlace()
	},

	_afterPlace: function() {
		this.el = document.getElementById(this.elemId)

		var c = this.el.querySelectorAll("*")
		this.processMarks([ this.el ]);
		this.processMarks(c);
		this.afterPlace(this.el);
	},

	afterPlace: function() { },
	render: function() { return '' },

	_marks: { },
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
		{ name: 'mousewheel',
		  process: makeEventFunction('mousewheel', 'DOMMouseScroll')
		},
		{ name: 'after-place',
		  process: function(item, value, control) {
			control.execute(value, item);
		  }
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
		var marks = this._marks
		for(var i = 0, l = items.length; i < l; i++) {
			var item = items[i];
			var atts = item.attributes;
			// console.log(atts, atts.length)
			for(var j = 0, k = atts.length; j < k; j++) {
				var attr = atts[j]
				if(attr) {
					var aname = attr.name
					if(aname.length > 5 && aname.substr(0, 5) === 'mark-' && aname in marks) {
						var mark = marks[aname]
						item.removeAttribute(aname);
						mark.process(item, attr.value, this);
					}
				}
			}
			/*
			for(var j = 0, k = this.marks.length; j < k; j++) {
				var mark = this.marks[j];
				var attr = 'mark-' + mark.name, value;
				if( item.hasAttribute(attr) ) {
					value = item.getAttribute(attr)
					item.removeAttribute(attr);
					mark.process(item, value, this);
				}
			}
			*/
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
	}

});

for(var i = 0, c = Control.prototype.marks, l = c.length; i < l; i++) {
	var m = c[i]
	Control.prototype._marks['mark-' + m.name] = m
}

module.exports = Control;
