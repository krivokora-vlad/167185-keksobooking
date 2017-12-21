'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

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

var mapPins = document.querySelector('.map__pins');

function onPopupEscPress(e) {
  if (e.keyCode === ESC_KEYCODE) {
    mapPinActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
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
  type.innerHTML = appartType[offerPopup.offer.type];
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
    mapPinActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
    document.querySelector('.map__card.popup').classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  });

  document.addEventListener('keydown', onPopupEscPress);

}

function pinBind(marker, offer) {
  marker.addEventListener('click', function () {
    mapPinActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
    mapPinActive([marker], true);
    renderOffer(offer);
  });
  marker.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      mapPinActive(document.querySelectorAll('.map__pin.map__pin--active'), false);
      mapPinActive([marker], true);
      renderOffer(offer);
    }
  });
}

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

function disableForm(isDisable) {
  var form = document.querySelector('form.notice__form');
  var formFieldsets = form.querySelectorAll('fieldset');
  var i;
  if (isDisable) {
    document.querySelector('.notice__form').classList.add('notice__form--disabled');
  } else {
    document.querySelector('.notice__form').classList.remove('notice__form--disabled');
  }
  for (i = 0; i < formFieldsets.length; i++) {
    formFieldsets[i].disabled = isDisable;
  }
}
disableForm(true);

function mapInit() {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
  disableForm(false);
  fillOffers(8);
  renderMapElements(offers);
  document.querySelector('.map__pin--main').classList.add('hidden');
}
document.querySelector('.map__pin--main').addEventListener('mouseup', function () {
  mapInit();
});

function invalidInput(field, error) {

  if (error) {
    field.style.border = '1px solid red';
  } else {
    field.style.border = 'none';
  }

}

// Form
var address = document.getElementById('address');
var title = document.getElementById('title');
var price = document.getElementById('price');
var timein = document.getElementById('timein');
var timeout = document.getElementById('timeout');
var type = document.getElementById('type');
var roomNumber = document.getElementById('room_number');
var capacity = document.getElementById('capacity');

// Validation
document.querySelector('form.notice__form').addEventListener('submit', function (e) {
  e.preventDefault();

  if (address.value === '') {
    invalidInput(address, true);
  } else {
    invalidInput(address, false);
  }

  if (title.value.length < 30 || title.value.length > 100) {
    invalidInput(title, true);
  } else {
    invalidInput(title, false);
  }

  if (parseInt(price.value, 10) < 0 || parseInt(price.value, 10) > 1000000) {
    invalidInput(price, true);
  } else {
    invalidInput(price, false);
    if (parseInt(price.value, 10) === 0 || isNaN(parseInt(price.value, 10))) {
      price.value = 1000;
    }
  }
});

address.readOnly = true;

// Form field sync
timein.addEventListener('change', function (e) {
  timeout.value = e.target.value;
});
timeout.addEventListener('change', function (e) {
  timein.value = e.target.value;
});

type.addEventListener('change', function (e) {
  switch (e.target.value) {
    case ('flat'):
      price.min = 0; break;
    case ('bungalo'):
      price.min = 1000; break;
    case ('house'):
      price.min = 5000; break;
    case ('palace'):
      price.min = 10000; break;
    default:
      price.min = 0;
  }
});

function allowedRooms(cap) {
  var capacityOptions = capacity.querySelectorAll('option');
  var i;
  for (i = 0; i < capacityOptions.length; i++) {
    capacityOptions[i].selected = false;
    if (cap.indexOf(parseInt(capacityOptions[i].value, 10)) >= 0) {
      capacityOptions[i].disabled = false;
    } else {
      capacityOptions[i].disabled = true;
    }
  }
  capacity.value = cap[0];
}

roomNumber.addEventListener('change', function (e) {
  switch (e.target.value) {
    case ('1'):
      allowedRooms([1]); break;
    case ('2'):
      allowedRooms([1, 2]); break;
    case ('3'):
      allowedRooms([1, 2, 3]); break;
    case ('100'):
      allowedRooms([0]); break;
    default:
      allowedRooms([0]); break;
  }
});
