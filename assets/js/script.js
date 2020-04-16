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

  // alert if no info given
  if (!query) {
    alert("Please enter a city and state!");
    return;
  }
  // if no state, prompt user to enter state
  if (!query.includes(',')) {
    alert('Please fully spell out the state associated with your city! Your input should be in "City, State" format.');
    queryCityInputEl.value = '';
    return;
  }

  // declare separate var for city and state split on comma, replace spaces with +
  var queryCity = query.split(',')[0].replace(' ', '+').trim();
  var queryState = query.split(',')[1].replace(' ', '+').trim();

  // append city and state string, no spaces comma separated
  var queryCityState = queryCity + ',' + queryState;
  
  if (queryCityState) {
      getLatLon(queryCityState);
      queryCityInputEl.value = '';
  }
  else {
      alert("Please enter a city and state!");
  };
};

//use api call to get latitude and longitude from response object
var getLatLon = function(cityState) {
  var apiUrl = 
  'https://api.openweathermap.org/data/2.5/forecast?q=' + 
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
              alert('Error: ' + response.statusText + '. Please ensure your search is formatted as "City, State" with the state name fully typed out.');
          }
      })
};

//use api to get object, save to global array
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
  var wind = 'Wind Speed: ' + weatherObject.current.wind_speed + ' MPH';
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

  //create p for wind speed
  var currentWindSpeed = document.createElement("p");
  currentWindSpeed.textContent = wind;
  currentWindSpeed.classList = 'pl-3';
  currentDayEl.appendChild(currentWindSpeed);

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

var loadCityArray = function() {
  cityArray = JSON.parse(localStorage.getItem("previousCities"));
  
  //initialize empty array if nothing in localstorage
  if (!cityArray) {
    cityArray = [];
  }
  //if localstorage array is not empty, print storage to previous cities list
  else {
    printStorageToPage();
  } 
};

var cityStateToStorage = function(cityState) {
  var saveToStorage = true;

  //declare var false if array already contains searched city
  for (var i = 0; i < cityArray.length; i++) {
    if (cityArray[i].cityQuery === cityState) {
      saveToStorage = false;
    }
  }

  //save if array did not find searched city
  if (saveToStorage) {
    var cityQueryItem = {cityName:currentCity, cityQuery:cityState};

    //if array already has nine items, delete first (oldest) indexed item
    if (cityArray.length === 9) {
      cityArray.shift();
    }
    
    cityArray.push(cityQueryItem);
    var cityJsonObject = JSON.stringify(cityArray);
    localStorage.setItem('previousCities', cityJsonObject);
    printStorageToPage();
  } 
};

var printStorageToPage = function() {
  previousSearchesEl.innerHTML = '';

  for (var i = 0; i < cityArray.length; i++) {
    var previousSearchLi = document.createElement("li");
    previousSearchLi.classList = 'list-group-item btn btn-outline-secondary text-left';
    previousSearchLi.textContent = cityArray[i].cityName;

    //using data attribute for click function later
    previousSearchLi.setAttribute('data-query', cityArray[i].cityQuery);
    previousSearchesEl.appendChild(previousSearchLi);
  }
};

var previousSearchClick = function(event) {
  event.preventDefault();

  //find current weather data for data-query attribute value of event.target
  var cityState = event.target.dataset.query;
  getLatLon(cityState);
};

previousSearchesEl.addEventListener("click", previousSearchClick);
queryCityBtnEl.addEventListener("click", formHandlerSubmit);

loadCityArray();