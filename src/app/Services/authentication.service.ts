import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subscription } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { UsuariosService } from './usuarios.service';
import { LoadingService } from './loading.service';
import { EnumPlanes } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private webClientId= "1050852063833-6h7nfk9a8ithssi498f5c2h6odj6ci1k.apps.googleusercontent.com";
  
  private httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
  private options = {
    headers: this.httpHeaders
  };

  public userIdSubject = new BehaviorSubject <any>("");
  public userRol = new BehaviorSubject <any>("");

  public userSubs:Subscription;
  
  constructor(
    public firebaseAuth: AngularFireAuth,
    private httpClient: HttpClient,
    private platform: Platform,
    public alertController: AlertController,
    public googlePlus:GooglePlus,
    private ngZone:NgZone,
    private router: Router,
    public toastController: ToastController,
    private afs: AngularFirestore,
    private firestore: AngularFirestore,
    private usuarioService:UsuariosService,
    private loadingService:LoadingService
  ) { 

    this.platform.ready().then(() => {
      this.checkToken();
    });

    this.getActualUserIdObservable().subscribe(uid=>{
      if(uid){
        this.userSubs = this.usuarioService.get(uid).subscribe( (data:any)=>{
          localStorage.setItem('user',JSON.stringify(data.payload.data()));
        })        
      }
      else{        
        if(this.userSubs)
          this.userSubs.unsubscribe();
      }
    })
    
  }

  checkToken() {    
    if (localStorage.getItem('user')) {
      this.userIdSubject.next(JSON.parse(localStorage.getItem('user')).uid);      
    }    
  } 

  getActualUserId(){
    return this.userIdSubject.value;
  }

  getActualUserIdObservable(): Observable<any>{
    return this.userIdSubject.asObservable();
  }

  

  login(email: string, password: string) {
    
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
        console.log(value.user);
        
        this.updateUserData(value.user);      
        return true;           
      })
      .catch(async err => {
       
        console.log('Something went wrong:',err.message);

        if(err.message ==  "The email address is badly formatted."){
         /* this.toastr.info('El Email ingresado no tiene un formato valido','Error al ingresar Email', {
            timeOut: 5000,
          });*/ 
          const toast = await this.toastController.create({
            message: 'El Email ingresado no tiene un formato valido',
            duration: 2000,
            position:'top',
            color:"danger"
          });
          toast.present();
          
          return false;
        }

        if(err.message ==  "The password is invalid or the user does not have a password."){
         /* this.toastr.info('El password ingresado no es correcto','Password Incorrecto', {
            timeOut: 5000,
          });*/
          const toast = await this.toastController.create({
            message: 'El password ingresado no es correcto',
            duration: 2000,
            position:'top',
            color:"danger"
          });
          toast.present();
          return false
        }

        if(err.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
          /*this.toastr.info('El usuario ingresado no existe','Usuario no encontrado', {
            timeOut: 5000,
          });*/
          const toast = await this.toastController.create({
            message: 'El usuario ingresado no existe',
            duration: 2000,
            position:'top',
            color:"danger"
          });
          toast.present();
          return false
        }
       
    });
  }

  resetPassword(email: string) {
    var auth = this.firebaseAuth.auth;
    return auth.sendPasswordResetEmail(email)
      .then(async () => {
       
        const toast = await this.toastController.create({
          message: 'Te hemos enviado un mail para que puedas reiniciar tu password',
          duration: 2000,
          position:'top',
          color:"primary"
        });
        toast.present();
        this.router.navigate(['/login']);
      })
      .catch(async (error) => {
        console.log(error.message);       

        if(error.message ==  "The email address is badly formatted."){
          
          const toast = await this.toastController.create({
            message: 'El Email ingresado no tiene un formato valido',
            duration: 5000,
            position: 'top',
            color:"danger"
          });
          toast.present();
        }

        if(error.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
         
          const toast = await this.toastController.create({
            message: 'El Email ingresado no se encuentra registrado',
            duration: 5000,
            position: 'top',
            color:"danger"
          });
          toast.present();
        }

      })
  }

  setFCMToken(token){
    console.log(token)
    const userRef: AngularFirestoreDocument = this.afs.doc('users/'+this.getUID());
    const data = { 
      notificationCelulartoken: token, 
    }    
    return userRef.set(data, { merge: true });
  }


  updateUserData(user){   

    const userRef: AngularFirestoreDocument = this.afs.doc(`users/${user.uid}`);
    
    localStorage.setItem('rol',null);
    localStorage.setItem('comercio_seleccionadoId',null);
    localStorage.setItem('user',JSON.stringify(user));
    this.userIdSubject.next(user.uid);

    let data:any;
    userRef.ref.get().then((doc) => {
      if(doc.exists){
        console.log('User exists!');
      
         data = { 
          uid: user.uid, 
          email: user.email, 
          displayName: user.displayName, 
          photoURL: user.photoURL,
        }    

      } else {
        console.log('User doesnt exist. Creating...');
        data = { 
          plan: EnumPlanes.free,
          uid: user.uid, 
          email: user.email, 
          displayName: user.displayName, 
          photoURL: user.photoURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }    
      }     
      return userRef.set(data, { merge: true });
    })
  }

  setRol(rol){
    this.userRol.next(rol);
  }

  observeRol(){
    return this.userRol.asObservable();
  }

  signup(data) {
    
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(data.email, data.password)
      .then((result) => { 
            
        
        this.ngZone.run(async () => {
          
          this.updateUserData(result.user);

          const toast = await this.toastController.create({
            message: 'Usuario creador correctamente. Bienvenido!',
            duration: 5000,
            position: 'top',
            color: "primary"
          });
          toast.present();
        });
      }).catch(async (error) => {
       console.log(error.message);

       if(error.message ==  "The email address is already in use by another account."){
          
        const toast = await this.toastController.create({
          message: 'El mail ingresado ya se encuentra registrado',
          duration: 5000,
          position: 'top',
          color:"danger"
        });
        toast.present();
        
      }

        if(error.message ==  "Password should be at least 6 characters"){
          
          const toast = await this.toastController.create({
            message: 'La contraseña debe contener al menos 6 caracteres',
            duration: 5000,
            position: 'top',
            color: "danger"
          });
          toast.present();      
        }

        if(error.message ==  "The email address is badly formatted."){
         
          const toast = await this.toastController.create({
            message: 'El Email ingresado no tiene un formato valido',
            duration: 5000,
            position: 'top',
            color: "danger"
          });
          toast.present(); 
        }
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.firebaseAuth.auth.currentUser.sendEmailVerification()
    .then(async () => {
     
      const toast = await this.toastController.create({
        message: 'Te hemos enviado un mail para que verifiques tu correo',
        duration: 5000,
        position: 'top'
      });
      toast.present();  
      
    })
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('comercio_seleccionadoId');
    localStorage.removeItem('rol');
    this.userIdSubject.next(false);    
  }

  public getActualUser(){
    return JSON.parse(localStorage.getItem('user'));
  }

  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);

    this.firebaseAuth.auth.signInWithCredential(credential)
      .then((response) => {
        this.loadingService.dismissLoading()
        this.updateUserData(response.user);        
      }) 
  } 

  

  async googleSignin() {
  //  if (this.platform.is('cordova')) {
      let params;
      if (this.platform.is('android')) {
        params = {
          'webClientId': this.webClientId,
          'offline': true,
          'scopes': 'profile email'
        }
      /*}
      else {
        params = {}
      }*/

      console.log(params);
      this.loadingService.presentLoading()
      this.googlePlus.login(params).then((response) => {
        const { idToken, accessToken } = response
        console.log(response);       
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error)
       // alert('error:' + JSON.stringify(error));
      }); 
  
     
  
    } else {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.firebaseAuth.auth.signInWithPopup(provider).then(result => {     
        
        this.updateUserData(result.user); 
      
      
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  }

  getUID(){    
    let user =  JSON.parse(localStorage.getItem('user'));
  
    if(user){
      if(user.uid)
        return user.uid;
      if(user.id)
        return user.id;
    }  
  }

  getConnectionStatus(){    
    let user =  JSON.parse(localStorage.getItem('user'));
  
    if(user){
      return user.state;
    }  
  }

  getRef(id){
    console.log(id);
    return this.firestore.collection("users").doc(id).ref;
  }

  getNombre(){    
    let user =  JSON.parse(localStorage.getItem('user'));
    if(user){
      if(user.nombre)
        return user.nombre;
      else if(user.displayName)
        return user.displayName;
      else
        return "sin definir";
    }    
  }

  getEmail(){         
    let user =  JSON.parse(localStorage.getItem('user'));
    if(user){ 
      if(user.email)
        return user.email;
      else
        return "";
    }    
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      //console.error(`Backend returned code ${error.status}, ` +`body was: ${error.error.errors[0]}`);

      console.log(error.error.errors.date_of_birth[0]);
      //this.presentAlert(error.error.errors.date_of_birth[0]);      

    }
    // return an observable with a user-facing error message
    
    var mensaje = "Ocurrió un error, por favor intente más tarde";
    if(error.status == 0){
      mensaje = "Error al conectar con el servidor, por favor verifique su conexión a internet";        
    }

    return throwError(mensaje);
  };

  async presentAlert(message) {

    const alert = await this.alertController.create({
      header: 'Completar Campos',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
