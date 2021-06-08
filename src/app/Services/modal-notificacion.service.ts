import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNotificacionPage } from '../modal-notificacion/modal-notificacion.page';

@Injectable({
  providedIn: 'root'
})
export class ModalNotificacionService {

  constructor(
    private modalController:ModalController
  ) { }

  async success(titulo,subtitulo){
    const modal = await this.modalController.create({
      component: ModalNotificacionPage,
      componentProps:{titulo:titulo, subtitulo:subtitulo,iconOk:true},
      cssClass: 'modal-notificacion-wrapper moda-succes-border' ,
      id:"notificacion"     
    });
    
    modal.present().then(()=>{
      setTimeout(()=>{
        modal.dismiss()
      },500)

    })
  }

  async trash(titulo,subtitulo){
    const modal = await this.modalController.create({
      component: ModalNotificacionPage,
      componentProps:{titulo:titulo, subtitulo:subtitulo,iconTrash:true,iconOk:false},
      cssClass: 'modal-notificacion-wrapper modal-error-border'      
    });
    
    modal.present().then(()=>{
      setTimeout(()=>{
        modal.dismiss()
      },300)

    })
  }
}
