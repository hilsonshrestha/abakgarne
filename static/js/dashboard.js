(function () {
	/*
	 * Initialize history for dashboard
	 */
	__.historyManager(['dashboard'], function () {
		var navLi = $('#leftNavContainer li');
		navLi.removeClass('active');
		navLi.children('[href="/' + 'dashboard' + '"]').parent().addClass('active');
		$('.page').hide();
		$('html, body').scrollTop(0);
		$('#p_dashboard').show();
	});

})();
