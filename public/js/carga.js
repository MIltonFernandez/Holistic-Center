
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

// Get a reference to the storage
var storage_ref = firebase.storage().ref();

// https://www.w3schools.com/jsref/met_element_addeventlistener.asp
document.getElementById("boton_escritura").addEventListener('click', escribir_db, false);

var userId;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    userId = firebase.auth().currentUser.uid; // https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#currentuser
                                              // https://firebase.google.com/docs/reference/js/firebase.User?authuser=0#uid
    child_added(); // Llamo a este método una vez que efectivamente tendo el userID. Si no lo hago así se rompe la ruta. emoroni.
  } else {
    // No user is signed in.
    Window.location.replace("./login.html")
  }
});

// 3
// https://firebase.google.com/docs/database/web/lists-of-data?authuser=0#listen_for_child_events
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#onauthstatechanged
// https://www.w3schools.com/jsref/jsref_isnan.asp
function escribir_db (){
    var imagen = document.getElementById('imagen').files[0];
    var tipo = document.getElementById("tipo").value;
    var titulo = document.getElementById("titulo").value;
    var descripcion = document.getElementById("descripcion").value;
    var dias_horarios = document.getElementById("dias-horarios").value;
    var precio = document.getElementById("precio").value;

    if(titulo != '' && tipo != '' && descripcion != '' && dias_horarios != '' && precio != '' && imagen instanceof File)
    { 
        var metadata = {
          'contentType': imagen.type
        };
        var imagenRef = 'imagenes/' + imagen.name;
        var uploadTask = firebase.storage().ref().child('imagenes/' + imagen.name).put(imagen, metadata);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          document.getElementById("porcentaje_carga").innerHTML = 'Cargando... ' + progress + '%';
        }, function(error){
          alert("Ha ocurrido un error, intente nuevamente.");
          location.reload();
        }, function(){
          firebase.database().ref('Cargas/' + tipo).push({
            ie: "Carga",
            tipo: tipo,
            imagenRef: imagenRef, 
            imagenNombre: imagen.name,
            titulo: titulo,
            descripcion: descripcion,
            dias_horarios: dias_horarios,
            precio: precio,
          });
          document.getElementById("imagen").value = '';
          document.getElementById("tipo").value = '';
          document.getElementById("titulo").value = '';
          document.getElementById("descripcion").value = '';
          document.getElementById("dias-horarios").value = '';
          document.getElementById("precio").value = '';
          alert('Carga exitosa.');
        }
        );
    }
    else {
      alert('Complete todos los campos por favor.');
    }
}

// https://firebase.google.com/docs/database/web/lists-of-data?authuser=0#listen_for_child_events
// Este link puede ser de utilidad - https://stackoverflow.com/questions/20968042/cant-click-button-more-than-one-time-when-append-html-data
function child_added (){
  firebase.database().ref('Cargas/Terapia').on('child_added', function(data) {
    var del_id = data.key + "_del";
    var upd_id = data.key + "_upd";
 
    // https://www.w3schools.com/jquery/default.asp
    // https://www.w3schools.com/jquery/html_append.asp
    firebase.storage().ref().child(data.val().imagenRef).getDownloadURL().then(function(url) {
      $(columna_coleccion).append('<div class="col-sm-1 elementos_listado"> <a href="' + url + '">' + data.val().imagenNombre + ' </a></div>');  
      $(columna_coleccion).append('<div class="col-sm-1 elementos_listado"> <b>Terapia</b></div>');
      $(columna_coleccion).append('<div class="col-sm-1 elementos_listado"> <b>' + data.val().titulo + ' </b></div>');
      $(columna_coleccion).append('<div class="col-sm-4 elementos_listado">' + data.val().descripcion + '</div>'); 
      $(columna_coleccion).append('<div class="col-sm-2 elementos_listado"> <b>' + data.val().dias_horarios + '</b></div>'); 
      $(columna_coleccion).append('<div class="col-sm-1 elementos_listado">' + data.val().precio + '</div>'); 
      $(columna_coleccion).append('<div class="col-sm-2">' + indexar_botones(data.key) + '</div>');
      
      // Aquí existe una diferencia sustancial en la sintaxis cuando es necesario que la función invocada
      // en el click recibe parámetros. emoroni. https://stackoverflow.com/questions/56631140/why-javascript-performs-click-event-when-i-dont-click-on-the-item
      document.getElementById(del_id).addEventListener('click', function () {delete_db('Cargas/' + data.val().tipo + '/' + data.key)}, false);
      document.getElementById(upd_id).addEventListener('click', function () {update_db('Cargas/' + data.val().tipo + '/' + data.key)}, false);
    });
  });

  firebase.database().ref('Cargas/CursoTaller').on('child_added', function(data) {
    var del_id = data.key + "_del";
    var upd_id = data.key + "_upd";
 
    // https://www.w3schools.com/jquery/default.asp
    // https://www.w3schools.com/jquery/html_append.asp
    firebase.storage().ref().child(data.val().imagenRef).getDownloadURL().then(function(url) {
      $(columna_coleccion).append('<div class="col-sm-1 elementos_listado"> <a href="' + url + '">' + data.val().imagenNombre + ' </a></div>');  
      $(columna_coleccion).append('<div class="col-sm-1 elementos_listado"> <b>Curso/Taller</b></div>');
      $(columna_coleccion).append('<div class="col-sm-1 elementos_listado"> <b>' + data.val().titulo + ' </b></div>');
      $(columna_coleccion).append('<div class="col-sm-4 elementos_listado">' + data.val().descripcion + '</div>'); 
      $(columna_coleccion).append('<div class="col-sm-2 elementos_listado"> <b>' + data.val().dias_horarios + '</b></div>'); 
      $(columna_coleccion).append('<div class="col-sm-1 elementos_listado">' + data.val().precio + '</div>'); 
      $(columna_coleccion).append('<div class="col-sm-2">' + indexar_botones(data.key) + '</div>');
       
      // Aquí existe una diferencia sustancial en la sintaxis cuando es necesario que la función invocada
      // en el click recibe parámetros. emoroni. https://stackoverflow.com/questions/56631140/why-javascript-performs-click-event-when-i-dont-click-on-the-item
      document.getElementById(del_id).addEventListener('click', function () {delete_db('Cargas/' + data.val().tipo + '/' + data.key)}, false);
      document.getElementById(upd_id).addEventListener('click', function () {update_db('Cargas/' + data.val().tipo + '/' + data.key)}, false);
    });
  });
}

function indexar_botones (key){
  var boton_borrar = '<button type="button" class="btn btn-danger boton-borrar" id="' + key + '_del">Borrar</button>';
  var boton_update = '<button type="button" class="btn btn-info boton-update" id="' + key + '_upd">Editar</button>';
  return boton_borrar + boton_update;
}
 
function delete_db (path){
  // console.log("Bandera Delete Element"); // Descomentar para debugging. emoroni.
  firebase.database().ref(path).once('value', function(data) {
    firebase.storage().ref().child(data.val().imagenRef).delete();
  });
  firebase.database().ref(path).remove();
  alert('Elemento eliminado.');
  location.reload();
}
 
// https://www.w3schools.com/js/js_popup.asp
function update_db (path){
  var txt;
  var titulo_;
  var descripcion_;
  var dias_horarios_;
  var precio_;
  firebase.database().ref(path).once('value', function(data) {
    titulo_ = prompt("Ingrese el titulo: ", data.val().titulo);
    descripcion_ = prompt("Ingrese la descripcion: ", data.val().descripcion);
    dias_horarios_ = prompt("Ingrese los días y horarios: ", data.val().dias_horarios);
    precio_ = prompt("Ingrese el precio: ", data.val().precio);
  });
  var update_data = {
    ie: "Carga",
    titulo: titulo_,
    descripcion: descripcion_,
    dias_horarios: dias_horarios_,
    precio: precio_,
  }
 
  firebase.database().ref(path).update(update_data);
  location.reload();  
}

document.getElementById("signOut").addEventListener("click", signOut, false);

function signOut(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    window.location.replace("../index.html");
  }).catch(function(error) {
    // An error happened.
    alert("Ha ocurrido un error, intente nuevamente.");
  });
}
