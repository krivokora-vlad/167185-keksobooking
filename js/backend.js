'use strict';

/*
  backend.js - который экспортирует в глобальную область видимости функции 
  для взаимодействия с удаленным севером через XHR
*/

(function () {

  var URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 4000;
  var HTTP_CODE_SUCCESS = 200;

  function init(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_CODE_SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Error ' + xhr.status);
      }
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  }

  window.backend = {
    get: function (onLoad, onError) {
      var xhr = init(onLoad, onError);
      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    send: function (data, onLoad, onError) {
      var xhr = init(onLoad, onError);
      xhr.open('POST', URL);
      xhr.send(data);
    },
  };

})();
