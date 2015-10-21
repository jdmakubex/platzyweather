(function() {
 var API_WEATHER_KEY = "979dd242d0f5be6fb199133ffe1bc92f";
 var API_WEATHER_URL ="http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&" ;
 var IMG_WEATHER = "http://openweathermap.org/img/w/";

 //Creando variables que calculan y almacenan la hora
 var today = new Date();
 var timeNow = today.toLocaleTimeString();

 var $body = $("body");
 var $loader = $("loader");
 var nombreNuevaCiudad = $("[data-input= 'cityAdd']");
 var buttonAdd = $("[data-buton='add']");

 var cityWeather = {};
 cityWeather.zone;
 cityWeather.icon;
 cityWeather.temp;
 cityWeather.temp_max;
 cityWeather.temp_min;
 cityWeather.main;

 $( buttonAdd ).on("click", addNewCity);

 $( nombreNuevaCiudad).on("keypress", function(event){
   //Probando el numero de la tecla Enter, resultó ser 13
   //console.log(event.which);
   if(event.which==13){
    addNewCity(); 
   }
 });

  if(navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(getCoords, errorFound);

  } else {
    alert("Por favor, actualiza tu navegador");
  }


  function errorFound(error) {
    alert("Un error ocurrió: " + error.code);
    // 0: Error desconocido
    // 1: Permiso denegado
    // 2: Posición no está disponible
    // 3: Timeout
  };

  function getCoords(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log("Tu posición es: " + lat + "," + lon);
    $.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon="+lon, getCurrentWeather);
  };

  function getCurrentWeather(data){
   console.log(data);
   cityWeather.zone = data.name;
   cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
   cityWeather.temp = data.main.temp - 273.15;
   cityWeather.temp_max = data.main.temp_max - 273.15;
   cityWeather.temp_min = data.main.temp_min - 273.15;
   cityWeather.main= data.weather[0].main;

   renderTemplate(cityWeather);
 };

  function activateTemplate(id){
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
  };

  function renderTemplate(cityWeather) {
    var clone = activateTemplate("#template--city");

    clone.querySelector("[data-time]").innerHTML = timeNow ;
    clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
    clone.querySelector("[data-icon]").src = cityWeather.icon;
    clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
    clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
    clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);
    $( $loader).hide();
    $( $body ).append(clone);
  };

  function addNewCity(event){
    event.preventDefault();
    $.getJSON(API_WEATHER_URL + "q=" + $( nombreNuevaCiudad ).val(), getWeatherNewCity);
  };

  function getWeatherNewCity(data){
  //  console.log(data);
  var cityWeather = {};
  cityWeather.zone = data.name;
  cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
  cityWeather.temp = data.main.temp - 273.15;
  cityWeather.temp_max = data.main.temp_max - 273.15;
  cityWeather.temp_min = data.main.temp_min - 273.15;
  cityWeather.main= data.weather[0].main;

  renderTemplate(cityWeather);
  };

})();
