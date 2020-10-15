import { Component, OnInit } from '@angular/core';
import { ComerciosService } from '../Services/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CajasService } from '../Services/cajas.service';
import { ComandasService } from '../Services/comandas.service';

@Component({
  selector: 'app-dashboard-comercio',
  templateUrl: './dashboard-comercio.page.html',
  styleUrls: ['./dashboard-comercio.page.scss'],
})
export class DashboardComercioPage implements OnInit {

  public comercio:any;
  constructor(
    private comerciosService:ComerciosService,
    private cajasService:CajasService,
    private route: ActivatedRoute,
    public router:Router,
    private comandasService:ComandasService
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter(){
    this.cajasService.setearPath();
    var subsCliente = this.comerciosService.get(this.route.snapshot.params.id).subscribe(resp=>{
      this.comercio = resp.payload.data();
    });

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
