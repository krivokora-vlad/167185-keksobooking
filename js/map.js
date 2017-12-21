'use strict';

/*
  map.js — модуль, который работает с картой. Использует вспомогательные модули:
    card.js — модуль для отрисовки элемента на карточке
    pin.js — модуль для отрисовки пина и взаимодействия с ним
*/

(function () {

  function mapInit() {
    var map = document.querySelector('.map');
    map.classList.remove('map--faded');
    window.form.disableForm(false);
    window.data.fillOffers(8);
    window.pin.renderMapElements(window.data.offers);
    document.querySelector('.map__pin--main').classList.add('hidden');
  }

  window.map = {
    mapInit: mapInit
  };

})();
