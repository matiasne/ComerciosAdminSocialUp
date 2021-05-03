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
  ) { 
     
    this.user = new User()

  }


  ngOnInit() {
    this.comercios = [];
    this.user.asignarValores(this.authService.getActualUser())
  } 
 
  async getAfipStatus(){
    console.log('Este es el estado del servidor:');
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
    this.buscandoComercios = true;
    this.comercios = [];
    console.log("!entrando a home"); 
    this.rolesService.getAllRolesbyUser(this.authService.getActualUserId()).subscribe(roles =>{        
      this.comercios = [];
      console.log("!!!!!!")     
      roles.forEach(rol =>{            
        if(rol.comercioId){   
          if(rol.estado != "pendiente" || rol.estado != "rechazada"){
            
            this.comerciosService.get(rol.comercioId).subscribe(data =>{ 
              this.buscandoComercios = false;
              if(data){
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
        this.refresh(undefined);  
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

  

  }
