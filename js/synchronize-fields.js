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

  function allowedOptions(element, allowed) {
    var options = element.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {
      if (allowed.indexOf(parseInt(options[i].value, 10)) >= 0) {
        options[i].disabled = false;
      } else {
        options[i].disabled = true;
      }
    }
    element.value = allowed[0];
  }

  function synchronizeFields(source, reciver, sourceData, reciverData, callback) {
    source.addEventListener('change', function () {
      if (typeof callback === 'function') {
        callback(reciver, reciverData[sourceData.indexOf(source.value)]);
      }
    });
  }

  window.syncFields = {
    syncValues: syncValues,
    syncValueWithMin: syncValueWithMin,
    allowedOptions: allowedOptions,
    synchronizeFields: synchronizeFields,
  };

})();
