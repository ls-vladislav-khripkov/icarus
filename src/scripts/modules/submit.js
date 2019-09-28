function formSerialize(form) {
	var serialized = [];
	var formData = new FormData(form);

	formData.forEach(function (value, key) {
		serialized.push(key + '=' + value);
	})

	return serialized.join('&');
}

export function trySendForm(form, args = {}) {
	let isValid = validation(form);
	if(!isValid) return;

	var form = formSerialize(form);
	var request = new XMLHttpRequest();
	request.open('POST', '/ajax/send.php', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send(form);

	nextSlide();
} 

export function validation(form) {
	var inputs = form.querySelectorAll('input[required]');
	var errors = 0;
	inputs.forEach(function (element) {
		var parent = element.parentNode;
		var hasError = !element.checkValidity();
		if(hasError) {
			errors++;
			parent.classList.add('error_field');
		} else {
			parent.classList.remove('error_field');
		}
	});
	if(errors !== 0) {
		form.querySelector('.error_field input').focus();
		return false;
	} 

	return true;
}

document.querySelectorAll('form').forEach(function (element) {
	element.addEventListener('submit', function (e) {
		e.preventDefault();
		trySendForm(this);
		return false;
	})
});