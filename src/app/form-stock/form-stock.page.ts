import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Producto } from '../models/producto';
import { variacionStock } from '../models/variacionStock';
import { ProductosService } from '../Services/productos.service';
import { VariacionesStocksService } from '../Services/variaciones-stocks.service';
import { WoocommerceService } from '../Services/woocommerce/woocommerce.service';

@Component({
  selector: 'app-form-stock',
  templateUrl: './form-stock.page.html',
  styleUrls: ['./form-stock.page.scss'],
})
export class FormStockPage implements OnInit {
  
  public producto:Producto;
  public nuevoStock = 0;

  constructor(
    private productosService:ProductosService,
    private modalCtrl:ModalController,
    private navParams:NavParams,
    private variacionesStockService:VariacionesStocksService,
    private woocommerceService:WoocommerceService
  ) {
    this.producto = new Producto()
    this.producto.asignarValores(this.navParams.get('producto'));
  }

  ngOnInit() {

  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  guardar(){
    this.producto.stock =  this.producto.stock + this.nuevoStock;
    this.modalCtrl.dismiss();   

    this.productosService.update(this.producto).then(data=>{
      console.log(data);      
      this.woocommerceService.setPart("products")
      this.woocommerceService.actualizarProductoInWC(this.producto)
    });

    let vStock:variacionStock = new variacionStock();
    vStock.productoId = this.producto.id;
    vStock.stock = this.producto.stock;
    this.variacionesStockService.setPathProducto(this.producto.id);
    
    this.variacionesStockService.add(vStock).then(resp =>{
      console.log("variacion Guardada");        
    })

    //guardar el registro del stock actual con fecha
  }

}
