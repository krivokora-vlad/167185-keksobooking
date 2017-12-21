'use strict';

/*
  card.js — модуль для отрисовки элемента на карточке
*/

(function () {

  var mapPins = document.querySelector('.map__pins');

  function onPopupEscPress(e) {
    if (e.keyCode === window.data.KEYCODE['ESC']) {
      window.pin.mapPinActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
      document.querySelector('.map__card.popup').classList.add('hidden');
    }
  }

  function renderOffer(offerPopup) {

    var popups = document.querySelectorAll('.map__card.popup');
    var i;
    for (i = 0; i < popups.length; i++) {
      popups[i].remove();
    }

    var offerTemplate = document.querySelector('template').content;
    var offerElement = offerTemplate.querySelector('article.map__card').cloneNode(true);

    var title = offerElement.querySelector('h3');
    var address = offerElement.querySelector('h3+p small');
    var price = offerElement.querySelector('.popup__price');
    var type = offerElement.querySelector('h4');
    var roomsAndGuests = offerElement.querySelector('h4+p');
    var checkInCheckout = offerElement.querySelector('p:nth-of-type(4)');
    var popupFeatures = offerElement.querySelector('.popup__features');
    var description = offerElement.querySelector('.popup__features+p');
    var avatar = offerElement.querySelector('.popup__avatar');

    title.innerText = offerPopup.offer.title;
    address.innerText = offerPopup.offer.address;
    price.innerHTML = offerPopup.offer.price + '&#x20bd;/ночь';
    type.innerHTML = window.data.appartType[offerPopup.offer.type];
    roomsAndGuests.innerText = offerPopup.offer.rooms + ' комнаты для ' + offerPopup.offer.guests + ' гостей';
    checkInCheckout.innerText = 'Заезд после ' + offerPopup.offer.checkin + ', выезд до ' + offerPopup.offer.checkout;

    var fragment = document.createDocumentFragment();

    for (i = 0; i < offerPopup.offer.features.length; i++) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('feature');
      featureElement.classList.add('feature--' + offerPopup.offer.features[i]);
      fragment.appendChild(featureElement);

    }
    popupFeatures.innerHTML = '';
    popupFeatures.appendChild(fragment);

    description.innerText = offerPopup.offer.description;

    avatar.src = offerPopup.author.avatar;

    mapPins.insertAdjacentHTML('afterend', offerElement.outerHTML);

    document.querySelector('.popup__close').addEventListener('click', function () {
      window.pin.mapPinActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
      document.querySelector('.map__card.popup').classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
    });

    document.addEventListener('keydown', onPopupEscPress);

  }

  window.card = {
    renderOffer: renderOffer
  };

})();
