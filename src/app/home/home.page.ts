import { Component, OnInit } from '@angular/core';
import { ComerciosService } from '../Services/comercios.service';
import { AuthenticationService } from '../Services/authentication.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RolesService } from '../Services/roles.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../Services/loading.service';
import { NotificacionesDesktopService } from '../Services/notificaciones-desktop.service';
import { NotificacionesService } from '../Services/notificaciones.service';
import { PresenceService } from '../Services/presence.service';
import { UsuariosService } from '../Services/usuarios.service';
import { ToastService } from '../Services/toast.service';
import { FormComercioPage } from '../form-comercio/form-comercio.page';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ImpresoraService } from '../Services/impresora.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public comercios = [];
  public subsItems: Subscription;
  public comercioSubs:Subscription;

  public conexionEstado = "offline";

  public user = {
    maxComercios:1,
    stopTrial:false,
    createdAt:0
  };
  public habilitadoCrearComercio = true;

  constructor(
    public authService:AuthenticationService,
    public comerciosService:ComerciosService,
    public rolesService:RolesService,
    public router:Router,
    public loadingService:LoadingService,
    public alertController:AlertController,
    public usuariosService:UsuariosService,
    public AuthenticationService:AuthenticationService,
    public toastService:ToastService,
    private modalCtrl:ModalController,
    private impresoraService:ImpresoraService,
  ) { 
    

  }

  ngOnInit() {
    this.comercios = [];
    this.user = this.authService.getActualUser();
   
   
  } 

  async getAfipStatus(){
    //const serverStatus = await afip.ElectronicBilling.getServerStatus();

    console.log('Este es el estado del servidor:');
    //console.log(serverStatus);
  }

  refresh(event) {
    console.log('Begin async operation');
    this.ionViewDidLeave();
    setTimeout(() => {
      this.ionViewDidEnter();
        event.target.complete();
      }, 500);
  }

  ionViewDidEnter(){    
    
    
    console.log("!entrando a home"); 
    this.rolesService.getAllRolesbyUser(this.authService.getActualUserId()).subscribe(roles =>{        
      this.comercios = [];
      console.log("!!!!!!")     
      roles.forEach(rol =>{
        console.log(rol)               
        if(rol.comercioId){   
          if(rol.estado != "pendiente" || rol.estado != "rechazada"){
            this.loadingService.presentLoading()
            this.comerciosService.get(rol.comercioId).subscribe(data =>{ 
              console.log(data) 
              if(data){
                this.loadingService.dismissLoading()  
                var comercio:any = data; 
                comercio.rol = rol; 
                this.comercios.push(comercio);
              }              
            }); 
          }
          
        }        
        
      });
      console.log(this.comercios)
     // this.loadingService.dismissLoading();      
     
    });
    this.impresoraService.conectar()
  }

  ionViewDidLeave(){
    
  }

  

  async nuevoComercio(){
    this.user = this.authService.getActualUser();
    if(this.user.maxComercios){
      console.log(this.comercios.length+" "+this.user.maxComercios)
      if(this.comercios.length >= this.user.maxComercios){
        this.habilitadoCrearComercio = false;
        this.toastService.mensaje("Has superado el máximo de comercios que puedes agregar","Para agregar más amplia tu plan contactandonos");
        return;
      }
    }
    else{
      this.user.maxComercios = 1;
      if(this.comercios.length > 0){
        this.toastService.mensaje("Has superado el máximo de comercios que puedes agregar","Para agregar más amplia tu plan contactandonos");
        return;
      }
    }

    const modal = await this.modalCtrl.create({
      component: FormComercioPage,
      componentProps:undefined
    });
    modal.onDidDismiss()
    .then((retorno) => {  
        this.refresh(undefined);  
    });
    return await modal.present();

    
    
  }

  seleccionar(comercio){
    this.user = this.authService.getActualUser();
    console.log(this.user.stopTrial);
    if(!this.user.stopTrial){
      console.log(this.user)
      let lastDay = Number(this.user.createdAt) + (15*24*60*60);
      var seconds = new Date().getTime() / 1000;

      console.log(seconds+" "+lastDay)
      if(seconds > lastDay){
        this.toastService.alert("","Su periodo de prueba ha expirado");
        return;
      }
    }
    
    
    this.comerciosService.setSelectedCommerce(comercio.id);
   
    this.authService.setRol(comercio.rol.rol);
    this.router.navigate(['dashboard-comercio',{id:comercio.id}]);
    this.usuariosService.setComecioSeleccionado(this.authService.getActualUserId(),comercio.id);
       
  }


  async editar(item){
   // this.seleccionar(item);

    const modal = await this.modalCtrl.create({
      component: FormComercioPage,
      componentProps: {
        comercio:item      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      
        this.refresh(undefined);  
      
    });
    return await modal.present();
    


  }

  async desvincular(comercio){   

      const alert = await this.alertController.create({
        header: 'Eliminar',
        message: 'Está seguro que desea eliminar el comercio?',
        buttons: [
          {
            text: 'Cancelar',
            handler: (blah) => {
              
            }
          }, {
            text: 'Desvincular',
            handler: () => {
              console.log(comercio)
              this.rolesService.delete(comercio.id,comercio.rol.id);    
              this.ionViewDidEnter();
            }
          }
        ]
      });
      await alert.present();
    }

  }
