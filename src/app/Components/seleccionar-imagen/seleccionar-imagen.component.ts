import { Component, OnInit, Input, Output, EventEmitter,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Platform, ActionSheetController, ModalController } from '@ionic/angular';
import { ImagesService } from 'src/app/Services/images.service';
import { LoadingService } from 'src/app/Services/loading.service';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions} from '@ionic-native/Camera';
import { File } from '@ionic-native/file/ngx';
import { RecortarImagenPage } from 'src/app/recortar-imagen/recortar-imagen.page';


@Component({
  selector: 'app-seleccionar-imagen',
  templateUrl: './seleccionar-imagen.component.html',
  styleUrls: ['./seleccionar-imagen.component.scss'],
  
})
export class SeleccionarImagenComponent implements OnInit {

  @Input() public croppedImage ="";
  @Input() public showImageCroped = true;
  @Input() public aspectRatio ="";
  @Input() public resizeToWidth="";
  @Input() public resizeToHeight="";
  @Input() public height=0;
  @Output() onSelectValue = new EventEmitter<any>();

  public IsMobile = false;

  selectedFiles: FileList;
  _SUFFIX: any;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 5
  };

  public imageChangedEvent:any;


  constructor(
    private _IMAGES: ImagesService,
    private platform:Platform,
    private loadingService:LoadingService,
    private camera: Camera,
    private crop: Crop,
    private imagePicker: ImagePicker,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private file: File, 
  ) {

    if (this.platform.is('desktop')) {
      this.IsMobile = false;
    } else {
      this.IsMobile = true;
    } 

  }

  ngOnInit() {
    console.log(this.croppedImage)
  }


  seleccionarImagenWeb(event){
    this.selectFilesToUpload(event);
  }

  async recortarImagen(event){
    const modal = await this.modalController.create({
      component: RecortarImagenPage,
      componentProps: { 
        event: event,
        aspectRatio:this.aspectRatio,
        resizeToWidth:this.resizeToWidth,
        resizeToHeight:this.resizeToHeight 
      }     
    });
    modal.onDidDismiss()
    .then((retorno:any) => {
      this.croppedImage = retorno.data;
      this.onSelectValue.emit(this.croppedImage);
    });
    return await modal.present();
  }


  

  selectFilesToUpload(event) : void
  {    
    //this.imageChangedEvent = event;
    this.recortarImagen(event);
    //this.selectedFiles = event.target.files;  
    /*for (let i=0; i<this.selectedFiles.length; i++) {
      console.log(this.selectedFiles[i]);      
      this.cargarFotoWeb(this.selectedFiles[i]);
    } */ 
  }

  cargarFotoWeb(archivo){   

    
    this._IMAGES.handleImageSelection(archivo).subscribe((res) => {
    
      // Retrieve the file type from the base64 data URI string
      console.log(archivo);
      this._SUFFIX 			= res.split(':')[1].split('/')[1].split(";")[0];
      // Do we have correct file type?
      if(this._IMAGES.isCorrectFileType(this._SUFFIX)){ 
        console.log(this.calculateImageSize(res));
        
        if(this.calculateImageSize(res) < 500){
          this.croppedImage = res;          
        }
        else{
          alert("la imagen tiene un tamaño muy grande, no puede ser mayor a 500 Kbytes");
        }
        
        
        
      }      
      else {
        alert('Formato de Archivo Incorrecto');
      }
     
    },
    (error) => {
        console.dir(error);
        alert(error.message);
        this.loadingService.dismissLoading();
    });
  } 

  calculateImageSize(base64String){
    let padding, inBytes, base64StringLength;
    if(base64String.endsWith("==")) padding = 2;
    else if (base64String.endsWith("=")) padding = 1;
    else padding = 0;

    base64StringLength = base64String.length;
    console.log(base64StringLength)
    inBytes =(base64StringLength / 4 ) * 3 - padding;
    console.log(inBytes);
    var kbytes = inBytes / 1000;
    return kbytes;
  }

  
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Seleccionar de la Galería',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Sacar Foto',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  pickImage(sourceType) {


    if(sourceType == 0){
      this.imagePicker.getPictures(this.imagePickerOptions).then((results) => {
        for (var i = 0; i < results.length; i++) {
          console.log(results)
          this.showImage(results[0]);
        
        }
      }, (err) => {
        alert(err);
      });
    }

    if(sourceType == 1){
      const options: CameraOptions = {
        quality: 5,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }
      this.camera.getPicture(options).then((imageData) => {
       
        this.showImage(imageData);
       

      }, (err) => {
        // Handle error
      });
    }
    
  }

  

  showImage(ImagePath) {
    
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {     
      this.croppedImage = base64;   
      this.onSelectValue.emit(this.croppedImage);   
    }, error => {
      alert('Error in showing image' + error);
      
    });
  }


}
