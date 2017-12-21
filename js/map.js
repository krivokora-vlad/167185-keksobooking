'use strict';

var offersTitles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var offersAvatars = ['01', '02', '03', '04', '05', '06', '07', '08'];
var offers = [];
var appartType = {
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало',
};

function getRandomInteger(min, max) {
  return (Math.random() * (max - min) + min).toFixed(0);
}

function arrayShuffle(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}

function randomFromArray(arr) {
  return arr[getRandomInteger(0, arr.length - 1)];
}

function randomDistinctArrayElements(arr) {
  var features = [];
  var i;
  for (i = 0; i < arr.length; i++) {
    if (Math.random() >= 0.5) {
      features.push(arr[i]);
    }
  }
  return features;
}

function generateOffer() {
  var x = getRandomInteger(300, 900);
  var y = getRandomInteger(100, 500);
  return {
    'author': {
      'avatar': 'img/avatars/user' + arrayShuffle(offersAvatars).splice(0, 1) + '.png'
    },
    'offer': {
      'title': arrayShuffle(offersTitles).splice(0, 1),
      'address': x + ', ' + y,
      'price': getRandomInteger(1, 1000000),
      'type': randomFromArray(Object.keys(appartType)),
      'rooms': getRandomInteger(1, 5),
      'guests': getRandomInteger(1, 100),
      'checkin': getRandomInteger(12, 14) + ':00',
      'checkout': getRandomInteger(12, 14) + ':00',
      'features': randomDistinctArrayElements(['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']),
      'description': '',
      'photos': []
    },
    'location': {
      'x': x,
      'y': y
    }
  };
}

function fillOffers(items) {
  var i;
  for (i = 0; i < items; i++) {
    offers.push(generateOffer());
  }
}

fillOffers(8);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

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
    fragment.appendChild(marker);
  }

  mapPins.appendChild(fragment);
}

renderMapElements(offers);

function renderOffer(offerPopup) {
  var offerTemplate = document.querySelector('template').content;
  var offerElement = offerTemplate.querySelector('article.map__card').cloneNode(true);

  var title = offerElement.querySelector('h3');
  var address = title.nextElementSibling.firstElementChild;
  var price = offerElement.querySelector('.popup__price');
  var type = offerElement.querySelector('h4');
  var roomsAndGuests = type.nextElementSibling;
  var checkInCheckout = roomsAndGuests.nextElementSibling;
  var popupFeatures = offerElement.querySelector('.popup__features');
  var description = popupFeatures.nextElementSibling;
  var avatar = offerElement.querySelector('.popup__avatar');

  title.innerText = offerPopup.offer.title;
  address.innerText = offerPopup.offer.address;
  price.innerHTML = offerPopup.offer.price + '&#x20bd;/ночь';
  type.innerHTML = appartType[offerPopup.offer.type];
  roomsAndGuests.innerText = offerPopup.offer.rooms + ' комнаты для ' + offerPopup.offer.guests + ' гостей';
  checkInCheckout.innerText = 'Заезд после ' + offerPopup.offer.checkin + ', выезд до ' + offerPopup.offer.checkout;

  var fragment = document.createDocumentFragment();

  var i;
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
}

renderOffer(offers[0]);
