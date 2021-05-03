import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { Comercio } from '../models/comercio';
import { SelectEmpleadoPage } from '../select-empleado/select-empleado.page';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { RolesService } from '../Services/roles.service';
import { UsuariosService } from '../Services/usuarios.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Rol } from '../models/rol';
import { InvitacionesService } from '../Services/invitaciones.service';

@Component({
  selector: 'app-form-pedidos-configuracion',
  templateUrl: './form-pedidos-configuracion.page.html',
  styleUrls: ['./form-pedidos-configuracion.page.scss'],
})
export class FormPedidosConfiguracionPage implements OnInit {

  private subs:Subscription;
  public comercio:Comercio;
  public cadetes = [];

  constructor(
    private comerciosService:ComerciosService,
    private rolesServices:RolesService,
    private modalCtrl:ModalController,
    private navCtrl:NavController,
    private rolesService:RolesService,
    private firestore: AngularFirestore,
    private alertController:AlertController,
    private invitacionService:InvitacionesService
  ) { 

    this.comercio = new Comercio();
    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      this.comercio.asignarValores(data);
    });

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 

    var rolSub = this.rolesService.getAllRolesbyComercio(comercio_seleccionadoId).subscribe(snapshot =>{          
      snapshot.forEach(snap =>{
        var rol:any = snap.payload.doc.data();
        rol.id = snap.payload.doc.id;
        console.log(rol);   
        if(rol.rol == "cadete") 
          this.cadetes.push(rol); 
      });      
      rolSub.unsubscribe();
    });

  }

  ionViewDidLeave(){
    this.subs.unsubscribe();
  }

  ngOnInit() {
  }

  async agregarCadete(){
    const modal = await this.modalCtrl.create({
      component: FormInvitacionPage,
      componentProps: {
        rol:"cadete"      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){     
        this.invitacionService.enviarInvitacion(retorno.data,"cadete"); 
        
      }        
    });
    return await modal.present();
  }

  eliminarC(index){  
  
    console.log("Eliminando Cadete");

    let idABorrar = this.cadetes[index].id;

    console.log(idABorrar);

    this.rolesServices.delete(this.cadetes[index].id);    
    this.cadetes.splice(index,1);

    
    this.comercio.rolCadetes.forEach((rolId,i) =>{
      if(rolId == idABorrar){
        console.log(i)
        this.comercio.rolCadetes.splice(i,1);
        return;
      }
    })
    
    this.update();
  }

  async eliminarCadete(index){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea desvincular?',
      message: 'Se perderán los registros del mismo',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Desvincular',
          handler: () => {  
            this.eliminarC(index);  
                 
          }
        }
      ]
    });
    await alert.present();    
  }

  guardar(){
    this.comerciosService.update(this.comercio);
    this.navCtrl.back();
  }

  update(){
    this.comerciosService.update(this.comercio);
  }

  cancelar(){
    this.navCtrl.back();
  }
}