const apiKey = '498369e5cb40c3b896f92242394cc639';
var url = 'https://api.openweathermap.org/data/2.5/forecast?lat=51.5085&lon=0.1257&appid=498369e5cb40c3b896f92242394cc639';
var queryString = "London,UK"

let button = $()
$.ajax({
    url: url,
    type: "get",
    data: {
        appid: apiKey,
        q: queryString
    },
    success: function(response) {
        // on success
        console.log(response)
    },
    error: function(xhr) {
        // on error
     }
});

/*fetch("https://api.openweathermap.org/data/2.5/weather?q=London&limit=5&appid=498369e5cb40c3b896f92242394cc639") 
    .then(response => response.json())
    .then(citiesFound => {
        let firstCity = citiesFound[0];

console.log(firstCity);
console.log(firstCity.lat)
console.log(firstCity.lon)

})*/

//https://api.openweathermap.org/data/2.5/forecast?lat=51.5085&lon=0.1257&appid=498369e5cb40c3b896f92242394cc639