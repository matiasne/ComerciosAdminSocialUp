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
}