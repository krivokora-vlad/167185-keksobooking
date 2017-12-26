'use strict';

/*
  synchronize-fields.js - связывающий поля между собой таким образом, чтобы логика изменения 
  значения зависимого поля находилась в функции обратного вызова
*/

(function () {

  function syncValues(element, value) {
    element.value = value;
  }

  function syncValueWithMin(element, value) {
    element.min = value;
  }

  function setAllowedOptions(element, allowedOptions) {

    var options = element.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {

      /*
      предложенный вариант не подошёл, так как indexOf возвращает не булевое значение,
      а индекс найденного элемента:
      для первого элемента - будет 0 (false)
      если элемент не найден - будет -1 (true)
      */
      if (allowedOptions.indexOf(parseInt(options[i].value, 10)) >= 0) {
        options[i].disabled = false;
      } else {
        options[i].disabled = true;
      }

    }
    element.value = allowedOptions[0];
  }

  function syncFeild(source, reciver, sourceData, reciverData, callback) {
    if (typeof callback === 'function') {
      callback(reciver, reciverData[sourceData.indexOf(source.value)]);
    }
  }

  function init(source, reciver, sourceData, reciverData, callback, addListner) {
    syncFeild(source, reciver, sourceData, reciverData, callback);
    if (addListner) {
      source.addEventListener('change', function () {
        syncFeild(source, reciver, sourceData, reciverData, callback);
      });
    }
  }

  window.syncFields = {
    syncValues: syncValues,
    syncValueWithMin: syncValueWithMin,
    setAllowedOptions: setAllowedOptions,
    init: init,
  };

})();
