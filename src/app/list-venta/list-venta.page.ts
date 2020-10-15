import { Component, OnInit } from '@angular/core';
import { VentasService } from '../Services/ventas.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-venta',
  templateUrl: './list-venta.page.html',
  styleUrls: ['./list-venta.page.scss'],
})
export class ListVentaPage implements OnInit {

  
  items:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  
  constructor(
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public ventasServices:VentasService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {

    
    
  }

  ionViewDidEnter(){

    this.ultimoItem = "";
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro;

  }

  ionViewDidLeave(){
    this.subsItems.unsubscribe(); 
  }

  

  seleccionar(item){
    this.modalCtrl.dismiss({
      'item': item
    });
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

  buscar(){
    
  }

}
