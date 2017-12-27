'use strict';

/*
  showCard - Функция должна показывать карточку выбранного жилья по нажатию на метку на карте
*/

(function () {

  var OFFER_TEMPLATE = document.querySelector('template').content;

  // функция скрытия карточки объявления
  function hide() {
    var popups = document.querySelectorAll('.map__card.popup');

    // удалить элементы карточки из дома и оторвать повешенные бинды от вложенных элементов
    for (var i = 0; i < popups.length; i++) {
      var popup = popups[i];
      var closeButton = popup.querySelector('.popup__close');
      closeButton.removeEventListener('click', hide);
      closeButton.removeEventListener('keydown', onClosePressEnter);
      popup.remove();
    }
    window.pin.makeActive(document.querySelectorAll('.map__pin.map__pin--active'), false);

    // отломать глобальные бинды
    document.removeEventListener('keydown', onPressEsc);
  }

  // функция, реагирующая на ESC, пока объявление открыто
  function onPressEsc(keyDownEvt) {
    if (keyDownEvt.keyCode === window.data.KEYCODES['ESC']) {
      hide();
    }
  }

  // функция, реагирующая на ENTER, если в фокусе кнопка закрытия карточки объявления
  function onClosePressEnter(keyDownEvt) {
    if (document.activeElement === keyDownEvt.target && keyDownEvt.keyCode === window.data.KEYCODES['ENTER']) {
      hide();
    }
  }

  // функция отображения карточки объявления
  function show(offer) {

    // генерация карточки
    var offerElement = OFFER_TEMPLATE.querySelector('article.map__card').cloneNode(true);

    offerElement.innerHTML = window.card.renderOffer(offer, offerElement);

    // добавить в дом элемент карточки с данными
    var mapPins = document.querySelector('.map__pins');
    mapPins.insertAdjacentHTML('afterend', offerElement.outerHTML);

    var closeButton = document.querySelector('.popup__close');

    // повесить бинды
    closeButton.addEventListener('click', hide);
    document.addEventListener('keydown', onPressEsc);
    closeButton.addEventListener('keydown', onClosePressEnter);

  }

  // Название Card занято
  window.cardModule = {
    show: show,
    hide: hide
  };

})();
