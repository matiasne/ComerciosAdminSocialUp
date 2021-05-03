import { Component, OnInit } from '@angular/core';
import { ComerciosService } from '../Services/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comercio } from '../models/comercio';
import { AuthenticationService } from '../Services/authentication.service';
import { FormComercioPage } from '../form-comercio/form-comercio.page';
import { AlertController, ModalController } from '@ionic/angular';
import { RolesService } from '../Services/roles.service';
import { Rol } from '../models/rol';

@Component({
  selector: 'app-form-comercio-configuracion',
  templateUrl: './form-comercio-configuracion.page.html',
  styleUrls: ['./form-comercio-configuracion.page.scss'],
})
export class FormComercioConfiguracionPage implements OnInit {

  private subs:Subscription;
  public comercio:Comercio;

  public cajas =[];
  public horarios =[];
  public categorias = [];
  public rolActual:any;

  constructor(
    private comerciosService:ComerciosService,
    private route:ActivatedRoute,
    private router:Router,
    private authService:AuthenticationService,
    private modalCtrl:ModalController,
    private alertController:AlertController,
    private rolesService:RolesService
  ) { 
    this.comercio = new Comercio();
  }

  ngOnInit() {
    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      this.comercio.asignarValores(data);
    });

    
  } 

  ionViewDidEnter(){
    let obs = this.authService.observeRol().subscribe(data=>{
      this.rolActual = data.rol;
      console.log(this.rolActual)
      //Aca setea todos los shows
      obs.unsubscribe();
    })
  }

  async editarComercio(){
    // this.seleccionar(item);
 
     const modal = await this.modalCtrl.create({
       component: FormComercioPage,
       componentProps: {
         comercio:this.comercio      
       }
     });
    
     return await modal.present();
     
 
 
   }

   async desvincular(){   

    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar el comercio?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Desvincular',
          handler: () => {
            this.rolesService.delete(this.rolActual.id);
            this.router.navigate(['home']);
          }
        }
      ]
    });
    await alert.present();
  }


  openEditOpciones(){
    this.router.navigate(['list-grupos-opciones']); 
  }
  
  openEditCategorias(){
    this.router.navigate(['list-categorias']);
  }

  openEditCajas(){
    this.router.navigate(['list-cajas']);
  }

  openEditHorarios(){
    this.router.navigate(['list-horarios']);
  }

  openEditMesas(){
    this.router.navigate(['list-mesas']);
  }

  openEditCocinas(){
    this.router.navigate(['list-cocinas']);
  }

  openEditComandas(){
    this.router.navigate(['form-comanda-configuracion']);
  }

  openEditPedidos(){
    this.router.navigate(['form-pedidos-configuracion']);
  }

  verPersonal(){
    this.router.navigate(['list-personal']);
  }

  linkWhatsapp(){
    this.router.navigate(['details-whatsapp']);
  }
  
  verImpresora(){
    this.router.navigate(['form-impresora-config']);
  }  

  openEditWoocommerce(){
    this.router.navigate(['form-woocommerce-configuracion']);
  }

  openBeneficiosClientes(){
    this.router.navigate(['list-beneficios']);
  }

  openBeneficiosPuntaje(){
    
  }
  
  update(){

    if(!this.comercio.config.clientes){
      this.comercio.config.beneficiosClientes = false;
      this.comercio.config.beneficiosPorPuntaje = false;
    }
    this.comerciosService.update(this.comercio);
  }

  


}
