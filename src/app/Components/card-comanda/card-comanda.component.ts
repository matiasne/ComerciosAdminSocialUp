import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Comanda } from 'src/app/models/comanda';
import { Comercio } from 'src/app/Models/comercio';
import { Pedido } from 'src/app/Models/pedido';
import { ComandasService } from 'src/app/Services/comandas.service';
import { ComerciosService } from 'src/app/Services/comercios.service';
import { CarritoService } from 'src/app/Services/global/carrito.service';

@Component({
  selector: 'app-card-comanda',
  templateUrl: './card-comanda.component.html',
  styleUrls: ['./card-comanda.component.scss'],
})
export class CardComandaComponent implements OnInit {

  @Input() public item:any;
  @Input() showAvatar = true;
  public comercio:Comercio;

  constructor(
    private comandasService:ComandasService,
    private comercioService:ComerciosService,
    private alertController:AlertController,
    private carritoService:CarritoService,
    private router:Router
  ) { 
    this.comercio = new Comercio();
    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue());
    console.log(this.comercio)
  }

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

  finalizarComanda(item:Comanda){
    this.comandasService.delete(item.id);  
  }

  comandaTomada(item:Comanda){
    console.log(item);
    this.comandasService.setComandaTomada(item);
  }  

  comandaVolver(item:Comanda){
    console.log(item);
    this.comandasService.setComandaVolver(item);
  }  

  comandaLista(item:Comanda){
    this.comandasService.setComandaLista(item);
  }  

  comandaSuspender(item:Comanda){
    this.comandasService.setComandaSuspendida(item);
  }  

  cobrarComanda(item:Comanda){
    console.log(item);
    this.carritoService.agregarComanda(item);   
    //this.carritoService.carrito =  item.carrito;
    this.router.navigate(['details-carrito',{
      comanda:false,
      cobro:true,
      mesa:false
    }]);
  }

  cobrarPedido(item:Pedido){
    console.log(item);
    this.carritoService.agregarPedido(item);

    //this.carritoService.carrito =  item.carrito;
    this.router.navigate(['details-carrito',{
      comanda:"false",
      cobro:"true",
      mesa:false
    }]);
  }

}
