(function(w) {

	document.addEventListener('plusready', function() {
		console.log("Immersed-UserAgent: " + navigator.userAgent);
	}, false);

	var immersed = 0;
	var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
	var isiPhoneX = /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375);
	if(ms && ms.length >= 3) {
		immersed = parseFloat(ms[2]);
	}
	w.immersed = immersed;

	if(!immersed) {
		return;
	}
	var t = document.querySelector('header');
	t && (t.style.paddingTop = immersed + 'px', t.style.background = '#FFFFFF', t.style.color = '#FFF',t.style.height = 44+ immersed +'px');
	t = document.querySelector('div.mui-content');
	t && (t.style.marginTop = immersed + 'px');
	
	if(isiPhoneX) {
		t = document.querySelector('nav.mui-bar.mui-bar-tab.indexBottom');
		t && (t.style.paddingBottom = '28px',t.style.height = '78px');
	}

})(window);