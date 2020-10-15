import { Component, OnInit } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './Services/authentication.service';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { ComerciosService } from './Services/comercios.service';
import { NotificacionesDesktopService } from './Services/notificaciones-desktop.service';
import { NotificacionesService } from './Services/notificaciones.service';
import { NotifificacionesAppService } from './Services/notifificaciones-app.service';
import { Comercio } from './Models/comercio';
import { InvitacionesService } from './Services/invitaciones.service';
import { ComandasService } from './Services/comandas.service';
import { ToastService } from './Services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public cantComandas = 0;

  public appActions =[
    
    {
      title: 'Mis Comercios',
      url: '/home',
      icon: 'home',
      badge:0
    },
    {
      title: 'Notificaciones',
      url: '/list-notificaciones',
      icon: 'notifications',
      badge: 0
    },
    {
      title: 'Invitaciones',
      url: '/list-invitaciones',
      icon: 'people',
      badge: 0
    },
   
  ]

  public appPages = [
    {
      title: 'Clientes',
      url: '/dashboard-clientes',
      icon: 'people'
    },
    {
      title: 'Punto de Venta',
      url: '/list-productos-servicios',
      icon: 'cart'
    },    
    {
      title: 'Comandas Y Pedidos',
      url: '/list-comandas',
      icon: 'receipt'
    },
    {
      title: 'Subscripciones',
      url: '/list-subscripciones',
      icon: 'clipboard'
    },
    {
      title: 'Cajas',
      url: '/dashboard-cajas',
      icon: 'wallet'
    },
    {
      title: 'Ctas. Corrientes',
      url: '/list-cta-corrientes',
      icon: 'wallet'
    },
    {
      title: 'Configuración',
      url: '/form-comercio-configuracion',
      icon: 'cog'
    },
    
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  public comercioSeleccionado:Comercio;
  public usuario ={
    uid:"",
    email:""
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService:AuthenticationService,
    private router: Router,
    private fcm: FCM,
    public toastController: ToastController,
    private comerciosService:ComerciosService,
    private notifiacionesDesktopService:NotificacionesDesktopService,
    private notificacionesAppService:NotifificacionesAppService,
    private invitacionesService:InvitacionesService,
    private comandasService:ComandasService,
    private toastService:ToastService
  ) {
    this.comercioSeleccionado = new Comercio();
   
    this.initializeApp();    
    

  }

  

  initializeApp() {

    console.log("NgOnInit")
    this.notifiacionesDesktopService.init().then(data=>{
      console.log("OK")
    },error=>{
      console.log("ERROR"); 
    });

    this.platform.ready().then(() => {

      this.notifiacionesDesktopService.requestPermission();

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      this.authService.getActualUserObservable().subscribe(data=>{
        this.usuario = data;
        console.log(this.usuario);

        if(this.usuario){
          this.notificacionesAppService.getSinLeer(this.authService.getUID()).subscribe(snapshot =>{
            this.appActions[1].badge = snapshot.length;
            console.log(snapshot)
          })
  
          this.invitacionesService.getSinLeer(this.authService.getEmail()).subscribe(snapshot =>{
            this.appActions[2].badge = snapshot.length;
            console.log(snapshot)
          });
  
          this.comandasService.getCantidad().subscribe((snapshot) => {
            this.cantComandas = snapshot;
          });
        }
        
      });

      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        this.comercioSeleccionado = data;
      });       

      this.authService.authenticationState.subscribe(state => {
      
        if (state) {          
          this.router.navigate(['home']);     

          if (this.platform.is('cordova')) {
            this.fcm.subscribeToTopic('gestion');
        
            this.fcm.getToken().then(token => {     
              this.authService.setFCMToken(token);
            },error=>{
              console.log(error)
            });
        
            this.fcm.onTokenRefresh().subscribe(token => {      
              this.authService.setFCMToken(token);
            },error=>{
              console.log(error)
            });     
        
            this.fcm.onNotification().subscribe(data => {
              if(data.wasTapped){
                //alert("Received in background");
              } else {
                console.log(data);
                this.toastService.mensaje(data.title,data.body);
              };
            });
          }         
        } else {
          this.router.navigate(['login']);
        }

       
      });

    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  cerrarSesion(){
    this.usuario = undefined;
    this.comercioSeleccionado=new Comercio();
    this.authService.logout();
  }
}
