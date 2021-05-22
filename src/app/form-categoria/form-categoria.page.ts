import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { CategoriasService } from '../Services/categorias.service';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../models/categoria';
import { ToastService } from '../Services/toast.service';
import { WoocommerceSyncData } from '../models/woocommerceSyncData';
import { ComerciosService } from '../Services/comercios.service';
import { Comercio } from '../models/comercio';
import { AngularFirestore } from 'angularfire2/firestore';

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
  public titulo = "";
  public woocommerceSyncData:WoocommerceSyncData;
  public comercio:Comercio
  
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,    
    private categoriasService:CategoriasService,
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private navParams:NavParams,
    private toastServices:ToastService,
    private comerciosService:ComerciosService,
    private firestore: AngularFirestore,
  ) {
    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });

    this.woocommerceSyncData = new WoocommerceSyncData()
    this.comercio = new Comercio()
    this.comercio.asignarValores(this.comerciosService.getSelectedCommerceValue())
   }

  ngOnInit() {

    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });

    if(this.navParams.get('categoria')){
      let categoria = this.navParams.get('categoria');
      console.log(categoria);
      this.updating = true;
      this.titulo = "Editar Categoria";
      this.datosForm = this.formBuilder.group({
        nombre: [categoria.nombre, Validators.required],
      });
      this.categoria.nombre = categoria.nombre;
      this.categoria.comercioId = categoria.comercioId;
      this.categoria.id = categoria.id;
      this.categoria.foto = categoria.foto;
    }   
    else{
      this.titulo ="Nueva Categoria";      
      this.categoria = new Categoria();
      this.categoria.id = this.firestore.createId();
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
      this.categoriasService.update(this.categoria).then(data=>{
        console.log("categoria update")
      })
    }
    else{
      this.categoriasService.set(this.categoria.id,this.categoria).then(data=>{
        console.log("categoria creada")
      });
    }

    if(this.comercio.config.woocommerce){
      console.log(this.woocommerceSyncData)
      this.woocommerceSyncData.changeDate = new Date()
      this.woocommerceSyncData.sincronizado = true
      let wSyncData = JSON.parse(JSON.stringify(this.woocommerceSyncData));
      this.categoriasService.updateWoocommerceValues(this.categoria.id,wSyncData);
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
            this.categoriasService.delete(this.categoria.id);

            if(this.comercio.config.woocommerce){
              console.log(this.woocommerceSyncData)
              this.woocommerceSyncData.changeDate = new Date()
              this.woocommerceSyncData.sincronizado = false
              let wSyncData = JSON.parse(JSON.stringify(this.woocommerceSyncData));
              this.categoriasService.deleteWoocommerceValues(this.categoria.id);
            }

            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

}
