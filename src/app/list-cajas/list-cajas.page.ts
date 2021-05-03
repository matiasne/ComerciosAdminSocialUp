import { Component, OnInit } from '@angular/core';
import { CajasService } from '../Services/cajas.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormCajaPage } from '../form-caja/form-caja.page';
import { Router } from '@angular/router';
import { LoadingService } from '../Services/loading.service';
import { ComerciosService } from '../Services/comercios.service';
import { Comercio } from '../models/comercio';
import { CambiarPlanPage } from '../cambiar-plan/cambiar-plan.page';

@Component({
  selector: 'app-list-cajas',
  templateUrl: './list-cajas.page.html',
  styleUrls: ['./list-cajas.page.scss'],
})
export class ListCajasPage implements OnInit {

  cajasSubs:Subscription;
  public cajas =[];

  public buscando = true;
  public comercio:Comercio
  
  constructor(
    private cajasService:CajasService,
    private modalCtrl:ModalController,
    private router:Router,
    private loadingService:LoadingService,
    private comercioService:ComerciosService
  ) { 
    this.comercio = new Comercio()
    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue())
  }

  ngOnInit() {
    
   

  }

  ionViewDidEnter(){
    this.cajasService.setOrderBy("nombre","desc");
    this.cajasSubs = this.cajasService.list().subscribe((caja:any)=>{        
      this.cajas = caja;  
      this.buscando = false;    
    });
  }

  ionViewDidLeave(){
    this.cajasSubs.unsubscribe();
  }

  seleccionar(cajaId){
    this.router.navigate(['details-caja',{
      id: cajaId
    }]);
  }

  async openAddCaja(){

    if(this.cajas.length > this.comercio.config.productosMaxLength){
      let modal = await this.modalCtrl.create({
        component: CambiarPlanPage,
        componentProps: {
          extraText: "Haz alcanzado el límite de cajas de tu plan: "+this.comercio.plan,
          actualPlan:this.comercio.plan
        }
      });  
      return await modal.present();
    }
    else{
      let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
      const modal = await this.modalCtrl.create({
        component: FormCajaPage,
        componentProps: { 
          comercioId: comercio_seleccionadoId
        }
      });

      return await modal.present();
    }

    
  }

  async openEditCaja(item){
    const modal = await this.modalCtrl.create({
      component: FormCajaPage,
      componentProps: { 
        caja: item
      }
    });  

    return await modal.present();
  }

}
