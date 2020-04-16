var apiKey = "a684d65ea8c8378147bbc598bfac93a8";

var queryCityBtnEl = document.querySelector("#query-city-btn");
var queryCityInputEl = document.querySelector("#query-city-input");
var fiveDayForcastEl = document.querySelector("#weather-cards");
var currentDayContainerEl = document.querySelector("#current-day");
var previousSearchesEl = document.querySelector("#city-list");

var currentCity = '';

var cityArray = [];
var weatherObject = [];

var formHandlerSubmit = function(event) {
  event.preventDefault();
  
  // get value from input
  var query = queryCityInputEl.value.trim();

  // declare separate var for city and state split on comma, replace spaces with +
  var queryCity = query.split(',')[0].replace(' ', '+').trim();
  var queryState = query.split(',')[1].replace(' ', '+');

  // alert if no info given
  if (!query) {
    alert("Please enter a city and state!");
    return;
  }
  // append city and state string, no spaces comma separated
  else if (queryState) {
    queryState = queryState.trim();
    var queryCityState = queryCity + ',' + queryState;
  }
  // if no state, prompt user to enter state
  else {
    alert('Please enter the US State associated with your city!');
    return;
  };
  
  if (queryCityState) {
      getLatLon(queryCityState);
      queryCityInputEl.value = '';
      console.log(queryCityState);
  }
  else {
      alert("Please enter a city and state!");
  };
};

var getLatLon = function(cityState) {
  var apiUrl = 
  'http://api.openweathermap.org/data/2.5/forecast?q=' + 
  cityState +
  '&units=imperial&cnt=1&appid=' + 
  apiKey;

  // make a request to the url
  fetch(apiUrl)
      .then(function(response) {
          //request successful
          if(response.ok) {
              response.json().then(function(data) {
                  console.log(data);
                  queryLat = data.city.coord.lat;
                  queryLon = data.city.coord.lon;
                  currentCity = data.city.name;
                  getWeatherObject(queryLat, queryLon);
                  cityStateToStorage(cityState);
              });
          }
          else {
              alert('Error: ' + response.statusText);
          }
      })
      // .catch(function(error) {
      //     //notice this `.catch()` getting chained onto the end of the `.then()` method
      //     alert("Unable to connect to Weather API");
      // });
};

var getWeatherObject = function(lat, lon) {
  weatherObject = [];
  var apiUrl = 
  'https://api.openweathermap.org/data/2.5/onecall?lat=' +
  lat + 
  '&lon=' + 
  lon + 
  '&units=imperial&cnt=5&appid=' + 
  apiKey;

  // make a request to the url
  fetch(apiUrl)
      .then(function(response) {
          //request successful
          if(response.ok) {
              response.json().then(function(data) {
                  console.log(data);

                  weatherObject = data;
                  printFiveDays();
                  printCurrentDay();
              });
          }
          else {
              alert('Error: ' + response.statusText);
          }
      })
};

var printCurrentDay = function() {
  // clear any existing content
  currentDayContainerEl.textContent = '';

  var currentDayEl = document.createElement("div");
  currentDayEl.classList = 'card-body';

  var icon = 'https://openweathermap.org/img/wn/' + weatherObject.current.weather[0].icon + '@2x.png';
  var temp = 'Temp: ' + weatherObject.current.temp + ' °F';
  var humid = 'Humidity: ' + weatherObject.current.humidity + '%';
  var uvIndex = 'UV Index: ';

  // create div to hold header and icon
  var cityDateIconEl = document.createElement("div");

  //create image
  var currentIcon = document.createElement("img");
  currentIcon.setAttribute('src', icon);
  currentIcon.classList = 'img-icon d-inline';
  
  // create header string
  var cityDateString = 
    currentCity + 
    ' (' +
    moment.unix(weatherObject.current.dt).format("MMMM Do YYYY") +
    ')';

  // create h2 with header string
  var cityDateEl = document.createElement("h2");
  cityDateEl.textContent = cityDateString;
  cityDateEl.classList = 'd-inline';

  // append city date string and icon to div, append div to card
  cityDateIconEl.appendChild(cityDateEl);
  cityDateIconEl.appendChild(currentIcon);
  currentDayEl.appendChild(cityDateIconEl);

  //create p for temp
  var currentTemp = document.createElement("p");
  currentTemp.textContent = temp;
  currentTemp.classList = 'pl-3';
  currentDayEl.appendChild(currentTemp);

  //create p for humidity
  var currentHumidity = document.createElement("p");
  currentHumidity.textContent = humid;
  currentHumidity.classList = 'pl-3';
  currentDayEl.appendChild(currentHumidity);

  //create p for uv index pretext
  var currentUV = document.createElement("p");
  currentUV.textContent = uvIndex;
  currentUV.classList = 'pl-3';

  //create span for uv index
  var uvSpan = document.createElement("span");
  uvSpan.value = parseFloat(weatherObject.current.uvi);
  uvSpan.textContent = uvSpan.value;

  //set span background color based on index value
  if (uvSpan.value <= 3) {
    uvSpan.classList = 'badge badge-success text-white';
  }
  else if (uvSpan.value > 3 && uvSpan.value <= 7) {
    uvSpan.classList = 'badge badge-warning text-white';
  }
  else {
    uvSpan.classList = 'badge badge-danger text-white';
  }

  currentUV.appendChild(uvSpan);
  currentDayEl.appendChild(currentUV);

  currentDayContainerEl.setAttribute('style', 'margin: 15px');
  currentDayContainerEl.appendChild(currentDayEl);
};

var printFiveDays = function() {
  // clear any existing content
  fiveDayForcastEl.textContent = '';

  // index 0 is current day, use index one to get next day and forward
  for (var i = 1; i <= 5; i++) {
    var date = moment.unix(weatherObject.daily[i].dt).format("MMMM Do YYYY");
    var temp = 'Temp: ' + weatherObject.daily[i].temp.day + ' °F';
    var humid = 'Humidity: ' + weatherObject.daily[i].humidity + '%';
    var icon = 'https://openweathermap.org/img/wn/' + weatherObject.daily[i].weather[0].icon + '@2x.png';

    var cardBody = document.createElement("div");
    cardBody.classList = 'card bg-primary text-white';

    var cardHeader = document.createElement("h5");
    cardHeader.classList = 'card-title text-center';
    cardHeader.textContent = date;
    cardBody.appendChild(cardHeader);

    var cardIcon = document.createElement("img");
    cardIcon.setAttribute('src', icon);
    cardIcon.classList = 'img-icon';
    cardBody.appendChild(cardIcon);

    var cardTemp = document.createElement("p");
    cardTemp.textContent = temp;
    cardTemp.classList = 'pl-3';
    cardBody.appendChild(cardTemp);

    var cardHumid = document.createElement("p");
    cardHumid.textContent = humid;
    cardHumid.classList = 'pl-3';
    cardBody.appendChild(cardHumid);

    fiveDayForcastEl.appendChild(cardBody);
  }
};

var cityStateToStorage = function(cityState) {
  var saveToStorage = true;

  for (var i = 0; i < cityArray.length; i++) {
    if (cityArray[i].cityQuery === cityState) {
      saveToStorage = false;
    }
  }

  if (saveToStorage) {
    var cityQueryItem = {cityName:currentCity, cityQuery:cityState};
  cityArray.push(cityQueryItem);
  var cityJsonObject = JSON.stringify(cityArray);
  localStorage.setItem('previousCities', cityJsonObject);
  printStorageToPage();
  } 
};

var cityStateStorageChecker = function() {

};

var printStorageToPage = function() {
  previousSearchesEl.innerHTML = '';

  for (var i = 0; i < cityArray.length; i++) {
    var previousSearchLi = document.createElement("li");
    previousSearchLi.classList = 'list-group-item';
    previousSearchLi.textContent = cityArray[i].cityName;
    previousSearchLi.setAttribute('data-query', cityArray[i].cityQuery);
    previousSearchesEl.appendChild(previousSearchLi);
  }
};

var previousSearchClick = function(event) {
  var cityState = event.target.dataset.query;
  getLatLon(cityState);
};

previousSearchesEl.addEventListener("click", previousSearchClick);
queryCityBtnEl.addEventListener("click", formHandlerSubmit);