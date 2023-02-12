const apiURL = 'https://api.openweathermap.org/data/2.5/';
const apiKey = '498369e5cb40c3b896f92242394cc639';

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const sectionToday = $('#today');
const sectionForecast = $('#forecast')

const units = 'metric'
// TODO: add option to change from metric to imperial


/*

`https://api.openweathermap.org/data/2.5/weather?q=LondonUK&appid=498369e5cb40c3b896f92242394cc639`;

*/

function callApi(method, params, callback) {

  params['appid'] = apiKey;

  var queryString = new URLSearchParams(params)
  console.log("qs: " + queryString)

  var url = apiURL + method + '?' + queryString
  console.log("url: " + url);

  fetch(url)
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    callback(data)
  })
  .catch(error => {
    console.error(error);
  });
}

/*
callApi("forecast", {
  q: "London, UK"
}, (data) => {
  console.log("from callApi: ", data)
})
*/

/*

The city name
The date
An icon representation of weather conditions
The temperature
The humidity
The wind speed
*/


searchButton.addEventListener('click', function(event) {
  // Default action for forms would be to load a new page, this prevents that
  event.preventDefault();


  if (!searchInput.value) {
    console.error('City name cannot be empty');
    return;
  }

  callApi("forecast", {
    q: searchInput.value,
    units: units
  }, (data) => {
    console.log("from callApi: ", data)

    let city = data['city']
    let cityName = city['name']

    let html = `<h3 id="today-title">${cityName}, ${city['country']}</h3>`

    let list = data['list']
    let today = list.slice(0, 7)
    html += `
      <div class="container">
        <div class="row">
        
    `
    for (i=0; i < today.length; i++) {
      let segment = today[i]
      let date = segment['dt_txt']
      let temp = segment['main']['temp']
      let humidity = segment['main']['humidity']
      let wind = segment['wind']['speed']
      let weather = segment['weather'][0]
      let icon = weather['icon']

      html += ` 
      <div class="col">
        <p>${date}</p>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
        <p>${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
      </div>
      `

    }

    sectionToday.html(html)

  })
});





// const apiKey = '498369e5cb40c3b896f92242394cc639';
// var url = 'https://api.openweathermap.org/data/2.5/forecast?lat=51.5085&lon=0.1257&appid=498369e5cb40c3b896f92242394cc639';
// var queryString = "London,UK"

// let button = $()
// $.ajax({
//     url: url,
//     type: "get",
//     data: {
//         appid: apiKey,
//         q: queryString
//     },
//     success: function(response) {
//         // on success
//         console.log(response)
//     },
//     error: function(xhr) {
//         // on error
//      }
// });

/*fetch("https://api.openweathermap.org/data/2.5/weather?q=London&limit=5&appid=498369e5cb40c3b896f92242394cc639") 
    .then(response => response.json())
    .then(citiesFound => {
        let firstCity = citiesFound[0];

console.log(firstCity);
console.log(firstCity.lat)
console.log(firstCity.lon)

})*/

//https://api.openweathermap.org/data/2.5/forecast?lat=51.5085&lon=0.1257&appid=498369e5cb40c3b896f92242394cc639