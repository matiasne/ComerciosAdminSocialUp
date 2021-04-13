import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Impresora } from '../models/impresora';
import { AuthenticationService } from '../Services/authentication.service';
import { CocinasService } from '../Services/cocinas.service';
import { ImpresoraService } from '../Services/impresora.service';

@Component({
  selector: 'app-form-impresora-config',
  templateUrl: './form-impresora-config.page.html',
  styleUrls: ['./form-impresora-config.page.scss'],
})
export class FormImpresoraConfigPage implements OnInit {

  public cocinas = [];
  public impresora:Impresora
  public conexionActual = false;

  constructor(
    private cocinasService:CocinasService,
    private impresoraService:ImpresoraService,
    private authService:AuthenticationService,
    private navCtrl:NavController
  ) { 
    this.impresora = new Impresora()
    this.impresoraService.obsEstadoImpresora().subscribe(data=>{
      this.conexionActual = data.conectada;
    })        
  }

  ngOnInit() {
    this.cocinasService.setearPath();
    this.cocinasService.list().subscribe((data) => {     
      this.cocinas = data; 
      this.impresora = this.impresoraService.obtenerImpresora();
      console.log(this.impresora)
    })
  }

  guardar(){

    if(this.impresora.bluetooth && this.impresora.mac == ""){
      alert("Ingrese un valor de MAC ADDRESS");
      return;
    }

    this.impresoraService.guardarImpresora(this.impresora);
    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back()
  }

  atras(){
    this.navCtrl.back()
  }


  probar(){
    this.impresoraService.impresionPrueba(this.authService.getEmail());
  }

}
