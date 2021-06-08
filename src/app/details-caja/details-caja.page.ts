import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CajasService } from '../Services/cajas.service';
import { VentasService } from '../Services/ventas.service';
import { LoadingService } from '../Services/loading.service';
import { AlertController } from '@ionic/angular';
import { Caja } from '../models/caja';
import { EnumTipoMovimientoCaja, MovimientoCaja } from '../models/movimientoCaja';
import { MovimientosService } from '../Services/movimientos.service';
import { Comercio } from '../models/comercio';

@Component({
  selector: 'app-details-caja',
  templateUrl: './details-caja.page.html',
  styleUrls: ['./details-caja.page.scss'],
})
export class DetailsCajaPage implements OnInit {

  public enumTipoMovimientoCaja = EnumTipoMovimientoCaja
  
  public items:MovimientoCaja[] = [];
  public caja:Caja;
  
  public totalGeneral = 0;

  public optionCaja = "";

  public fechaDesde = new Date();

  public comercio:Comercio

  public totales = {
    efectivo: 0,
    debito:0,
    credito:0,
    ctaCorriente:0,
    general:0
  }
  constructor(
    public cajasService:CajasService,
    public ventasServices:VentasService,
    public router:Router,
    public loadingService:LoadingService,
    public alertController:AlertController,
    private movimientosService:MovimientosService,
    private route:ActivatedRoute,
    private comercioService:ComerciosService
  ) { 
    this.comercio = new Comercio()
    this.caja = new Caja();
    this.caja.id = this.route.snapshot.params.id;
    this.fechaDesde.setDate(this.fechaDesde.getDate() - 1);

    this.comercio = this.comercioService.getSelectedCommerceValue()
    if(this.comercio.config.movimientosCajas){
      this.movimientosService.setearPath(this.caja.id)
      this.movimientosService.getMovimientosCaja(this.caja.id,this.fechaDesde).subscribe(snapshot =>{
      
        this.items = [];
        snapshot.forEach((snap: any) => {  
          var mov = snap.payload.doc.data();
          mov.id = snap.payload.doc.id;            
          this.items.push(mov);  
        });    
        console.log(this.items)     
      }); 
    }

  }

  ngOnInit() {
    
  }

  onChangeAtras(event){
    this.fechaDesde.setDate(this.fechaDesde.getDate() - Number(event.target.value));
    this.refrescar()   
  }

  refrescar(){
    
    
    
  }

  ionViewDidEnter(){
    
    this.cajasService.get(this.caja.id).subscribe(data=>{
      this.caja.asignarValores(data);
      console.log("Cambiando valores de caja!")
    })
    this.refrescar();        
          
  }


  ionViewDidLeave(){
    
  }
  
  irEgreso(){
    this.router.navigate(['form-egreso-caja',
    {
      cajaId:this.caja.id,
      totalActual: this.caja.totalEfectivo
    }
    ]);
  }

  irIngreso(){
    this.router.navigate(['form-ingreso-caja',
    {
      cajaId:this.caja.id
    }
    ]);
  }

  irCierre(){
    this.router.navigate(['form-cierre-caja',
      {
        cajaId:this.caja.id,
      }
    ]);
  }

  irApertura(){
    this.router.navigate(['form-apertura-caja',
      {
        cajaId:this.caja.id,
      }
    ]);
  }

  async eliminar(item){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el movimiento?',
      message: 'Se perderán los registros del mismo',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {  

            
            this.movimientosService.eliminarMovimientoCaja(this.caja,item);
           
          }
        }
      ]
    });
    await alert.present();    
  }


}
