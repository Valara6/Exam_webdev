'use sctrict';
//-------------------------------------------------Ссылка----------------------------------------------------------

const mainUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/`;

//-------------------------------------------------2GIS Доступ к API не дали, жадины((((----------------------------------------------------------
let map;

DG.then(function () {
  map = DG.map('map', {
    center: [55, 75],
    zoom: 13
  });

  DG.marker([55, 75]).addTo(map).bindPopup('Вы кликнули по мне!');
});

let getRequestMainTable = async function (url, method) {
  if (method == 'GET') {
    return await fetch(url, {

    });

  }
};


//--------------------------------------------------Обработчик всех возможных запросов на сервер----------------------------------------------------------
async function requests(url, data, method) {
  if (method == "POST") {
    return await fetch(url, {
      method: method,
      body: data
    })
      .then(Response => Response.json())
      .catch((e) => console.log("Error in " + method));
  } else if (method == "GET") {
    return await fetch(url)
      .then(Response => Response.json())
      .catch((e) => console.log("Error in " + method));
  } else if (method == "PUT") {
    return await fetch(url, {
      method: method,
      body: data
    })
      .then(Response => Response.json())
      .catch((e) => console.log("Error in " + method));
  } else if (method == "DELETE") {
    return await fetch(url, {
      method: method,
      body: data
    })
      .then(Response => Response.json())
      .catch((e) => console.log("Error in " + method));
  }
}

//--------------------------------------------------Таблица маршрутов----------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
function fillTable(data) {
  let tableBody = document.querySelector('.fillbody');
  let template = document.querySelector('.template-row');
  tableBody.textContent = "";
  if (data == "netdanix") {
    return
  }
  for (let i = 0; i < data.length; i++) {
    let clonedRow = template.content.cloneNode(true);
    let tr = clonedRow.querySelector("#id-tr");
    tr.setAttribute('data-id', `${JSON.stringify(data[i].id)}`);
    let route = clonedRow.querySelector('.route');
    let desc = clonedRow.querySelector('.desc');
    let mainObjects = clonedRow.querySelector('.mainObjects');

    route.textContent = data[i].name;
    desc.textContent = data[i].description;
    mainObjects.textContent = data[i].mainObject;

    tableBody.appendChild(clonedRow);
  }

}
let parse = [];
function parseData(data) {
  parse = [];
  currentPage = 0;
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (result.length == 3) {//число отображаемых блоков
      parse.push(result);
      result = [];
    }
    else {
      result.push(data[i])
    }
  }
  parse.push(result);
  updateContent();

}

let currentPage = 0;
let pagBtns = document.querySelector('.pagination-btn');

pagBtns.addEventListener('click', paginationBtnActived);

function paginationBtnActived(event) {
  if (event.target.textContent === "Далее") {
    if (currentPage < parse.length - 1) {
      currentPage++;
      updateContent();
    }
  } else if (event.target.textContent === "Назад") {
    if (currentPage > 0) {
      currentPage--;
      updateContent();
    }
  } else
    updateButtonsState();

}

function updateContent() {

  fillTable(parse[currentPage]);
}
// ---------------------------------Кнопки вперед-назад для пагинации------------------------------------ 
function updateButtonsState() {
  let nextBtn = document.querySelector('.btn-next');
  let prevBtn = document.querySelector('.btn-prev');

  if (currentPage === 0) {
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.classList.remove('disabled');
  }

  if (currentPage === parse.length - 1) {
    nextBtn.classList.add('disabled');
  } else {
    nextBtn.classList.remove('disabled');
  }
}
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

//Отображение таблицы гидов
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
function getGidTable(id) {

  let cur_url = new URL(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=b75c34ac-b7e6-4ac3-a115-bdd91e9a09fc`);
  getRequestMainTable(cur_url, 'GET')
    .then((data) => {
      return data.json()
    })
    .then(data => { fillGidTable(data); fillSelectlang(data) }
    )
    .catch(error => console.error(`Something went wrong: ${error}`))

}
//   Определение правильного слова для времени
function plural(number, titles) {
  let cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

let declension = ['год', 'года', 'лет'];
//-------------------------------------------------
let BdForLang = new Set();
function fillSelectlang(data) {
  let sessionDb = new Set();

  for (let i = 0; i < data.length; i++) {
    sessionDb.add(data[i].language);
  }

  let selectLang = document.querySelector('.lang-gid');


  selectLang.innerHTML = "";


  let header = document.createElement('option');
  header.setAttribute("disabled", true);
  header.setAttribute("selected", true);
  header.textContent = "Выбрать язык";
  selectLang.appendChild(header);

  for (let lang of sessionDb) {
    if (BdForLang.has(lang)) {
      console.log(lang)
    } else {
      BdForLang.add(lang);
    }
  }

  BdForLang.forEach(value => {
    let newOption = document.createElement('option');
    newOption.value = value;
    newOption.textContent = value;
    selectLang.append(newOption);
  })
}

function fillGidTable(data) {
  let tableBody = document.querySelector('.gid-fillbody');
  let template = document.querySelector('.template-row-gid');

  for (let i = 0; i < data.length; i++) {
    let clonedRow = template.content.cloneNode(true);

    let id = clonedRow.querySelector('.id-git-route');
    let Fio = clonedRow.querySelector('.FIO');
    let language = clonedRow.querySelector('.language');
    let workExperience = clonedRow.querySelector('.workExperience');
    let PricePerHour = clonedRow.querySelector('.PricePerHour');

    id.textContent = data[i].id;
    id.setAttribute('data-route-id', data[i].route_id);
    Fio.textContent = data[i].name;
    let pluralDetect = plural(data[i].workExperience, declension);
    workExperience.textContent = data[i].workExperience + ` ${pluralDetect}`;
    language.textContent = data[i].language;
    PricePerHour.textContent = data[i].pricePerHour + " ₽";

    tableBody.appendChild(clonedRow);
  }
}


function DeleteGid(routeId, method) {
  let table = document.querySelector(".gid-fillbody");
  let currentRouteId = table.querySelectorAll(".id-git-route")



  for (const route of currentRouteId) {

    let route2 = route.getAttribute('data-route-id');

    if (route2 == routeId) {
      route.closest('tr').remove();
    }
  }


}


// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

function saveToSessionStorage(data) {

  sessionStorage.setItem("data", JSON.stringify(data));



}
function getMainTable() {
  let url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=b75c34ac-b7e6-4ac3-a115-bdd91e9a09fc';
  getRequestMainTable(url, 'GET')
    .then((data) => {
      return data.json()
    })
    .then(data => {
      parseData(data); addHint(data);

      saveToSessionStorage(data)
    }
    )
    .catch(error => console.error(`Something went wrong: ${error}`))
}

//--------------------------------------------------Поиск маршрута----------------------------------------------------------
let filterBtn = document.querySelector('.search-btn');
function searchFromBtn() {
  let inputValue = document.querySelector('#input-datalist').value;
  let data = JSON.parse(sessionStorage.getItem('data'));
  if (inputValue == "") {
    console.log("No input presented");
    fillTable(data);
  }
  else {
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].name == inputValue) {
        newData.push(data[i]);
      }
    }
    if (newData.length == 0) {
      setTimeout(() => alert("По вашему запросу ничего не найдено. Плак-плак"), 250);
    }
    else {
      fillTable(newData);
    }
  }
}
filterBtn.addEventListener('click', searchFromBtn)
function addHint(data) {
  let getData = document.querySelector('#routes-list');
  for (let i = 0; i < data.length; i++) {
    let string = document.createElement('option');
    string.textContent = data[i].name;
    getData.append(string);
  }
}
//--------------------------------------------------Выбор маршрута----------------------------------------------------------
let chosenRoute = new Set();
document.querySelector('.fillbody').addEventListener('click', function (event) {
  // Проверка клика по кнопке
  if (event.target.tagName === 'BUTTON') {
    let row = event.target.closest('tr');
    let dataId = row.getAttribute('data-id');
    if (chosenRoute.has(dataId)) {
      DeleteGid(dataId, 'deluseroute');
      chosenRoute.delete(dataId);

      if (chosenRoute.size == 0) {
        let delElem = document.querySelector('.chosen-gids');
        delElem.classList.remove('d-none');
      }

    } else {
      chosenRoute.add(dataId);
      if (chosenRoute.size > 0) {
        let delElem = document.querySelector('.chosen-gids');
        delElem.classList.add('d-none');


      }
      getGidTable(dataId);
    }

  }

});
// ------------------------------------------------Выбор языка для поиска гида----------------------------------------------------------- 
let body = document.querySelector('.gid-fillbody');
let elems;
function hideElement(element) {
  if (!element.classList.contains('d-none')) {
    element.classList.add('d-none');
  }
}

function showElement(element) {
  let delElem = document.querySelector('.chosen-gids');
  delElem.classList.add('d-none')
  if (element.classList.contains('d-none')) {
    element.classList.remove('d-none');
  }
}
document.querySelector('.lang-gid').addEventListener('change', (e) => {
  let value = e.target.value;
  elems = body.querySelectorAll('.gid-table');
  let foundResults = false;  // Флаг для проверки нахождения гида по языку
  for (let i = 0; i < elems.length; i++) {
    let langGid = elems[i].querySelector('.language').textContent;
    if (langGid === value) {
      showElement(elems[i]);
      foundResults = true;
    } else {
      hideElement(elems[i]);
    }
  }

  // Если нет результатов
  if (!foundResults) {
    console.log('Нет результатов для выбранного языка.');
    let delElem = document.querySelector('.chosen-gids');
    delElem.classList.remove('d-none')
  }
});


//--------------------------------------------------------------------------------------------------------

//--------------------------Модальное окно при выборе гида------------------------------------------------

function getRouteNameById(data) {
  let local = JSON.parse(sessionStorage.getItem('data'));
  for (let i = 0; i < local.length; i++) {
    if (local[i].id == data) {
      return local[i].name;
    }
  }
}
let globalPrice = 0;
document.querySelector('.gid-fillbody').addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    let row = e.target.closest('tr');
    // --------------------------------------------получение данных из строки-------------------------------------------------
    let gidId = row.querySelector('.id-git-route');
    let routeId = gidId.getAttribute('data-route-id');
    let gidName = row.querySelector('.FIO');
    let routeName = getRouteNameById(Number(routeId));
    // --------------------------------------------Обновление и сброс для каждой страницы-------------------------------------------------
    let duration = document.querySelector(".one");
    duration.selected = true;
    document.querySelector('.excursion-start').value = "";
    document.querySelector('#flexCheckDefault').checked = false;
    let peopleCount = document.querySelector('.people-amount');
    peopleCount.value = 1;
    let gidPrice = row.querySelector(".PricePerHour");
    // --------------------------------------------получение данных из модального окна -------------------------------------------------
    let fioField = document.querySelector('.gid-name');
    fioField.textContent = gidName.textContent;
    let routeField = document.querySelector('.excursion-name');
    routeField.textContent = routeName;
    let nadbavka = document.querySelector('.option-discount');
    nadbavka.textContent = 0 + " ₽";
    let price = document.querySelector('.excursion-price');
    price.textContent = gidPrice.textContent;
    globalPrice = parseInt(gidPrice.textContent);

  }
});
// Опции
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------

function conditionOfModalForm() {
  //---------------DATE-------------------
  function addMonths(date, months) {
    let newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  let dateInput = document.querySelector('.datepicker');
  let today = new Date();
  let todayString = today.toISOString().split('T')[0];
  let endDate = addMonths(today, 3);
  let endDateString = endDate.toISOString().split('T')[0];
  dateInput.setAttribute("value", todayString);
  dateInput.setAttribute("min", todayString);
  dateInput.setAttribute("max", endDateString);
}
// ------------------------------------------------Расчет цены за экскурсию---------------------------------------------------------- 
function changePrice(sum, nadbavka) {
  let guideServiceCost = document.querySelector('.excursion-price');
  guideServiceCost.textContent = sum + " ₽";

  let nadbavkaElement = document.querySelector('.option-discount');
  nadbavkaElement.textContent = nadbavka + " ₽";
}

function isHoliday(date) {
  const holidays = [
    new Date('2024-03-08'), // Международный женский день
    new Date('2024-05-01'), // Праздник труда
    new Date('2024-05-09'), // День Победы
    new Date('2024-06-12'), // День России
  ];
  for (const holiday of holidays) {
    if (date.toISOString().split('T')[0] == holiday.toISOString().split('T')[0] || date.getDay() == 6 || date.getDay() == 0) {
      console.log('Сегодня праздничный день!');
      return true;
    }
  }
  return false;
}
function hourToMinute(hour) {
  let arr = hour.split(":");
  return Number(arr[0] * 60) + Number(arr[1]);
}
function isMorning(time) {
  let timeStart = new Date('2000-01-01T09:00').toISOString().split('T')[1];
  timeStart = hourToMinute(timeStart);
  let timeEnd = new Date('2000-01-01T12:00').toISOString().split('T')[1];
  timeEnd = hourToMinute(timeEnd);
  time = hourToMinute(time.toISOString().split('T')[1]);
  if (timeStart < time && time < timeEnd) {
    return true;
  }
  return false;
}
function isEvening(time) {
  let timeStart = new Date('2000-01-01T20:00').toISOString().split('T')[1];
  timeStart = hourToMinute(timeStart);
  let timeEnd = new Date('2000-01-01T23:00').toISOString().split('T')[1];
  timeEnd = hourToMinute(timeEnd);
  time = hourToMinute(time.toISOString().split('T')[1]);
  if (timeStart < time && time < timeEnd) {
    return true;
  }
  return false;
}
function calculatePrice(guideServiceCost, hoursNumber, isThisDayOff,
  isItMorning, isItEvening, numberOfVisitors, nadbavka, optionOne, optionTwo) {
  let basePrice = guideServiceCost * hoursNumber * isThisDayOff;
  let morningSurcharge = isItMorning ? 400 : 0;
  let eveningSurcharge = isItEvening ? 1000 : 0;
  let visitorsSurcharge = 0;
  if (optionTwo) {
    if (numberOfVisitors >= 1 && numberOfVisitors <= 5) {
      visitorsSurcharge = basePrice * 0.15;
    } else if (numberOfVisitors > 5 && numberOfVisitors <= 10) {
      visitorsSurcharge = basePrice * 0.25;
    }
  }
  let totalPrice = basePrice + morningSurcharge + eveningSurcharge + visitorsSurcharge;

  if (optionOne) {
    totalPrice += nadbavka;
  }
  return Math.round(totalPrice + nadbavka);
}

let optionOne = false;
let optionTwo = false;
document.querySelector('.add-event').addEventListener('change', (e) => {

  let day = document.querySelector(".datepicker").value;
  let hoursNumber = document.querySelector('.hours-selected').value;
  let countExcurs = document.querySelector(".people-amount").value;
  let isThisDayOff = false;
  let isItMorning = false;
  let isItEvening = false;
  let nadbavka = 0;
  let sum = 0;

  // Установка даты

  isThisDayOff = isHoliday(new Date(`${day}`));
  let date = document.querySelector(".datepicker").value;
  let selectedTime = document.querySelector(".excursion-start").value;
  if (selectedTime == "") {
    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    selectedTime = currentDate.toISOString().split('T')[1];
  }
  let currentTime = new Date()
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let selectedTimeObj = new Date(`2000-01-01T${selectedTime}`);
  isItEvening = isEvening(selectedTimeObj);
  isItMorning = isMorning(selectedTimeObj);
  //------------------------------------------------------------------------

  let holidate = isThisDayOff ? 1.5 : 1;
  sum = calculatePrice(globalPrice, Number(hoursNumber),
    holidate, isItMorning, isItEvening, Number(countExcurs), nadbavka, false, false);
  if (countExcurs > 10) {
    document.getElementById("flexCheckDefault2").setAttribute("disabled", true);
    document.getElementById("flexCheckDefault2").removeAttribute("checked");
  }
  else {
    document.getElementById("flexCheckDefault2").removeAttribute("disabled");
  }
  let isOption2 = document.querySelector(".option-sudo")
  if (isOption2.checked) {
    optionTwo = true;
  } else {
    optionTwo = false;
  }

  let optionChecked = document.querySelector(".option-inter").checked;
  if (optionChecked) {
    nadbavka = sum * 0.5;
    optionOne = true;
  } else {
    optionOne = false;
  }
  countExcurs = document.querySelector(".people-amount").value;
  let event = document.querySelector(".option-inter").checked;

  sum = calculatePrice(globalPrice, Number(hoursNumber),
    holidate, isItMorning, isItEvening, Number(countExcurs), nadbavka, optionOne, optionTwo);
  changePrice(sum, nadbavka);
});

//--------------------------------------------------------------------------------------------------------
window.onload = function () {
  getMainTable();
  conditionOfModalForm();
};

