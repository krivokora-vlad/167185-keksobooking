'use strict';

/*
  card.js — модуль для отрисовки элемента на карточке
*/

(function () {

  function renderOffer(data, offerElement) {
    var title = offerElement.querySelector('h3');
    var address = offerElement.querySelector('h3+p small');
    var price = offerElement.querySelector('.popup__price');
    var type = offerElement.querySelector('h4');
    var roomsAndGuests = offerElement.querySelector('h4+p');
    var checkInCheckout = offerElement.querySelector('p:nth-of-type(4)');
    var popupFeatures = offerElement.querySelector('.popup__features');
    var description = offerElement.querySelector('.popup__features+p');
    var avatar = offerElement.querySelector('.popup__avatar');

    title.textContent = data.offer.title;
    address.textContent = data.offer.address;
    price.innerHTML = data.offer.price + '&#x20bd;/ночь';
    type.textContent = window.data.appartType[data.offer.type];
    roomsAndGuests.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    checkInCheckout.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.offer.features.length; i++) {
      var featureElement = document.createElement('li');
      featureElement.classList.add('feature');
      featureElement.classList.add('feature--' + data.offer.features[i]);
      fragment.appendChild(featureElement);
    }
    popupFeatures.innerHTML = '';
    popupFeatures.appendChild(fragment);

    description.textContent = data.offer.description;

    avatar.src = data.author.avatar;

    return offerElement.innerHTML;

  }

  window.card = {
    renderOffer: renderOffer
  };

})();
