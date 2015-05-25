/*
 * SEARCH MANAGER
 * This script initializes search text input element.
 * On up or down key press, suggested results are highlighted.
 * TODO: AJAX FOR ACTUAL SEARCH WHEN DATABASE IS SETUP.
 */

(function () {
	var txtSearch = $('#searchText'),
		suggestionContainer = $('#searchSuggestionContainer'),
		focused = false,
		index = 0,
		searchTextVal = "";

	var hideshowtest = function () {
		txtSearch.val().length == 0 ? suggestionContainer.hide() : suggestionContainer.show();
	};

	txtSearch.keyup(function (e) {
		hideshowtest();
		var searchLi = $('#searchSuggestions li:visible:not(.info)').removeClass('hover');
		var length = searchLi.length;
		if (e.keyCode == 38) {
			index -= 1;
			if (index < 0) index = length;
		} else if (e.keyCode == 40) {
			index = (index + 1) % (length + 1);
		} else {
			searchTextVal = txtSearch.val();
		}

		// on key up or down.
		if (e.keyCode == 38 || e.keyCode == 40) {
			if (index != 0) {
				var el = searchLi.eq(index - 1).addClass('hover');
				txtSearch.val(el.text());
			} else {
				txtSearch.val(searchTextVal);
			}
		}
	}).focusin(hideshowtest);

	$('#searchContainer').focusout(function (e) {
		focused = false;
		setTimeout(function() {
			if (!focused) suggestionContainer.hide();
		}, 100)
	}).focusin(function (e) {
		focused = true;
	});

	// $('#searchContainer').blur(function(e) {
	// 	suggestionContainer.fadeOut(200);
	// });

	$('#searchSuggestionHeaders li').mouseenter(function(e) {
		var currentTab = $(this).attr('data-tab');
		var bg = $(this).css('background-color');
		index = 0;
		$('#searchSuggestionType').text(currentTab);
		suggestionContainer.css({
			backgroundColor: bg
		});
		if (currentTab == 'all') {
			$('#searchSuggestions li').not('.info').stop().slideDown();
		} else {
			$('#searchSuggestions li').not('.info').stop().slideUp();
			$('#searchSuggestions li[data-tabPage="'+currentTab+'"]').stop().slideDown();
		}
	});
})();