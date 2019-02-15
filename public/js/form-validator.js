// a new instance for each form
// TODO: Refactor
function FormValidator(formSelector, submitCallback) {
	var elements = [];

	function Element(selector, errorOutputSelector, requirements) {
		this.selector = selector;
		this.errorOutputSelector = errorOutputSelector;
		this.requirements = requirements;
		// TODO: Add multiple input type support
		this.type = element.attr("type");

		var element = $(selector);
		var errorOutput = $(errorOutputSelector);

		var check = function() {
			if(requirements["required"] && element.val() === "") {
				return requirements["required"];
			} else {
				return;
			}
		}

		this.check = check;

		element.focus(function() {
			errorOutput.hide();
		}).focusout(function() {
			if(check()) {
				element.parent().addClass("has-error");
			} else {
				element.parent().removeClass("has-error");
			}
		});
	}	 

	this.addElement = function(selector, errorOutputSelector, requirements) {
		elements.push(new Element(selector, errorOutputSelector, requirements));
	};

	$(formSelector).submit(function() {
		var valid = true;

		for(var element in elements) {
			if(elements[element].check()) {
				$(elements[element].errorOutputSelector).text(elements[element].check()).show();
				$(elements[element].selector).parent().addClass("has-error");
				valid = false;
			}
		}

		if(valid) {
			submitCallback();
		}

		return false;
	});
}