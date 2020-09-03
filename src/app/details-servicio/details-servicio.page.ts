import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../Services/clientes.service';
import { ServiciosService } from '../Services/servicios.service';
import { SubscripcionesService } from '../Services/subscripciones.service';

@Component({
  selector: 'app-details-servicio',
  templateUrl: './details-servicio.page.html',
  styleUrls: ['./details-servicio.page.scss'],
})
export class DetailsServicioPage implements OnInit {

  public servicio:any;
  public clientes:any = [];

  constructor(
    private route: ActivatedRoute,
    public clientesServices:ClientesService,
    public serviciosServices:ServiciosService,
    public subscripcionesService:SubscripcionesService,
    public router:Router,
  ) { 

    var subsCliente = this.serviciosServices.get(this.route.snapshot.params.id).subscribe(resp=>{
      
      this.servicio = resp.payload.data();      
     
      /*this.subscripcionesService.getByServicio(this.route.snapshot.params.id).subscribe((snapshot) => {
        this.clientes = [];
        snapshot.forEach((snap: any) => {         
          console.log(snap);      
          this.clientesServices.get(snap.servicioId).subscribe((snapshot2)=>{
            snap.servicio = snapshot2.payload.data();
            this.clientes.push(snap);
            console.log(this.clientes);
          });
        });      
        subsCliente.unsubscribe();
      })*/   
    })

  }

  ngOnInit() {
  }

}
