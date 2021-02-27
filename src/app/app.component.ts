import { Component, OnInit } from '@angular/core';

import { AlertController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './Services/authentication.service';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { ComerciosService } from './Services/comercios.service';
import { NotificacionesDesktopService } from './Services/notificaciones-desktop.service';
import { NotifificacionesAppService } from './Services/notifificaciones-app.service';
import { Comercio } from './Models/comercio';
import { InvitacionesService } from './Services/invitaciones.service';
import { ComandasService } from './Services/comandas.service';
import { ToastService } from './Services/toast.service';
import { MesasService } from './Services/mesas.service';
import * as firebase from 'firebase';
import { PresenceService } from './Services/presence.service';
import { UsuariosService } from './Services/usuarios.service';
import { Network } from '@ionic-native/network/ngx';
import { PedidoService } from './Services/pedido.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public cantComandas = 0;
  public cantPedidos =0;
  public cantMesasActivas = 0;

  public showCatalogo = "false";
  public showMesas = "false";
  public showComandas ="false";
  public showCllientes ="false";
  public showCajas ="false";
  public showServicios ="false";
  public showSubscripciones ="false";
  public showConfiguracion ="false";

  public appActions =[
    
   
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
    email:"",
    state:""
  };

  public onlineOffline: boolean = navigator.onLine;
  public rolActual = "";

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
    private toastService:ToastService,
    public presenceService:PresenceService,
    private usuariosService:UsuariosService,
    private alertController:AlertController,
    private usuarioService:UsuariosService,
    private pedidosService: PedidoService
  ) {
    this.comercioSeleccionado = new Comercio();   
    this.initializeApp();  

    this.authService.observeRol().subscribe(data=>{
      this.rolActual = data;
      console.log(this.rolActual)
      //Aca setea todos los shows

    })
  }  

  initializeApp() {
    console.log("NgOnInit")
    /*this.notifiacionesDesktopService.requestPermission();
    this.notifiacionesDesktopService.init().then(data=>{
      console.log("OK")
    },error=>{
      console.log("ERROR"); 
    });*/

    this.fcm.onNotification().subscribe(data => {      
      if(data.wasTapped){

      } else {
        console.log(data);
        this.toastService.mensaje(data.title,data.body);
      };
    });

    
    
   

    this.authService.getActualUserIdObservable().subscribe(uid=>{
       
      if(uid){   
        
        console.log("Logueado!"+uid)
        this.router.navigate(['home']);     

        this.notificacionesAppService.getSinLeer(uid).subscribe(snapshot =>{
          this.appActions[0].badge = snapshot.length;
        }) 

        this.invitacionesService.getSinLeer(uid).subscribe(snapshot =>{         
          this.appActions[1].badge = snapshot.length;  
        });

        

        this.usuarioService.get(uid).subscribe( (data:any)=>{
          this.usuario = data.payload.data();
        }) 
       
      
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
      
         
        }        
        
        
      }  
      else{
        this.router.navigate(['login']);
      }    
    });

    

   


    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

    this.comerciosService.getSelectedCommerce().subscribe(data=>{
 
      console.log(data) 

      if(data)
        this.comercioSeleccionado.asignarValores(data);
      else{
        this.comercioSeleccionado = new Comercio();
      } 
    });       
  }

  verComercios(){

    this.comerciosService.setSelectedCommerce("");
    this.authService.setRol("");
    this.router.navigate(['home']);
    this.usuariosService.setComecioSeleccionado(this.authService.getActualUserId(),"");
  }

  cerrarSesion(){
    this.usuario ={
      uid:"",
      email:"",
      state:""
    };
    this.comercioSeleccionado=new Comercio();
    this.authService.logout();
  }

  
}
