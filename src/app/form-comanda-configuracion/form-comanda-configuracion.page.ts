import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { Comercio } from '../models/comercio';
import { SelectEmpleadoPage } from '../select-empleado/select-empleado.page';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { RolesService } from '../Services/roles.service';
import { UsuariosService } from '../Services/usuarios.service';
import { Rol } from '../models/rol';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-form-comanda-configuracion',
  templateUrl: './form-comanda-configuracion.page.html',
  styleUrls: ['./form-comanda-configuracion.page.scss'],
})
export class FormComandaConfiguracionPage implements OnInit {

  private subs:Subscription;
  private comercio:Comercio;
  private comandatarios = [];

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
    
    this.subs = this.comerciosService.get(comercio_seleccionadoId).subscribe(data=>{
      this.comercio.asignarValores(data.payload.data());
      this.comercio.id = data.payload.id;

      this.comandatarios = [];
      if(this.comercio.rolComandatarios.length > 0){
        this.comercio.rolComandatarios.forEach(rolId =>{
          var sub = this.rolesServices.get(rolId).subscribe(snap =>{
            var comandatario = snap.payload.data();
            console.log(comandatario);
            if(comandatario)
              this.comandatarios.push(comandatario);
            sub.unsubscribe();
          });
        });
      }
      this.subs.unsubscribe();
      console.log(this.comercio);
    });
  }

  ionViewDidLeave(){
    this.subs.unsubscribe();
  }

  ngOnInit() {
  }

  async agregarComandatario(){
    const modal = await this.modalCtrl.create({
      component: FormInvitacionPage,
      componentProps: {
        rol:"comandatario"      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){     
        console.log(retorno.data)        

        var rol:Rol = new Rol();
        rol.id = this.firestore.createId();
        rol.comercioId = this.comercio.id;
        rol.user_email = retorno.data;
        rol.rol = "comandatario";
        rol.estado = "pendiente";
        this.rolesServices.create(rol);

        this.comercio.rolComandatarios.push(rol.id);
        this.comandatarios.unshift(rol);

        

        console.log(this.comercio.rolComandatarios);
        this.update();
      }        
    });
    return await modal.present();
  }

  eliminarC(index){  
    console.log(this.comercio.rolComandatarios)
    console.log(this.comercio.rolComandatarios[index])

  /*  this.comercio.rolComandatarios.forEach(rol =>{
      if(rol.id == this.comandatarios[index]){
        
      }
    })*/

    let idABorrar = this.comandatarios[index].id;

  

    this.rolesServices.delete(this.comandatarios[index].id);
   // this.comercio.rolComandatarios.splice(index,1);
    this.comandatarios.splice(index,1);    

    this.comercio.rolComandatarios.forEach((rolId,i) =>{
      if(rolId == idABorrar){
        console.log(i)
        this.comercio.rolComandatarios.splice(i,1);
        return;
      }
    })

    this.update();
  }

  async eliminarComandatario(index){

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

  
  update(){
    this.comerciosService.update(this.comercio);
  }

  cancelar(){
    this.navCtrl.back();
  }

}
