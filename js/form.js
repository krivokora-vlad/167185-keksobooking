'use strict';

/*
  form.js — модуль, который работает с формой объявления
*/

(function () {

  var form = document.querySelector('form.notice__form');
  var address = form.querySelector('#address');
  var title = form.querySelector('#title');
  var price = form.querySelector('#price');
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');
  var type = form.querySelector('#type');
  var roomNumber = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');

  function invalidInput(field, error) {
    if (error) {
      field.style.border = '1px solid red';
    } else {
      field.style.border = 'none';
    }
  }

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


  window.syncFields.synchronizeFields(timein, timeout, window.data.checkOnOutTime, window.data.checkOnOutTime, window.syncFields.syncValues);
  window.syncFields.synchronizeFields(timeout, timein, window.data.checkOnOutTime, window.data.checkOnOutTime, window.syncFields.syncValues);
  window.syncFields.synchronizeFields(type, price, ['flat', 'bungalo', 'house', 'palace'], [0, 1000, 5000, 10000], window.syncFields.syncValueWithMin);
  window.syncFields.synchronizeFields(roomNumber, capacity, ['1', '2', '3', '100'], [[1], [1, 2], [1, 2, 3], [0]], window.syncFields.allowedOptions);


  function disableForm(isDisable) {
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

  window.form = {
    disableForm: disableForm
  };

})();
