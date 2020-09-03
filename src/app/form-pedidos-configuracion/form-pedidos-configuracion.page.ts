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

@Component({
  selector: 'app-form-pedidos-configuracion',
  templateUrl: './form-pedidos-configuracion.page.html',
  styleUrls: ['./form-pedidos-configuracion.page.scss'],
})
export class FormPedidosConfiguracionPage implements OnInit {

  private subs:Subscription;
  private comercio:Comercio;
  private cadetes = [];

  constructor(
    private comerciosService:ComerciosService,
    private rolesServices:RolesService,
    private modalCtrl:ModalController,
    private navCtrl:NavController,
    private usuariosService:UsuariosService,
    private firestore: AngularFirestore,
    private alertController:AlertController
  ) { 
    this.comercio = new Comercio();
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');

    console.log(comercio_seleccionadoId)
   
    
    this.subs = this.comerciosService.get(comercio_seleccionadoId).subscribe(data=>{
      this.comercio.asignarValores(data.payload.data());
      this.comercio.id = data.payload.id;

      this.cadetes = [];
      if(this.comercio.rolCadetes.length > 0){
        this.comercio.rolCadetes.forEach(rolId =>{
          console.log(rolId)
          var sub = this.rolesServices.get(rolId).subscribe(snap =>{
            var cadete = snap.payload.data();
            if(cadete)
              this.cadetes.push(cadete);
            sub.unsubscribe();
          });
        });
      }
      this.subs.unsubscribe();
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
        var rol:Rol = new Rol();
        rol.id = this.firestore.createId();
        rol.comercioId = this.comercio.id;
        rol.user_email = retorno.data;
        rol.rol = "cadete";
        rol.estado = "pendiente";
        this.rolesServices.create(rol);

        this.comercio.rolCadetes.push(rol.id);
        this.cadetes.unshift(rol);

        console.log("Agregando Cadete")
        this.update();
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