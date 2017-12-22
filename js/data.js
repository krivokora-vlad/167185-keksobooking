'use strict';

/*
  data.js — модуль, который создает данные
*/

(function () {

  var KEYCODE = {
    'ESC': 27,
    'ENTER': 13
  };


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

  var checkOnOutTime = ['12:00', '13:00', '14:00'];

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

  window.data = {
    fillOffers: fillOffers,
    offers: offers,
    appartType: appartType,
    KEYCODE: KEYCODE,
    checkOnOutTime: checkOnOutTime
  };

})();
