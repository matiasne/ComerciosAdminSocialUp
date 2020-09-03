import { Component, OnInit } from '@angular/core';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { Rol } from '../models/rol';
import { Comercio } from '../models/comercio';
import { RolesService } from '../Services/roles.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormHorarioPage } from '../form-horario/form-horario.page';
import { Horario } from '../models/horario';
import { ProfesionalServicio } from '../models/profesionalServicio';

@Component({
  selector: 'app-form-add-profesional',
  templateUrl: './form-add-profesional.page.html',
  styleUrls: ['./form-add-profesional.page.scss'],
})
export class FormAddProfesionalPage implements OnInit {

  public profesional:ProfesionalServicio;

  public updating = false;

  constructor(
    private modalCtrl:ModalController,
    private rolesServices:RolesService,
    private firestore: AngularFirestore,
    private alertController:AlertController,
    private navParams:NavParams
  ) { 
  }

  ngOnInit() {

    console.log(this.navParams.get('profesional'))
    this.profesional = new ProfesionalServicio();
    if(this.navParams.get('profesional')){      
      this.profesional.asignarValores(this.navParams.get('profesional'));
      this.updating = true;
    }    
    
  }

  eliminarProfesional(){
    this.profesional = new ProfesionalServicio();
  }

  eliminar(){
    this.rolesServices.delete(this.profesional.rolId);
    this.modalCtrl.dismiss('eliminar');
  }

  async agregarProfesional(){
    const modal = await this.modalCtrl.create({
      component: FormInvitacionPage,
      componentProps: {
        rol:"empleado"      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){     
        console.log(retorno.data)  
        var rol:Rol = new Rol(); 
        rol.id = this.firestore.createId();
        let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
        rol.comercioId = comercio_seleccionadoId;
        rol.user_email = retorno.data;
        rol.rol = "empleado";
        rol.estado = "pendiente";
        this.rolesServices.create(rol); 

        this.profesional.rolId = rol.id;     
        this.profesional.email = rol.user_email;

      }        
    });
    return await modal.present();
  }

  async openAddHorario(){
    const modal = await this.modalCtrl.create({
      component: FormHorarioPage
    });  
    await modal.present();

    modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno.data);
      if(retorno.data)
        this.profesional.horarios.push(retorno.data);
      this.ordenarHorarios();
    });
  } 

  async eliminarHorario(i){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el horario?',
      message: '',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {           
            this.profesional.horarios.splice(i,1);
            this.ordenarHorarios();
          }
        }
      ]
    });
    await alert.present();

    
  }

  ordenarHorarios(){
   

    this.profesional.horarios.sort((ob1,ob2) =>{
      if (ob1.dia > ob2.dia) {
          return 1;
      } else if (ob1.dia < ob2.dia) { 
          return -1;
      }
  
      // Else go to the 2nd item
      if (ob1.desde < ob2.desde) { 
          return -1;
      } else if (ob1.desde > ob2.desde) {
          return 1
      } else { // nothing to split them
          return 0;
      }
    })
  }

  guardar(){
    this.modalCtrl.dismiss(this.profesional);
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }


}
