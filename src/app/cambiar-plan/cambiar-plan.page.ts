import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-plan',
  templateUrl: './cambiar-plan.page.html',
  styleUrls: ['./cambiar-plan.page.scss'],
})
export class CambiarPlanPage implements OnInit {

  public text = "";
  public plan = "";

  constructor( 
    private modalCtrl:ModalController,
    private navParams:NavParams
  ) {

    this.text = this.navParams.get('extraText');
    this.plan = this.navParams.get('actualPlan');
   }

  ngOnInit() {
    //si el usuario es plan free mustra una cosa
    //si el usuario es plan spark muestra otra cosa
  }

  cerrar(){
    this.modalCtrl.dismiss()
  }
}
