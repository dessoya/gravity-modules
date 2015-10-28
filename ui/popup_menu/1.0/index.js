'use strict'

var Control			= require('ui/control')

var PopupMenu = Control.inherit({

    controllName: 'popupmenu',	

    // onInit: function(x, y, title, items) {
    onInit: function() {
    /*
    	this.x = x;
    	this.y = y;
    	this.title = title;
    	this.items = items;
    	*/

    	this.state = false;

		window.addEventListener('mousedown', this.onClick.bind(this))
    },

    onClick: function(event) {

    	if(!this.state) {
    		return;
    	}

    	var id = 'popupmenu-' + this.id;
    	// console.log(event.target)
    	if( event.target.getAttribute('id') === id || event.target.parentNode.getAttribute('id') === id || event.target.parentNode.parentNode.getAttribute('id') === id) {
    	}
    	else {
    		if(!this.opening) {
    			this.close();
			}
    	}    	
    },

    close: function() {
    	this.state = false;
		document.querySelector('body').removeChild(this.placeHolderElement);
    },

    open: function(x, y, title, items, callback, ctx) {


        if(this.state) {
        	this.close();
        }

        this.ctx = ctx;

    	this.callback = callback;
    	this.state = true;
	
    	this.x = x;
    	this.y = y - 10;
    	this.title = title;
    	this.items = items;

    	var el = document.createElement( 'div' );
    	el.id = 'popupmenu-' + this.id;
    	el.style.position = 'absolute';
    	el.style.visibility = 'hidden';
    	el.style.whiteSpace = 'nowrap';

    	el.style.top = '' + this.y + 'px';
    	el.style.left = '0px';

    	el.className = 'popup-menu';

    	this.placeHolderElement = this.selector = el;

    	document.querySelector('body').appendChild(el);

    	this.rePlace();

    	this.opening = true
		setTimeout(function() {

			if(document.querySelector('body').offsetWidth / 2 < x) {
				el.style.left = '' + ( x - el.offsetWidth + 10) + 'px';
			}
			else {
				el.style.left = '' + (x - 4) + 'px';
			}

			if(document.querySelector('body').offsetHeight / 2 < y) {
				el.style.top = '' + ( y - el.offsetHeight + 10) + 'px';
			}

	    	el.style.visibility = 'visible';
	    	this.opening = false
		}.bind(this), 1);
    },

    install: function() {

    
    	var el = document.createElement( 'div' );
    	el.id = 'popupmenu-' + this.id;
    	el.style.position = 'absolute';

    	/*
    	el.style.top = '' + this.y + 'px';
    	el.style.left = '' + this.x + 'px';
    	*/

    	el.className = 'popup-menu';

    	this.placeHolderElement = this.selector = el;

    	// document.querySelector('body').appendChild(el);

    	// this.rePlace();
    },

	render: function() {

		var html = '';
		
		if(this.title) {

		html += '<div class="title">';
			html += this.title;
		html += '</div>';

		}

		for(var i = 0, c = this.items, l = c.length; i < l; i++) {
			var item = c[i];
			html += '<div mark-hover item-id="' + item.id + '" mark-mousedown="onItemClick(element)" class="item">';
				html += item.title;
			html += '</div>';
		}

		return html;
	},

	onItemClick: function(element) {		
	    var id = element.getAttribute('item-id');
		this.close();
		this.callback(id, this.ctx);
	}
})

module.exports = PopupMenu.create();
