import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {


  constructor() {
    console.log('Hello ImagesProvider Provider');
  }


  handleImageSelection(archivo : any) : Observable<any>
   {
      let file:any= archivo;

      var _READER : any  =	new FileReader();
      _READER.readAsDataURL(file);
      return Observable.create((observer) =>
      {
         _READER.onloadend = () =>
         {
            observer.next(_READER.result);
            observer.complete();
         }
      });
      
   }

   isCorrectFileType(file)
   {
      return (/^(gif|jpg|jpeg|png)$/i).test(file);
   }

   
  getImageURL(data){
      let urlCreator = window.URL || window.webkitURL;
      let dataBlob = this.getBlob(data);
      let imageUrl = urlCreator.createObjectURL(dataBlob);

      return imageUrl;
   }

   getBlob (b64Data) {
      let contentType = '';
      let sliceSize = 512;

      b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

      let byteCharacters = atob(b64Data);
      let byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      } 

      let blob = new Blob(byteArrays, {type: "image/png"});
      return blob;
   }

   public blobToFile = (theBlob: Blob, fileName:string): File => {
      var b: any = theBlob;
      //A Blob() is almost a File() - it's just missing the two properties below which we will add
      b.lastModifiedDate = new Date();
      b.name = fileName;
  
      //Cast to a File() type
      return <File>theBlob;
  }
}