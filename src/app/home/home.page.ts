import { Component, OnInit } from '@angular/core';
import { ComerciosService } from '../Services/comercios.service';
import { AuthenticationService } from '../Services/authentication.service';
import { ModalController, AlertController, Platform } from '@ionic/angular';
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
import { WoocommerceService } from '../Services/woocommerce/woocommerce.service';
import { FotoService } from '../Services/fotos.service';
import { Archivo } from '../models/foto';
import { ImagesService } from '../Services/images.service';
import { CambiarPlanPage } from '../cambiar-plan/cambiar-plan.page';
import { EnumPlanes, User } from '../models/user';


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

  public habilitadoCrearComercio = true;

  foto:any

  public buscandoComercios = true;

  public user:User

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
    private platform: Platform
  ) { 
     
    this.user = new User()

    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });

  }


  ngOnInit() {

  } 

  refrescar(){
    this.comercios = [];
  //  this.user.asignarValores(this.authService.getActualUser());

    this.buscandoComercios = true;
    this.comercios = [];
    console.log("!entrando a home"); 
    this.rolesService.getAllRolesbyEmailGET(this.authService.getActualUser().email).subscribe((roles:any) =>{        
      this.comercios = []; 
      console.log(roles)
      if(roles.length == 0){
        this.buscandoComercios = false
      }
      for(let i = 0;i < roles.length; i++){
        
        if(roles[i].comercioId){
          if(roles[i].estado != "pendiente" && roles[i].estado != "rechazada"){
            let obs =this.comerciosService.get(roles[i].comercioId).subscribe(data=>{
              if(data){
                this.buscandoComercios = false
                let comercio:any = data;
                comercio.rol = roles[i];
                console.log(comercio)
                this.comercios.push(comercio)
                obs.unsubscribe()
              }
              
            });            
          }
        }
      }
      console.log(this.comercios) 
      
    });
  }
 
  async getAfipStatus(){
    console.log('Este es el estado del servidor:');
  }


  refresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      this.refrescar();
        event.target.complete();
      }, 500);
  }

  ionViewDidEnter(){    
    this.refrescar();
  }


  

  ionViewDidLeave(){
  }
    

  imprimir(){
    this.router.navigate(['prueba']); 
  }
  

  async nuevoComercio(){
    this.user = this.authService.getActualUser();


    if(this.user.plan == EnumPlanes.free && this.comercios.length > 0){
      this.mostrartCambiarDePlan();
      return;      
    }
   

    const modal = await this.modalCtrl.create({
      component: FormComercioPage,
      componentProps:undefined
    });
    modal.onDidDismiss()
    .then((retorno) => {  
      this.refrescar()
    });
    return await modal.present();      
  }


  async mostrartCambiarDePlan(){
    const modal = await this.modalCtrl.create({
      component: CambiarPlanPage,
      componentProps:undefined
    });
    return await modal.present();
  }

  seleccionar(comercio){
    this.user = this.authService.getActualUser();    
    this.comerciosService.setSelectedCommerce(comercio.id);   
    this.authService.setRol(comercio.rol);
    this.router.navigate(['dashboard-comercio',{id:comercio.id}]);
    this.usuariosService.setComecioSeleccionado(this.authService.getActualUserId(),comercio.id);
       
  }


  

  }
