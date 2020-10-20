import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HorariosService } from '../Services/horarios.service';
import { FormHorarioPage } from '../form-horario/form-horario.page';
import { ModalController, AlertController } from '@ionic/angular';
import { ComerciosService } from '../Services/comercios.service';
import { Comercio } from '../models/comercio';

@Component({
  selector: 'app-list-horarios',
  templateUrl: './list-horarios.page.html',
  styleUrls: ['./list-horarios.page.scss'],
})
export class ListHorariosPage implements OnInit {

  public horariosSubs:Subscription;
  public horarios = [];
  public comercio:Comercio;
  constructor(
    private comercioService:ComerciosService,
    private modalController:ModalController,
    private alertController:AlertController
  ) { 
    this.comercio = new Comercio();
  }

  ngOnInit() {

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.horariosSubs = this.comercioService.get(comercio_seleccionadoId).subscribe(snap=>{                 
      this.comercio.asignarValores(snap.payload.data());
      this.comercio.id = snap.payload.id;
    });  
    
  }

  ionViewDidLeave(){
    this.horariosSubs.unsubscribe();
  }

  async openAddHorario(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    const modal = await this.modalController.create({
      component: FormHorarioPage,   
      componentProps: { 
        comercioId:comercio_seleccionadoId
      } 
    });  
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data)
        this.comercio.horarios.push(retorno.data);     
        this.comercioService.update(this.comercio);   
    });
    return await modal.present();
  }

  async eliminarHorario(index){

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
            console.log(index);       
            this.comercio.horarios.splice(index,1); 
            this.comercioService.update(this.comercio);   
          }
        }
      ]
    });
    await alert.present();

    
  }

}
