import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { ClienteEstado } from '../models/clienteEstado';
import { ClientesEstadosService } from '../Services/clientes-estados.service';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-cliente-estado',
  templateUrl: './form-cliente-estado.page.html',
  styleUrls: ['./form-cliente-estado.page.scss'],
})
export class FormClienteEstadoPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;

  public updating:boolean = false;
  public comercioId = "";
  public clienteEstado:ClienteEstado;
  public titulo = "";

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,    
    private clientesEstadoService:ClientesEstadosService,
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

    if(this.navParams.get('categoria')){
      let categoria = this.navParams.get('categoria');
      console.log(categoria);
      this.updating = true;
      this.titulo = "Editar Categoria";
      this.datosForm = this.formBuilder.group({
        nombre: [categoria.nombre, Validators.required],
      });
      this.clienteEstado.nombre = categoria.nombre;
      this.clienteEstado.comercioId = categoria.comercioId;
      this.clienteEstado.id = categoria.id;
    }   
    else{
      this.titulo ="Nueva Categoria";
      this.clienteEstado = new ClienteEstado();
      this.clienteEstado.comercioId = this.navParams.get('comercioId'); 
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

    this.clienteEstado.nombre = this.datosForm.controls.nombre.value;

    if(this.updating){
      this.clientesEstadoService.update(this.clienteEstado);
    }
    else{
      this.clientesEstadoService.add(this.clienteEstado);
    }

    this.modalCtrl.dismiss();
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  elimiar(){
    this.presentAlertEliminar();
  }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar el estado?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.clientesEstadoService.delete(this.clienteEstado.id);
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

}
