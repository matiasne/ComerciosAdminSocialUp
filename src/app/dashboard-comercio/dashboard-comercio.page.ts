import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CajasService } from '../Services/cajas.service';
import { ComandasService } from '../Services/comandas.service';
import { MesasService } from '../Services/mesas.service';
import { Comercio } from '../Models/comercio';
import { CarritoService } from '../Services/global/carrito.service';

@Component({
  selector: 'app-dashboard-comercio',
  templateUrl: './dashboard-comercio.page.html',
  styleUrls: ['./dashboard-comercio.page.scss'],
})
export class DashboardComercioPage implements OnInit {

  public comercio:Comercio;
  constructor(
    private cajasService:CajasService,
    public router:Router,
    private comandasService:ComandasService,
    private mesasService:MesasService,
    private carritoService:CarritoService
  ) { }

  ngOnInit() {
    this.carritoService.vaciar()
  }

  ionViewDidEnter(){
    this.cajasService.setearPath();
    this.mesasService.setearPath();
   
    this.comandasService.getAll().subscribe(snap =>{
      this.comandasService.setCantidad(snap.length);
    })

    
    
  }

  irVentas(){
    this.router.navigate(['dashboard-ventas']);
  }

  irSubscripciones(){
    this.router.navigate(['dashboard-subscripciones']);
  }

  irClientes(){
    this.router.navigate(['dashboard-clientes']);
  }

  irProductos(){
    this.router.navigate(['dashboard-productos']);
  }

  irServicios(){
    this.router.navigate(['dashboard-servicios']);
  }

  irServiciosProductos(){
    this.router.navigate(['list-productos-servicios']);
  }

  irPersonal(){
    this.router.navigate(['list-personal']);
  }

}
