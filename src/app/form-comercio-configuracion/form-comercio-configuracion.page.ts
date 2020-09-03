import { Component, OnInit } from '@angular/core';
import { ComerciosService } from '../Services/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comercio } from '../models/comercio';
import { CajasService } from '../Services/cajas.service';
import { CategoriasService } from '../Services/categorias.service';
import { HorariosService } from '../Services/horarios.service';

@Component({
  selector: 'app-form-comercio-configuracion',
  templateUrl: './form-comercio-configuracion.page.html',
  styleUrls: ['./form-comercio-configuracion.page.scss'],
})
export class FormComercioConfiguracionPage implements OnInit {

  private subs:Subscription;
  public comercio:Comercio;

  public cajas =[];
  public horarios =[];
  public categorias = [];

  constructor(
    private comerciosService:ComerciosService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.comercio = new Comercio();
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.subs = this.comerciosService.get(comercio_seleccionadoId).subscribe(data=>{
      this.comercio.asignarValores(data.payload.data());
      this.comercio.id = data.payload.id;
      this.subs.unsubscribe();
    });
  } 
  
  openEditCategorias(){
    this.router.navigate(['list-categorias']);
  }

  openEditCajas(){
    this.router.navigate(['list-cajas']);
  }

  openEditHorarios(){
    this.router.navigate(['list-horarios']);
  }

  openEditMesas(){
    this.router.navigate(['list-mesas']);
  }


  openEditComandas(){
    this.router.navigate(['form-comanda-configuracion']);
  }

  openEditPedidos(){
    this.router.navigate(['form-pedidos-configuracion']);
  }

  verPersonal(){
    this.router.navigate(['list-empleados']);
  }


  linkWhatsapp(){
    this.router.navigate(['details-whatsapp']);
  }
  



}
