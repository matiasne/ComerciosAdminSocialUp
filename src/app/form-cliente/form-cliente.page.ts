import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController, ModalController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { ClientesService } from '../Services/clientes.service';
import { DataService } from '../Services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { AuthenticationService } from '../Services/authentication.service';
import { FormDireccionPage } from '../form-direccion/form-direccion.page';
import { LoadingService } from '../Services/loading.service';
import { Cliente } from '../models/cliente';
import { Subscription } from 'rxjs';
import { ToastService } from '../Services/toast.service';
import { SelectClientePage } from '../select-cliente/select-cliente.page';

declare var google: any;

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.page.html',
  styleUrls: ['./form-cliente.page.scss'],
})
export class FormClientePage implements OnInit {

  @ViewChild('map',{static: false}) mapElement: ElementRef;
  public map: any;

  public autocomplete:any;
  public place:any;
  public markers:any =[];
  public posicion:any;
  public geocoder:any;
  public direccion_piso = "";
  public direccion_puerta ="";

  public cliente:Cliente;

  public clienteSubs:Subscription;

  datosForm: FormGroup;
  submitted = false;

  croppedImagepath = "";
  

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 5
  };

  public updating:boolean = false;
  public titulo = "Nuevo Cliente";
  
  constructor(
    private formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private crop: Crop,
    public actionSheetController: ActionSheetController,
    private file: File,
    private clientesService:ClientesService,
    private dataService:DataService,
    public router:Router,
    public modalController: ModalController,
    private authService:AuthenticationService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public loadingService:LoadingService,
    private toastServices:ToastService,
  ) { 

    this.cliente = new Cliente();
    this.datosForm = this.formBuilder.group({

      nombre: ['', Validators.required],
      documento_tipo :[''],  
      documento :[''],  
      fecha_nacimiento : [''],
      direccion : ['', Validators.required],
      telefono:['', Validators.required],   
      email:  ['', Validators.required],   
      descripcion :[''],       
      direccion_piso:[''],
      direccion_puerta:[''],
      foto:[''],
      latitud:[''],
      longitud:[''],
      createdAt:[''],
      vendedorId:['']
    });

    if(this.route.snapshot.params.id){
      this.updating = true;
      this.titulo = "Editar Cliente"
      

      this.clienteSubs = this.clientesService.get(this.route.snapshot.params.id).subscribe(data=>{
        
        this.cliente.asignarValores(data.payload.data());
        this.cliente.id = data.payload.id;
        
        this.croppedImagepath = this.cliente.foto;
        
        console.log(this.cliente); 
        
        this.datosForm.patchValue(this.cliente);          

        this.initMap("map3",{
          center:{
            lat:Number(this.cliente.latitud), 
            lng:Number(this.cliente.longitud)
          },
          zoom:15 ,
          options: {
            disableDefaultUI: true,
            scrollwheel: true,
            streetViewControl: false,
          },    
        });

        this.posicion = {lat: this.cliente.latitud, lng: this.cliente.longitud};

        var marker = new google.maps.Marker({
          posicion: this.posicion,
          map: this.map,
          title: 'Hello World!',
          draggable:true,
        });

      });
    }
    else{
      this.cliente = new Cliente();
    }
   

  }

  ngOnInit() {


    this.initMap("map3",{
      center:{
        lat:0, //Aca localizar por gps
        lng:0
      },
      zoom:5 ,
      options: {
        disableDefaultUI: true,
        scrollwheel: true,
        streetViewControl: false,
      },    
    });

    this.loadingService.presentLoading();
    setTimeout(() => {           
      this.initAutocomplete('pac-input');     
      this.loadingService.dismissLoading();
    }, 3000);  
    
    this.geocoder = new google.maps.Geocoder();

  }

  ionViewDidEnter(){
    
  }

  ionViewDidLeave(){
    if(this.updating)
      this.clienteSubs.unsubscribe();
  }

  
  get f() { return this.datosForm.controls; }

  
  imagenSeleccionadaIcono(newValue : any){
    console.log(newValue)
    this.datosForm.patchValue({
      foto: newValue
    });
   }
  

  guardar(){

    this.submitted = true;
    
  
    this.datosForm.patchValue({
      vendedorId: this.authService.getUID() 
    });

  
    if(this.posicion){
      this.datosForm.patchValue({
        latitud: this.posicion.lat      
      });
  
      this.datosForm.patchValue({
        longitud: this.posicion.lng     
      });
    }    

    this.cliente.asignarValores(this.datosForm.value);

    console.log(this.cliente);
    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    if(this.updating){
      this.clientesService.update(this.cliente);
    }
    else{
      this.clientesService.create(this.cliente);
    }   

    this.navCtrl.back();    

  }

  async verClientes(){
    const modal = await this.modalController.create({
      component: SelectClientePage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno.data.item);
      if(retorno.data)
        this.router.navigate(['details-cliente',{"id":retorno.data.item.id}]);
    });
    return await modal.present();
  }

  cancelar(){
    this.navCtrl.back();
  }

  elimiar(){
    this.presentAlertEliminar();
  }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar el cliente?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.clientesService.delete(this.route.snapshot.params.id);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }

  async abrirDireccion(){
    this.router.navigate(['form-direccion']);
  }

  initMap(el, options) {
    this.map = this.makeMap(el, options)

    var markerOptions = {
        draggable: true,
        map: this.map,
        posicion: options.center,
        zoom:5 ,
    }    
  }

  makeMap(el, options) {
    if(google){
      console.log(el);
      let mapEle: HTMLElement = document.getElementById(el);
      console.log(mapEle);
      return new google.maps.Map(mapEle, options)
    }
  }

  
  initAutocomplete(el = "autocomplete", options = { types: ["geocode"], componentRestrictions: { country: "ar" }}, fields = ["address_components", "geometry", "icon", "name"]) {
    // Create the autocomplete object, restricting the search predictions to geographical location types.
    this.autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(el).getElementsByTagName('input')[0], options
    )
    console.log(this.autocomplete);
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    // Set the data fields to return when the user selects a place.
    this.autocomplete.setFields(fields)

    if (this.map) {
        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        this.autocomplete.bindTo("bounds", this.map)
    }

    this.autocomplete.addListener("place_changed",()=>{
      console.log("place_changed");
      this.place = this.autocomplete.getPlace()
      console.log(this.place);

      this.posicion = {lat: this.place.geometry.location.lat(), lng: this.place.geometry.location.lng()};

      var marker = new google.maps.Marker({
        posicion: this.posicion,
        map: this.map,
        title: 'Hello World!',
        draggable:true,
      });

      var bounds = new google.maps.LatLngBounds();      
      bounds.extend(marker.getposicion());
      this.map.fitBounds(bounds);

      var zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.map, 'bounds_changed', function(event) {
        if ( this.getZoom() ){   // or set a minimum
            this.setZoom(16);  // set zoom here
        }
      });

      setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);
      this.fillInAddressForm(this.place.address_components);
    });

  }

  fillInAddressForm(addressComponents = this.place.address_components) {
  
    var pickedAddress =  {
      street_number: ["street_number", "short_name"],
      route: ["street_name", "long_name"],
      locality: ["locality", "long_name"],
      administrative_area_level_1: ["state", "short_name"],
      country: ["country", "long_name"],
      postal_code: ["zip", "short_name"],
      sublocality_level_1: ["sublocality", "long_name"],
    }

     


      console.log(pickedAddress.street_number[1]);

      var addressType

      

      console.log(addressComponents)

      // Get each component of the address from the place details,
      // and then fill-in the corresponding field on the form.
      var direccion_completa ="";
      for (var i = 0; i < addressComponents.length; i++) {
          addressType = addressComponents[i].types[0]

          if (pickedAddress[addressType]) {
              console.log(addressType)
              direccion_completa = direccion_completa +" "+  addressComponents[i][pickedAddress[addressType][1]]+","
             
          }
      }

      this.datosForm.patchValue({
        direccion: direccion_completa   
      });
      console.log(direccion_completa)

      setTimeout(function () {
        document.getElementById('pac-input').click();
      }, 2500);
      
      
  }


  makeMarker(options) {
    var marker = new google.maps.Marker(options)
    this.markers.push(marker)
    return marker
  }
}
