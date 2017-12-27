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
      options[i].disabled = allowedOptions.indexOf(parseInt(options[i].value, 10)) === -1;
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
