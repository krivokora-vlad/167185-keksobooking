'use strict';

/*
  pin.js — модуль для отрисовки пина и взаимодействия с ним
*/

(function () {

  function mapPinActive(elements, isActive) {
    var i = 0;
    for (i = 0; i < elements.length; i++) {
      if (isActive) {
        elements[i].classList.add('map__pin--active');
      } else {
        elements[i].classList.remove('map__pin--active');
      }
    }
  }

  function pinBind(marker, offer) {
    marker.addEventListener('click', function () {
      mapPinActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
      mapPinActive([marker], true);
      window.card.renderOffer(offer);
    });
    marker.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.KEYCODE['ENTER']) {
        mapPinActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
        mapPinActive([marker], true);
        window.card.renderOffer(offer);
      }
    });
  }

  var mapPins = document.querySelector('.map__pins');
  function renderMapElements(offersList) {
    var fragment = document.createDocumentFragment();
    var i;
    for (i = 0; i < offersList.length; i++) {
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

  window.pin = {
    renderMapElements: renderMapElements,
    mapPinActive: mapPinActive
  };

  var mainPin = document.querySelector('.map__pin--main');
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
        x: mainPin.offsetLeft,
        y: mainPin.offsetTop
      };

      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';

      if (markerCoords.x < 300) {
        mainPin.style.left = 300 + 'px';
      }
      if (markerCoords.x > 900) {
        mainPin.style.left = 900 + 'px';
      }

      if (markerCoords.y < 100) {
        mainPin.style.top = 100 + 'px';
      }
      if (markerCoords.y > 500) {
        mainPin.style.top = 500 + 'px';
      }

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.getElementById('address').value = parseInt(mainPin.style.left, 10) + ', ' + parseInt(mainPin.style.top, 10);
      window.map.mapInit();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
