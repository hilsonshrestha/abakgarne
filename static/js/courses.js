(function() {
	/*
	 * Initialize history four courses
	 */
	__.historyManager(['courses'], function () {
		var navLi = $('#leftNavContainer li');
		navLi.removeClass('active');
		navLi.children('[href="/' + 'courses' + '"]').parent().addClass('active');
		$('.page').hide();
		$('html, body').scrollTop(0);

		$.get('/courses/teacher/' + __.user._id, function (response) {
			$('#p_courses').show().children('.sub-page').hide();
			$('#p_courses_list').show();
			var e = $('#teacherCourses tbody').empty();
			var createCell = function (html) {
				return $('<td/>', {html: html});
			}
			if (typeof(response) == "object" && response.length) {
				$('#noCourseInfo').hide();
				response.forEach(function (course) {
					e.append($('<tr/>', {
							'data-id': course._id,
							'data-active': course.active
						}).append(createCell('<input type="checkbox">'))
						.append(createCell(course.courseCode))
						.append(createCell(course.courseTitle))
						.append(createCell(moment(course.created).fromNow()))
						.click(function(event) {
							if ($(event.target).is('input')) return;
							var url = '/courses/' + $(this).attr('data-id');
							history.pushState(null, null, url);
							$('#p_courses_id').attr('data-id', $(this).attr('data-id'));
							__.historyManager.locationChange();
						})
					);
				});
			} else {
				$('#noCourseInfo').show();
			}

		});
	});


	// batch manager
	// show list of batches in the
	__.historyManager(['courses', '{courseid}'], function (params) {
		var navLi = $('#leftNavContainer li');
		navLi.removeClass('active');
		navLi.children('[href="/' + 'courses' + '"]').parent().addClass('active');
		// $('#p_courses').show().children('.sub-page').hide();
		// $('#p_courses_id').show();
		// if (params.courseid.length == 24) {
		// 	// valid course id length
		// } else {
		// }


		// $('html, body').scrollTop(0);

		$.get('/courses/' + params.courseid + '/batches', function (response) {
			$('#p_courses').show().children('.sub-page').hide();
			$('#p_courses_id').show();
			var e = $('#teacherCoursesBatches tbody').empty();
			var createCell = function (html) {
				return $('<td/>', {html: html});
			}
			if (typeof(response) == "object" && response.batches.length) {
				$('#noBatchInfo').hide();
				response.batches.forEach(function (batch) {
					e.append($('<tr/>', {
							'data-id': batch._id,
							'data-batchCode': batch.batchCode,
							'data-active': batch.active
						}).append(createCell('<input type="checkbox">'))
						.append(createCell(batch.batchCode))
						.append(createCell(""))
						.append(createCell(moment(batch.created).fromNow()))
						.click(function(event) {
							if ($(event.target).is('input')) return;
							// var url = '/courses/' + params.courseid + '/' + $(this).attr('data-batchCode');
							var url = '/courses/' + params.courseid + '/' + $(this).attr('data-id');
							// console.log(url);
							history.pushState(null, null, url);
							// $('#p_courses_id').attr('data-id', $(this).attr('data-id'));
							__.historyManager.locationChange();
						})
					);
				});


			} else {
				$('#noBatchInfo').show();
			}
				$('#courseInfo .courseCode').text(response.course.courseCode);
				$('#courseInfo .courseTitle').text(response.course.courseTitle);
				$('#courseInfo .description').text(response.course.description);
				$('#courseInfo .teacherName').html('<a href="/user/' + response.teacher._id + '">' + response.teacher.firstname + " " + response.teacher.lastname + '</a>');
				$('#courseInfo .created').text(moment(response.course.created).fromNow());


		});



	});


	// batch manager
	// show list of batches in the
	__.historyManager(['courses', '{courseid}', '{batchid}'], function (params) {
		var navLi = $('#leftNavContainer li');
		navLi.removeClass('active');
		navLi.children('[href="/' + 'courses' + '"]').parent().addClass('active');
		$('#p_courses').show().children('.sub-page').hide();
		$('#p_courses_batch').show();

	});


	(function () {
		/*
		 * Pop up for new course
		 */
		var popUpElem = $('#popUpOfferNewCourse');
		$('#btnNewCourse').click(function () {
			popUpElem.removeClass('hidden');
			$('#frmNewCourse input[name="courseCode"]').focus();
		});

		$('#popUpOfferNewCourse button[name="cancel"]').click(function(event) {
			popUpElem.addClass('hidden');
		});

		/*
		 * New course creation
		 */
		$('#frmNewCourse').submit(function(event) {
			var self = $(this);
			$.post('/courses/newcourse', self.serialize(), function (response) {
				if (response.msg == "success") {
					var url = "/courses/" + response.courseId;
					self.find('input,textarea').val('');
					popUpElem.addClass('hidden');
					__.historyManager.locationChange();
				} else if (response.msg == "field_error") {
					// @TODO: field error validation 
				}
			});
			event.preventDefault();
		});
	})();

	(function () {
		/*
		 * Pop up for new batch
		 */
		var popUpElem = $('#popUpCreateNewBatch');
		$('#btnNewBatch').click(function () {
			popUpElem.removeClass('hidden');
			$('#frmNewBatch input[name="batchCode"]').focus();
		});

		$('#popUpCreateNewBatch button[name="cancel"]').click(function(event) {
			popUpElem.addClass('hidden');
		});

		/*
		 * New batch creation
		 */
		$('#frmNewBatch').submit(function(event) {
			var self = $(this);
			$.post('/courses/' + window.location.pathname.split('/')[2] + '/newbatch', self.serialize(), function (response) {
				console.log(response);
				if (response.msg == "success") {
				// 	var url = "/courses/" + response.courseId;
					self.find('input').val('');
					popUpElem.addClass('hidden');
					__.historyManager.locationChange();
				// } else if (response.msg == "field_error") {
				// 	// @TODO: field error validation 
				}

			});
			event.preventDefault();
		});
	})();


})();