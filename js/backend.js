'use strict';

/*
  backend.js - который экспортирует в глобальную область видимости функции 
  для взаимодействия с удаленным севером через XHR
*/

(function () {

  var URL = 'https://js.dump.academy/keksobooking';

  function init(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 4000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
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
