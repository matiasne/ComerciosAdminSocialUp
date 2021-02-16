import { Component, OnInit } from '@angular/core';
import { ComerciosService } from '../Services/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comercio } from '../Models/comercio';
import { AuthenticationService } from '../Services/authentication.service';

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
  public rolActual = "";

  constructor(
    private comerciosService:ComerciosService,
    private route:ActivatedRoute,
    private router:Router,
    private authService:AuthenticationService
  ) { 
    this.comercio = new Comercio();
  }

  ngOnInit() {
    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      this.comercio.asignarValores(data);
    });

    let obs = this.authService.observeRol().subscribe(data=>{
      this.rolActual = data;
      console.log(this.rolActual)
      //Aca setea todos los shows
      obs.unsubscribe();
    })
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
  
  verImpresora(){
    this.router.navigate(['form-impresora-config']);
  }  
  
  update(){
    this.comerciosService.update(this.comercio);
  }

  


}
