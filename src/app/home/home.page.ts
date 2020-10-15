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


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public comercios = [];
  public subsItems: Subscription;
  public comercioSubs:Subscription;

  constructor(
    public authService:AuthenticationService,
    public comerciosService:ComerciosService,
    public rolesService:RolesService,
    public router:Router,
    public loadingService:LoadingService,
    public alertController:AlertController,
    public notificationService:NotificacionesService
  ) { }

  ngOnInit() {
 
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
    
    localStorage.setItem('comercio_seleccionadoId',null);
    this.comerciosService.setSelectedCommerce("");
    this.loadingService.presentLoading();
    this.comercios = [];

    console.log("!entrando a home");
    this.subsItems = this.rolesService.getAllRolesbyUser().subscribe(snapshot =>{        
      this.loadingService.dismissLoading();      
      snapshot.forEach(snap =>{
        var rol:any = snap;     
        this.loadingService.presentLoading();
        console.log(rol);
        this.comercioSubs = this.comerciosService.get(rol.comercioId).subscribe(data =>{  
          if(data.payload){
            var comercio:any = data.payload.data();   
            comercio.id = data.payload.id;
            comercio.rol = rol;  
            this.comercios.push(comercio);
          }       
          console.log(comercio);  
          this.loadingService.dismissLoading();
          
        });
        
      });
      
     
    });
   
  }

  ionViewDidLeave(){
    //this.comercioSubs.unsubscribe();
    //this.subsItems.unsubscribe(); 
  }

  async nuevoComercio(){
    this.router.navigate(['form-comercio']);
  }

  seleccionar(comercio){
      if(comercio.rol.rol == "owner" || comercio.rol.rol == "admin"){
        console.log(comercio);
        this.comerciosService.setSelectedCommerce(comercio.id);
        this.authService.setRol(comercio.rol);
        this.router.navigate(['dashboard-comercio',{id:comercio.id}]);
      }      
  }

  editarInvitacion(item){
    //preguntar si acepta o no el rol
    //this.rolesService.aceptarInvitacion();
  }

  editar(item){
    this.seleccionar(item); //Para que en la edicion pueda usar los service sin pasarle el id del comercio
    this.router.navigate(['form-comercio',{id:item.id}]);
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
              this.rolesService.delete(comercio.rol.id);
              if(comercio.rol.rol =="comandatario"){
                console.log("!!!!")
                comercio.rolComandatarios.forEach((rolId,i) =>{
                  console.log(rolId);
                  if(rolId == comercio.rol.id){
                    console.log(i)
                    comercio.rolComandatarios.splice(i,1);
                    delete comercio.rol;
                    this.comerciosService.update(comercio).then(data=>{
                      console.log("ok")
                    });
                  }
                })  
              }
              
              this.ionViewDidEnter();
            }
          }
        ]
      });
      await alert.present();
    }

  }
