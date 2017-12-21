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
  allowedRooms([1]);

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
