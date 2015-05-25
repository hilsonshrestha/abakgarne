/*
 * NOTIFICATION MANAGER
 */

(function () {
	var iconMapper = {
		'broadcast': 'icon-play',
		'assignments': 'icon-compose',
		'discussion_answered': 'icon-task',
		'discussion_questioned': 'icon-question'
	};
	__.notificationManager = {
		notifications: [],
		unread: 0,
		setUnread: function (unread) {
			this.unread = unread;
			var elem = $('#notificationTotal').text(this.unread);
			unread ==0 ? elem.hide() : elem.show();
		},
		push: function (notification) {
			// {id: 324234, type: 'broadcast', message, countdowon: 233(if broadcast  type), href}
			this.notifications.push(notification);
			$('#notificationContainer ul').prepend(this.htmlify(notification));
			this.setUnread(this.unread + 1);
		},
		getIcon: function (notificationType) {
			return iconMapper[notificationType];
		},
		htmlify: function (notification) {
			var self = this;
			var el1 = $('<li/>');
			var el2 = $('<a/>', {
				href: notification.href,
				class: 'icon ' + self.getIcon(notification.type),
				html: notification.message 
			});
			el2.appendTo(el1);
			return el1;
		}
	};

	var container = $('#notificationSignalContainer');

	$('#notificationButton').click(function(e) {
		container.toggleClass('active');
		__.notificationManager.setUnread(0);
	});

	container.blur(function(event) {
		container.removeClass('active');
	});



	$('#userDropdown').click(function () {
		$('#userContainer').toggleClass('active');
	});

	$('#userContainer').blur(function(event) {
		var self = $(this);
		setTimeout(function() {
			self.removeClass('active');		
		}, 400);
	});



			// 	$('.page').hide();
			// $('#leftNavContainer a').on('click', function (e) {
			// 	history.pushState(null, null,  $(this).attr('href'));
			// 	__.historyManager.locationChange();
			// 	return false;
			// });


})();