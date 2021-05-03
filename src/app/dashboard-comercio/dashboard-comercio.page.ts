import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CajasService } from '../Services/cajas.service';
import { MesasService } from '../Services/mesas.service';
import { Comercio } from '../models/comercio';
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
    private mesasService:MesasService,
    private carritoService:CarritoService
  ) { }

  ngOnInit() {
    this.carritoService.vaciar()
  }

  ionViewDidEnter(){
   
    
    
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
  
  irEgresoCaja(){
    this.router.navigate(['form-egreso-caja']);
  }

}
