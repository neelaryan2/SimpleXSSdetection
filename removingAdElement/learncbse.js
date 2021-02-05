function removeAds() {

    let adElements = document.getElementsByClassName("adsbygoogle");

    for (let i = 0; i < adElements.length; ++i) {
    
        // Make the ad disappear!
        adElements[i].setAttribute("style", "display: none !important;");
    }
}


removeAds();