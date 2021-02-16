import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Comanda } from 'src/app/models/comanda';
import { Comercio } from 'src/app/Models/comercio';
import { ComandasService } from 'src/app/Services/comandas.service';
import { ComerciosService } from 'src/app/Services/comercios.service';
import { PedidoService } from 'src/app/Services/pedido.service';

@Component({
  selector: 'app-card-comanda',
  templateUrl: './card-comanda.component.html',
  styleUrls: ['./card-comanda.component.scss'],
})
export class CardComandaComponent implements OnInit {

  @Input() public item:any;
  @Input() showAvatar = true;
  public comercio:Comercio;

  constructor(
    private comandasService:ComandasService,
    private comercioService:ComerciosService,
    private alertController:AlertController,
    private pedidosService:PedidoService,
  ) { 
    this.comercio = new Comercio();
    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue());
    this.pedidosService.setearPath()
  }

  ngOnInit() {
    console.log(this.item)
  }

  async eliminar(item){ 

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar la comanda?',
      message: '',
      buttons: [
        { 
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {           
           
            let sub = this.pedidosService.get(item.pedidoId).subscribe((data:any)=>{
              
              sub.unsubscribe()
              if(data){
                data.productos.forEach(prod => {
                  item.productos.forEach(prodC =>{
                    if(prod.id == prodC.id){
                      prod.estadoComanda = "Rechazado"
                    }
                  })        
                });
                this.pedidosService.update(data).then(data=>{
                  console.log("actualizado")                  
                })

              }
              else{
                console.log("El pedido que se intenta actualizar no existe...")
              }
              this.comandasService.rechazado(item);
              
            })  
          }
        }
      ]
    });
    await alert.present();
    
  }

  finalizarComanda(item:Comanda){
    console.log(item.id)
    this.comandasService.delete(item);  
    
  }

  comandaTomada(item:Comanda){
    console.log(item);
    this.comandasService.setComandaTomada(item);
    let sub = this.pedidosService.get(item.pedidoId).subscribe((data:any)=>{
      console.log(data);
      sub.unsubscribe()
      data.productos.forEach(prod => {
        item.productos.forEach(prodC =>{
          if(prod.id == prodC.id){
            prod.estadoComanda = "En proceso"
          }
        })        
      });
      this.pedidosService.update(data).then(data=>{
        console.log("actualizado")
      })
    })
  }  

  comandaVolver(item:Comanda){
    console.log(item);
    this.comandasService.setComandaVolver(item);
    let sub = this.pedidosService.get(item.pedidoId).subscribe((data:any)=>{
      console.log(data);
      sub.unsubscribe()
      data.productos.forEach(prod => {
        item.productos.forEach(prodC =>{
          if(prod.id == prodC.id){
            prod.estadoComanda = "En proceso"
          }
        })        
      });
      this.pedidosService.update(data).then(data=>{
        console.log("actualizado")
      })
      
    })

   

  }  

  comandaLista(item:Comanda){
    this.comandasService.setComandaLista(item);
    let sub = this.pedidosService.get(item.pedidoId).subscribe((data:any)=>{
      console.log(data);
      sub.unsubscribe()
      data.productos.forEach(prod => {
        item.productos.forEach(prodC =>{
          if(prod.id == prodC.id){
            prod.estadoComanda = "Listo"
          }
        })        
      });
      this.pedidosService.update(data).then(data=>{
        console.log("actualizado")
      })
    })
  }  

  comandaSuspender(item:Comanda){
    this.comandasService.setComandaSuspendida(item);
    let sub = this.pedidosService.get(item.pedidoId).subscribe((data:any)=>{
      console.log(data);
      sub.unsubscribe()
      data.productos.forEach(prod => {
        item.productos.forEach(prodC =>{
          if(prod.id == prodC.id){
            prod.estadoComanda = "Pendiente"
          }
        })        
      });
      this.pedidosService.update(data).then(data=>{
        console.log("actualizado")
      })
    })
  }  

}
