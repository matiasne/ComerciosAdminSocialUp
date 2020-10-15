import { Component, OnInit } from '@angular/core';
import { ComandasService } from '../Services/comandas.service';
import { CarritoService } from '../Services/global/carrito.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PedidoService } from '../Services/pedido.service';
import { Subscription } from 'rxjs';
import { Comanda } from '../models/comanda';
import { Pedido } from '../Models/pedido';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-list-comandas',
  templateUrl: './list-comandas.page.html',
  styleUrls: ['./list-comandas.page.scss'],
})
export class ListComandasPage implements OnInit {

  public itemsComandas =[];
  public itemsPedidos = [];
  public items:any =[];
  public subsPedidosComercio:Subscription;
  public rol = "";

  constructor(
    private comandasService:ComandasService,
    private carritoService:CarritoService,
    public router:Router,
    private pedidoService:PedidoService,
    private alertController:AlertController,
    private authService:AuthenticationService
  ) {


   }

  ngOnInit() {

    let rol:any = this.authService.getRol();
    this.rol = rol.rol;
    console.log(rol);
    //si soy dueño todas
    this.comandasService.getAll().subscribe((snapshot) => {
      this.itemsComandas =[];   
      snapshot.forEach((snap: any) => {         
          var comanda = snap.payload.doc.data();
          comanda.id = snap.payload.doc.id;  
          comanda.producto = true;  
          comanda.isPedido = false;
          comanda.carrito = JSON.parse(comanda.carrito);

          comanda.createdAt =  this.toDateTime(comanda.createdAt.seconds) 
         
          this.itemsComandas.push(comanda);         
          
          this.items = [...this.itemsComandas,...this.itemsPedidos];     
      });
      console.log(this.itemsComandas);
    });

    /*let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.subsPedidosComercio = this.pedidoService.getPedidoPendienteByCommerce(comercio_seleccionadoId).subscribe((snapshot) => { 
      this.itemsPedidos = [];  
      
      snapshot.forEach((snap: any) => {
          var p:any = snap.payload.doc.data();
          p.id = snap.payload.doc.id;         
          p.isPedido = true;
          console.log(p);           
          p.createdAt = this.toDateTime(p.createdAt.seconds)
          this.itemsPedidos.push(p); 
          this.items = [...this.itemsComandas,...this.itemsPedidos];
        }); 
        
        console.log(this.itemsPedidos)
    });*/
  }

  toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  



}
