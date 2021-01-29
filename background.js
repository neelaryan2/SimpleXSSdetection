'use strict';

chrome.runtime.onInstalled.addListener(function() {
 	chrome.storage.sync.set({monitor: true}, function() {
		console.log('Form data monitoring is now ON.');
  	});
  	new chrome.declarativeContent.ShowPageAction();
});

function parse_query_string(query) {
  	var vars = query.split("&");
  	var query_string = {};
  	for (var i = 0; i < vars.length; i++) {
	    var pair = vars[i].split("=");
	    var key = decodeURIComponent(pair[0]);
	    var value = decodeURIComponent(pair[1]);
	    if (typeof query_string[key] === "undefined")
      		query_string[key] = [];
  		query_string[key].push(decodeURIComponent(value));
  	}
  	return query_string;
}

function is_malicious(payload) {
	return payload.includes('foo');
};

function check_url(details) {
	let malicious_site = false;
		if (details.method == "POST") {
			let formData = details.requestBody.formData;

			if(formData) {
				Object.keys(formData).forEach(key => {
					formData[key].forEach(value => {
						if (is_malicious(value)) {
							console.log(value, "-> cancelled.");
							malicious_site = true;
						}
					});
				});
			}
		}
		else if (details.method == "GET") {
			let url = decodeURI(details.url)
			let idx = url.indexOf('?')

			if (idx != -1) {
				var params = url.substring( idx + 1 ).split('&');
			  	for (var i = 0; i < params.length; i++) {
				    var pair = params[i].split("=");
				    var key = decodeURIComponent(pair[0]);
				    var value = decodeURIComponent(pair[1]);
				    if (is_malicious(value)) {
						console.log(value, "-> cancelled.");
						malicious_site = true;
					}
			  	}
			}
		}
	if (malicious_site)
		return {cancel : true};
};

function toggleListener(enable) {
    if (enable) {
        chrome.webRequest.onBeforeRequest.addListener(
			check_url, 
			{urls: ["<all_urls>"]},
			["blocking", "requestBody"]
		);
    } else {
        chrome.webRequest.onBeforeRequest.removeListener(check_url);
    }
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace == 'sync' && 'monitor' in changes) {
        toggleListener(changes.monitor.newValue);
    }
});

chrome.storage.sync.get('monitor', function (data) {
    toggleListener(data.monitor);
});