import { Component, OnInit } from '@angular/core';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { CtaCorriente } from '../models/ctacorriente';
import { Subscription } from 'rxjs';
import { ClientesService } from '../Services/clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../Services/loading.service';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MovimientosService } from '../Services/movimientos.service';

@Component({
  selector: 'app-details-cta-corriente',
  templateUrl: './details-cta-corriente.page.html',
  styleUrls: ['./details-cta-corriente.page.scss'],
})
export class DetailsCtaCorrientePage implements OnInit {

  private ctaCorriente:CtaCorriente;
  public clientes=[];
  private ctaSubs:Subscription;
  private clienteSubs:Subscription;
  private movSubs:Subscription;


  public palabraFiltro ="";
  public items:MovimientoCtaCorriente[]=[];


  constructor(
    private ctasCorreintesService:CtaCorrientesService,
    private clientesServices:ClientesService,
    private route:ActivatedRoute,
    private router:Router,
    private authenticationSerivce:AuthenticationService,
    private alertController:AlertController,
    private loadingService:LoadingService,
    private movimientosService:MovimientosService
  ) { 
    this.ctaCorriente = new CtaCorriente(this.authenticationSerivce.getUID(), this.authenticationSerivce.getNombre());
  }


  ngOnInit() {

    
  
  }


  ionViewDidEnter(){
    this.loadingService.presentLoading();   
    this.ctaSubs = this.ctasCorreintesService.get(this.route.snapshot.params.id).subscribe(snapshot =>{
      this.ctaCorriente.asignarValores(snapshot.payload.data());
      this.ctaCorriente.id = snapshot.payload.id;   
    
      this.loadingService.dismissLoading();

      this.clientes=[];
      this.ctaCorriente.coTitularesId.forEach(titularId => {
        this.clienteSubs = this.clientesServices.get(titularId).subscribe(snap =>{
          let client:any = snap.payload.data();
          client.id = snap.payload.id;
          this.clientes.push(client);
        })
      });
    })

    this.loadingService.presentLoading();
    this.movSubs = this.movimientosService.getMovimientosCtaCorriente(this.route.snapshot.params.id).subscribe(snapshot=>{
                
      this.loadingService.dismissLoading();
      this.items =[];
      snapshot.forEach((snap: any) => {           
        var item = snap.payload.doc.data();
        item.id = snap.payload.doc.id;  
        if(item.monto < 0)       
          item.extraccion = "true";
        else
          item.deposito = "true";
        this.items.push(item);
        
      });    
        
    }); 
  }

  ionViewDidLeave(){
      this.ctaSubs.unsubscribe();
      this.clienteSubs.unsubscribe();    
      this.movSubs.unsubscribe(); 
  }

  depositar(){
    this.router.navigate(['form-deposito-cta-corriente',{
      id: this.ctaCorriente.id
    }]);
  } 

  extraer(){
    this.router.navigate(['form-extraccion-cta-corriente',{
      id: this.ctaCorriente.id
    }]);
  }

  async eliminar(item){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar?',
      message: 'Se perderán el registro del mismo',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {  
            
              this.movimientosService.eliminarMovimientoCtaCorriente(item);  
            
          }
        }
      ]
    });
    await alert.present();

    
  }

}
