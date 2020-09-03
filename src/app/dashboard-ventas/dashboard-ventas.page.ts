import { Component, OnInit } from '@angular/core';
import { ListVentaPage } from '../list-venta/list-venta.page';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { VentasService } from '../Services/ventas.service';

@Component({
  selector: 'app-dashboard-ventas',
  templateUrl: './dashboard-ventas.page.html',
  styleUrls: ['./dashboard-ventas.page.scss'],
})
export class DashboardVentasPage implements OnInit {

  items:any=[];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  
  constructor(
    public router:Router,
    public modalController: ModalController,
    public ventasService:VentasService,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.buscar();
  }  

  buscar(){

    this.palabraFiltro = this.palabraFiltro.toLowerCase(); 
    this.items =[];
     
    this.ultimoItem = "";  
    this.presentLoading();
     
  }

  showMore(event){ 

    console.log(this.ultimoItem);

    
  }

  async presentLoading() {
    this.loadingActive = true;
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
  }


  hideLoading(){
    if(this.loadingActive){
      this.loadingController.dismiss();
      this.loadingActive = false;
    }
  }
  

}
