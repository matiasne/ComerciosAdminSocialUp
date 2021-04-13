import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBeneficioPage } from '../form-beneficio/form-beneficio.page';
import { Beneficio, EnumBeneficioDisparador } from '../models/beneficio';
import { BeneficiosService } from '../Services/beneficios.service';

@Component({
  selector: 'app-list-beneficios',
  templateUrl: './list-beneficios.page.html',
  styleUrls: ['./list-beneficios.page.scss'],
})
export class ListBeneficiosPage implements OnInit {

  public enumBeneficioDisparador = EnumBeneficioDisparador
  public beneficios=[];
  constructor(
    private beneficiosService:BeneficiosService,
    private modalController:ModalController
  ) { 
    this.beneficiosService.setearPath();
    this.beneficiosService.list().subscribe(data=>{
      this.beneficios = data;
    })
  }

  ngOnInit() {
  }

  async editar(beneficio){
    const modal = await this.modalController.create({
      component: FormBeneficioPage,
      componentProps: { 
        beneficio: beneficio
      }
    });

    return await modal.present();
  }

  async openAddBeneficio(){
    const modal = await this.modalController.create({
      component: FormBeneficioPage
    });

    return await modal.present();
  }

}
