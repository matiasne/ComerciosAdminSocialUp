import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CajasService } from '../Services/cajas.service';
import { VentasService } from '../Services/ventas.service';
import { LoadingService } from '../Services/loading.service';
import { AlertController } from '@ionic/angular';
import { Caja } from '../models/caja';
import { MovimientoCaja } from '../models/movimientoCaja';
import { MovimientosService } from '../Services/movimientos.service';

@Component({
  selector: 'app-details-caja',
  templateUrl: './details-caja.page.html',
  styleUrls: ['./details-caja.page.scss'],
})
export class DetailsCajaPage implements OnInit {

  public items:MovimientoCaja[] = [];
  public caja:Caja;
  public movSubs:Subscription;
  
  public totalGeneral = 0;

  public optionCaja = "";


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
    private route:ActivatedRoute
  ) { 

    this.caja = new Caja();
    this.caja.id = this.route.snapshot.params.id;
    
  }

  ngOnInit() {
    
  }

  ionViewDidEnter(){

    let cajaSub = this.cajasService.get(this.caja.id).subscribe(data=>{
      this.caja.asignarValores(data);
      //cajaSub.unsubscribe();
    })
   
    this.movSubs = this.movimientosService.getMovimientosCaja(this.caja.id).subscribe(snapshot =>{
      
      this.items = [];
      snapshot.forEach((snap: any) => {  

        var mov = snap.payload.doc.data();
        mov.id = snap.payload.doc.id;   
        
        if(mov.monto > 0)
          mov.pago =true;   
        else
          mov.egreso = true; 
          
        if(mov.isCierre){
          mov.pago = false;   
          mov.egreso = false; 
          mov.cierre = true;
          mov.apertura = false;
        }    

        if(mov.isApertura){
          mov.pago = false;   
          mov.egreso = false; 
          mov.cierre = false;
          mov.apertura = true;
        }    
        
        if(mov.createdAt)
          mov.createdAt = this.toDateTime(mov.createdAt.seconds)
        
        
        this.items.push(mov);  
      });    
      console.log(this.items)     
    }); 
         
          
  }

  toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  ionViewDidLeave(){
    console.log("!!!!!!!!!!!LEAVE")
    this.movSubs.unsubscribe();
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
