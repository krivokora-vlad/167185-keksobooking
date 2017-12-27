'use strict';

/*
  form.js — модуль, который работает с формой объявления
*/

(function () {

  var DEFAULT_AVATAR = 'img/muffin.png';

  var form = document.querySelector('form.notice__form');
  var address = form.querySelector('#address');
  var title = form.querySelector('#title');
  var price = form.querySelector('#price');
  var timein = form.querySelector('#timein');
  var timeout = form.querySelector('#timeout');
  var type = form.querySelector('#type');
  var roomNumber = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');
  var formFieldsets = form.querySelectorAll('fieldset');
  var avatar = document.querySelector('#avatar');
  var photoContainer = form.querySelector('.form__photo-container');
  var uploadContainer = form.querySelector('.form__photo-container .upload');
  var images = document.querySelector('#images');

  address.readOnly = true;

  avatar.style.left = 'auto';
  avatar.style.opacity = '0';
  avatar.style.width = '206px';
  avatar.style.height = '70px';

  photoContainer.style.width = 'auto';
  uploadContainer.style.width = '140px';

  images.style.left = 'auto';
  images.style.opacity = '0';
  images.style.width = '140px';
  images.style.height = '70px';

  function markInvalidInput(field, error) {
    field.style.border = (error) ? '1px solid red' : 'none';
  }

  function initFieldsSync(addListner) {
    // Form field sync
    window.syncFields.init(timein, timeout, window.data.checkOnOutTime, window.data.checkOnOutTime, window.syncFields.syncValues, addListner);
    window.syncFields.init(timeout, timein, window.data.checkOnOutTime, window.data.checkOnOutTime, window.syncFields.syncValues, addListner);
    window.syncFields.init(type, price, ['flat', 'bungalo', 'house', 'palace'], [1000, 0, 5000, 10000], window.syncFields.syncValueWithMin, addListner);
    window.syncFields.init(roomNumber, capacity, ['1', '2', '3', '100'], [[1], [1, 2], [1, 2, 3], [0]], window.syncFields.setAllowedOptions, addListner);
  }
  initFieldsSync(true);

  function clearForm() {
    form.reset();
  }

  function resetAvatar() {
    var oldAvatar = document.querySelector('.notice__preview img');
    var newAvatar = oldAvatar.cloneNode(true);
    newAvatar.src = DEFAULT_AVATAR;
    oldAvatar.remove();
    document.querySelector('.notice__preview').appendChild(newAvatar);
  }

  function clearPhotoThumbnails() {
    photoContainer.querySelectorAll('.thumbnail').forEach(function (thumbnail) {
      thumbnail.remove();
    });
  }

  function errorHandle(message) {
    var el = document.createElement('DIV');
    el.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; color: white; font-size: 20px; position: fixed; left: 0; top: 0; width: 100%; padding: 10px;';
    el.textContent = 'Ошибка отправки формы: ' + message;
    document.body.insertAdjacentElement('afterbegin', el);
  }

  function showImagePreview(image, file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function disable(isDisable) {
    if (isDisable) {
      form.classList.add('notice__form--disabled');
    } else {
      form.classList.remove('notice__form--disabled');
    }
    for (var i = 0; i < formFieldsets.length; i++) {
      formFieldsets[i].disabled = isDisable;
    }
  }
  disable(true);

  form.addEventListener('submit', function (e) {

    e.preventDefault();

    var errors = [];

    if (address.value === '') {
      markInvalidInput(address, true);
      errors.push(['address', 'Поле обязательно для заполенения']);
    } else {
      markInvalidInput(address, false);
    }

    if (title.value.length < 30 || title.value.length > 100) {
      markInvalidInput(title, true);
      errors.push(['title', 'Заголовок должен быть не менее 30 знаков, но и не более 100']);
    } else {
      markInvalidInput(title, false);
    }

    if (parseInt(price.value, 10) < price.min || parseInt(price.value, 10) > 1000000 || isNaN(parseInt(price.value, 10))) {
      markInvalidInput(price, true);
      errors.push(['price', 'Цена не должна быть меньше ' + price.min + ' или больше ' + 1000000]);
    } else {
      markInvalidInput(price, false);
    }

    if (!errors.length) {
      window.backend.send(new FormData(form), clearForm, errorHandle);
    }
  });

  avatar.addEventListener('change', function () {
    if (avatar.files && avatar.files[0]) {
      showImagePreview(document.querySelector('.notice__preview img'), avatar.files[0]);
    }
  });

  images.addEventListener('change', function () {
    clearPhotoThumbnails();
    if (images.files.length > 0) {
      for (var i = 0; i < images.files.length; i++) {
        var imageThumnailContainer = document.createElement('div');
        imageThumnailContainer.classList.add('thumbnail');
        imageThumnailContainer.style.border = '1px solid silver';
        imageThumnailContainer.style.borderRadius = '5px';
        imageThumnailContainer.style.height = '100px';
        imageThumnailContainer.style.padding = '5px';
        imageThumnailContainer.style.float = 'left';
        imageThumnailContainer.style.margin = '5px 5px 0px 0';
        var imageThumnail = document.createElement('img');
        imageThumnail.style.maxHeight = '100%';
        showImagePreview(imageThumnail, images.files[i]);
        imageThumnailContainer.appendChild(imageThumnail);
        photoContainer.appendChild(imageThumnailContainer);
      }
    }
  });

  form.addEventListener('reset', function () {
    resetAvatar();
    clearPhotoThumbnails();
    setTimeout(function () {
      initFieldsSync(false);
    }, 100);

  });

  window.form = {
    disable: disable
  };

})();
