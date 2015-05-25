/*
 * HISTORY MANAGER
 * This script uses HTML5 history api.
 * The URL of the page changes without actually refreshing the page.
 */
(function() {
	var navLi = $('#leftNavContainer li');

	// plage historyManager object in the global variable __
	__.historyManager = {

		/*
		 * simulates url change.
		 */
		locationChange: function () {
			// get the pathname and split it to form an array.
			var l = window.location.pathname.split('/');
			navLi.removeClass('active');
			navLi.children('[href="/' + l[1] + '"]').parent().addClass('active');
			$('.page').hide();
			$('html, body').scrollTop(0);

			// show page based on the url pathname
			if (l[1] == 'dashboard') {
				$('#p_dashboard').show();
			} else if (l[1] == 'courses' && l[2] != undefined) {
				$('#p_courses').show().children('.sub-page').hide();
				$('#p_courses_id').show();
				if (l[2].length == 24) {

				}
			} else if (l[1] == 'courses' && l[2] == undefined) {
				console.log(l[2]);
				// return;
				$.get('/courses/teacher/' + __.user._id, function (response) {
					$('#p_courses').show().children('.sub-page').hide();
					$('#p_courses_list').show();
					// console.log(response);
					// return;
					var e = $('#teacherCourses tbody').empty();
					var createCell = function (html) {
						return $('<td/>', {html: html});
					}
					if (typeof(response) == "object" && response.length) {
						$('#noCourseInfo').hide();
						response.forEach(function (course) {
							e.append($('<tr/>', {
								'data-url': course._id,
								'data-active': course.active
							}).append(createCell('<input type="checkbox">'))
							.append(createCell(course.courseCode))
							.append(createCell(course.courseTitle))
							.append(createCell(moment(course.created).fromNow()))
							.click(function(event) {
								var url = '/courses/' + $(this).attr('data-url');
								history.pushState(null, null,  url);
								__.historyManager.locationChange();
							})
							);
						});
					} else {
						$('#noCourseInfo').show();
					}

				});
			} else if (l[1] == 'calendar') {
				$('#p_calendar').show();
			} else if (l[1] == 'messages') {
				$('#p_messages').show();
			} else if (l[1] == 'assignments') {
				$('#p_assignments').show();
			} else if (l[1] == 'people') {
				$('#p_people').show();
			} else if (l[1] == 'mynotes') {
				$('#p_myNotes').show();
			} else if (l[1] == 'sharednotes') {
				$('#p_sharedNotes').show();
			} else if (l[1] == 'about') {
				$('#p_about').show();
			} else if (l[1] == 'help') {
				$('#p_help').show();
			}
		},

		/*
		 * Disables all the links from the leftNavContainer to
		 * simulate url change.
		 */
		initPageLinks: function () {
			$('.page').hide();
			$('#leftNavContainer a').on('click', function (e) {
				history.pushState(null, null,  $(this).attr('href'));
				__.historyManager.locationChange();
				return false;
			});
		}
	};

	$(document).ready(function() {
		__.historyManager.initPageLinks();
		window.addEventListener('popstate', function(e) {
			__.historyManager.locationChange(e);
		});
		// if ($.browser.mozilla) {__.locationChange();}
		__.historyManager.locationChange();
	});
})();
