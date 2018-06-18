$.notifyDefaults({
	type: 'success',
	placement: {
		from: 'top',
		align: 'center'
	},
	delay: 3000
});

$.ajaxSetup({
	dataType: 'json',
	beforeSend: function() {
		$.preloader().show();
	},
	success: function (json) {
		processJsonResponse(json);
	},
	complete: function() {
		$.preloader().destroy();
	},
	error: function (j, s, e) {
		$.preloader().destroy();
		if (s === 'abort')
			return;
		$.notify('Воникли проблемы, попробуйте повторить попытку или обновите страницу', {
			type: 'danger',
			delay: 2000,
			animate: {
				enter: null,
				exit: null
			},
		});
	}
});

$.fn.serializeAndEncode = function() {
	return $.map(this.serializeArray(), function(val) {
		return [val.name, encodeURIComponent(val.value)].join('=');
	}).join('&');
};

$.preloader = function(options) {
	var opts  = $.extend({
		'text': 'Загрузка...',
		'type': 'info'
	}, options);

	this.show = function() {
		this.preload = $.notify(opts.text, {
			type: opts.type,
			delay: 0,
			allow_dismiss: false,
			placement: {
				from: "top",
				align: "right"
			},
			animate: {
				enter: null,
				exit: null
			},
			template: '<div data-notify="container" class="col-xs-5 col-sm-2 alert alert-{0}" role="alert">' +
			'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
			'<span data-notify="message">{2}</span>' +
			'</div>'
		});
		this.preloadOverlay = $('<div class="page-overlay ajax-form-overlay"></div>').appendTo('body');
	}

	this.destroy = function() {
		if (this.hasOwnProperty('preloader'))
			this.preload.close();
		if (this.hasOwnProperty('preloaderOverlay'))
			this.preloadOverlay.remove();
	}

	return this;
}

/**
 * Совершает определённые действия, основываясь на ответе записанном в json-формате
 * @param {Object} json
 * @param {Object} [opts={}]
 */
function processJsonResponse(json, opts) {
	var self = this;
	if (!json)
		return false;
	opts = $.extend(true, {
		notOptions: {
			settings: {
				onClose: json.redirect ?
					function () {
						window.location.href = json.redirect;
					}
					:
					null,
			}
		},
		form: null,
	}, opts);

	if (json.message) {
		var type = json.message.hasOwnProperty('type') ? json.message['type'] : 'success';
		var text = json.message.hasOwnProperty('text') ? json.message['text'] : '';
		if (!isArray(json.message)) {
			text = json.message;
		}

		var mesOpts = $.extend(true, opts.notOptions, {
			options: {
				message: text
			},
			settings: {
				type: type
			}
		});

		$.notify(
			mesOpts['options'],
			mesOpts['settings']
		);
	}

	if (json.formErrors) {
		var formErrors = json.formErrors;
		var formErrorsOpts = $.extend(true, opts.notOptions, {
			options: {},
			settings: {
				type: 'danger',
			}
		});
		if (!isArray(formErrors) && typeof formErrors !== 'object') {
			formErrors = [json.formErrors];
		}
		$.each(formErrors, function (key, value) {
			if (opts.form && opts.form.data('yiiActiveForm')) {
				opts.form.yiiActiveForm('updateAttribute', key, value);
			}
			formErrorsOpts['options']['message'] = value;
			$.notify(
				formErrorsOpts['options'],
				formErrorsOpts['settings']
			);
		});
	}

	if (json.update) {
		var updateElements = json.update;
		if (!isArray(updateElements)) {
			updateElements = [json.update];
		}
		var updateOpts = $.extend(true, {
			place: null,
			type: 'inner',
			filter: null,
			after: null,
		}, opts.updateOptions);

		setTimeout(function () {
			for (var key in updateElements) {
				var item = updateElements[key];
				var type = item['type'] ? item['type'] : updateOpts['type'];
				var $place = item['place'] ? $(item['place']) : updateOpts['place'];
				var content = item['content'] ? item['content'] : item;
				var filter = item['filter'] ? item['filter'] : updateOpts['filter'];
				var after = item['after'] ? item['after'] : updateOpts['after'];
				if ($place) {
					if (filter) {
						var $content = $(content).filter(filter);
						content = $content[0].outerHTML;
					}
					if (type == 'inner') {
						$place.html(content);
					}
					else {
						$place[0].outerHTML = content;
					}
				}
				if (after) {
					after($place, self);
				}
			}
		}, 0);
	}

	if (json.redirect) {
		window.location.href = json.redirect;
	}

	if (json.closeModal) {
		$('.modal').modal('hide');
	}

	if (json.resetForm && opts.form) {
		opts.form[0].reset();
	}
}

function isArray(what) {
	return Object.prototype.toString.call(what) === '[object Array]';
}

function parseUrl(url) {
	var index = url.indexOf('?');
	var params = '';
	if (index !== -1) {
		params = url.substring(index + 1);
		url = url.substring(0, index);
	}
	return {url: url, params: params};
}

function addParamsToUrl(url, params) {
	var parsed = parseUrl(url);
	return parsed['url'] + '?' + mergeParams(parsed['params'], params);
}

/**
 * Приводит из объекта параметров в строку (key1=value1&key2=value2)
 * @param {Object} params - Объект параметров {key1:value1,key2:value2}
 * @param {Boolean} [decode=true] - Если true, то все атрибуты будут раскодированы с помощью ф-ции decodeURIComponent()
 * @returns {String}
 */
function paramsToString(params, decode) {
	decode = decode || false;
	var string;
	if (decode)
		string = decodeURIComponent($.param(params));
	else
		string = $.param(params);
	return string;
}

function paramsToObject(query) {
	if (query == '') return null;
	var hash = {};
	var vars = query.split("&");

	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		var k = decodeURIComponent(pair[0]);
		var v = decodeURIComponent(pair[1]);

		// If it is the first entry with this name
		if (typeof hash[k] === "undefined") {

			if (k.substr(k.length - 2) != '[]')  // not end with []. cannot use negative index as IE doesn't understand it
				hash[k] = v;
			else {
				if (typeof hash[k.substr(0, k.length - 2)] === "undefined")
					hash[k.substr(0, k.length - 2)] = [];
				hash[k.substr(0, k.length - 2)].push(v);
			}

			// If subsequent entry with this name and not array
		} else if (typeof hash[k] === "string") {
			hash[k] = v;  // replace it

			// If subsequent entry with this name and is array
		} else {
			hash[k.substr(0, k.length - 2)].push(v);
		}
	}
	return hash;
}

/**
 * Объеденяет параметры, заменяя все параметры первого аргумента, на второй, конечные параметры приводятся к типу, который был послан первым аргументом
 * @param {String|Object} params
 * @param {String|Object} params2
 * @returns {String|Object}
 */
function mergeParams(params, params2) {
	if (!params)
		params = {};
	if (!params2)
		params2 = {};
	var type = typeof params === 'object' ? 'object' : 'string';
	var type2 = typeof params2 === 'object' ? 'object' : 'string';
	if (type === 'string') {
		params = paramsToObject(params);
	}
	if (type2 === 'string') {
		params2 = paramsToObject(params2);
	}
	for (var key in params2) {
		params[key] = params2[key];
	}
	if (type === 'string')
		return paramsToString(params);
	else
		return params;
}

function scrollToElement(element, speed) {
	if (typeof speed === 'undefined')
		speed = 1000;
	$('html, body').animate({
		scrollTop: element.offset().top
	}, speed);
}

$(document).ready(function () {
	if ($('.notify').length > 0) {
		$('.notify').each(function () {
			var t = $(this);
			$.notify(t.html(), {
				'type': t.data('type'),
			});
		});
	}
	$('.ajax-link').on('click', function(e) {
		e.preventDefault();
		var t = $(this);
		$.ajax({
			url: t.attr('href'),
		});
	});
	$('[data-scroll-to]').click(function() {
		scrollToElement($($(this).data('scroll-to')));
	});
});