'use sctrict';

// const urlWays=`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=b75c34ac-b7e6-4ac3-a115-bdd91e9a09fc`;
var localpath = "/data-2252-2999-01-01.json";
var map;

DG.then(function () {
  map = DG.map('map', {
    center: [54.98, 82.89],
    zoom: 13,
  });

  DG.marker([54.98, 82.89]).addTo(map).bindPopup('Вы кликнули по мне!');
});
fetch(localpath)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    let routes = JSON.parse(JSON.stringify(data));


    function createTableRows() {
      var table = document.getElementById("route-table");
      // Проходимся по каждому маршруту и создаем соответствующую строку
      for (var i = 0; i < routes.length; i++) {
        var row = table.insertRow();
        var nameCell = row.insertCell();
        var descCell = row.insertCell();
        var objCell = row.insertCell();
        var btnCell = row.insertCell();

        nameCell.textContent = routes[i].name;
        descCell.textContent = routes[i].description;
        objCell.textContent = routes[i].mainObject;

        // Создаем кнопку выбора маршрута и добавляем обработчик события
        var selectBtn = document.createElement("button");
        selectBtn.textContent = "Выбрать";
        // selectBtn.addEventListener("click", function() {
        // // Выделяем строку с выбранным маршрутом другим цветом
        //    this.parentNode.classList="bg-warning text-dark";
        //  });
        btnCell.appendChild(selectBtn);
      }
    }

    createTableRows();

    let add_hint = true;
    let hint_massive = [];

    function addResponseRecordToArray(records) {
      console.log(typeof (records));
      let ready_hint_massive = new Set();
      for (let i = 0; i < records.length; i++) {
        let words = records[i].text.split(" ");

        for (let j = 0; j < words.length; j++) {
          ready_hint_massive.add(words[j]);
        }
      }
      ready_hint_massive.forEach(value => hint_massive.push(value));
    }



    function getRequest(hint_parameter = '') {
      //-------------------------------------------------------------//    
      if (add_hint == true) {
        let xhr = new XMLHttpRequest();
        let urlstr = `https://json.extendsclass.com/bin/2d0850a1a534`;
        let url = new URL(urlstr);
        xhr.onprogress = () => {
          console.log("LOADING: ", xhr.status);
        };
        xhr.open("GET", url);
        xhr.send();
        xhr.onload = function () {
          let response = JSON.parse(xhr.response);
          addResponseRecordToArray(response.records);
        };
        add_hint = false;
      }

      //-------------------------------------------------------------//  
      let xhr = new XMLHttpRequest();
      let q = hint_parameter;
      let urlstr = `https://json.extendsclass.com/bin/2d0850a1a534`;
      let url = new URL(urlstr);
      xhr.open("GET", url);
      xhr.send();
      xhr.onload = function () {
        let response = JSON.parse(xhr.response);
        totalCount = response._pagination.total_pages;
        //drawButtons();
        //fillPage(response.records);

        //pagesInfo(response._pagination.total_count);
      };


    }
    getRequest();












  })



