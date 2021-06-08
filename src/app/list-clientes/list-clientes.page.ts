import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController, IonInfiniteScroll } from '@ionic/angular';
import { ClientesService } from '../Services/clientes.service';
import { Cliente } from '../models/cliente';
import { LoadingService } from '../Services/loading.service';
import { FormClientePage } from '../form-cliente/form-cliente.page';
import { CambiarPlanPage } from '../cambiar-plan/cambiar-plan.page';
import { ComerciosService } from '../Services/comercios.service';
import { Comercio } from '../models/comercio';

@Component({
  selector: 'app-list-clientes',
  templateUrl: './list-clientes.page.html',
  styleUrls: ['./list-clientes.page.scss'],
})
export class ListClientesPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public itemsFiltrados:any = [];
  public itemsAll:any = [];
  public itemsRenderizar = [];

  itemsPerPage = 20
  itemsCountRenderizados = 0;

  public palabraFiltro = "";


  public comercio:Comercio

  public buscando = false;
  
  constructor(
    public modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public clientesService:ClientesService,
    public modalCtrl: ModalController,
    public comercioService:ComerciosService
  ) { 
    this.comercio = new Comercio()
    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue())
  }

  ngOnInit() {      

    this.clientesService.list().subscribe(clientes => {     
      this.itemsAll = clientes;
      this.buscar();
    });   
    
  }

  ionViewDidEnter(){    
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro;   
  }

  ionViewDidLeave(){
    
  }

  onChange(event){
    this.palabraFiltro = event.target.value;

    this.buscar();
  }

  verMas(){

    console.log("!!!!! Lazy")
    
    if(this.itemsCountRenderizados < this.itemsPerPage){
      console.log("No hay más!!!"+this.itemsCountRenderizados)
      this.infiniteScroll.complete();
      this.infiniteScroll.disabled = true;
      return;
    }

    let start = this.itemsCountRenderizados;
   
    for(let i=start; i < start+this.itemsPerPage;i++){

      if(this.itemsFiltrados[i] == undefined){
        console.log("No hay más!!! fuera del array"+this.itemsCountRenderizados)
        this.infiniteScroll.complete();
        this.infiniteScroll.disabled = true;
        return;
      }
      
      if(this.itemsFiltrados[i].id){
        this.itemsRenderizar.push(this.itemsFiltrados[i])
        this.itemsCountRenderizados +=1;
        console.log("pushing to render") 
      }
     
    }
    this.infiniteScroll.complete();


  }

  buscar(){
    this.itemsFiltrados = [];
    this.itemsRenderizar = [];
    var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    var retorno = false;

    if(this.palabraFiltro != ""){
      this.itemsAll.forEach((item) => {      
    
        var encontrado = false;
        if(item.nombre){
          retorno =  (item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }

        if(encontrado){
          this.itemsFiltrados.push(item);
          if(this.itemsRenderizar.length < this.itemsPerPage){
            console.log("Renderizando"+item.id)
            this.itemsRenderizar.push(item)
            this.itemsCountRenderizados += 1
          }
        }
      })  
    }
    else{
      this.itemsFiltrados = this.itemsAll;
      for(let i=0; i < this.itemsPerPage;i++){
      
        if(this.itemsFiltrados[i]){
          this.itemsRenderizar.push(this.itemsFiltrados[i])
          this.itemsCountRenderizados +=1;
        }
        else{
          console.log("No hay más!!! fuera del array"+this.itemsCountRenderizados)
       //   this.infiniteScroll.complete();
         // this.infiniteScroll.disabled = true;
          return;
        }
      }
    }
  }

  seleccionar(item){
    this.router.navigate(['details-cliente',{"id":item.id}]);
  }
  
  async nuevo(){

    if(this.itemsAll.length > this.comercio.config.clientesMaxLength){
      let modal = await this.modalCtrl.create({
        component: CambiarPlanPage,
        componentProps: {
          extraText: "Haz alcanzado el límite de clientes de tu plan: "+this.comercio.plan,
          actualPlan:this.comercio.plan
        }
      });  
      return await modal.present();
    }
    else{
      //  this.loadingService.presentLoading();
        const modal = await this.modalController.create({
          component: FormClientePage      
        });
        
        modal.present().then(()=>{
          
        })

        return await modal.present();
    }

  
  }



  async editar(item){
    

      const modal = await this.modalController.create({
        component: FormClientePage,
        componentProps:{
          client:item
        }      
      });
      
      modal.present().then(()=>{
        
      })
  
      return await modal.present();
  }




}
