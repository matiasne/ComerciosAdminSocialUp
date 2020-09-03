import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { CategoriasService } from '../Services/categorias.service';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../models/categoria';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-categoria',
  templateUrl: './form-categoria.page.html',
  styleUrls: ['./form-categoria.page.scss'],
})
export class FormCategoriaPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;

  public updating:boolean = false;
  public comercioId = "";
  public categoria:Categoria;
  
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,    
    private categoriasService:CategoriasService,
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private navParams:NavParams,
    private toastServices:ToastService,
  ) {
    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });
    
   }

  ngOnInit() {

    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });

    if(this.navParams.get('categoria')){
      let categoria = this.navParams.get('categoria');
      console.log(categoria);
      this.updating = true;
      this.datosForm = this.formBuilder.group({
        nombre: [categoria.nombre, Validators.required],
      });
      this.categoria.nombre = categoria.nombre;
      this.categoria.comercioId = categoria.comercioId;
      this.categoria.id = categoria.id;
      this.categoria.foto = categoria.foto;


    }   
    else{
      this.categoria = new Categoria();
      this.categoria.comercioId = this.navParams.get('comercioId'); 
    }

   

    
  }

  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;
    // stop here if form is invalid

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }   

    this.categoria.nombre = this.datosForm.controls.nombre.value;

    if(this.updating){
      this.categoriasService.update(this.categoria);
    }
    else{
      this.categoriasService.create(this.categoria);
    }

    this.modalCtrl.dismiss();
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  elimiar(){
    this.presentAlertEliminar();
  }

  imagenSeleccionadaIcono(newValue : any){
    console.log(newValue);
    this.categoria.foto = newValue;
   }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar la categoría?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.categoriasService.delete(this.categoria);
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

}
