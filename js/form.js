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

  function clearForm() {
    form.reset();
  }

  function errorHandle(message) {
    var el = document.createElement('DIV');
    el.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; color: white; font-size: 20px; position: fixed; left: 0; top: 0; width: 100%; padding: 10px;';
    el.textContent = 'Ошибка отправки формы: ' + message;
    document.body.insertAdjacentElement('afterbegin', el);
  }

  // Validation
  form.addEventListener('submit', function (e) {

    e.preventDefault();

    var errors = [];

    if (address.value === '') {
      invalidInput(address, true);
      errors.push(['address', 'Поле обязательно для заполенения']);
    } else {
      invalidInput(address, false);
    }

    if (title.value.length < 30 || title.value.length > 100) {
      invalidInput(title, true);
      errors.push(['title', 'Заголовок должен быть не менее 30 знаков, но и не более 100']);
    } else {
      invalidInput(title, false);
    }

    if (parseInt(price.value, 10) < price.min || parseInt(price.value, 10) > 1000000) {
      invalidInput(price, true);
      errors.push(['price', 'Цена не должна быть меньше ' + price.min + ' или больше ' + 1000000]);
    } else {
      invalidInput(price, false);
      if (parseInt(price.value, 10) < price.min || isNaN(parseInt(price.value, 10))) {
        price.value = 1000;
      }
    }

    if (errors.length === 0) {
      window.backend.send(new FormData(form), clearForm, errorHandle);
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
