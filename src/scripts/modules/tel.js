var tels = document.querySelectorAll("input[type='tel']");
tels.forEach(function(tel) {
    mask = new IMask(tel,{
        mask: [{
            mask: '+{7} (000) 000-00-00',
            startsWith: '7',
            lazy: false,
        }, {
            mask: '{8} (000) 000-00-00',
            startsWith: '8',
            lazy: true,
        }, {
            mask: '{8} (000) 000-00-00',
            startsWith: '',
            lazy: false,
        }, ],
        dispatch: function(appended, dynamicMasked) {
            var number = (dynamicMasked.value + appended).replace(/\D/g, '');
            return dynamicMasked.compiledMasks.find(function(m) {
                return number.indexOf(m.startsWith) === 0;
            });
        }
	});
	mask.el.input.addEventListener('blur', function() {
		let isComplete = mask.masked.isComplete;
		if(!isComplete && this.value !== '') {
			this.classList.add('-notEmpty');
		} else {
			this.classList.remove('-notEmpty');
		}
	});
});