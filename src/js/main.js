/*
	Stellar by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	$(function() {

		var $window = $(window),
			$body = $('body'),
			$main = $('#main');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Prioritize "important" elements on medium.
		skel.on('+medium -medium', function() {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Nav.
		var $nav = $('#nav');

		if ($nav.length > 0) {

			// Shrink effect.
			$main
				.scrollex({
					mode: 'top',
					enter: function() {
						$nav.addClass('alt');
					},
					leave: function() {
						$nav.removeClass('alt');
					},
				});

			// Links.
			var $nav_a = $nav.find('a');

			$nav_a
				.scrolly({
					speed: 1000,
					offset: function() {
						return $nav.height();
					}
				})
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

					// Deactivate all links.
					$nav_a
						.removeClass('active')
						.removeClass('active-locked');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

				})
				.each(function() {

					var $this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
					if ($section.length < 1)
						return;

					// Scrollex.
					$section.scrollex({
						mode: 'middle',
						initialize: function() {

							// Deactivate section.
							if (skel.canUse('transition'))
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
							$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
							if ($nav_a.filter('.active-locked').length == 0) {

								$nav_a.removeClass('active');
								$this.addClass('active');

							}

							// Otherwise, if this section's link is the one that's locked, unlock it.
							else if ($this.hasClass('active-locked'))
								$this.removeClass('active-locked');

						}
					});

				});

		}

		// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000
		});

	});

})(jQuery);

function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

function initializeClock(id, endtime) {
	var clock = document.getElementById(id);
	var daysSpan = clock.querySelector('#timer-days');
	var hoursSpan = clock.querySelector('#timer-hours');
	var minutesSpan = clock.querySelector('#timer-minutes');
	var secondsSpan = clock.querySelector('#timer-seconds');

	function updateClock() {
		var t = getTimeRemaining(endtime);

		daysSpan.innerHTML = t.days;
		hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
		minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
		secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

		if (t.total <= 0) {
			clearInterval(timeinterval);
		}
	}

	updateClock();
	var timeinterval = setInterval(updateClock, 1000);
}

var deadline = 'September 9, 2018';
initializeClock('timer-div', deadline);


// makes the parallax elements
function parallaxIt() {
	// create variables
	var $fwindow = $(window);
	var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	var $contents = [];
	var $backgrounds = [];

	// for each of content parallax element
	$('[data-type="content"]').each(function(index, e) {
		var $contentObj = $(this);

		$contentObj.__speed = ($contentObj.data('speed') || 1);
		$contentObj.__fgOffset = $contentObj.offset().top;
		$contents.push($contentObj);
	});

	// for each of background parallax element
	$('[data-type="background"]').each(function() {
		var $backgroundObj = $(this);

		$backgroundObj.__speed = ($backgroundObj.data('speed') || 1);
		$backgroundObj.__fgOffset = $backgroundObj.offset().top;
		$backgrounds.push($backgroundObj);
	});

	// update positions
	$fwindow.on('scroll resize', function() {

		$.each($contents, function(index, e) {
			$contents[index].__fgOffset = $contents[index].offset().top;
		});

		$.each($backgrounds, function(index, e) {
			$backgrounds[index].__fgOffset = $backgrounds[index].offset().top;
		});

		scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		$contents.forEach(function($contentObj) {
			var yPos = ($contentObj.__fgOffset - scrollTop) / $contentObj.__speed;

			$contentObj.css('top', yPos);
		})

		$backgrounds.forEach(function($backgroundObj) {
			var yPos = -((scrollTop - $backgroundObj.__fgOffset) / $backgroundObj.__speed);

			$backgroundObj.css({
				backgroundPosition: '50% ' + yPos + 'px'
			});
		});
	});

	// triggers winodw scroll for refresh
	$fwindow.trigger('scroll');
};

parallaxIt();