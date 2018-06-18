$.fn.activeFormAjaxSubmit = function () {

	this.on('beforeSubmit', function () {
		var form = $(this);
		var button = form.find('input[type="submit"], button[type="submit"]').prop('disabled', true);
		var data = form.data('additionalParams') ? mergeParams(form.serializeAndEncode(), form.data('additionalParams')) : form.serializeAndEncode();
		var jsonResponseOpts = form.data('jsonResponseOpts') ? form.data('jsonResponseOpts') : {};
		$.ajax({
			url: form.attr('action'),
			type: form.attr('method'),
			data: data,
			success: function (json) {
				if (json.hasOwnProperty('errors'))
					form.yiiActiveForm('updateMessages', json.errors);
				else
					processJsonResponse(json, $.extend(true, {
						form: form,
					}, jsonResponseOpts));
			},
			complete: function () {
				button.prop('disabled', false);
				$.preloader().destroy();
			}
		});
		return false;
	});
}