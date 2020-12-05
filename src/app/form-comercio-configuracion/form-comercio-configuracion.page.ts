import { Component, OnInit } from '@angular/core';
import { ComerciosService } from '../Services/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comercio } from '../Models/comercio';

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
  ) { 
    this.comercio = new Comercio();
  }

  ngOnInit() {
    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      this.comercio.asignarValores(data);
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

  openEditCocinas(){
    this.router.navigate(['list-cocinas']);
  }

  openEditComandas(){
    this.router.navigate(['form-comanda-configuracion']);
  }

  openEditPedidos(){
    this.router.navigate(['form-pedidos-configuracion']);
  }

  verPersonal(){
    this.router.navigate(['list-personal']);
  }


  linkWhatsapp(){
    this.router.navigate(['details-whatsapp']);
  }
  
  verEstilos(){
    this.router.navigate(['form-estilo-configuracion']);
  }  
  
  update(){
    this.comerciosService.update(this.comercio);
  }

  


}
