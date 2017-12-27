'use strict';

/*
  pin.js — модуль для отрисовки пина и взаимодействия с ним
*/

(function () {

  var PARSE_INT_RADIX = 10;
  var MAIN_PIN_TOP_OFFSET = 48;

  var MARKER_POSITION_MIN_X = 300;
  var MARKER_POSITION_MAX_X = 900;
  var MARKER_POSITION_MIN_Y = 100;
  var MARKER_POSITION_MAX_Y = 500;

  var MARKERS_LIMIT = 5;

  var lastTimeout = null;
  var DEBOUNCE_TIMEOUT_DEFAULT = 500;

  var mapPins = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var filterForm = document.querySelector('.map__filters');
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var featuresFieldSet = filterForm.querySelector('#housing-features');

  function makeActive(elements, isActive) {
    for (var i = 0; i < elements.length; i++) {
      if (isActive) {
        elements[i].classList.add('map__pin--active');
      } else {
        elements[i].classList.remove('map__pin--active');
      }
    }
  }

  function onPinBind(marker, offer) {
    makeActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
    makeActive(marker, true);
    window.cardModule.hide();
    window.cardModule.show(offer);
  }

  function pinBind(marker, offer) {
    marker.addEventListener('click', function () {
      onPinBind([marker], offer);
    });
  }

  function renderMapElements(offersList) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offersList.length && i < MARKERS_LIMIT; i++) {
      var offer = offersList[i];
      var marker = document.createElement('button');
      marker.style.left = offer.location.x - 4 + 'px';
      marker.style.top = offer.location.y - 40 + 'px';
      marker.className = 'map__pin';
      marker.innerHTML = '<img src="' + offer.author.avatar + '" width="40" height="40" draggable="false">';
      pinBind(marker, offer);
      fragment.appendChild(marker);
    }
    mapPins.appendChild(fragment);
  }

  mainPin.addEventListener('mousedown', function (e) {
    e.preventDefault();

    var startCoords = {
      x: e.clientX,
      y: e.clientY
    };
    var shift = {};
    var markerCoords = {};

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      markerCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y,
      };

      /*
        устранена рваность перемещений маркера
        устранена возможность вылета на пиксель-два за границы
      */
      markerCoords.x = (markerCoords.x < MARKER_POSITION_MIN_X) ? MARKER_POSITION_MIN_X : markerCoords.x;
      markerCoords.x = (markerCoords.x > MARKER_POSITION_MAX_X) ? MARKER_POSITION_MAX_X : markerCoords.x;
      markerCoords.y = (markerCoords.y < MARKER_POSITION_MIN_Y - MAIN_PIN_TOP_OFFSET) ? MARKER_POSITION_MIN_Y - MAIN_PIN_TOP_OFFSET : markerCoords.y;
      markerCoords.y = (markerCoords.y > MARKER_POSITION_MAX_Y - MAIN_PIN_TOP_OFFSET) ? MARKER_POSITION_MAX_Y - MAIN_PIN_TOP_OFFSET : markerCoords.y;

      mainPin.style.left = markerCoords.x + 'px';
      mainPin.style.top = markerCoords.y + 'px';

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.getElementById('address').value = parseInt(mainPin.offsetLeft, PARSE_INT_RADIX) + ', ' + (parseInt(mainPin.offsetTop, PARSE_INT_RADIX) + MAIN_PIN_TOP_OFFSET);
      window.map.init();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function removePins() {
    var pinElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    window.cardModule.hide();
    pinElements.forEach(function (pin) {
      pin.remove();
    });
  }

  function debounce(callback, timeout) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, timeout);
  }


  function filterByType(offer, filter) {
    return (filter.type === offer.offer.type);
  }

  function filterByPrice(offer, filter) {
    var result = true;
    switch (filter.price) {
      case 'middle':
        // 10000 - 50000₽
        if (offer.offer.price < 10000 || offer.offer.price > 50000) {
          result = false;
        }
        break;
      case 'low':
        // до 10000₽
        if (offer.offer.price > 10000) {
          result = false;
        }
        break;
      case 'high':
        // от 50000₽
        if (offer.offer.price < 50000) {
          result = false;
        }
        break;
    }
    return result;
  }

  function filterByRooms(offer, filter) {
    return (parseInt(filter.rooms, 10) === parseInt(offer.offer.rooms, 10));
  }

  function filterByGuests(offer, filter) {
    return (parseInt(filter.guests, 10) === parseInt(offer.offer.guests, 10));
  }

  function filterByFeatures(offer, filter) {
    var result = true;
    filter.features.forEach(function (feature) {
      if (offer.offer.features.indexOf(feature) < 0) {
        result = false;
      }
    });
    return result;
  }

  filterForm.addEventListener('change', function () {

    debounce(function () {
      removePins();

      var filters = {
        'type': filterType.value,
        'price': filterPrice.value,
        'rooms': filterRooms.value,
        'guests': filterGuests.value,
        'features': []
      };

      var selectedFeatures = featuresFieldSet.querySelectorAll('input[type=checkbox]:checked');
      selectedFeatures.forEach(function (feature) {
        filters.features.push(feature.value);
      });

      var offers = window.data.offers;
      var filteredOffers = offers;

      if (filters.type !== 'any') {
        filteredOffers = filteredOffers.filter(function (offer) {
          return filterByType(offer, filters);
        });
      }

      if (filters.price !== 'any') {
        filteredOffers = filteredOffers.filter(function (offer) {
          return filterByPrice(offer, filters);
        });
      }

      if (filters.rooms !== 'any') {
        filteredOffers = filteredOffers.filter(function (offer) {
          return filterByRooms(offer, filters);
        });
      }

      if (filters.guests !== 'any') {
        filteredOffers = filteredOffers.filter(function (offer) {
          return filterByGuests(offer, filters);
        });
      }

      if (filters.features.length > 0) {
        filteredOffers = filteredOffers.filter(function (offer) {
          return filterByFeatures(offer, filters);
        });
      }

      renderMapElements(filteredOffers);
    }, DEBOUNCE_TIMEOUT_DEFAULT);

  });

  window.pin = {
    renderMapElements: renderMapElements,
    makeActive: makeActive
  };

})();
