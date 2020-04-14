var apiKey = "a684d65ea8c8378147bbc598bfac93a8";

var queryCityBtnEl = document.querySelector("#query-city-btn");
var queryCityInputEl = document.querySelector("#query-city-input");

var queryLat = '';
var queryLon = '';

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
                  getWeatherObject();
              });
          }
          else {
              alert('Error: ' + response.statusText);
          }
      })
      // .catch(function(error) {
      //     //notice this `.catch()` getting chained onto the end of the `.then()` method
      //     alert("Unable to connect to Github");
      // });
};

var getWeatherObject = function() {
  var apiUrl = 
  'https://api.openweathermap.org/data/2.5/onecall?lat=' +
  queryLat + 
  '&lon=' + 
  queryLon + 
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
              });
          }
          else {
              alert('Error: ' + response.statusText);
          }
      })
};

var printFiveDays = function() {
  for (var i = 1; i <= 5; i++) {
    console.log('Temp: ' + weatherObject.daily[i].temp.day + ' F');
  }
};

queryCityBtnEl.addEventListener("click", formHandlerSubmit);