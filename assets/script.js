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

    // if the location doesn't exist, update page
    if (data['cod'] == 404) {
      sectionToday.html(`<h3>Location not found!</h3>`)
      return;
    }

    let city = data['city']
    let cityName = city['name']

    updateRecentSearches(cityName + ", " + city['country']);

    let sectionTodayHtml = `<h3 id="today-title">${cityName}, ${city['country']}</h3>`

    let list = data['list']
    // Get 0-7 (first 7 x 3 hour segments)
    let today = list.slice(0, 7)
    sectionTodayHtml += `
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

      sectionTodayHtml += ` 
      <div class="col">
        <p>${date}</p>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
        <p>${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${wind} m/s<p>

      </div>
      `

    }

    sectionToday.html(sectionTodayHtml)


    let sectionForecastHtml = `
      <div class="container">
        <div class="row">
        
    `
    let forecast = list.slice(8, 40)
    // OpenWeatherAPI returns every 3 hours, so we will skip by 8 (24 hours/1 day) and increment by 8 instead of i++
    for (i=0; i < forecast.length; i+=8) {
      // Same as above, could potentially be made into it's own function
      let segment = forecast[i]
      let date = segment['dt_txt']
      let temp = segment['main']['temp']
      let humidity = segment['main']['humidity']
      let wind = segment['wind']['speed']
      let weather = segment['weather'][0]
      let icon = weather['icon']

      sectionForecastHtml += ` 
      <div class="col">
        <p>${date}</p>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
        <p>${temp}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${wind} m/s<p>
      </div>
      `
    }

    sectionForecast.html(sectionForecastHtml)

  })
});

const MAX_RECENT_SEARCHES = 5;
let recentSearches = [];

// Function to update the recent searches section with the latest searches
function updateRecentSearches(place) {
  // Load the recent searches from localStorage, or initialize it if it doesn't exist
  recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  if (place) {
    // Add the latest search to the beginning of the recent searches array
    recentSearches.unshift(place);

    // Truncate the array to keep only the 5 most recent searches
    recentSearches = recentSearches.slice(0, MAX_RECENT_SEARCHES);

    // Save the updated recent searches to localStorage
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }

  // Update the content of the history element with the latest searches
  const historyElement = document.getElementById("history");
  historyElement.innerHTML = "<h4>Recent Searches</h4><ul>";
  recentSearches.forEach((place) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = place;
    historyElement.appendChild(listItem);
  });
}

updateRecentSearches();