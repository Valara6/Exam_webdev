'use sctrict';
//-------------------------------------------------MAINURL----------------------------------------------------------

const mainUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/`;

//-------------------------------------------------MAP----------------------------------------------------------
let map;

DG.then(function () {
  map = DG.map('map', {
    center: [54.98, 82.89],
    zoom: 13,
  });

  DG.marker([54.98, 82.89]).addTo(map).bindPopup('Вы кликнули по мне!');
});
//--------------------------------------------------GETREQUESTMAINTABLE----------------------------------------------------------
async function getRequestMainTable(url, method) {
  if (method == 'GET') {
    return await fetch(url, {

    })

  }
}

//--------------------------------------------------FULFILL TABLE----------------------------------------------------------

function editImportTable() {
  new DataTable('#datatable', {
    lengthMenu: [
      [5, 10, 25, 50, -1],
      [5, 10, 25, 50, 'Все записи']
    ]
  });
  
}
function fillTable(data) {

  let tableBody = document.querySelector('.fillbody');
  let template = document.querySelector('.template-row');
  tableBody.textContent = "";
  for (let i = 0; i < data.length ; i++) {

    let clonedRow = template.content.cloneNode(true);

    let tr = clonedRow.querySelector("#id-tr");
    // tr.dataset.id = JSON.stringify(data[i].id);
    
    tr.setAttribute('data-id', `${JSON.stringify(data[i].id)}`);
    let route = clonedRow.querySelector('.route');
    let desc = clonedRow.querySelector('.desc');
    let mainObjects = clonedRow.querySelector('.mainObjects');

    route.textContent = data[i].name;
    desc.textContent = data[i].description;
    mainObjects.textContent = data[i].mainObject;

    tableBody.appendChild(clonedRow);
  }

  editImportTable();

}

function getGidTable() {
  //Поменяй ссылку на свою
  for ( id of chosenRoute){
  let cur_url = new URL(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=b75c34ac-b7e6-4ac3-a115-bdd91e9a09fc`);
  getRequestMainTable(cur_url, 'GET')
    .then((data) => {
      return data.json()
    })
    .then(data => fillGitTable(data)
    )
    .catch(error => console.error(`Something went wrong: ${error}`))

}
}

function fillGitTable(data){
  let tableBody = document.querySelector('.gid-fillbody');
  let template = document.querySelector('.template-row-gid');
 
  // tableBody.textContent = "";
  for (let i = 0; i < data.length ; i++) {
    
    let clonedRow = template.content.cloneNode(true);

  
    let id = clonedRow.querySelector('.id-git-route');
    let Fio = clonedRow.querySelector('.FIO');
    let language = clonedRow.querySelector('.language');
    let workExperience = clonedRow.querySelector('.workExperience');
    let PricePerHour = clonedRow.querySelector('.PricePerHour');

    id.textContent = data[i].id;
    id.setAttribute('data-route-id',data[i].route_id)
    Fio.textContent = data[i].name;
    workExperience.textContent = data[i].workExperience;
    language.textContent = data[i].language;
    PricePerHour.textContent = data[i].pricePerHour;

    tableBody.appendChild(clonedRow);
  }

}


function DeleteGid(routeId){
  let table = document.querySelector(".gid-fillbody");
  let currentRouteId = table.querySelectorAll(".id-git-route")


  for(const route of currentRouteId){
    let route2 = route.getAttribute('data-route-id');

    if (route2 == routeId){
      route.closest('tr').remove();
    }
  }
}

function saveToSessionStorage(data) {

  sessionStorage.setItem("data", JSON.stringify(data));



}
function getMainTable() {
  // Поменяй ссылку на свою
  let url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=b75c34ac-b7e6-4ac3-a115-bdd91e9a09fc';
  getRequestMainTable(url, 'GET')
    .then((data) => {
      return data.json()
    })
    .then(data => { fillTable(data); addHint(data); getMainObject(data); saveToSessionStorage(data) }
    )
    .catch(error => console.error(`Something went wrong: ${error}`))
}

//--------------------------------------------------SEARCH----------------------------------------------------------
let filterBtn = document.querySelector('.search-btn');
function searchFromBtn() {
  let inputValue = document.querySelector('#input-datalist').value;
  let data = JSON.parse(sessionStorage.getItem('data'));
  if (inputValue == "") {
    console.log("No input presented");
    fillTable(data);
  }
  else {
    //console.log(data[0].name);
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].name == inputValue) {
        newData.push(data[i]);
      }
    }
    // console.log(newData.length);
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
//--------------------------------------------------OBJECTS SEARCH----------------------------------------------------------

function getMainObject(data) {
  //console.log("started");
  let getData = document.querySelector("#object-filter");
  let ready_objects = new Set();
  //Проверка разделителей
  for (let i = 0; i < data.length; i++) {
    let objects = data[i].mainObject.split(" ");
  }
  for (let j = 0; j < objects.length; j++) {
    ready_objects.add(objects[j]);
  }
  console.log(ready_objects);
  for (const obj of ready_objects) {
    let string = document.createElement('option');
    string.textContent = obj;
    //console.log(obj);
    getData.append(string);
  }
}
//--------------------------------------------------ChooseBTN ----------------------------------------------------------
let chosenRoute = new Set();
document.querySelector('.fillbody').addEventListener('click', function (event) {
  // Проверка, что клик был по кнопке
  if (event.target.tagName === 'BUTTON') {
      // Получение родительской строки (tr)
      let row = event.target.closest('tr');

      // Получение значения атрибута data-id из строки
      let dataId = row.getAttribute('data-id');

      // Ваш код обработки клика на кнопку
      console.log('Кнопка в строке с data-id ' + dataId + ' была нажата.');
      if(chosenRoute.has(dataId)) {
        DeleteGid(dataId);
        chosenRoute.delete(dataId);

        console.log(chosenRoute);
        
      } else {
        chosenRoute.add(dataId);
        console.log(chosenRoute);
      }
      
  }
  getGidTable();
});


window.onload = function () {
  getMainTable();

};

