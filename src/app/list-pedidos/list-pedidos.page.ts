import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { LoadingService } from '../Services/loading.service';
import { PedidoService } from '../Services/pedido.service';

@Component({
  selector: 'app-list-pedidos',
  templateUrl: './list-pedidos.page.html',
  styleUrls: ['./list-pedidos.page.scss'],
})
export class ListPedidosPage implements OnInit {

  public pedidosAll:any = []
  public pedidos:any =[]
  public palabraFiltro = "";

  constructor(
    private pedidosService:PedidoService,
    private alertController:AlertController,
    public router:Router,
    public modalController:ModalController,
    public loadingService:LoadingService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.pedidosService.setearPath()
    this.loadingService.presentLoadingText("Cargando Pedidos")
    this.pedidosService.list().subscribe((pedidos:any)=>{   
      this.loadingService.dismissLoading()               
      this.pedidosAll = pedidos;      
      this.pedidosAll.forEach(pedido => {
        let countPendientes = 0
        let countEnProcesos = 0
        let countListos = 0
        let countRechazados = 0


        pedido.productos.forEach(element => {

          console.log(element)

          if(element.estadoComanda == "")
            countPendientes++;             
          if(element.estadoComanda == "Pendiente")
            countPendientes++;
          if(element.estadoComanda == "En proceso") 
            countEnProcesos++;
          if(element.estadoComanda == "Listo")
            countListos++; 
          if(element.estadoComanda == "Rechazado")
            countRechazados++;
        }); 
        pedido.countPendientes = countPendientes   
        pedido.countEnProcesos = countEnProcesos   
        pedido.countListos = countListos   
        pedido.countRechazados = countRechazados   
        this.loadingService.dismissLoading()
      });        
      this.buscar();
    });

    
  }

  onChange(event){
    this.palabraFiltro = event.target.value;    
    this.buscar();
  }


  async cancelar(item){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar el pedido en curso?',
      message: 'Se eliminaran las comandas y los productos cargados en las mesas',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {   
            
            //aca eliminar productos en mesa

            this.pedidosService.delete(item.id);  
          }
        }
      ]
    });
    await alert.present();   
  }

  async seleccionar(item){
   
      const modal = await this.modalController.create({
        component: DetailsPedidoPage,
        componentProps: {pedido: item}
      });

      modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno); 

      if(retorno.data == "ok"){        
        this.pedidosService.delete(item.id).then(data=>{
          console.log(data)
        })       
      }     
    });

      return await modal.present();
    

  }

  buscar(){ 

    var retorno = false;

    this.pedidos = [];
    
    this.pedidosAll.forEach(item => {  
      
      var encontrado = true;    
      
      if(this.palabraFiltro != ""){

        encontrado = false;
        var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")      
      
        if(item.clienteNombre){
          retorno =  (item.clienteNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }

        if(item.mesaNombre){
          retorno =  (item.mesaNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }   
        
        if(item.personalEmail){
          retorno =  (item.personalEmail.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }  

        if(item.personalNombre){
          retorno =  (item.personalNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }  
      }      

      if(encontrado){       
        this.pedidos.push(item);     
        return true;
      }
    });  
  
   
  }



}
