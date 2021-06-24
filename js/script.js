'use strict'
//Для бургера
$(document).ready(function () {
  $('.header__burger').click(function (event) {
    $('.header__burger, .header__menu').toggleClass('active')
    $('body').toggleClass('lock')
  })
})

$(document).ready(function () {
  $('.header-bottom-menu__link').click(function (event) {
    if ($('.header__burger, .header__menu').hasClass('active')) {
      $('.header__burger, .header__menu').removeClass('active')
      $('body').removeClass('lock')
    }
  })
})

//Большая картинка
function ibg() {
  let ibg = document.querySelectorAll('.ibg')
  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('img')) {
      ibg[i].style.backgroundImage =
        'url(' + ibg[i].querySelector('img').getAttribute('src') + ')'
    }
  }
}

ibg()

// Слайдер
new Swiper('.image-slider', {
  //Параллакс
  // parallax: true,
  // speed: 2000,
  //Стрелки
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  //Навигация
  //Буллеты, текущее положение, прогрессбар
  pagination: {
    el: '.swiper-pagination',
    //Буллеты
    clickable: true,
    dynamicBullets: true,
  },
  autoHeight: false,
  loop: true,

  // effect: 'fade',
  // fadeEffect: {
  //   crossFade: true,
  // },
})

//Попапы
const popupLinks = document.querySelectorAll('.popup-link')
const body = document.querySelector('body')
const lockPadding = document.querySelectorAll('.lock-padding')

let unlock = true

const timeout = 800

if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index]
    popupLink.addEventListener('click', function (e) {
      const popupName = popupLink.getAttribute('href').replace('#', '')
      const curentPopup = document.getElementById(popupName)
      popupOpen(curentPopup)
      e.preventDefault()
    })
  }
}

const popupCloseIcon = document.querySelectorAll('.close-popup')
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index]
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup'))
      e.preventDefault()
    })
  }
}

function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open')
    if (popupActive) {
      popupClose(popupActive, false)
    } else {
      bodyLock()
    }
    curentPopup.classList.add('open')
    curentPopup.addEventListener('click', function (e) {
      if (!e.target.closest('.popup__content')) {
        popupClose(e.target.closest('.popup'))
      }
    })
  }
}

function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open')
    if (doUnlock) {
      bodyUnLock()
    }
  }
}

function bodyLock() {
  const lockPaddingValue =
    window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px'
  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index]
      el.style.paddingRight = lockPaddingValue
    }
  }
  body.style.paddingRight = lockPaddingValue
  body.classList.add('lock')

  unlock = false
  setTimeout(function () {
    unlock = true
  }, timeout)
}

function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index]
        el.style.paddingRight = '0px'
      }
    }
    body.style.paddingRight = '0px'
    body.classList.remove('lock')
  }, timeout)

  unlock = false
  setTimeout(function () {
    unlock = true
  }, timeout)
}

document.addEventListener('keydown', function (e) {
  if (e.which == 27) {
    const popupActive = document.querySelector('.popup.open')
    popupClose(popupActive)
  }
})
;(function () {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (css) {
      var node = this
      while (node) {
        if (node.matches(css)) return node
        else node = node.parentElement
      }
      return null
    }
  }
})()
;(function () {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector
  }
})()

//Отправка формы

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form')
  form.addEventListener('submit', formSend)

  async function formSend(e) {
    e.preventDefault()

    let error = formValidate(form)

    let formData = new FormData(form)
    formData.append('image', formImage.files[0])

    if (error === 0) {
      form.classList.add('_sending')
      //AJAX запрос
      let response = await fetch('sendmail.php', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        let result = await response.json()
        alert(result.message)
        formPreview.innerHTML = ''
        form.reset()
        form.classList.remove('_sending')
      } else {
        alert('Ошибка!')
        form.classList.remove('_sending')
      }
    } else {
      alert('Заполните обязательные поля!')
    }
  }

  function formValidate(form) {
    let error = 0
    let formReq = document.querySelectorAll('._req')

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index]
      formRemoveError(input)

      if (input.classList.contains('_email')) {
        if (emailTest(input)) {
          formAddError(input)
          error++
        }
      } else if (
        input.getAttribute('type') === 'checkbox' &&
        input.checked === false
      ) {
        formAddError(input)
        error++
      } else {
        if (input.value === '') {
          formAddError(input)
          error++
        }
      }
    }
    return error
  }

  function formAddError(input) {
    input.parentElement.classList.add('_error')
    input.classList.add('_error')
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove('_error')
    input.classList.remove('_error')
  }
  //Функция для проверки email
  function emailTest(input) {
    return !/^\w+([\.-]?\w)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value)
  }

  //Функция превью картинки
  //Получаем input file в переменную
  const formImage = document.getElementById('formImage')
  //Получаем div для превью в переменную
  const formPreview = document.getElementById('formPreview')
  //Слушаем изменения в input file
  formImage.addEventListener('change', () => {
    uploadFile(formImage.files[0])
  })

  function uploadFile(file) {
    //Проверка типа файла
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Разрешены только изображения!')
      formImage.value = ''
      return
    }
    //Проверка размера файла(<2 Мб)
    if (file.size > 2 * 1024 * 1024) {
      alert('Файл должен быть менее 2 МБ!')
      return
    }

    var reader = new FileReader()
    reader.onload = function (e) {
      formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`
    }
    reader.onerror = function (e) {
      alert('Ошибка')
    }
    reader.readAsDataURL(file)
  }
})

//Аккордион
function accordion() {
  const elements = document.querySelectorAll('.gallery-body-item-body')
  for (const element of elements) {
    element.addEventListener('click', () => {
      const child = element.childNodes
      if (child[3].classList.contains('box--active')) {
        child[3].classList.remove('box--active')
        child[1].classList.remove('active')
      } else {
        child[3].classList.add('box--active')
      }
    })
  }
}
accordion()

function showAnimation() {
  const elements = document.querySelectorAll('.gallery-body-item-body__title')
  for (const element of elements) {
    element.addEventListener('click', () => {
      if (element.classList.contains('active')) {
        element.classList.remove('active')
      } else {
        element.classList.add('active')
      }
    })
  }
}
showAnimation()
