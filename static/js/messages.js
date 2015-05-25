(function () {
	__.historyManager(['messages'], function () {
		var navLi = $('#leftNavContainer li');
		navLi.removeClass('active');
		navLi.children('[href="/' + 'messages' + '"]').parent().addClass('active');
		$('.page').hide();
		$('html, body').scrollTop(0);

		// $.get('/courses/teacher/' + __.user._id, function (response) {
			$('#p_messages').show();//.children('.sub-page').hide();
		// 	$('#p_courses_list').show();
		// 	var e = $('#teacherCourses tbody').empty();
		// 	var createCell = function (html) {
		// 		return $('<td/>', {html: html});
		// 	}
		// 	if (typeof(response) == "object" && response.length) {
		// 		$('#noCourseInfo').hide();
		// 		response.forEach(function (course) {
		// 			e.append($('<tr/>', {
		// 					'data-id': course._id,
		// 					'data-active': course.active
		// 				}).append(createCell('<input type="checkbox">'))
		// 				.append(createCell(course.courseCode))
		// 				.append(createCell(course.courseTitle))
		// 				.append(createCell(moment(course.created).fromNow()))
		// 				.click(function(event) {
		// 					if ($(event.target).is('input')) return;
		// 					var url = '/courses/' + $(this).attr('data-id');
		// 					history.pushState(null, null, url);
		// 					$('#p_courses_id').attr('data-id', $(this).attr('data-id'));
		// 					__.historyManager.locationChange();
		// 				})
		// 			);
		// 		});
		// 	} else {
		// 		$('#noCourseInfo').show();
		// 	}

		// });
	});

	__.friends = {};
	/*
		123: {
				firstname: "asdf",
				lastname: "asdf",
				usertype: "teacher",
				fullname: "adf asdf"
				_id: "123"
			}
		]
	*/

	__.friendsOnline = {
		123:{ 
			_id: 123,
					firstname: "Divesh",
					lastname: "Poudel",
					fullname: "Divesh Poudel"
		}
	};
	//points to the friends object above.

	__.messageManager = {
		messages: [
			{
				you: {
					_id: 123,
					firstname: "Divesh",
					lastname: "Poudel",
					fullname: "Divesh Poudel"
				},
				content: "Hi, Dhiraj Sir. How is the project going.",
				isRead: true,
				created: 1414238355504
			}, 
			{
				you: {
					_id: 11,
					firstname: "Adolf",
					lastname: "Hitler",
					fullname: "Adolf Hitler"
				},
				content: "Hi, This is Adolf Hitler. How is the project going.",
				isRead: false,
				created: 1414238255504
			}
		],
		push: function(newMessage) {
			// push new message to the messages array.
			// If a message from same user exists, TODO:
			// the message will be removed and pushed to the front.
			// otherwise, the message will simply be pushed.
			var message;
			for (var i = 0; i < this.messages.length; i++) {
				message = this.messages[i];
				if (message.you._id == newMessage.you._id) {
					this.message[i] = newMessage;
				} else {
					this.messages.push(newMessage);
				}
			}
		},
		reload: function () {
			// TODO: reload. Make ajax req
			// get latest 20 message.
		},
		loadNext: function () {
			// TODO: load old messages based on offset.
		},
		refresh: function() {
			var parentElem = $('#mMessageListContainer').empty();
			var self = this;
			self.messages.forEach(function (message) {
				parentElem.append(self.createMessageDiv(message));
			});
		},
		createMessageDiv: function (message) {
			var elem = $('<div/>', {
				class: 'message ' + (message.isRead ? "read " : "unread ") + (message.you._id in __.friendsOnline ? "online" : "offline"),
			});

			var profilePictureContainer = $('<div class="profilePictureContainer">');
			profilePictureContainer.append($('<div class="profilePicture"/>').css({
				backgroundImage: "url(/static/img/noprofilepic.png)"
			}));

			var contentWrapper = $('<div class="contentWrapper"/>');
			contentWrapper.append($('<div/>', {
				class: "user",
				text: message.you.fullname
			}));
			contentWrapper.append($('<div/>', {
				class: 'title',
				text: moment(message.created).fromNow()
			}));
			contentWrapper.append($('<div/>', {
				class: 'content',
				text: message.content
			}));
			elem.append(profilePictureContainer);
			elem.append(contentWrapper);
			return elem;
		}

	}

})();
