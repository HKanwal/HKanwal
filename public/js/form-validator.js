// a new instance for each form
function FormValidator(formSelector, submitCallback) {
	var elements = [];

	// form inputs
	function Element(selector, errorOutputSelector, requirements) {
		this.selector = selector;
		this.errorOutputSelector = errorOutputSelector;
		this.requirements = requirements;

		var element = $(selector);
		var errorOutput = $(errorOutputSelector);

		// check if all reqs met, else return err message
		var check = function() {
			if(requirements["required"] && element.val() === "") {
				return requirements["required"];
			} else if(requirements["email"]) {
				if(!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.exec(element.val())) {
					return requirements["email"];
				}
			} else {
				return;
			}
		}

		this.check = check;
		// TODO: Add multiple input type support
		this.type = element.attr("type");

		// input box highlighting if error
		element.focus(function() {
			errorOutput.hide();
		}).focusout(function() {
			if(check()) {
				element.parent().addClass("has-error");
			} else {
				element.parent().removeClass("has-error");
			}
		});

		this.showError = function(message) {
			element.parent().addClass("hase-error");
			errorOutput.text(message).show();
		};
	}	 

	this.addElement = function(selector, errorOutputSelector, requirements) {
		elements.push(new Element(selector, errorOutputSelector, requirements));
	};

	$(formSelector).submit(function() {
		var valid = true;
		
		// show err msg if err
		for(var element in elements) {
			if(elements[element].check()) {
				$(elements[element].errorOutputSelector).text(elements[element].check()).show();
				$(elements[element].selector).parent().addClass("has-error");
				valid = false;
			}
		}

		// form is valid
		if(valid) {
			submitCallback(elements);
		}

		// prevent form submit
		return false;
	});
}