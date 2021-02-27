import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { EnumEstadoComanda } from '../Models/pedido';
import { AuthenticationService } from '../Services/authentication.service';
import { ComentariosService } from '../Services/comentarios.service';
import { LoadingService } from '../Services/loading.service';
import { PedidoService } from '../Services/pedido.service';

@Component({
  selector: 'app-list-pedidos',
  templateUrl: './list-pedidos.page.html',
  styleUrls: ['./list-pedidos.page.scss'],
})
export class ListPedidosPage implements OnInit {

  public seccionActiva = "curso";

  public pedidosAll:any = []
  public pedidos:any =[]
  public palabraFiltro = "";
  public userRol = "";

  constructor(
    private pedidosService:PedidoService,
    private alertController:AlertController,
    public router:Router,
    public modalController:ModalController,
    public loadingService:LoadingService,
    public comentariosService:ComentariosService,
    public authService:AuthenticationService
  ) { }

  ngOnInit() {
    this.authService.userRol.subscribe(rol =>{
      this.userRol = rol;
    })
  }

  ionViewDidEnter(){ 
    this.pedidosService.setearPath()
    this.loadingService.presentLoadingText("Cargando Pedidos") 
    this.refrescar();
    
  }

  

  onChange(event){
    this.palabraFiltro = event.target.value;    
    this.buscar();
  }
 
  reanudar(item){ 
    item.suspendido = 0;
    item.searchLogic = "00";
    this.pedidosService.update(item).then(data=>{
      console.log("El pedido ha sido suspendido");
      this.refrescar();
    })  
  }

  async cancelar(item){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea suspender el pedido en curso?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Sí',
          handler: () => {               
            item.suspendido = 1;
            item.searchLogic = "10";
            this.pedidosService.update(item).then(data=>{
              console.log("El pedido ha sido suspendido");
              this.refrescar();
            })     
          }
        }
      ]
    });
    await alert.present();   
  }

  async seleccionar(item){
   
    if(item.suspendido == 0){
      const modal = await this.modalController.create({
        component: DetailsPedidoPage,
        componentProps: {pedido: item}
      });

      modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno); 

      if(retorno.data == "ok"){    
          
        this.pedidosService.update(item).then(data=>{
          console.log(data)
          this.refrescar();

        })       
      }     
    });

      return await modal.present();
    }
     
    

  }


  buscar(){ 

    var retorno = false;

    this.pedidos = []; 

    console.log(this.pedidosAll)

    this.pedidosAll.forEach(item => {  
      
      var encontrado = true; 
      
      if(this.userRol == "Administrador"){
        encontrado = true;
      }
      else{
        if(this.authService.getActualUserId() == item.personalId)
          encontrado = true;
      } 

      console.log(encontrado)
      if(encontrado){
        encontrado = false;

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
        else{
          encontrado = true; 
        }
      }      

      console.log(encontrado)
      if(encontrado){         

          let countListos = 0      
          item.productos.forEach(element => {

            this.comentariosService.setearPath("pedidos",item.id);   
            let obs =this.comentariosService.list().subscribe(data =>{
              item.cantidadComentarios = data.length;
              //obs.unsubscribe();
              console.log("!!!!!!!!!!!!!!!!")
            })
            console.log(element)

            
            if(element.estadoComanda == "Listo")
              countListos++; 
            
          });  
          
          item.countListos = countListos    

          this.pedidos.push(item)
      //  }        
        return true;
      }
      
    });  
    this.loadingService.dismissLoading(); 
   
  }

  segmentChanged(event){
    console.log(event.target.value);
    this.seccionActiva = event.target.value;
    this.pedidosAll = [];
    this.refrescar();
  }

  refrescar(){
    if(this.seccionActiva == "suspendidos"){
      let obs = this.pedidosService.listSuspendidos().subscribe((pedidos:any)=>{      
        this.pedidosAll = pedidos      
        this.buscar();        
        obs.unsubscribe()
        this.loadingService.dismissLoading();
      });
    }

    if(this.seccionActiva == "cobrados"){
      let obs =  this.pedidosService.listCobrados().subscribe((pedidos:any)=>{      
        this.pedidosAll = pedidos      
        this.buscar();   
        obs.unsubscribe()    
        this.loadingService.dismissLoading();
      });
    }
  
    if(this.seccionActiva == "curso"){
      let obs =this.pedidosService.listCurso().subscribe((pedidos:any)=>{      
        this.pedidosAll = pedidos      
        this.buscar();       
        obs.unsubscribe()
        this.loadingService.dismissLoading();
      });
    }
  }

}
