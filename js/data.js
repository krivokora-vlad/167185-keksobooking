'use strict';

/*
  data.js — модуль, который создает данные
*/

(function () {

  var KEYCODES = {
    'ESC': 27,
    'ENTER': 13
  };

  var offers = [];

  var appartType = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var checkOnOutTime = ['12:00', '13:00', '14:00'];

  function errorHandle(message) {
    var el = document.createElement('DIV');
    el.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; color: white; font-size: 20px; position: fixed; left: 0; top: 0; width: 100%; padding: 10px;';
    el.textContent = 'Ошибка отправки формы: ' + message;
    document.body.insertAdjacentElement('afterbegin', el);
  }

  function getOffersFromServer(callback) {
    window.backend.get(function (data) {
      window.data.offers = data;
      if (callback !== 'undefined') {
        callback();
      }
    }, function (message) {
      errorHandle(message);
    });
  }

  window.data = {
    getOffersFromServer: getOffersFromServer,
    offers: offers,
    appartType: appartType,
    KEYCODES: KEYCODES,
    checkOnOutTime: checkOnOutTime
  };

})();
