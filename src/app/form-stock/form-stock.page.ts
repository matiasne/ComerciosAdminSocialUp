import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Producto } from '../models/producto';
import { variacionStock } from '../models/variacionStock';
import { ProductosService } from '../Services/productos.service';
import { VariacionesStocksService } from '../Services/variaciones-stocks.service';

@Component({
  selector: 'app-form-stock',
  templateUrl: './form-stock.page.html',
  styleUrls: ['./form-stock.page.scss'],
})
export class FormStockPage implements OnInit {
  
  public producto:any;
  public nuevoStock = 0;

  constructor(
    private productosService:ProductosService,
    private modalCtrl:ModalController,
    private navParams:NavParams,
    private variacionesStockService:VariacionesStocksService
  ) {
    this.producto = this.navParams.get('producto');
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
     
       
      let vStock:variacionStock = new variacionStock();
      vStock.productoId = this.producto.id;
      vStock.stock = this.producto.stock;
      this.variacionesStockService.setPathProducto(this.producto.id);
      
      this.variacionesStockService.add(vStock).then(resp =>{
        console.log("variacion Guardada");
        let data = {
          "stock":this.producto.stock
        }
        this.productosService.updateValue(this.producto.id,data).then(data=>{
          console.log("Actualizado")
        })
      })

    });

    //guardar el registro del stock actual con fecha
  }

}
