import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CajasService } from '../Services/cajas.service';
import { VentasService } from '../Services/ventas.service';
import { AlertController } from '@ionic/angular';
import { Caja } from '../models/caja';
import { MovimientoCaja } from '../models/movimientoCaja';
import { MovimientosService } from '../Services/movimientos.service';

@Component({
  selector: 'app-dashboard-cajas',
  templateUrl: './dashboard-cajas.page.html',
  styleUrls: ['./dashboard-cajas.page.scss'],
})
export class DashboardCajasPage implements OnInit {

  public items:MovimientoCaja[] = [];
  public cajas:any = [];  
  public cajaSeleccionada:any;
  public cajaIndex = "9999";
  public movSubs:Subscription;
  public cajasSubs:Subscription;
  
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
    public alertController:AlertController,
    private movimientosService:MovimientosService
  ) { 

    this.cajaSeleccionada = new Caja();
    
  }

  ngOnInit() {
    if(this.cajas[this.cajaIndex])
      this.cajaSeleccionada = this.cajas[this.cajaIndex];
  }

  ionViewDidEnter(){
    this.cajasSubs  = this.cajasService.list().subscribe(cajas=>{
      console.log(cajas);
      this.cajas = cajas;      
      this.cajas.forEach((item: any) => {          
          this.movSubs = this.movimientosService.getMovimientosCaja(item.id).subscribe(snapshot =>{     
            item.movimientos = [];
            snapshot.forEach((snap: any) => {           
              var mov = snap.payload.doc.data();
              mov.id = snap.payload.doc.id;   
              if(mov.monto > 0)
                mov.pago =true;   
              else
                mov.egreso = true; 
                
              if(mov.isCierre){
                mov.pago =false;   
                mov.egreso = false; 
                mov.cierre = true;
              }          
              
              console.log(mov)
              item.movimientos.push(mov);  
            });         
          }); 
         
          console.log(item); 
      });
     
      
    })    
  }

  ionViewDidLeave(){
  }
  
  obtenerDatosCaja(){   

    this.cajaSeleccionada = this.cajas[this.cajaIndex];
    console.log(this.cajaIndex)
       
  }

  irEgreso(){
    this.router.navigate(['form-egreso-caja',
    {
      cajaId:this.cajaSeleccionada.id,
      totalActual: this.cajaSeleccionada.totalEfectivo
    }
    ]);
  }

  irIngreso(){
    this.router.navigate(['form-ingreso-caja',
    {
      cajaId:this.cajaSeleccionada.id
    }
    ]);
  }

  irCierre(){
    this.router.navigate(['form-cierre-caja',
      {
        cajaId:this.cajaSeleccionada.id,
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

            
            this.movimientosService.eliminarMovimientoCaja(this.cajaSeleccionada,item);
           
          }
        }
      ]
    });
    await alert.present();    
  }

  

}
