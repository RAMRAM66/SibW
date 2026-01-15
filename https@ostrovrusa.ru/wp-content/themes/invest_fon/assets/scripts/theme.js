jQuery(function($) {

	/* Обработка содержимого */
	if ( $('div.content').length ) {
		var videos = $('div.content').find('iframe, object, embed');
		videos.each(function() {
			$(this).wrap('<div class="video-wrap"><div class="video-item"></div></div>');
		});
	}
	if ( $('div.content').length ) {
		var tablest = $('div.content').parent().find('table').not('.tablepress');
		tablest.each(function() {
			$(this).wrap('<div class="table_standard"></div>');
		});
	}


	$('.content .review_avatar').each(function() {

		var block = $(this), image = block.find('img').first(), parent = image.parents('p');

		block.prepend(image);

		image.addClass('avatar');

		parent.remove();

	});

	$('.row .posts').parents('.col_1_1').addClass('nomargin');


	/* Слайдер */

	if (typeof $.fn.flickity !== 'undefined') {

		$('.posts_slider').each(function() {

			var carousel = $('.inner', this);

			carousel.flickity({
				wrapAround: true,
				prevNextButtons: false,
				pageDots: true,
				adaptiveHeight: false,
				cellSelector: '.slide',
				imagesLoaded: false,
				cellAlign: 'left'
			});

			$('.arrow_l', this).click(function() {
				carousel.flickity('next');
			});

			$('.arrow_r', this).click(function() {
				carousel.flickity('previous');
			});

		});

	}


	/* Переключение вкладок в блоке с рейтингом */

	$('.chart_tabs').each(function() {

		var buttons = $('.tabs_heading span', this), tabs = $('.tabs_content > div', this), wrapper = tabs.parent();

		if (buttons.length > 1) {

			buttons.removeClass('active').first().addClass('active');

			tabs.hide().first().show();

			buttons.click(function() {

				var button = $(this), tab = tabs.eq(button.index());

				tab.show();
				wrapper.css('height', tab.height());
				tab.hide();

				button.addClass('active').siblings().removeClass('active');

				tab.siblings().slideUp(500, function() {
					tab.slideDown(500);
				});

			});

		}

	});


	/* Изменение размера шрифта */

	$('.font').each(function() {

		var size = 18, el, content_size = 18;

		$('.small', this).click(function() {

			content_size = parseInt($(this).parents('.content').css('font-size').replace('px', ''));

			$('.content, .content > div, .content > blockquote, .content h1, .content h2, .content h3, .content h4').each(function() {
				el = $(this);
				size = parseInt(el.css('font-size').replace('px', ''));
				if (content_size > 14) {
					el.css('font-size', size - 1);
				}
			});

		});

		$('.big', this).click(function() {

			content_size = parseInt($(this).parents('.content').css('font-size').replace('px', ''));

			$('.content, .content > div, .content > blockquote, .content h1, .content h2, .content h3, .content h4').each(function() {
				el = $(this);
				size = parseInt(el.css('font-size').replace('px', ''));
				if (content_size < 24) {
					el.css('font-size', size + 1);
				}
			});

		});

	});


	/* Блок Прочту позже */

	$('.post_info .btn').click(function(e) {

		var button = $(this);

		if (button.text() === 'Прочту позже') {
			button.text('Нет времени читать?');
		} else {
			button.text('Прочту позже');
		}

		button.parent().find('.send_post').fadeToggle();

		e.stopPropagation();

		return false;

	});

	$('#site').click(function() {
		$('.send_post').fadeOut();
		$('.post_info .btn').text('Нет времени читать?');
	});

	$('.send_post').click(function(e) {

		e.stopPropagation();

	}).submit(function(e) {

		var form = $(this), el;

		$.ajax({
			url: template.ajaxurl,
			type: 'post',
			dataType: 'json',
			data: form.serialize(),
			success: function(data) {

				$('.error', form).remove();

				$('input, textarea, select', form).removeClass('incorrect');

				if (data['errors']) {
					for (i in data['errors']) {
						el = $('<div class="error">' + data['errors'][i] + '</div>');
						$('[name=' + i + ']', form).addClass('incorrect').parent().after(el);
						el.hide();
						el.slideDown();
					}
				}

				if (data['text']) {
					el = $('<div class="success">' + data['text'] + '</div>');
					form.find('.favorites').before(el);
					el.hide();
					el.slideDown();
					form.reset();
				}

			}

		});

		e.preventDefault();

		return false;

	});


	/* Добавление в закладки */

	$('.post_info .favorites').click(function(e) {

		e.preventDefault();

		var bookmarkURL = window.location.href;
		var bookmarkTitle = document.title;

		if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
			// Mobile browsers
			addToHomescreen({autostart: false, startDelay: 0}).show(true);
		} else if (window.sidebar && window.sidebar.addPanel) {
			// Firefox version < 23
			window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
		} else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
			// Firefox version >= 23 and Opera Hotlist
			$(this).attr({
				href: bookmarkURL, title: bookmarkTitle, rel: 'sidebar'
			}).off(e);
			return true;
		} else if (window.external && ('AddFavorite' in window.external)) {
			// IE Favorite
			window.external.AddFavorite(bookmarkURL, bookmarkTitle);
		} else {
			// Other browsers (mainly WebKit - Chrome/Safari)
			alert('Нажмите CTRL + D для добавления страницы в закладки');
		}

		return false;

	});


	/* Меню */

	$('.menu_btn').click(function() {
		$(this).siblings('ul').slideToggle(300, function() {
			if (this.style.display === 'none') {
				$(this).removeAttr('style');
			}
		});
	});


	/* Форма поиска */

	$('.search_btn').click(function() {
		$('.header_search').slideToggle(300, function() {
			if (this.style.display === 'none') {
				$(this).removeAttr('style');
			}
		});
	});


	/* Плавный переход по ссылкам */

	$('a[href^="#"]').click(function() {

		var element = $($(this).attr('href')), offset = -60;

		if (element.length > 0) {

			$('html, body').stop().animate({
				'scrollTop': (element.offset().top + offset)
			}, 1000);

		}

	});


	$('.page_up').click(function() {
		$('html, body').stop().animate({
			'scrollTop': 0
		}, 1000);
	});


	/* Обработка рейтинга */

	$('.form .rating').each(function() {

		var wrapper = $(this).parent(), input = $('input', wrapper), stars = $('.star > span', wrapper), rating = stars.filter('.active').length;

		stars.each(function(i) {

			var num = i + 1;

			$(this).on('click', function() {
				rating = num;
				stars.removeClass('active').filter(':lt(' + num + ')').addClass('active');
				input.val(num);
			});

			$(this).on('mouseenter', function() {
				stars.removeClass('active').filter(':lt(' + num + ')').addClass('active');
			});

		});

		wrapper.on('mouseleave', function() {
			stars.removeClass('active').filter(':lt(' + rating + ')').addClass('active');
		});

	});


	/* Стилизация форм */

	if (typeof $.fn.styler !== 'undefined') {

		$('select').styler();

	}


	/* Обработка формы комментариев */

	$('.form').submit(function(e) {

		var form = $(this), el;

		$.ajax({
			url: template.ajaxurl,
			type: 'post',
			dataType: 'json',
			data: form.serialize(),
			success: function(data) {

				$('.error', form).remove();

				$('.incorrect', form).removeClass('incorrect');

				if (data['errors']) {
					for (i in data['errors']) {
						el = $('<div class="error">' + data['errors'][i] + '</div>');
						$('[name=' + i + ']', form).addClass('incorrect').after(el);
						el.hide();
						el.slideDown();
					}
				}

				if (data['text']) {
					el = $('<div class="success">' + data['text'] + '</div>');
					form.append(el);
					el.hide();
					el.slideDown();
					form[0].reset();
					load_comments();
				}

			}

		});

		e.preventDefault();

		return false;

	}).each(function(){

		var text = $('textarea', this);

		text.click(function() {
			text.removeClass('active');
			$(this).addClass('active');
		});

	});


	/* Обработка форм ответа, рейтинга и переключения страниц */

	$('.comments').on('click', '.reply', function() {

		var comment = $(this).parents('.comment_inner'), id = comment.data('id'), form = $('#reply_form');

		$('[name="comment_parent"]', form).val(id);

		form.slideUp(300, function() {

			comment.after(form);

			form.slideDown();

		});

	}).on('click', '.plus, .minus', function() {

		var comment = $(this).parents('.comment_inner'), id = comment.data('id'), value = $('.rate .value', comment), num = 1;

		if ($(this).hasClass('minus')) {
			num = -1;
		}

		$.ajax({
			type: "POST",
			data: {
				action: 'comment_rating',
				rating_vote: num,
				nonce: template.nonce,
				comment_id: id
			},
			url: template.ajaxurl,
			dataType: 'json',
			success: function(data) {
				if (data.error) alert(data.error);
				if (data.rating) {
					value.text(data.rating);
				}
			}
		});

	}).on('click', '.pagination > a', function() {

		var page = $(this).data('id');

		$('input[name="page"]').val(page);

		load_comments();

		return false;

	});


	/* Обработка переключения вкладок */

	$('.comment_tabs span').click(function() {

		var order = $(this).data('order');

		$('input[name="order"]').val(order);

		$(this).addClass('active').siblings().removeClass('active');

		load_comments();

	});


	/* Изменение режима фильтрации */

	$('.comment_sort select').change(function() {
		load_comments();
	});


	/* Форма загрузки комментариев */

	function load_comments() {

		var order = $('input[name="order"]').val(), filter = $('.comment_sort select').val(), wrapper = $('.comments_wrapper');

		wrapper.slideUp(1000, function() {

			$.ajax({
				type: "POST", data: {
					action: 'load_comments',
					nonce: template.nonce,
					order: order,
					filter: filter,
					post_id: $('input[name="post_id"]').val(),
					page: $('input[name="page"]').val()
				},
				url: template.ajaxurl,
				dataType: 'html',
				success: function(data) {
					wrapper.html(data).slideDown(1000);
				}
			});

		});

	}





	});


