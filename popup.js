'use strict';

let changeColor = document.getElementById('changeColor');

function set_state(monitor) {
	let	color = '#FF0000';
	if (monitor) 
		color = '#00FF00';
	changeColor.style.backgroundColor = color;
	changeColor.setAttribute('value', color);
};

chrome.storage.sync.get('monitor', function(data) {
	set_state(data.monitor);
});

changeColor.onclick = function(element) {
	chrome.storage.sync.get('monitor', function(data) {
		let new_monitor = !data.monitor;
		chrome.storage.sync.set({monitor: new_monitor}, function() {
			console.log('Form data monitoring is now', (new_monitor ? 'ON.' : 'OFF.'));
	  	});
	  	set_state(new_monitor);
	});
};