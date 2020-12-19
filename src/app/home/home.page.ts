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
    maxComercios:1
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
    private modalCtrl:ModalController
  ) { 
    

  }

  ngOnInit() {
    
   
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
   
    this.loadingService.presentLoading();
    this.comercios = [];

    console.log("!entrando a home");
    this.subsItems = this.rolesService.getAllRolesbyUser(this.authService.getActualUserId()).subscribe(snapshot =>{        
      this.loadingService.dismissLoading();      
      snapshot.forEach(snap =>{
          var rol:any = snap;     
          
          this.loadingService.presentLoading();
          console.log(rol);
          if(rol.comercioId){
            this.comercioSubs = this.comerciosService.get(rol.comercioId).subscribe(data =>{  
              if(data.payload.data()){              
                  var comercio:any = data.payload.data();    
                  comercio.id = data.payload.id;
                  comercio.rol = rol;  
                  if(rol.estado != "pendiente")
                    this.comercios.push(comercio);
              }                
              
              this.loadingService.dismissLoading();
              this.setPermisos();
            });
          }
         
        
        
      });
      
     
    });
   
  }

  ionViewDidLeave(){
    //this.comercioSubs.unsubscribe();
    //this.subsItems.unsubscribe(); 
  }

  setPermisos(){
    this.user = this.AuthenticationService.getActualUser();

    if(this.user.maxComercios){
      console.log(this.comercios.length+" "+this.user.maxComercios)
      if(this.comercios.length >= this.user.maxComercios){
        this.habilitadoCrearComercio = false;
      }
    }
    else{
      this.user.maxComercios = 1;
      if(this.comercios.length > 0){
        this.habilitadoCrearComercio = false;
      }
    }
  }

  async nuevoComercio(){
    if(this.habilitadoCrearComercio == false){
      this.toastService.mensaje("Has superado el máximo de comercios que puedes agregar","Para agregar más amplia tu plan contactandonos");
    }
    else{
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
    
  }

  seleccionar(comercio){
    //  if(comercio.rol.rol == "owner" || comercio.rol.rol == "admin"){
        console.log(comercio);
        this.comerciosService.setSelectedCommerce(comercio.id);
        this.authService.setRol(comercio.rol.rol);
        this.router.navigate(['dashboard-comercio',{id:comercio.id}]);
        this.usuariosService.setComecioSeleccionado(this.authService.getActualUserId(),comercio.id);
    //  }      
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
