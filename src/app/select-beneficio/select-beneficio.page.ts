import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BeneficiosService } from '../Services/beneficios.service';

@Component({
  selector: 'app-select-beneficio',
  templateUrl: './select-beneficio.page.html',
  styleUrls: ['./select-beneficio.page.scss'],
})
export class SelectBeneficioPage implements OnInit {

  public beneficios=[];
  
  constructor(
    private modalCtrl:ModalController,
    private beneficiosService:BeneficiosService,
    ) { }

  ngOnInit(){
    this.beneficiosService.list().subscribe(data=>{
      this.beneficios = data;
    })
  }

  
  seleccionar(item){
    this.modalCtrl.dismiss({
      'item': item
    });
  }

  atras(){
    this.modalCtrl.dismiss()
  }
  

}
