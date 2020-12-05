import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddProductoVentaPage } from '../add-producto-venta/add-producto-venta.page';
import { Comercio } from '../Models/comercio';
import { Mesa } from '../models/mesa';
import { SelectProductoPage } from '../select-producto/select-producto.page';
import { ComerciosService } from '../Services/comercios.service';
import { CarritoService } from '../Services/global/carrito.service';
import { LoadingService } from '../Services/loading.service';
import { MesasService } from '../Services/mesas.service';

@Component({
  selector: 'app-details-mesa',
  templateUrl: './details-mesa.page.html',
  styleUrls: ['./details-mesa.page.scss'],
})
export class DetailsMesaPage implements OnInit {

  public mesa:Mesa;
  public comercio:Comercio;
  
  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private modalController:ModalController,
    private carritoService:CarritoService,
    private comercioService:ComerciosService,
    private mesasSerivce:MesasService,
    private loadingService:LoadingService
  ) {
    this.mesa = new Mesa();
    this.comercio = new Comercio();
   }

  ngOnInit() {
    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue())
    this.mesasSerivce.get(this.route.snapshot.params.id).subscribe(data=>{
      this.mesa = data;
      console.log(this.mesa)
    })
    
  }

  ionViewDidLeave(){
    //guardamos el carrito de la mesa
    //vaciamos el carrito local
    
  }

  async cerrarMesa(){
   
    this.loadingService.presentLoading();
    this.carritoService.vaciar();
    this.carritoService.setearMesa(this.mesa);
    this.mesa.productos.forEach(producto =>{
      this.carritoService.agregarProducto(producto);
    })
    this.loadingService.dismissLoading();
    this.router.navigate(['details-carrito',{
      comanda:"false",
      cobro:"true"
    }]);

    
   
  }

  borrarMesa(){
    this.carritoService.vaciar();
    this.mesa.productos = [];
    this.mesasSerivce.update(this.mesa);
  }

  atras(){
    this.carritoService.vaciar();
  }

  eliminarProducto(i){
    this.mesa.productos.splice(i,1);
  }

}
