/*
 * RealTime Database Firebase - PE - EA 2020
 * 0 - https://firebase.google.com/docs/database?authuser=0
 * https://firebase.google.com/docs/database/web/structure-data?authuser=0
 * ¿Base de datos NoSQL? https://es.wikipedia.org/wiki/NoSQL#:~:text=En%20inform%C3%A1tica%2C%20NoSQL%20(a%20veces,como%20lenguaje%20principal%20de%20consultas.
 * 1 - https://firebase.google.com/docs/database/web/start?authuser=0
 * Un detalle importante al momento de la creación de la base de datos. Habilitar de modo de prueba para
 * que cualquier usario puedo modificar la base de datos.
 */
var firebaseConfig = {
  apiKey: "AIzaSyCsi3gpx9pEzN6euLOePqUFViPcK1QyzM0",
  authDomain: "centro-holistico.firebaseapp.com",
  databaseURL: "https://centro-holistico.firebaseio.com",
  projectId: "centro-holistico",
  storageBucket: "gs://centro-holistico.appspot.com",
};

/* https://firebase.google.com/docs/reference/js/firebase#functions_1
 El valor de retorno del método initializeApp es una instancia de inicialización de la aplicación.
 A partir de aquí podre emplear los servicios disponibles. emoroni */
var firebase_app = firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database_ref = firebase.database();

// Get a reference to the storage service
var storage_ref = firebase.storage().ref();

child_added();

// https://firebase.google.com/docs/database/web/lists-of-data?authuser=0#listen_for_child_events
// Este link puede ser de utilidad - https://stackoverflow.com/questions/20968042/cant-click-button-more-than-one-time-when-append-html-data
function child_added (){
firebase.database().ref('Cargas/Terapia').on('child_added', function(data) {
  
  firebase.storage().ref().child(data.val().imagenRef).getDownloadURL().then(function(url) {
     // https://www.w3schools.com/jquery/default.asp
  // https://www.w3schools.com/jquery/html_append.asp
  //$(columna_coleccion_terapia).append('<div class="col-lg-3 card" style="margin: 1em"><div class="thumb" style="background-image: url(' + url + ');"></div><h3 class="block-service-1-heading mb-3"><a href="#">' + data.val().titulo + '</a></h3><p>' + data.val().descripcion + '</p><h6>' + data.val().dias_horarios + '</h6><h4>' + data.val().precio + '</h4></div></div></div>');
  $(columna_coleccion_terapia).append('<div style="margin: .5em"><a class="card"><div class="thumb" style="background-image: url(' + url + ');"></div><article><h1 style="font-size: 30px">'+ data.val().titulo + '</h1><span>' + data.val().descripcion + '</span><h6>' + data.val().dias_horarios + '</h6><h4>' + data.val().precio + '</h4></article></a></div>');

  });
});
firebase.database().ref('Cargas/CursoTaller').on('child_added', function(data) {
  
  firebase.storage().ref().child(data.val().imagenRef).getDownloadURL().then(function(url) {
     // https://www.w3schools.com/jquery/default.asp
  // https://www.w3schools.com/jquery/html_append.asp
  $(columna_coleccion_cursoTaller).append('<div style="margin: .5em"><a class="card"><div class="thumb" style="background-image: url(' + url + ');"></div><article><h1 style="font-size: 30px">'+ data.val().titulo + '</h1><span>' + data.val().descripcion + '</span><h6>' + data.val().dias_horarios + '</h6><h4>' + data.val().precio + '</h4></article></a></div>');
  });
});
}
