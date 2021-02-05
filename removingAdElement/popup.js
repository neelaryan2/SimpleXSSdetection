'use strict';

var checkbox1 = document.getElementById("checkbox1");

function set_state(monitor) {
	checkbox1.checked = (monitor ? 1 : 0);
};

chrome.storage.sync.get('monitor', function(data) {
	set_state(data.monitor);
});

checkbox1.onclick = function(element) {
	console.log("button was clicked.");
	chrome.storage.sync.get('monitor', function(data) {
		let new_monitor = !data.monitor;
		chrome.storage.sync.set({monitor: new_monitor}, function() {
			console.log('Form data monitoring is now', (new_monitor ? 'ON.' : 'OFF.'));
	  	});
	  	set_state(new_monitor);
	});
};