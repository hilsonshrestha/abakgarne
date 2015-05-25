/*
 * HISTORY MANAGER
 * This script uses HTML5 history api.
 * The URL of the page changes without actually refreshing the page.
 */
(function() {
	var sequence = [
		// {path: [], fn: function() {}};
	];

	var hm = function (path, fn, callback) {
		sequence.push({
			path: path,
			fn: fn
		});
		if (callback) callback();
	};

	hm.locationChange = function () {
		var l = window.location.pathname.split('/');
		var params = {}; // object of parameters  
		for (var i = 0; i < sequence.length; i++) {
			var seq = sequence[i], match = true;
			for (var j = 0; j < l.length - 1; j++) {
				if (/^{.+}$/.test(seq.path[j]) && l[j + 1]) {
					params[seq.path[j].substring(1, seq.path[j].length - 1)] = l[j + 1];
					l[j + 1] = seq.path[j];
				}
				if (l[j + 1] != seq.path[j]) {
					match = false;
					break;
				}
			}
			if (match == true) {
				seq.fn(params);
				return;
			}
		}
	};

	hm.init = function () {
		__.historyManager.locationChange();
	};

	__.historyManager = hm; //make the function available globally.

	window.addEventListener('popstate', function(e) {
		__.historyManager.locationChange(e);
	});

})();