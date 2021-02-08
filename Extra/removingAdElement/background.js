'use strict';

chrome.runtime.onInstalled.addListener(function() {
 	chrome.storage.sync.set({monitor: true}, function() {
		console.log('Form data monitoring is now ON.');
  	});
  	new chrome.declarativeContent.ShowPageAction();
});

function is_malicious(payload) {
	let malicious = false;
	var patterns = [ 
		/<[\s\+]*script[\s\+]*(.*=.*)*[\s\+]*>[^]*<[\s\+]*\/[\s\+]*script[\s\+]*>/im,
	];
	patterns.forEach(pattern => {
		if (pattern.test(payload))
			malicious = true;
	});
	console.log(payload, "->", (malicious ? "cancelled." : "accepted."));
	return malicious;
};

function check_url(details) {
	let malicious_site = false;
	if (details.method == "POST") {
		let formData = details.requestBody.formData;

		if(formData) {
			Object.keys(formData).forEach(key => {
				formData[key].forEach(value => {
					if (is_malicious(value))
						malicious_site = true;
				});
			});
		}
	} else if (details.method == "GET") {
		let url = decodeURI(details.url)
		let idx = url.indexOf('?')

		if (idx != -1) {
			var params = url.substring( idx + 1 ).split('&');
		  	for (var i = 0; i < params.length; i++) {
			    var pair = params[i].split("=");
			    var value = decodeURIComponent(pair[1]);
			    if (is_malicious(value))
					malicious_site = true;
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
		chrome.webNavigation.onCommitted.addListener(checkAdBlocker);

    } else {
		chrome.webRequest.onBeforeRequest.removeListener(check_url);
		chrome.webNavigation.onCommitted.removeListener(checkAdBlocker);
		
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


// ------------------------------------------------------------------------------
 
/*
    This event triggers when the browser has committed to loading a webpage.
    As opposed to e.g. webNavigation.onCompleted, this will start to run early
    so that we can begin to remove ads as soon as possible.
*/
function checkAdBlocker (tab) {
    // Prevents script from running when other frames load
    if (tab.frameId == 0) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {

            // Get the URL of the webpage
            let url = tabs[0].url;
            // Remove unnecessary protocol definitions and www subdomain from the URL
            let parsedUrl = url.replace("https://", "")
                .replace("http://", "")
                .replace("www.", "")

            // Remove path and queries We only want the base domain
            let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
                .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));

            try {
                if (domain.length < 1 || domain === null || domain === undefined) {
                    return;
                } else if (domain == "learncbse.in") {
					runAdBlockerScript();
                    return;
                }
            } catch (err) {
                throw err;
            }

        });
    }
}

function runAdBlockerScript() {
	console.log("detected the website");
	
	// Inject script from file into the webpage
    chrome.tabs.executeScript({
        file: 'learncbse.js'
    });

    return true;
}