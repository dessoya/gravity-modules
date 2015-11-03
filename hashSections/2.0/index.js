'use strict'

var PluginManager	= require('pluginManager')

class Sections extends PluginManager {

	constructor() {
		super()
		this.sections = { }
		this.re_sections = [ ];
		this.all = [ ];
	}

	addSection(section) {

		this.all.push(section);

		var pattern = section.pattern, patterns;

		if('string' === typeof pattern) patterns = [ pattern ]
		else patterns = pattern;

		for(var i = 0, l = patterns.length; i < l; i++) {

			pattern = patterns[i];

			if(pattern.indexOf('*') !== -1) {				
				var count = 0;
				do {
					var index = pattern.indexOf('*');
					if(index !== -1) {
						count ++;
						pattern = pattern.substr(0, index) + '([A-Za-z\\-\\d]+?)' + pattern.substr(index + 1);
					}
				} while(index !== -1)
				var re = new RegExp('^' + pattern + "$");

				this.re_sections.push({ re: re, count: count, section: section });
			}
			else {
				this.sections[pattern] = section;
			}

		}
	}

	find(sectionName) {
		var s = this.re_sections, l = s.length; while(l--) {
			var item = s[l], a;
			if(a = item.re.exec(sectionName)) {
				var params = [];
				for(var i = 0, c = item.count; i < c; i++) {
					params.push(a[i + 1]);
				}
				return { section: item.section, params: params }
			}
		}
		return null;
	}

	check(sectionName) {
		// console.log('check section ' + sectionName)
		var section = this.find(sectionName);
		if(section) return true;
		return (sectionName in this.sections) ? true : false;
	}

	activate(sectionName) {		

		if(this.sectionName === sectionName) return;
		this.sectionName = sectionName;

		var section = this.find(sectionName), params = []
		if(section) {
			params = section.params
			section = section.section
		}
		else {
			section = this.sectionName in this.sections ? this.sections[this.sectionName] : null;
		}

		if(this.section && this.section.deactivate) this.section.deactivate()
		window.section = this.section = section

		if(section) {
			if(section.gen_activate) {
				section.gen_activate(params, function(err, result) {
					if(err) {
						console.log(err)
					}
				})
			}
			else {
				section.activate(params)
			}
		}
	}

	start() {

		var self = this;
		window.onhashchange = function() {

			var hash = window.location.hash;
			if(hash.length > 0 && hash[0] === '#') hash = hash.substr(1);

			self.fireEvent('onSetHash', hash)

			if(!self.check(hash)) {
				hash = 'main';
				window.location.hash = '';
			}

			// console.log('hash ' + hash)
			self.activate(hash);
		}

		window.onhashchange();

	}

}

/*
Sections.getHash = function() {
	var hash = window.location.hash;
	if(hash.length > 0 && hash[0] === '#') hash = hash.substr(1);
	return hash;
}

Sections.setHash = function(hash) {
	window.location.hash = hash ? (hash.length > 0 ? '#' + hash : hash) : '';
}
*/

Sections.Section = class {
}

module.exports = Sections

