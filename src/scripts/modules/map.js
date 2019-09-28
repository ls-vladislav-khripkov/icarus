function addMarkers(map, arr, callback = null) {
	var marker;
	var markers = [];

	for (var i = 0; i < arr.length; i++) {
		arr[i].options = arr[i].options ? arr[i].options : {};
		marker = new ymaps.Placemark(
			arr[i].position, {
				iconContent: arr[i].iconContent !== undefined ? arr[i].iconContent : '',
				hintContent: arr[i].text,
				...arr[i].options
			}, {
				iconLayout: 'default#imageWithContent',
				iconImageHref: arr[i].iconImageHref,
				iconImageSize: arr[i].iconImageSize, // размер иконки
				iconImageOffset: arr[i].iconImageOffset !== undefined ? arr[i].iconImageOffset : [-arr[i].iconImageSize[0] / 2, -arr[i].iconImageSize[1]],
				zIndex: arr[i].zIndex,
				hideIconOnBalloonOpen: false,
			}
		);
		marker.events.add('click', function(e){
			var geometry = e.get('target').geometry;
			if(geometry) {
				var a = geometry.getCoordinates();
				myMap.panTo(a, {
					flying: 1
				});
			}
			if(callback !== null) {
				callback(e);
			}
		});
		markers.push(marker);
		map.geoObjects.add(marker);
	}

	map.behaviors.disable('scrollZoom');
	map.behaviors.enable('multiTouch');

	if(window.windowWidth < 769) {
		map.behaviors.disable('drag');
	}

	return markers;
}

ymaps.ready(function() {
	var map = document.getElementById('map');
	var placeholders = [
		{
			position: [44.712603, 37.784642],
			iconLayout: 'default#imageWithContent',
			iconImageHref: 'assets/map/placeholder.svg',
			iconImageSize: [210, 115],
			text: 'ТЦ Черноморский',
			zIndex: 2,
		},
	];

	if(map) {
		myMap = new ymaps.Map(
			"map", {
				center: [44.712603, 37.784642],
				zoom: 15,
				height: 520,
				controls: []
			}
		);
		myMap.behaviors.disable('scrollZoom');
		myMap.behaviors.disable('drag');
		myMap.behaviors.enable('multiTouch');
	}

	addMarkers(myMap, placeholders);
});