//importScripts('ngsw-worker.js');
//importScripts('firebase-messaging-sw.js');

//Porque firebase hosting redirecciona todo a index.html
if ('serviceWorker' in navigator) {
   /* navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });*/


    navigator.serviceWorker.register('ngsw-worker.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });


  }