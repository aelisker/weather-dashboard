var apiKey = "a684d65ea8c8378147bbc598bfac93a8";

var queryCityBtnEl = document.querySelector("#query-city-btn");
var queryCityInputEl = document.querySelector("#query-city-input");

var formHandlerSubmit = function(event) {
  event.preventDefault();
  
  // get value from input
  var query = queryCityInputEl.value.trim();
  var queryState = query.split(',')[1].trim();
  var queryCity = query.split(',')[0].replace(' ', '+').trim();
  var queryCityState = queryCity + ',' + queryState;


  if (queryCityState) {
      //getUserRepos(username);
      queryCityInputEl.value = '';
      console.log(queryCityState);
  }
  else {
      alert("Please enter a city and state");
  }
};

var getFiveDayObject = function(city, state) {
  var apiUrl = 
  'http://api.openweathermap.org/data/2.5/forecast?q=' + 
  city + 
  ',' + 
  state +
  '&units=imperial&cnt=3&appid=' + 
  apiKey;

  // make a request to the url
  fetch(apiUrl)
      .then(function(response) {
          //request successful
          if(response.ok) {
              response.json().then(function(data) {
                  displayRepos(data, user)
              });
          }
          else {
              alert('Error: ' + response.statusText);
          }
      })
      .catch(function(error) {
          //notice this `.catch()` getting chained onto the end of the `.then()` method
          alert("Unable to connect to Github");
      });
};

queryCityBtnEl.addEventListener("click", formHandlerSubmit);