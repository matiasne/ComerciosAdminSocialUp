import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { EnumEstadoComanda, EnumEstadoEnCaja, Pedido } from '../models/pedido';
import { AuthenticationService } from '../Services/authentication.service';
import { ComentariosService } from '../Services/comentarios.service';
import { NavegacionParametrosService } from '../Services/global/navegacion-parametros.service';
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
  public userRol = "";
  public fechaDesde = new Date();

  public obsPedidos

  public cEstado = EnumEstadoEnCaja;
  public seccionActiva = this.cEstado.pendiente; 

  public buscando = true;

  constructor(
    private pedidosService:PedidoService,
    private alertController:AlertController,
    public router:Router,
    public modalController:ModalController,
    public loadingService:LoadingService,
    public comentariosService:ComentariosService,
    public authService:AuthenticationService,
    public changeRef:ChangeDetectorRef,
    public navParametrosService:NavegacionParametrosService
  ) { }

  ngOnInit() {
    this.authService.userRol.subscribe(rol =>{
      this.userRol = rol; 
    })
    this.fechaDesde.setDate(this.fechaDesde.getDate() - 2);     
  }

  ionViewDidEnter(){ 
    this.pedidosService.setearPath()
    this.loadingService.presentLoadingText("Cargando Pedidos") 
    this.refrescar();
    this.changeRef.detectChanges()    
  }

  

  onChange(event){
    this.palabraFiltro = event.target.value;    
    this.buscar();
  }

  onChangeAtras(event){
    this.fechaDesde.setDate(this.fechaDesde.getDate() - Number(event.target.value));
    this.refrescar()   
  }
 
  reanudar(item){ 
    item.statusCaja = this.cEstado.pendiente;
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
            item.statusCaja = this.cEstado.suspendido;
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
   
    let editarPedido = new Pedido();
    editarPedido.asignarValores(item);
    
    this.navParametrosService.param = editarPedido;
    this.router.navigate(['details-pedido'])
  }


  buscar(){ 

    var retorno = false;

    this.pedidos = []; 

    this.pedidosAll.forEach(item => {  
      
      var encontrado = true;      

      //si no es administrador solo ve los pedidos generados por el
      if(this.userRol == "Administrador"){
        encontrado = true;
      }
      else{
        if(this.authService.getActualUserId() == item.personalId)
          encontrado = true;
      } 

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

      
      if(encontrado){         

          let countListos = 0      
          item.productos.forEach(element => {

            /*this.comentariosService.setearPath("pedidos",item.id);   
            let obs =this.comentariosService.list().subscribe(data =>{
              item.cantidadComentarios = data.length;
            })*/
            if(element.estadoComanda == "Listo")
              countListos++; 
            
          });   
          
          item.countListos = countListos    
          if(this.seccionActiva == item.statusCaja){
            this.pedidos.push(item)
          }
          
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
 
    if(this.obsPedidos){
      this.obsPedidos.unsubscribe();
    } 

    let date = new Date(this.fechaDesde) 

    this.obsPedidos = this.pedidosService.listFechaDesde(date).subscribe((pedidos:any)=>{
      this.pedidosAll = pedidos; 

      console.log(this.pedidosAll)
      this.buscando = false;
      this.buscar(); 
    })  

  }


}
