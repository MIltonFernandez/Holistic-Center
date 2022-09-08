var firebaseConfig = {
	apiKey: "AIzaSyCsi3gpx9pEzN6euLOePqUFViPcK1QyzM0",
	authDomain: "centro-holistico.firebaseapp.com",
	databaseURL: "https://centro-holistico.firebaseio.com",
	projectId: "centro-holistico",
  };

var auth = firebase.auth();
var storageRef = firebase.storage().ref();

var userId;

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		// User is signed in.
		userId = firebase.auth().currentUser.uid;
		console.log("UserID: " + userId);
	} else {
		// No user is signed in.
		console.log("No hay un usuario.");
		Window.replace("./index.html");
	}
});


// Documentación sobre subida de archivos en https://firebase.google.com/docs/storage/web/upload-files
function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	var file = evt.target.files[0];

	//La meta data es información de un archivo, como puede ser tipo de archivo, tipo de codificación,
	//fecha de creación, de modificación, posición de GPS, equipo con el que fue creado, copyright, etc etc  
	// Mas información de los metadatos en https://firebase.google.com/docs/storage/web/file-metadata
	var metadata = {
		'contentType': file.type
	};

	// Push to child path.
	// Documentación sobre los metodos de 'referencias' https://firebase.google.com/docs/reference/js/firebase.storage.Reference 

	//En particular el metodo put -> https://firebase.google.com/docs/reference/js/firebase.storage.Reference#put

	//El metodo 'put' de una 'referencia' sube un 'archivo' y su 'metadata'
	//Y nos devuelve una promesa de 'UploadTask'
	storageRef.child('images/' + userId + '/' + file.name).put(file, metadata).then(function (snapshot) {
		// UploadTask tiene una propiedad del tipo UploadTaskSnapshot que es una copia de la información subida. 
		// De ella podemos consultar determinada información: 
		// La documentación la vemos en https://firebase.google.com/docs/reference/js/firebase.storage.UploadTaskSnapshot

		console.log('Uploaded', snapshot.totalBytes, 'bytes.');
		console.log('File metadata:', snapshot.metadata);

		//Una vez que ya lo tenemos subido, podremos consultar la referencia, la URL de descarga, y otros 
		snapshot.ref.getDownloadURL().then(function (url) {
			console.log('File available at', url);
			// innerHTML lo que hace es reemplazar el contenido del elemento que solicitamos con el id
			document.getElementById('linkbox').innerHTML = '<a href="' + url + '">Click For File</a>';
			alert( 'Carga exitosa')
		});
	}).catch(function (error) {
		console.error('Upload failed:', error);
	});
}

// onload() Se ejecuta ni bien la ventana carga todos los archivos y las dependencias de la pagina.
// Es decir, no solo el html sino tambien todos sus js, css, iconos, etc. 
window.onload = function () {
	//Agrega el Event listener para el 'file', que es donde se cargará el archivo. 
	document.getElementById('file').addEventListener('change', handleFileSelect, false);

	//Por default deja el boton de carga deshabilitado. 
	document.getElementById('file').disabled = true;

	auth.onAuthStateChanged(function (user) {
		if (user) {
			//Si esta correctamente logueado, habilita el boton de carga de archivos.
			document.getElementById('file').disabled = false;
		} else {
			console.log('There was no anonymous session. Creating a new anonymous user.');
			// Sign the user in anonymously since accessing Storage requires the user to be authorized.
			auth.signInAnonymously().catch(function (error) {
				if (error.code === 'auth/operation-not-allowed') {
					window.alert('Anonymous Sign-in failed. Please make sure that you have enabled anonymous ' +
						'sign-in on your Firebase project.');
				}
			});
		}
	});
}

document.getElementById("signOut").addEventListener("click", signOut, false);

function signOut(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    window.location.replace("./index.html");
  }).catch(function(error) {
    // An error happened.
    alert("Ha ocurrido un error, intente nuevamente.");
  });
}
