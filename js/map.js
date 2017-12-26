'use strict';

/*
  map.js — модуль, который работает с картой. Использует вспомогательные модули:
    card.js — модуль для отрисовки элемента на карточке
    pin.js — модуль для отрисовки пина и взаимодействия с ним
*/

(function () {

  var mapInited = false;

  function init() {
    if (!mapInited) {
      var map = document.querySelector('.map');
      map.classList.remove('map--faded');
      window.form.disable(false);
      window.data.getOffersFromServer(function () {
        window.pin.renderMapElements(window.data.offers);
      });
      mapInited = true;
    }
  }

  window.map = {
    init: init
  };

})();
