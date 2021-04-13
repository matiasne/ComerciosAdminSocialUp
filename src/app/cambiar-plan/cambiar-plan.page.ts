import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-plan',
  templateUrl: './cambiar-plan.page.html',
  styleUrls: ['./cambiar-plan.page.scss'],
})
export class CambiarPlanPage implements OnInit {


  constructor( 
    private modalCtrl:ModalController
  ) {
   }

  ngOnInit() {
    //si el usuario es plan free mustra una cosa
    //si el usuario es plan spark muestra otra cosa
  }

  cerrar(){
    this.modalCtrl.dismiss()
  }
}
