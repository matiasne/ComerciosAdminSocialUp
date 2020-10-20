import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Comanda } from 'src/app/models/comanda';
import { Pedido } from 'src/app/models/pedido';
import { ComandasService } from 'src/app/Services/comandas.service';
import { CarritoService } from 'src/app/Services/global/carrito.service';

@Component({
  selector: 'app-card-comanda',
  templateUrl: './card-comanda.component.html',
  styleUrls: ['./card-comanda.component.scss'],
})
export class CardComandaComponent implements OnInit {

  @Input() public item:any;

  constructor(
    private comandasService:ComandasService,
    private alertController:AlertController,
    private carritoService:CarritoService,
    private router:Router
  ) { }

  ngOnInit() {}

  async eliminar(item){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar la comanda?',
      message: 'Se perderán todos los movimientos y pagos de la misma.',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {           
            this.comandasService.delete(item.id);  
          }
        }
      ]
    });
    await alert.present();

    
  }

  comandaTomada(item:Comanda){
    console.log(item);
    this.comandasService.setComandaTomada(item);
  }  

  comandaLista(item:Comanda){
    this.comandasService.setComandaLista(item);
  }  

  cobrarComanda(item:Comanda){
    console.log(item);
    this.carritoService.agregarComanda(item);   
    //this.carritoService.carrito =  item.carrito;
    this.router.navigate(['details-carrito',{
      comanda:false,
      cobro:true
    }]);
  }

  cobrarPedido(item:Pedido){
    console.log(item);
    this.carritoService.agregarPedido(item);

    //this.carritoService.carrito =  item.carrito;
    this.router.navigate(['details-carrito',{
      comanda:false,
      cobro:true
    }]);
  }

}
