import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../Services/categorias.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { FormCategoriaPage } from '../form-categoria/form-categoria.page';

@Component({
  selector: 'app-list-categorias',
  templateUrl: './list-categorias.page.html',
  styleUrls: ['./list-categorias.page.scss'],
})
export class ListCategoriasPage implements OnInit {

  private categoriasSubs:Subscription;
  public categorias =[];
  public buscando = true;

  constructor(
    private categoriaServices:CategoriasService,
    private modalController:ModalController

  ) { 
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.categoriasSubs = this.categoriaServices.getAll(comercio_seleccionadoId).subscribe(snapshot=>{                 
      this.categorias = [];
      this.buscando = false;
      snapshot.forEach((snap: any) => {           
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;              
          this.categorias.push(item);             
      });
    }); 

  }

  ionViewDidLeave(){
    this.categoriasSubs.unsubscribe();
  }

  ngOnInit() {
  }

  async openEditCategoria(categoria){
    const modal = await this.modalController.create({
      component: FormCategoriaPage, 
      componentProps: { 
        categoria: categoria
      }   
    });
    return await modal.present();
  }

  async openAddCategoria(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    const modal = await this.modalController.create({
      component: FormCategoriaPage,  
      componentProps: { 
        comercioId:comercio_seleccionadoId
      }
    });  
    return await modal.present();
  }


}
