/*
 * Auth Firebase - PE - EA 2020
 * 1 - https://firebase.google.com/docs/reference/js?authuser=0
 * En este vínculo analizaremos que como importar los SDK correspondientes para se empleados en nuestro
 * proyecto. En nuestro caso emplearemos un CDN (Al igual que hicimos con Bootstrap).
 * A partir de seguir el paso a paso que nos propone la documentación oficial nos podemos preguntar algo,
 * ¿por qué debemos colocar los archivos .js al final del body?
 * 
 * 2 - Debemos inicializar Firebase en nuestro desarrollo.
 * 
 * https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0
 */

var firebaseConfig = {
   apiKey: "AIzaSyCsi3gpx9pEzN6euLOePqUFViPcK1QyzM0",
   authDomain: "centro-holistico.firebaseapp.com",
   databaseURL: "https://centro-holistico.firebaseio.com",
   projectId: "centro-holistico",
 };

/* https://firebase.google.com/docs/reference/js/firebase#functions_1
   El valor de retorno del método initializeApp es una instancia de inicialización de la aplicación.
   A partir de aquí podre emplear los servicios disponibles.*/

firebase.initializeApp(firebaseConfig);

/* 3 - Existen tres métodos para poder referenciar elementos del HTML desde el js.
   getElementByTagName(...)
   getElementByIdName(...)
   getElementByClassName(...)

   https://developer.mozilla.org/es/docs/Web/API/Document
   https://developer.mozilla.org/es/docs/Web/API/Document/getElementById */



/* 4 - Las acciones del usuario son denominadas eventos. Podemos analizarlo de manera similar a como lo
   hicimos con máquina de estado. La forma en la que detectaremos la ocurrencia de un evento es empleando
   el método addEventListener. Este método recibe tres parámetros que son:
   - El nombre del evento que el elemento del HTML escuchará.
   - La función que se ejecutará cuando ocurra el evento esperado.
   - Un valor booleano que indicará como un evento será disparado en elementos superpuestos.
   https://www.w3schools.com/jsref/dom_obj_event.asp
   https://www.w3schools.com/whatis/whatis_htmldom.asp
   https://developer.mozilla.org/es/docs/Learn/JavaScript/Client-side_web_APIs/Introducci%C3%B3n
*/

var btn = document.getElementById("boton_ingresar");
btn.addEventListener('click', chequear_usr, false);

/* 5 - https://firebase.google.com/docs/auth/web/start?authuser=0#sign_in_existing_users
  https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/try...catch
*/

function chequear_usr() {

   var usr = document.getElementById("usuario").value;
   var pass = document.getElementById("contraseña").value;

   firebase.auth().signInWithEmailAndPassword(usr, pass)
   .then(function() {
      window.location.replace("./carga.html");
   }).catch(function(error) {
      var errorCode = error.code;
      if (errorCode === 'auth/invalid-email') {
            alert('La dirección de correo es inválida.');
         }
      if (errorCode === 'auth/user-disabled') {
            alert('El usuario ingresado está deshabilitado.');
      }
      if (errorCode === 'auth/user-not-found') {
            alert('El usuario ingresado no se encuentra registrado.');
         }
      if (errorCode === 'auth/wrong-password') {
      alert('La contraseña no es correcta.');
      }
   });
}
